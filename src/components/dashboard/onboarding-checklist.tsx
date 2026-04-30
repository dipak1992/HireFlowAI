import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";
import type { OnboardingStatus } from "@/lib/dashboard-actions";

const steps = [
  {
    id: "profile" as const,
    title: "Complete your profile",
    description: "Add your name, headline, and bio",
    key: "hasProfile" as keyof OnboardingStatus,
    href: "/dashboard/profile",
  },
  {
    id: "preferences" as const,
    title: "Set job preferences",
    description: "Tell us your target role and location",
    key: "hasPreferences" as keyof OnboardingStatus,
    href: "/dashboard/profile",
  },
  {
    id: "resume" as const,
    title: "Build or upload your resume",
    description: "Generate an ATS-optimized resume",
    key: "hasResume" as keyof OnboardingStatus,
    href: "/dashboard/resume",
  },
  {
    id: "jobs" as const,
    title: "Browse job matches",
    description: "See AI-curated opportunities",
    key: "hasBrowsedJobs" as keyof OnboardingStatus,
    href: "/dashboard/jobs",
  },
  {
    id: "applied" as const,
    title: "Track your first application",
    description: "Log an application to start tracking",
    key: "hasApplied" as keyof OnboardingStatus,
    href: "/dashboard/tracker",
  },
];

export function OnboardingChecklist({ status }: { status: OnboardingStatus }) {
  const completedCount = steps.filter((s) => status[s.key]).length;
  const progressPct = Math.round((completedCount / steps.length) * 100);
  const allDone = completedCount === steps.length;

  if (allDone) return null;

  return (
    <div className="rounded-2xl border bg-card p-6 space-y-5">
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
        {steps.map((step, i) => {
          const done = status[step.key] as boolean;
          return (
            <Link
              key={step.id}
              href={step.href}
              className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all group ${
                done
                  ? "bg-muted/30 border-border/40 opacity-60 pointer-events-none"
                  : "bg-card border-border hover:border-primary/30 hover:bg-primary/[0.03] hover:shadow-sm"
              }`}
            >
              <div className="shrink-0">
                {done ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-muted-foreground/30 text-[10px] font-bold text-muted-foreground">
                    {i + 1}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${done ? "line-through text-muted-foreground" : ""}`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {step.description}
                </p>
              </div>
              {!done && (
                <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
