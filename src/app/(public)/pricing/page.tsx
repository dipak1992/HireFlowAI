import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, ArrowRight, Zap, Sparkles, Rocket } from "lucide-react";
import { PLANS, PLAN_ORDER } from "@/lib/stripe-config";

const PLAN_ICONS = {
  free: <Zap className="h-5 w-5" />,
  pro: <Sparkles className="h-5 w-5" />,
  fasthire: <Rocket className="h-5 w-5" />,
};

const PLAN_GRADIENTS = {
  free: "from-gray-50 to-gray-100 dark:from-gray-900/40 dark:to-gray-800/40",
  pro: "from-primary/10 to-primary/5",
  fasthire: "from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30",
};

const PLAN_BORDER = {
  free: "border-border",
  pro: "border-primary shadow-lg shadow-primary/10",
  fasthire: "border-orange-300 dark:border-orange-700",
};

export default function PricingPage() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">Pricing</Badge>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Find Your Perfect Plan
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free and upgrade when you need more power. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {PLAN_ORDER.map((planId) => {
            const plan = PLANS[planId];
            return (
              <div
                key={planId}
                className={cn(
                  "relative rounded-2xl border-2 overflow-hidden flex flex-col",
                  PLAN_BORDER[planId],
                  plan.popular && "md:-mt-4 md:mb-4"
                )}
              >
                {/* Popular badge */}
                {plan.badge && (
                  <div className="absolute top-0 left-0 right-0 flex justify-center">
                    <div className={cn(
                      "text-xs font-semibold px-4 py-1 rounded-b-lg",
                      planId === "pro" ? "bg-primary text-primary-foreground" : "bg-orange-500 text-white"
                    )}>
                      {plan.badge}
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className={cn("bg-gradient-to-br p-6 pt-8", PLAN_GRADIENTS[planId])}>
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl mb-3",
                    planId === "pro" ? "bg-primary text-primary-foreground" :
                    planId === "fasthire" ? "bg-orange-500 text-white" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {PLAN_ICONS[planId]}
                  </div>
                  <h2 className="text-xl font-bold">{plan.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                  <div className="mt-4 flex items-end gap-1">
                    <span className="text-4xl font-bold">{plan.priceDisplay}</span>
                    <span className="text-muted-foreground mb-1">{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="p-6 flex-1 flex flex-col">
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature.text} className="flex items-start gap-2.5">
                        {feature.included ? (
                          <CheckCircle2 className={cn(
                            "h-4 w-4 shrink-0 mt-0.5",
                            feature.highlight ? "text-primary" : "text-green-500"
                          )} />
                        ) : (
                          <XCircle className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground/40" />
                        )}
                        <span className={cn(
                          "text-sm",
                          !feature.included && "text-muted-foreground/60",
                          feature.highlight && feature.included && "font-medium"
                        )}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    {planId === "free" ? (
                      <Link
                        href="/signup"
                        className={cn(
                          buttonVariants({ variant: "outline", size: "lg" }),
                          "w-full"
                        )}
                      >
                        Get Started Free
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    ) : (
                      <Link
                        href="/signup"
                        className={cn(
                          buttonVariants({
                            variant: planId === "pro" ? "default" : "outline",
                            size: "lg",
                          }),
                          "w-full",
                          planId === "fasthire" && "border-orange-400 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30"
                        )}
                      >
                        Start with {plan.name}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ / Trust */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground">
              All paid plans include a{" "}
              <span className="font-semibold text-foreground">14-day free trial</span>.
              No credit card required to start.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              { icon: "🔒", title: "Secure Payments", desc: "Powered by Stripe. Your card data never touches our servers." },
              { icon: "🔄", title: "Cancel Anytime", desc: "No lock-in. Cancel your subscription with one click." },
              { icon: "💬", title: "Priority Support", desc: "Pro and FastHire users get priority email support." },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border p-4">
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison table */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-8">Full Feature Comparison</h2>
          <div className="rounded-2xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left px-4 py-3 font-semibold">Feature</th>
                  <th className="text-center px-4 py-3 font-semibold">Free</th>
                  <th className="text-center px-4 py-3 font-semibold text-primary">Pro</th>
                  <th className="text-center px-4 py-3 font-semibold text-orange-600">FastHire</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Resume Tailoring", free: "3/month", pro: "Unlimited", fh: "3/month" },
                  { feature: "Saved Jobs", free: "10", pro: "Unlimited", fh: "10" },
                  { feature: "Application Tracker", free: "✓", pro: "✓", fh: "✓" },
                  { feature: "Job Dashboard", free: "✓", pro: "✓", fh: "✓" },
                  { feature: "AI Interview Prep", free: "—", pro: "✓", fh: "—" },
                  { feature: "Premium PDF/DOCX Export", free: "—", pro: "✓", fh: "—" },
                  { feature: "LinkedIn Premium Analysis", free: "—", pro: "✓", fh: "—" },
                  { feature: "Salary Negotiation Tips", free: "—", pro: "✓", fh: "—" },
                  { feature: "Urgent Local Job Alerts", free: "—", pro: "—", fh: "✓" },
                  { feature: "Priority Nearby Jobs", free: "—", pro: "—", fh: "✓" },
                  { feature: "Quick Apply Tools", free: "—", pro: "—", fh: "✓" },
                ].map((row, idx) => (
                  <tr key={row.feature} className={cn("border-b last:border-0", idx % 2 === 0 ? "bg-background" : "bg-muted/20")}>
                    <td className="px-4 py-3 font-medium">{row.feature}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{row.free}</td>
                    <td className="px-4 py-3 text-center font-medium text-primary">{row.pro}</td>
                    <td className="px-4 py-3 text-center font-medium text-orange-600">{row.fh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
