// src/app/api/cron/job-alerts/route.ts
// Daily/weekly job alert cron — runs daily at 8am UTC
// Vercel Cron: "0 8 * * *"

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { searchJobs } from "@/lib/jsearch-client";
import { sendJobAlertEmail } from "@/lib/email-alerts";
import type { JobAlert } from "@/lib/job-alerts-actions";

// Service role client — bypasses RLS for cron operations
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceClient();
  const now = new Date();
  const isMonday = now.getDay() === 1; // 0=Sunday, 1=Monday

  try {
    // Fetch all active alerts that need to be sent
    // Daily: send every day
    // Weekly: send only on Mondays
    let query = supabase
      .from("job_alerts")
      .select("*")
      .eq("is_active", true);

    if (!isMonday) {
      // On non-Monday days, only send daily alerts
      query = query.eq("frequency", "daily");
    }
    // On Mondays, send both daily and weekly alerts

    const { data: alerts, error: alertsError } = await query;

    if (alertsError) {
      console.error("Job alerts cron — fetch error:", alertsError);
      return NextResponse.json({ error: alertsError.message }, { status: 500 });
    }

    if (!alerts || alerts.length === 0) {
      return NextResponse.json({ processed: 0, message: "No alerts to send" });
    }

    let sent = 0;
    let skipped = 0;
    let errors = 0;

    for (const alert of alerts as JobAlert[]) {
      try {
        // Get user profile for email and name
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", alert.user_id)
          .single();

        if (!profile?.email) {
          skipped++;
          continue;
        }

        // Check email preferences — skip if user opted out of alerts
        const { data: emailPrefs } = await supabase
          .from("email_preferences")
          .select("job_alerts")
          .eq("user_id", alert.user_id)
          .single();

        if (emailPrefs && emailPrefs.job_alerts === false) {
          skipped++;
          continue;
        }

        // Search for new jobs matching this alert
        const { jobs, error: searchError } = await searchJobs({
          query: alert.query,
          location: alert.location || undefined,
          remote_jobs_only: alert.remote_only || undefined,
          employment_types: alert.job_types?.length > 0
            ? alert.job_types.join(",")
            : undefined,
          num_pages: 1,
          page: 1,
          date_posted: alert.frequency === "daily" ? "today" : "week",
        });

        if (searchError || jobs.length === 0) {
          skipped++;
          continue;
        }

        // Send the alert email
        const { success, error: emailError } = await sendJobAlertEmail({
          toEmail: profile.email,
          userName: profile.full_name || "there",
          alertQuery: alert.query,
          alertLocation: alert.location || "",
          jobs,
          frequency: alert.frequency,
          alertId: alert.id,
        });

        if (success) {
          // Update last_sent_at
          await supabase
            .from("job_alerts")
            .update({ last_sent_at: now.toISOString() })
            .eq("id", alert.id);
          sent++;
        } else {
          console.error(`Job alert email failed for alert ${alert.id}:`, emailError);
          errors++;
        }

        // Small delay between emails to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (alertErr) {
        console.error(`Error processing alert ${alert.id}:`, alertErr);
        errors++;
      }
    }

    console.log(`Job alerts cron complete: ${sent} sent, ${skipped} skipped, ${errors} errors`);

    return NextResponse.json({
      processed: alerts.length,
      sent,
      skipped,
      errors,
      timestamp: now.toISOString(),
    });
  } catch (err) {
    console.error("Job alerts cron — unexpected error:", err);
    return NextResponse.json(
      { error: "Cron job failed" },
      { status: 500 }
    );
  }
}
