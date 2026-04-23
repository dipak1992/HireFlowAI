"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GraduationCap,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { ResumeData, ResumeEducation } from "@/lib/resume-types";

interface EducationSectionProps {
  resume: ResumeData;
  updateField: <K extends keyof ResumeData>(field: K, value: ResumeData[K]) => void;
}

export default function EducationSection({ resume, updateField }: EducationSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    resume.education[0]?.id || null
  );

  function addEducation() {
    const newEdu: ResumeEducation = {
      id: `edu-${Date.now()}`,
      school: "",
      degree: "",
      field_of_study: "",
      location: "",
      start_date: "",
      end_date: "",
      gpa: "",
      description: "",
    };
    const updated = [...resume.education, newEdu];
    updateField("education", updated);
    setExpandedId(newEdu.id);
  }

  function removeEducation(id: string) {
    const updated = resume.education.filter((e) => e.id !== id);
    updateField("education", updated);
    if (expandedId === id) {
      setExpandedId(updated[0]?.id || null);
    }
  }

  function updateEducation(id: string, field: keyof ResumeEducation, value: string) {
    const updated = resume.education.map((e) =>
      e.id === id ? { ...e, [field]: value } : e
    );
    updateField("education", updated);
  }

  function moveEducation(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= resume.education.length) return;
    const updated = [...resume.education];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updateField("education", updated);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Education
          </CardTitle>
          <Button variant="outline" size="sm" onClick={addEducation}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {resume.education.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <GraduationCap className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No education added yet.</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={addEducation}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Education
            </Button>
          </div>
        ) : (
          resume.education.map((edu, index) => (
            <div key={edu.id} className="rounded-lg border bg-card">
              <button
                onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
                className="flex items-center w-full p-3 text-left gap-2"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {edu.degree || "Degree"}{edu.field_of_study ? ` in ${edu.field_of_study}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {edu.school || "School"}{" "}
                    {edu.start_date && `• ${edu.start_date}`}
                    {edu.end_date && ` - ${edu.end_date}`}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {index > 0 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); moveEducation(index, "up"); }}
                      className="p-1 rounded hover:bg-muted"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {index < resume.education.length - 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); moveEducation(index, "down"); }}
                      className="p-1 rounded hover:bg-muted"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeEducation(edu.id); }}
                    className="p-1 rounded hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </button>
                </div>
              </button>

              {expandedId === edu.id && (
                <div className="px-3 pb-3 space-y-4 border-t pt-3">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>School / University</Label>
                      <Input
                        value={edu.school}
                        onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                        placeholder="MIT"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Degree</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                        placeholder="Bachelor of Science"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Field of Study</Label>
                      <Input
                        value={edu.field_of_study}
                        onChange={(e) => updateEducation(edu.id, "field_of_study", e.target.value)}
                        placeholder="Computer Science"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={edu.location}
                        onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                        placeholder="Cambridge, MA"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="space-y-2 flex-1">
                        <Label>Start Date</Label>
                        <Input
                          value={edu.start_date}
                          onChange={(e) => updateEducation(edu.id, "start_date", e.target.value)}
                          placeholder="Sep 2018"
                        />
                      </div>
                      <div className="space-y-2 flex-1">
                        <Label>End Date</Label>
                        <Input
                          value={edu.end_date}
                          onChange={(e) => updateEducation(edu.id, "end_date", e.target.value)}
                          placeholder="May 2022"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>GPA (optional)</Label>
                      <Input
                        value={edu.gpa}
                        onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                        placeholder="3.8 / 4.0"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Additional Details</Label>
                    <Textarea
                      value={edu.description}
                      onChange={(e) => updateEducation(edu.id, "description", e.target.value)}
                      placeholder="Honors, relevant coursework, activities..."
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
