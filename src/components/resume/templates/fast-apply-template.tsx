import type { ResumeData } from "@/lib/resume-types";

interface FastApplyTemplateProps {
  resume: ResumeData;
}

/**
 * Fast Apply Template - Minimal, compact, one-page optimized.
 * Designed for quick job applications with essential info only.
 */
export default function FastApplyTemplate({ resume }: FastApplyTemplateProps) {
  return (
    <div className="p-6 font-['Arial',_sans-serif] text-[10pt] leading-snug">
      {/* Header - compact */}
      <div className="mb-3">
        <h1 className="text-xl font-bold text-gray-900">
          {resume.contact_name || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-x-2 gap-y-0 text-[9pt] text-gray-600 mt-0.5">
          {resume.contact_email && <span>{resume.contact_email}</span>}
          {resume.contact_phone && (
            <>
              <span className="text-gray-300">•</span>
              <span>{resume.contact_phone}</span>
            </>
          )}
          {resume.contact_location && (
            <>
              <span className="text-gray-300">•</span>
              <span>{resume.contact_location}</span>
            </>
          )}
          {resume.contact_linkedin && (
            <>
              <span className="text-gray-300">•</span>
              <span>{resume.contact_linkedin}</span>
            </>
          )}
          {resume.contact_website && (
            <>
              <span className="text-gray-300">•</span>
              <span>{resume.contact_website}</span>
            </>
          )}
        </div>
      </div>

      <hr className="border-gray-200 mb-3" />

      {/* Summary - brief */}
      {resume.summary && (
        <p className="text-[9.5pt] text-gray-700 mb-3">
          {resume.summary.length > 300
            ? resume.summary.slice(0, 300) + "..."
            : resume.summary}
        </p>
      )}

      {/* Skills - inline */}
      {resume.skills.length > 0 && (
        <div className="mb-3">
          <h2 className="text-[9pt] font-bold uppercase text-gray-500 tracking-wider mb-1">
            Skills
          </h2>
          <p className="text-[9.5pt] text-gray-700">
            {resume.skills.map((s) => s.name).join(" · ")}
          </p>
        </div>
      )}

      {/* Experience - compact */}
      {resume.experience.length > 0 && (
        <div className="mb-3">
          <h2 className="text-[9pt] font-bold uppercase text-gray-500 tracking-wider mb-1.5">
            Experience
          </h2>
          {resume.experience.map((exp) => (
            <div key={exp.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[10pt]">
                  {exp.title}
                  {exp.company && (
                    <span className="font-normal text-gray-600"> at {exp.company}</span>
                  )}
                </span>
                <span className="text-[8.5pt] text-gray-400 shrink-0 ml-2">
                  {exp.start_date}
                  {(exp.end_date || exp.is_current) &&
                    `–${exp.is_current ? "Present" : exp.end_date}`}
                </span>
              </div>
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul className="list-disc ml-4 text-[9.5pt] text-gray-600 mt-0.5">
                  {exp.bullets
                    .filter(Boolean)
                    .slice(0, 3) // Limit to 3 bullets for compactness
                    .map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education - compact */}
      {resume.education.length > 0 && (
        <div className="mb-3">
          <h2 className="text-[9pt] font-bold uppercase text-gray-500 tracking-wider mb-1.5">
            Education
          </h2>
          {resume.education.map((edu) => (
            <div key={edu.id} className="flex justify-between items-baseline mb-1">
              <span className="text-[10pt]">
                <span className="font-semibold">{edu.degree}</span>
                {edu.field_of_study && ` in ${edu.field_of_study}`}
                {edu.school && (
                  <span className="text-gray-600"> — {edu.school}</span>
                )}
                {edu.gpa && (
                  <span className="text-gray-500 text-[9pt]"> (GPA: {edu.gpa})</span>
                )}
              </span>
              <span className="text-[8.5pt] text-gray-400 shrink-0 ml-2">
                {edu.end_date || edu.start_date}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Certifications - inline */}
      {resume.certifications.length > 0 && (
        <div className="mb-3">
          <h2 className="text-[9pt] font-bold uppercase text-gray-500 tracking-wider mb-1">
            Certifications
          </h2>
          <p className="text-[9.5pt] text-gray-700">
            {resume.certifications
              .map((c) => `${c.name}${c.issuer ? ` (${c.issuer})` : ""}`)
              .join(" · ")}
          </p>
        </div>
      )}

      {/* Projects - compact */}
      {resume.projects.length > 0 && (
        <div className="mb-3">
          <h2 className="text-[9pt] font-bold uppercase text-gray-500 tracking-wider mb-1.5">
            Projects
          </h2>
          {resume.projects.map((proj) => (
            <div key={proj.id} className="mb-1">
              <span className="font-semibold text-[10pt]">{proj.name}</span>
              {proj.technologies.length > 0 && (
                <span className="text-[8.5pt] text-gray-400 ml-1">
                  [{proj.technologies.join(", ")}]
                </span>
              )}
              {proj.description && (
                <span className="text-[9.5pt] text-gray-600 ml-1">
                  — {proj.description.length > 100
                    ? proj.description.slice(0, 100) + "..."
                    : proj.description}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
