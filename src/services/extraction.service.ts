import { STANDARD_SKILLS } from "@/lib/constants";

export interface ExtractedSalary {
  minSalary?: number | null;
  maxSalary?: number | null;
  currency: string;
  salaryDisclosed: boolean;
  salaryRaw?: string | null;
}

export interface ExtractedExperience {
  experienceMin?: number | null;
  experienceMax?: number | null;
}

export class ExtractionService {
  /**
   * Extract recognized technical skills from job title and description
   */
  static extractSkills(title: string, description: string): string[] {
    const combinedText = ` ${title} ${description} `.toLowerCase();
    const matchedSkills = new Set<string>();

    for (const skillDef of STANDARD_SKILLS) {
      // Check each alias with word boundaries
      for (const alias of skillDef.aliases) {
        const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        // Regex with word boundaries or punctuation boundaries (handling c++, c#, .net etc)
        const regex = new RegExp(`(?:^|[^a-zA-Z0-9_+#])${escaped}(?:$|[^a-zA-Z0-9_+#])`, "i");
        if (regex.test(combinedText)) {
          matchedSkills.add(skillDef.name);
          break;
        }
      }
    }

    return Array.from(matchedSkills);
  }

  /**
   * Extract CTC/Salary details from text if present.
   * In strict compliance with guidelines: if no salary is found, returns salaryDisclosed: false.
   */
  static extractSalary(rawSalary?: string, text?: string): ExtractedSalary {
    if (rawSalary && rawSalary.trim().length > 0) {
      const parsed = this.parseSalaryText(rawSalary);
      return {
        ...parsed,
        salaryDisclosed: true,
        salaryRaw: rawSalary.trim(),
      };
    }

    if (!text) {
      return { minSalary: null, maxSalary: null, currency: "INR", salaryDisclosed: false, salaryRaw: null };
    }

    // Look for patterns like "12-18 LPA", "₹15,00,000", "20 LPA", "14 to 22 Lakhs", "₹40,000/month", "$100k-$120k"
    const lpaRegex = /(\d+(?:\.\d+)?)\s*(?:-|to)\s*(\d+(?:\.\d+)?)\s*(?:lpa|lakhs?|l|lac)/i;
    const singleLpaRegex = /(\d+(?:\.\d+)?)\s*(?:lpa|lakhs?|lac)/i;
    const stipendRegex = /(?:₹|rs\.?|inr)?\s*(\d{2,3}(?:,\d{3})*|\d{4,6})\s*(?:\/|\s*per\s*)?(?:month|pm|stipend)/i;

    const lpaMatch = text.match(lpaRegex);
    if (lpaMatch) {
      const min = parseFloat(lpaMatch[1]);
      const max = parseFloat(lpaMatch[2]);
      return {
        minSalary: min,
        maxSalary: max,
        currency: "INR",
        salaryDisclosed: true,
        salaryRaw: `₹${min} - ₹${max} LPA`,
      };
    }

    const singleLpaMatch = text.match(singleLpaRegex);
    if (singleLpaMatch) {
      const val = parseFloat(singleLpaMatch[1]);
      return {
        minSalary: val,
        maxSalary: val,
        currency: "INR",
        salaryDisclosed: true,
        salaryRaw: `₹${val} LPA`,
      };
    }

    const stipendMatch = text.match(stipendRegex);
    if (stipendMatch) {
      const amountStr = stipendMatch[1].replace(/,/g, "");
      const amount = parseInt(amountStr, 10);
      if (!isNaN(amount) && amount > 5000 && amount < 500000) {
        return {
          minSalary: null,
          maxSalary: null,
          currency: "INR",
          salaryDisclosed: true,
          salaryRaw: `₹${amount.toLocaleString("en-IN")}/month Stipend`,
        };
      }
    }

    return {
      minSalary: null,
      maxSalary: null,
      currency: "INR",
      salaryDisclosed: false,
      salaryRaw: null,
    };
  }

  private static parseSalaryText(text: string): { minSalary: number | null; maxSalary: number | null; currency: string } {
    const lpaRange = text.match(/(\d+(?:\.\d+)?)\s*(?:-|to)\s*(\d+(?:\.\d+)?)/i);
    if (lpaRange) {
      return {
        minSalary: parseFloat(lpaRange[1]),
        maxSalary: parseFloat(lpaRange[2]),
        currency: text.includes("$") ? "USD" : "INR",
      };
    }
    const single = text.match(/(\d+(?:\.\d+)?)/);
    if (single) {
      const val = parseFloat(single[1]);
      return {
        minSalary: val,
        maxSalary: val,
        currency: text.includes("$") ? "USD" : "INR",
      };
    }
    return { minSalary: null, maxSalary: null, currency: "INR" };
  }

  /**
   * Extract experience requirements (e.g. "0-1 years", "Freshers", "0-2 Yrs")
   */
  static extractExperience(text: string): ExtractedExperience {
    const expRegex = /(\d+)\s*(?:-|to)\s*(\d+)\s*(?:years?|yrs?)/i;
    const singleExpRegex = /(\d+)\+?\s*(?:years?|yrs?)/i;

    const match = text.match(expRegex);
    if (match) {
      return {
        experienceMin: parseInt(match[1], 10),
        experienceMax: parseInt(match[2], 10),
      };
    }

    const singleMatch = text.match(singleExpRegex);
    if (singleMatch) {
      const val = parseInt(singleMatch[1], 10);
      return {
        experienceMin: val,
        experienceMax: val + 2,
      };
    }

    if (/fresher|intern|college grad|new grad|entry level|2024|2025|2026/i.test(text)) {
      return {
        experienceMin: 0,
        experienceMax: 1,
      };
    }

    return { experienceMin: 0, experienceMax: 2 };
  }
}
