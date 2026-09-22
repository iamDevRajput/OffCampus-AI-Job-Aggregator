import { PlatformSearchAdapter } from "./base.search-adapter";
import { PlatformConfig, SearchFilters } from "../types";

export class UnstopSearchAdapter implements PlatformSearchAdapter {
  config: PlatformConfig = {
    id: "unstop",
    name: "Unstop",
    tagline: "India's leading early-talent hiring challenges, hackathons & fresher jobs",
    logoColor: "from-sky-500 to-blue-600",
    badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    mode: "EXTERNAL_SEARCH",
    defaultQueries: [
      "Fresher SDE",
      "Software Developer",
      "Internships",
      "Hiring Challenges",
    ],
    supportedLocations: ["India", "Remote", "Bengaluru", "Delhi NCR", "Hyderabad", "Pune"],
    homepageUrl: "https://unstop.com/jobs",
    features: [
      "Campus & off-campus hiring drives",
      "Corporate coding challenges",
      "Direct interview shortlist opportunities",
      "Batch-specific eligibility tags",
    ],
  };

  buildSearchUrl(filters: SearchFilters): string {
    const query = filters.query.trim() || "Fresher SDE";
    return `https://unstop.com/jobs?searchTerm=${encodeURIComponent(query)}`;
  }
}
