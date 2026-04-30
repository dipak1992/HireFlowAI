// src/lib/email.ts
// Resend-powered email helpers for HireFlow AI

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "HireFlow AI <noreply@hireflow.ai>";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WeeklyDigestData {
  firstName: string;
  email: string;
  applicationCount: number;
  interviewCount: number;
  newJobMatches: number;
  topJobTitle?: string;
  topJobCompany?: string;
  topJobUrl?: string;
}

export interface WelcomeEmailData {
  firstName: string;
  email: string;
}

export interface UpgradeConfirmationData {
  firstName: string;
  email: string;
  planName: string;
}

// ─── Welcome Email ────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  return resend.emails.send({
    from: FROM,
    to: data.email,
    subject: "Welcome to HireFlow AI 🚀",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; margin: 0; padding: 40px 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 40px 40px 32px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">HireFlow AI</h1>
      <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 15px;">Your AI-powered job search assistant</p>
    </div>
    <div style="padding: 40px;">
      <h2 style="margin: 0 0 16px; font-size: 22px; color: #111827;">Welcome, ${data.firstName}! 👋</h2>
      <p style="color: #6b7280; line-height: 1.6; margin: 0 0 24px;">
        You're all set to start your smarter job search. Here's what you can do right now:
      </p>
      <ul style="color: #374151; line-height: 1.8; padding-left: 20px; margin: 0 0 32px;">
        <li>Build an ATS-optimized resume in minutes</li>
        <li>Browse thousands of real job listings</li>
        <li>Tailor your resume to any job with one click</li>
        <li>Track all your applications in one place</li>
      </ul>
      <a href="https://hireflow.ai/dashboard" style="display: inline-block; background: #6366f1; color: white; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 600; font-size: 15px;">
        Go to Dashboard →
      </a>
    </div>
    <div style="padding: 24px 40px; border-top: 1px solid #f3f4f6; text-align: center;">
      <p style="color: #9ca3af; font-size: 13px; margin: 0;">
        You're receiving this because you signed up for HireFlow AI.<br>
        <a href="https://hireflow.ai/dashboard/settings" style="color: #6366f1;">Manage email preferences</a>
      </p>
    </div>
  </div>
</body>
</html>`,
  });
}

// ─── Weekly Digest ────────────────────────────────────────────────────────────

export async function sendWeeklyDigest(data: WeeklyDigestData) {
  const hasTopJob = data.topJobTitle && data.topJobCompany;

  return resend.emails.send({
    from: FROM,
    to: data.email,
    subject: `Your weekly job search digest — ${data.newJobMatches} new matches`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; margin: 0; padding: 40px 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px 40px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 22px; font-weight: 700;">Your Weekly Digest</h1>
      <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 14px;">HireFlow AI · Job Search Summary</p>
    </div>
    <div style="padding: 40px;">
      <p style="color: #374151; margin: 0 0 28px; font-size: 16px;">Hi ${data.firstName},</p>

      <!-- Stats row -->
      <div style="display: flex; gap: 16px; margin-bottom: 32px;">
        <div style="flex: 1; background: #f0f9ff; border-radius: 12px; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 32px; font-weight: 700; color: #6366f1;">${data.applicationCount}</p>
          <p style="margin: 6px 0 0; font-size: 13px; color: #6b7280;">Applications</p>
        </div>
        <div style="flex: 1; background: #f0fdf4; border-radius: 12px; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 32px; font-weight: 700; color: #10b981;">${data.interviewCount}</p>
          <p style="margin: 6px 0 0; font-size: 13px; color: #6b7280;">Interviews</p>
        </div>
        <div style="flex: 1; background: #fdf4ff; border-radius: 12px; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 32px; font-weight: 700; color: #8b5cf6;">${data.newJobMatches}</p>
          <p style="margin: 6px 0 0; font-size: 13px; color: #6b7280;">New Matches</p>
        </div>
      </div>

      ${
        hasTopJob
          ? `
      <!-- Top job match -->
      <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 28px;">
        <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Top Match This Week</p>
        <p style="margin: 0 0 4px; font-size: 16px; font-weight: 600; color: #111827;">${data.topJobTitle}</p>
        <p style="margin: 0 0 16px; font-size: 14px; color: #6b7280;">${data.topJobCompany}</p>
        <a href="${data.topJobUrl ?? "https://hireflow.ai/dashboard/jobs"}" style="display: inline-block; background: #6366f1; color: white; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; font-size: 14px;">
          View Job →
        </a>
      </div>`
          : ""
      }

      <a href="https://hireflow.ai/dashboard" style="display: inline-block; background: #6366f1; color: white; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 600; font-size: 15px; width: 100%; text-align: center; box-sizing: border-box;">
        Open Dashboard →
      </a>
    </div>
    <div style="padding: 24px 40px; border-top: 1px solid #f3f4f6; text-align: center;">
      <p style="color: #9ca3af; font-size: 13px; margin: 0;">
        <a href="https://hireflow.ai/dashboard/settings" style="color: #6366f1;">Unsubscribe from weekly digest</a>
      </p>
    </div>
  </div>
</body>
</html>`,
  });
}

// ─── Upgrade Confirmation ─────────────────────────────────────────────────────

export async function sendUpgradeConfirmation(data: UpgradeConfirmationData) {
  return resend.emails.send({
    from: FROM,
    to: data.email,
    subject: `You're now on ${data.planName} 🎉`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; margin: 0; padding: 40px 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 40px; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 12px;">🎉</div>
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">Welcome to ${data.planName}!</h1>
    </div>
    <div style="padding: 40px;">
      <p style="color: #374151; line-height: 1.6; margin: 0 0 24px;">
        Hi ${data.firstName}, your upgrade is confirmed. You now have access to all Pro features:
      </p>
      <ul style="color: #374151; line-height: 2; padding-left: 20px; margin: 0 0 32px;">
        <li>Unlimited AI resume tailoring</li>
        <li>Unlimited saved jobs &amp; applications</li>
        <li>PDF &amp; DOCX export</li>
        <li>AI Interview Prep</li>
        <li>Salary negotiation tips</li>
        <li>Priority support</li>
      </ul>
      <a href="https://hireflow.ai/dashboard" style="display: inline-block; background: #6366f1; color: white; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 600; font-size: 15px;">
        Start Using Pro →
      </a>
    </div>
  </div>
</body>
</html>`,
  });
}
