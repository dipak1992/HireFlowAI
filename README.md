# HireFlow AI 🚀

> **AI-powered job matching, resume tailoring, and application tracking platform**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-green?logo=supabase)](https://supabase.com)
[![Stripe](https://img.shields.io/badge/Stripe-v17-purple?logo=stripe)](https://stripe.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-cyan?logo=tailwindcss)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Stripe Setup](#stripe-setup)
- [Deployment](#deployment)
- [Phase Breakdown](#phase-breakdown)
- [API Routes](#api-routes)
- [Contributing](#contributing)

---

## Overview

HireFlow AI is a full-stack SaaS platform that helps job seekers find, apply for, and track jobs using AI. It combines:

- **AI Job Matching** — Finds jobs that match your skills and experience
- **Resume Studio** — Build, edit, and export ATS-optimized resumes
- **Job Tailoring Engine** — Rewrites your resume for each specific job posting
- **Application Tracker** — Kanban + table view to track every application
- **AI Interview Prep** — Generates tailored interview questions and answers
- **Billing & Subscriptions** — Stripe-powered FREE/PRO/FASTHIRE plans
- **SEO Landing Pages** — Targeting high-intent job search keywords
- **Referral System** — Invite friends and earn rewards
- **Analytics** — PostHog funnel tracking
- **Error Monitoring** — Sentry integration

---

## Features

### 🎯 Core Features
| Feature | Description |
|---------|-------------|
| LinkedIn Import | Import profile data via LinkedIn OAuth |
| AI Job Matching | GPT-powered job recommendations based on your profile |
| Resume Builder | 3 templates (ATS, Professional, Fast Apply) with live preview |
| Resume Export | PDF, DOCX, and plain text export |
| Job Tailoring | AI rewrites resume bullets to match job descriptions |
| Match Score | ATS compatibility score for each tailored resume |
| Application Tracker | Kanban board + table view with status tracking |
| Interview Prep | AI-generated questions and STAR-format answers |
| Notes & Timeline | Per-application notes and activity timeline |

### 💳 Subscription Plans
| Plan | Price | Tailoring/mo | AI Prep | Features |
|------|-------|-------------|---------|---------|
| **FREE** | $0 | 3 | ❌ | Basic job matching, 1 resume |
| **PRO** | $19/mo | 25 | ✅ | All features, priority matching |
| **FASTHIRE** | $15/mo | 50 | ✅ | Everything + fast-track applications |

### 📈 Growth Features
- **Referral System** — Unique referral codes, invite by email or social share
- **Success Stories** — Social proof page with real user testimonials
- **SEO Landing Pages** — Targeting "warehouse jobs Dallas", "nurse jobs near me", etc.

### 🔒 Security & Reliability
- Security headers (CSP, HSTS, X-Frame-Options)
- Rate limiting on all API routes (30 req/min general, 10 req/min AI)
- Sentry error monitoring with session replay
- Skeleton loaders for all dashboard pages
- Error boundaries with graceful fallbacks
- Row Level Security (RLS) on all Supabase tables

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 (strict mode) |
| **Styling** | Tailwind CSS v4 + shadcn/ui v4 |
| **UI Components** | @base-ui/react (no asChild — uses render prop) |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (Email, Google, LinkedIn OAuth) |
| **Payments** | Stripe v17 (API: 2026-03-25.dahlia) |
| **AI** | OpenAI GPT-4o |
| **Analytics** | PostHog |
| **Error Monitoring** | Sentry |
| **Deployment** | Vercel |
| **Email** | Supabase (transactional) |

---

## Project Structure

```
hireflow-ai/
├── src/
│   ├── app/
│   │   ├── (public)/              # Public routes (no auth required)
│   │   │   ├── page.tsx           # Landing page
│   │   │   ├── pricing/           # Pricing page
│   │   │   ├── success-stories/   # Success stories page
│   │   │   └── jobs/[category]/[location]/  # SEO job landing pages
│   │   ├── (app)/
│   │   │   └── dashboard/         # Protected dashboard routes
│   │   │       ├── page.tsx       # Dashboard home
│   │   │       ├── jobs/          # Job search & matching
│   │   │       ├── resume/        # Resume Studio
│   │   │       ├── tailoring/     # Job Tailoring Engine
│   │   │       ├── tracker/       # Application Tracker
│   │   │       ├── insights/      # Career insights
│   │   │       ├── billing/       # Subscription management
│   │   │       ├── referrals/     # Referral system
│   │   │       ├── profile/       # User profile
│   │   │       └── settings/      # App settings
│   │   ├── api/
│   │   │   └── webhooks/stripe/   # Stripe webhook handler
│   │   ├── auth/                  # Auth callbacks
│   │   ├── onboarding/            # User onboarding wizard
│   │   ├── layout.tsx             # Root layout (PostHog, metadata)
│   │   ├── sitemap.ts             # Dynamic sitemap
│   │   ├── robots.ts              # robots.txt
│   │   └── global-error.tsx       # Global error boundary
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components + skeletons
│   │   ├── analytics/             # PostHog provider + page view tracker
│   │   ├── billing/               # Upgrade modal
│   │   ├── jobs/                  # Job card components
│   │   ├── referral/              # Invite friends component
│   │   ├── resume/                # Resume editor sections + templates
│   │   ├── tailoring/             # Tailoring results
│   │   ├── tracker/               # Kanban, table, application detail
│   │   ├── app-sidebar.tsx        # Dashboard sidebar
│   │   ├── app-navbar.tsx         # Dashboard navbar
│   │   ├── public-navbar.tsx      # Public navbar
│   │   └── public-footer.tsx      # Public footer
│   ├── lib/
│   │   ├── supabase/              # Supabase client (client + server)
│   │   ├── auth-actions.ts        # Auth server actions
│   │   ├── job-actions.ts         # Job search server actions
│   │   ├── resume-actions.ts      # Resume CRUD server actions
│   │   ├── tailoring-actions.ts   # AI tailoring server actions
│   │   ├── tailoring-engine.ts    # Core AI tailoring logic
│   │   ├── tracker-actions.ts     # Application tracker server actions
│   │   ├── stripe-actions.ts      # Stripe billing server actions
│   │   ├── stripe-config.ts       # Stripe plans config
│   │   ├── referral-actions.ts    # Referral system server actions
│   │   ├── rate-limit.ts          # Rate limiting utility
│   │   └── types.ts               # Shared TypeScript types
│   └── middleware.ts              # Auth + rate limiting middleware
├── supabase/
│   ├── schema.sql                 # Phase 1-4 schema
│   ├── phase5-tracker-schema.sql  # Application tracker tables
│   ├── phase6-stripe-schema.sql   # Subscriptions + usage tables
│   └── phase7-referral-schema.sql # Referral system tables
├── sentry.client.config.ts        # Sentry client config
├── sentry.server.config.ts        # Sentry server config
├── sentry.edge.config.ts          # Sentry edge config
├── next.config.ts                 # Next.js config + security headers
├── vercel.json                    # Vercel deployment config
└── .env.local                     # Environment variables (not committed)
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm or pnpm
- Supabase account
- Stripe account
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/dipak1992/HireFlowAI.git
cd HireFlowAI/hireflow-ai

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file in the `hireflow-ai/` directory:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=sk-...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_FASTHIRE_PRICE_ID=price_...

# PostHog (optional)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Sentry (optional)
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...

# Google OAuth (optional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# LinkedIn OAuth (optional)
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...

# Google Search Console (optional)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=...
```

---

## Database Setup

Run the SQL files in order in your Supabase SQL Editor:

```bash
# 1. Core schema (users, profiles, jobs, resumes)
supabase/schema.sql

# 2. Application tracker
supabase/phase5-tracker-schema.sql

# 3. Stripe subscriptions
supabase/phase6-stripe-schema.sql

# 4. Referral system
supabase/phase7-referral-schema.sql
```

### Key Tables
| Table | Description |
|-------|-------------|
| `profiles` | User profile data |
| `resumes` | Resume documents |
| `saved_jobs` | User's saved jobs |
| `applications` | Job applications |
| `application_notes` | Notes per application |
| `interviews` | Interview records |
| `subscriptions` | Stripe subscription data |
| `usage_logs` | Feature usage tracking |
| `referral_codes` | Unique referral codes |
| `referrals` | Referral tracking |

---

## Stripe Setup

1. Create products in Stripe Dashboard:
   - **PRO Plan**: $19/month recurring
   - **FASTHIRE Plan**: $15/month recurring

2. Copy the Price IDs to your `.env.local`

3. Set up webhook endpoint:
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
     - `invoice.payment_succeeded`

4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

---

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd hireflow-ai
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Environment Variables on Vercel

Add all variables from `.env.local` to your Vercel project settings under **Settings → Environment Variables**.

### PostHog Proxy (Recommended)

The `vercel.json` includes PostHog proxy rewrites to avoid ad blockers:
```json
{
  "rewrites": [
    { "source": "/ingest/static/(.*)", "destination": "https://us-assets.i.posthog.com/static/$1" },
    { "source": "/ingest/(.*)", "destination": "https://us.i.posthog.com/$1" }
  ]
}
```

Update your PostHog host to `/ingest` in production.

---

## Phase Breakdown

| Phase | Features | Status |
|-------|---------|--------|
| **Phase 1** | Auth, onboarding, LinkedIn import, base UI | ✅ Complete |
| **Phase 2** | Resume Studio (builder, templates, export) | ✅ Complete |
| **Phase 3** | Job Tailoring Engine (AI resume rewriting) | ✅ Complete |
| **Phase 4** | Job Dashboard (search, match, save) | ✅ Complete |
| **Phase 5** | Application Tracker (kanban, notes, AI prep) | ✅ Complete |
| **Phase 6** | Stripe Billing (FREE/PRO/FASTHIRE plans) | ✅ Complete |
| **Phase 7** | SEO, Growth, Analytics, Reliability, Deploy | ✅ Complete |

---

## API Routes

| Route | Method | Description | Rate Limit |
|-------|--------|-------------|-----------|
| `/api/webhooks/stripe` | POST | Stripe webhook handler | 100/min |

All other data operations use **Next.js Server Actions** (no REST API needed).

---

## Key Technical Decisions

### shadcn/ui v4 + @base-ui/react
This project uses shadcn v4 which is built on `@base-ui/react`. Key differences:
- **No `asChild` prop** — use `render` prop instead
- `<Button render={<Link href="/path" />}>Text</Button>`
- `<DropdownMenuTrigger render={<Button variant="ghost">...</Button>} />`

### Stripe v17 Type Compatibility
Stripe v17 SDK has breaking type changes. We use `unknown as Record<string, unknown>` casting for subscription fields that moved in the new API version.

### Server Actions Pattern
All data mutations use Next.js Server Actions with `"use server"` directive. No separate API routes needed for CRUD operations.

### Supabase SSR
Uses `@supabase/ssr` with separate client/server utilities:
- `src/lib/supabase/client.ts` — browser client
- `src/lib/supabase/server.ts` — server/RSC client

---

## SEO Landing Pages

Targeting high-intent job search keywords:

| URL | Target Keyword |
|-----|---------------|
| `/jobs/warehouse-jobs/dallas-tx` | warehouse jobs in Dallas TX |
| `/jobs/warehouse-jobs/houston-tx` | warehouse jobs in Houston TX |
| `/jobs/remote-software-jobs/texas` | remote software jobs Texas |
| `/jobs/remote-software-jobs/united-states` | remote software jobs USA |
| `/jobs/nurse-jobs/near-me` | nurse jobs near me |
| `/jobs/nurse-jobs/dallas-tx` | nurse jobs Dallas TX |
| `/jobs/nurse-jobs/new-york-ny` | nurse jobs New York |
| `/jobs/software-engineer-jobs/san-francisco-ca` | software engineer jobs SF |
| `/jobs/software-engineer-jobs/austin-tx` | software engineer jobs Austin |

Each page includes:
- Unique H1, meta title, meta description
- JSON-LD structured data (JobPosting schema)
- FAQ section with relevant Q&A
- Top employers, requirements, benefits
- Related searches sidebar
- CTA to sign up

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Support

- 📧 Email: support@hireflow.ai
- 🐛 Issues: [GitHub Issues](https://github.com/dipak1992/HireFlowAI/issues)
- 📖 Docs: Coming soon

---

<p align="center">Built with ❤️ using Next.js, Supabase, and OpenAI</p>
