import { WorkMode, EmploymentType } from "@prisma/client";

export class NormalizationService {
  /**
   * Normalizes company names (removes Inc, LLC, Pvt Ltd, trims, lowercases for indexing)
   */
  static normalizeCompany(name: string): string {
    if (!name) return "Unknown Company";
    return name
      .replace(/\b(inc|llc|pvt|ltd|corporation|corp|technologies|tech|india|software|co)\b/gi, "")
      .replace(/[^\w\s]/g, "")
      .trim()
      .toLowerCase();
  }

  /**
   * Standardizes work mode from description/title or location string
   */
  static normalizeWorkMode(rawMode?: string, textContent?: string): WorkMode {
    const text = `${rawMode || ""} ${textContent || ""}`.toLowerCase();
    if (text.includes("remote") || text.includes("work from home") || text.includes("wfh")) {
      return WorkMode.REMOTE;
    }
    if (text.includes("hybrid") || text.includes("flexible")) {
      return WorkMode.HYBRID;
    }
    if (text.includes("onsite") || text.includes("in-office") || text.includes("on-site") || text.includes("office")) {
      return WorkMode.ONSITE;
    }
    return WorkMode.NOT_SPECIFIED;
  }

  /**
   * Standardizes employment type (Full Time / Internship)
   */
  static normalizeEmploymentType(rawType?: string, title?: string): EmploymentType {
    const text = `${rawType || ""} ${title || ""}`.toLowerCase();
    if (text.includes("intern") || text.includes("trainee") || text.includes("co-op")) {
      return EmploymentType.INTERNSHIP;
    }
    if (text.includes("contract") || text.includes("freelance")) {
      return EmploymentType.CONTRACT;
    }
    if (text.includes("full") || text.includes("fresher") || text.includes("sde") || text.includes("engineer")) {
      return EmploymentType.FULL_TIME;
    }
    return EmploymentType.FULL_TIME;
  }

  /**
   * Clean and normalize location string
   */
  static normalizeLocation(rawLocation?: string): string {
    if (!rawLocation || rawLocation.trim().length === 0) {
      return "Pan India";
    }
    const clean = rawLocation.trim();
    if (/bangalore|bengaluru/i.test(clean)) return "Bengaluru";
    if (/hyderabad/i.test(clean)) return "Hyderabad";
    if (/pune/i.test(clean)) return "Pune";
    if (/delhi|gurgaon|gurugram|noida/i.test(clean)) return "Delhi NCR";
    if (/mumbai/i.test(clean)) return "Mumbai";
    if (/chennai/i.test(clean)) return "Chennai";
    if (/remote/i.test(clean)) return "Remote - India";
    return clean;
  }
}
