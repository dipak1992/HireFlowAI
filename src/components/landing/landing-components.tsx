import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, ChevronRight, Zap } from "lucide-react";

/* ─── Feature Card ─────────────────────────────────────────────────────────── */
export function FeatureCard({
  icon,
  title,
  description,
  colorClass,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  colorClass: string;
}) {
  return (
    <div className="feature-card">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorClass} mb-4`}>
        {icon}
      </div>
      <h3 className="text-base font-semibold mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

/* ─── Pricing Card ─────────────────────────────────────────────────────────── */
export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  href,
  variant,
  popular,
}: {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  variant: "default" | "outline";
  popular?: boolean;
}) {
  return (
    <div className={cn(
      "premium-card p-6 flex flex-col relative",
      popular && "border-primary shadow-md ring-1 ring-primary/10 scale-[1.02]"
    )}>
      {popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            Most Popular
          </span>
        </div>
      )}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      </div>
      <div className="mb-6">
        <span className="text-3xl font-bold">{price}</span>
        <span className="text-sm text-muted-foreground ml-1">{period}</span>
      </div>
      <ul className="space-y-2.5 mb-8 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <Link href={href} className={cn(buttonVariants({ variant, size: "lg" }), "w-full")}>
        {cta}
      </Link>
    </div>
  );
}

/* ─── Dashboard Mockup ─────────────────────────────────────────────────────── */
export function DashboardMockup() {
  const stats = [
    { value: "24", label: "Matches", dotColor: "bg-blue-400", bgColor: "bg-blue-50" },
    { value: "8", label: "Applied", dotColor: "bg-violet-400", bgColor: "bg-violet-50" },
    { value: "87%", label: "Score", dotColor: "bg-emerald-400", bgColor: "bg-emerald-50" },
    { value: "2", label: "Interviews", dotColor: "bg-orange-400", bgColor: "bg-orange-50" },
  ];

  const jobs = [
    { badge: "New", badgeColor: "bg-emerald-100 text-emerald-700" },
    { badge: "Urgent", badgeColor: "bg-red-100 text-red-700" },
    { badge: null, badgeColor: "" },
  ];

  const navItems = [
    { label: "Dashboard", active: true },
    { label: "Jobs" },
    { label: "Resume" },
    { label: "Tailoring" },
    { label: "Tracker" },
  ];

  return (
    <div className="relative select-none pointer-events-none">
      <div className="absolute inset-0 bg-primary/8 blur-3xl rounded-3xl scale-95" />
      <div className="relative rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/10 overflow-hidden">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400/70" />
            <div className="h-3 w-3 rounded-full bg-yellow-400/70" />
            <div className="h-3 w-3 rounded-full bg-green-400/70" />
          </div>
          <div className="flex-1 mx-4">
            <div className="h-5 rounded-md bg-muted/60 w-48 mx-auto" />
          </div>
        </div>

        {/* Dashboard layout */}
        <div className="flex h-[400px]">
          {/* Sidebar */}
          <div className="w-40 border-r bg-sidebar/50 p-3 flex flex-col gap-1 shrink-0">
            <div className="flex items-center gap-2 px-2 py-1.5 mb-2">
              <div className="h-5 w-5 rounded bg-primary flex items-center justify-center">
                <Zap className="h-3 w-3 text-white" />
              </div>
              <div className="h-2.5 w-14 rounded bg-foreground/20" />
            </div>
            {navItems.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${item.active ? "bg-primary" : ""}`}
              >
                <div className={`h-2.5 w-2.5 rounded-sm ${item.active ? "bg-white/50" : "bg-muted-foreground/25"}`} />
                <div className={`h-2 rounded ${item.active ? "bg-white/60 w-14" : "bg-muted-foreground/25 w-10"}`} />
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 p-4 overflow-hidden bg-background/50">
            {/* Stats row */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-lg border bg-card p-2.5">
                  <div className={`h-4 w-4 rounded ${stat.bgColor} flex items-center justify-center mb-1.5`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${stat.dotColor}`} />
                  </div>
                  <div className="text-xs font-bold text-foreground">{stat.value}</div>
                  <div className="text-[9px] text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Section label */}
            <div className="text-[10px] font-semibold text-muted-foreground mb-2">Recommended Jobs</div>

            {/* Job cards */}
            <div className="space-y-2 mb-4">
              {jobs.map((job, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg border bg-card p-2.5">
                  <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center shrink-0">
                    <div className="h-3 w-3 rounded-sm bg-muted-foreground/30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="h-2.5 rounded bg-foreground/20 w-28 mb-1" />
                    <div className="h-2 rounded bg-muted-foreground/20 w-20" />
                  </div>
                  {job.badge && (
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${job.badgeColor}`}>
                      {job.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Resume score bar */}
            <div className="rounded-lg border bg-card p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="h-2 rounded bg-foreground/15 w-20" />
                <div className="text-[10px] font-bold text-emerald-600">87%</div>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500 w-[87%]" />
              </div>
              <div className="text-[9px] text-muted-foreground mt-1">ATS Resume Score</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
