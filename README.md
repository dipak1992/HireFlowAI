# HireFlow AI 🚀

> **AI-powered job matching, resume tailoring, and application tracking platform**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)](https://supabase.com)
[![Stripe](https://img.shields.io/badge/Stripe-v22-purple?logo=stripe)](https://stripe.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-cyan?logo=tailwindcss)](https://tailwindcss.com)
[![Sentry](https://img.shields.io/badge/Sentry-Monitoring-362D59?logo=sentry)](https://sentry.io)
[![PostHog](https://img.shields.io/badge/PostHog-Analytics-F54E00?logo=posthog)](https://posthog.com)
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
- [Database Schema Reference](#database-schema-reference)
- [Google OAuth Setup](#google-oauth-setup)
- [LinkedIn OAuth Setup](#linkedin-oauth-setup)
- [Stripe Setup](#stripe-setup)
- [Subscription Plans](#subscription-plans)
- [Resume System](#resume-system)
- [Job Tailoring Engine](#job-tailoring-engine)
- [Application Tracker](#application-tracker)
- [SEO Landing Pages](#seo-landing-pages)
- [Security & Performance](#security--performance)
- [Deployment](#deployment)
- [Phase Breakdown](#phase-breakdown)
- [API Routes](#api-routes)
- [Key Technical Decisions](#key-technical-decisions)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

---

## Overview

HireFlow AI is a full-stack SaaS platform that helps job seekers find, apply for, and track jobs using AI. It combines intelligent job matching, AI-powered resume tailoring, a full resume studio, and a comprehensive application tracker — all in one platform.

### What It Does

- **AI Job Matching** — Finds jobs that match your skills, experience, and preferences
- **Resume Studio** — Build, edit, and export ATS-optimized resumes with 3 professional templates
- **Job Tailoring Engine** — AI rewrites your resume bullets and summary for each specific job posting, with ATS compatibility scoring
- **Application Tracker** — Kanban + table view to track every application from saved → offer
- **AI Interview Prep** — Generates tailored interview questions and STAR-format answers per application
- **Billing & Subscriptions** — Stripe-powered FREE / PRO / FASTHIRE plans
- **SEO Landing Pages** — Targeting high-intent job search keywords (warehouse jobs Dallas, nurse jobs near me, etc.)
- **Referral System** — Invite friends and earn rewards
- **Analytics** — PostHog funnel tracking and page view analytics
- **Error Monitoring** — Sentry integration with session replay

---

## Features

### 🎯 Core Features

| Feature | Description |
|---------|-------------|
| **LinkedIn Import** | Import profile data via LinkedIn OAuth (positions, education, skills) |
| **AI Job Matching** | GPT-4o-powered job recommendations based on your profile and preferences |
| **Resume Builder** | 3 templates (ATS, Professional, Fast Apply) with live preview |
| **Resume Export** | PDF (via jsPDF + html2canvas), DOCX (via docx library), and plain text |
| **Job Tailoring** | AI rewrites resume bullets and summary to match job descriptions |
| **ATS Score** | ATS compatibility score (0–100) for each tailored resume |
| **Keyword Analysis** | Identifies matched and missing keywords with importance levels |
| **Application Tracker** | Kanban board + table view with status tracking |
| **Interview Prep** | AI-generated questions (behavioral, technical, situational, culture, role) |
| **Notes & Timeline** | Per-application notes with types (general, interview, follow-up, offer, rejection) |
| **Salary Tips** | AI-generated salary negotiation tips per application |
| **Career Suggestions** | AI career progression insights per application |
| **Referral System** | Unique referral codes, invite by email or social share |
| **Onboarding Wizard** | Multi-step onboarding to capture goals, location, pay preferences |

### 💳 Subscription Plans

| Plan | Price | Tailoring/mo | Saved Jobs | AI Prep | Premium Exports | Speed Features |
|------|-------|-------------|-----------|---------|-----------------|----------------|
| **Free** | $0/forever | 3 | 10 | ❌ | ❌ | ❌ |
| **Pro** | $19/month | Unlimited | Unlimited | ✅ | ✅ | ❌ |
| **FastHire** | $15/month | 3 | 10 | ❌ | ❌ | ✅ Urgent alerts, priority feed, quick apply |

### 📈 Growth Features

- **Referral System** — Unique referral codes, invite by email or social share
- **Success Stories** — Social proof page with real user testimonials
- **SEO Landing Pages** — Targeting "warehouse jobs Dallas", "nurse jobs near me", etc.
- **Blog** — Content marketing with dynamic blog posts
- **Careers Page** — Public careers/jobs listing page

### 🔒 Security & Reliability

- Security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)
- Rate limiting on all API routes (30 req/min general, 10 req/min AI)
- Sentry error monitoring with session replay (client, server, edge)
- Skeleton loaders for all dashboard pages
- Error boundaries with graceful fallbacks (`global-error.tsx`)
- Row Level Security (RLS) on all Supabase tables
- Auto-created user profiles via Supabase trigger on signup

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js (App Router) | 16.2.4 |
| **Language** | TypeScript (strict mode) | 5.x |
| **Runtime** | React | 19.2.4 |
| **Styling** | Tailwind CSS | v4 |
| **UI Components** | shadcn/ui v4 + @base-ui/react | latest |
| **Icons** | lucide-react | v1.9 |
| **Database** | Supabase (PostgreSQL) | latest |
| **Auth** | Supabase Auth (Email, Google, LinkedIn OAuth) | @supabase/ssr 0.10 |
| **Payments** | Stripe | v22 (API: 2026-03-25.dahlia) |
| **AI** | OpenAI GPT-4o | via API |
| **PDF Export** | jsPDF + html2canvas + @react-pdf/renderer | latest |
| **DOCX Export** | docx | v9.6 |
| **Analytics** | PostHog | v1.371 |
| **Error Monitoring** | Sentry | v10.50 |
| **Deployment** | Vercel | — |
| **Email** | Supabase (transactional) | — |

---

## Project Structure

```
HireFlowAI/
├── src/
│   ├── app/
│   │   ├── (public)/                    # Public routes (no auth required)
│   │   │   ├── page.tsx                 # Landing page
│   │   │   ├── pricing/page.tsx         # Pricing page
│   │   │   ├── about/page.tsx           # About page
│   │   │   ├── blog/page.tsx            # Blog index
│   │   │   ├── blog/[slug]/page.tsx     # Blog post
│   │   │   ├── careers/page.tsx         # Careers page
│   │   │   ├── contact/page.tsx         # Contact page
│   │   │   ├── success-stories/page.tsx # Success stories
│   │   │   ├── login/page.tsx           # Login page
│   │   │   ├── signup/page.tsx          # Signup page
│   │   │   ├── privacy/page.tsx         # Privacy policy
│   │   │   ├── terms/page.tsx           # Terms of service
│   │   │   ├── cookies/page.tsx         # Cookie policy
│   │   │   ├── disclaimer/page.tsx      # Disclaimer
│   │   │   └── jobs/[category]/[location]/page.tsx  # SEO job landing pages
│   │   ├── (app)/
│   │   │   └── dashboard/               # Protected dashboard routes
│   │   │       ├── page.tsx             # Dashboard home
│   │   │       ├── jobs/page.tsx        # Job search & matching
│   │   │       ├── resume/page.tsx      # Resume list
│   │   │       ├── resume/[id]/page.tsx # Resume editor
│   │   │       ├── tailoring/page.tsx   # Job Tailoring Engine
│   │   │       ├── tracker/page.tsx     # Application Tracker
│   │   │       ├── insights/page.tsx    # Career insights
│   │   │       ├── billing/page.tsx     # Subscription management
│   │   │       ├── referrals/page.tsx   # Referral system
│   │   │       ├── profile/page.tsx     # User profile
│   │   │       └── settings/page.tsx    # App settings
│   │   ├── api/
│   │   │   └── webhooks/stripe/route.ts # Stripe webhook handler
│   │   ├── auth/
│   │   │   ├── callback/route.ts        # OAuth callback handler
│   │   │   └── linkedin-consent/page.tsx # LinkedIn consent screen
│   │   ├── onboarding/page.tsx          # User onboarding wizard
│   │   ├── layout.tsx                   # Root layout (PostHog, Sentry, metadata)
│   │   ├── sitemap.ts                   # Dynamic sitemap
│   │   ├── robots.ts                    # robots.txt
│   │   └── global-error.tsx             # Global error boundary
│   ├── components/
│   │   ├── ui/                          # shadcn/ui components + skeletons + primitives
│   │   ├── analytics/                   # PostHog provider + page view tracker
│   │   ├── billing/                     # Upgrade modal
│   │   ├── jobs/                        # Saved jobs view
│   │   ├── landing/                     # Landing page components
│   │   ├── referral/                    # Invite friends component
│   │   ├── resume/                      # Resume editor sections + templates
│   │   │   ├── templates/ats-template.tsx
│   │   │   ├── templates/professional-template.tsx
│   │   │   └── templates/fast-apply-template.tsx
│   │   ├── tailoring/                   # Tailoring results component
│   │   ├── tracker/                     # Kanban board, table, application detail, add dialog
│   │   ├── app-sidebar.tsx              # Dashboard sidebar navigation
│   │   ├── app-navbar.tsx               # Dashboard top navbar
│   │   ├── public-navbar.tsx            # Public site navbar
│   │   ├── public-footer.tsx            # Public site footer
│   │   └── icons.tsx                    # Custom icon components
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                # Browser Supabase client
│   │   │   └── server.ts                # Server/RSC Supabase client
│   │   ├── auth-actions.ts              # Auth server actions (login, signup, OAuth)
│   │   ├── job-actions.ts               # Job search server actions
│   │   ├── job-types.ts                 # Job TypeScript types
│   │   ├── resume-actions.ts            # Resume CRUD server actions
│   │   ├── resume-ai-utils.ts           # AI resume utilities
│   │   ├── resume-types.ts              # Resume TypeScript types
│   │   ├── tailoring-actions.ts         # AI tailoring server actions
│   │   ├── tailoring-engine.ts          # Core AI tailoring logic (GPT-4o)
│   │   ├── tailoring-types.ts           # Tailoring TypeScript types
│   │   ├── tracker-actions.ts           # Application tracker server actions
│   │   ├── tracker-types.ts             # Tracker TypeScript types
│   │   ├── stripe-actions.ts            # Stripe billing server actions
│   │   ├── stripe-config.ts             # Stripe plans config + feature gates
│   │   ├── referral-actions.ts          # Referral system server actions
│   │   ├── linkedin-actions.ts          # LinkedIn import server actions
│   │   ├── onboarding-actions.ts        # Onboarding server actions
│   │   ├── blog-data.ts                 # Blog post data
│   │   ├── rate-limit.ts                # Rate limiting utility
│   │   ├── types.ts                     # Shared TypeScript types (Profile, Preferences, etc.)
│   │   └── utils.ts                     # Utility functions
│   └── middleware.ts                    # Auth + rate limiting middleware
├── supabase/
│   ├── schema.sql                       # Phase 1: Core schema (profiles, preferences, auth)
│   ├── phase2-resume-schema.sql         # Phase 2: Resume tables
│   ├── phase3-tailoring-schema.sql      # Phase 3: Tailoring sessions
│   ├── phase4-jobs-schema.sql           # Phase 4: Jobs + saved jobs
│   ├── phase5-tracker-schema.sql        # Phase 5: Applications, notes, interviews
│   ├── phase6-stripe-schema.sql         # Phase 6: Subscriptions + usage logs
│   └── phase7-referral-schema.sql       # Phase 7: Referral codes + tracking
├── sentry.client.config.ts              # Sentry browser config
├── sentry.server.config.ts              # Sentry server config
├── sentry.edge.config.ts                # Sentry edge runtime config
├── next.config.ts                       # Next.js config + security headers
├── vercel.json                          # Vercel deployment + PostHog proxy rewrites
├── components.json                      # shadcn/ui config
├── tsconfig.json                        # TypeScript config
├── eslint.config.mjs                    # ESLint config
└── .env.local                           # Environment variables (not committed)
```

---

## Getting Started

### Prerequisites

- **Node.js** 20+
- **npm** or **pnpm**
- [Supabase](https://supabase.com) account (free tier works)
- [Stripe](https://stripe.com) account
- [OpenAI](https://platform.openai.com) API key (GPT-4o access)

### Installation

```bash
# Clone the repository
git clone https://github.com/dipak1992/HireFlowAI.git
cd HireFlowAI

# Install dependencies
npm install

# Copy environment variables template
cp .env.local.example .env.local
# Edit .env.local with your credentials (see Environment Variables section)

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# ─── App ──────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ─── Supabase ─────────────────────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ─── OpenAI ───────────────────────────────────────────────────────────────────
OPENAI_API_KEY=sk-...

# ─── Stripe ───────────────────────────────────────────────────────────────────
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...          # $19/month Pro plan price ID
STRIPE_FASTHIRE_PRICE_ID=price_...     # $15/month FastHire plan price ID

# ─── PostHog (optional) ───────────────────────────────────────────────────────
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# ─── Sentry (optional) ────────────────────────────────────────────────────────
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...

# ─── Google OAuth (optional) ──────────────────────────────────────────────────
# Note: Google OAuth is configured in Supabase Dashboard, not via env vars.
# See Google OAuth Setup section below.

# ─── LinkedIn OAuth (optional) ────────────────────────────────────────────────
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...
NEXT_PUBLIC_LINKEDIN_ENABLED=false     # Set to true after LinkedIn app approval

# ─── Google Search Console (optional) ────────────────────────────────────────
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=...
```

---

## Database Setup

Run the SQL migration files **in order** in your Supabase SQL Editor (**Dashboard → SQL Editor → New Query**):

```
1. supabase/schema.sql                  ← Core tables (profiles, preferences, auth_providers, linkedin_imports)
2. supabase/phase2-resume-schema.sql    ← Resume tables (resumes, resume_versions)
3. supabase/phase3-tailoring-schema.sql ← Tailoring sessions
4. supabase/phase4-jobs-schema.sql      ← Jobs + saved_jobs
5. supabase/phase5-tracker-schema.sql   ← Applications, application_notes, interviews
6. supabase/phase6-stripe-schema.sql    ← Subscriptions, usage_logs
7. supabase/phase7-referral-schema.sql  ← Referral codes, referrals
```

> ⚠️ Run them in order — later schemas reference tables from earlier ones.

---

## Database Schema Reference

### Phase 1 — Core (`schema.sql`)

| Table | Description | Key Columns |
|-------|-------------|-------------|
| `profiles` | User profile data | `id`, `email`, `full_name`, `avatar_url`, `phone`, `location`, `bio`, `headline`, `onboarding_completed` |
| `preferences` | Job search preferences | `user_id`, `goal`, `location`, `desired_pay_min/max`, `pay_type`, `job_category`, `remote_preference` |
| `auth_providers` | OAuth provider connections | `user_id`, `provider` (google/linkedin/email), `provider_user_id` |
| `linkedin_imports` | LinkedIn profile import data | `user_id`, `consent_given`, `profile_data` (JSONB), `import_status` |

**Triggers:**
- `on_auth_user_created` — Auto-creates a `profiles` row when a new user signs up via Supabase Auth
- `update_*_updated_at` — Auto-updates `updated_at` timestamps on all tables

### Phase 2 — Resumes

| Table | Description |
|-------|-------------|
| `resumes` | Resume documents with full structured data (experience, education, skills, certifications, projects) |
| `resume_versions` | Version snapshots of resumes |

**Resume Templates:** `ats` | `professional` | `fast_apply`
**Resume Sources:** `scratch` | `upload` | `linkedin`

### Phase 3 — Tailoring

| Table | Description |
|-------|-------------|
| `tailoring_sessions` | AI tailoring sessions with ATS scores, keyword analysis, tailored content |

**Tailoring Statuses:** `draft` → `analyzing` → `analyzed` → `tailored` → `applied`

### Phase 4 — Jobs

| Table | Description |
|-------|-------------|
| `jobs` | Job listings |
| `saved_jobs` | User's saved/bookmarked jobs |

### Phase 5 — Application Tracker

| Table | Description |
|-------|-------------|
| `applications` | Job applications with full tracking data |
| `application_notes` | Notes per application (general, interview, follow_up, offer, rejection) |
| `interviews` | Interview records (phone, video, onsite, technical, behavioral, panel, final) |

**Application Statuses:** `saved` → `applied` → `interview` → `offer` → `rejected` → `archived`

### Phase 6 — Stripe Billing

| Table | Description |
|-------|-------------|
| `subscriptions` | Stripe subscription data per user |
| `usage_logs` | Feature usage tracking (tailoring uses, etc.) |

### Phase 7 — Referrals

| Table | Description |
|-------|-------------|
| `referral_codes` | Unique referral codes per user |
| `referrals` | Referral tracking (who referred whom) |

**All tables have Row Level Security (RLS) enabled** — users can only access their own data.

---

## Google OAuth Setup

Google OAuth lets users sign in with their Google account. This is the **recommended** social login.

### Step 1 — Create a Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click **Select a project → New Project**
3. Name it `HireFlow AI` and click **Create**

### Step 2 — Enable the Google Identity API

1. Go to **APIs & Services → Library**
2. Search for **"Google Identity Platform"** → **Enable**

### Step 3 — Configure the OAuth Consent Screen

1. Go to **APIs & Services → OAuth consent screen**
2. Select **External** → **Create**
3. Fill in App name, User support email, Developer contact email
4. Click **Save and Continue** through all steps
5. Under **Test users**, add your email for testing

### Step 4 — Create OAuth Credentials

1. Go to **APIs & Services → Credentials**
2. Click **+ Create Credentials → OAuth client ID**
3. Application type: **Web application**
4. Under **Authorized redirect URIs**, add:
   ```
   https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback
   ```
5. Click **Create** and copy the **Client ID** and **Client Secret**

### Step 5 — Enable Google in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. **Authentication → Providers → Google** → toggle **Enable**
3. Paste your **Client ID** and **Client Secret** → **Save**

> ✅ No extra env vars needed — Supabase handles Google OAuth internally.

---

## LinkedIn OAuth Setup

LinkedIn OAuth allows users to sign in with LinkedIn and import their profile data.

> ⚠️ **LinkedIn login is disabled by default** in the UI (shows "Coming Soon" badge). Enable it by setting `NEXT_PUBLIC_LINKEDIN_ENABLED=true` after completing setup.

### Step 1 — Create a LinkedIn Developer App

1. Go to [linkedin.com/developers/apps](https://www.linkedin.com/developers/apps)
2. Click **Create app**
3. Fill in App name (`HireFlow AI`), LinkedIn Page, App logo
4. Click **Create app**

### Step 2 — Configure OAuth Settings

1. In your app dashboard, go to the **Auth** tab
2. Under **OAuth 2.0 settings**, add the **Authorized redirect URL**:
   ```
   https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback
   ```
3. Copy your **Client ID** and **Client Secret**

### Step 3 — Request Required OAuth Scopes

1. Go to the **Products** tab
2. Request access to **Sign In with LinkedIn using OpenID Connect**
   - Grants: `openid`, `profile`, `email` scopes
3. Wait for approval (usually instant for OpenID Connect)

### Step 4 — Enable LinkedIn in Supabase

1. Go to Supabase Dashboard → **Authentication → Providers → LinkedIn (OIDC)** → **Enable**
2. Paste your **Client ID** and **Client Secret** → **Save**

### Step 5 — Add to Environment Variables

```env
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
NEXT_PUBLIC_LINKEDIN_ENABLED=true
```

### OAuth Troubleshooting

| Issue | Fix |
|-------|-----|
| `redirect_uri_mismatch` | Ensure the Supabase callback URL is added exactly in Google/LinkedIn app settings |
| `invalid_client` | Double-check Client ID and Secret are pasted correctly in Supabase |
| LinkedIn shows "App not approved" | Request **Sign In with LinkedIn using OpenID Connect** in the Products tab |
| Google shows "Access blocked" | Publish your OAuth consent screen (move from Testing to Production) |
| Supabase callback 404 | Verify your Supabase project URL is correct in the redirect URI |

---

## Stripe Setup

### Step 1 — Create Products in Stripe Dashboard

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com) → **Products → Add product**
2. Create **Pro Plan**:
   - Name: `HireFlow AI Pro`
   - Price: `$19.00 USD` / month (recurring)
3. Create **FastHire Plan**:
   - Name: `HireFlow AI FastHire`
   - Price: `$15.00 USD` / month (recurring)
4. Copy the **Price IDs** (format: `price_xxx`) to your `.env.local`

### Step 2 — Set Up Webhook Endpoint

1. Go to **Developers → Webhooks → Add endpoint**
2. Endpoint URL: `https://your-domain.com/api/webhooks/stripe`
3. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
   - `invoice.payment_succeeded`
4. Copy the **Signing secret** to `STRIPE_WEBHOOK_SECRET`

### Step 3 — Local Webhook Testing

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Subscription Plans

Defined in `src/lib/stripe-config.ts`:

### Free Plan — $0/forever

| Limit | Value |
|-------|-------|
| Resume tailoring | 3 uses/month |
| Saved jobs | 10 |
| AI Interview Prep | ❌ |
| Premium exports (PDF/DOCX) | ❌ |
| LinkedIn premium analysis | ❌ |
| Urgent local job alerts | ❌ |
| Priority nearby jobs | ❌ |
| Quick apply tools | ❌ |

### Pro Plan — $19/month ⭐ Most Popular

| Limit | Value |
|-------|-------|
| Resume tailoring | Unlimited |
| Saved jobs | Unlimited |
| AI Interview Prep | ✅ |
| Premium exports (PDF/DOCX) | ✅ |
| LinkedIn premium analysis | ✅ |
| Salary negotiation tips | ✅ |
| Career progression insights | ✅ |
| Urgent local job alerts | ❌ |

### FastHire Plan — $15/month 🚀 Best for Speed

| Limit | Value |
|-------|-------|
| Resume tailoring | 3 uses/month |
| Saved jobs | 10 |
| Urgent local job alerts | ✅ |
| Priority nearby jobs feed | ✅ |
| Quick apply tools | ✅ |
| AI Interview Prep | ❌ |
| Premium exports | ❌ |

---

## Resume System

The resume system (`src/lib/resume-types.ts`) supports full structured resume data:

### Resume Data Structure

```
ResumeData
├── Contact: name, email, phone, location, website, LinkedIn URL
├── Summary: professional summary text
├── Experience[]: title, company, location, dates, description, bullets[]
├── Education[]: school, degree, field, location, dates, GPA
├── Skills[]: name, level (beginner/intermediate/advanced/expert), category
├── Certifications[]: name, issuer, date, URL
└── Projects[]: name, description, URL, technologies[]
```

### Resume Templates

| Template | Best For |
|----------|---------|
| `ats` | ATS-optimized, clean single-column layout |
| `professional` | Traditional professional two-column layout |
| `fast_apply` | Compact, quick-scan layout for fast applications |

### Resume Export Formats

| Format | Library | Notes |
|--------|---------|-------|
| **PDF** | jsPDF + html2canvas | Pixel-perfect render of the template |
| **DOCX** | docx v9.6 | Editable Word document |
| **@react-pdf/renderer** | @react-pdf/renderer | Alternative PDF renderer |

---

## Job Tailoring Engine

The AI tailoring engine (`src/lib/tailoring-engine.ts`) uses GPT-4o to:

1. **Analyze** the job description against your resume
2. **Score** ATS compatibility (0–100)
3. **Identify** matched keywords (with importance: high/medium/low)
4. **Identify** missing keywords and skills (with suggestions on where to add them)
5. **Rewrite** your professional summary for the specific job
6. **Rewrite** experience bullets to highlight relevant achievements

### Tailoring Session Lifecycle

```
draft → analyzing → analyzed → tailored → applied
```

### Keyword Analysis Output

```typescript
KeywordMatch {
  keyword: string
  found_in: "summary" | "experience" | "skills" | "education" | "certifications" | "projects"
  importance: "high" | "medium" | "low"
}

MissingKeyword {
  keyword: string
  importance: "high" | "medium" | "low"
  suggestion: string  // where/how to add it
}
```

---

## Application Tracker

The tracker (`src/lib/tracker-types.ts`) provides full application lifecycle management:

### Application Statuses (Kanban Columns)

| Status | Color | Description |
|--------|-------|-------------|
| `saved` | Blue | Job saved, not yet applied |
| `applied` | Indigo | Application submitted |
| `interview` | Amber | Interview scheduled or in progress |
| `offer` | Green | Offer received |
| `rejected` | Red | Application rejected |
| `archived` | Gray | Archived/inactive |

### Interview Types

| Type | Description |
|------|-------------|
| `phone` | Phone Screen |
| `video` | Video Call |
| `onsite` | On-site Interview |
| `technical` | Technical Interview |
| `behavioral` | Behavioral Interview |
| `panel` | Panel Interview |
| `final` | Final Round |

### Application Data Fields

Each application tracks:
- Job details: title, company, website, job URL, apply URL, location, remote flag, job type
- Salary range: min, max, currency
- Status and priority (low / medium / high)
- Applied date, deadline, reminders
- Linked resume and tailoring session
- AI-generated interview questions, salary tips, career suggestions
- Notes (with types) and interview records

---

## SEO Landing Pages

Targeting high-intent job search keywords at `/jobs/[category]/[location]`:

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

## Security & Performance

### Security Headers (`next.config.ts`)

| Header | Value |
|--------|-------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-Content-Type-Options` | `nosniff` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Camera/mic disabled, geolocation self-only |
| `Content-Security-Policy` | Strict CSP allowing Stripe, PostHog, Supabase, Sentry |

### Performance Optimizations

- `compress: true` — Gzip response compression
- `poweredByHeader: false` — Remove X-Powered-By header
- `optimizePackageImports: ["lucide-react"]` — Tree-shake icon library
- Skeleton loaders on all dashboard pages for perceived performance
- PostHog proxy via Vercel rewrites to bypass ad blockers

### Rate Limiting (`src/lib/rate-limit.ts`)

- General API routes: **30 requests/minute**
- AI-powered routes: **10 requests/minute**
- Applied via `src/middleware.ts`

---

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments on every push to `main`.

### Environment Variables on Vercel

Add all variables from `.env.local` to your Vercel project:
**Settings → Environment Variables**

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

Update your PostHog host to `/ingest` in production `.env`:

```env
NEXT_PUBLIC_POSTHOG_HOST=/ingest
```

### Sentry Setup

Sentry is pre-configured for all three runtimes:
- `sentry.client.config.ts` — Browser error tracking + session replay
- `sentry.server.config.ts` — Server-side error tracking
- `sentry.edge.config.ts` — Edge runtime (middleware) error tracking

Set `NEXT_PUBLIC_SENTRY_DSN` in your environment variables to activate.

---

## Phase Breakdown

| Phase | Features | Status |
|-------|---------|--------|
| **Phase 1** | Auth (email + Google + LinkedIn OAuth), onboarding wizard, LinkedIn profile import, base UI, RLS | ✅ Complete |
| **Phase 2** | Resume Studio (builder, 3 templates, live preview, PDF/DOCX export, version history) | ✅ Complete |
| **Phase 3** | Job Tailoring Engine (AI resume rewriting, ATS scoring, keyword analysis) | ✅ Complete |
| **Phase 4** | Job Dashboard (search, AI matching, save jobs, recommended/remote/urgent tabs) | ✅ Complete |
| **Phase 5** | Application Tracker (kanban board, table view, notes, interview records, AI prep) | ✅ Complete |
| **Phase 6** | Stripe Billing (FREE/PRO/FASTHIRE plans, webhooks, usage limits, upgrade modal) | ✅ Complete |
| **Phase 7** | SEO landing pages, blog, referral system, PostHog analytics, Sentry monitoring, Vercel deploy | ✅ Complete |

---

## API Routes

| Route | Method | Description | Auth Required |
|-------|--------|-------------|---------------|
| `/api/webhooks/stripe` | POST | Stripe webhook handler (subscription events) | Stripe signature |
| `/auth/callback` | GET | OAuth callback handler (Google + LinkedIn) | — |

> All other data operations use **Next.js Server Actions** (`"use server"`) — no REST API needed for CRUD.

---

## Key Technical Decisions

### shadcn/ui v4 + @base-ui/react

This project uses shadcn v4 which is built on `@base-ui/react`. Key differences from shadcn v2/v3:
- **No `asChild` prop** — use `render` prop instead
- `<Button render={<Link href="/path" />}>Text</Button>`
- `<DropdownMenuTrigger render={<Button variant="ghost">...</Button>} />`

### Stripe v22 + API Version `2026-03-25.dahlia`

Stripe v22 SDK uses the latest API version. The webhook handler and server actions are written to handle the new subscription object shape.

### Server Actions Pattern

All data mutations use Next.js Server Actions with `"use server"` directive. Benefits:
- No separate API routes needed for CRUD
- Type-safe end-to-end
- Automatic CSRF protection
- Works with React's `useTransition` for optimistic UI

### Supabase SSR

Uses `@supabase/ssr` with separate client/server utilities:
- `src/lib/supabase/client.ts` — browser client (for client components)
- `src/lib/supabase/server.ts` — server/RSC client (for server components + actions)

### TypeScript Strict Mode

All types are defined in dedicated `*-types.ts` files:
- `src/lib/types.ts` — Profile, Preferences, AuthProvider, LinkedInImport
- `src/lib/resume-types.ts` — ResumeData, ResumeExperience, ResumeSkill, etc.
- `src/lib/tailoring-types.ts` — TailoringSession, KeywordMatch, MissingKeyword
- `src/lib/tracker-types.ts` — Application, Interview, ApplicationNote
- `src/lib/stripe-config.ts` — Plan, PlanId, PlanFeature, FeatureKey

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Description |
|--------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | Code style (formatting, no logic change) |
| `refactor:` | Code refactoring |
| `chore:` | Build process or tooling changes |

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Support

- 📧 Email: support@hireflow.ai
- 🐛 Issues: [GitHub Issues](https://github.com/dipak1992/HireFlowAI/issues)
- 📖 Docs: Coming soon

---

<p align="center">Built with ❤️ using Next.js 16, React 19, Supabase, OpenAI GPT-4o, and Stripe</p>
