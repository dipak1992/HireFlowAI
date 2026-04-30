// src/app/api/v1/jobs/route.ts
// Public API v1 — Job search endpoint
// Auth: Bearer hf_<key> in Authorization header

import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-key-actions";
import { searchJobs } from "@/lib/jsearch-client";

export const maxDuration = 30;

export async function GET(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const authHeader = req.headers.get("authorization") ?? "";
  const rawKey = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : "";

  if (!rawKey) {
    return NextResponse.json(
      { error: "Missing Authorization header. Use: Bearer hf_<your_api_key>" },
      { status: 401 }
    );
  }

  const auth = await validateApiKey(rawKey);
  if (!auth.valid) {
    return NextResponse.json({ error: auth.error ?? "Invalid API key" }, { status: 401 });
  }
  if (auth.rateLimitExceeded) {
    return NextResponse.json(
      { error: "Daily rate limit exceeded. Upgrade to Pro for 1,000 requests/day." },
      { status: 429 }
    );
  }
  if (!auth.scopes?.includes("jobs")) {
    return NextResponse.json(
      { error: "API key does not have 'jobs' scope" },
      { status: 403 }
    );
  }

  // ── Parse query params ────────────────────────────────────────────────────
  const { searchParams } = req.nextUrl;
  const query = searchParams.get("q") ?? "";
  const location = searchParams.get("location") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const remoteOnly = searchParams.get("remote") === "true";
  const employmentType = searchParams.get("type") ?? undefined;

  if (!query) {
    return NextResponse.json(
      { error: "Required query param: q (job title or keywords)" },
      { status: 400 }
    );
  }

  // ── Search jobs ───────────────────────────────────────────────────────────
  try {
    const results = await searchJobs({
      query,
      location,
      page,
      remote_jobs_only: remoteOnly,
      employment_types: employmentType,
    });

    return NextResponse.json({
      jobs: results.jobs,
      total: results.totalFound,
      page,
      has_more: results.jobs.length === 10, // JSearch returns 10 per page
    });
  } catch (err) {
    console.error("[API v1 /jobs] error:", err);
    return NextResponse.json(
      { error: "Job search failed. Please try again." },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json({
    endpoint: "GET /api/v1/jobs",
    description: "Search for jobs using the JSearch API",
    auth: "Bearer hf_<api_key>",
    params: {
      q: "string (required) — job title or keywords",
      location: "string (optional) — city, state, or country",
      page: "number (optional, default: 1)",
      remote: "boolean (optional) — filter remote jobs only",
      type: "string (optional) — FULLTIME | PARTTIME | CONTRACTOR | INTERN",
    },
    response: {
      jobs: "NormalizedJob[]",
      total: "number",
      page: "number",
      has_more: "boolean",
    },
  });
}
