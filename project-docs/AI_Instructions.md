# AI Coding Instructions For Antigravity

## Build Mode
Build a real working personal MVP, not only a mock design.

## Coding Style
- Use TypeScript everywhere.
- Use clean modular services.
- Keep source adapters independent.
- Avoid overengineering in Phase 1.
- Add comments only for non-obvious logic.

## Legal/Compliance Rules
- Do not implement LinkedIn scraping.
- Do not bypass anti-bot systems.
- Use compliant public sources and source adapters.
- Package/salary should only be shown when present in the source or clearly extracted from the job post.
- If not available, show "Not disclosed".

## Phase 1
- Next.js app structure
- Prisma schema
- Auth basic flow
- Profile page
- Dashboard with job cards, search, filters, save/applied/ignore states
- Target companies page
- Seed data
- Mock ingestion adapter

## Phase 2
- Background cron/worker structure
- Source adapter interface
- Greenhouse adapter
- Lever adapter
- Deduplication service
- Extraction service
- Matching service
- Alert placeholder

## Phase 3
- Real deployment configuration
- Email alerts
- Source health monitoring
- Import target companies from CSV/PDF later
- Better AI extraction with OpenAI API if configured

## Master Prompt
Read all files inside `/project-docs`. Generate a production-ready full-stack MVP based on these documents. Start with Phase 1 only, but keep the architecture ready for Phase 2 and Phase 3. After implementing Phase 1, provide exact setup commands, environment variables, migration steps, seed steps, and local run instructions.

