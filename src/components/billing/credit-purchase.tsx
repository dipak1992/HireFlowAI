"use client";

// src/components/billing/credit-purchase.tsx
// Credit package selection UI with Stripe checkout

import { useState, useTransition } from "react";
import {
  Zap,
  Star,
  Check,
  Loader2,
  CreditCard,
  ArrowRight,
  Info,
} from "lucide-react";
import { CREDIT_PACKAGES } from "@/lib/stripe-credits";
import type { CreditPackage } from "@/lib/stripe-credits";

interface CreditPurchaseProps {
  returnUrl?: string;
  onCheckout?: (packageId: string) => Promise<{ url: string | null; error: string | null }>;
}

export function CreditPurchase({ returnUrl, onCheckout }: CreditPurchaseProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>(
    CREDIT_PACKAGES.find((p) => p.popular)?.id || CREDIT_PACKAGES[0].id
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handlePurchase() {
    if (!onCheckout) return;
    setError(null);

    startTransition(async () => {
      const result = await onCheckout(selectedPackage);
      if (result.error) {
        setError(result.error);
      } else if (result.url) {
        window.location.href = result.url;
      }
    });
  }

  const selected = CREDIT_PACKAGES.find((p) => p.id === selectedPackage);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Buy Tailoring Credits
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          One-time purchase — no subscription required. Credits never expire.
        </p>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {CREDIT_PACKAGES.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            isSelected={selectedPackage === pkg.id}
            onSelect={() => setSelectedPackage(pkg.id)}
          />
        ))}
      </div>

      {/* What you get */}
      <div className="rounded-lg bg-muted/40 p-4">
        <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
          <Info className="h-4 w-4 text-primary" />
          What are tailoring credits?
        </p>
        <ul className="space-y-1.5">
          {[
            "Each credit lets you tailor your resume to one job posting",
            "AI analyzes the job description and rewrites your resume",
            "Increases your ATS score and keyword match rate",
            "Credits work on any job — no restrictions",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      {/* Purchase Button */}
      <button
        onClick={handlePurchase}
        disabled={isPending || !onCheckout}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Redirecting to checkout...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4" />
            Buy {selected?.credits} Credit{(selected?.credits || 0) !== 1 ? "s" : ""} for{" "}
            {selected?.priceDisplay}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      <p className="text-xs text-center text-muted-foreground">
        Secure checkout via Stripe · No subscription · Credits never expire
      </p>
    </div>
  );
}

// ─── Package Card ──────────────────────────────────────────────────────────────

function PackageCard({
  pkg,
  isSelected,
  onSelect,
}: {
  pkg: CreditPackage;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`relative rounded-xl border-2 p-4 text-left transition-all ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 bg-card"
      }`}
    >
      {/* Popular badge */}
      {pkg.popular && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground whitespace-nowrap">
          <Star className="h-3 w-3" />
          Most Popular
        </span>
      )}

      {/* Selected indicator */}
      <div
        className={`absolute top-3 right-3 h-4 w-4 rounded-full border-2 transition-colors ${
          isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
        }`}
      >
        {isSelected && (
          <Check className="h-2.5 w-2.5 text-primary-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        )}
      </div>

      <div className="mb-2">
        <p className="font-semibold text-sm">{pkg.name}</p>
        <p className="text-xs text-muted-foreground">{pkg.description}</p>
      </div>

      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-2xl font-bold">{pkg.priceDisplay}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <Zap className="h-3.5 w-3.5 text-yellow-500" />
        <span className="text-sm font-semibold">
          {pkg.credits} credit{pkg.credits !== 1 ? "s" : ""}
        </span>
      </div>

      <p className="text-xs text-muted-foreground mt-1">{pkg.perCreditPrice}</p>
    </button>
  );
}
