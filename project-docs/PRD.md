# Product Requirement Document

## Project Name
OffCampus AI Job Aggregator

## Goal
Build a real personal job dashboard that automatically discovers off-campus openings from compliant public sources, ranks them against the user's profile, and shows high-priority company openings first.

## Problem
Students and freshers waste time checking many company career pages, job boards, and Telegram/LinkedIn posts manually. Job posts are scattered, duplicated, and often missing clear skill/package information.

## Target User
- Fresher or student looking for off-campus jobs and internships
- User who wants one personal dashboard for all relevant openings
- User who has a priority list of dream companies

## Core Value
The user creates a profile once. The system checks supported sources automatically, stores new jobs, extracts skills/package/deadline when available, ranks jobs by profile match, and alerts the user for strong matches.

## Important Constraint
Do not scrape LinkedIn or violate any platform terms. Use compliant public sources such as company career pages, Greenhouse, Lever, Workday where technically and legally feasible, public feeds, official APIs, and manually added sources.

## MVP Success Criteria
- User can log in and complete a profile.
- User can add target companies or import them later.
- Dashboard shows jobs with search, filters, status, match score, and priority company badge.
- Background worker fetches jobs from at least mock sources and 1-2 real compliant source adapters.
- New jobs are deduplicated and stored.
- Skills, package, location, deadline, and experience are extracted when available.
- Priority company jobs appear at the top.
- Strong matches trigger alert placeholder.

## User Flow
1. User signs up or logs in.
2. User fills profile: skills, preferred roles, location, work mode, salary/package, batch, experience.
3. User adds target companies with career links/source type.
4. Worker checks sources every 30-60 minutes.
5. New jobs are normalized, deduplicated, enriched, and matched.
6. Dashboard auto-refreshes and shows best jobs first.
7. User can save, ignore, or mark job as applied.
8. User browses Company Careers directory (183 employers), reviews live ATS status, and monitors dream companies.

## Phase 3D Scope: Company Careers Hub
- Authoritative 183-employer registry with stable IDs (`CMP-000001` to `CMP-000183`)
- Direct integration with verified public ATS platforms (Greenhouse, Lever, Ashby, SmartRecruiters, Recruitee, Workable)
- Real database inventory counts (Active, Expired, Total)
- Transparent distinction between Live ATS vs External Career Portals
- Foundation for company-specific monitoring and application automation
