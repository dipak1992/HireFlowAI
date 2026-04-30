"use client";

// src/components/quick-apply/quick-apply-form.tsx
// Quick Apply form — job URL + resume upload → AI tailoring

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Step = "input" | "processing" | "done" | "error";

export function QuickApplyForm() {
  const [step, setStep] = useState<Step>("input");
  const [jobUrl, setJobUrl] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!jobUrl || !file) return;

    setStep("processing");
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append("jobUrl", jobUrl);
      formData.append("resume", file);
      if (email) formData.append("email", email);

      const res = await fetch("/api/quick-apply", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      const data = await res.json();
      setResult(data.summary ?? "Your tailored resume is ready!");
      setStep("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unexpected error");
      setStep("error");
    }
  }

  if (step === "processing") {
    return (
      <div className="text-center py-10 space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-medium">Analyzing job posting…</p>
        <p className="text-sm text-muted-foreground">
          Our AI is tailoring your resume to match the job description.
          <br />
          This usually takes 15–30 seconds.
        </p>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="text-center py-8 space-y-6">
        <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto text-2xl">
          ✓
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">Your resume is tailored!</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            {result}
          </p>
        </div>
        <div className="bg-muted/50 rounded-lg p-4 text-sm text-left space-y-2">
          <p className="font-medium">What's next?</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>✅ Check your email for the tailored resume PDF</li>
            <li>✅ Sign up free to save resumes & track applications</li>
            <li>✅ Get AI interview prep for this role</li>
          </ul>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/sign-up"
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
          >
            Create free account →
          </a>
          <button
            onClick={() => {
              setStep("input");
              setJobUrl("");
              setEmail("");
              setFile(null);
              setResult(null);
            }}
            className="border px-5 py-2.5 rounded-lg font-medium hover:bg-muted transition-colors text-sm"
          >
            Tailor another resume
          </button>
        </div>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-2xl">
          ✕
        </div>
        <h3 className="text-xl font-bold">Something went wrong</h3>
        <p className="text-sm text-muted-foreground">{errorMsg}</p>
        <Button onClick={() => setStep("input")} variant="outline">
          Try again
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="jobUrl">Job posting URL *</Label>
        <Input
          id="jobUrl"
          type="url"
          placeholder="https://linkedin.com/jobs/view/..."
          value={jobUrl}
          onChange={(e) => setJobUrl(e.target.value)}
          required
          className="h-11"
        />
        <p className="text-xs text-muted-foreground">
          LinkedIn, Indeed, Greenhouse, Lever, Workday, and more
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="resume">Your resume *</Label>
        <div
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          {file ? (
            <div className="space-y-1">
              <p className="font-medium text-sm">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(0)} KB — click to change
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Drop your resume here or click to upload
              </p>
              <p className="text-xs text-muted-foreground">PDF or DOCX, max 5MB</p>
            </div>
          )}
          <input
            ref={fileRef}
            id="resume"
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">
          Email{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11"
        />
        <p className="text-xs text-muted-foreground">
          We'll send you the tailored resume PDF
        </p>
      </div>

      <Button
        type="submit"
        className="w-full h-11 text-base font-medium"
        disabled={!jobUrl || !file}
      >
        ⚡ Tailor my resume now
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Free · No account required · Results in ~30 seconds
      </p>
    </form>
  );
}
