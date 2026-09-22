import { PlatformSearchAdapter } from "./base.search-adapter";
import { PlatformConfig, SearchFilters } from "../types";

export class CutshortSearchAdapter implements PlatformSearchAdapter {
  config: PlatformConfig = {
    id: "cutshort",
    name: "Cutshort",
    tagline: "AI-matched tech hiring connecting developers with high-growth Indian startups",
    logoColor: "from-cyan-500 to-teal-600",
    badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/30",
    mode: "EXTERNAL_SEARCH",
    defaultQueries: [
      "Full Stack",
      "Backend",
      "Frontend",
      "SDE",
    ],
    supportedLocations: ["India", "Bengaluru", "Hyderabad", "Pune", "Noida", "Gurgaon", "Remote"],
    homepageUrl: "https://cutshort.io/jobs",
    features: [
      "Direct fast-track messaging with founders",
      "Startup CTC & ESOP breakdown",
      "Skill-first shortlisting",
    ],
  };

  buildSearchUrl(filters: SearchFilters): string {
    const query = filters.query.trim() || "Full Stack";
    const loc = filters.location === "Any" ? "" : `&location=${encodeURIComponent(filters.location)}`;
    return `https://cutshort.io/jobs?query=${encodeURIComponent(query)}${loc}`;
  }
}
