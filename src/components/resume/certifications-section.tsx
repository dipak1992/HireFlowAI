"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Plus, Trash2, ExternalLink } from "lucide-react";
import type { ResumeData, ResumeCertification } from "@/lib/resume-types";

interface CertificationsSectionProps {
  resume: ResumeData;
  updateField: <K extends keyof ResumeData>(field: K, value: ResumeData[K]) => void;
}

export default function CertificationsSection({ resume, updateField }: CertificationsSectionProps) {
  function addCertification() {
    const newCert: ResumeCertification = {
      id: `cert-${Date.now()}`,
      name: "",
      issuer: "",
      date: "",
      url: "",
    };
    updateField("certifications", [...resume.certifications, newCert]);
  }

  function removeCertification(id: string) {
    updateField("certifications", resume.certifications.filter((c) => c.id !== id));
  }

  function updateCertification(id: string, field: keyof ResumeCertification, value: string) {
    const updated = resume.certifications.map((c) =>
      c.id === id ? { ...c, [field]: value } : c
    );
    updateField("certifications", updated);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="h-4 w-4" />
            Certifications
          </CardTitle>
          <Button variant="outline" size="sm" onClick={addCertification}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {resume.certifications.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Award className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No certifications added yet.</p>
          </div>
        ) : (
          resume.certifications.map((cert) => (
            <div key={cert.id} className="rounded-lg border p-3 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="grid gap-3 sm:grid-cols-2 flex-1">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Certification Name</Label>
                    <Input
                      value={cert.name}
                      onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                      placeholder="AWS Solutions Architect"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Issuing Organization</Label>
                    <Input
                      value={cert.issuer}
                      onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                      placeholder="Amazon Web Services"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Date</Label>
                    <Input
                      value={cert.date}
                      onChange={(e) => updateCertification(cert.id, "date", e.target.value)}
                      placeholder="Mar 2023"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Credential URL</Label>
                    <Input
                      value={cert.url}
                      onChange={(e) => updateCertification(cert.id, "url", e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeCertification(cert.id)}
                  className="p-1.5 rounded hover:bg-destructive/10 shrink-0 mt-5"
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
