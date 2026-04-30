// src/app/(public)/page.tsx
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Target,
  Search,
  BarChart3,
  ClipboardList,
  MessageSquare,
  CheckCircle2,
  Zap,
  Shield,
} from "lucide-react";
import { TailoringCounter } from "@/components/landing/tailoring-counter";
import { BeforeAfterDemo } from "@/components/landing/before-after-demo";
import { PricingSection } from "@/components/landing/pricing-section";
import { FAQSection } from "@/components/landing/faq-section";

export const metadata = {
  title: "HireFlow AI — Tailor Your Resume to Any Job in 60 Seconds",
  description:
    "AI-powered resume tailoring that gets you more interviews. Paste a job description, get an ATS-optimized resume with keyword matching in 60 seconds. Free to start.",
  openGraph: {
    title: "HireFlow AI — Tailor Your Resume to Any Job in 60 Seconds",
    description:
      "AI-powered resume tailoring that gets you more interviews. ATS scoring, keyword optimization, and professional exports.",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      {/* ───── HERO ───── */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-white to-white dark:from-blue-950/20 dark:via-zinc-950 dark:to-zinc-950 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            <Zap className="h-3.5 w-3.5" />
            Powered by GPT-4o
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-zinc-900 dark:text-zinc-100 leading-tight tracking-tight">
            Tailor your resume to any job{" "}
            <span className="text-blue-600 dark:text-blue-400">
              in 60 seconds.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Stop sending the same generic resume to every job. HireFlow AI
            rewrites your resume to match each job description — with ATS
            scoring and keyword optimization.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base transition-colors shadow-lg shadow-blue-600/20"
            >
              Start Free — No Credit Card
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-base hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              See how it works
            </Link>
          </div>

          {/* Live counter */}
          <div className="pt-2">
            <TailoringCounter />
          </div>

          {/* Product Screenshot Placeholder */}
          <div className="mt-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl shadow-zinc-900/10 overflow-hidden">
            <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-2.5 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-700">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-xs text-zinc-400 mx-auto">
                app.hireflow.ai/dashboard/resume
              </span>
            </div>
            {/* Replace this with a real product screenshot */}
            <div className="aspect-[16/9] bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center p-8">
              <div className="text-center space-y-3 max-w-sm">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  ATS Score: 91/100
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Replace this placeholder with an actual product screenshot of
                  the tailoring results showing ATS score, keyword matches, and
                  the tailored resume preview.
                </p>
                <p className="text-xs text-zinc-400 italic">
                  Tip: Use a real screenshot from your app for maximum
                  conversion
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── FEATURE PILLS ───── */}
      <section className="py-6 px-4 border-y border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: Target, label: "ATS-optimized" },
              { icon: Zap, label: "GPT-4o powered" },
              { icon: FileText, label: "Export to PDF & DOCX" },
              { icon: Shield, label: "3 professional templates" },
              { icon: BarChart3, label: "Keyword analysis" },
              { icon: CheckCircle2, label: "Free to start" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium shadow-sm"
              >
                <Icon className="h-3.5 w-3.5 text-blue-500" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── THE PROBLEM ───── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
              You&apos;re sending the same resume to every job.
            </h2>
            <p className="text-xl text-zinc-500 dark:text-zinc-400">
              That&apos;s why you&apos;re not getting callbacks.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: "Generic Resume",
                description:
                  "Same bullet points, same summary, same skills section for every single application you send.",
                color: "text-zinc-400",
                bg: "bg-zinc-50 dark:bg-zinc-900",
              },
              {
                icon: BarChart3,
                title: "ATS Systems Filter You Out",
                description:
                  "Applicant Tracking Systems scan for exact keywords from the job posting. No keywords = automatic rejection.",
                color: "text-amber-500",
                bg: "bg-amber-50 dark:bg-amber-900/10",
              },
              {
                icon: Target,
                title: "Auto-Rejected",
                description:
                  "75% of resumes are rejected by ATS before a human ever sees them. Your resume never reaches the recruiter.",
                color: "text-red-500",
                bg: "bg-red-50 dark:bg-red-900/10",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`rounded-2xl border border-zinc-200 dark:border-zinc-800 ${item.bg} p-6 space-y-3`}
              >
                <item.icon className={`h-8 w-8 ${item.color}`} />
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section
        id="how-it-works"
        className="py-20 px-4 bg-zinc-50/50 dark:bg-zinc-900/50"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
              How HireFlow works
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">
              Three steps. Sixty seconds. A resume that actually gets you
              interviews.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: FileText,
                title: "Paste the job description",
                description:
                  "Copy the job posting text or paste the URL. Our AI reads the full job description and extracts every requirement.",
              },
              {
                step: "2",
                icon: Zap,
                title: "AI tailors your resume",
                description:
                  "GPT-4o rewrites your bullet points and summary to match the job's exact keywords. See your ATS score jump instantly.",
              },
              {
                step: "3",
                icon: Target,
                title: "Download and apply",
                description:
                  "Export your tailored resume as a professional PDF or DOCX. Track your application in the built-in tracker.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-4">
                <div className="relative inline-flex">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
            >
              Try it now — it&apos;s free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ───── FEATURES GRID ───── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
              Everything you need to land your next role
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Target,
                title: "AI Resume Tailoring",
                description:
                  "AI rewrites your bullets and summary for each specific job. Automatic keyword optimization.",
                color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600",
              },
              {
                icon: BarChart3,
                title: "ATS Compatibility Score",
                description:
                  "See your ATS score from 0–100 with detailed keyword analysis. Know exactly what to fix.",
                color: "bg-green-50 dark:bg-green-900/20 text-green-600",
              },
              {
                icon: Search,
                title: "Real Job Search",
                description:
                  "Search real listings from Indeed, LinkedIn, Glassdoor, ZipRecruiter, and more.",
                color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600",
              },
              {
                icon: FileText,
                title: "Resume Studio",
                description:
                  "3 professional templates. Build from scratch, upload, or import from LinkedIn. Export as PDF or DOCX.",
                color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600",
              },
              {
                icon: ClipboardList,
                title: "Application Tracker",
                description:
                  "Kanban board and table view. Track every application from saved to offer. Never lose track.",
                color: "bg-rose-50 dark:bg-rose-900/20 text-rose-600",
              },
              {
                icon: MessageSquare,
                title: "AI Interview Prep",
                description:
                  "Get tailored interview questions and STAR-format answers based on the specific job and your experience.",
                color: "bg-teal-50 dark:bg-teal-900/20 text-teal-600",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${feature.color}`}
                >
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── BEFORE / AFTER ───── */}
      <section className="py-20 px-4 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
              See the difference AI tailoring makes
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Same resume. Same job. Completely different results.
            </p>
          </div>

          <BeforeAfterDemo />

          <div className="text-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
            >
              Tailor your resume now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ───── PRICING ───── */}
      <PricingSection />

      {/* ───── FAQ ───── */}
      <FAQSection />

      {/* ───── FINAL CTA ───── */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 p-10 text-center space-y-5 shadow-2xl shadow-blue-600/20">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Stop getting ghosted by recruiters.
            </h2>
            <p className="text-blue-100 text-lg">
              Start sending tailored resumes that actually get you interviews.
              Join thousands of job seekers who&apos;ve already improved their
              chances.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white hover:bg-blue-50 text-blue-600 font-bold text-lg transition-colors shadow-lg"
            >
              Start Free — Takes 30 Seconds
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="text-blue-200 text-sm">
              No credit card required. Free forever on basic plan.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
