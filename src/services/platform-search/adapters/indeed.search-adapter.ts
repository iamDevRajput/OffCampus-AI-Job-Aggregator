import { PlatformSearchAdapter } from "./base.search-adapter";
import { PlatformConfig, SearchFilters } from "../types";

export class IndeedSearchAdapter implements PlatformSearchAdapter {
  config: PlatformConfig = {
    id: "indeed",
    name: "Indeed",
    tagline: "Global job aggregator with verified salary disclosures & instant alerts",
    logoColor: "from-blue-600 to-cyan-600",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    mode: "EXTERNAL_SEARCH",
    defaultQueries: [
      "Fresher Software Developer",
      "Junior Developer",
      "Entry Level SDE",
      "Full Stack Developer Fresher",
    ],
    supportedLocations: ["India", "Bengaluru", "Hyderabad", "Pune", "Noida", "Gurgaon", "Mumbai", "Remote"],
    homepageUrl: "https://in.indeed.com",
    features: [
      "Salary estimation tags",
      "14-day freshness window",
      "Direct employer quick apply",
      "Urgent hiring badges",
    ],
  };

  buildSearchUrl(filters: SearchFilters): string {
    let query = filters.query.trim() || "Fresher Software Developer";
    if (filters.experience === "FRESHER" && !query.toLowerCase().includes("fresher")) {
      query += " Fresher";
    }

    const loc = filters.location === "Any" ? "India" : filters.location;
    let url = `https://in.indeed.com/jobs?q=${encodeURIComponent(query)}&l=${encodeURIComponent(loc)}&fromage=14&sort=date`;

    if (filters.workMode === "REMOTE") {
      url += "&sc=0kf%3Aattr%28DS3S6%29%3B"; // Indeed Remote filter attribute
    }

    return url;
  }
}
