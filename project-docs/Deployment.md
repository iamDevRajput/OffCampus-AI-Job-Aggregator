# Deployment Plan

## Local Development
1. Install dependencies.
2. Create `.env`.
3. Start PostgreSQL locally or use Supabase/Neon.
4. Run Prisma migration.
5. Seed sample data.
6. Start Next.js dev server.
7. Run ingestion manually from admin page or cron endpoint.

## Recommended Hosted Setup
- Vercel for Next.js frontend/API
- Supabase or Neon for PostgreSQL
- Railway/Render/Fly.io for background worker if needed
- Redis only if BullMQ is added
- Resend for email alerts

## Environment Variables
- DATABASE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- EMAIL_PROVIDER_KEY
- OPENAI_API_KEY optional
- CRON_SECRET

## MVP Deployment Steps
1. Push code to GitHub.
2. Connect Vercel.
3. Add environment variables.
4. Connect hosted PostgreSQL.
5. Run migrations.
6. Seed initial skills and mock sources.
7. Enable scheduled ingestion.

## Production Hardening
- Add error monitoring.
- Add structured logs.
- Add source health dashboard.
- Add queue retries.
- Add backup strategy for database.

