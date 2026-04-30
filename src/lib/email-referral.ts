// src/lib/email-referral.ts
// Referral invite and reward emails via Resend

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "HireFlow AI <noreply@hireflow.ai>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hireflow.ai";

// ─── Send referral invite email ───────────────────────────────────────────────

export async function sendReferralInviteEmail({
  toEmail,
  referrerName,
  referralCode,
  referralLink,
}: {
  toEmail: string;
  referrerName: string;
  referralCode: string;
  referralLink: string;
}): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: toEmail,
      subject: `${referrerName} invited you to HireFlow AI — Get hired faster`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You've been invited to HireFlow AI</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="font-size:24px;font-weight:700;color:#111827;margin:0;">HireFlow AI</h1>
      <p style="color:#6b7280;font-size:14px;margin:4px 0 0;">AI-Powered Job Application Platform</p>
    </div>

    <!-- Card -->
    <div style="background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;padding:32px;">
      <h2 style="font-size:20px;font-weight:700;color:#111827;margin:0 0 12px;">
        🎉 ${referrerName} invited you to HireFlow AI
      </h2>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 20px;">
        Your friend thinks you'd love HireFlow AI — the platform that uses AI to tailor your resume to every job posting, helping you get 3x more callbacks.
      </p>

      <!-- Benefits -->
      <div style="background:#f0fdf4;border-radius:8px;padding:16px;margin-bottom:24px;">
        <p style="font-weight:600;color:#166534;margin:0 0 8px;font-size:14px;">✅ What you get with HireFlow AI:</p>
        <ul style="margin:0;padding-left:20px;color:#374151;font-size:14px;line-height:1.8;">
          <li>AI resume tailoring for every job application</li>
          <li>ATS score optimization to pass screening</li>
          <li>Application tracker to stay organized</li>
          <li>Job search with real-time listings</li>
          <li>Interview prep powered by GPT-4o</li>
        </ul>
      </div>

      <!-- Referral Code -->
      <div style="background:#eff6ff;border-radius:8px;padding:16px;margin-bottom:24px;text-align:center;">
        <p style="color:#1d4ed8;font-size:13px;font-weight:600;margin:0 0 8px;">YOUR REFERRAL CODE</p>
        <p style="font-size:28px;font-weight:800;color:#1e40af;letter-spacing:4px;margin:0;">${referralCode}</p>
        <p style="color:#6b7280;font-size:12px;margin:8px 0 0;">Use this code at signup for a free bonus tailoring credit</p>
      </div>

      <!-- CTA Button -->
      <div style="text-align:center;">
        <a href="${referralLink}" style="display:inline-block;background:#2563eb;color:#ffffff;font-weight:600;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;">
          Create Your Free Account →
        </a>
      </div>

      <p style="color:#9ca3af;font-size:12px;text-align:center;margin:20px 0 0;">
        Or visit: <a href="${referralLink}" style="color:#2563eb;">${referralLink}</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:24px;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">
        © ${new Date().getFullYear()} HireFlow AI · 
        <a href="${APP_URL}/unsubscribe" style="color:#9ca3af;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>
      `.trim(),
    });

    if (error) {
      console.error("Referral invite email error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Referral invite email exception:", err);
    return { success: false, error: "Failed to send referral invite email" };
  }
}

// ─── Send referral reward email ───────────────────────────────────────────────

export async function sendReferralRewardEmail({
  toEmail,
  referrerName,
  referredName,
  creditsGranted,
  totalCredits,
}: {
  toEmail: string;
  referrerName: string;
  referredName: string;
  creditsGranted: number;
  totalCredits: number;
}): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: toEmail,
      subject: `🎁 You earned ${creditsGranted} free tailoring credit${creditsGranted !== 1 ? "s" : ""}!`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Referral Reward — HireFlow AI</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="font-size:24px;font-weight:700;color:#111827;margin:0;">HireFlow AI</h1>
    </div>

    <!-- Card -->
    <div style="background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;padding:32px;">
      <!-- Reward Banner -->
      <div style="background:linear-gradient(135deg,#2563eb,#7c3aed);border-radius:10px;padding:24px;text-align:center;margin-bottom:24px;">
        <p style="color:#bfdbfe;font-size:13px;font-weight:600;margin:0 0 8px;letter-spacing:1px;">REFERRAL REWARD</p>
        <p style="color:#ffffff;font-size:48px;font-weight:800;margin:0;">🎁</p>
        <p style="color:#ffffff;font-size:22px;font-weight:700;margin:8px 0 0;">
          +${creditsGranted} Free Credit${creditsGranted !== 1 ? "s" : ""}!
        </p>
      </div>

      <h2 style="font-size:20px;font-weight:700;color:#111827;margin:0 0 12px;">
        Congrats, ${referrerName}! 🎉
      </h2>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 20px;">
        <strong>${referredName}</strong> just signed up using your referral link. As a thank you, we've added <strong>${creditsGranted} free tailoring credit${creditsGranted !== 1 ? "s" : ""}</strong> to your account.
      </p>

      <!-- Credit Balance -->
      <div style="background:#f0fdf4;border-radius:8px;padding:16px;margin-bottom:24px;text-align:center;">
        <p style="color:#166534;font-size:13px;font-weight:600;margin:0 0 4px;">YOUR CURRENT CREDIT BALANCE</p>
        <p style="font-size:36px;font-weight:800;color:#15803d;margin:0;">${totalCredits}</p>
        <p style="color:#6b7280;font-size:12px;margin:4px 0 0;">tailoring credits available</p>
      </div>

      <p style="color:#374151;font-size:14px;line-height:1.6;margin:0 0 24px;">
        Each credit lets you tailor your resume to one job posting with AI. Keep referring friends to earn more free credits!
      </p>

      <!-- CTA Button -->
      <div style="text-align:center;">
        <a href="${APP_URL}/dashboard" style="display:inline-block;background:#2563eb;color:#ffffff;font-weight:600;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;">
          Use Your Credits →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:24px;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">
        © ${new Date().getFullYear()} HireFlow AI · 
        <a href="${APP_URL}/dashboard/referrals" style="color:#9ca3af;">View Referral Dashboard</a>
      </p>
    </div>
  </div>
</body>
</html>
      `.trim(),
    });

    if (error) {
      console.error("Referral reward email error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Referral reward email exception:", err);
    return { success: false, error: "Failed to send referral reward email" };
  }
}
