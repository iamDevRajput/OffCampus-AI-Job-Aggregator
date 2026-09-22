import { PlatformRegistry } from "./platform.registry";
import { SearchFilters, PlatformSearchSummary, PlatformSearchResultItem } from "./types";

export class PlatformSearchService {
  /**
   * Generates search metadata and triggers live searches for supported platforms
   */
  static async searchAllPlatforms(filters: SearchFilters): Promise<{
    summaries: PlatformSearchSummary[];
    liveResults: PlatformSearchResultItem[];
    totalLiveCount: number;
    timestamp: string;
  }> {
    const timestamp = new Date().toISOString();
    const adapters = PlatformRegistry.getAllAdapters();
    const liveResults: PlatformSearchResultItem[] = [];

    // Execute live platforms concurrently with timeout and error resilience
    const summaries: PlatformSearchSummary[] = await Promise.all(
      adapters.map(async (adapter) => {
        const searchUrl = adapter.buildSearchUrl(filters);
        const isLive = adapter.config.mode === "LIVE_INTEGRATION" || adapter.config.mode === "PUBLIC_FEED";

        if (isLive && adapter.fetchLiveResults) {
          try {
            const results = await adapter.fetchLiveResults(filters);
            liveResults.push(...results);

            return {
              platformId: adapter.config.id,
              platformName: adapter.config.name,
              mode: adapter.config.mode,
              searchUrl,
              liveSupported: true,
              itemCount: results.length,
              status: "SUCCESS" as const,
              lastChecked: timestamp,
              results,
            };
          } catch (err: any) {
            console.error(`[PlatformSearchService] Live search failed for ${adapter.config.name}:`, err.message || err);
            return {
              platformId: adapter.config.id,
              platformName: adapter.config.name,
              mode: adapter.config.mode,
              searchUrl,
              liveSupported: true,
              itemCount: 0,
              status: "FALLBACK_EXTERNAL" as const,
              lastChecked: timestamp,
              error: err.message || "Failed to retrieve live results",
            };
          }
        }

        return {
          platformId: adapter.config.id,
          platformName: adapter.config.name,
          mode: adapter.config.mode,
          searchUrl,
          liveSupported: false,
          itemCount: 0,
          status: "SUCCESS" as const,
          lastChecked: timestamp,
        };
      })
    );

    return {
      summaries,
      liveResults,
      totalLiveCount: liveResults.length,
      timestamp,
    };
  }
}
