export type PlatformId =
  | "linkedin"
  | "naukri"
  | "indeed"
  | "unstop"
  | "cutshort"
  | "hirist"
  | "wellfound"
  | "instahyre"
  | "foundit"
  | "github";

export type PlatformMode =
  | "LIVE_INTEGRATION"
  | "PUBLIC_FEED"
  | "EXTERNAL_SEARCH"
  | "MANUAL_ONLY";

export type ExperienceFilter =
  | "FRESHER"
  | "ZERO_TO_ONE"
  | "ZERO_TO_TWO"
  | "ONE_TO_TWO"
  | "ANY";

export type WorkModeFilter = "ALL" | "REMOTE" | "HYBRID" | "ONSITE";

export interface SearchFilters {
  query: string;
  location: string;
  experience: ExperienceFilter;
  workMode: WorkModeFilter;
}

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  tagline: string;
  logoColor: string;
  badgeColor: string;
  mode: PlatformMode;
  defaultQueries: string[];
  supportedLocations: string[];
  homepageUrl: string;
  features: string[];
}

export interface PlatformSearchResultItem {
  id: string;
  platform: PlatformId;
  platformName: string;
  title: string;
  company: string;
  location: string;
  workMode?: string;
  experience?: string;
  salary?: string;
  postedAt?: string;
  url: string;
  description?: string;
  tags?: string[];
  isLive: boolean;
}

export interface PlatformSearchSummary {
  platformId: PlatformId;
  platformName: string;
  mode: PlatformMode;
  searchUrl: string;
  liveSupported: boolean;
  itemCount: number;
  status: "SUCCESS" | "FALLBACK_EXTERNAL" | "FAILED";
  lastChecked: string;
  error?: string;
  results?: PlatformSearchResultItem[];
}
