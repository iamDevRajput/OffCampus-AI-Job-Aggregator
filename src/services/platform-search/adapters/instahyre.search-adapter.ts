import { PlatformSearchAdapter } from "./base.search-adapter";
import { PlatformConfig, SearchFilters } from "../types";

export class InstahyreSearchAdapter implements PlatformSearchAdapter {
  config: PlatformConfig = {
    id: "instahyre",
    name: "Instahyre",
    tagline: "AI-powered talent matching for premium Indian tech unicorns & enterprises",
    logoColor: "from-emerald-500 to-teal-600",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    mode: "EXTERNAL_SEARCH",
    defaultQueries: [
      "Software Engineer",
      "Full Stack",
      "Backend Developer",
      "Frontend Developer",
    ],
    supportedLocations: ["India", "Bengaluru", "Hyderabad", "Pune", "Noida", "Gurgaon", "Mumbai", "Remote"],
    homepageUrl: "https://www.instahyre.com",
    features: [
      "Fast-track responses from verified hiring managers",
      "Unicorns & Tier-1 tech company exclusivity",
      "Smart algorithmic matching",
    ],
  };

  buildSearchUrl(filters: SearchFilters): string {
    const query = filters.query.trim() || "Software Engineer";
    return `https://www.instahyre.com/search-jobs/?query=${encodeURIComponent(query)}`;
  }
}
