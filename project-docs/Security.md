# Security Requirements

## Authentication
- Hash passwords with bcrypt or argon2.
- Protect all dashboard/profile/admin routes.
- Do not expose password hashes or secrets to the client.

## Validation
- Validate API input with Zod.
- Sanitize source URLs and user-provided text.
- Validate uploaded file types when resume upload is added.

## Database Safety
- Use Prisma parameterized queries.
- Do not build raw SQL from user input unless unavoidable.

## Rate Limiting
- Add rate limits to auth routes.
- Add rate limits to manual source run endpoint.

## Secrets
- Use environment variables for database URL, auth secret, email keys, and AI keys.
- Never commit `.env` files.

## Source Compliance
- Do not scrape LinkedIn.
- Respect robots.txt and terms where applicable.
- Prefer public APIs, public JSON feeds, official career pages, and compliant endpoints.
- Store source links and make it clear where each job came from.

## Alert Safety
- Prevent duplicate alerts for the same user/job/type.
- Allow user to disable alerts later.

## Recruiter Privacy & ATS Compliance (Phase 3D)
- Strictly prohibit exposing personal phone numbers or private recruiter contacts in the user-facing application.
- No automated mass messaging, connection requests, or recruiter scraping.
- Use only public, documented ATS API endpoints (Greenhouse, Lever, Ashby, SmartRecruiters, Recruitee, Workable).
- Never bypass CAPTCHA, Cloudflare, anti-bot protection, or authentication restrictions.
- Do not store third-party credentials or passwords.


