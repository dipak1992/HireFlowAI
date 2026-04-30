import { Metadata } from "next";
import { getReferralStats } from "@/lib/referral-actions";
import { InviteFriends } from "@/components/referral/invite-friends";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Gift,
  CheckCircle,
  Clock,
  Star,
  ArrowUpRight,
} from "lucide-react";
import { PageHeader, Section, StatCard, EmptyState } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Referrals — Invite Friends & Earn Rewards",
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hireflow.ai";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    icon: Clock,
  },
  signed_up: {
    label: "Signed Up",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    icon: CheckCircle,
  },
  converted: {
    label: "Converted",
    className: "bg-primary/10 text-primary",
    icon: Star,
  },
  rewarded: {
    label: "Rewarded",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    icon: Gift,
  },
};

export default async function ReferralsPage() {
  const { stats } = await getReferralStats();

  const code = stats?.code ?? null;
  const referrals = stats?.referrals ?? [];
  const total = stats?.totalInvited ?? 0;
  const converted = stats?.totalConverted ?? 0;
  const pending = total - converted;

  return (
    <div className="max-w-4xl space-y-8">
      <PageHeader
        title="Invite Friends"
        description="Share HireFlow AI and help friends find better jobs faster."
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Total Invited"
          value={total}
          description="Friends referred"
          icon={<Users className="h-4 w-4" />}
          color="blue"
        />
        <StatCard
          title="Converted"
          value={converted}
          description="Upgraded to Pro"
          icon={<CheckCircle className="h-4 w-4" />}
          color="emerald"
        />
        <StatCard
          title="Pending"
          value={pending}
          description="Awaiting upgrade"
          icon={<Clock className="h-4 w-4" />}
          color="orange"
        />
      </div>

      {/* How It Works */}
      <Section>
        <div className="flex items-center gap-2 mb-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Gift className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold text-base">How Referrals Work</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              step: "1",
              title: "Share Your Link",
              desc: "Copy your unique referral link and share it with friends looking for jobs.",
              color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
            },
            {
              step: "2",
              title: "Friend Signs Up",
              desc: "Your friend creates a free HireFlow AI account using your link.",
              color: "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
            },
            {
              step: "3",
              title: "Both Benefit",
              desc: "When they upgrade to Pro, you both get a free month added to your plan.",
              color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold shrink-0 ${item.color}`}>
                {item.step}
              </div>
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Invite Widget */}
      {code && (
        <Section title="Your Referral Link">
          <InviteFriends referralCode={code} appUrl={APP_URL} />
        </Section>
      )}

      {/* Referral History */}
      <Section
        title="Referral History"
        description={`${total} friend${total !== 1 ? "s" : ""} invited`}
      >
        {referrals.length === 0 ? (
          <EmptyState
            icon={<Users className="h-6 w-6 text-muted-foreground" />}
            title="No referrals yet"
            description="Share your link above to start inviting friends and earning rewards."
            action={
              <a
                href="#invite"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                Get your link
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            }
          />
        ) : (
          <div className="divide-y divide-border -mx-6 -mb-6">
            {referrals.map((referral) => {
              const config =
                STATUS_CONFIG[referral.status as keyof typeof STATUS_CONFIG] ??
                STATUS_CONFIG.pending;
              const Icon = config.icon;
              return (
                <div
                  key={referral.id}
                  className="flex items-center justify-between px-6 py-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted shrink-0">
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {referral.referred_email || "Anonymous signup"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(referral.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 ${config.className}`}
                  >
                    <Icon className="h-3 w-3" />
                    {config.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Section>
    </div>
  );
}
