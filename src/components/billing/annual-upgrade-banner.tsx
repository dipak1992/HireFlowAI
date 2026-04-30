"use client";

// src/components/billing/annual-upgrade-banner.tsx
// In-app banner promoting annual plan with savings calculation

import { useState } from "react";
import { X, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { switchToAnnual } from "@/lib/stripe-actions";

interface AnnualUpgradeBannerProps {
  monthlyPrice?: number; // current monthly price in dollars
}

export function AnnualUpgradeBanner({ monthlyPrice = 19 }: AnnualUpgradeBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (dismissed) return null;

  const annualPrice = Math.round(monthlyPrice * 12 * 0.8); // 20% off
  const monthlySavings = monthlyPrice - Math.round((annualPrice / 12) * 100) / 100;
  const annualSavings = Math.round(monthlyPrice * 12 - annualPrice);

  async function handleSwitch() {
    setLoading(true);
    setError(null);
    const result = await switchToAnnual();
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else if (result.url) {
      window.location.href = result.url;
    }
  }

  return (
    <div className="relative rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 to-violet-500/5 p-4">
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-3 rounded p-1 text-muted-foreground hover:bg-muted"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <div className="mt-0.5 rounded-lg bg-primary/10 p-2">
          <TrendingDown className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground">
            Save ${annualSavings}/year with an annual plan
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Switch to annual billing and pay just ${Math.round(annualPrice / 12)}/month —{" "}
            <span className="font-medium text-primary">save ${monthlySavings.toFixed(0)}/month</span>
          </p>
          {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
        </div>
        <Button
          size="sm"
          className="shrink-0 text-xs"
          onClick={handleSwitch}
          disabled={loading}
        >
          {loading ? "Loading…" : "Switch to Annual"}
        </Button>
      </div>
    </div>
  );
}
