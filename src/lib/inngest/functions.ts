// src/lib/inngest/functions.ts
// Inngest background job functions

import { inngest } from "@/lib/inngest/client";
import { analyzeResumeVsJob } from "@/lib/tailoring-engine";
import { generateInterviewPrep } from "@/lib/interview-prep-engine";
import { getCachedTailoring, cacheTailoringResult, cleanupExpiredCache } from "@/lib/ai-cache";
import { sendWinBackEmail } from "@/lib/email-churn";
import { sendUpgradeConfirmation } from "@/lib/email";
import { createClient as createServiceClient } from "@supabase/supabase-js";

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ─── Tailor Resume (Background) ───────────────────────────────────────────────

export const tailorResume = inngest.createFunction(
  { id: "tailor-resume", name: "Tailor Resume" },
  { event: "resume/tailor.requested" },
  async ({ event, step }) => {
    const { resumeId, jobDescription, userId } = event.data as {
      resumeId: string;
      jobDescription: string;
      userId: string;
    };

    // Step 1: Fetch resume
    const resume = await step.run("fetch-resume", async () => {
      const client = getServiceClient();
      const { data } = await client
        .from("resumes")
        .select("*")
        .eq("id", resumeId)
        .single();
      return data;
    });

    if (!resume) throw new Error("Resume not found");

    // Step 2: Check cache
    const resumeText = JSON.stringify(resume.content ?? {});
    const cached = await step.run("check-cache", async () => {
      return getCachedTailoring(resumeText, jobDescription);
    });

    let analysis;
    if (cached) {
      analysis = JSON.parse(cached);
    } else {
      // Step 3: Run AI tailoring
      analysis = await step.run("run-tailoring", async () => {
        const result = analyzeResumeVsJob(resume.content, jobDescription);
        await cacheTailoringResult(resumeText, jobDescription, JSON.stringify(result));
        return result;
      });
    }

    // Step 4: Save tailoring session
    await step.run("save-session", async () => {
      const client = getServiceClient();
      await client.from("tailoring_sessions").insert({
        user_id: userId,
        resume_id: resumeId,
        job_description: jobDescription,
        ats_score: analysis.ats_score,
        analysis: analysis,
        status: "completed",
        created_at: new Date().toISOString(),
      });
    });

    // Step 5: Send completion email
    await step.run("send-email", async () => {
      const client = getServiceClient();
      const { data: profile } = await client
        .from("profiles")
        .select("email, full_name")
        .eq("id", userId)
        .single();

      if (profile?.email) {
        await sendUpgradeConfirmation({
          firstName: profile.full_name?.split(" ")[0] ?? "there",
          email: profile.email,
          planName: "Tailoring Complete",
        });
      }
    });

    return { success: true, ats_score: analysis.ats_score };
  }
);

// ─── Generate Interview Prep (Background) ─────────────────────────────────────

export const generateInterviewPrepJob = inngest.createFunction(
  { id: "generate-interview-prep", name: "Generate Interview Prep" },
  { event: "interview/prep.requested" },
  async ({ event, step }) => {
    const { applicationId, userId } = event.data as {
      applicationId: string;
      userId: string;
    };

    // Step 1: Fetch application details
    const application = await step.run("fetch-application", async () => {
      const client = getServiceClient();
      const { data } = await client
        .from("applications")
        .select("*, resumes(*)")
        .eq("id", applicationId)
        .single();
      return data;
    });

    if (!application) throw new Error("Application not found");

    // Step 2: Generate prep using the interview prep engine
    const prep = await step.run("generate-questions", async () => {
      const { result } = await generateInterviewPrep({
        jobTitle: application.job_title ?? "",
        company: application.company ?? "",
        jobDescription: application.job_description ?? "",
        resumeSummary: application.resumes?.content?.summary ?? "",
      });
      return result;
    });

    // Step 3: Save prep session
    await step.run("save-prep", async () => {
      const client = getServiceClient();
      await client.from("interview_prep_sessions").insert({
        user_id: userId,
        application_id: applicationId,
        questions: prep?.questions ?? [],
        created_at: new Date().toISOString(),
      });
    });

    return { success: true, question_count: prep?.questions?.length ?? 0 };
  }
);

// ─── Win-Back Email Sequence ──────────────────────────────────────────────────

export const winBackSequence = inngest.createFunction(
  { id: "win-back-sequence", name: "Win-Back Email Sequence" },
  { event: "subscription/cancelled" },
  async ({ event, step }) => {
    const { userId, email, name, reason } = event.data as {
      userId: string;
      email: string;
      name: string;
      reason: string;
    };

    // Day 7: 50% off offer
    await step.sleepUntil("wait-7-days", new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

    await step.run("send-day-7-email", async () => {
      // Check if user re-subscribed
      const client = getServiceClient();
      const { data: sub } = await client
        .from("subscriptions")
        .select("plan, status")
        .eq("user_id", userId)
        .single();

      if (sub?.plan === "pro" && sub?.status === "active") {
        return { skipped: true, reason: "User re-subscribed" };
      }

      await sendWinBackEmail(email, name, reason, 7);
      return { sent: true };
    });

    // Day 30: Free week offer
    await step.sleepUntil("wait-30-days", new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

    await step.run("send-day-30-email", async () => {
      const client = getServiceClient();
      const { data: sub } = await client
        .from("subscriptions")
        .select("plan, status")
        .eq("user_id", userId)
        .single();

      if (sub?.plan === "pro" && sub?.status === "active") {
        return { skipped: true, reason: "User re-subscribed" };
      }

      await sendWinBackEmail(email, name, reason, 30);
      return { sent: true };
    });

    return { success: true };
  }
);

// ─── Daily Cache Cleanup ──────────────────────────────────────────────────────

export const cleanupCacheJob = inngest.createFunction(
  { id: "cleanup-cache", name: "Cleanup Expired AI Cache" },
  { cron: "0 3 * * *" }, // Daily at 3am UTC
  async ({ step }) => {
    const result = await step.run("cleanup-expired-cache", async () => {
      return cleanupExpiredCache();
    });

    return { success: true, deleted: result.deleted };
  }
);
