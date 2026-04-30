import Link from "next/link";
import { Clock, ChevronRight, Building2 } from "lucide-react";
import type { RecentApplication } from "@/lib/dashboard-actions";

const statusColors: Record<string, string> = {
  applied:
    "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  interview:
    "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",
  offer:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  rejected:
    "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  withdrawn:
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  saved:
    "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function RecentApplications({
  applications,
}: {
  applications: RecentApplication[];
}) {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-base">Recent Applications</h3>
        <Link
          href="/dashboard/tracker"
          className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
        >
          View all
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4">
            <Clock className="h-6 w-6 text-muted-foreground/60" />
          </div>
          <p className="text-sm font-semibold">No applications yet</p>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xs leading-relaxed">
            Start tracking your job applications to see them here.
          </p>
          <Link
            href="/dashboard/tracker"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            Add Application
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {applications.map((app) => (
            <Link
              key={app.id}
              href="/dashboard/tracker"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors group"
            >
              {/* Company logo / fallback */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted border overflow-hidden">
                {app.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={app.logo_url}
                    alt={app.company}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <Building2 className="h-4 w-4 text-muted-foreground/60" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{app.position}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {app.company}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                    statusColors[app.status] ?? statusColors.applied
                  }`}
                >
                  {app.status}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {timeAgo(app.applied_at)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
