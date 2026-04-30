import Link from "next/link";
import { Lock, ArrowUpRight, Sparkles } from "lucide-react";
import type { FeatureKey } from "@/lib/stripe-config";
import { getUpgradeMessage } from "@/lib/stripe-config";

interface UpgradeGateProps {
  feature: FeatureKey;
  /** If true, renders a full-page overlay. If false, renders an inline banner. */
  variant?: "overlay" | "banner" | "card";
  children?: React.ReactNode;
  /** Custom message override */
  message?: string;
}

export function UpgradeGate({
  feature,
  variant = "banner",
  children,
  message,
}: UpgradeGateProps) {
  const msg = message ?? getUpgradeMessage(feature);

  if (variant === "overlay") {
    return (
      <div className="relative">
        {/* Blurred content behind */}
        <div className="pointer-events-none select-none blur-sm opacity-40">
          {children}
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-primary/20 bg-card/95 backdrop-blur-sm p-6 shadow-xl text-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 mx-auto">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-base">Pro Feature</h3>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                {msg}
              </p>
            </div>
            <Link
              href="/dashboard/billing"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              Upgrade to Pro
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-indigo-50/50 dark:to-indigo-950/20 p-6 space-y-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 mx-auto">
          <Lock className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-base">Pro Feature</h3>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-xs mx-auto">
            {msg}
          </p>
        </div>
        <Link
          href="/dashboard/billing"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          Upgrade to Pro
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  // Default: banner
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 px-4 py-3">
      <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
          {msg}
        </p>
      </div>
      <Link
        href="/dashboard/billing"
        className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline"
      >
        Upgrade
        <ArrowUpRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
