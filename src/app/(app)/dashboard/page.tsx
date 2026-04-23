import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Briefcase,
  FileText,
  TrendingUp,
  Target,
  ArrowUpRight,
  ChevronRight,
  Zap,
  Sparkles,
  BookOpen,
  LayoutDashboard,
  CheckCircle2,
  Circle,
  Clock,
  Users,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const { data: preferences } = await supabase
    .from("preferences")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  const firstName = profile?.full_name?.split(" ")[0] || "there";

  const steps = [
    {
      id: "profile",
      title: "Complete your profile",
      description: "Add your name, headline, and bio",
      done: !!(profile?.full_name && profile?.headline),
      href: "/dashboard/profile",
    },
    {
      id: "preferences",
      title: "Set job preferences",
      description: "Tell us your target role and location",
      done: !!preferences?.goal,
      href: "/dashboard/profile",
    },
    {
      id: "resume",
      title: "Build your resume",
      description: "Generate an ATS-optimized resume",
      done: false,
      href: "/dashboard/resume",
    },
    {
      id: "jobs",
      title: "Browse job matches",
      description: "See AI-curated opportunities",
      done: false,
      href: "/dashboard/jobs",
    },
  ];

  const completedSteps = steps.filter((s) => s.done).length;
  const progressPct = Math.round((completedSteps / steps.length) * 100);
  const allDone = completedSteps === steps.length;

  return (
    <div className="space-y-8 max-w-6xl">
      {/* ── Welcome Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome back, {firstName} 👋
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Here&apos;s an overview of your job search progress.
          </p>
        </div>
        <Link
          href="/dashboard/jobs"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/25 transition-all"
        >
          <Zap className="h-4 w-4" />
          Find Jobs Near Me
          <ChevronRight className="h-3.5 w-3.5 opacity-70" />
        </Link>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Job Matches"
          value="0"
          description="New this week"
          icon={<Target className="h-4 w-4" />}
          color="blue"
          href="/dashboard/jobs"
        />
        <StatCard
          title="Applications"
          value="0"
          description="Total sent"
          icon={<Briefcase className="h-4 w-4" />}
          color="violet"
          href="/dashboard/tracker"
        />
        <StatCard
          title="Resume Score"
          value="--"
          description="ATS compatibility"
          icon={<FileText className="h-4 w-4" />}
          color="emerald"
          href="/dashboard/resume"
        />
        <StatCard
          title="Profile Views"
          value="0"
          description="Last 30 days"
          icon={<TrendingUp className="h-4 w-4" />}
          color="orange"
          href="/dashboard/insights"
        />
      </div>

      {/* ── Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Onboarding Checklist — 3 cols */}
        <div className="lg:col-span-3 rounded-2xl border bg-card p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-base">Get Started</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Complete these steps to unlock your full potential
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl font-bold text-primary">{progressPct}%</p>
              <p className="text-xs text-muted-foreground">complete</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-400 transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-2">
            {steps.map((step, i) => (
              <Link
                key={step.id}
                href={step.href}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all group ${
                  step.done
                    ? "bg-muted/30 border-border/40 opacity-60"
                    : "bg-card border-border hover:border-primary/30 hover:bg-primary/3 hover:shadow-sm"
                }`}
              >
                <div className="shrink-0">
                  {step.done ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-muted-foreground/30 text-[10px] font-bold text-muted-foreground">
                      {i + 1}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${step.done ? "line-through text-muted-foreground" : ""}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{step.description}</p>
                </div>
                {!step.done && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
                )}
              </Link>
            ))}
          </div>

          {allDone && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span className="font-medium">Setup complete! You&apos;re ready to start applying.</span>
            </div>
          )}
        </div>

        {/* Right column — 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          {/* Quick Actions */}
          <div className="rounded-2xl border bg-card p-5 space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider text-xs">
              Quick Actions
            </h3>
            <div className="space-y-1.5">
              <QuickActionLink href="/dashboard/jobs" icon={<Briefcase className="h-4 w-4" />} label="Find Jobs Near Me" color="blue" />
              <QuickActionLink href="/dashboard/resume" icon={<FileText className="h-4 w-4" />} label="Build Resume" color="violet" />
              <QuickActionLink href="/dashboard/tailoring" icon={<Target className="h-4 w-4" />} label="Tailor for a Job" color="emerald" />
              <QuickActionLink href="/dashboard/tracker" icon={<BookOpen className="h-4 w-4" />} label="Track Applications" color="orange" />
            </div>
          </div>

          {/* Upgrade nudge */}
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/6 to-indigo-50/50 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </div>
              <h3 className="font-semibold text-sm">Upgrade to Pro</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Unlock unlimited resume tailoring, AI interview prep, and priority job alerts.
            </p>
            <Link
              href="/dashboard/billing"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              View Plans
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Tips card */}
          <div className="rounded-2xl border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
              </div>
              <h3 className="font-semibold text-sm">Pro Tip</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tailor your resume for each job posting to increase your ATS match score by up to 40%.
            </p>
            <Link
              href="/dashboard/tailoring"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:underline"
            >
              Try Tailoring
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <div className="rounded-2xl border bg-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-base">Recent Activity</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4">
            <Clock className="h-6 w-6 text-muted-foreground/60" />
          </div>
          <p className="text-sm font-semibold">No activity yet</p>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xs leading-relaxed">
            Start by completing your profile and browsing job matches to see your activity here.
          </p>
          <Link
            href="/dashboard/jobs"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            Browse Jobs
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

const colorMap = {
  blue: {
    icon: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    ring: "hover:ring-blue-200/50",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
    ring: "hover:ring-violet-200/50",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    ring: "hover:ring-emerald-200/50",
  },
  orange: {
    icon: "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
    ring: "hover:ring-orange-200/50",
  },
} as const;

function StatCard({
  title,
  value,
  description,
  icon,
  color,
  href,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: keyof typeof colorMap;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`stat-card group ring-1 ring-transparent transition-all hover:shadow-md ${colorMap[color].ring}`}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${colorMap[color].icon} transition-transform group-hover:scale-110`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </Link>
  );
}

function QuickActionLink({
  href,
  icon,
  label,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  color: keyof typeof colorMap;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 border border-transparent hover:border-border hover:bg-muted/40 transition-all group"
    >
      <div className={`flex h-7 w-7 items-center justify-center rounded-lg shrink-0 ${colorMap[color].icon}`}>
        {icon}
      </div>
      <span className="text-sm font-medium flex-1">{label}</span>
      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors shrink-0" />
    </Link>
  );
}
