"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderGit2, Plus, Trash2, X } from "lucide-react";
import type { ResumeData, ResumeProject } from "@/lib/resume-types";

interface ProjectsSectionProps {
  resume: ResumeData;
  updateField: <K extends keyof ResumeData>(field: K, value: ResumeData[K]) => void;
}

export default function ProjectsSection({ resume, updateField }: ProjectsSectionProps) {
  const [newTech, setNewTech] = useState<Record<string, string>>({});

  function addProject() {
    const newProj: ResumeProject = {
      id: `proj-${Date.now()}`,
      name: "",
      description: "",
      url: "",
      technologies: [],
    };
    updateField("projects", [...resume.projects, newProj]);
  }

  function removeProject(id: string) {
    updateField("projects", resume.projects.filter((p) => p.id !== id));
  }

  function updateProject(id: string, field: keyof ResumeProject, value: unknown) {
    const updated = resume.projects.map((p) =>
      p.id === id ? { ...p, [field]: value } : p
    );
    updateField("projects", updated);
  }

  function addTechnology(projectId: string) {
    const tech = newTech[projectId]?.trim();
    if (!tech) return;
    const project = resume.projects.find((p) => p.id === projectId);
    if (!project) return;
    updateProject(projectId, "technologies", [...project.technologies, tech]);
    setNewTech((prev) => ({ ...prev, [projectId]: "" }));
  }

  function removeTechnology(projectId: string, techIndex: number) {
    const project = resume.projects.find((p) => p.id === projectId);
    if (!project) return;
    const techs = project.technologies.filter((_, i) => i !== techIndex);
    updateProject(projectId, "technologies", techs);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <FolderGit2 className="h-4 w-4" />
            Projects
          </CardTitle>
          <Button variant="outline" size="sm" onClick={addProject}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {resume.projects.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <FolderGit2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No projects added yet.</p>
          </div>
        ) : (
          resume.projects.map((project) => (
            <div key={project.id} className="rounded-lg border p-3 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="grid gap-3 sm:grid-cols-2 flex-1">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Project Name</Label>
                    <Input
                      value={project.name}
                      onChange={(e) => updateProject(project.id, "name", e.target.value)}
                      placeholder="My Awesome Project"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Project URL</Label>
                    <Input
                      value={project.url}
                      onChange={(e) => updateProject(project.id, "url", e.target.value)}
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeProject(project.id)}
                  className="p-1.5 rounded hover:bg-destructive/10 shrink-0 mt-5"
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </button>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Description</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, "description", e.target.value)}
                  placeholder="Describe the project, your role, and key outcomes..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Technologies</Label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {project.technologies.map((tech, i) => (
                    <Badge key={i} variant="secondary" className="gap-1">
                      {tech}
                      <button onClick={() => removeTechnology(project.id, i)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTech[project.id] || ""}
                    onChange={(e) =>
                      setNewTech((prev) => ({ ...prev, [project.id]: e.target.value }))
                    }
                    placeholder="Add technology..."
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTechnology(project.id);
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addTechnology(project.id)}
                    disabled={!newTech[project.id]?.trim()}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
