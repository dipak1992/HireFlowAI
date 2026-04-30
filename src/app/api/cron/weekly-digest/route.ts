import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendWeeklyDigest } from "@/lib/email";

// Vercel Cron: runs every Monday at 9am UTC
// Schedule defined in vercel.json

export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  // Fetch all users who have weekly digest enabled
  const { data: prefs, error } = await supabase
    .from("email_preferences")
    .select(
      `
      user_id,
      profiles!inner(full_name, email, plan_id)
    `
    )
    .eq("weekly_digest", true);

  if (error) {
    console.error("[weekly-digest] fetch error", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  let sent = 0;
  let failed = 0;

  for (const pref of prefs ?? []) {
    const profile = (pref.profiles as unknown) as {
      full_name: string;
      email: string;
      plan_id: string;
    } | null;

    if (!profile?.email) continue;

    const userId = pref.user_id;
    const firstName = profile.full_name?.split(" ")[0] || "there";

    // Fetch stats for this user
    const [
      { count: applicationCount },
      { count: interviewCount },
      { count: savedJobCount },
    ] = await Promise.all([
      supabase
        .from("applications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId),
      supabase
        .from("applications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "interview"),
      supabase
        .from("saved_jobs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId),
    ]);

    try {
      await sendWeeklyDigest({
        firstName,
        email: profile.email,
        applicationCount: applicationCount ?? 0,
        interviewCount: interviewCount ?? 0,
        newJobMatches: savedJobCount ?? 0,
      });
      sent++;
    } catch (err) {
      console.error(`[weekly-digest] failed for ${profile.email}`, err);
      failed++;
    }
  }

  return NextResponse.json({
    success: true,
    sent,
    failed,
    total: (prefs ?? []).length,
  });
}
