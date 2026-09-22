import { SourceType, WorkMode, EmploymentType } from "@prisma/client";

export interface RawJob {
  externalId?: string;
  title: string;
  company: string;
  description: string;
  applyUrl: string;
  location?: string;
  workMode?: WorkMode;
  employmentType?: EmploymentType;
  rawSalary?: string;
  minSalary?: number | null;
  maxSalary?: number | null;
  currency?: string;
  experienceMin?: number;
  experienceMax?: number;
  deadline?: Date | string;
  postedAt?: Date | string;
  rawPayload?: any;
}

export interface NormalizedJob {
  externalId?: string;
  title: string;
  company: string;
  normalizedCompany: string;
  description: string;
  applyUrl: string;
  location: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  minSalary?: number | null;
  maxSalary?: number | null;
  currency: string;
  salaryDisclosed: boolean;
  salaryRaw?: string | null;
  experienceMin?: number | null;
  experienceMax?: number | null;
  deadline?: Date | null;
  postedAt?: Date | null;
  extractedSkills: string[];
  contentHash: string;
  rawData?: string;
}

export interface SourceConfig {
  id?: string;
  name: string;
  type: SourceType;
  baseUrl?: string | null;
  apiUrl?: string | null;
  boardToken?: string | null;
  targetCompanyId?: string | null;
  extraConfig?: Record<string, any>;
}

export interface SourceAdapter {
  sourceType: SourceType;
  validateConfig(config: SourceConfig): boolean;
  fetchJobs(config: SourceConfig): Promise<RawJob[]>;
  normalizeJob(raw: RawJob): NormalizedJob;
}
