import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Briefcase,
  FileText,
  TrendingUp,
  Target,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Circle,
  ChevronRight,
  Zap,
  Sparkles,
  BookOpen,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  // Determine onboarding completion
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

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome back, {firstName}! 👋
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Here&apos;s an overview of your job search progress.
          </p>
        </div>
        <Link
          href="/dashboard/jobs"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
        >
          <Zap className="h-4 w-4" />
          Find Jobs
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Job Matches"
          value="0"
          description="New this week"
          icon={<Target className="h-4 w-4" />}
          color="blue"
        />
        <StatCard
          title="Applications"
          value="0"
          description="Total sent"
          icon={<Briefcase className="h-4 w-4" />}
          color="violet"
        />
        <StatCard
          title="Resume Score"
          value="--"
          description="ATS compatibility"
          icon={<FileText className="h-4 w-4" />}
          color="emerald"
        />
        <StatCard
          title="Profile Views"
          value="0"
          description="Last 30 days"
          icon={<TrendingUp className="h-4 w-4" />}
          color="orange"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Onboarding Checklist — spans 3 cols */}
        <div className="lg:col-span-3 rounded-xl border bg-card p-6 space-y-5">
          <div className="flex items-center justify-between">
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
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-2">
            {steps.map((step, i) => (
              <Link
                key={step.id}
                href={step.href}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all group ${
                  step.done
                    ? "bg-muted/30 border-border/50 opacity-70"
                    : "bg-card border-border hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm"
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
                  <p
                    className={`text-sm font-medium ${
                      step.done ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {step.description}
                  </p>
                </div>
                {!step.done && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0" />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions — spans 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          {/* Quick Actions Card */}
          <div className="rounded-xl border bg-card p-5 space-y-3">
            <h3 className="font-semibold text-sm">Quick Actions</h3>
            <div className="space-y-2">
              <QuickActionLink
                href="/dashboard/jobs"
                icon={<Briefcase className="h-4 w-4" />}
                label="Browse Job Matches"
                color="blue"
              />
              <QuickActionLink
                href="/dashboard/resume"
                icon={<FileText className="h-4 w-4" />}
                label="Build Resume"
                color="violet"
              />
              <QuickActionLink
                href="/dashboard/tailoring"
                icon={<Target className="h-4 w-4" />}
                label="Tailor for a Job"
                color="emerald"
              />
              <QuickActionLink
                href="/dashboard/tracker"
                icon={<BookOpen className="h-4 w-4" />}
                label="Track Applications"
                color="orange"
              />
            </div>
          </div>

          {/* Upgrade nudge for free users */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm text-primary">Upgrade to Pro</h3>
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
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-base">Recent Activity</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">No activity yet</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            Start by completing your profile and browsing job matches.
          </p>
          <Link
            href="/dashboard/jobs"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Browse Jobs
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const colorMap = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
  violet: "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
  orange: "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
} as const;

function StatCard({
  title,
  value,
  description,
  icon,
  color,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: keyof typeof colorMap;
}) {
  return (
    <div className="rounded-xl border bg-card p-5 space-y-3 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
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
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 border border-border hover:border-primary/30 hover:bg-primary/5 transition-all group"
    >
      <div className={`flex h-7 w-7 items-center justify-center rounded-lg shrink-0 ${colorMap[color]}`}>
        {icon}
      </div>
      <span className="text-sm font-medium flex-1">{label}</span>
      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
    </Link>
  );
}
