# Tech Stack

## Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui optional
- lucide-react icons

## Backend
- Next.js API routes or route handlers for MVP
- Node.js with TypeScript services
- Modular service layer

## Database
- PostgreSQL
- Prisma ORM
- Supabase or Neon for hosted database

## Background Jobs
- MVP: node-cron or scheduled route
- Production: BullMQ with Redis
- Hosted cron: Vercel Cron, Railway cron, or Render cron

## Auth
- Auth.js / NextAuth
- Email/password for MVP
- OAuth can be added later

## AI/NLP
- MVP: keyword extraction and rules
- Later: OpenAI API for structured extraction and improved matching

## Alerts
- MVP: console/email placeholder
- Later: Resend email, Telegram bot, WhatsApp provider

## Deployment
- Frontend/API: Vercel
- Database: Supabase or Neon
- Worker: Railway, Render, Fly.io, or separate cron service
- Redis optional for production queues

