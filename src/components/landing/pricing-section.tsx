// src/components/landing/pricing-section.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, X, ArrowRight } from "lucide-react";

export function PricingSection() {
  const [annual, setAnnual] = useState(false);

  const proMonthly = 19;
  const proAnnual = 190;
  const proAnnualMonthly = Math.round((proAnnual / 12) * 10) / 10;

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            Simple, transparent pricing
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Start free. Upgrade when you need unlimited tailoring.
          </p>

          {/* Annual toggle */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <span
              className={`text-sm font-medium ${
                !annual
                  ? "text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-400"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                annual
                  ? "bg-blue-600"
                  : "bg-zinc-300 dark:bg-zinc-600"
              }`}
              aria-label="Toggle annual billing"
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  annual ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium ${
                annual
                  ? "text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-400"
              }`}
            >
              Annual
            </span>
            {annual && (
              <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold">
                Save 2 months
              </span>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Free Plan */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-5">
            <div>
              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                Free
              </p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                  $0
                </span>
                <span className="text-zinc-500 text-sm">/forever</span>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Perfect to try AI resume tailoring.
              </p>
            </div>

            <Link
              href="/signup"
              className="block w-full text-center px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Start Free
            </Link>

            <ul className="space-y-2.5">
              {[
                { text: "1 resume", included: true },
                { text: "All 3 templates", included: true },
                { text: "1 AI tailoring per month", included: true },
                { text: "5 saved jobs", included: true },
                { text: "10 tracked applications", included: true },
                { text: "Text export", included: true },
                { text: "PDF & DOCX export", included: false },
                { text: "AI Interview Prep", included: false },
                { text: "Unlimited tailoring", included: false },
              ].map((feature) => (
                <li
                  key={feature.text}
                  className="flex items-center gap-2.5 text-sm"
                >
                  {feature.included ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  ) : (
                    <X className="h-4 w-4 text-zinc-300 dark:text-zinc-600 shrink-0" />
                  )}
                  <span
                    className={
                      feature.included
                        ? "text-zinc-700 dark:text-zinc-300"
                        : "text-zinc-400 dark:text-zinc-600"
                    }
                  >
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="rounded-2xl border-2 border-blue-600 bg-white dark:bg-zinc-900 p-6 space-y-5 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold">
                Most Popular
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                Pro
              </p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                  ${annual ? proAnnualMonthly.toFixed(0) : proMonthly}
                </span>
                <span className="text-zinc-500 text-sm">/month</span>
              </div>
              {annual && (
                <p className="text-xs text-zinc-500 mt-0.5">
                  Billed ${proAnnual}/year
                </p>
              )}
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                For serious job seekers who want every advantage.
              </p>
            </div>

            <Link
              href="/signup?plan=pro"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors"
            >
              Upgrade to Pro
              <ArrowRight className="h-4 w-4" />
            </Link>

            <ul className="space-y-2.5">
              {[
                "Unlimited resumes",
                "All 3 templates",
                "Unlimited AI tailoring",
                "Unlimited saved jobs",
                "Unlimited tracked applications",
                "PDF & DOCX export",
                "AI Interview Prep",
                "Salary negotiation tips",
                "Career progression insights",
                "Priority support",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2.5 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0" />
                  <span className="text-zinc-700 dark:text-zinc-300">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-400 mt-6">
          All plans include: Resume builder, job search, application tracker.
          Cancel anytime.
        </p>
      </div>
    </section>
  );
}
