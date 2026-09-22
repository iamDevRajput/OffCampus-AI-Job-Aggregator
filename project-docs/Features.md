# Features

## Authentication
- Email/password login
- Secure password hashing
- Protected dashboard routes

## User Profile
- Name, email, college, batch year
- Experience level: fresher, internship, 0-1 year, 1-2 years
- Skills with optional level
- Preferred roles
- Preferred locations
- Preferred work mode: remote, hybrid, onsite
- Minimum package/salary
- Resume upload placeholder

## Job Dashboard
- Dark dashboard UI inspired by placement portals
- Search by title, company, skill, location
- Filters: role, source, priority company, salary, remote/hybrid/onsite, status
- Sort: best match, newest, highest package, priority first
- Job cards with title, company, package, location, deadline, source, skills, match score
- Save, ignore, applied states

## Priority Company Watchlist
- Add target companies manually
- Fields: name, aliases, career page URL, source type, priority level, active status
- Match jobs against target company names and aliases
- Show priority badge on job cards
- Boost ranking for priority companies
- Trigger instant alert placeholder

## Job Sources
- Modular source adapter interface
- Mock source adapter for testing
- Greenhouse adapter where possible
- Lever adapter where possible
- Public feed adapter structure
- Admin page to enable/disable sources

## Ingestion
- Background cron/worker checks sources every 30-60 minutes
- Normalize job payloads into one common format
- Deduplicate by external ID, apply URL, company/title/location, and content hash
- Store raw source data for debugging

## Extraction
- Extract skills from job title/description
- Extract package/salary if source provides it
- Extract location/work mode/deadline/experience where available
- If package is unavailable, show "Not disclosed"

## Matching
- Compare job with user profile
- Score based on skills, role, location, work mode, salary, experience, freshness, and priority company
- Show match reasons
- Do not claim perfect accuracy

## Alerts
- In-app notification placeholder for high-scoring jobs
- Email/Telegram alert structure for future expansion

## Company Careers Hub (Phase 3D)
- 183 Authoritative Employer Directory from COMPANY LIST.pdf with stable IDs (`CMP-000001` through `CMP-000183`)
- Deterministic slugs and canonical alias mapping (e.g. LTIMindtree, HCLTech, JPMC, Aditya Birla Capital)
- Real ATS Detection & Connection layer: Greenhouse, Lever, Ashby, SmartRecruiters, Recruitee, Workable
- Clear status separation: 🟢 LIVE ATS CONNECTED vs 🔵 OFFICIAL CAREERS PAGE ONLY
- Direct link to official career pages with zero CAPTCHA/login bypass
- Real database job counts (Active, Expired, Total) indexed in PostgreSQL
- Live single-company refresh triggering compliant ATS ingestion via `IngestionService`
- User-specific Target/Watchlist toggle preserving high/medium/low priority
- Telemetry & Health metrics tracking last checked, last successful sync, and ingestion runs
