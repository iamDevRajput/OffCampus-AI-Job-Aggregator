import { PlatformSearchAdapter } from "./base.search-adapter";
import { PlatformConfig, SearchFilters } from "../types";

export class NaukriSearchAdapter implements PlatformSearchAdapter {
  config: PlatformConfig = {
    id: "naukri",
    name: "Naukri",
    tagline: "India's premier employment portal for early career & campus hires",
    logoColor: "from-blue-700 to-indigo-600",
    badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    mode: "EXTERNAL_SEARCH",
    defaultQueries: [
      "Software Developer Fresher",
      "Associate Software Engineer",
      "SDE-1",
      "Full Stack Developer",
    ],
    supportedLocations: ["India", "Bengaluru", "Hyderabad", "Pune", "Noida", "Gurgaon", "Mumbai", "Chennai", "Delhi NCR"],
    homepageUrl: "https://www.naukri.com",
    features: [
      "High volume Indian placement postings",
      "CTC / Salary range filters",
      "Batch 2024 / 2025 / 2026 tags",
      "Direct HR contact postings",
    ],
  };

  buildSearchUrl(filters: SearchFilters): string {
    let query = filters.query.trim() || "Software Developer Fresher";
    if (filters.workMode === "REMOTE" && !query.toLowerCase().includes("remote")) {
      query += " Remote";
    }

    const loc = filters.location === "Any" || filters.location === "Remote" ? "india" : filters.location.toLowerCase().replace(/[^\w]/g, "-");

    let expParam = "0";
    if (filters.experience === "ZERO_TO_ONE") expParam = "1";
    else if (filters.experience === "ZERO_TO_TWO" || filters.experience === "ONE_TO_TWO") expParam = "2";
    else if (filters.experience === "ANY") expParam = "";

    const expQuery = expParam ? `&experience=${expParam}` : "";
    return `https://www.naukri.com/${encodeURIComponent(loc)}-jobs?k=${encodeURIComponent(query)}${expQuery}&sort=f`;
  }
}
