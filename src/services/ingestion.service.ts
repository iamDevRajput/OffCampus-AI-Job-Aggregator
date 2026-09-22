import { prisma } from "@/lib/prisma";
import { SourceType, AlertType, WorkMode, EmploymentType, JobStatus } from "@prisma/client";
import { SourceAdapter, NormalizedJob, SourceConfig, RawJob } from "./adapters/base.adapter";
import { MockSourceAdapter } from "./adapters/mock.adapter";
import { GreenhouseSourceAdapter } from "./adapters/greenhouse.adapter";
import { LeverSourceAdapter } from "./adapters/lever.adapter";
import { AshbySourceAdapter } from "./adapters/ashby.adapter";
import { SmartRecruitersSourceAdapter } from "./adapters/smartrecruiters.adapter";
import { RecruiteeSourceAdapter } from "./adapters/recruitee.adapter";
import { WorkableSourceAdapter } from "./adapters/workable.adapter";
import { PublicFeedSourceAdapter } from "./adapters/publicFeed.adapter";
import { DeduplicationService } from "./deduplication.service";
import { MatchingService } from "./matching.service";
import { AlertService } from "./alert.service";
import { NormalizationService } from "./normalization.service";
import { ATS_PRESETS, PUBLIC_FEED_SOURCES } from "@/lib/ats-registry";

export interface IngestionSummary {
  sourceId?: string;
  sourceName: string;
  sourceType: SourceType;
  fetchedCount: number;
  newJobsCount: number;
  updatedCount: number;
  duplicateCount: number;
  errors: string[];
  durationMs: number;
}

export interface IngestionOptions {
  targetSourceId?: string;
  customSource?: SourceConfig;
  includePresets?: boolean;
  includeMock?: boolean;
  maxSources?: number;
}

export class IngestionService {
  private static adapters: Map<SourceType, SourceAdapter> = new Map([
    [SourceType.MOCK, new MockSourceAdapter()],
    [SourceType.GREENHOUSE, new GreenhouseSourceAdapter()],
    [SourceType.LEVER, new LeverSourceAdapter()],
    [SourceType.ASHBY, new AshbySourceAdapter()],
    [SourceType.SMART_RECRUITERS, new SmartRecruitersSourceAdapter()],
    [SourceType.RECRUITEE, new RecruiteeSourceAdapter()],
    [SourceType.WORKABLE, new WorkableSourceAdapter()],
    [SourceType.PUBLIC_FEED, new PublicFeedSourceAdapter()],
  ]);

  /**
   * Run ingestion across active sources, target companies, or specific source
   */
  static async runIngestion(options: IngestionOptions = {}): Promise<IngestionSummary[]> {
    const startTime = Date.now();
    const { targetSourceId, includePresets = true, includeMock = false, maxSources } = options;

    // 1. Gather candidate sources to run
    let sourcesToRun: SourceConfig[] = [];

    if (options.customSource) {
      sourcesToRun.push(options.customSource);
    } else if (targetSourceId) {
      const source = await prisma.jobSource.findUnique({
        where: { id: targetSourceId },
      });
      if (source) {
        sourcesToRun.push({
          id: source.id,
          name: source.name,
          type: source.type,
          baseUrl: source.baseUrl,
          apiUrl: source.apiUrl,
          boardToken: source.boardToken,
        });
      }
    } else {
      // 1. Load registered active JobSources from database
      const dbSources = await prisma.jobSource.findMany({
        where: {
          isActive: true,
          ...(includeMock ? {} : { type: { not: SourceType.MOCK } }),
        },
      });

      for (const s of dbSources) {
        sourcesToRun.push({
          id: s.id,
          name: s.name,
          type: s.type,
          baseUrl: s.baseUrl,
          apiUrl: s.apiUrl,
          boardToken: s.boardToken,
        });
      }

      // 2. Load active Target Companies configured with public ATS adapters
      const targetCompanies = await prisma.targetCompany.findMany({
        where: {
          isActive: true,
          sourceType: {
            in: [
              SourceType.GREENHOUSE,
              SourceType.LEVER,
              SourceType.ASHBY,
              SourceType.SMART_RECRUITERS,
              SourceType.RECRUITEE,
              SourceType.WORKABLE,
            ],
          },
        },
      });

      for (const tc of targetCompanies) {
        const exists = sourcesToRun.some(
          (s) =>
            (tc.boardToken && s.boardToken?.toLowerCase() === tc.boardToken.toLowerCase()) ||
            s.name.toLowerCase() === tc.name.toLowerCase()
        );
        if (!exists) {
          sourcesToRun.push({
            name: tc.name,
            type: tc.sourceType,
            apiUrl: tc.careerPageUrl?.includes("api.") || tc.careerPageUrl?.includes("/api/") ? tc.careerPageUrl : undefined,
            boardToken: tc.boardToken || tc.name.toLowerCase().replace(/[^\w]/g, ""),
            targetCompanyId: tc.id,
          });
        }
      }

      // 3. If includePresets is true, incorporate top ATS Presets & Public Developer Feeds
      if (includePresets) {
        for (const feed of PUBLIC_FEED_SOURCES) {
          const exists = sourcesToRun.some(
            (s) => s.type === SourceType.PUBLIC_FEED && s.boardToken === feed.boardToken
          );
          if (!exists) {
            sourcesToRun.push({
              name: feed.name,
              type: feed.type,
              baseUrl: feed.baseUrl,
              apiUrl: feed.apiUrl,
              boardToken: feed.boardToken,
            });
          }
        }

        for (const preset of ATS_PRESETS) {
          const exists = sourcesToRun.some(
            (s) =>
              s.type === preset.sourceType &&
              (s.boardToken?.toLowerCase() === preset.boardToken.toLowerCase() ||
                s.name.toLowerCase() === preset.name.toLowerCase())
          );
          if (!exists) {
            sourcesToRun.push({
              name: preset.name,
              type: preset.sourceType,
              apiUrl: undefined,
              boardToken: preset.boardToken,
            });
          }
        }
      }
    }

    if (maxSources && maxSources > 0) {
      sourcesToRun = sourcesToRun.slice(0, maxSources);
    }

    // Preload all target companies, companies registry, skills, and active users for fast in-memory indexing
    const [allTargetCompanies, allCompanies, allSkills, allUsers] = await Promise.all([
      prisma.targetCompany.findMany({ where: { isActive: true } }),
      prisma.company.findMany({
        select: {
          id: true,
          normalizedName: true,
          aliases: { select: { normalizedAlias: true } },
        },
      }),
      prisma.skill.findMany(),
      prisma.user.findMany({ select: { id: true } }),
    ]);

    const skillMap = new Map<string, string>();
    for (const sk of allSkills) {
      skillMap.set(sk.normalizedName, sk.id);
    }

    const summaries: IngestionSummary[] = [];
    const CONCURRENCY_LIMIT = 3;

    // Process sources in controlled chunks with polite delay
    for (let i = 0; i < sourcesToRun.length; i += CONCURRENCY_LIMIT) {
      const chunk = sourcesToRun.slice(i, i + CONCURRENCY_LIMIT);

      const chunkResults = await Promise.all(
        chunk.map((sourceConfig) =>
          this.processSingleSource(sourceConfig, allTargetCompanies, allCompanies, skillMap, allUsers)
        )
      );

      summaries.push(...chunkResults);

      // Polite delay between batches
      if (i + CONCURRENCY_LIMIT < sourcesToRun.length) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    return summaries;
  }

  /**
   * Ingest and normalize a single source
   */
  private static async processSingleSource(
    sourceConfig: SourceConfig,
    allTargetCompanies: any[],
    allCompanies: any[],
    skillMap: Map<string, string>,
    allUsers: { id: string }[]
  ): Promise<IngestionSummary> {
    const sourceStart = Date.now();
    const summary: IngestionSummary = {
      sourceId: sourceConfig.id,
      sourceName: sourceConfig.name,
      sourceType: sourceConfig.type,
      fetchedCount: 0,
      newJobsCount: 0,
      updatedCount: 0,
      duplicateCount: 0,
      errors: [],
      durationMs: 0,
    };

    const adapter = this.adapters.get(sourceConfig.type) || this.adapters.get(SourceType.MOCK)!;

    try {
      const rawJobs = await adapter.fetchJobs(sourceConfig);
      summary.fetchedCount = rawJobs.length;

      const seenJobIdsInCurrentFetch = new Set<string>();

      for (const raw of rawJobs) {
        try {
          const normalized: NormalizedJob = adapter.normalizeJob(raw);

          // Find existing job via multi-criteria deduplication
          const existingJob: any = await DeduplicationService.findExistingJob(prisma, normalized);

          // Check target company watchlist
          const normCompany = normalized.normalizedCompany;
          const matchedTargetCompany = allTargetCompanies.find((tc) => {
            const tcNorm = NormalizationService.normalizeCompany(tc.name);
            if (tcNorm === normCompany) return true;
            return (tc.aliases || []).some((a: string) => NormalizationService.normalizeCompany(a) === normCompany);
          });

          // Check Company registry mapping
          const matchedCompany = allCompanies.find((c) => {
            if (c.normalizedName === normCompany) return true;
            return (c.aliases || []).some((a: any) => a.normalizedAlias === normCompany);
          });
          const resolvedCompanyRefId = sourceConfig.companyRefId || matchedCompany?.id || null;

          let savedJobId: string;
          let isNew = false;

          if (existingJob) {
            savedJobId = existingJob.id;
            seenJobIdsInCurrentFetch.add(savedJobId);

            // Update existing record
            await prisma.job.update({
              where: { id: existingJob.id },
              data: {
                description: normalized.description || existingJob.description,
                location: normalized.location || existingJob.location,
                minSalary: normalized.minSalary ?? existingJob.minSalary,
                maxSalary: normalized.maxSalary ?? existingJob.maxSalary,
                salaryRaw: normalized.salaryRaw ?? existingJob.salaryRaw,
                salaryDisclosed: normalized.salaryDisclosed || existingJob.salaryDisclosed,
                deadline: normalized.deadline ?? existingJob.deadline,
                isPriorityCompany: !!matchedTargetCompany || existingJob.isPriorityCompany,
                targetCompanyId: matchedTargetCompany?.id || existingJob.targetCompanyId,
                companyRefId: resolvedCompanyRefId || existingJob.companyRefId,
                status: JobStatus.ACTIVE,
                updatedAt: new Date(),
              },
            });
            summary.updatedCount++;
          } else {
            // Insert new Job record
            const createdJob = await prisma.job.create({
              data: {
                sourceId: sourceConfig.id || null,
                targetCompanyId: matchedTargetCompany?.id || sourceConfig.targetCompanyId || null,
                companyRefId: resolvedCompanyRefId,
                externalId: normalized.externalId,
                title: normalized.title,
                company: normalized.company,
                normalizedCompany: normalized.normalizedCompany,
                description: normalized.description,
                applyUrl: normalized.applyUrl,
                location: normalized.location,
                workMode: normalized.workMode,
                employmentType: normalized.employmentType,
                minSalary: normalized.minSalary,
                maxSalary: normalized.maxSalary,
                currency: normalized.currency,
                salaryDisclosed: normalized.salaryDisclosed,
                salaryRaw: normalized.salaryRaw,
                experienceMin: normalized.experienceMin ?? 0,
                experienceMax: normalized.experienceMax ?? 1,
                deadline: normalized.deadline,
                postedAt: normalized.postedAt || new Date(),
                contentHash: normalized.contentHash,
                isPriorityCompany: !!matchedTargetCompany || !!sourceConfig.targetCompanyId,
                status: JobStatus.ACTIVE,
                rawData: normalized.rawData,
              },
            });
            savedJobId = createdJob.id;
            seenJobIdsInCurrentFetch.add(savedJobId);
            isNew = true;
            summary.newJobsCount++;
          }

          // Link recognized skills
          for (const skillName of normalized.extractedSkills) {
            const normKey = skillName.toLowerCase().replace(/[^\w]/g, "");
            let skillId = skillMap.get(normKey);
            if (!skillId) {
              const skillRecord = await prisma.skill.upsert({
                where: { normalizedName: normKey },
                update: {},
                create: {
                  name: skillName,
                  category: "Core CS",
                  normalizedName: normKey,
                },
              });
              skillId = skillRecord.id;
              skillMap.set(normKey, skillId);
            }

            try {
              await prisma.jobSkill.upsert({
                where: {
                  jobId_skillId: {
                    jobId: savedJobId,
                    skillId,
                  },
                },
                update: {},
                create: {
                  jobId: savedJobId,
                  skillId,
                  confidence: 1.0,
                },
              });
            } catch {
              // Ignore unique collision
            }
          }

          // Calculate match scores & alert users for priority openings or score >= 80
          if (isNew && allUsers.length > 0) {
            for (const user of allUsers) {
              const matchResult = await MatchingService.calculateMatch(user.id, savedJobId);

              if (matchedTargetCompany || sourceConfig.targetCompanyId) {
                await AlertService.queueAlert(user.id, savedJobId, AlertType.PRIORITY_COMPANY);
              } else if (matchResult.score >= 80) {
                await AlertService.queueAlert(user.id, savedJobId, AlertType.HIGH_MATCH);
              }
            }
          }
        } catch (jobErr: any) {
          summary.errors.push(`Job processing error: ${jobErr.message || jobErr}`);
        }
      }

      // Stale job management: If a complete company board was fetched, mark missing jobs as EXPIRED
      if (
        sourceConfig.type !== SourceType.PUBLIC_FEED &&
        sourceConfig.type !== SourceType.MOCK &&
        seenJobIdsInCurrentFetch.size > 0
      ) {
        const normComp = NormalizationService.normalizeCompany(sourceConfig.name);
        if (normComp) {
          const staleJobs = await prisma.job.findMany({
            where: {
              normalizedCompany: normComp,
              status: JobStatus.ACTIVE,
              id: { notIn: Array.from(seenJobIdsInCurrentFetch) },
            },
            select: { id: true },
          });

          if (staleJobs.length > 0) {
            await prisma.job.updateMany({
              where: { id: { in: staleJobs.map((j) => j.id) } },
              data: { status: JobStatus.EXPIRED },
            });
          }
        }
      }

      summary.durationMs = Date.now() - sourceStart;

      // Persist IngestionRun history record
      await prisma.ingestionRun.create({
        data: {
          sourceId: sourceConfig.id || null,
          sourceName: sourceConfig.name,
          sourceType: sourceConfig.type,
          status:
            summary.errors.length === 0
              ? "SUCCESS"
              : summary.newJobsCount > 0 || summary.updatedCount > 0
              ? "PARTIAL"
              : "FAILED",
          jobsFetched: summary.fetchedCount,
          jobsCreated: summary.newJobsCount,
          jobsUpdated: summary.updatedCount,
          duplicateCount: summary.duplicateCount,
          errors: summary.errors.slice(0, 10),
          durationMs: summary.durationMs,
        },
      });

      // Update JobSource health if registered
      if (sourceConfig.id) {
        await prisma.jobSource.update({
          where: { id: sourceConfig.id },
          data: {
            lastFetchedAt: new Date(),
            lastError: summary.errors.length > 0 ? summary.errors.slice(0, 2).join("; ") : null,
          },
        });
      }
    } catch (sourceErr: any) {
      console.error(`[IngestionService] Source "${sourceConfig.name}" failed:`, sourceErr.message || sourceErr);
      summary.errors.push(`Source fetch failed: ${sourceErr.message || sourceErr}`);
      summary.durationMs = Date.now() - sourceStart;

      await prisma.ingestionRun.create({
        data: {
          sourceId: sourceConfig.id || null,
          sourceName: sourceConfig.name,
          sourceType: sourceConfig.type,
          status: "FAILED",
          jobsFetched: 0,
          jobsCreated: 0,
          jobsUpdated: 0,
          duplicateCount: 0,
          errors: [sourceErr.message || String(sourceErr)],
          durationMs: summary.durationMs,
        },
      });

      if (sourceConfig.id) {
        await prisma.jobSource.update({
          where: { id: sourceConfig.id },
          data: {
            lastFetchedAt: new Date(),
            lastError: sourceErr.message || String(sourceErr),
          },
        });
      }
    }

    return summary;
  }
}
