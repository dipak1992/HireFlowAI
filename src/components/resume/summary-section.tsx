"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlignLeft, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import type { ResumeData } from "@/lib/resume-types";

interface SummarySectionProps {
  resume: ResumeData;
  updateField: <K extends keyof ResumeData>(field: K, value: ResumeData[K]) => void;
}

export default function SummarySection({ resume, updateField }: SummarySectionProps) {
  const [isImproving, setIsImproving] = useState(false);

  async function handleAIImprove() {
    if (!resume.summary.trim()) return;
    setIsImproving(true);

    // Simulate AI improvement (in production, this would call an AI API)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const improved = enhanceSummary(resume.summary, resume.contact_name, resume.experience);
    updateField("summary", improved);
    setIsImproving(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <AlignLeft className="h-4 w-4" />
            Professional Summary
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAIImprove}
            disabled={isImproving || !resume.summary.trim()}
          >
            {isImproving ? (
              <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            )}
            AI Improve
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          value={resume.summary}
          onChange={(e) => updateField("summary", e.target.value)}
          placeholder="Write a compelling professional summary that highlights your key achievements, skills, and career objectives..."
          rows={6}
          className="resize-none"
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground">
            Tip: Keep your summary between 3-5 sentences for best results.
          </p>
          <p className="text-xs text-muted-foreground">
            {resume.summary.length} characters
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Simple AI-like enhancement (placeholder for real AI integration)
function enhanceSummary(
  summary: string,
  name: string,
  experience: ResumeData["experience"]
): string {
  const years = experience.length > 0 ? `${experience.length}+` : "";
  const hasYears = years ? `with ${years} years of experience` : "";

  // Simple enhancement patterns
  let enhanced = summary;

  // Add action-oriented language
  if (!enhanced.toLowerCase().includes("results-driven") && !enhanced.toLowerCase().includes("accomplished")) {
    enhanced = `Results-driven professional ${hasYears}. ${enhanced}`;
  }

  // Ensure it ends with a period
  if (!enhanced.endsWith(".")) {
    enhanced += ".";
  }

  // Capitalize first letter
  enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);

  return enhanced;
}
