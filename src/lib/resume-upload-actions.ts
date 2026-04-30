"use server";

import { createClient } from "@/lib/supabase/server";
import { parseResumeFromBase64, buildResumeDataFromParsed } from "@/lib/resume-parser";
import { canCreateResume } from "@/lib/stripe-config";

type SupportedMime =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "application/pdf";

const ALLOWED_TYPES: SupportedMime[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export interface UploadResumeResult {
  success: boolean;
  resumeId?: string;
  error?: string;
}

export async function uploadAndParseResumeAction(
  formData: FormData
): Promise<UploadResumeResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  // ── Gate check ──────────────────────────────────────────────────────────────
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan_id")
    .eq("id", user.id)
    .single();

  const { count: resumeCount } = await supabase
    .from("resumes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const planId = (profile?.plan_id ?? "free") as "free" | "pro";
  if (!canCreateResume(planId, resumeCount ?? 0)) {
    return {
      success: false,
      error:
        "Free accounts include 1 resume. Upgrade to Pro for unlimited resumes.",
    };
  }

  // ── File validation ──────────────────────────────────────────────────────────
  const file = formData.get("file") as File | null;
  if (!file) return { success: false, error: "No file provided" };
  if (file.size > MAX_SIZE_BYTES)
    return { success: false, error: "File too large (max 10 MB)" };
  if (!ALLOWED_TYPES.includes(file.type as SupportedMime))
    return {
      success: false,
      error: "Unsupported file type. Use PDF, JPG, PNG, or WEBP.",
    };

  // ── Convert to base64 ────────────────────────────────────────────────────────
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  // ── Parse with GPT-4o Vision ─────────────────────────────────────────────────
  let parsed;
  try {
    parsed = await parseResumeFromBase64(base64, file.type as SupportedMime);
  } catch (err) {
    console.error("[resume-upload] parse error", err);
    return {
      success: false,
      error: "Failed to parse resume. Please try a clearer image or PDF.",
    };
  }

  // ── Build resume title from parsed name ──────────────────────────────────────
  const title = parsed.contact_name
    ? `${parsed.contact_name}'s Resume`
    : "Uploaded Resume";

  const resumeData = buildResumeDataFromParsed(parsed, title);

  // ── Insert into DB ───────────────────────────────────────────────────────────
  const { data: inserted, error: dbError } = await supabase
    .from("resumes")
    .insert({ ...resumeData, user_id: user.id })
    .select("id")
    .single();

  if (dbError || !inserted) {
    console.error("[resume-upload] db error", dbError);
    return { success: false, error: "Failed to save resume. Please try again." };
  }

  return { success: true, resumeId: inserted.id };
}
