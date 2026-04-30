// src/lib/ai-cache.ts
// SHA-256 hash-based caching for AI responses (tailoring, interview prep, resume parsing)

import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

type CacheType = "tailoring" | "interview_prep" | "resume_parse";

// Default TTL: 7 days for tailoring/interview prep, 30 days for resume parse
const TTL_DAYS: Record<CacheType, number> = {
  tailoring: 7,
  interview_prep: 7,
  resume_parse: 30,
};

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function hashContent(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

function buildCacheKey(cacheType: CacheType, ...parts: string[]): string {
  return hashContent([cacheType, ...parts].join("|"));
}

// ─── Tailoring Cache ──────────────────────────────────────────────────────────

export async function getCachedTailoring(
  resumeText: string,
  jobDescription: string
): Promise<string | null> {
  const hash = buildCacheKey("tailoring", resumeText, jobDescription);
  const client = getServiceClient();

  const { data } = await client
    .from("ai_cache")
    .select("response, expires_at, hit_count")
    .eq("hash", hash)
    .eq("cache_type", "tailoring")
    .single();

  if (!data) return null;
  if (new Date(data.expires_at) < new Date()) return null;

  // Increment hit count
  await client
    .from("ai_cache")
    .update({ hit_count: (data.hit_count ?? 0) + 1 })
    .eq("hash", hash);

  return data.response as string;
}

export async function cacheTailoringResult(
  resumeText: string,
  jobDescription: string,
  response: string,
  tokensUsed?: number
): Promise<void> {
  const hash = buildCacheKey("tailoring", resumeText, jobDescription);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + TTL_DAYS.tailoring);

  const client = getServiceClient();
  await client.from("ai_cache").upsert({
    hash,
    cache_type: "tailoring",
    response,
    tokens_used: tokensUsed ?? 0,
    hit_count: 0,
    expires_at: expiresAt.toISOString(),
    created_at: new Date().toISOString(),
  });
}

// ─── Interview Prep Cache ─────────────────────────────────────────────────────

export async function getCachedInterviewPrep(
  jobTitle: string,
  company: string,
  jobDescription: string,
  resumeSummary: string
): Promise<string | null> {
  const hash = buildCacheKey("interview_prep", jobTitle, company, jobDescription, resumeSummary);
  const client = getServiceClient();

  const { data } = await client
    .from("ai_cache")
    .select("response, expires_at, hit_count")
    .eq("hash", hash)
    .eq("cache_type", "interview_prep")
    .single();

  if (!data) return null;
  if (new Date(data.expires_at) < new Date()) return null;

  await client
    .from("ai_cache")
    .update({ hit_count: (data.hit_count ?? 0) + 1 })
    .eq("hash", hash);

  return data.response as string;
}

export async function cacheInterviewPrepResult(
  jobTitle: string,
  company: string,
  jobDescription: string,
  resumeSummary: string,
  response: string,
  tokensUsed?: number
): Promise<void> {
  const hash = buildCacheKey("interview_prep", jobTitle, company, jobDescription, resumeSummary);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + TTL_DAYS.interview_prep);

  const client = getServiceClient();
  await client.from("ai_cache").upsert({
    hash,
    cache_type: "interview_prep",
    response,
    tokens_used: tokensUsed ?? 0,
    hit_count: 0,
    expires_at: expiresAt.toISOString(),
    created_at: new Date().toISOString(),
  });
}

// ─── Resume Parse Cache ───────────────────────────────────────────────────────

export async function getCachedResumeParse(fileContent: string): Promise<string | null> {
  const hash = buildCacheKey("resume_parse", fileContent);
  const client = getServiceClient();

  const { data } = await client
    .from("ai_cache")
    .select("response, expires_at, hit_count")
    .eq("hash", hash)
    .eq("cache_type", "resume_parse")
    .single();

  if (!data) return null;
  if (new Date(data.expires_at) < new Date()) return null;

  await client
    .from("ai_cache")
    .update({ hit_count: (data.hit_count ?? 0) + 1 })
    .eq("hash", hash);

  return data.response as string;
}

export async function cacheResumeParseResult(
  fileContent: string,
  response: string,
  tokensUsed?: number
): Promise<void> {
  const hash = buildCacheKey("resume_parse", fileContent);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + TTL_DAYS.resume_parse);

  const client = getServiceClient();
  await client.from("ai_cache").upsert({
    hash,
    cache_type: "resume_parse",
    response,
    tokens_used: tokensUsed ?? 0,
    hit_count: 0,
    expires_at: expiresAt.toISOString(),
    created_at: new Date().toISOString(),
  });
}

// ─── Cache Stats ──────────────────────────────────────────────────────────────

export async function getCacheStats(): Promise<{
  total_entries: number;
  total_hits: number;
  total_tokens_saved: number;
  by_type: Record<CacheType, { count: number; hits: number }>;
}> {
  const client = getServiceClient();

  const { data } = await client
    .from("ai_cache")
    .select("cache_type, hit_count, tokens_used")
    .gt("expires_at", new Date().toISOString());

  const stats = {
    total_entries: 0,
    total_hits: 0,
    total_tokens_saved: 0,
    by_type: {
      tailoring: { count: 0, hits: 0 },
      interview_prep: { count: 0, hits: 0 },
      resume_parse: { count: 0, hits: 0 },
    } as Record<CacheType, { count: number; hits: number }>,
  };

  for (const row of data ?? []) {
    stats.total_entries++;
    stats.total_hits += row.hit_count ?? 0;
    stats.total_tokens_saved += (row.hit_count ?? 0) * (row.tokens_used ?? 0);
    const type = row.cache_type as CacheType;
    if (type in stats.by_type) {
      stats.by_type[type].count++;
      stats.by_type[type].hits += row.hit_count ?? 0;
    }
  }

  return stats;
}

// ─── Cleanup Expired Cache ────────────────────────────────────────────────────

export async function cleanupExpiredCache(): Promise<{ deleted: number }> {
  const client = getServiceClient();

  const { data, error } = await client
    .from("ai_cache")
    .delete()
    .lt("expires_at", new Date().toISOString())
    .select("id");

  if (error) throw error;
  return { deleted: data?.length ?? 0 };
}
