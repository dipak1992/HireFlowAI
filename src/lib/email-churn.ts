// src/lib/email-churn.ts
// Win-back email sequences for churned users

import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}
const FROM = "HireFlow AI <noreply@hireflow.ai>";

// ─── Win-Back Email ───────────────────────────────────────────────────────────

export async function sendWinBackEmail(
  email: string,
  name: string,
  reason: string,
  daysSinceCancelled: number
) {
  const firstName = name.split(" ")[0] || name;

  const resend = getResend();
  if (daysSinceCancelled <= 14) {
    // Day 7 email: 50% off offer
    return resend.emails.send({
      from: FROM,
      to: email,
      subject: "We miss you — here's 50% off to come back 💜",
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; margin: 0; padding: 40px 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 40px; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 12px;">💜</div>
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">We miss you, ${firstName}</h1>
    </div>
    <div style="padding: 40px;">
      <p style="color: #374151; line-height: 1.6; margin: 0 0 20px;">
        We noticed you cancelled your HireFlow AI Pro subscription${reason === "too_expensive" ? " because of the price" : ""}. 
        We totally understand — and we want to make it right.
      </p>
      <div style="background: #f0f9ff; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 28px;">
        <p style="margin: 0 0 8px; font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Limited Time Offer</p>
        <p style="margin: 0; font-size: 32px; font-weight: 700; color: #6366f1;">50% OFF</p>
        <p style="margin: 8px 0 0; font-size: 14px; color: #6b7280;">for your first 2 months back</p>
      </div>
      <p style="color: #374151; line-height: 1.6; margin: 0 0 28px;">
        Come back to HireFlow AI Pro for just <strong>$9.50/month</strong> for 2 months. 
        No commitment — cancel anytime.
      </p>
      <a href="https://hireflow.ai/dashboard/billing?winback=50off" 
         style="display: block; background: #6366f1; color: white; text-decoration: none; padding: 16px 28px; border-radius: 10px; font-weight: 600; font-size: 16px; text-align: center;">
        Claim 50% Off →
      </a>
    </div>
    <div style="padding: 24px 40px; border-top: 1px solid #f3f4f6; text-align: center;">
      <p style="color: #9ca3af; font-size: 13px; margin: 0;">
        This offer expires in 7 days. 
        <a href="https://hireflow.ai/unsubscribe" style="color: #6366f1;">Unsubscribe from emails</a>
      </p>
    </div>
  </div>
</body>
</html>`,
    });
  } else {
    // Day 30 email: free week offer
    return resend.emails.send({
      from: FROM,
      to: email,
      subject: "A free week of Pro — no strings attached 🎁",
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; margin: 0; padding: 40px 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 40px; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 12px;">🎁</div>
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">A gift for you, ${firstName}</h1>
    </div>
    <div style="padding: 40px;">
      <p style="color: #374151; line-height: 1.6; margin: 0 0 20px;">
        It's been a month since you left HireFlow AI. The job market is tough — 
        and we want to help you land your next role.
      </p>
      <div style="background: #f0fdf4; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 28px;">
        <p style="margin: 0 0 8px; font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Free Trial</p>
        <p style="margin: 0; font-size: 32px; font-weight: 700; color: #10b981;">7 Days Free</p>
        <p style="margin: 8px 0 0; font-size: 14px; color: #6b7280;">Full Pro access, no credit card required</p>
      </div>
      <ul style="color: #374151; line-height: 2; padding-left: 20px; margin: 0 0 28px;">
        <li>Unlimited AI resume tailoring</li>
        <li>AI Interview Prep for any role</li>
        <li>PDF &amp; DOCX export</li>
        <li>Unlimited job applications</li>
      </ul>
      <a href="https://hireflow.ai/dashboard/billing?winback=freeweek" 
         style="display: block; background: #10b981; color: white; text-decoration: none; padding: 16px 28px; border-radius: 10px; font-weight: 600; font-size: 16px; text-align: center;">
        Start Free Week →
      </a>
    </div>
    <div style="padding: 24px 40px; border-top: 1px solid #f3f4f6; text-align: center;">
      <p style="color: #9ca3af; font-size: 13px; margin: 0;">
        <a href="https://hireflow.ai/unsubscribe" style="color: #6366f1;">Unsubscribe from emails</a>
      </p>
    </div>
  </div>
</body>
</html>`,
    });
  }
}
