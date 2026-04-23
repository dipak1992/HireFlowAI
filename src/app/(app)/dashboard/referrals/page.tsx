import { Metadata } from "next";
import { getReferralCode, getReferrals } from "@/lib/referral-actions";
import { InviteFriends } from "@/components/referral/invite-friends";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Gift,
  TrendingUp,
  CheckCircle,
  Clock,
  Star,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Referrals — Invite Friends & Earn Rewards",
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hireflow.ai";

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "secondary" as const, icon: Clock },
  signed_up: { label: "Signed Up", color: "secondary" as const, icon: CheckCircle },
  converted: { label: "Converted", color: "default" as const, icon: Star },
  rewarded: { label: "Rewarded", color: "default" as const, icon: Gift },
};

export default async function ReferralsPage() {
  const [{ code }, { referrals, total, converted }] = await Promise.all([
    getReferralCode(),
    getReferrals(),
  ]);

  const pending = total - converted;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Invite Friends</h1>
        <p className="text-muted-foreground mt-1">
          Share HireFlow AI with friends and help them find better jobs faster.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{total}</div>
            <div className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <Users className="h-3 w-3" />
              Total Invited
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-green-600">{converted}</div>
            <div className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Converted
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-orange-500">{pending}</div>
            <div className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <Clock className="h-3 w-3" />
              Pending
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Gift className="h-5 w-5" />
            How Referrals Work
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                title: "Share Your Link",
                desc: "Copy your unique referral link and share it with friends looking for jobs.",
              },
              {
                step: "2",
                title: "Friend Signs Up",
                desc: "Your friend creates a free HireFlow AI account using your link.",
              },
              {
                step: "3",
                title: "Both Benefit",
                desc: "When they upgrade to Pro, you both get a free month added to your plan.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {item.step}
                </div>
                <div>
                  <div className="font-semibold text-sm text-blue-900">
                    {item.title}
                  </div>
                  <div className="text-xs text-blue-700 mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invite Widget */}
      {code && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Invite Friends
          </h2>
          <InviteFriends referralCode={code} appUrl={APP_URL} />
        </div>
      )}

      {/* Referral History */}
      {referrals.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Referral History</h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {referrals.map((referral) => {
                  const config = STATUS_CONFIG[referral.status];
                  const Icon = config.icon;
                  return (
                    <div
                      key={referral.id}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <Users className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            {referral.referred_email || "Anonymous signup"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(referral.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge variant={config.color} className="gap-1">
                        <Icon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {referrals.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <h3 className="font-semibold text-muted-foreground">
              No referrals yet
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Share your link above to start inviting friends!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
