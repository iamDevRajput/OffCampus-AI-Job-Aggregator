import { PlatformSearchAdapter } from "./base.search-adapter";
import { PlatformConfig, SearchFilters } from "../types";

export class FounditSearchAdapter implements PlatformSearchAdapter {
  config: PlatformConfig = {
    id: "foundit",
    name: "Foundit",
    tagline: "Comprehensive career portal connecting talent with MNCs and startups across Asia",
    logoColor: "from-purple-600 to-pink-600",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    mode: "EXTERNAL_SEARCH",
    defaultQueries: [
      "Fresher Software Engineer",
      "Associate Software Engineer",
      "Junior SDE",
      "Graduate Engineer Trainee",
    ],
    supportedLocations: ["India", "Bengaluru", "Hyderabad", "Pune", "Noida", "Gurgaon", "Mumbai", "Chennai"],
    homepageUrl: "https://www.foundit.in",
    features: [
      "Broad pan-India coverage",
      "Fresh graduate & entry level specialization",
      "Walk-in & direct interview listings",
    ],
  };

  buildSearchUrl(filters: SearchFilters): string {
    const query = filters.query.trim() || "Fresher Software Engineer";
    const loc = filters.location === "Any" ? "India" : filters.location;
    return `https://www.foundit.in/srp/results?query=${encodeURIComponent(query)}&locations=${encodeURIComponent(loc)}&experienceRanges=0~2`;
  }
}
