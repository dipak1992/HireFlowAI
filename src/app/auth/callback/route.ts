import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // Determine the correct base URL for redirects.
  // On Vercel/production, x-forwarded-host is the public domain.
  // On local dev, origin is correct.
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";
  const baseUrl = isLocalEnv
    ? origin
    : forwardedHost
    ? `https://${forwardedHost}`
    : origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const provider = user.app_metadata?.provider;

        // LinkedIn OIDC — redirect to consent page
        if (provider === "linkedin_oidc") {
          return NextResponse.redirect(`${baseUrl}/auth/linkedin-consent`);
        }

        // Check if onboarding is completed
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", user.id)
          .single();

        if (!profile?.onboarding_completed) {
          return NextResponse.redirect(`${baseUrl}/onboarding`);
        }
      }

      // Successful auth — redirect to intended destination
      return NextResponse.redirect(`${baseUrl}${next}`);
    }

    // Code exchange failed — redirect to login with error
    console.error("Auth callback: code exchange failed");
    return NextResponse.redirect(
      `${baseUrl}/login?error=auth_callback_error`
    );
  }

  // No code param — redirect to login with error
  return NextResponse.redirect(`${baseUrl}/login?error=auth_callback_error`);
}
