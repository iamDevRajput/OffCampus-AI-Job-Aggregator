import { PlatformConfig, SearchFilters, PlatformSearchResultItem } from "../types";

export interface PlatformSearchAdapter {
  config: PlatformConfig;
  buildSearchUrl(filters: SearchFilters): string;
  fetchLiveResults?(filters: SearchFilters): Promise<PlatformSearchResultItem[]>;
}
