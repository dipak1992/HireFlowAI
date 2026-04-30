// src/app/api/v1/tailor/route.ts
// Public API v1 — Resume tailoring endpoint
// Auth: Bearer hf_<key> in Authorization header

import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-key-actions";
import { analyzeResumeVsJob } from "@/lib/tailoring-engine";
import { getCachedTailoring, cacheTailoringResult } from "@/lib/ai-cache";
import type { ResumeData } from "@/lib/resume-types";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
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
  if (!auth.scopes?.includes("tailor")) {
    return NextResponse.json(
      { error: "API key does not have 'tailor' scope" },
      { status: 403 }
    );
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let body: { resume: ResumeData; job_description: string; job_title?: string; company?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { resume, job_description, job_title, company } = body;

  if (!resume || !job_description) {
    return NextResponse.json(
      { error: "Required fields: resume (object), job_description (string)" },
      { status: 400 }
    );
  }

  // ── Cache check ───────────────────────────────────────────────────────────
  const resumeText = JSON.stringify(resume);
  const cached = await getCachedTailoring(resumeText, job_description);
  if (cached) {
    return NextResponse.json({
      cached: true,
      analysis: cached,
    });
  }

  // ── Run tailoring ─────────────────────────────────────────────────────────
  try {
    const analysis = analyzeResumeVsJob(resume, job_description);

    // Cache result (cacheTailoringResult expects serialized JSON string)
    await cacheTailoringResult(resumeText, job_description, JSON.stringify(analysis));

    return NextResponse.json({
      cached: false,
      analysis,
      meta: {
        job_title: job_title ?? null,
        company: company ?? null,
        match_score: analysis.ats_score,
        keywords_found: analysis.keyword_matches?.length ?? 0,
        keywords_missing: analysis.missing_keywords?.length ?? 0,
      },
    });
  } catch (err) {
    console.error("[API v1 /tailor] error:", err);
    return NextResponse.json(
      { error: "Tailoring failed. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "POST /api/v1/tailor",
    description: "Tailor a resume to a job description using AI analysis",
    auth: "Bearer hf_<api_key>",
    body: {
      resume: "ResumeData object (required)",
      job_description: "string (required)",
      job_title: "string (optional)",
      company: "string (optional)",
    },
    response: {
      cached: "boolean",
      analysis: "TailoringAnalysis object",
      meta: "{ match_score, keywords_found, keywords_missing }",
    },
  });
}
