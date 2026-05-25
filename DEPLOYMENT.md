# ExamScore Deployment Guide

## Prerequisites

- Node.js 20+
- PostgreSQL database (NeonDB recommended)

## 1. NeonDB Setup

1. Create an account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string from the dashboard
4. Set as `DATABASE_URL` in your environment

## 2. Environment Variables

Copy `.env.example` to `.env` and fill in all values:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `AUTH_SECRET` | Yes | NextAuth encryption secret (`openssl rand -base64 32`) |
| `AUTH_URL` | Yes | App URL (`http://localhost:3000` for dev) |
| `AI_PROVIDER` | Yes | `gemini` or `openai` |
| `GEMINI_API_KEY` | If Gemini | Google AI Studio API key |
| `GEMINI_MODEL` | No | Default: `gemini-2.5-flash` |

## 3. Database Migrations

```bash
# Apply migrations to production database
npx prisma migrate deploy

# Seed initial data (boards, levels, subjects)
npx prisma db seed
```

The seed script is idempotent — it uses `upsert` and can be run multiple times safely.

## 4. Build & Start

```bash
# Install dependencies
npm install

# Build
npm run build

# Start production server
npm start
```

## 5. Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Connect NeonDB via the Vercel Neon integration (automatic `DATABASE_URL`)
4. Add remaining environment variables in Vercel dashboard
5. Set build command: `npm run build`
6. Set output directory: `.next`
7. Deploy

### Post-deploy

```bash
# Run migrations against production DB
npx prisma migrate deploy
npx prisma db seed
```

## Architecture Notes

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL via NeonDB
- **ORM**: Prisma 6
- **Auth**: NextAuth v5
- **AI**: Google Gemini / OpenAI (provider-switchable)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Font**: Spectral (serif) via Google Fonts

## Health Check

Visit `https://your-domain.com/api/stats/live-user-count` — should return `{ "count": 127493 }`.
