import type { ResumeData } from "@/lib/resume-types";

interface ATSTemplateProps {
  resume: ResumeData;
}

/**
 * ATS Classic Template - Clean, single-column, no graphics.
 * Optimized for Applicant Tracking Systems with standard headings.
 */
export default function ATSTemplate({ resume }: ATSTemplateProps) {
  return (
    <div className="p-8 font-['Times_New_Roman',_serif] text-[11pt] leading-relaxed">
      {/* Header */}
      <div className="text-center border-b-2 border-black pb-3 mb-4">
        <h1 className="text-2xl font-bold uppercase tracking-wide">
          {resume.contact_name || "Your Name"}
        </h1>
        <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-0.5 mt-1 text-[10pt]">
          {resume.contact_email && <span>{resume.contact_email}</span>}
          {resume.contact_phone && <span>| {resume.contact_phone}</span>}
          {resume.contact_location && <span>| {resume.contact_location}</span>}
          {resume.contact_website && <span>| {resume.contact_website}</span>}
          {resume.contact_linkedin && <span>| {resume.contact_linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <section className="mb-4">
          <h2 className="text-[12pt] font-bold uppercase border-b border-gray-400 pb-0.5 mb-2">
            Professional Summary
          </h2>
          <p className="text-[10.5pt]">{resume.summary}</p>
        </section>
      )}

      {/* Experience */}
      {resume.experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[12pt] font-bold uppercase border-b border-gray-400 pb-0.5 mb-2">
            Work Experience
          </h2>
          {resume.experience.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold">{exp.title}</span>
                  {exp.company && <span> — {exp.company}</span>}
                </div>
                <span className="text-[10pt] text-gray-600 shrink-0 ml-2">
                  {exp.start_date}
                  {(exp.end_date || exp.is_current) &&
                    ` – ${exp.is_current ? "Present" : exp.end_date}`}
                </span>
              </div>
              {exp.location && (
                <p className="text-[10pt] text-gray-600 italic">{exp.location}</p>
              )}
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul className="list-disc ml-5 mt-1 text-[10.5pt] space-y-0.5">
                  {exp.bullets.filter(Boolean).map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[12pt] font-bold uppercase border-b border-gray-400 pb-0.5 mb-2">
            Education
          </h2>
          {resume.education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold">{edu.degree}</span>
                  {edu.field_of_study && <span> in {edu.field_of_study}</span>}
                </div>
                <span className="text-[10pt] text-gray-600 shrink-0 ml-2">
                  {edu.start_date}
                  {edu.end_date && ` – ${edu.end_date}`}
                </span>
              </div>
              <p className="text-[10.5pt]">
                {edu.school}
                {edu.location && `, ${edu.location}`}
                {edu.gpa && ` — GPA: ${edu.gpa}`}
              </p>
              {edu.description && (
                <p className="text-[10pt] text-gray-600 mt-0.5">{edu.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[12pt] font-bold uppercase border-b border-gray-400 pb-0.5 mb-2">
            Skills
          </h2>
          <div className="text-[10.5pt]">
            {Object.entries(
              resume.skills.reduce<Record<string, string[]>>((acc, s) => {
                const cat = s.category || "General";
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(s.name);
                return acc;
              }, {})
            ).map(([category, skills]) => (
              <p key={category} className="mb-0.5">
                <span className="font-bold">{category}:</span>{" "}
                {skills.join(", ")}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[12pt] font-bold uppercase border-b border-gray-400 pb-0.5 mb-2">
            Certifications
          </h2>
          {resume.certifications.map((cert) => (
            <p key={cert.id} className="text-[10.5pt] mb-0.5">
              <span className="font-bold">{cert.name}</span>
              {cert.issuer && ` — ${cert.issuer}`}
              {cert.date && ` (${cert.date})`}
            </p>
          ))}
        </section>
      )}

      {/* Projects */}
      {resume.projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[12pt] font-bold uppercase border-b border-gray-400 pb-0.5 mb-2">
            Projects
          </h2>
          {resume.projects.map((proj) => (
            <div key={proj.id} className="mb-2">
              <div className="flex items-baseline gap-2">
                <span className="font-bold">{proj.name}</span>
                {proj.url && (
                  <span className="text-[9pt] text-gray-500">{proj.url}</span>
                )}
              </div>
              {proj.description && (
                <p className="text-[10.5pt]">{proj.description}</p>
              )}
              {proj.technologies.length > 0 && (
                <p className="text-[10pt] text-gray-600 mt-0.5">
                  Technologies: {proj.technologies.join(", ")}
                </p>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
