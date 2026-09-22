import { prisma } from "../src/lib/prisma";
import { COMPANIES_REGISTRY } from "../src/lib/companies-registry-data";
import { NormalizationService } from "../src/services/normalization.service";
import { ConnectionStatus, SourceType, JobStatus } from "@prisma/client";

async function main() {
  console.log("==================================================");
  console.log("STARTING IDEMPOTENT COMPANY REGISTRY IMPORT");
  console.log("==================================================");

  // 1. Record baseline database counts
  const [totalJobsBefore, activeJobsBefore, expiredJobsBefore, targetCompaniesBefore] = await Promise.all([
    prisma.job.count(),
    prisma.job.count({ where: { status: JobStatus.ACTIVE } }),
    prisma.job.count({ where: { status: JobStatus.EXPIRED } }),
    prisma.targetCompany.count(),
  ]);

  console.log(`[Baseline] Total Jobs: ${totalJobsBefore} (Active: ${activeJobsBefore}, Expired: ${expiredJobsBefore})`);
  console.log(`[Baseline] Target Companies: ${targetCompaniesBefore}`);
  console.log(`[Authoritative Registry] Companies to process: ${COMPANIES_REGISTRY.length}`);

  let createdCompanies = 0;
  let updatedCompanies = 0;
  let createdAliases = 0;
  let createdConnections = 0;
  let potentialDuplicatesDetected = 0;

  // Track seen normalized names in current import run to detect duplicates
  const seenNormalizedNames = new Map<string, string>(); // normalizedName -> companyId

  for (const entry of COMPANIES_REGISTRY) {
    const normalized = NormalizationService.normalizeCompany(entry.name);

    if (seenNormalizedNames.has(normalized)) {
      potentialDuplicatesDetected++;
      console.warn(`[Potential Duplicate] "${entry.name}" conflicts with previously processed ${seenNormalizedNames.get(normalized)}`);
    } else {
      seenNormalizedNames.set(normalized, entry.companyId);
    }

    // Upsert master Company record by deterministic companyId
    const company = await prisma.company.upsert({
      where: { companyId: entry.companyId },
      update: {
        name: entry.name,
        slug: entry.slug,
        normalizedName: normalized,
        careerUrl: entry.careerUrl,
        officialWebsite: entry.officialWebsite,
        industry: entry.industry,
        country: entry.country,
        primaryLocations: entry.primaryLocations,
        updatedAt: new Date(),
      },
      create: {
        companyId: entry.companyId,
        slug: entry.slug,
        name: entry.name,
        normalizedName: normalized,
        careerUrl: entry.careerUrl,
        officialWebsite: entry.officialWebsite,
        industry: entry.industry,
        country: entry.country,
        primaryLocations: entry.primaryLocations,
        active: true,
      },
    });

    if (company.createdAt.getTime() === company.updatedAt.getTime()) {
      createdCompanies++;
    } else {
      updatedCompanies++;
    }

    // Upsert canonical aliases for this company
    const aliases = Array.from(new Set<string>([entry.name, ...(entry.aliases || [])]));
    for (const alias of aliases) {
      const normAlias = NormalizationService.normalizeCompany(alias);
      if (!normAlias) continue;

      try {
        await prisma.companyAlias.upsert({
          where: {
            companyId_normalizedAlias: {
              companyId: company.id,
              normalizedAlias: normAlias,
            },
          },
          update: { alias },
          create: {
            companyId: company.id,
            alias,
            normalizedAlias: normAlias,
            isPotentialDuplicate: false,
          },
        });
        createdAliases++;
      } catch {
        // Unique constraint or duplicate handled
      }
    }

    // Connect verified ATS if configured
    if (entry.verifiedAts) {
      const existingConn = await prisma.companyConnection.findFirst({
        where: {
          companyId: company.id,
          atsType: entry.verifiedAts.atsType,
        },
      });

      if (!existingConn) {
        await prisma.companyConnection.create({
          data: {
            companyId: company.id,
            atsType: entry.verifiedAts.atsType,
            boardToken: entry.verifiedAts.boardToken,
            apiUrl: entry.verifiedAts.apiUrl || null,
            status: ConnectionStatus.CONNECTED,
          },
        });
        createdConnections++;
      }
    }
  }

  console.log(`[Company Registry] Upserted ${COMPANIES_REGISTRY.length} companies (New: ${createdCompanies}, Existing: ${updatedCompanies})`);
  console.log(`[Aliases] Processed ${createdAliases} alias records`);
  console.log(`[Connections] Configured ${createdConnections} verified ATS connections`);

  // 2. Map existing TargetCompany records to Company
  console.log("\n[Mapping] Linking existing TargetCompany records...");
  const allCompanies = await prisma.company.findMany({
    include: { aliases: true },
  });

  const companyMapByNorm = new Map<string, string>();
  for (const c of allCompanies) {
    companyMapByNorm.set(c.normalizedName, c.id);
    for (const a of c.aliases) {
      companyMapByNorm.set(a.normalizedAlias, c.id);
    }
  }

  const existingTargetCompanies = await prisma.targetCompany.findMany();
  let targetCompaniesMapped = 0;

  for (const tc of existingTargetCompanies) {
    const norm = NormalizationService.normalizeCompany(tc.name);
    let matchedCompanyId = companyMapByNorm.get(norm);

    if (!matchedCompanyId && tc.aliases?.length) {
      for (const al of tc.aliases) {
        const normAl = NormalizationService.normalizeCompany(al);
        if (companyMapByNorm.has(normAl)) {
          matchedCompanyId = companyMapByNorm.get(normAl);
          break;
        }
      }
    }

    if (matchedCompanyId) {
      await prisma.targetCompany.update({
        where: { id: tc.id },
        data: { companyRefId: matchedCompanyId },
      });
      targetCompaniesMapped++;
    }
  }
  console.log(`[Target Companies] Mapped ${targetCompaniesMapped}/${existingTargetCompanies.length} TargetCompany records to Company registry`);

  // 3. Map existing Jobs to Company registry
  console.log("\n[Mapping] Linking existing Job records to Company entities...");
  const unlinkedJobs = await prisma.job.findMany({
    where: { companyRefId: null },
    select: { id: true, company: true, normalizedCompany: true },
  });

  let jobsMapped = 0;
  const BATCH_SIZE = 250;

  for (let i = 0; i < unlinkedJobs.length; i += BATCH_SIZE) {
    const batch = unlinkedJobs.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (job) => {
        let compId = companyMapByNorm.get(job.normalizedCompany);
        if (!compId) {
          const directNorm = NormalizationService.normalizeCompany(job.company);
          compId = companyMapByNorm.get(directNorm);
        }

        if (compId) {
          await prisma.job.update({
            where: { id: job.id },
            data: { companyRefId: compId },
          });
          jobsMapped++;
        }
      })
    );
  }

  console.log(`[Job Mapping] Successfully linked ${jobsMapped} existing jobs to Company registry`);

  // 4. Update CompanyConnection job counts from real database records
  console.log("\n[Metrics] Updating company connection job counts from PostgreSQL...");
  const allConnections = await prisma.companyConnection.findMany();
  for (const conn of allConnections) {
    const activeCount = await prisma.job.count({
      where: {
        companyRefId: conn.companyId,
        status: JobStatus.ACTIVE,
      },
    });
    await prisma.companyConnection.update({
      where: { id: conn.id },
      data: { jobCount: activeCount },
    });
  }

  // 5. Post-Import Verification & Job Inventory Integrity Check
  const [totalJobsAfter, activeJobsAfter, expiredJobsAfter, targetCompaniesAfter, totalCompaniesInDb] = await Promise.all([
    prisma.job.count(),
    prisma.job.count({ where: { status: JobStatus.ACTIVE } }),
    prisma.job.count({ where: { status: JobStatus.EXPIRED } }),
    prisma.targetCompany.count(),
    prisma.company.count(),
  ]);

  console.log("\n==================================================");
  console.log("POST-IMPORT INTEGRITY AUDIT");
  console.log("==================================================");
  console.log(`Total Companies in DB: ${totalCompaniesInDb} (Expected: 183)`);
  console.log(`Total Jobs: Before=${totalJobsBefore}, After=${totalJobsAfter}`);
  console.log(`Active Jobs: Before=${activeJobsBefore}, After=${activeJobsAfter}`);
  console.log(`Expired Jobs: Before=${expiredJobsBefore}, After=${expiredJobsAfter}`);
  console.log(`Target Companies: Before=${targetCompaniesBefore}, After=${targetCompaniesAfter}`);

  if (totalJobsBefore !== totalJobsAfter) {
    throw new Error(`CRITICAL INVENTORY MISMATCH: Jobs changed from ${totalJobsBefore} to ${totalJobsAfter}`);
  }

  console.log("\n✅ IDEMPOTENT IMPORT COMPLETED WITH 100% INVENTORY INTEGRITY PRESERVED!");
}

main()
  .catch((err) => {
    console.error("Import failed with error:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
