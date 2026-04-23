/**
 * Rule-based AI fallbacks for resume improvement.
 * Used when OPENAI_API_KEY is not set or the API call fails.
 */

import type { ResumeData } from "@/lib/resume-types";

// Strong action verbs mapped to intent signals
const VERB_MAP: Record<string, string> = {
  build: "Developed",
  creat: "Created",
  develop: "Developed",
  lead: "Led",
  manag: "Managed",
  direct: "Directed",
  improv: "Improved",
  optim: "Optimized",
  enhanc: "Enhanced",
  design: "Designed",
  architect: "Architected",
  automat: "Automated",
  script: "Automated",
  reduc: "Reduced",
  cut: "Reduced",
  sav: "Saved",
  increas: "Increased",
  grew: "Grew",
  boost: "Boosted",
  implement: "Implemented",
  deploy: "Deployed",
  launch: "Launched",
  integrat: "Integrated",
  connect: "Integrated",
  migrat: "Migrated",
  stream: "Streamlined",
  collaborat: "Collaborated",
  partner: "Partnered",
  support: "Supported",
  analyz: "Analyzed",
  research: "Researched",
  present: "Presented",
  train: "Trained",
  mentor: "Mentored",
  coach: "Coached",
};

const WEAK_STARTERS =
  /^(responsible\s+for|helped\s+(with|to)|worked\s+on|assisted\s+(with|in)|was\s+involved\s+in|participated\s+in|duties\s+included?|my\s+role\s+was)\s*/i;

/**
 * Improve a single bullet point using rule-based heuristics.
 */
export function improveBulletRuleBased(bullet: string): string {
  if (!bullet.trim()) return bullet;

  let improved = bullet.trim();

  // Remove weak starters
  improved = improved.replace(WEAK_STARTERS, "");

  // Check if it already starts with a strong action verb
  const firstWord = improved.split(/\s+/)[0]?.toLowerCase() ?? "";
  const alreadyStrong = Object.values(VERB_MAP).some(
    (v) => v.toLowerCase() === firstWord
  );

  if (!alreadyStrong && improved.length > 10) {
    // Find the best verb based on content signals
    const lower = improved.toLowerCase();
    let bestVerb = "Delivered";

    for (const [signal, verb] of Object.entries(VERB_MAP)) {
      if (lower.includes(signal)) {
        bestVerb = verb;
        break;
      }
    }

    // Lowercase the first char of the remaining text before prepending verb
    improved = `${bestVerb} ${improved.charAt(0).toLowerCase()}${improved.slice(1)}`;
  }

  // Ensure ends with period
  if (!improved.endsWith(".") && !improved.endsWith("!") && !improved.endsWith("?")) {
    improved += ".";
  }

  // Capitalize first letter
  improved = improved.charAt(0).toUpperCase() + improved.slice(1);

  return improved;
}

/**
 * Enhance a professional summary using rule-based heuristics.
 */
export function enhanceSummaryRuleBased(
  summary: string,
  name: string,
  experienceCount: number
): string {
  if (!summary.trim()) return summary;

  let enhanced = summary.trim();

  const strongOpeners = [
    "results-driven",
    "experienced",
    "accomplished",
    "seasoned",
    "dynamic",
    "dedicated",
    "motivated",
    "passionate",
    "skilled",
    "proven",
  ];

  const hasStrongOpener = strongOpeners.some((o) =>
    enhanced.toLowerCase().startsWith(o)
  );

  if (!hasStrongOpener && enhanced.length > 20) {
    const yearsText =
      experienceCount > 0 ? ` with ${experienceCount}+ years of experience` : "";
    enhanced = `Results-driven professional${yearsText}. ${enhanced}`;
  }

  // Ensure ends with period
  if (!enhanced.endsWith(".")) {
    enhanced += ".";
  }

  // Capitalize first letter
  enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);

  return enhanced;
}

/**
 * Score a resume for ATS compatibility using rule-based heuristics.
 * Returns a score 0-100 and actionable feedback tips.
 */
export function scoreResumeRuleBased(resume: ResumeData): {
  score: number;
  feedback: string[];
} {
  let score = 0;
  const feedback: string[] = [];

  // Contact completeness (20 pts)
  if (resume.contact_name) score += 5;
  if (resume.contact_email) score += 5;
  if (resume.contact_phone) score += 4;
  if (resume.contact_location) score += 3;
  if (resume.contact_linkedin) score += 3;

  if (!resume.contact_phone) feedback.push("Add a phone number to your contact info.");
  if (!resume.contact_location) feedback.push("Add your location (City, State).");
  if (!resume.contact_linkedin) feedback.push("Add your LinkedIn profile URL.");

  // Summary (15 pts)
  if (resume.summary) {
    const wordCount = resume.summary.split(/\s+/).length;
    if (wordCount >= 30) score += 15;
    else if (wordCount >= 15) score += 10;
    else score += 5;
  } else {
    feedback.push("Add a professional summary (3-5 sentences).");
  }

  // Experience (30 pts)
  if (resume.experience.length === 0) {
    feedback.push("Add at least one work experience entry.");
  } else {
    score += Math.min(15, resume.experience.length * 5);
    const totalBullets = resume.experience.reduce(
      (sum, e) => sum + e.bullets.filter((b) => b.trim()).length,
      0
    );
    if (totalBullets >= 6) score += 15;
    else if (totalBullets >= 3) score += 10;
    else {
      score += 5;
      feedback.push("Add more bullet points to your experience (3+ per role).");
    }

    // Check for action verbs
    const bulletsWithVerbs = resume.experience
      .flatMap((e) => e.bullets)
      .filter((b) => {
        const first = b.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
        return Object.values(VERB_MAP).some((v) => v.toLowerCase() === first);
      }).length;
    const totalNonEmptyBullets = resume.experience
      .flatMap((e) => e.bullets)
      .filter((b) => b.trim()).length;

    if (totalNonEmptyBullets > 0 && bulletsWithVerbs / totalNonEmptyBullets < 0.5) {
      feedback.push("Start bullet points with strong action verbs (Led, Built, Reduced...).");
    }
  }

  // Skills (20 pts)
  if (resume.skills.length === 0) {
    feedback.push("Add skills to your resume.");
  } else if (resume.skills.length < 5) {
    score += 10;
    feedback.push("Add more skills (aim for 8-15 relevant skills).");
  } else if (resume.skills.length <= 15) {
    score += 20;
  } else {
    score += 15;
    feedback.push("Consider trimming skills to the most relevant 10-15.");
  }

  // Education (10 pts)
  if (resume.education.length > 0) {
    score += 10;
  } else {
    feedback.push("Add your education history.");
  }

  // Bonus: certifications & projects (5 pts)
  if (resume.certifications.length > 0) score += 3;
  if (resume.projects.length > 0) score += 2;

  // Cap at 100
  score = Math.min(100, score);

  // If score is high but no specific feedback, add a positive tip
  if (feedback.length === 0) {
    feedback.push("Great resume! Tailor keywords to each job description for best results.");
  }

  return { score, feedback: feedback.slice(0, 5) };
}
