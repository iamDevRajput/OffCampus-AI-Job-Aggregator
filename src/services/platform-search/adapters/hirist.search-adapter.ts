import { PlatformSearchAdapter } from "./base.search-adapter";
import { PlatformConfig, SearchFilters } from "../types";

export class HiristSearchAdapter implements PlatformSearchAdapter {
  config: PlatformConfig = {
    id: "hirist",
    name: "Hirist",
    tagline: "Specialized premium tech job portal for Indian engineering talent",
    logoColor: "from-purple-600 to-indigo-600",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    mode: "EXTERNAL_SEARCH",
    defaultQueries: [
      "Software Engineer",
      "Full Stack",
      "Backend",
      "React Native",
    ],
    supportedLocations: ["India", "Bengaluru", "Hyderabad", "Pune", "Noida", "Gurgaon", "Mumbai", "Remote"],
    homepageUrl: "https://www.hirist.tech",
    features: [
      "Curated premium tech engineering roles",
      "Clear CTC disclosures (12-30+ LPA)",
      "Tier-1 / product startup focus",
    ],
  };

  buildSearchUrl(filters: SearchFilters): string {
    const query = filters.query.trim() || "Software Engineer";
    const loc = filters.location === "Any" ? "India" : filters.location;
    return `https://www.hirist.tech/search?query=${encodeURIComponent(query)}&loc=${encodeURIComponent(loc)}`;
  }
}
