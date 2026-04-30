// src/lib/email-alerts.ts
// Job alert email using Resend

import { Resend } from "resend";
import type { NormalizedJob } from "@/lib/jsearch-types";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "HireFlow AI <noreply@hireflow.ai>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hireflow.ai";

// ─── Send job alert email ─────────────────────────────────────────────────────

export async function sendJobAlertEmail({
  toEmail,
  userName,
  alertQuery,
  alertLocation,
  jobs,
  frequency,
  alertId,
}: {
  toEmail: string;
  userName: string;
  alertQuery: string;
  alertLocation: string;
  jobs: NormalizedJob[];
  frequency: "daily" | "weekly";
  alertId: string;
}): Promise<{ success: boolean; error: string | null }> {
  if (jobs.length === 0) {
    return { success: true, error: null }; // Nothing to send
  }

  const locationDisplay = alertLocation || "Anywhere";
  const frequencyLabel = frequency === "daily" ? "Daily" : "Weekly";
  const unsubscribeUrl = `${APP_URL}/dashboard/jobs?manage_alerts=true`;
  const dashboardUrl = `${APP_URL}/dashboard/jobs`;

  // Build job listing HTML
  const jobsHtml = jobs
    .slice(0, 10)
    .map((job) => {
      const salaryText =
        job.salary_min && job.salary_max
          ? `$${Math.round(job.salary_min / 1000)}k–$${Math.round(job.salary_max / 1000)}k`
          : "";

      const locationText = job.is_remote
        ? "Remote"
        : job.location || locationDisplay;

      const postedText = job.posted_at
        ? new Date(job.posted_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "";

      return `
<div style="border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin-bottom:12px;background:#ffffff;">
  <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
    <div style="flex:1;">
      <h3 style="font-size:15px;font-weight:600;color:#111827;margin:0 0 4px;">${escapeHtml(job.title)}</h3>
      <p style="font-size:13px;color:#6b7280;margin:0 0 8px;">
        ${escapeHtml(job.company)} · ${escapeHtml(locationText)}
        ${postedText ? ` · ${postedText}` : ""}
      </p>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;">
        <span style="background:#f3f4f6;color:#374151;font-size:11px;font-weight:500;padding:2px 8px;border-radius:20px;">
          ${job.job_type === "FULLTIME" ? "Full-time" : job.job_type === "PARTTIME" ? "Part-time" : job.job_type === "CONTRACTOR" ? "Contract" : job.job_type}
        </span>
        ${job.is_remote ? '<span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:500;padding:2px 8px;border-radius:20px;">Remote</span>' : ""}
        ${salaryText ? `<span style="background:#dbeafe;color:#1d4ed8;font-size:11px;font-weight:500;padding:2px 8px;border-radius:20px;">${salaryText}</span>` : ""}
      </div>
      ${
        job.description
          ? `<p style="font-size:12px;color:#6b7280;margin:0 0 10px;line-height:1.5;">${escapeHtml(job.description.slice(0, 150))}...</p>`
          : ""
      }
    </div>
    ${
      job.company_logo
        ? `<img src="${job.company_logo}" alt="${escapeHtml(job.company)}" style="width:44px;height:44px;border-radius:8px;object-fit:contain;border:1px solid #e5e7eb;background:#fff;padding:4px;flex-shrink:0;" />`
        : ""
    }
  </div>
  <div style="display:flex;gap:10px;align-items:center;">
    <a href="${job.apply_url}" style="display:inline-block;background:#2563eb;color:#ffffff;font-weight:600;font-size:13px;padding:8px 16px;border-radius:6px;text-decoration:none;">
      Apply Now →
    </a>
    <a href="${APP_URL}/signup" style="font-size:12px;color:#6b7280;text-decoration:none;">
      Tailor resume with AI
    </a>
  </div>
</div>`;
    })
    .join("");

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: toEmail,
      subject: `${frequencyLabel} Job Alert: ${jobs.length} new ${alertQuery} jobs${alertLocation ? ` in ${alertLocation}` : ""}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Job Alert — HireFlow AI</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:24px;">
      <h1 style="font-size:22px;font-weight:700;color:#111827;margin:0;">HireFlow AI</h1>
      <p style="color:#6b7280;font-size:13px;margin:4px 0 0;">Your ${frequencyLabel} Job Alert</p>
    </div>

    <!-- Alert Summary -->
    <div style="background:#eff6ff;border-radius:10px;padding:16px;margin-bottom:20px;border:1px solid #bfdbfe;">
      <p style="font-size:14px;font-weight:600;color:#1e40af;margin:0 0 4px;">
        🔔 ${jobs.length} new job${jobs.length !== 1 ? "s" : ""} for "${escapeHtml(alertQuery)}"
      </p>
      <p style="font-size:13px;color:#3b82f6;margin:0;">
        📍 ${escapeHtml(locationDisplay)} · ${frequencyLabel} digest
      </p>
    </div>

    <!-- CTA Banner -->
    <div style="background:#ffffff;border-radius:10px;border:1px solid #e5e7eb;padding:14px 16px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;">
      <div>
        <p style="font-size:13px;font-weight:600;color:#111827;margin:0;">🚀 Get 3x more callbacks</p>
        <p style="font-size:12px;color:#6b7280;margin:2px 0 0;">Tailor your resume to each job with AI</p>
      </div>
      <a href="${APP_URL}/signup" style="display:inline-block;background:#2563eb;color:#ffffff;font-weight:600;font-size:12px;padding:8px 14px;border-radius:6px;text-decoration:none;white-space:nowrap;">
        Try Free →
      </a>
    </div>

    <!-- Job Listings -->
    <div style="margin-bottom:20px;">
      ${jobsHtml}
    </div>

    <!-- View All Button -->
    <div style="text-align:center;margin-bottom:24px;">
      <a href="${dashboardUrl}" style="display:inline-block;background:#111827;color:#ffffff;font-weight:600;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;">
        View All Jobs on HireFlow AI →
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align:center;border-top:1px solid #e5e7eb;padding-top:16px;">
      <p style="color:#9ca3af;font-size:12px;margin:0 0 6px;">
        You're receiving this because you set up a job alert on HireFlow AI.
      </p>
      <p style="color:#9ca3af;font-size:12px;margin:0;">
        <a href="${unsubscribeUrl}" style="color:#9ca3af;">Manage Alerts</a>
        &nbsp;·&nbsp;
        <a href="${APP_URL}/dashboard" style="color:#9ca3af;">Dashboard</a>
        &nbsp;·&nbsp;
        © ${new Date().getFullYear()} HireFlow AI
      </p>
    </div>

  </div>
</body>
</html>
      `.trim(),
    });

    if (error) {
      console.error("Job alert email error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Job alert email exception:", err);
    return { success: false, error: "Failed to send job alert email" };
  }
}

// ─── HTML escape helper ───────────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
