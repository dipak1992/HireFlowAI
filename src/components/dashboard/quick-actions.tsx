import Link from "next/link";
import {
  Briefcase,
  FileText,
  Target,
  BookOpen,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  Zap,
} from "lucide-react";

const colorMap = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
  violet: "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
  orange: "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
} as const;

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
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-lg shrink-0 ${colorMap[color]}`}
      >
        {icon}
      </div>
      <span className="text-sm font-medium flex-1">{label}</span>
      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors shrink-0" />
    </Link>
  );
}

export function QuickActions({ isPro }: { isPro: boolean }) {
  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <div className="rounded-2xl border bg-card p-5 space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Quick Actions
        </h3>
        <div className="space-y-1.5">
          <QuickActionLink
            href="/dashboard/jobs"
            icon={<Briefcase className="h-4 w-4" />}
            label="Find Jobs Near Me"
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

      {/* Upgrade nudge — only for free users */}
      {!isPro && (
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/6 to-indigo-50/50 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
            <h3 className="font-semibold text-sm">Upgrade to Pro</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Unlock unlimited resume tailoring, AI interview prep, and priority
            job alerts.
          </p>
          <Link
            href="/dashboard/billing"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            View Plans
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Pro tip */}
      <div className="rounded-2xl border bg-card p-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <h3 className="font-semibold text-sm">Pro Tip</h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Tailor your resume for each job posting to increase your ATS match
          score by up to 40%.
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
  );
}
