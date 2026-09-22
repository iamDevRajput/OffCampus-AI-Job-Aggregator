import { PlatformSearchAdapter } from "./base.search-adapter";
import { PlatformConfig, SearchFilters } from "../types";

export class WellfoundSearchAdapter implements PlatformSearchAdapter {
  config: PlatformConfig = {
    id: "wellfound",
    name: "Wellfound",
    tagline: "The #1 community for venture-backed startups and high-growth AI companies",
    logoColor: "from-rose-500 to-amber-500",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    mode: "EXTERNAL_SEARCH",
    defaultQueries: [
      "Startup SDE",
      "Full Stack",
      "AI/LLM",
      "Frontend Engineer",
    ],
    supportedLocations: ["India", "Remote", "Bengaluru", "Delhi NCR", "United States", "Worldwide"],
    homepageUrl: "https://wellfound.com/jobs",
    features: [
      "Direct founder access with 0 recruiters",
      "Salary + equity / ESOP breakdown",
      "Seed, Series A & Unicorn filter",
      "Global remote AI roles",
    ],
  };

  buildSearchUrl(filters: SearchFilters): string {
    const query = filters.query.trim() || "Startup SDE";
    return `https://wellfound.com/jobs?keyword=${encodeURIComponent(query)}`;
  }
}
