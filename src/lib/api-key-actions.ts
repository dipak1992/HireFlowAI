"use server";

// src/lib/api-key-actions.ts
// Public API key management server actions

import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { randomBytes, createHash } from "crypto";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key_prefix: string; // first 8 chars shown to user
  key_hash: string;   // SHA-256 of full key (never returned)
  scopes: string[];
  last_used_at: string | null;
  requests_today: number;
  requests_total: number;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
}

export interface ApiKeyWithSecret extends Omit<ApiKey, "key_hash"> {
  secret: string; // only returned on creation
}

const DAILY_RATE_LIMIT = 100; // requests per day for free tier
const PRO_DAILY_RATE_LIMIT = 1000;

// ─── Create API key ──────────────────────────────────────────────────────────

export async function createApiKey(
  name: string,
  scopes: string[] = ["tailor", "jobs"]
): Promise<{ key?: ApiKeyWithSecret; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Check existing key count (max 5 per user)
  const { count } = await supabase
    .from("api_keys")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_active", true);

  if ((count ?? 0) >= 5) {
    return { error: "Maximum of 5 active API keys allowed" };
  }

  // Generate key: hf_<32 random hex chars>
  const rawKey = `hf_${randomBytes(16).toString("hex")}`;
  const keyHash = createHash("sha256").update(rawKey).digest("hex");
  const keyPrefix = rawKey.slice(0, 8);

  const { data, error } = await supabase
    .from("api_keys")
    .insert({
      user_id: user.id,
      name,
      key_prefix: keyPrefix,
      key_hash: keyHash,
      scopes,
      is_active: true,
      requests_today: 0,
      requests_total: 0,
    })
    .select("id, user_id, name, key_prefix, scopes, last_used_at, requests_today, requests_total, is_active, created_at, expires_at")
    .single();

  if (error) return { error: error.message };

  return {
    key: {
      ...(data as Omit<ApiKey, "key_hash">),
      secret: rawKey,
    },
  };
}

// ─── List API keys ───────────────────────────────────────────────────────────

export async function listApiKeys(): Promise<{
  keys?: Omit<ApiKey, "key_hash">[];
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("api_keys")
    .select(
      "id, user_id, name, key_prefix, scopes, last_used_at, requests_today, requests_total, is_active, created_at, expires_at"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return { error: error.message };
  return { keys: data as Omit<ApiKey, "key_hash">[] };
}

// ─── Revoke API key ──────────────────────────────────────────────────────────

export async function revokeApiKey(
  keyId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { error } = await supabase
    .from("api_keys")
    .update({ is_active: false })
    .eq("id", keyId)
    .eq("user_id", user.id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ─── Validate API key (used in API route middleware) ─────────────────────────

export async function validateApiKey(rawKey: string): Promise<{
  valid: boolean;
  userId?: string;
  scopes?: string[];
  planId?: string;
  rateLimitExceeded?: boolean;
  error?: string;
}> {
  if (!rawKey?.startsWith("hf_")) {
    return { valid: false, error: "Invalid API key format" };
  }

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const keyHash = createHash("sha256").update(rawKey).digest("hex");

  const { data: keyRow, error } = await supabase
    .from("api_keys")
    .select("id, user_id, scopes, is_active, requests_today, expires_at")
    .eq("key_hash", keyHash)
    .single();

  if (error || !keyRow) return { valid: false, error: "API key not found" };
  if (!keyRow.is_active) return { valid: false, error: "API key is revoked" };

  // Check expiry
  if (keyRow.expires_at && new Date(keyRow.expires_at) < new Date()) {
    return { valid: false, error: "API key has expired" };
  }

  // Get user plan for rate limit
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan_id")
    .eq("user_id", keyRow.user_id)
    .eq("status", "active")
    .single();

  const planId = sub?.plan_id ?? "free";
  const dailyLimit = planId === "pro" ? PRO_DAILY_RATE_LIMIT : DAILY_RATE_LIMIT;

  if (keyRow.requests_today >= dailyLimit) {
    return {
      valid: true,
      userId: keyRow.user_id,
      scopes: keyRow.scopes,
      planId,
      rateLimitExceeded: true,
    };
  }

  // Increment usage counters (requests_total handled atomically via RPC)
  await supabase
    .from("api_keys")
    .update({
      requests_today: keyRow.requests_today + 1,
      last_used_at: new Date().toISOString(),
    })
    .eq("id", keyRow.id);

  // Atomically increment total requests
  await supabase.rpc("increment_api_key_requests", { p_key_id: keyRow.id });

  return {
    valid: true,
    userId: keyRow.user_id,
    scopes: keyRow.scopes,
    planId,
    rateLimitExceeded: false,
  };
}
