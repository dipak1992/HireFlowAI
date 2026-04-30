import Link from "next/link";
import { Briefcase, FileText, Target, Zap, Trophy, Users } from "lucide-react";
import type { DashboardStats } from "@/lib/dashboard-actions";

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
  amber: {
    icon: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    ring: "hover:ring-amber-200/50",
  },
  rose: {
    icon: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
    ring: "hover:ring-rose-200/50",
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
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color: keyof typeof colorMap;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`group flex flex-col gap-3 rounded-2xl border bg-card p-5 ring-1 ring-transparent transition-all hover:shadow-md ${colorMap[color].ring}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-transform group-hover:scale-110 ${colorMap[color].icon}`}
        >
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </Link>
  );
}

export function DashboardStats({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatCard
        title="Applications"
        value={stats.applicationCount}
        description="Total tracked"
        icon={<Briefcase className="h-4 w-4" />}
        color="blue"
        href="/dashboard/tracker"
      />
      <StatCard
        title="Saved Jobs"
        value={stats.savedJobCount}
        description="In your list"
        icon={<Target className="h-4 w-4" />}
        color="violet"
        href="/dashboard/jobs"
      />
      <StatCard
        title="Resumes"
        value={stats.resumeCount}
        description="Created"
        icon={<FileText className="h-4 w-4" />}
        color="emerald"
        href="/dashboard/resume"
      />
      <StatCard
        title="Tailorings"
        value={stats.tailoringCount}
        description="AI optimizations"
        icon={<Zap className="h-4 w-4" />}
        color="orange"
        href="/dashboard/tailoring"
      />
      <StatCard
        title="Interviews"
        value={stats.interviewCount}
        description="Scheduled"
        icon={<Users className="h-4 w-4" />}
        color="amber"
        href="/dashboard/tracker"
      />
      <StatCard
        title="Offers"
        value={stats.offerCount}
        description="Received"
        icon={<Trophy className="h-4 w-4" />}
        color="rose"
        href="/dashboard/tracker"
      />
    </div>
  );
}
