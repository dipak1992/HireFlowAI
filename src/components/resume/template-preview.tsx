"use client";

import type { ResumeData } from "@/lib/resume-types";
import ATSTemplate from "./templates/ats-template";
import ProfessionalTemplate from "./templates/professional-template";
import FastApplyTemplate from "./templates/fast-apply-template";

interface TemplatePreviewProps {
  resume: ResumeData;
}

export default function TemplatePreview({ resume }: TemplatePreviewProps) {
  return (
    <div id="resume-preview" className="bg-white text-black shadow-lg rounded-lg overflow-hidden" style={{ width: "8.5in", minHeight: "11in" }}>
      {resume.template === "ats" && <ATSTemplate resume={resume} />}
      {resume.template === "professional" && <ProfessionalTemplate resume={resume} />}
      {resume.template === "fast_apply" && <FastApplyTemplate resume={resume} />}
    </div>
  );
}
