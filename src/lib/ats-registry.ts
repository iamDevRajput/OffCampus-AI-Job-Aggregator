import { SourceType } from "@prisma/client";

export interface CompanyPreset {
  name: string;
  sourceType: SourceType;
  boardToken: string;
  careerPageUrl?: string;
  aliases?: string[];
  priorityLevel?: "HIGH" | "MEDIUM" | "LOW";
  category?: "Target Company" | "Top Tech" | "Unicorn / High-Growth" | "AI & Core Engineering";
}

/**
 * Verified registry of public ATS board tokens across major tech employers.
 * All tokens point to official, non-authenticated public JSON/Posting APIs.
 */
export const ATS_PRESETS: CompanyPreset[] = [
  // --- Greenhouse Public Boards ---
  {
    name: "Stripe",
    sourceType: SourceType.GREENHOUSE,
    boardToken: "stripe",
    careerPageUrl: "https://stripe.com/jobs",
    aliases: ["Stripe Inc", "Stripe Payments"],
    priorityLevel: "HIGH",
    category: "Target Company",
  },
  {
    name: "Cloudflare",
    sourceType: SourceType.GREENHOUSE,
    boardToken: "cloudflare",
    careerPageUrl: "https://www.cloudflare.com/careers/jobs/",
    aliases: ["Cloudflare Inc"],
    priorityLevel: "HIGH",
    category: "Top Tech",
  },
  {
    name: "Figma",
    sourceType: SourceType.GREENHOUSE,
    boardToken: "figma",
    careerPageUrl: "https://www.figma.com/careers/",
    aliases: ["Figma Inc"],
    priorityLevel: "HIGH",
    category: "Top Tech",
  },
  {
    name: "Reddit",
    sourceType: SourceType.GREENHOUSE,
    boardToken: "reddit",
    careerPageUrl: "https://www.redditinc.com/careers",
    aliases: ["Reddit Inc"],
    priorityLevel: "HIGH",
    category: "Top Tech",
  },
  {
    name: "GitLab",
    sourceType: SourceType.GREENHOUSE,
    boardToken: "gitlab",
    careerPageUrl: "https://about.gitlab.com/jobs/",
    aliases: ["GitLab Inc"],
    priorityLevel: "HIGH",
    category: "Top Tech",
  },
  {
    name: "GitHub",
    sourceType: SourceType.GREENHOUSE,
    boardToken: "github",
    careerPageUrl: "https://github.com/about/careers",
    aliases: ["GitHub Inc"],
    priorityLevel: "HIGH",
    category: "Top Tech",
  },
  {
    name: "Airbnb",
    sourceType: SourceType.GREENHOUSE,
    boardToken: "airbnb",
    careerPageUrl: "https://careers.airbnb.com/",
    aliases: ["Airbnb Inc"],
    priorityLevel: "HIGH",
    category: "Top Tech",
  },
  {
    name: "Discord",
    sourceType: SourceType.GREENHOUSE,
    boardToken: "discord",
    careerPageUrl: "https://discord.com/careers",
    aliases: ["Discord Inc"],
    priorityLevel: "HIGH",
    category: "Top Tech",
  },
  {
    name: "Gusto",
    sourceType: SourceType.GREENHOUSE,
    boardToken: "gusto",
    careerPageUrl: "https://gusto.com/about/careers",
    aliases: ["Gusto Inc"],
    priorityLevel: "MEDIUM",
    category: "Unicorn / High-Growth",
  },
  {
    name: "Brex",
    sourceType: SourceType.GREENHOUSE,
    boardToken: "brex",
    careerPageUrl: "https://www.brex.com/careers",
    aliases: ["Brex Inc"],
    priorityLevel: "MEDIUM",
    category: "Unicorn / High-Growth",
  },

  // --- Lever Public Postings ---
  {
    name: "Palantir",
    sourceType: SourceType.LEVER,
    boardToken: "palantir",
    careerPageUrl: "https://jobs.lever.co/palantir",
    aliases: ["Palantir Technologies"],
    priorityLevel: "HIGH",
    category: "Target Company",
  },
  {
    name: "Netflix",
    sourceType: SourceType.LEVER,
    boardToken: "netflix",
    careerPageUrl: "https://jobs.lever.co/netflix",
    aliases: ["Netflix Inc"],
    priorityLevel: "HIGH",
    category: "Top Tech",
  },
  {
    name: "Spotify",
    sourceType: SourceType.LEVER,
    boardToken: "spotify",
    careerPageUrl: "https://jobs.lever.co/spotify",
    aliases: ["Spotify AB"],
    priorityLevel: "HIGH",
    category: "Top Tech",
  },
  {
    name: "Atlassian",
    sourceType: SourceType.LEVER,
    boardToken: "atlassian",
    careerPageUrl: "https://jobs.lever.co/atlassian",
    aliases: ["Atlassian Pty Ltd", "Jira", "Confluence"],
    priorityLevel: "HIGH",
    category: "Target Company",
  },
  {
    name: "Auth0",
    sourceType: SourceType.LEVER,
    boardToken: "auth0",
    careerPageUrl: "https://jobs.lever.co/auth0",
    aliases: ["Auth0 Inc", "Okta Auth0"],
    priorityLevel: "HIGH",
    category: "Top Tech",
  },
  {
    name: "Benchling",
    sourceType: SourceType.LEVER,
    boardToken: "benchling",
    careerPageUrl: "https://jobs.lever.co/benchling",
    aliases: ["Benchling Inc"],
    priorityLevel: "MEDIUM",
    category: "Unicorn / High-Growth",
  },
  {
    name: "Coursera",
    sourceType: SourceType.LEVER,
    boardToken: "coursera",
    careerPageUrl: "https://jobs.lever.co/coursera",
    aliases: ["Coursera Inc"],
    priorityLevel: "MEDIUM",
    category: "Top Tech",
  },

  // --- Ashby Public Boards ---
  {
    name: "OpenAI",
    sourceType: SourceType.ASHBY,
    boardToken: "openai",
    careerPageUrl: "https://jobs.ashbyhq.com/openai",
    aliases: ["OpenAI LLC"],
    priorityLevel: "HIGH",
    category: "Target Company",
  },
  {
    name: "Ramp",
    sourceType: SourceType.ASHBY,
    boardToken: "ramp",
    careerPageUrl: "https://jobs.ashbyhq.com/ramp",
    aliases: ["Ramp Financial"],
    priorityLevel: "HIGH",
    category: "Unicorn / High-Growth",
  },
  {
    name: "Anthropic",
    sourceType: SourceType.ASHBY,
    boardToken: "anthropic",
    careerPageUrl: "https://jobs.ashbyhq.com/anthropic",
    aliases: ["Anthropic PBC", "Claude"],
    priorityLevel: "HIGH",
    category: "Target Company",
  },
  {
    name: "Linear",
    sourceType: SourceType.ASHBY,
    boardToken: "linear",
    careerPageUrl: "https://jobs.ashbyhq.com/linear",
    aliases: ["Linear App"],
    priorityLevel: "HIGH",
    category: "AI & Core Engineering",
  },
  {
    name: "Deel",
    sourceType: SourceType.ASHBY,
    boardToken: "deel",
    careerPageUrl: "https://jobs.ashbyhq.com/deel",
    aliases: ["Deel Inc"],
    priorityLevel: "HIGH",
    category: "Unicorn / High-Growth",
  },
  {
    name: "Supabase",
    sourceType: SourceType.ASHBY,
    boardToken: "supabase",
    careerPageUrl: "https://jobs.ashbyhq.com/supabase",
    aliases: ["Supabase Inc"],
    priorityLevel: "HIGH",
    category: "AI & Core Engineering",
  },

  // --- SmartRecruiters Public Boards ---
  {
    name: "Bosch Group",
    sourceType: SourceType.SMART_RECRUITERS,
    boardToken: "BoschGroup",
    careerPageUrl: "https://jobs.smartrecruiters.com/BoschGroup",
    aliases: ["Robert Bosch", "Bosch", "BGSW"],
    priorityLevel: "HIGH",
    category: "Top Tech",
  },

  // --- Recruitee Public Offers ---
  {
    name: "bunq",
    sourceType: SourceType.RECRUITEE,
    boardToken: "bunq",
    careerPageUrl: "https://careers.bunq.com/",
    aliases: ["bunq Bank", "bunq BV"],
    priorityLevel: "HIGH",
    category: "Unicorn / High-Growth",
  },
  {
    name: "Transloadit",
    sourceType: SourceType.RECRUITEE,
    boardToken: "transloadit",
    careerPageUrl: "https://transloadit.com/jobs/",
    aliases: ["Transloadit Inc"],
    priorityLevel: "MEDIUM",
    category: "AI & Core Engineering",
  },
];

export const PUBLIC_FEED_SOURCES = [
  {
    name: "Arbeitnow Global Developer Feed",
    type: SourceType.PUBLIC_FEED,
    baseUrl: "https://www.arbeitnow.com",
    apiUrl: "https://www.arbeitnow.com/api/job-board-api",
    boardToken: "arbeitnow",
  },
  {
    name: "WeWorkRemotely Tech RSS Feed",
    type: SourceType.PUBLIC_FEED,
    baseUrl: "https://weworkremotely.com",
    apiUrl: "https://weworkremotely.com/categories/remote-programming-jobs.rss",
    boardToken: "weworkremotely",
  },
  {
    name: "RemoteOK Developer API Feed",
    type: SourceType.PUBLIC_FEED,
    baseUrl: "https://remoteok.com",
    apiUrl: "https://remoteok.com/api",
    boardToken: "remoteok",
  },
];
