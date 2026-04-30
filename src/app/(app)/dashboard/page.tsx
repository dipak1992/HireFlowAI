import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ChevronRight, Zap } from "lucide-react";
import {
  getDashboardStatsAction,
  getRecentApplicationsAction,
  getOnboardingStatusAction,
} from "@/lib/dashboard-actions";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { OnboardingChecklist } from "@/components/dashboard/onboarding-checklist";
import { RecentApplications } from "@/components/dashboard/recent-applications";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, plan_id")
    .eq("id", user!.id)
    .single();

  const firstName = profile?.full_name?.split(" ")[0] || "there";
  const isPro = profile?.plan_id === "pro";

  const [stats, recentApps, onboardingStatus] = await Promise.all([
    getDashboardStatsAction(),
    getRecentApplicationsAction(),
    getOnboardingStatusAction(),
  ]);

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
      <DashboardStats stats={stats} />

      {/* ── Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left — onboarding checklist (3 cols) */}
        <div className="lg:col-span-3">
          <OnboardingChecklist status={onboardingStatus} />
        </div>

        {/* Right — quick actions (2 cols) */}
        <div className="lg:col-span-2">
          <QuickActions isPro={isPro} />
        </div>
      </div>

      {/* ── Recent Applications ── */}
      <RecentApplications applications={recentApps} />
    </div>
  );
}
