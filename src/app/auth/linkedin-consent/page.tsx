import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LinkedInConsentClient from "./linkedin-consent-client";

export default async function LinkedInConsentPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userName = user.user_metadata?.full_name || user.user_metadata?.name || "there";

  return <LinkedInConsentClient userName={userName} />;
}
