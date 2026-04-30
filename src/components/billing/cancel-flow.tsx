"use client";

// src/components/billing/cancel-flow.tsx
// Multi-step cancellation flow with churn reduction offers

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  pauseSubscription,
  resumeSubscription,
  cancelSubscriptionWithSurvey,
  offerChurnDiscount,
  CANCEL_REASONS,
  type CancelReason,
} from "@/lib/churn-actions";
import { AlertTriangle, CheckCircle, Gift, Pause, X } from "lucide-react";

type Step = "reason" | "offer" | "pause" | "confirm" | "survey" | "done";

interface CancelFlowProps {
  onClose: () => void;
  onCancelled?: () => void;
}

export function CancelFlow({ onClose, onCancelled }: CancelFlowProps) {
  const [step, setStep] = useState<Step>("reason");
  const [selectedReason, setSelectedReason] = useState<CancelReason | null>(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discountApplied, setDiscountApplied] = useState(false);

  async function handleReasonNext() {
    if (!selectedReason) return;
    // Route to offer step for price-sensitive users, otherwise show pause option
    if (selectedReason === "too_expensive") {
      setStep("offer");
    } else if (selectedReason === "not_using") {
      setStep("pause");
    } else {
      setStep("confirm");
    }
  }

  async function handleAcceptDiscount() {
    setLoading(true);
    setError(null);
    const result = await offerChurnDiscount();
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setDiscountApplied(true);
      setStep("done");
    }
  }

  async function handlePause(months: 1 | 2 | 3) {
    setLoading(true);
    setError(null);
    const result = await pauseSubscription(months);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setStep("done");
    }
  }

  async function handleConfirmCancel() {
    if (!selectedReason) return;
    setLoading(true);
    setError(null);
    const result = await cancelSubscriptionWithSurvey(selectedReason, feedback || undefined);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      onCancelled?.();
      setStep("done");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-background shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-lg font-semibold">
            {step === "reason" && "Why are you leaving?"}
            {step === "offer" && "Wait — we have an offer for you"}
            {step === "pause" && "Need a break? Pause instead"}
            {step === "confirm" && "Confirm cancellation"}
            {step === "done" && (discountApplied ? "Discount applied! 🎉" : "Subscription cancelled")}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          {/* Step: Reason */}
          {step === "reason" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Help us improve by telling us why you want to cancel.
              </p>
              <div className="space-y-2">
                {CANCEL_REASONS.map((reason) => (
                  <button
                    key={reason.id}
                    onClick={() => setSelectedReason(reason.id)}
                    className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                      selectedReason === reason.id
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    {reason.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  Keep subscription
                </Button>
                <Button
                  className="flex-1"
                  disabled={!selectedReason}
                  onClick={handleReasonNext}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step: Offer (50% off) */}
          {step === "offer" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
                <Gift className="mx-auto mb-2 h-8 w-8 text-primary" />
                <p className="font-semibold text-foreground">50% off for 2 months</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Stay on Pro for just $9.50/month for the next 2 months — no commitment.
                </p>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep("confirm")}
                  disabled={loading}
                >
                  No thanks, cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleAcceptDiscount}
                  disabled={loading}
                >
                  {loading ? "Applying…" : "Claim 50% off"}
                </Button>
              </div>
            </div>
          )}

          {/* Step: Pause */}
          {step === "pause" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
                <Pause className="mb-2 h-6 w-6 text-amber-600 dark:text-amber-400" />
                <p className="font-semibold text-foreground">Pause your subscription</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Take a break and come back when you need it. Your data stays safe.
                </p>
              </div>
              <p className="text-sm font-medium">How long do you need?</p>
              <div className="grid grid-cols-3 gap-2">
                {([1, 2, 3] as const).map((months) => (
                  <button
                    key={months}
                    onClick={() => handlePause(months)}
                    disabled={loading}
                    className="rounded-lg border border-border px-3 py-3 text-center text-sm font-medium transition-colors hover:border-primary hover:bg-primary/5 disabled:opacity-50"
                  >
                    {months} month{months > 1 ? "s" : ""}
                  </button>
                ))}
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setStep("confirm")}
                disabled={loading}
              >
                Cancel instead
              </Button>
            </div>
          )}

          {/* Step: Confirm */}
          {step === "confirm" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                <AlertTriangle className="mb-2 h-5 w-5 text-destructive" />
                <p className="text-sm text-foreground">
                  Your Pro access will continue until the end of your billing period. After that,
                  you&apos;ll be downgraded to the Free plan.
                </p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Any additional feedback? (optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us how we could have done better…"
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
                  Keep subscription
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleConfirmCancel}
                  disabled={loading}
                >
                  {loading ? "Cancelling…" : "Confirm cancel"}
                </Button>
              </div>
            </div>
          )}

          {/* Step: Done */}
          {step === "done" && (
            <div className="space-y-4 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              {discountApplied ? (
                <>
                  <p className="font-semibold">Your discount has been applied!</p>
                  <p className="text-sm text-muted-foreground">
                    You&apos;ll be charged 50% less for the next 2 months. Thank you for staying!
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold">Your subscription has been cancelled.</p>
                  <p className="text-sm text-muted-foreground">
                    You&apos;ll retain Pro access until the end of your billing period. We hope to
                    see you again!
                  </p>
                </>
              )}
              <Button className="w-full" onClick={onClose}>
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
