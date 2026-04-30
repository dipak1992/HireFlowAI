// src/lib/resume-parser.ts
// GPT-4o Vision-based resume parser — returns data shaped to match ResumeData

import OpenAI from "openai";
import type {
  ResumeData,
  ResumeExperience,
  ResumeEducation,
  ResumeSkill,
  ResumeCertification,
  ResumeProject,
} from "@/lib/resume-types";
import { EMPTY_RESUME } from "@/lib/resume-types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const PARSE_PROMPT = `You are a resume parser. Extract all information from this resume image and return a JSON object with exactly this structure:

{
  "contact_name": "Full Name",
  "contact_email": "email@example.com",
  "contact_phone": "+1 555-555-5555",
  "contact_location": "City, State",
  "contact_website": "https://...",
  "contact_linkedin": "https://linkedin.com/in/...",
  "summary": "Professional summary text",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, State",
      "start_date": "Jan 2020",
      "end_date": "Present",
      "is_current": true,
      "description": "",
      "bullets": ["Achievement 1", "Achievement 2"]
    }
  ],
  "education": [
    {
      "school": "University Name",
      "degree": "Bachelor of Science",
      "field_of_study": "Computer Science",
      "location": "City, State",
      "start_date": "2016",
      "end_date": "2020",
      "gpa": "3.8",
      "description": ""
    }
  ],
  "skills": [
    { "name": "JavaScript", "level": "advanced", "category": "Programming" }
  ],
  "certifications": [
    { "name": "AWS Solutions Architect", "issuer": "Amazon", "date": "2023", "url": "" }
  ],
  "projects": [
    { "name": "Project Name", "description": "Description", "url": "", "technologies": ["React", "Node.js"] }
  ]
}

Rules:
- Use empty string "" for missing text fields
- Use empty array [] for missing array fields
- For skill level use only: "beginner" | "intermediate" | "advanced" | "expert"
- is_current should be true only if end_date is "Present" or similar
- Return ONLY valid JSON, no markdown, no explanation`;

export interface ParsedResumeData {
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  contact_location: string;
  contact_website: string;
  contact_linkedin: string;
  summary: string;
  experience: Omit<ResumeExperience, "id">[];
  education: Omit<ResumeEducation, "id">[];
  skills: Omit<ResumeSkill, "id">[];
  certifications: Omit<ResumeCertification, "id">[];
  projects: Omit<ResumeProject, "id">[];
}

export async function parseResumeFromBase64(
  base64Image: string,
  mimeType: "image/jpeg" | "image/png" | "image/webp" | "application/pdf"
): Promise<ParsedResumeData> {
  // For PDFs we can't use vision directly — convert first page to image
  // For now, treat PDF as an image (works if it's a single-page image-based PDF)
  const imageUrl = `data:${mimeType};base64,${base64Image}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: imageUrl, detail: "high" },
          },
          {
            type: "text",
            text: PARSE_PROMPT,
          },
        ],
      },
    ],
  });

  const raw = response.choices[0]?.message?.content ?? "{}";

  let parsed: Partial<ParsedResumeData>;
  try {
    // Strip markdown code fences if present
    const cleaned = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    parsed = JSON.parse(cleaned);
  } catch {
    parsed = {};
  }

  // Merge with safe defaults and add IDs
  const addId = <T extends object>(arr: T[]): (T & { id: string })[] =>
    (arr ?? []).map((item) => ({
      ...item,
      id: crypto.randomUUID(),
    }));

  return {
    contact_name: parsed.contact_name ?? "",
    contact_email: parsed.contact_email ?? "",
    contact_phone: parsed.contact_phone ?? "",
    contact_location: parsed.contact_location ?? "",
    contact_website: parsed.contact_website ?? "",
    contact_linkedin: parsed.contact_linkedin ?? "",
    summary: parsed.summary ?? "",
    experience: addId(parsed.experience ?? []) as Omit<ResumeExperience, "id">[],
    education: addId(parsed.education ?? []) as Omit<ResumeEducation, "id">[],
    skills: addId(parsed.skills ?? []) as Omit<ResumeSkill, "id">[],
    certifications: addId(parsed.certifications ?? []) as Omit<ResumeCertification, "id">[],
    projects: addId(parsed.projects ?? []) as Omit<ResumeProject, "id">[],
  };
}

/**
 * Merge parsed resume data into an EMPTY_RESUME-shaped object ready for DB insert.
 */
export function buildResumeDataFromParsed(
  parsed: ParsedResumeData,
  title: string = "Uploaded Resume"
): Omit<ResumeData, "id" | "user_id" | "created_at" | "updated_at"> {
  return {
    ...EMPTY_RESUME,
    title,
    source: "upload",
    contact_name: parsed.contact_name,
    contact_email: parsed.contact_email,
    contact_phone: parsed.contact_phone,
    contact_location: parsed.contact_location,
    contact_website: parsed.contact_website,
    contact_linkedin: parsed.contact_linkedin,
    summary: parsed.summary,
    experience: parsed.experience as ResumeExperience[],
    education: parsed.education as ResumeEducation[],
    skills: parsed.skills as ResumeSkill[],
    certifications: parsed.certifications as ResumeCertification[],
    projects: parsed.projects as ResumeProject[],
  };
}
