"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GoogleIcon, LinkedInIcon } from "@/components/icons";
import {
  signInWithGoogle,
  signInWithLinkedIn,
  signInWithMagicLink,
} from "@/lib/auth-actions";
import { Zap, Mail, Loader2, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleMagicLink(formData: FormData) {
    setLoading(true);
    setError(null);

    const email = formData.get("email") as string;
    const result = await signInWithMagicLink(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      setSentEmail(email);
      setMagicLinkSent(true);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm">
            Start your job search with HireFlow AI
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg">Sign up</CardTitle>
            <CardDescription>
              Choose how you&apos;d like to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <form action={signInWithGoogle}>
                <Button variant="outline" className="w-full" type="submit">
                  <GoogleIcon className="h-4 w-4 mr-2" />
                  Google
                </Button>
              </form>
              <form action={signInWithLinkedIn}>
                <Button variant="outline" className="w-full" type="submit">
                  <LinkedInIcon className="h-4 w-4 mr-2" />
                  LinkedIn
                </Button>
              </form>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Magic Link Form */}
            {magicLinkSent ? (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Check your email</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    We sent a magic link to <strong>{sentEmail}</strong>
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setMagicLinkSent(false);
                    setError(null);
                  }}
                >
                  Use a different email
                </Button>
              </div>
            ) : (
              <form action={handleMagicLink} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4 mr-2" />
                  )}
                  Send Magic Link
                </Button>
              </form>
            )}

            <p className="text-xs text-center text-muted-foreground">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-foreground">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </Link>
              .
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
