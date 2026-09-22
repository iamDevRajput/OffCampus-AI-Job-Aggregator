import { PlatformSearchAdapter } from "./base.search-adapter";
import { PlatformConfig, SearchFilters, PlatformSearchResultItem } from "../types";
import { fetchWithRetry } from "@/lib/fetch-utils";

export class GitHubSearchAdapter implements PlatformSearchAdapter {
  config: PlatformConfig = {
    id: "github",
    name: "GitHub",
    tagline: "Developer hiring repositories, recruiter issues & open-source opportunities",
    logoColor: "from-slate-700 to-slate-900",
    badgeColor: "bg-slate-500/15 text-slate-300 border-slate-500/30",
    mode: "LIVE_INTEGRATION",
    defaultQueries: [
      "hiring fresher software engineer",
      "hiring SDE intern",
      "new-grad developer hiring",
      "open-source hiring opportunities",
    ],
    supportedLocations: ["Global", "Remote", "India", "Any"],
    homepageUrl: "https://github.com",
    features: [
      "Live API integration via GitHub Search API",
      "Community hiring repositories (e.g. SimplifyJobs, Tech-Internships)",
      "Recruiter issues & developer job threads",
      "Open source paid bounties & developer grants",
    ],
  };

  buildSearchUrl(filters: SearchFilters): string {
    const query = filters.query.trim() || "hiring fresher software engineer";
    return `https://github.com/search?q=${encodeURIComponent(query + " state:open")}&type=issues`;
  }

  async fetchLiveResults(filters: SearchFilters): Promise<PlatformSearchResultItem[]> {
    const rawQuery = filters.query.trim() || "hiring fresher software engineer";
    const loc = filters.location && filters.location !== "Any" ? ` ${filters.location}` : "";
    const cleanSearch = `${rawQuery}${loc}`.trim();

    const results: PlatformSearchResultItem[] = [];

    // 1. Search Issues & Discussions tagged with hiring
    const issuesUrl = `https://api.github.com/search/issues?q=${encodeURIComponent(
      cleanSearch + " state:open"
    )}&sort=updated&order=desc&per_page=12`;

    try {
      const res = await fetchWithRetry(issuesUrl, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "OffCampusJobAggregator/3.0 (Developer Placement Engine)",
        },
      });

      if (res.ok) {
        const data = await res.json();
        const items = data.items || [];

        for (const item of items) {
          const repoMatch = item.repository_url?.match(/repos\/([^/]+\/[^/]+)/);
          const repoName = repoMatch ? repoMatch[1] : item.user?.login || "GitHub Repository";

          const cleanBody = (item.body || "")
            .replace(/<[^>]*>/g, " ")
            .replace(/\s+/g, " ")
            .slice(0, 240);

          const labels = Array.isArray(item.labels) ? item.labels.map((l: any) => l.name || l) : [];

          results.push({
            id: `gh-issue-${item.id}`,
            platform: "github",
            platformName: "GitHub",
            title: item.title,
            company: repoName,
            location: filters.location === "Any" ? "Remote / Global" : filters.location,
            workMode: /remote/i.test(item.title + " " + item.body) ? "Remote" : "Flexible",
            experience: /intern/i.test(item.title) ? "Internship" : "Fresher / 0-2 Yrs",
            postedAt: item.updated_at || item.created_at,
            url: item.html_url,
            description: cleanBody || item.title,
            tags: labels.slice(0, 4),
            isLive: true,
          });
        }
      }
    } catch (err: any) {
      console.warn("[GitHubSearchAdapter] Issues search error:", err.message || err);
    }

    // 2. Search Hiring Repositories
    const reposUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(
      cleanSearch + " hiring"
    )}&sort=updated&order=desc&per_page=6`;

    try {
      const res = await fetchWithRetry(reposUrl, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "OffCampusJobAggregator/3.0 (Developer Placement Engine)",
        },
      });

      if (res.ok) {
        const data = await res.json();
        const items = data.data || data.items || [];

        for (const item of items) {
          if (results.some((r) => r.url === item.html_url)) continue;

          results.push({
            id: `gh-repo-${item.id}`,
            platform: "github",
            platformName: "GitHub",
            title: item.name.replace(/[-_]/g, " "),
            company: item.full_name || item.owner?.login || "Open Source Hiring Repo",
            location: "Global / Remote",
            workMode: "Remote",
            experience: "All Experience Levels",
            postedAt: item.pushed_at || item.updated_at,
            url: item.html_url,
            description: item.description || `Curated opportunities repository on ${item.full_name}`,
            tags: item.topics ? item.topics.slice(0, 3) : ["Hiring Repo", "Open Source"],
            isLive: true,
          });
        }
      }
    } catch (err: any) {
      console.warn("[GitHubSearchAdapter] Repos search error:", err.message || err);
    }

    return results;
  }
}
