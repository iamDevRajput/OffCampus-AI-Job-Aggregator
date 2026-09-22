import { prisma } from "@/lib/prisma";
import { SourceType, AlertType, WorkMode, EmploymentType } from "@prisma/client";
import { SourceAdapter, NormalizedJob, SourceConfig } from "./adapters/base.adapter";
import { MockSourceAdapter } from "./adapters/mock.adapter";
import { GreenhouseSourceAdapter } from "./adapters/greenhouse.adapter";
import { LeverSourceAdapter } from "./adapters/lever.adapter";
import { AshbySourceAdapter } from "./adapters/ashby.adapter";
import { SmartRecruitersSourceAdapter } from "./adapters/smartrecruiters.adapter";
import { DeduplicationService } from "./deduplication.service";
import { MatchingService } from "./matching.service";
import { AlertService } from "./alert.service";
import { NormalizationService } from "./normalization.service";

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

export class IngestionService {
  private static adapters: Map<SourceType, SourceAdapter> = new Map([
    [SourceType.MOCK, new MockSourceAdapter()],
    [SourceType.GREENHOUSE, new GreenhouseSourceAdapter()],
    [SourceType.LEVER, new LeverSourceAdapter()],
    [SourceType.ASHBY, new AshbySourceAdapter()],
    [SourceType.SMART_RECRUITERS, new SmartRecruitersSourceAdapter()],
  ]);

  /**
   * Run ingestion across all active sources, active target companies, or a single target source
   */
  static async runIngestion(targetSourceId?: string): Promise<IngestionSummary[]> {
    const startTime = Date.now();

    // 1. Fetch sources to run
    let sourcesToRun: SourceConfig[] = [];

    if (targetSourceId) {
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
      // Load all active registered sources
      const sources = await prisma.jobSource.findMany({
        where: { isActive: true },
      });

      for (const s of sources) {
        sourcesToRun.push({
          id: s.id,
          name: s.name,
          type: s.type,
          baseUrl: s.baseUrl,
          apiUrl: s.apiUrl,
          boardToken: s.boardToken,
        });
      }

      // Also dynamically check active Target Companies with configured public ATS adapters
      const targetCompanies = await prisma.targetCompany.findMany({
        where: {
          isActive: true,
          sourceType: {
            in: [SourceType.GREENHOUSE, SourceType.LEVER, SourceType.ASHBY, SourceType.SMART_RECRUITERS],
          },
        },
      });

      for (const tc of targetCompanies) {
        // Only add if not already in sourcesToRun
        const exists = sourcesToRun.some(
          (s) => s.boardToken === tc.boardToken || s.name.toLowerCase() === tc.name.toLowerCase()
        );
        if (!exists) {
          sourcesToRun.push({
            name: tc.name,
            type: tc.sourceType,
            apiUrl: tc.careerPageUrl,
            boardToken: tc.boardToken || tc.name.toLowerCase().replace(/[^\w]/g, ""),
            targetCompanyId: tc.id,
          });
        }
      }
    }

    // If no sources exist at all, initialize default mock source
    if (sourcesToRun.length === 0) {
      const defaultMock = await prisma.jobSource.create({
        data: {
          name: "Off-Campus Verified Tech Feed",
          type: SourceType.MOCK,
          isActive: true,
          fetchFrequencyMinutes: 30,
        },
      });
      sourcesToRun = [
        {
          id: defaultMock.id,
          name: defaultMock.name,
          type: defaultMock.type,
        },
      ];
    }

    const summaries: IngestionSummary[] = [];

    // Preload all target companies, skills, and active users for fast memory lookup
    const [allTargetCompanies, allSkills, allUsers] = await Promise.all([
      prisma.targetCompany.findMany({ where: { isActive: true } }),
      prisma.skill.findMany(),
      prisma.user.findMany({ select: { id: true } }),
    ]);

    const skillMap = new Map<string, string>();
    for (const sk of allSkills) {
      skillMap.set(sk.normalizedName, sk.id);
    }

    // Process each source
    for (const sourceConfig of sourcesToRun) {
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

        for (const raw of rawJobs) {
          try {
            const normalized: NormalizedJob = adapter.normalizeJob(raw);

            // 1. Look up existing job by externalId, applyUrl, or contentHash
            const existingJob = await prisma.job.findFirst({
              where: {
                OR: [
                  { contentHash: normalized.contentHash },
                  { applyUrl: normalized.applyUrl },
                  ...(normalized.externalId ? [{ externalId: normalized.externalId }] : []),
                ],
              },
            });

            // Check if this job matches any target company in the user's watchlist
            const normCompany = normalized.normalizedCompany;
            const matchedTargetCompany = allTargetCompanies.find((tc) => {
              const tcNorm = NormalizationService.normalizeCompany(tc.name);
              if (tcNorm === normCompany) return true;
              return tc.aliases.some((a) => NormalizationService.normalizeCompany(a) === normCompany);
            });

            let savedJobId: string;
            let isNew = false;

            if (existingJob) {
              // Update existing record with fresh description/salary/deadline if changed
              savedJobId = existingJob.id;
              await prisma.job.update({
                where: { id: existingJob.id },
                data: {
                  description: normalized.description,
                  location: normalized.location,
                  minSalary: normalized.minSalary ?? existingJob.minSalary,
                  maxSalary: normalized.maxSalary ?? existingJob.maxSalary,
                  salaryRaw: normalized.salaryRaw ?? existingJob.salaryRaw,
                  salaryDisclosed: normalized.salaryDisclosed || existingJob.salaryDisclosed,
                  deadline: normalized.deadline ?? existingJob.deadline,
                  isPriorityCompany: !!matchedTargetCompany || existingJob.isPriorityCompany,
                  targetCompanyId: matchedTargetCompany?.id || existingJob.targetCompanyId,
                  status: "ACTIVE",
                },
              });
              summary.updatedCount++;
            } else {
              // Create new Job
              const createdJob = await prisma.job.create({
                data: {
                  sourceId: sourceConfig.id || null,
                  targetCompanyId: matchedTargetCompany?.id || sourceConfig.targetCompanyId || null,
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
                  rawData: normalized.rawData,
                },
              });
              savedJobId = createdJob.id;
              isNew = true;
              summary.newJobsCount++;
            }

            // Associate extracted skills
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
                // Ignore collision
              }
            }

            // Recalculate matches & trigger alerts for users if new or priority
            for (const user of allUsers) {
              const matchResult = await MatchingService.calculateMatch(user.id, savedJobId);

              if (isNew) {
                if (matchedTargetCompany || sourceConfig.targetCompanyId) {
                  await AlertService.queueAlert(user.id, savedJobId, AlertType.PRIORITY_COMPANY);
                } else if (matchResult.score >= 80) {
                  await AlertService.queueAlert(user.id, savedJobId, AlertType.HIGH_MATCH);
                }
              }
            }
          } catch (jobErr: any) {
            console.error(`Error processing job for source ${sourceConfig.name}:`, jobErr);
            summary.errors.push(`Job processing error: ${jobErr.message || jobErr}`);
          }
        }

        summary.durationMs = Date.now() - sourceStart;

        // Persist IngestionRun history record
        await prisma.ingestionRun.create({
          data: {
            sourceId: sourceConfig.id || null,
            sourceName: sourceConfig.name,
            sourceType: sourceConfig.type,
            status: summary.errors.length === 0 ? "SUCCESS" : summary.newJobsCount > 0 ? "PARTIAL" : "FAILED",
            jobsFetched: summary.fetchedCount,
            jobsCreated: summary.newJobsCount,
            jobsUpdated: summary.updatedCount,
            duplicateCount: summary.duplicateCount,
            errors: summary.errors,
            durationMs: summary.durationMs,
          },
        });

        // Update JobSource health if registered
        if (sourceConfig.id) {
          await prisma.jobSource.update({
            where: { id: sourceConfig.id },
            data: {
              lastFetchedAt: new Date(),
              lastError: summary.errors.length > 0 ? summary.errors.slice(0, 3).join("; ") : null,
            },
          });
        }
      } catch (sourceErr: any) {
        console.error(`Error fetching source ${sourceConfig.name}:`, sourceErr.message || sourceErr);
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

      summaries.push(summary);
    }

    return summaries;
  }
}
