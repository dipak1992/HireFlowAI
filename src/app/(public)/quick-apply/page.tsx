// src/app/(public)/quick-apply/page.tsx
// Quick Apply landing page — capture job URL + email, tailor resume, apply

import { Metadata } from "next";
import Link from "next/link";
import { QuickApplyForm } from "@/components/quick-apply/quick-apply-form";

export const metadata: Metadata = {
  title: "Quick Apply — HireFlow AI",
  description:
    "Paste a job URL, upload your resume, and let HireFlow AI tailor it in seconds. Apply smarter, not harder.",
  openGraph: {
    title: "Quick Apply — HireFlow AI",
    description:
      "AI-powered resume tailoring in seconds. Paste a job URL and get a tailored resume instantly.",
  },
};

export default function QuickApplyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg tracking-tight">
            HireFlow<span className="text-primary">AI</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/sign-in"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors"
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-4 pt-16 pb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full mb-6">
          ⚡ AI-powered in under 30 seconds
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Tailor your resume.
          <br />
          <span className="text-primary">Apply in seconds.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
          Paste a job posting URL, upload your resume, and our AI instantly
          tailors it to match the job — highlighting the right keywords and
          experience.
        </p>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground mb-12">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">3x</div>
            <div>more interviews</div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">30s</div>
            <div>average time</div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">50k+</div>
            <div>resumes tailored</div>
          </div>
        </div>
      </section>

      {/* Quick Apply Form */}
      <section className="max-w-2xl mx-auto px-4 pb-20">
        <div className="bg-card border rounded-2xl shadow-sm p-6 sm:p-8">
          <QuickApplyForm />
        </div>

        {/* Trust signals */}
        <div className="mt-6 text-center text-xs text-muted-foreground space-y-1">
          <p>🔒 Your resume is never stored without your permission</p>
          <p>
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign in for full features →
            </Link>
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t bg-muted/30 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">
            How Quick Apply works
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Paste the job URL",
                desc: "Copy the URL from any job board — LinkedIn, Indeed, Greenhouse, Lever, and more.",
              },
              {
                step: "2",
                title: "Upload your resume",
                desc: "Upload your existing resume as a PDF or Word doc. We parse it instantly.",
              },
              {
                step: "3",
                title: "Get your tailored resume",
                desc: "Our AI rewrites your resume to match the job description, boosting your ATS score.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center px-4">
        <h2 className="text-2xl font-bold mb-3">
          Want unlimited tailoring + job tracking?
        </h2>
        <p className="text-muted-foreground mb-6">
          Create a free account to save your resumes, track applications, and
          get AI interview prep.
        </p>
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Start free — no credit card required →
        </Link>
      </section>
    </div>
  );
}
