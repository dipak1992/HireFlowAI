// src/components/landing/faq-section.tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is resume tailoring?",
    answer:
      "Resume tailoring is the process of customizing your resume for each specific job you apply to. Instead of sending the same generic resume everywhere, you adjust your bullet points, summary, and skills to match the exact keywords and requirements in the job description. HireFlow AI automates this using GPT-4o, so you get a perfectly tailored resume in about 60 seconds.",
  },
  {
    question: "How does the ATS score work?",
    answer:
      "ATS (Applicant Tracking System) score measures how well your resume matches a specific job description. Our AI analyzes the job posting, extracts key requirements, and compares them against your resume content. The score (0–100) tells you what percentage of important keywords and qualifications are present in your resume. We also show you exactly which keywords are matched and which are missing.",
  },
  {
    question: "Where do the job listings come from?",
    answer:
      "Our job search aggregates real, current listings from major job boards including Indeed, LinkedIn, Glassdoor, ZipRecruiter, and more. All jobs are from verified employers and are updated multiple times per day. We don't create or fabricate any listings.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, absolutely. You can cancel your Pro subscription at any time from your billing page. You'll continue to have Pro access until the end of your current billing period. No cancellation fees, no questions asked.",
  },
  {
    question: "Is my resume data secure?",
    answer:
      "Yes. Your data is stored securely in our database with row-level security — meaning only you can access your own data. We use industry-standard encryption in transit (HTTPS/TLS) and at rest. We do not sell your personal data or share your resume content with third parties. AI processing is done via OpenAI's API with data processing agreements in place.",
  },
  {
    question: "Do I need to create a resume from scratch?",
    answer:
      "No! You can upload an existing resume (PDF), import your profile from LinkedIn, or build one from scratch using our guided resume builder with 3 professional templates. Most users upload their existing resume and then use our AI to tailor it for specific jobs.",
  },
  {
    question: "How is this different from using ChatGPT directly?",
    answer:
      "HireFlow is purpose-built for job applications. Unlike ChatGPT, we provide structured ATS scoring, keyword-by-keyword analysis, professional resume templates, PDF/DOCX export, job search integration, and application tracking — all in one workflow. You paste a job description and get a formatted, export-ready tailored resume, not just raw text.",
  },
  {
    question: "What does the free plan include?",
    answer:
      "The free plan includes 1 resume, all 3 templates, 1 AI tailoring per month, 5 saved jobs, 10 tracked applications, and text export. It's enough to try the product and see the value of AI-powered resume tailoring. Upgrade to Pro for unlimited tailoring and premium exports.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            Frequently asked questions
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
              >
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-zinc-400 shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
