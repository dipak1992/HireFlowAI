"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, CheckCircle2, User, Mail, Phone, MapPin, FileText } from "lucide-react";
import { PageHeader, Section, LoadingState } from "@/components/ui/primitives";
import type { Profile } from "@/lib/types";

export default function ProfilePage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data) {
          setProfile(data);
          setFullName(data.full_name || "");
          setHeadline(data.headline || "");
          setPhone(data.phone || "");
          setLocation(data.location || "");
          setBio(data.bio || "");
        }
      }
      setLoading(false);
    }

    loadProfile();
  }, [supabase]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          headline,
          phone,
          location,
          bio,
        })
        .eq("id", user.id);

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }

    setSaving(false);
  }

  if (loading) {
    return <LoadingState text="Loading profile…" />;
  }

  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your personal information and public profile."
      />

      {/* Avatar / Identity Card */}
      <Section title="Your Identity">
        <div className="flex items-center gap-5">
          <Avatar className="h-20 w-20 shrink-0 ring-2 ring-border">
            <AvatarImage src={profile?.avatar_url || ""} alt={fullName} />
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-base font-semibold truncate">
              {fullName || "Your Name"}
            </p>
            {headline && (
              <p className="text-sm text-muted-foreground truncate mt-0.5">
                {headline}
              </p>
            )}
            <div className="flex items-center gap-1.5 mt-1.5">
              <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <p className="text-sm text-muted-foreground truncate">
                {profile?.email}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Personal Information Form */}
      <Section
        title="Personal Information"
        description="This information helps us match you with better opportunities."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-1.5 text-xs font-medium">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Full Name
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headline" className="flex items-center gap-1.5 text-xs font-medium">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                Headline
              </Label>
              <Input
                id="headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Software Engineer at Acme"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-1.5 text-xs font-medium">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-1.5 text-xs font-medium">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                Location
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-xs font-medium">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself, your experience, and what you're looking for…"
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {bio.length}/500 characters
            </p>
          </div>

          <Separator className="opacity-50" />

          <div className="flex items-center gap-3">
            <Button onClick={handleSave} disabled={saving} className="min-w-[120px]">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving…
                </>
              ) : saved ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            {saved && (
              <p className="text-sm text-emerald-600 font-medium animate-fade-in-up">
                Profile updated successfully.
              </p>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}
