"use client";

import { useState, useEffect, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  XCircle,
  Zap,
  Sparkles,
  Rocket,
  CreditCard,
  ExternalLink,
  Loader2,
  ArrowRight,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { PLANS, PLAN_ORDER, type PlanId } from "@/lib/stripe-config";
import {
  getSubscription,
  getAllUsage,
  createCheckoutSession,
  createPortalSession,
  cancelSubscription,
} from "@/lib/stripe-actions";
import { cn } from "@/lib/utils";

const PLAN_ICONS: Record<PlanId, React.ReactNode> = {
  free: <Zap className="h-5 w-5" />,
  pro: <Sparkles className="h-5 w-5" />,
  fasthire: <Rocket className="h-5 w-5" />,
};

const PLAN_COLORS: Record<PlanId, string> = {
  free: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  pro: "bg-primary/10 text-primary",
  fasthire: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

interface Subscription {
  plan: PlanId;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  stripe_subscription_id: string | null;
}

export default function BillingPage() {
  const [sub, setSub] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    // Check URL params for success/cancel
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      setSuccessMsg(`🎉 Welcome to ${params.get("plan") ?? "your new plan"}! Your subscription is now active.`);
    }

    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [subData, usageData] = await Promise.all([
      getSubscription(),
      getAllUsage(),
    ]);
    setSub(subData as Subscription | null);
    setUsage(usageData as Record<string, number>);
    setLoading(false);
  };

  const handleUpgrade = (planId: PlanId) => {
    startTransition(async () => {
      const result = await createCheckoutSession(planId);
      if (result.url) window.location.href = result.url;
    });
  };

  const handleManageBilling = () => {
    startTransition(async () => {
      const result = await createPortalSession();
      if (result.url) window.location.href = result.url;
    });
  };

  const handleCancel = () => {
    if (!confirm("Cancel your subscription? You'll keep access until the end of your billing period.")) return;
    startTransition(async () => {
      await cancelSubscription();
      await loadData();
    });
  };

  const currentPlan = (sub?.plan ?? "free") as PlanId;
  const planData = PLANS[currentPlan];
  const limits = planData.limits;

  const usageItems = [
    {
      label: "Resume Tailoring",
      feature: "tailoring",
      used: usage.tailoring ?? 0,
      limit: limits.tailoring_per_month,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing & Plan</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your subscription and usage
        </p>
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="rounded-xl border border-green-200 bg-green-50 dark:bg-green-950/30 p-4 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
          <p className="text-sm text-green-700 dark:text-green-400">{successMsg}</p>
        </div>
      )}

      {/* Current Plan */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Current Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", PLAN_COLORS[currentPlan])}>
                {PLAN_ICONS[currentPlan]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-lg">{planData.name}</p>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      sub?.status === "active" ? "border-green-200 text-green-700" :
                      sub?.status === "past_due" ? "border-red-200 text-red-700" :
                      "border-gray-200 text-gray-600"
                    )}
                  >
                    {sub?.status ?? "active"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{planData.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{planData.priceDisplay}</p>
              <p className="text-xs text-muted-foreground">{planData.period}</p>
            </div>
          </div>

          {/* Billing period */}
          {sub?.current_period_end && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground rounded-lg bg-muted/40 px-3 py-2">
              <Calendar className="h-4 w-4 shrink-0" />
              {sub.cancel_at_period_end ? (
                <span>
                  Access ends on{" "}
                  <span className="font-medium text-foreground">
                    {new Date(sub.current_period_end).toLocaleDateString("en-US", {
                      month: "long", day: "numeric", year: "numeric",
                    })}
                  </span>
                </span>
              ) : (
                <span>
                  Renews on{" "}
                  <span className="font-medium text-foreground">
                    {new Date(sub.current_period_end).toLocaleDateString("en-US", {
                      month: "long", day: "numeric", year: "numeric",
                    })}
                  </span>
                </span>
              )}
            </div>
          )}

          {sub?.cancel_at_period_end && (
            <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 dark:bg-amber-950/30 rounded-lg px-3 py-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Your subscription is set to cancel at the end of the billing period.
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            {currentPlan !== "free" && sub?.stripe_subscription_id && (
              <Button variant="outline" size="sm" onClick={handleManageBilling} disabled={isPending}>
                {isPending ? <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" /> : <CreditCard className="h-3.5 w-3.5 mr-2" />}
                Manage Billing
                <ExternalLink className="h-3 w-3 ml-1.5" />
              </Button>
            )}
            {currentPlan !== "free" && !sub?.cancel_at_period_end && (
              <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isPending}
                className="text-muted-foreground hover:text-destructive">
                Cancel Subscription
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage This Month */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Usage This Month</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {usageItems.map((item) => {
            const pct = item.limit ? Math.min((item.used / item.limit) * 100, 100) : 0;
            const isUnlimited = item.limit === null;
            const isAtLimit = !isUnlimited && item.used >= (item.limit ?? 0);

            return (
              <div key={item.feature} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.label}</span>
                  <span className={cn("text-xs", isAtLimit ? "text-red-600 font-semibold" : "text-muted-foreground")}>
                    {isUnlimited ? (
                      <span className="text-primary font-medium">Unlimited ✓</span>
                    ) : (
                      `${item.used} / ${item.limit}`
                    )}
                  </span>
                </div>
                {!isUnlimited && (
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        isAtLimit ? "bg-red-500" : pct > 70 ? "bg-amber-500" : "bg-primary"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}
                {isAtLimit && (
                  <p className="text-xs text-red-600">
                    Limit reached.{" "}
                    <button onClick={() => handleUpgrade("pro")} className="underline font-medium">
                      Upgrade to Pro
                    </button>{" "}
                    for unlimited access.
                  </p>
                )}
              </div>
            );
          })}

          {/* Feature access summary */}
          <div className="pt-2 border-t space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Feature Access</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "AI Interview Prep", key: "ai_prep" as const },
                { label: "Premium Exports", key: "premium_exports" as const },
                { label: "LinkedIn Analysis", key: "linkedin_premium" as const },
                { label: "Urgent Alerts", key: "urgent_alerts" as const },
                { label: "Priority Nearby", key: "priority_nearby" as const },
                { label: "Quick Apply", key: "quick_apply" as const },
              ].map((item) => {
                const hasAccess = limits[item.key] as boolean;
                return (
                  <div key={item.key} className="flex items-center gap-2 text-xs">
                    {hasAccess ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                    )}
                    <span className={hasAccess ? "text-foreground" : "text-muted-foreground"}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade options */}
      {currentPlan === "free" && (
        <div>
          <h2 className="text-base font-semibold mb-4">Upgrade Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(["pro", "fasthire"] as PlanId[]).map((planId) => {
              const plan = PLANS[planId];
              return (
                <div
                  key={planId}
                  className={cn(
                    "rounded-xl border-2 p-5 flex flex-col gap-4",
                    planId === "pro" ? "border-primary" : "border-orange-300 dark:border-orange-700"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        planId === "pro" ? "bg-primary text-primary-foreground" : "bg-orange-500 text-white"
                      )}>
                        {PLAN_ICONS[planId]}
                      </div>
                      <span className="font-bold">{plan.name}</span>
                      {plan.badge && (
                        <Badge className={cn(
                          "text-xs",
                          planId === "pro" ? "bg-primary text-primary-foreground" : "bg-orange-500 text-white"
                        )}>
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

                  <Button
                    onClick={() => handleUpgrade(planId)}
                    disabled={isPending}
                    variant={planId === "pro" ? "default" : "outline"}
                    className={cn(
                      "w-full",
                      planId === "fasthire" && "border-orange-400 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30"
                    )}
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4 mr-2" />
                    )}
                    Upgrade to {plan.name}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
