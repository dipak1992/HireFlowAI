"use client";

// src/components/referral/referral-dashboard.tsx
// Full referral UI with stats, share link, invite by email, referral history

import { useState, useEffect, useTransition } from "react";
import {
  Gift,
  Copy,
  Check,
  Mail,
  Users,
  TrendingUp,
  Star,
  Send,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Share2,
} from "lucide-react";
import { getReferralStats, sendReferralInvite } from "@/lib/referral-actions";
import type { ReferralStats, Referral } from "@/lib/referral-actions";

const STATUS_CONFIG: Record<
  Referral["status"],
  { label: string; color: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Invited",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: <Clock className="h-3 w-3" />,
  },
  signed_up: {
    label: "Signed Up",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  converted: {
    label: "Upgraded",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    icon: <TrendingUp className="h-3 w-3" />,
  },
  rewarded: {
    label: "Rewarded ✓",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
};

export function ReferralDashboard() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);
    const result = await getReferralStats();
    if (result.error) {
      setError(result.error);
    } else {
      setStats(result.stats);
    }
    setLoading(false);
  }

  function copyLink() {
    if (!stats?.referralLink) return;
    navigator.clipboard.writeText(stats.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareLink() {
    if (!stats?.referralLink) return;
    if (navigator.share) {
      navigator.share({
        title: "Join HireFlow AI",
        text: "I use HireFlow AI to tailor my resume to every job. Try it free!",
        url: stats.referralLink,
      });
    } else {
      copyLink();
    }
  }

  function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setInviteError(null);
    setInviteSuccess(false);

    startTransition(async () => {
      const result = await sendReferralInvite(inviteEmail.trim());
      if (result.error) {
        setInviteError(result.error);
      } else {
        setInviteSuccess(true);
        setInviteEmail("");
        await loadStats();
        setTimeout(() => setInviteSuccess(false), 4000);
      }
    });
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
        <XCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
        <p className="font-medium text-destructive">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Gift className="h-6 w-6 text-primary" />
          Refer Friends, Earn Credits
        </h1>
        <p className="text-muted-foreground mt-1">
          Earn <strong>3 free tailoring credits</strong> for every friend who upgrades to Pro.
          No limit on how many you can earn!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Invited</p>
          <p className="text-2xl font-bold">{stats.totalInvited}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Signed Up</p>
          <p className="text-2xl font-bold text-blue-600">{stats.totalSignedUp}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Converted</p>
          <p className="text-2xl font-bold text-purple-600">{stats.totalConverted}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Credits Earned</p>
          <p className="text-2xl font-bold text-green-600">{stats.creditsEarned}</p>
        </div>
      </div>

      {/* Reward Explanation */}
      <div className="rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 p-5">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-500" />
          How Rewards Work
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { step: "1", title: "Share your link", desc: "Send your unique referral link to friends" },
            { step: "2", title: "They sign up", desc: "Your friend creates a free HireFlow AI account" },
            { step: "3", title: "They upgrade → You earn", desc: "When they upgrade to Pro, you get 3 free credits" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shrink-0">
                {item.step}
              </span>
              <div>
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share Link */}
      <div className="rounded-xl border bg-card p-5">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Share2 className="h-4 w-4 text-primary" />
          Your Referral Link
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 rounded-lg border bg-muted/50 px-3 py-2.5 text-sm font-mono truncate">
            {stats.referralLink}
          </div>
          <button
            onClick={copyLink}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </button>
          <button
            onClick={shareLink}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Share
          </button>
        </div>

        {/* Referral Code */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Your code:</span>
          <span className="font-mono font-bold text-foreground tracking-widest bg-muted px-2 py-0.5 rounded">
            {stats.code}
          </span>
        </div>
      </div>

      {/* Invite by Email */}
      <div className="rounded-xl border bg-card p-5">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary" />
          Invite by Email
        </h3>
        <form onSubmit={handleInvite} className="flex gap-2">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="friend@example.com"
            required
            className="flex-1 rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            type="submit"
            disabled={isPending || !inviteEmail.trim()}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Send Invite
          </button>
        </form>

        {inviteError && (
          <p className="mt-2 text-sm text-destructive flex items-center gap-1.5">
            <XCircle className="h-3.5 w-3.5" />
            {inviteError}
          </p>
        )}
        {inviteSuccess && (
          <p className="mt-2 text-sm text-green-600 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Invite sent successfully!
          </p>
        )}
      </div>

      {/* Referral History */}
      <div className="rounded-xl border bg-card p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Referral History
          {stats.referrals.length > 0 && (
            <span className="ml-auto text-xs text-muted-foreground font-normal">
              {stats.referrals.length} total
            </span>
          )}
        </h3>

        {stats.referrals.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium text-muted-foreground">No referrals yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Share your link above to start earning credits!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {stats.referrals.map((referral) => {
              const statusConfig = STATUS_CONFIG[referral.status];
              return (
                <div
                  key={referral.id}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                      {(referral.referred_email || "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {referral.referred_email || "Unknown"}
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

                  <div className="flex items-center gap-3">
                    {referral.credits_granted && referral.credits_granted > 0 ? (
                      <span className="text-xs font-semibold text-green-600">
                        +{referral.credits_granted} credits
                      </span>
                    ) : null}
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig.color}`}
                    >
                      {statusConfig.icon}
                      {statusConfig.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
