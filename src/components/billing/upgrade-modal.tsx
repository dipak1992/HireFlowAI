"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, CheckCircle2, Sparkles, Zap, Loader2 } from "lucide-react";
import { PLANS, type PlanId } from "@/lib/stripe-config";
import { createCheckoutSession } from "@/lib/stripe-actions";
import { cn } from "@/lib/utils";

interface UpgradeModalProps {
  feature: string;
  reason: string;
  upgradeRequired: PlanId;
  onClose: () => void;
}

export default function UpgradeModal({
  feature,
  reason,
  upgradeRequired,
  onClose,
}: UpgradeModalProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>(upgradeRequired);

  const plan = PLANS[upgradeRequired];
  const altPlan = upgradeRequired === "pro" ? PLANS.fasthire : PLANS.pro;

  const handleUpgrade = (planId: PlanId) => {
    startTransition(async () => {
      const result = await createCheckoutSession(planId);
      if (result.url) {
        window.location.href = result.url;
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-background rounded-2xl shadow-2xl border w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 px-6 pt-6 pb-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 mb-3">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-lg font-bold">Upgrade to Unlock</h2>
          <p className="text-sm text-muted-foreground mt-1">{reason}</p>
        </div>

        {/* Recommended plan */}
        <div className="p-6 space-y-4">
          <div
            className={cn(
              "rounded-xl border-2 p-4 cursor-pointer transition-all",
              selectedPlan === upgradeRequired
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
            onClick={() => setSelectedPlan(upgradeRequired)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold">{plan.name}</span>
                {plan.badge && (
                  <Badge className="text-xs bg-primary text-primary-foreground">
                    {plan.badge}
                  </Badge>
                )}
              </div>
              <div className="text-right">
                <span className="text-xl font-bold">{plan.priceDisplay}</span>
                <span className="text-xs text-muted-foreground">{plan.period}</span>
              </div>
            </div>
            <ul className="space-y-1.5">
              {plan.features
                .filter((f) => f.included && f.highlight)
                .slice(0, 4)
                .map((f) => (
                  <li key={f.text} className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                    {f.text}
                  </li>
                ))}
            </ul>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={() => handleUpgrade(selectedPlan)}
            disabled={isPending}
          >
            {isPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Redirecting to checkout...</>
            ) : (
              <><Zap className="h-4 w-4 mr-2" />Upgrade to {PLANS[selectedPlan].name}</>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Cancel anytime · Secure payment via Stripe
          </p>

          <button
            onClick={onClose}
            className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
