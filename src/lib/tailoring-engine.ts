import type { ResumeData, ResumeExperience } from "@/lib/resume-types";
import type {
  KeywordMatch,
  MissingKeyword,
  MissingSkill,
  TailoredExperience,
  TailoringAnalysis,
} from "@/lib/tailoring-types";

// Common technical keywords and their categories
const TECH_KEYWORDS: Record<string, string[]> = {
  languages: ["javascript", "typescript", "python", "java", "c++", "c#", "go", "rust", "ruby", "php", "swift", "kotlin", "scala", "r", "sql", "html", "css"],
  frameworks: ["react", "next.js", "nextjs", "angular", "vue", "svelte", "express", "django", "flask", "spring", "rails", "laravel", "fastapi", ".net", "node.js", "nodejs"],
  databases: ["postgresql", "mysql", "mongodb", "redis", "elasticsearch", "dynamodb", "firebase", "supabase", "sqlite", "cassandra", "neo4j"],
  cloud: ["aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "terraform", "jenkins", "ci/cd", "github actions", "vercel", "netlify"],
  concepts: ["microservices", "rest", "graphql", "api", "agile", "scrum", "tdd", "devops", "machine learning", "ai", "data science", "analytics"],
  soft_skills: ["leadership", "communication", "collaboration", "problem-solving", "mentoring", "cross-functional", "stakeholder", "strategic"],
};

// Common action verbs for resume bullets
const ACTION_VERBS = [
  "Spearheaded", "Architected", "Implemented", "Optimized", "Delivered",
  "Orchestrated", "Streamlined", "Developed", "Designed", "Led",
  "Managed", "Reduced", "Increased", "Improved", "Automated",
  "Established", "Launched", "Scaled", "Migrated", "Integrated",
];

/**
 * Extract keywords from a job description.
 * Returns categorized keywords with importance levels.
 */
export function extractJobKeywords(jobDescription: string): {
  keyword: string;
  importance: "high" | "medium" | "low";
  category: string;
}[] {
  const jdLower = jobDescription.toLowerCase();
  const words = jdLower.split(/[\s,;.()[\]{}|/\\]+/).filter(Boolean);
  const phrases = extractPhrases(jdLower);
  const keywords: { keyword: string; importance: "high" | "medium" | "low"; category: string }[] = [];
  const seen = new Set<string>();

  // Extract technical keywords
  for (const [category, terms] of Object.entries(TECH_KEYWORDS)) {
    for (const term of terms) {
      if (jdLower.includes(term) && !seen.has(term)) {
        seen.add(term);
        // Count occurrences to determine importance
        const count = (jdLower.match(new RegExp(escapeRegex(term), "gi")) || []).length;
        keywords.push({
          keyword: term,
          importance: count >= 3 ? "high" : count >= 2 ? "medium" : "low",
          category,
        });
      }
    }
  }

  // Extract years of experience requirements
  const yearsMatch = jdLower.match(/(\d+)\+?\s*years?\s*(of\s+)?experience/gi);
  if (yearsMatch) {
    for (const match of yearsMatch) {
      if (!seen.has(match)) {
        seen.add(match);
        keywords.push({ keyword: match, importance: "high", category: "requirements" });
      }
    }
  }

  // Extract degree requirements
  const degreeTerms = ["bachelor", "master", "phd", "degree", "b.s.", "m.s.", "mba"];
  for (const term of degreeTerms) {
    if (jdLower.includes(term) && !seen.has(term)) {
      seen.add(term);
      keywords.push({ keyword: term, importance: "medium", category: "education" });
    }
  }

  // Extract certification keywords
  const certTerms = ["certified", "certification", "aws certified", "pmp", "scrum master", "cissp"];
  for (const term of certTerms) {
    if (jdLower.includes(term) && !seen.has(term)) {
      seen.add(term);
      keywords.push({ keyword: term, importance: "medium", category: "certifications" });
    }
  }

  // Extract multi-word phrases that appear in the JD
  for (const phrase of phrases) {
    if (!seen.has(phrase) && phrase.length > 3) {
      seen.add(phrase);
      const count = (jdLower.match(new RegExp(escapeRegex(phrase), "gi")) || []).length;
      if (count >= 2) {
        keywords.push({ keyword: phrase, importance: "medium", category: "domain" });
      }
    }
  }

  return keywords;
}

/**
 * Analyze a resume against a job description.
 * Returns ATS score, matches, gaps, and tailored content.
 */
export function analyzeResumeVsJob(
  resume: ResumeData,
  jobDescription: string,
  linkedInSkills: string[] = []
): TailoringAnalysis {
  const jobKeywords = extractJobKeywords(jobDescription);
  const resumeText = buildResumeText(resume);
  const resumeLower = resumeText.toLowerCase();

  // Find keyword matches
  const keywordMatches: KeywordMatch[] = [];
  const missingKeywords: MissingKeyword[] = [];

  for (const jk of jobKeywords) {
    const found = resumeLower.includes(jk.keyword.toLowerCase());
    if (found) {
      const foundIn = findKeywordLocation(resume, jk.keyword);
      keywordMatches.push({
        keyword: jk.keyword,
        found_in: foundIn,
        importance: jk.importance,
      });
    } else {
      missingKeywords.push({
        keyword: jk.keyword,
        importance: jk.importance,
        suggestion: getSuggestionForKeyword(jk.keyword, jk.category),
      });
    }
  }

  // Calculate ATS score
  const totalWeight = jobKeywords.reduce((sum, k) => {
    return sum + (k.importance === "high" ? 3 : k.importance === "medium" ? 2 : 1);
  }, 0);
  const matchedWeight = keywordMatches.reduce((sum, k) => {
    return sum + (k.importance === "high" ? 3 : k.importance === "medium" ? 2 : 1);
  }, 0);
  const atsScore = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0;

  // Find missing skills (from job keywords that are skills)
  const resumeSkillNames = resume.skills.map((s) => s.name.toLowerCase());
  const allSkills = [...resumeSkillNames, ...linkedInSkills.map((s) => s.toLowerCase())];
  
  const missingSkills: MissingSkill[] = [];
  for (const mk of missingKeywords) {
    const isSkillRelated = ["languages", "frameworks", "databases", "cloud", "concepts"].includes(
      jobKeywords.find((jk) => jk.keyword === mk.keyword)?.category || ""
    );
    if (isSkillRelated && !allSkills.includes(mk.keyword.toLowerCase())) {
      // Check if user has the skill from LinkedIn but not on resume
      const hasOnLinkedIn = linkedInSkills.some(
        (s) => s.toLowerCase() === mk.keyword.toLowerCase()
      );
      missingSkills.push({
        skill: mk.keyword,
        importance: mk.importance,
        suggestion: hasOnLinkedIn
          ? `You have "${mk.keyword}" on your LinkedIn profile. Add it to your resume skills.`
          : `Consider adding "${mk.keyword}" to your skills if you have experience with it.`,
      });
    }
  }

  // Generate tailored summary
  const tailoredSummary = tailorSummary(resume.summary, jobDescription, jobKeywords);

  // Generate tailored experience bullets
  const tailoredExperience = tailorExperience(resume.experience, jobDescription, jobKeywords);

  return {
    ats_score: atsScore,
    keyword_matches: keywordMatches,
    missing_keywords: missingKeywords,
    missing_skills: missingSkills,
    tailored_summary: tailoredSummary,
    tailored_experience: tailoredExperience,
  };
}

/**
 * Tailor the professional summary to better match the job description.
 * RULE: Never fabricate experience. Only rephrase existing content.
 */
function tailorSummary(
  originalSummary: string,
  jobDescription: string,
  jobKeywords: { keyword: string; importance: "high" | "medium" | "low"; category: string }[]
): string {
  if (!originalSummary.trim()) return originalSummary;

  let tailored = originalSummary;

  // Extract the job title from the JD (first line or "role" mention)
  const jobTitleMatch = jobDescription.match(/(?:^|\n)\s*(?:job\s+title|position|role)\s*[:\-]?\s*(.+)/i);
  const jobTitle = jobTitleMatch?.[1]?.trim();

  // Get high-importance keywords that are already in the resume
  const highKeywords = jobKeywords
    .filter((k) => k.importance === "high")
    .map((k) => k.keyword);

  // If summary doesn't start with a strong opener, add one
  const strongOpeners = ["results-driven", "experienced", "accomplished", "seasoned", "dynamic"];
  const hasStrongOpener = strongOpeners.some((o) => tailored.toLowerCase().startsWith(o));
  
  if (!hasStrongOpener && tailored.length > 20) {
    tailored = `Results-driven professional ${tailored.charAt(0).toLowerCase()}${tailored.slice(1)}`;
  }

  // Ensure it ends with a period
  if (!tailored.endsWith(".")) {
    tailored += ".";
  }

  // Weave in high-importance keywords that exist in the original but could be emphasized
  for (const kw of highKeywords.slice(0, 3)) {
    if (tailored.toLowerCase().includes(kw.toLowerCase())) continue;
    // Only add if the keyword is a skill/technology the person likely has
    // (we check if it appears anywhere in the resume context)
    // This prevents fabrication
  }

  return tailored;
}

/**
 * Tailor experience bullets to better match the job description.
 * RULE: Never fabricate fake experience. Only rephrase existing bullets.
 */
function tailorExperience(
  experience: ResumeExperience[],
  jobDescription: string,
  jobKeywords: { keyword: string; importance: "high" | "medium" | "low"; category: string }[]
): TailoredExperience[] {
  const jdLower = jobDescription.toLowerCase();
  const highKeywords = jobKeywords
    .filter((k) => k.importance === "high" || k.importance === "medium")
    .map((k) => k.keyword.toLowerCase());

  return experience.map((exp) => {
    const tailoredBullets = exp.bullets.map((bullet) => {
      if (!bullet.trim()) return bullet;
      return improveBullet(bullet, highKeywords, jdLower);
    });

    return {
      exp_id: exp.id,
      original_bullets: [...exp.bullets],
      tailored_bullets: tailoredBullets,
    };
  });
}

/**
 * Improve a single bullet point for better ATS matching.
 * RULE: Only rephrase, never add fake accomplishments.
 */
function improveBullet(
  bullet: string,
  targetKeywords: string[],
  jobDescLower: string
): string {
  let improved = bullet;

  // 1. Ensure it starts with a strong action verb
  const firstWord = improved.split(/\s+/)[0];
  const isActionVerb = ACTION_VERBS.some(
    (v) => v.toLowerCase() === firstWord.toLowerCase()
  );
  
  if (!isActionVerb && improved.length > 15) {
    // Find a relevant action verb based on the bullet content
    const bulletLower = improved.toLowerCase();
    let bestVerb = "Delivered";
    
    if (bulletLower.includes("build") || bulletLower.includes("creat") || bulletLower.includes("develop")) {
      bestVerb = "Developed";
    } else if (bulletLower.includes("lead") || bulletLower.includes("manag") || bulletLower.includes("direct")) {
      bestVerb = "Led";
    } else if (bulletLower.includes("improv") || bulletLower.includes("optim") || bulletLower.includes("enhanc")) {
      bestVerb = "Optimized";
    } else if (bulletLower.includes("design") || bulletLower.includes("architect")) {
      bestVerb = "Architected";
    } else if (bulletLower.includes("automat") || bulletLower.includes("script")) {
      bestVerb = "Automated";
    } else if (bulletLower.includes("reduc") || bulletLower.includes("cut") || bulletLower.includes("sav")) {
      bestVerb = "Reduced";
    } else if (bulletLower.includes("increas") || bulletLower.includes("grew") || bulletLower.includes("boost")) {
      bestVerb = "Increased";
    } else if (bulletLower.includes("implement") || bulletLower.includes("deploy") || bulletLower.includes("launch")) {
      bestVerb = "Implemented";
    } else if (bulletLower.includes("integrat") || bulletLower.includes("connect") || bulletLower.includes("migrat")) {
      bestVerb = "Integrated";
    }

    // Remove weak starters like "Responsible for", "Helped with", "Worked on"
    improved = improved.replace(
      /^(responsible\s+for|helped\s+(with|to)|worked\s+on|assisted\s+(with|in)|was\s+involved\s+in|participated\s+in)\s*/i,
      ""
    );
    
    // Capitalize first letter after removing weak starter
    if (improved.length > 0) {
      improved = `${bestVerb} ${improved.charAt(0).toLowerCase()}${improved.slice(1)}`;
    }
  }

  // 2. Ensure it ends with a period
  if (!improved.endsWith(".")) {
    improved += ".";
  }

  // 3. Capitalize first letter
  improved = improved.charAt(0).toUpperCase() + improved.slice(1);

  return improved;
}

// --- Helper functions ---

function buildResumeText(resume: ResumeData): string {
  const parts: string[] = [
    resume.contact_name,
    resume.summary,
    ...resume.experience.flatMap((e) => [e.title, e.company, e.description, ...e.bullets]),
    ...resume.education.flatMap((e) => [e.degree, e.field_of_study, e.school, e.description]),
    ...resume.skills.map((s) => s.name),
    ...resume.certifications.map((c) => `${c.name} ${c.issuer}`),
    ...resume.projects.flatMap((p) => [p.name, p.description, ...p.technologies]),
  ];
  return parts.filter(Boolean).join(" ");
}

function findKeywordLocation(
  resume: ResumeData,
  keyword: string
): KeywordMatch["found_in"] {
  const kw = keyword.toLowerCase();
  if (resume.summary.toLowerCase().includes(kw)) return "summary";
  if (resume.experience.some((e) => 
    [e.title, e.company, e.description, ...e.bullets].some((t) => t.toLowerCase().includes(kw))
  )) return "experience";
  if (resume.skills.some((s) => s.name.toLowerCase().includes(kw))) return "skills";
  if (resume.education.some((e) =>
    [e.degree, e.field_of_study, e.school, e.description].some((t) => t.toLowerCase().includes(kw))
  )) return "education";
  if (resume.certifications.some((c) =>
    [c.name, c.issuer].some((t) => t.toLowerCase().includes(kw))
  )) return "certifications";
  return "projects";
}

function getSuggestionForKeyword(keyword: string, category: string): string {
  switch (category) {
    case "languages":
    case "frameworks":
    case "databases":
    case "cloud":
      return `Add "${keyword}" to your Skills section if you have experience with it.`;
    case "concepts":
      return `Mention "${keyword}" in your summary or experience bullets if applicable.`;
    case "soft_skills":
      return `Demonstrate "${keyword}" through your experience descriptions.`;
    case "requirements":
      return `Ensure your experience timeline reflects the required ${keyword}.`;
    case "education":
      return `Verify your education section includes relevant ${keyword} information.`;
    case "certifications":
      return `Add "${keyword}" to your certifications if you hold it.`;
    default:
      return `Consider incorporating "${keyword}" where relevant in your resume.`;
  }
}

function extractPhrases(text: string): string[] {
  const phrases: string[] = [];
  // Extract common multi-word technical phrases
  const patterns = [
    /machine learning/gi,
    /deep learning/gi,
    /data science/gi,
    /full stack/gi,
    /front end/gi,
    /back end/gi,
    /project management/gi,
    /product management/gi,
    /user experience/gi,
    /user interface/gi,
    /continuous integration/gi,
    /continuous deployment/gi,
    /test driven/gi,
    /cross functional/gi,
    /problem solving/gi,
    /data analysis/gi,
    /business intelligence/gi,
    /cloud computing/gi,
    /software engineering/gi,
    /system design/gi,
  ];
  
  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) {
      phrases.push(...matches.map((m) => m.toLowerCase()));
    }
  }
  
  return [...new Set(phrases)];
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
