// src/lib/interview-prep-engine.ts
// GPT-4o interview prep generator

import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type QuestionCategory =
  | "behavioral"
  | "technical"
  | "situational"
  | "culture"
  | "role";

export interface InterviewQuestion {
  id: string;
  category: QuestionCategory;
  question: string;
  why: string; // why interviewers ask this
  starGuide: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  tips: string[];
  sampleAnswer?: string;
}

export interface CompanyResearch {
  mission: string;
  recentNews: string[];
  culture: string;
  interviewStyle: string;
}

export interface InterviewPrepResult {
  jobTitle: string;
  company: string;
  questions: InterviewQuestion[];
  companyResearch: CompanyResearch;
  generalTips: string[];
  generatedAt: string;
}

// ─── Generate interview prep ──────────────────────────────────────────────────

export async function generateInterviewPrep({
  jobTitle,
  company,
  jobDescription,
  resumeSummary,
}: {
  jobTitle: string;
  company: string;
  jobDescription: string;
  resumeSummary?: string;
}): Promise<{ result: InterviewPrepResult | null; error: string | null }> {
  try {
    const systemPrompt = `You are an expert interview coach with 20+ years of experience helping candidates land jobs at top companies. 
You provide highly specific, actionable interview preparation tailored to the exact job and company.
Always respond with valid JSON only — no markdown, no code blocks, just raw JSON.`;

    const userPrompt = `Generate comprehensive interview preparation for this candidate:

JOB TITLE: ${jobTitle}
COMPANY: ${company}
JOB DESCRIPTION: ${jobDescription.slice(0, 2000)}
${resumeSummary ? `CANDIDATE BACKGROUND: ${resumeSummary.slice(0, 500)}` : ""}

Generate exactly 10 interview questions across these categories:
- 3 behavioral questions (past experience, STAR format)
- 2 technical questions (role-specific skills)
- 2 situational questions (hypothetical scenarios)
- 2 culture/values questions
- 1 role-specific question

For each question, provide:
- The question text
- Why interviewers ask it
- STAR framework guide (situation/task/action/result prompts)
- 2-3 specific tips

Also provide:
- Company research (mission, 2-3 recent news items, culture notes, interview style)
- 5 general interview tips specific to this role/company

Respond with this exact JSON structure:
{
  "jobTitle": "${jobTitle}",
  "company": "${company}",
  "questions": [
    {
      "id": "q1",
      "category": "behavioral",
      "question": "...",
      "why": "...",
      "starGuide": {
        "situation": "Think about a time when...",
        "task": "What was your responsibility...",
        "action": "What specific steps did you take...",
        "result": "What was the measurable outcome..."
      },
      "tips": ["tip1", "tip2"]
    }
  ],
  "companyResearch": {
    "mission": "...",
    "recentNews": ["news1", "news2"],
    "culture": "...",
    "interviewStyle": "..."
  },
  "generalTips": ["tip1", "tip2", "tip3", "tip4", "tip5"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return { result: null, error: "No response from AI" };
    }

    const parsed = JSON.parse(content) as InterviewPrepResult;
    parsed.generatedAt = new Date().toISOString();

    // Ensure all questions have IDs
    parsed.questions = parsed.questions.map((q, i) => ({
      ...q,
      id: q.id || `q${i + 1}`,
    }));

    return { result: parsed, error: null };
  } catch (err) {
    console.error("Interview prep generation error:", err);
    if (err instanceof SyntaxError) {
      return { result: null, error: "Failed to parse AI response. Please try again." };
    }
    return { result: null, error: "Failed to generate interview prep. Please try again." };
  }
}

// ─── Category display config ──────────────────────────────────────────────────

export const CATEGORY_CONFIG: Record<
  QuestionCategory,
  { label: string; color: string; description: string }
> = {
  behavioral: {
    label: "Behavioral",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    description: "Past experience questions using STAR format",
  },
  technical: {
    label: "Technical",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    description: "Role-specific skills and knowledge",
  },
  situational: {
    label: "Situational",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    description: "Hypothetical scenarios and problem-solving",
  },
  culture: {
    label: "Culture Fit",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    description: "Values, work style, and team fit",
  },
  role: {
    label: "Role-Specific",
    color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    description: "Questions specific to this position",
  },
};
