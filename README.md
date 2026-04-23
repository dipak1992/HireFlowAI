# HireFlow AI — Phase 1

AI-powered job matching platform built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, and Supabase.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Auth & Database:** Supabase (PostgreSQL)
- **Icons:** Lucide React + Custom SVG icons

## Features (Phase 1)

### Authentication
- Google OAuth
- LinkedIn OAuth (OIDC)
- Email magic link

### LinkedIn Consent Flow
After LinkedIn login, users see a consent modal offering to:
1. Build their resume from LinkedIn data
2. Improve job matches
3. Speed up onboarding

Options: **Import My Profile** | **Skip** | **Upload Resume Instead**

### Public Pages
- Landing page with hero, features, and CTA
- Login page (3 auth methods)
- Signup page
- Pricing placeholder (Free / Pro / Enterprise)

### App Shell (Authenticated)
- Responsive sidebar navigation (desktop)
- Mobile sheet navigation
- Top navbar with user avatar dropdown
- Dashboard with stats and quick actions
- Profile management page
- Settings page (account, notifications, danger zone)
- Jobs placeholder page
- Resume placeholder page
- Insights placeholder page

### Onboarding Flow (4 steps)
1. **Goal:** Need Work Fast OR Grow Career
2. **Location:** City + Remote/Hybrid/Onsite/Any preference
3. **Desired Pay:** Min/Max + Salary/Hourly
4. **Job Category:** Select from 14 categories

### Database Schema
- `profiles` — User profile data with RLS
- `preferences` — Job search preferences
- `auth_providers` — Connected auth providers
- `linkedin_imports` — LinkedIn consent and imported data
- Auto-create profile trigger on signup
- Auto-update `updated_at` triggers

## Getting Started

### 1. Clone and install

```bash
cd hireflow-ai
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Run the database schema

Go to your Supabase dashboard → SQL Editor → paste and run `supabase/schema.sql`.

### 4. Configure Auth Providers

In Supabase Dashboard → Authentication → Providers:

- **Google:** Enable and add OAuth credentials from Google Cloud Console
- **LinkedIn (OIDC):** Enable LinkedIn OIDC and add credentials from LinkedIn Developer Portal
- **Email:** Enable email provider with magic link (OTP) enabled

Set the redirect URL in each provider to: `http://localhost:3000/auth/callback`

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (public)/              # Public pages with navbar/footer
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Landing page
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── pricing/page.tsx
│   ├── (app)/                 # Authenticated app shell
│   │   ├── layout.tsx         # Sidebar + navbar layout
│   │   └── dashboard/
│   │       ├── page.tsx       # Dashboard
│   │       ├── profile/page.tsx
│   │       ├── settings/page.tsx
│   │       ├── jobs/page.tsx
│   │       ├── resume/page.tsx
│   │       └── insights/page.tsx
│   ├── auth/
│   │   ├── callback/route.ts  # OAuth callback handler
│   │   └── linkedin-consent/  # LinkedIn consent flow
│   ├── onboarding/            # Onboarding wizard
│   ├── layout.tsx             # Root layout
│   └── globals.css
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── app-sidebar.tsx        # App sidebar navigation
│   ├── app-navbar.tsx         # App top navbar
│   ├── public-navbar.tsx      # Public site navbar
│   ├── public-footer.tsx      # Public site footer
│   └── icons.tsx              # Custom SVG icons
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser Supabase client
│   │   └── server.ts          # Server Supabase client
│   ├── auth-actions.ts        # Auth server actions
│   ├── linkedin-actions.ts    # LinkedIn consent actions
│   ├── onboarding-actions.ts  # Onboarding server actions
│   ├── types.ts               # TypeScript types
│   └── utils.ts               # Utility functions
├── middleware.ts               # Auth middleware
supabase/
└── schema.sql                  # Database schema
```

## License

MIT
