# System Architecture

## High-Level Flow
User Profile -> Source Worker -> Job Normalization -> Deduplication -> Extraction -> Matching -> Alerts -> Dashboard

## Frontend
- Next.js pages/app routes
- Dashboard components
- Job card components
- Filter/search state
- Profile form
- Target company management
- Source management

## Backend Services
- auth service
- profile service
- source service
- ingestion service
- normalization service
- deduplication service
- extraction service
- matching service
- alert service

## Source Adapter Pattern
Each source adapter should implement:
- sourceType
- validateConfig(config)
- fetchJobs(config)
- normalizeJob(rawJob)

## Suggested Adapter Types
- mock
- greenhouse
- lever
- public-feed
- custom-career-page-placeholder

## Ingestion Pipeline
1. Load active job sources and active target companies.
2. Fetch raw jobs from each source.
3. Normalize each job into common format.
4. Deduplicate against existing jobs.
5. Extract skills, package, location, deadline, experience.
6. Match company against target companies.
7. Save new or updated jobs.
8. Calculate match scores for active users.
9. Queue alerts for high-score or priority jobs.

## Dashboard Freshness
- MVP: client polling every 30 seconds
- Later: server-sent events or WebSockets

## Deduplication Strategy
- Exact apply URL match
- External job ID match
- Normalized company + title + location match
- Content hash match

## Reliability
- Store last fetch time and last error per source.
- Make source failures non-blocking.
- Log ingestion runs.
- Add manual "run now" action for debugging.

