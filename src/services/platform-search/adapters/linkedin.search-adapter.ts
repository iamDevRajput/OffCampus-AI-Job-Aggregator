import { PlatformSearchAdapter } from "./base.search-adapter";
import { PlatformConfig, SearchFilters } from "../types";

export class LinkedInSearchAdapter implements PlatformSearchAdapter {
  config: PlatformConfig = {
    id: "linkedin",
    name: "LinkedIn",
    tagline: "World's largest professional talent and recruiter network",
    logoColor: "from-blue-600 to-sky-500",
    badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    mode: "EXTERNAL_SEARCH",
    defaultQueries: [
      "Software Engineer Fresher",
      "SDE-1",
      "Full Stack Developer",
      "React Developer",
    ],
    supportedLocations: ["India", "Bengaluru", "Hyderabad", "Pune", "Noida", "Gurgaon", "Mumbai", "Remote"],
    homepageUrl: "https://www.linkedin.com/jobs",
    features: [
      "Real-time recruiter postings",
      "Easy Apply filter support",
      "Fresher & Entry-level filters",
      "Date posted sorting",
    ],
  };

  buildSearchUrl(filters: SearchFilters): string {
    const query = filters.query.trim() || "Software Engineer Fresher";
    const loc = filters.location === "Any" ? "India" : filters.location;

    let url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}&location=${encodeURIComponent(loc)}&sortBy=DD`;

    // Experience filters
    if (filters.experience === "FRESHER" || filters.experience === "ZERO_TO_ONE") {
      url += "&f_E=1%2C2"; // Internship & Entry Level
    } else if (filters.experience === "ZERO_TO_TWO") {
      url += "&f_E=2%2C3"; // Entry & Associate
    } else if (filters.experience === "ONE_TO_TWO") {
      url += "&f_E=2%2C3";
    }

    // Work mode filters
    if (filters.workMode === "REMOTE") {
      url += "&f_WT=2";
    } else if (filters.workMode === "HYBRID") {
      url += "&f_WT=3";
    } else if (filters.workMode === "ONSITE") {
      url += "&f_WT=1";
    }

    return url;
  }
}
