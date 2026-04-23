"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, File, Loader2 } from "lucide-react";
import type { ResumeData } from "@/lib/resume-types";

interface ExportMenuProps {
  resume: ResumeData;
}

export default function ExportMenu({ resume }: ExportMenuProps) {
  const [isExporting, setIsExporting] = useState(false);

  async function handleExportPDF() {
    setIsExporting(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const element = document.getElementById("resume-preview");
      if (!element) {
        // If preview isn't visible, show alert
        alert("Please switch to Preview mode to export PDF.");
        setIsExporting(false);
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "in", "letter");
      const pdfWidth = 8.5;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // If content is taller than one page, add more pages
      if (pdfHeight > 11) {
        let remainingHeight = pdfHeight - 11;
        let currentPage = 1;
        while (remainingHeight > 0) {
          pdf.addPage();
          currentPage++;
          pdf.addImage(imgData, "PNG", 0, -(11 * (currentPage - 1)), pdfWidth, pdfHeight);
          remainingHeight -= 11;
        }
      }

      const fileName = `${resume.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("PDF export error:", error);
      alert("Failed to export PDF. Please try again.");
    }
    setIsExporting(false);
  }

  async function handleExportDOCX() {
    setIsExporting(true);
    try {
      const docx = await import("docx");
      const { saveAs } = await import("file-saver");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const children: any[] = [];

      // Name
      children.push(
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: resume.contact_name || "Your Name",
              bold: true,
              size: 32,
              font: "Arial",
            }),
          ],
          alignment: docx.AlignmentType.CENTER,
          spacing: { after: 100 },
        })
      );

      // Contact info
      const contactParts: string[] = [];
      if (resume.contact_email) contactParts.push(resume.contact_email);
      if (resume.contact_phone) contactParts.push(resume.contact_phone);
      if (resume.contact_location) contactParts.push(resume.contact_location);
      if (resume.contact_website) contactParts.push(resume.contact_website);
      if (resume.contact_linkedin) contactParts.push(resume.contact_linkedin);

      if (contactParts.length > 0) {
        children.push(
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: contactParts.join(" | "),
                size: 18,
                font: "Arial",
                color: "666666",
              }),
            ],
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 200 },
          })
        );
      }

      // Helper: section heading
      function addSectionHeading(title: string) {
        children.push(
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: title.toUpperCase(),
                bold: true,
                size: 22,
                font: "Arial",
              }),
            ],
            border: {
              bottom: { style: docx.BorderStyle.SINGLE, size: 1, color: "999999" },
            },
            spacing: { before: 300, after: 100 },
          })
        );
      }

      // Summary
      if (resume.summary) {
        addSectionHeading("Professional Summary");
        children.push(
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: resume.summary,
                size: 20,
                font: "Arial",
              }),
            ],
            spacing: { after: 100 },
          })
        );
      }

      // Experience
      if (resume.experience.length > 0) {
        addSectionHeading("Work Experience");
        for (const exp of resume.experience) {
          children.push(
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: exp.title,
                  bold: true,
                  size: 20,
                  font: "Arial",
                }),
                new docx.TextRun({
                  text: exp.company ? ` — ${exp.company}` : "",
                  size: 20,
                  font: "Arial",
                }),
                new docx.TextRun({
                  text: `  ${exp.start_date}${exp.end_date || exp.is_current ? ` – ${exp.is_current ? "Present" : exp.end_date}` : ""}`,
                  size: 18,
                  font: "Arial",
                  color: "666666",
                }),
              ],
              spacing: { before: 100 },
            })
          );
          for (const bullet of exp.bullets.filter(Boolean)) {
            children.push(
              new docx.Paragraph({
                children: [
                  new docx.TextRun({
                    text: bullet,
                    size: 20,
                    font: "Arial",
                  }),
                ],
                bullet: { level: 0 },
                spacing: { before: 40 },
              })
            );
          }
        }
      }

      // Education
      if (resume.education.length > 0) {
        addSectionHeading("Education");
        for (const edu of resume.education) {
          children.push(
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: `${edu.degree}${edu.field_of_study ? ` in ${edu.field_of_study}` : ""}`,
                  bold: true,
                  size: 20,
                  font: "Arial",
                }),
                new docx.TextRun({
                  text: ` — ${edu.school}${edu.location ? `, ${edu.location}` : ""}`,
                  size: 20,
                  font: "Arial",
                }),
                new docx.TextRun({
                  text: edu.end_date ? `  ${edu.start_date} – ${edu.end_date}` : "",
                  size: 18,
                  font: "Arial",
                  color: "666666",
                }),
              ],
              spacing: { before: 100 },
            })
          );
        }
      }

      // Skills
      if (resume.skills.length > 0) {
        addSectionHeading("Skills");
        const skillsByCategory = resume.skills.reduce<Record<string, string[]>>((acc, s) => {
          const cat = s.category || "General";
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(s.name);
          return acc;
        }, {});
        for (const [category, skills] of Object.entries(skillsByCategory)) {
          children.push(
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: `${category}: `,
                  bold: true,
                  size: 20,
                  font: "Arial",
                }),
                new docx.TextRun({
                  text: skills.join(", "),
                  size: 20,
                  font: "Arial",
                }),
              ],
              spacing: { before: 40 },
            })
          );
        }
      }

      // Certifications
      if (resume.certifications.length > 0) {
        addSectionHeading("Certifications");
        for (const cert of resume.certifications) {
          children.push(
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: cert.name,
                  bold: true,
                  size: 20,
                  font: "Arial",
                }),
                new docx.TextRun({
                  text: cert.issuer ? ` — ${cert.issuer}` : "",
                  size: 20,
                  font: "Arial",
                }),
                new docx.TextRun({
                  text: cert.date ? ` (${cert.date})` : "",
                  size: 18,
                  font: "Arial",
                  color: "666666",
                }),
              ],
              spacing: { before: 40 },
            })
          );
        }
      }

      // Projects
      if (resume.projects.length > 0) {
        addSectionHeading("Projects");
        for (const proj of resume.projects) {
          children.push(
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: proj.name,
                  bold: true,
                  size: 20,
                  font: "Arial",
                }),
                new docx.TextRun({
                  text: proj.technologies.length > 0 ? ` [${proj.technologies.join(", ")}]` : "",
                  size: 18,
                  font: "Arial",
                  color: "666666",
                }),
              ],
              spacing: { before: 100 },
            })
          );
          if (proj.description) {
            children.push(
              new docx.Paragraph({
                children: [
                  new docx.TextRun({
                    text: proj.description,
                    size: 20,
                    font: "Arial",
                  }),
                ],
                spacing: { before: 40 },
              })
            );
          }
        }
      }

      const doc = new docx.Document({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 720,
                  right: 720,
                  bottom: 720,
                  left: 720,
                },
              },
            },
            children,
          },
        ],
      });

      const blob = await docx.Packer.toBlob(doc);
      const fileName = `${resume.title.replace(/[^a-zA-Z0-9]/g, "_")}.docx`;
      saveAs(blob, fileName);
    } catch (error) {
      console.error("DOCX export error:", error);
      alert("Failed to export DOCX. Please try again.");
    }
    setIsExporting(false);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted text-sm font-medium h-7 gap-1 px-2.5 transition-colors"
        disabled={isExporting}
      >
        {isExporting ? (
          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
        ) : (
          <Download className="h-3.5 w-3.5 mr-1.5" />
        )}
        Export
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer">
          <FileText className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportDOCX} className="cursor-pointer">
          <File className="h-4 w-4 mr-2" />
          Export as DOCX
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
