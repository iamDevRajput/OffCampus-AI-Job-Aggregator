import { PlatformId, PlatformConfig, SearchFilters, PlatformSearchSummary } from "./types";
import { PlatformSearchAdapter } from "./adapters/base.search-adapter";
import { LinkedInSearchAdapter } from "./adapters/linkedin.search-adapter";
import { NaukriSearchAdapter } from "./adapters/naukri.search-adapter";
import { IndeedSearchAdapter } from "./adapters/indeed.search-adapter";
import { UnstopSearchAdapter } from "./adapters/unstop.search-adapter";
import { CutshortSearchAdapter } from "./adapters/cutshort.search-adapter";
import { HiristSearchAdapter } from "./adapters/hirist.search-adapter";
import { WellfoundSearchAdapter } from "./adapters/wellfound.search-adapter";
import { InstahyreSearchAdapter } from "./adapters/instahyre.search-adapter";
import { FounditSearchAdapter } from "./adapters/foundit.search-adapter";
import { GitHubSearchAdapter } from "./adapters/github.search-adapter";

export class PlatformRegistry {
  private static adapters: Map<PlatformId, PlatformSearchAdapter> = new Map([
    ["linkedin", new LinkedInSearchAdapter()],
    ["naukri", new NaukriSearchAdapter()],
    ["indeed", new IndeedSearchAdapter()],
    ["unstop", new UnstopSearchAdapter()],
    ["cutshort", new CutshortSearchAdapter()],
    ["hirist", new HiristSearchAdapter()],
    ["wellfound", new WellfoundSearchAdapter()],
    ["instahyre", new InstahyreSearchAdapter()],
    ["foundit", new FounditSearchAdapter()],
    ["github", new GitHubSearchAdapter()],
  ]);

  static getAllAdapters(): PlatformSearchAdapter[] {
    return Array.from(this.adapters.values());
  }

  static getAllConfigs(): PlatformConfig[] {
    return Array.from(this.adapters.values()).map((a) => a.config);
  }

  static getAdapter(id: PlatformId): PlatformSearchAdapter | undefined {
    return this.adapters.get(id);
  }

  /**
   * Generates tailored search URLs and execution plans across all 10 platforms
   */
  static buildAllSearchSummaries(filters: SearchFilters): PlatformSearchSummary[] {
    const timestamp = new Date().toISOString();

    return Array.from(this.adapters.values()).map((adapter) => {
      const searchUrl = adapter.buildSearchUrl(filters);
      const isLive = adapter.config.mode === "LIVE_INTEGRATION" || adapter.config.mode === "PUBLIC_FEED";

      return {
        platformId: adapter.config.id,
        platformName: adapter.config.name,
        mode: adapter.config.mode,
        searchUrl,
        liveSupported: isLive,
        itemCount: 0,
        status: "SUCCESS",
        lastChecked: timestamp,
      };
    });
  }
}
