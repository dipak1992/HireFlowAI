// src/lib/pdf-cache.ts
// PDF caching via Supabase Storage (resume-pdfs bucket)

import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

const BUCKET = "resume-pdfs";
// Default TTL: 24 hours
const TTL_HOURS = 24;

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function hashResumeContent(resumeId: string, templateId: string, contentHash: string): string {
  return createHash("sha256")
    .update(`${resumeId}|${templateId}|${contentHash}`)
    .digest("hex");
}

// ─── Get Cached PDF URL ───────────────────────────────────────────────────────

export async function getCachedPdfUrl(
  resumeId: string,
  templateId: string,
  contentHash: string
): Promise<string | null> {
  const client = getServiceClient();
  const hash = hashResumeContent(resumeId, templateId, contentHash);

  const { data: cacheEntry } = await client
    .from("pdf_cache")
    .select("storage_path, expires_at")
    .eq("hash", hash)
    .eq("resume_id", resumeId)
    .single();

  if (!cacheEntry) return null;
  if (new Date(cacheEntry.expires_at) < new Date()) {
    // Expired — clean up
    await client.from("pdf_cache").delete().eq("hash", hash);
    await client.storage.from(BUCKET).remove([cacheEntry.storage_path]);
    return null;
  }

  // Generate a signed URL (valid for 1 hour)
  const { data: signedUrl } = await client.storage
    .from(BUCKET)
    .createSignedUrl(cacheEntry.storage_path, 3600);

  return signedUrl?.signedUrl ?? null;
}

// ─── Cache PDF URL ────────────────────────────────────────────────────────────

export async function cachePdfUrl(
  resumeId: string,
  templateId: string,
  contentHash: string,
  pdfBuffer: Buffer
): Promise<string | null> {
  const client = getServiceClient();
  const hash = hashResumeContent(resumeId, templateId, contentHash);
  const storagePath = `${resumeId}/${hash}.pdf`;

  // Upload to Supabase Storage
  const { error: uploadError } = await client.storage
    .from(BUCKET)
    .upload(storagePath, pdfBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (uploadError) {
    console.error("PDF cache upload error:", uploadError);
    return null;
  }

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + TTL_HOURS);

  // Store cache entry
  await client.from("pdf_cache").upsert({
    hash,
    resume_id: resumeId,
    template_id: templateId,
    content_hash: contentHash,
    storage_path: storagePath,
    expires_at: expiresAt.toISOString(),
    created_at: new Date().toISOString(),
  });

  // Return signed URL
  const { data: signedUrl } = await client.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, 3600);

  return signedUrl?.signedUrl ?? null;
}

// ─── Invalidate PDF Cache ─────────────────────────────────────────────────────

export async function invalidatePdfCache(resumeId: string): Promise<void> {
  const client = getServiceClient();

  // Get all cache entries for this resume
  const { data: entries } = await client
    .from("pdf_cache")
    .select("storage_path")
    .eq("resume_id", resumeId);

  if (entries && entries.length > 0) {
    // Delete from storage
    const paths = entries.map((e) => e.storage_path);
    await client.storage.from(BUCKET).remove(paths);

    // Delete from cache table
    await client.from("pdf_cache").delete().eq("resume_id", resumeId);
  }
}
