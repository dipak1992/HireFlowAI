"use server";

import type { ResumeData, ResumeExperience } from "@/lib/resume-types";
import { improveBulletRuleBased, enhanceSummaryRuleBased, scoreResumeRuleBased } from "@/lib/resume-ai-utils";

// ─── OpenAI helper ────────────────────────────────────────────────────────────

async function callOpenAI(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 500
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null; // graceful fallback to rule-based

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      console.error("OpenAI API error:", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() ?? null;
  } catch (err) {
    console.error("OpenAI fetch error:", err);
    return null;
  }
}

// ─── Improve Professional Summary ─────────────────────────────────────────────

export async function aiImproveSummary(
  summary: string,
  resumeContext: {
    name: string;
    experienceCount: number;
    topSkills: string[];
    latestTitle: string;
  }
): Promise<{ improved: string; usedAI: boolean }> {
  if (!summary.trim()) {
    return { improved: summary, usedAI: false };
  }

  const systemPrompt = `You are an expert resume writer. Your job is to improve professional summaries to be compelling, ATS-optimized, and results-focused.

RULES:
- Never fabricate experience, skills, or accomplishments not present in the original
- Keep the same person's voice and facts
- Use strong action-oriented language
- Keep it 3-5 sentences (50-120 words)
- Start with a strong professional identity statement
- Include quantifiable impact where the original hints at it
- End with what value the person brings
- Return ONLY the improved summary text, no explanations or quotes`;

  const userPrompt = `Improve this professional summary for ${resumeContext.name || "a job seeker"} who has ${resumeContext.experienceCount} positions of experience${resumeContext.latestTitle ? `, most recently as ${resumeContext.latestTitle}` : ""}${resumeContext.topSkills.length > 0 ? `, with skills in ${resumeContext.topSkills.slice(0, 5).join(", ")}` : ""}.

Original summary:
"${summary}"

Return only the improved summary text.`;

  const aiResult = await callOpenAI(systemPrompt, userPrompt, 300);

  if (aiResult) {
    return { improved: aiResult, usedAI: true };
  }

  // Fallback to rule-based
  return {
    improved: enhanceSummaryRuleBased(summary, resumeContext.name, resumeContext.experienceCount),
    usedAI: false,
  };
}

// ─── Improve Experience Bullets ───────────────────────────────────────────────

export async function aiImproveBullets(
  bullets: string[],
  context: {
    jobTitle: string;
    company: string;
  }
): Promise<{ improved: string[]; usedAI: boolean }> {
  const validBullets = bullets.filter((b) => b.trim().length > 0);
  if (validBullets.length === 0) {
    return { improved: bullets, usedAI: false };
  }

  const systemPrompt = `You are an expert resume writer specializing in impactful bullet points.

RULES:
- Never fabricate metrics, percentages, or accomplishments not implied by the original
- Start each bullet with a strong past-tense action verb (Led, Built, Reduced, Increased, etc.)
- Remove weak phrases like "Responsible for", "Helped with", "Worked on"
- Make bullets concise and results-oriented (1-2 lines each)
- If the original mentions a number or metric, keep it
- If the original implies an outcome, make it explicit
- Return a JSON array of improved bullet strings, same count as input
- Example: ["Architected microservices platform reducing deployment time by 40%", "Led cross-functional team of 8 engineers..."]`;

  const userPrompt = `Improve these resume bullet points for a ${context.jobTitle || "professional"} at ${context.company || "a company"}.

Original bullets:
${validBullets.map((b, i) => `${i + 1}. ${b}`).join("\n")}

Return a JSON array with exactly ${validBullets.length} improved bullet strings.`;

  const aiResult = await callOpenAI(systemPrompt, userPrompt, 600);

  if (aiResult) {
    try {
      // Parse JSON array from response
      const jsonMatch = aiResult.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as string[];
        if (Array.isArray(parsed) && parsed.length === validBullets.length) {
          // Merge back with empty bullets
          let aiIdx = 0;
          const merged = bullets.map((b) => {
            if (!b.trim()) return b;
            return parsed[aiIdx++] ?? b;
          });
          return { improved: merged, usedAI: true };
        }
      }
    } catch {
      // JSON parse failed, fall through to rule-based
    }
  }

  // Fallback to rule-based
  return {
    improved: bullets.map((b) => (b.trim() ? improveBulletRuleBased(b) : b)),
    usedAI: false,
  };
}

// ─── Generate ATS Score ───────────────────────────────────────────────────────

export async function aiScoreResume(
  resume: ResumeData
): Promise<{ score: number; feedback: string[]; usedAI: boolean }> {
  // Always compute rule-based score first (fast, no API needed)
  const ruleScore = scoreResumeRuleBased(resume);

  const systemPrompt = `You are an ATS (Applicant Tracking System) expert. Analyze a resume and return a JSON object with:
- score: number 0-100 (ATS compatibility score)
- feedback: array of 3-5 short actionable improvement tips (each under 80 chars)

Consider: completeness, keyword density, formatting signals, section presence, bullet quality.
Return ONLY valid JSON like: {"score": 78, "feedback": ["Add more quantified achievements", "..."]}`;

  const resumeText = [
    `Name: ${resume.contact_name}`,
    `Summary: ${resume.summary}`,
    `Experience: ${resume.experience.length} positions`,
    `Skills: ${resume.skills.map((s) => s.name).join(", ")}`,
    `Education: ${resume.education.length} entries`,
    `Certifications: ${resume.certifications.length}`,
    `Projects: ${resume.projects.length}`,
    `Bullets sample: ${resume.experience.flatMap((e) => e.bullets).slice(0, 5).join(" | ")}`,
  ].join("\n");

  const userPrompt = `Score this resume for ATS compatibility:\n\n${resumeText}`;

  const aiResult = await callOpenAI(systemPrompt, userPrompt, 300);

  if (aiResult) {
    try {
      const jsonMatch = aiResult.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as { score: number; feedback: string[] };
        if (typeof parsed.score === "number" && Array.isArray(parsed.feedback)) {
          return {
            score: Math.min(100, Math.max(0, Math.round(parsed.score))),
            feedback: parsed.feedback.slice(0, 5),
            usedAI: true,
          };
        }
      }
    } catch {
      // fall through
    }
  }

  return {
    score: ruleScore.score,
    feedback: ruleScore.feedback,
    usedAI: false,
  };
}

// ─── Generate Summary from Scratch ───────────────────────────────────────────

export async function aiGenerateSummary(
  resume: ResumeData
): Promise<{ summary: string; usedAI: boolean }> {
  const hasContent =
    resume.experience.length > 0 || resume.skills.length > 0 || resume.education.length > 0;

  if (!hasContent) {
    return {
      summary:
        "Motivated professional seeking new opportunities to apply skills and grow within a dynamic organization.",
      usedAI: false,
    };
  }

  const systemPrompt = `You are an expert resume writer. Generate a compelling professional summary based on the provided resume data.

RULES:
- 3-5 sentences, 50-120 words
- Start with a strong professional identity (e.g., "Results-driven Software Engineer with 5+ years...")
- Highlight top 2-3 skills or technologies
- Mention most recent/relevant role
- End with value proposition
- Never fabricate anything not in the data
- Return ONLY the summary text`;

  const latestExp = resume.experience[0];
  const topSkills = resume.skills.slice(0, 6).map((s) => s.name);

  const userPrompt = `Generate a professional summary for:
Name: ${resume.contact_name || "this professional"}
Most recent role: ${latestExp ? `${latestExp.title} at ${latestExp.company}` : "N/A"}
Total experience entries: ${resume.experience.length}
Top skills: ${topSkills.join(", ") || "N/A"}
Education: ${resume.education[0] ? `${resume.education[0].degree} from ${resume.education[0].school}` : "N/A"}
Certifications: ${resume.certifications.map((c) => c.name).join(", ") || "none"}`;

  const aiResult = await callOpenAI(systemPrompt, userPrompt, 200);

  if (aiResult) {
    return { summary: aiResult, usedAI: true };
  }

  // Rule-based fallback
  const parts: string[] = [];
  if (latestExp) {
    parts.push(
      `Results-driven ${latestExp.title} with experience at ${latestExp.company}.`
    );
  }
  if (topSkills.length > 0) {
    parts.push(`Skilled in ${topSkills.slice(0, 4).join(", ")}.`);
  }
  parts.push("Passionate about delivering high-quality work and continuous improvement.");

  return { summary: parts.join(" "), usedAI: false };
}
