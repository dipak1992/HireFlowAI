"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { signOut } from "@/lib/auth-actions";
import { GoogleIcon, LinkedInIcon } from "@/components/icons";
import { Mail, Shield, Bell, Trash2, LogOut, CheckCircle2 } from "lucide-react";
import { PageHeader, Section, LoadingState } from "@/components/ui/primitives";

export default function SettingsPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [provider, setProvider] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setEmail(user.email || "");
        setProvider(user.app_metadata?.provider || "email");
      }
      setLoading(false);
    }

    loadSettings();
  }, [supabase]);

  if (loading) {
    return <LoadingState text="Loading settings…" />;
  }

  const providerLabel =
    provider === "linkedin_oidc" ? "LinkedIn" : provider === "google" ? "Google" : "Magic Link";

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences."
      />

      {/* Account */}
      <Section
        title="Account"
        description="Your account information and login method."
      >
        <div className="space-y-4">
          {/* Email row */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted shrink-0">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground truncate">{email}</p>
              </div>
            </div>
            <Badge variant="secondary" className="shrink-0 text-emerald-700 bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          </div>

          <Separator className="opacity-50" />

          {/* Login method row */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted shrink-0">
                <Shield className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Login Method</p>
                <p className="text-sm text-muted-foreground">{providerLabel}</p>
              </div>
            </div>
            <div className="shrink-0">
              {provider === "google" && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <GoogleIcon className="h-4 w-4" />
                </div>
              )}
              {provider === "linkedin_oidc" && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0A66C2]/10">
                  <LinkedInIcon className="h-4 w-4 text-[#0A66C2]" />
                </div>
              )}
              {provider === "email" && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section
        title="Notifications"
        description="Configure how you receive notifications."
      >
        <div className="space-y-4">
          <NotificationSetting
            title="Job Matches"
            description="Get notified when new jobs match your preferences"
            defaultChecked={true}
          />
          <Separator className="opacity-50" />
          <NotificationSetting
            title="Application Updates"
            description="Receive updates on your job applications"
            defaultChecked={true}
          />
          <Separator className="opacity-50" />
          <NotificationSetting
            title="Career Tips"
            description="Weekly career insights and tips"
            defaultChecked={false}
          />
        </div>
      </Section>

      {/* Danger Zone */}
      <Section className="border-destructive/40">
        <div className="flex items-center gap-2 mb-4">
          <Trash2 className="h-4 w-4 text-destructive" />
          <h3 className="font-semibold text-base text-destructive">Danger Zone</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Sign out</p>
              <p className="text-sm text-muted-foreground">
                Sign out of your account on this device.
              </p>
            </div>
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm" className="shrink-0">
                <LogOut className="h-3.5 w-3.5 mr-1.5" />
                Sign Out
              </Button>
            </form>
          </div>

          <Separator className="opacity-50" />

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Delete account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data. This cannot be undone.
              </p>
            </div>
            <Button variant="destructive" size="sm" disabled className="shrink-0">
              Delete Account
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}

function NotificationSetting({
  title,
  description,
  defaultChecked,
}: {
  title: string;
  description: string;
  defaultChecked: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => setChecked(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
          checked ? "bg-primary" : "bg-input"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
