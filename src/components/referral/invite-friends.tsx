"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sendReferralInvite } from "@/lib/referral-actions";
import { Copy, Check, Mail, Share2, ExternalLink } from "lucide-react";

interface InviteFriendsProps {
  referralCode: string;
  appUrl: string;
}

export function InviteFriends({ referralCode, appUrl }: InviteFriendsProps) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const referralUrl = `${appUrl}/signup?ref=${referralCode}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSending(true);
    setError(null);

    const result = await sendReferralInvite(email.trim());

    if (result.success) {
      setSent(true);
      setEmail("");
      setTimeout(() => setSent(false), 3000);
    } else {
      setError(result.error);
    }

    setSending(false);
  };

  const twitterText = encodeURIComponent(
    `I've been using HireFlow AI to find jobs faster with AI-powered matching. Try it free: ${referralUrl}`
  );
  const linkedinUrl = encodeURIComponent(referralUrl);

  return (
    <div className="space-y-4">
      {/* Referral Link */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Share2 className="h-4 w-4 text-blue-500" />
            Your Referral Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={referralUrl}
              readOnly
              className="font-mono text-sm bg-muted"
            />
            <Button
              onClick={handleCopy}
              variant="outline"
              className="shrink-0 gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Share via:</span>
            <a
              href={`https://twitter.com/intent/tweet?text=${twitterText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs bg-sky-100 text-sky-700 hover:bg-sky-200 px-2 py-1 rounded transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              Twitter / X
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${linkedinUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              LinkedIn
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Email Invite */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-500" />
            Invite by Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendInvite} className="flex gap-2">
            <Input
              type="email"
              placeholder="friend@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={sending}
              className="flex-1"
            />
            <Button type="submit" disabled={sending || !email.trim()} className="shrink-0">
              {sending ? "Sending..." : sent ? "Sent! ✓" : "Send Invite"}
            </Button>
          </form>
          {error && (
            <p className="text-xs text-destructive mt-2">{error}</p>
          )}
          {sent && (
            <p className="text-xs text-green-600 mt-2">
              Invite sent successfully!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Referral Code Badge */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Your code:</span>
        <Badge variant="secondary" className="font-mono text-base px-3 py-1">
          {referralCode}
        </Badge>
      </div>
    </div>
  );
}
