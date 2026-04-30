export function DashboardSkeleton() {
  return (
    <div className="space-y-8 max-w-6xl animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-56 rounded-lg bg-muted" />
          <div className="h-4 w-72 rounded-lg bg-muted" />
        </div>
        <div className="h-10 w-36 rounded-xl bg-muted" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 rounded bg-muted" />
              <div className="h-8 w-8 rounded-lg bg-muted" />
            </div>
            <div className="h-7 w-12 rounded bg-muted" />
            <div className="h-3 w-16 rounded bg-muted" />
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Checklist skeleton */}
        <div className="lg:col-span-3 rounded-2xl border bg-card p-6 space-y-5">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="h-5 w-28 rounded bg-muted" />
              <div className="h-3 w-52 rounded bg-muted" />
            </div>
            <div className="h-8 w-12 rounded bg-muted" />
          </div>
          <div className="h-1.5 rounded-full bg-muted" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-muted/50" />
            ))}
          </div>
        </div>

        {/* Quick actions skeleton */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border bg-card p-5 space-y-3">
            <div className="h-3 w-24 rounded bg-muted" />
            <div className="space-y-1.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 rounded-xl bg-muted/50" />
              ))}
            </div>
          </div>
          <div className="rounded-2xl border bg-card p-5 space-y-3">
            <div className="h-4 w-32 rounded bg-muted" />
            <div className="h-3 w-full rounded bg-muted" />
            <div className="h-3 w-3/4 rounded bg-muted" />
          </div>
        </div>
      </div>

      {/* Recent applications skeleton */}
      <div className="rounded-2xl border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-40 rounded bg-muted" />
          <div className="h-4 w-16 rounded bg-muted" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
              <div className="h-9 w-9 rounded-lg bg-muted shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-40 rounded bg-muted" />
                <div className="h-3 w-28 rounded bg-muted" />
              </div>
              <div className="space-y-1 items-end flex flex-col">
                <div className="h-4 w-16 rounded-full bg-muted" />
                <div className="h-3 w-10 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
