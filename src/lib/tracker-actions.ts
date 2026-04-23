"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type {
  ApplicationStatus,
  ApplicationPriority,
  NoteType,
  InterviewType,
  CreateApplicationInput,
  InterviewQuestion,
} from "@/lib/tracker-types";

// ─── Applications ────────────────────────────────────────────────────────────

export async function getApplications() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return data || [];
}

export async function getApplication(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("applications")
    .select("*, notes:application_notes(*), interviews(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  return data;
}

export async function createApplication(input: CreateApplicationInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("applications")
    .insert({
      user_id: user.id,
      job_title: input.job_title,
      company: input.company,
      company_website: input.company_website || "",
      job_url: input.job_url || "",
      apply_url: input.apply_url || "",
      location: input.location || "",
      is_remote: input.is_remote || false,
      job_type: input.job_type || "full_time",
      salary_min: input.salary_min || 0,
      salary_max: input.salary_max || 0,
      status: input.status || "saved",
      priority: input.priority || "medium",
      applied_at: input.applied_at || null,
      deadline_at: input.deadline_at || null,
      resume_id: input.resume_id || null,
      job_id: input.job_id || null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating application:", error);
    return { error: "Failed to create application" };
  }

  return { success: true, id: data.id };
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const updates: Record<string, unknown> = { status };
  if (status === "applied") {
    updates.applied_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("applications")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating status:", error);
    return { error: "Failed to update status" };
  }

  return { success: true };
}

export async function updateApplication(
  id: string,
  updates: Partial<{
    job_title: string;
    company: string;
    company_website: string;
    job_url: string;
    apply_url: string;
    location: string;
    is_remote: boolean;
    job_type: string;
    salary_min: number;
    salary_max: number;
    status: ApplicationStatus;
    priority: ApplicationPriority;
    applied_at: string | null;
    deadline_at: string | null;
    reminder_at: string | null;
    resume_id: string | null;
  }>
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("applications")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating application:", error);
    return { error: "Failed to update application" };
  }

  return { success: true };
}

export async function deleteApplication(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("applications")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting application:", error);
    return { error: "Failed to delete application" };
  }

  return { success: true };
}

// ─── Notes ───────────────────────────────────────────────────────────────────

export async function getApplicationNotes(applicationId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("application_notes")
    .select("*")
    .eq("application_id", applicationId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function addNote(
  applicationId: string,
  content: string,
  noteType: NoteType = "general"
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("application_notes")
    .insert({
      user_id: user.id,
      application_id: applicationId,
      content,
      note_type: noteType,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error adding note:", error);
    return { error: "Failed to add note" };
  }

  return { success: true, id: data.id };
}

export async function deleteNote(noteId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("application_notes")
    .delete()
    .eq("id", noteId)
    .eq("user_id", user.id);

  if (error) return { error: "Failed to delete note" };
  return { success: true };
}

// ─── Interviews ───────────────────────────────────────────────────────────────

export async function getInterviews(applicationId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("interviews")
    .select("*")
    .eq("application_id", applicationId)
    .eq("user_id", user.id)
    .order("scheduled_at", { ascending: true });

  return data || [];
}

export async function addInterview(
  applicationId: string,
  input: {
    interview_type: InterviewType;
    scheduled_at: string;
    duration_minutes?: number;
    location?: string;
    meeting_url?: string;
    interviewer_name?: string;
    interviewer_title?: string;
    prep_notes?: string;
  }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("interviews")
    .insert({
      user_id: user.id,
      application_id: applicationId,
      interview_type: input.interview_type,
      scheduled_at: input.scheduled_at,
      duration_minutes: input.duration_minutes || 60,
      location: input.location || "",
      meeting_url: input.meeting_url || "",
      interviewer_name: input.interviewer_name || "",
      interviewer_title: input.interviewer_title || "",
      prep_notes: input.prep_notes || "",
      status: "scheduled",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error adding interview:", error);
    return { error: "Failed to add interview" };
  }

  // Auto-update application status to interview
  await supabase
    .from("applications")
    .update({ status: "interview" })
    .eq("id", applicationId)
    .eq("user_id", user.id);

  return { success: true, id: data.id };
}

export async function updateInterview(
  interviewId: string,
  updates: Partial<{
    status: string;
    outcome: string;
    feedback: string;
    prep_notes: string;
    scheduled_at: string;
  }>
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("interviews")
    .update(updates)
    .eq("id", interviewId)
    .eq("user_id", user.id);

  if (error) return { error: "Failed to update interview" };
  return { success: true };
}

export async function deleteInterview(interviewId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("interviews")
    .delete()
    .eq("id", interviewId)
    .eq("user_id", user.id);

  if (error) return { error: "Failed to delete interview" };
  return { success: true };
}

// ─── AI Interview Prep ────────────────────────────────────────────────────────

export async function generateAIPrep(applicationId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Get application details
  const { data: app } = await supabase
    .from("applications")
    .select("*")
    .eq("id", applicationId)
    .eq("user_id", user.id)
    .single();

  if (!app) return { error: "Application not found" };

  // Get user's resume for context
  const { data: resumes } = await supabase
    .from("resumes")
    .select("skills, experience, summary")
    .eq("user_id", user.id)
    .limit(1);

  // Get LinkedIn data
  const { data: linkedinImport } = await supabase
    .from("linkedin_imports")
    .select("profile_data")
    .eq("user_id", user.id)
    .eq("consent_given", true)
    .single();

  const resume = resumes?.[0];
  const linkedinData = linkedinImport?.profile_data as Record<string, unknown> | null;

  // Generate interview questions based on job title and company
  const questions = generateInterviewQuestions(
    app.job_title,
    app.company,
    resume,
    linkedinData
  );

  // Generate salary tips
  const salaryTips = generateSalaryTips(
    app.job_title,
    app.salary_min,
    app.salary_max,
    linkedinData
  );

  // Generate career suggestions
  const careerSuggestions = generateCareerSuggestions(
    app.job_title,
    app.company,
    linkedinData
  );

  // Save to application
  const { error } = await supabase
    .from("applications")
    .update({
      ai_prep_generated: true,
      ai_interview_questions: JSON.stringify(questions),
      ai_salary_tips: salaryTips,
      ai_career_suggestions: careerSuggestions,
    })
    .eq("id", applicationId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error saving AI prep:", error);
    return { error: "Failed to save AI prep" };
  }

  return { success: true, questions, salaryTips, careerSuggestions };
}

// ─── AI Generation Helpers ────────────────────────────────────────────────────

function generateInterviewQuestions(
  jobTitle: string,
  company: string,
  resume: Record<string, unknown> | undefined,
  linkedinData: Record<string, unknown> | null
): InterviewQuestion[] {
  const title = jobTitle.toLowerCase();
  const questions: InterviewQuestion[] = [];

  // Universal behavioral questions
  const behavioral: InterviewQuestion[] = [
    {
      question: "Tell me about yourself and your background.",
      category: "behavioral",
      difficulty: "easy",
      tip: "Use the Present-Past-Future formula: current role → relevant past experience → why this role excites you.",
    },
    {
      question: "Describe a time you faced a significant challenge at work. How did you handle it?",
      category: "behavioral",
      difficulty: "medium",
      tip: "Use STAR method: Situation, Task, Action, Result. Quantify the outcome if possible.",
    },
    {
      question: "Tell me about a time you worked in a team to achieve a goal.",
      category: "behavioral",
      difficulty: "easy",
      tip: "Highlight your specific contribution and how you collaborated. Mention any conflict resolution.",
    },
    {
      question: "Describe a situation where you had to meet a tight deadline.",
      category: "behavioral",
      difficulty: "medium",
      tip: "Show prioritization skills and how you communicated progress to stakeholders.",
    },
    {
      question: "Tell me about a time you received critical feedback. How did you respond?",
      category: "behavioral",
      difficulty: "medium",
      tip: "Show self-awareness and growth mindset. Describe what you changed as a result.",
    },
  ];

  questions.push(...behavioral);

  // Role-specific technical questions
  if (
    title.includes("engineer") ||
    title.includes("developer") ||
    title.includes("software")
  ) {
    questions.push(
      {
        question: "Walk me through your approach to debugging a complex production issue.",
        category: "technical",
        difficulty: "hard",
        tip: "Describe your systematic approach: reproduce, isolate, hypothesize, test, fix, and prevent recurrence.",
      },
      {
        question: "How do you ensure code quality in your projects?",
        category: "technical",
        difficulty: "medium",
        tip: "Mention code reviews, testing strategies (unit/integration/e2e), linting, and documentation.",
      },
      {
        question: "Describe your experience with system design and scalability.",
        category: "technical",
        difficulty: "hard",
        tip: "Discuss trade-offs, CAP theorem awareness, caching strategies, and horizontal vs vertical scaling.",
      }
    );
  }

  if (title.includes("manager") || title.includes("lead") || title.includes("director")) {
    questions.push(
      {
        question: "How do you handle underperforming team members?",
        category: "behavioral",
        difficulty: "hard",
        tip: "Show empathy first, then describe a structured approach: identify root cause, set clear expectations, provide support, and document progress.",
      },
      {
        question: "How do you prioritize competing projects and resources?",
        category: "situational",
        difficulty: "hard",
        tip: "Discuss frameworks like RICE or MoSCoW, stakeholder alignment, and how you communicate trade-offs.",
      },
      {
        question: "Describe your leadership style and how you adapt it.",
        category: "behavioral",
        difficulty: "medium",
        tip: "Reference situational leadership — different team members need different levels of direction and support.",
      }
    );
  }

  if (title.includes("product") || title.includes("pm")) {
    questions.push(
      {
        question: "How do you prioritize features in a product roadmap?",
        category: "role",
        difficulty: "hard",
        tip: "Mention frameworks: RICE, ICE, Kano model. Emphasize data-driven decisions and user research.",
      },
      {
        question: "Tell me about a product you launched. What was the outcome?",
        category: "role",
        difficulty: "medium",
        tip: "Use metrics: DAU, retention, NPS, revenue impact. Discuss what you'd do differently.",
      }
    );
  }

  if (title.includes("design") || title.includes("ux") || title.includes("ui")) {
    questions.push(
      {
        question: "Walk me through your design process from research to final delivery.",
        category: "role",
        difficulty: "medium",
        tip: "Cover: discovery, user research, ideation, prototyping, testing, and iteration. Mention tools used.",
      },
      {
        question: "How do you handle disagreements with engineers or stakeholders about design decisions?",
        category: "behavioral",
        difficulty: "hard",
        tip: "Show data-driven advocacy: user research, usability testing results, and willingness to compromise.",
      }
    );
  }

  if (title.includes("data") || title.includes("analyst") || title.includes("scientist")) {
    questions.push(
      {
        question: "Describe a data analysis project that had a significant business impact.",
        category: "role",
        difficulty: "medium",
        tip: "Quantify the impact. Describe your methodology, tools used, and how you communicated findings.",
      },
      {
        question: "How do you handle missing or dirty data in your analyses?",
        category: "technical",
        difficulty: "medium",
        tip: "Discuss imputation strategies, outlier detection, data validation, and when to flag data quality issues.",
      }
    );
  }

  // Culture fit questions
  questions.push(
    {
      question: `Why do you want to work at ${company}?`,
      category: "culture",
      difficulty: "easy",
      tip: `Research ${company}'s mission, recent news, products, and culture. Connect their values to your own career goals.`,
    },
    {
      question: "Where do you see yourself in 3-5 years?",
      category: "culture",
      difficulty: "easy",
      tip: "Align your growth goals with the trajectory this role offers. Show ambition without implying you'll leave soon.",
    },
    {
      question: "What motivates you in your work?",
      category: "culture",
      difficulty: "easy",
      tip: "Be authentic. Connect your motivators to the role's responsibilities — impact, learning, collaboration, etc.",
    }
  );

  // Add skills-based questions from resume
  const skills = (resume?.skills as Array<{ name: string }>) || [];
  if (skills.length > 0) {
    const topSkills = skills.slice(0, 3).map((s) => s.name);
    topSkills.forEach((skill) => {
      questions.push({
        question: `Can you describe a project where you used ${skill} extensively?`,
        category: "technical",
        difficulty: "medium",
        tip: `Be specific about the problem you solved with ${skill}, the scale of the project, and measurable outcomes.`,
      });
    });
  }

  return questions.slice(0, 15); // Return top 15 questions
}

function generateSalaryTips(
  jobTitle: string,
  salaryMin: number,
  salaryMax: number,
  linkedinData: Record<string, unknown> | null
): string {
  const title = jobTitle.toLowerCase();
  const yearsExp = linkedinData
    ? ((linkedinData.positions as unknown[]) || []).length * 2
    : 3;

  const tips: string[] = [];

  tips.push(
    "**Research Market Rates First**\nCheck Glassdoor, Levels.fyi, LinkedIn Salary, and Payscale for your role and location. Know the 25th, 50th, and 75th percentile ranges before any conversation."
  );

  if (salaryMin > 0 && salaryMax > 0) {
    const midpoint = Math.round((salaryMin + salaryMax) / 2);
    tips.push(
      `**This Role's Range: $${salaryMin.toLocaleString()} – $${salaryMax.toLocaleString()}**\nThe midpoint is ~$${midpoint.toLocaleString()}. Aim to negotiate toward the upper 60-70% of the range. If you have strong experience, don't be afraid to ask above the posted max.`
    );
  }

  tips.push(
    "**Never Give a Number First**\nWhen asked about salary expectations, try: *\"I'd love to understand the full compensation package first. What's the budgeted range for this role?\"* This keeps you from anchoring too low.",

    "**Consider Total Compensation**\nBase salary is just one piece. Evaluate: equity/RSUs, annual bonus, signing bonus, 401k match, health benefits, PTO, remote flexibility, and professional development budget.",

    "**Negotiate After the Offer**\nOnce you receive an offer, you have maximum leverage. Express enthusiasm, then ask: *\"I'm very excited about this opportunity. Is there flexibility on the base salary?\"*",

    "**Use Competing Offers Strategically**\nIf you have other offers, you can mention them: *\"I have another offer at $X, but I'm more excited about this role. Can you match or come close?\"*"
  );

  if (yearsExp >= 5) {
    tips.push(
      "**Senior Leverage**\nWith your experience level, you're in a strong negotiating position. Don't undersell yourself — companies expect senior candidates to negotiate."
    );
  }

  tips.push(
    "**Get It in Writing**\nOnce you agree on terms, ask for the offer letter before giving notice at your current job. Verbal offers can change."
  );

  return tips.join("\n\n");
}

function generateCareerSuggestions(
  jobTitle: string,
  company: string,
  linkedinData: Record<string, unknown> | null
): string {
  const title = jobTitle.toLowerCase();
  const suggestions: string[] = [];

  suggestions.push(
    `## Career Progression from ${jobTitle} at ${company}`
  );

  // Role-specific progression paths
  if (title.includes("engineer") || title.includes("developer")) {
    suggestions.push(
      "**Typical Engineering Career Ladder:**\n→ Junior Engineer → Mid-Level Engineer → Senior Engineer → Staff Engineer → Principal Engineer → Distinguished Engineer/Fellow\n\nAlternatively: Senior Engineer → Engineering Manager → Director of Engineering → VP Engineering → CTO",

      "**Skills to Develop for Advancement:**\n• System design and architecture at scale\n• Technical leadership and mentoring\n• Cross-functional collaboration (PM, Design, Data)\n• Business impact measurement\n• Open source contributions or public technical writing"
    );
  } else if (title.includes("product") || title.includes("pm")) {
    suggestions.push(
      "**Typical Product Career Ladder:**\n→ Associate PM → PM → Senior PM → Group PM → Director of Product → VP Product → CPO",

      "**Skills to Develop for Advancement:**\n• Data analysis and SQL proficiency\n• Go-to-market strategy\n• Executive communication and storytelling\n• P&L ownership\n• Building and managing PM teams"
    );
  } else if (title.includes("manager") || title.includes("lead")) {
    suggestions.push(
      "**Typical Management Career Ladder:**\n→ Team Lead → Manager → Senior Manager → Director → VP → SVP → C-Suite",

      "**Skills to Develop for Advancement:**\n• Strategic planning and OKR setting\n• Budget management\n• Executive presence and board communication\n• Organizational design\n• Change management"
    );
  } else if (title.includes("data") || title.includes("analyst")) {
    suggestions.push(
      "**Typical Data Career Ladder:**\n→ Data Analyst → Senior Analyst → Lead Analyst → Analytics Manager → Director of Analytics → VP Data → Chief Data Officer",

      "**Skills to Develop for Advancement:**\n• Machine learning and predictive modeling\n• Data engineering (pipelines, warehouses)\n• Business strategy and executive communication\n• Team leadership\n• Experiment design and causal inference"
    );
  } else {
    suggestions.push(
      "**General Career Advancement Tips:**\n• Build a strong track record of measurable impact\n• Develop cross-functional relationships\n• Seek stretch assignments and high-visibility projects\n• Find a mentor in senior leadership\n• Build your external brand (writing, speaking, networking)"
    );
  }

  // LinkedIn-based suggestions
  if (linkedinData) {
    const connections = (linkedinData.connections as number) || 0;
    if (connections < 500) {
      suggestions.push(
        "**Grow Your Network:**\nYour LinkedIn network can be stronger. Connect with colleagues, alumni, and industry peers. A strong network accelerates career opportunities — aim for 500+ connections in your field."
      );
    }

    const positions = (linkedinData.positions as Array<{ company: string }>) || [];
    if (positions.length > 0) {
      const companies = positions.map((p) => p.company).filter(Boolean);
      suggestions.push(
        `**Leverage Your Background:**\nYour experience at ${companies.slice(0, 2).join(" and ")} is valuable. Make sure your LinkedIn profile highlights specific achievements with metrics from each role.`
      );
    }
  }

  suggestions.push(
    "**30-60-90 Day Plan for This Role:**\n• **First 30 days:** Listen, learn, and build relationships. Understand the team's goals, processes, and pain points.\n• **First 60 days:** Identify quick wins. Deliver on small projects to build credibility.\n• **First 90 days:** Propose and begin executing a meaningful initiative that aligns with team OKRs.",

    "**Building Your Personal Brand:**\n• Document your wins and impact regularly (keep a brag doc)\n• Share insights on LinkedIn to build thought leadership\n• Attend industry conferences and meetups\n• Contribute to open source, write blog posts, or speak at events"
  );

  return suggestions.join("\n\n");
}

// ─── LinkedIn Career Progression ──────────────────────────────────────────────

export async function getLinkedInCareerProgression() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: linkedinImport } = await supabase
    .from("linkedin_imports")
    .select("profile_data")
    .eq("user_id", user.id)
    .eq("consent_given", true)
    .single();

  if (!linkedinImport?.profile_data) return null;

  const ld = linkedinImport.profile_data as Record<string, unknown>;
  const positions = (ld.positions as Array<{
    title: string;
    company: string;
    start_date: string;
    end_date: string | null;
    description: string;
  }>) || [];

  if (positions.length === 0) return null;

  // Calculate career stats
  const totalYears = positions.reduce((acc, pos) => {
    const start = new Date(pos.start_date || "2020-01-01");
    const end = pos.end_date ? new Date(pos.end_date) : new Date();
    const years = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return acc + years;
  }, 0);

  // Identify career trajectory
  const titleProgression = positions.map((p) => p.title).reverse();
  const companies = [...new Set(positions.map((p) => p.company))];

  // Detect seniority progression
  const seniorityKeywords = ["junior", "associate", "mid", "senior", "lead", "principal", "staff", "director", "vp", "chief"];
  const seniorityLevels = titleProgression.map((title) => {
    const t = title.toLowerCase();
    for (const kw of seniorityKeywords) {
      if (t.includes(kw)) return kw;
    }
    return "mid";
  });

  return {
    totalYearsExperience: Math.round(totalYears * 10) / 10,
    totalPositions: positions.length,
    totalCompanies: companies.length,
    positions: positions.reverse(), // Most recent first
    titleProgression,
    seniorityLevels,
    skills: (ld.skills as string[]) || [],
    headline: (ld.headline as string) || "",
    summary: (ld.summary as string) || "",
    connections: (ld.connections as number) || 0,
  };
}

// ─── Tracker Stats ────────────────────────────────────────────────────────────

export async function getTrackerStats() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: apps } = await supabase
    .from("applications")
    .select("status, created_at, applied_at")
    .eq("user_id", user.id);

  if (!apps) return null;

  const stats = {
    total: apps.length,
    saved: apps.filter((a) => a.status === "saved").length,
    applied: apps.filter((a) => a.status === "applied").length,
    interview: apps.filter((a) => a.status === "interview").length,
    offer: apps.filter((a) => a.status === "offer").length,
    rejected: apps.filter((a) => a.status === "rejected").length,
    archived: apps.filter((a) => a.status === "archived").length,
    responseRate:
      apps.length > 0
        ? Math.round(
            (apps.filter((a) =>
              ["interview", "offer", "rejected"].includes(a.status)
            ).length /
              Math.max(apps.filter((a) => a.status !== "saved").length, 1)) *
              100
          )
        : 0,
    offerRate:
      apps.length > 0
        ? Math.round(
            (apps.filter((a) => a.status === "offer").length /
              Math.max(apps.filter((a) => a.status !== "saved").length, 1)) *
              100
          )
        : 0,
  };

  return stats;
}
