# API Specification

## Auth
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/session

## Profile
- GET /api/profile
- PUT /api/profile
- POST /api/profile/skills
- DELETE /api/profile/skills/:id

## Jobs
- GET /api/jobs
- GET /api/jobs/:id
- POST /api/jobs/:id/save
- POST /api/jobs/:id/apply
- POST /api/jobs/:id/ignore
- POST /api/jobs/:id/recalculate-match

## Target Companies
- GET /api/target-companies
- POST /api/target-companies
- PUT /api/target-companies/:id
- DELETE /api/target-companies/:id
- POST /api/target-companies/import

## Sources
- GET /api/sources
- POST /api/sources
- PUT /api/sources/:id
- DELETE /api/sources/:id
- POST /api/sources/:id/run

## Ingestion
- POST /api/cron/ingest-jobs
- POST /api/cron/match-jobs
- POST /api/cron/send-alerts

## Dashboard
- GET /api/dashboard/stats
- GET /api/dashboard/recent-priority-jobs
- GET /api/dashboard/match-summary

## Query Parameters For GET /api/jobs
- search
- role
- company
- skill
- location
- workMode
- source
- priorityOnly
- minSalary
- status
- sort
- page
- limit

## Company Careers Hub (Phase 3D)
- GET /api/companies (search, filter: ALL/TARGET/LIVE ATS/EXTERNAL/HAS_ACTIVE_JOBS/NO_ACTIVE_JOBS, sort: A-Z/ACTIVE JOBS/LATEST JOB/TARGET PRIORITY, pagination)
- GET /api/companies/:id (supports UUID, stable companyId like CMP-000001, or slug)
- GET /api/companies/:id/jobs (retrieves real jobs cataloged in PostgreSQL for this company)
- POST /api/companies/:id/refresh (triggers compliant live ATS sync or returns external message)
- POST /api/companies/:id/target (adds/updates target company for the authenticated user)
- DELETE /api/companies/:id/target (removes target company for the authenticated user)
- GET /api/companies/:id/health (returns ATS telemetry, last checked, last success, job counts)


