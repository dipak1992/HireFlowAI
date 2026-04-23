import type { ResumeData } from "@/lib/resume-types";

interface ProfessionalTemplateProps {
  resume: ResumeData;
}

/**
 * Professional Template - Modern two-column layout with accent colors.
 * Left sidebar for contact/skills, right main area for experience/education.
 */
export default function ProfessionalTemplate({ resume }: ProfessionalTemplateProps) {
  const skillsByCategory = resume.skills.reduce<Record<string, string[]>>((acc, s) => {
    const cat = s.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s.name);
    return acc;
  }, {});

  return (
    <div className="flex min-h-[11in] font-['Helvetica',_'Arial',_sans-serif] text-[10.5pt] leading-relaxed">
      {/* Left sidebar */}
      <div className="w-[2.5in] bg-slate-800 text-white p-6 shrink-0">
        {/* Name */}
        <div className="mb-6">
          <h1 className="text-xl font-bold leading-tight">
            {resume.contact_name || "Your Name"}
          </h1>
          {resume.summary && (
            <p className="text-[9pt] text-slate-300 mt-2 leading-snug">
              {resume.summary.length > 200
                ? resume.summary.slice(0, 200) + "..."
                : resume.summary}
            </p>
          )}
        </div>

        {/* Contact */}
        <div className="mb-6">
          <h2 className="text-[9pt] font-bold uppercase tracking-widest text-slate-400 mb-2">
            Contact
          </h2>
          <div className="space-y-1.5 text-[9.5pt]">
            {resume.contact_email && (
              <div className="flex items-start gap-2">
                <span className="text-slate-400 shrink-0">✉</span>
                <span className="break-all">{resume.contact_email}</span>
              </div>
            )}
            {resume.contact_phone && (
              <div className="flex items-start gap-2">
                <span className="text-slate-400 shrink-0">☎</span>
                <span>{resume.contact_phone}</span>
              </div>
            )}
            {resume.contact_location && (
              <div className="flex items-start gap-2">
                <span className="text-slate-400 shrink-0">📍</span>
                <span>{resume.contact_location}</span>
              </div>
            )}
            {resume.contact_website && (
              <div className="flex items-start gap-2">
                <span className="text-slate-400 shrink-0">🌐</span>
                <span className="break-all">{resume.contact_website}</span>
              </div>
            )}
            {resume.contact_linkedin && (
              <div className="flex items-start gap-2">
                <span className="text-slate-400 shrink-0">in</span>
                <span className="break-all">{resume.contact_linkedin}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {resume.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[9pt] font-bold uppercase tracking-widest text-slate-400 mb-2">
              Skills
            </h2>
            {Object.entries(skillsByCategory).map(([category, skills]) => (
              <div key={category} className="mb-2">
                <p className="text-[8.5pt] font-semibold text-slate-300 mb-0.5">
                  {category}
                </p>
                <div className="flex flex-wrap gap-1">
                  {skills.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-block bg-slate-700 text-slate-200 text-[8pt] px-1.5 py-0.5 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {resume.certifications.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[9pt] font-bold uppercase tracking-widest text-slate-400 mb-2">
              Certifications
            </h2>
            {resume.certifications.map((cert) => (
              <div key={cert.id} className="mb-1.5">
                <p className="text-[9.5pt] font-medium">{cert.name}</p>
                <p className="text-[8.5pt] text-slate-400">
                  {cert.issuer}
                  {cert.date && ` • ${cert.date}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right main content */}
      <div className="flex-1 p-6">
        {/* Summary (full version on right) */}
        {resume.summary && (
          <section className="mb-5">
            <h2 className="text-[11pt] font-bold uppercase text-slate-800 border-b-2 border-slate-300 pb-1 mb-2">
              About Me
            </h2>
            <p className="text-[10pt] text-gray-700">{resume.summary}</p>
          </section>
        )}

        {/* Experience */}
        {resume.experience.length > 0 && (
          <section className="mb-5">
            <h2 className="text-[11pt] font-bold uppercase text-slate-800 border-b-2 border-slate-300 pb-1 mb-2">
              Experience
            </h2>
            {resume.experience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-[10.5pt]">{exp.title}</h3>
                  <span className="text-[9pt] text-gray-500 shrink-0 ml-2">
                    {exp.start_date}
                    {(exp.end_date || exp.is_current) &&
                      ` – ${exp.is_current ? "Present" : exp.end_date}`}
                  </span>
                </div>
                <p className="text-[10pt] text-slate-600 font-medium">
                  {exp.company}
                  {exp.location && ` • ${exp.location}`}
                </p>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="list-disc ml-4 mt-1 text-[10pt] text-gray-700 space-y-0.5">
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
          <section className="mb-5">
            <h2 className="text-[11pt] font-bold uppercase text-slate-800 border-b-2 border-slate-300 pb-1 mb-2">
              Education
            </h2>
            {resume.education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-[10.5pt]">
                    {edu.degree}
                    {edu.field_of_study && ` in ${edu.field_of_study}`}
                  </h3>
                  <span className="text-[9pt] text-gray-500 shrink-0 ml-2">
                    {edu.start_date}
                    {edu.end_date && ` – ${edu.end_date}`}
                  </span>
                </div>
                <p className="text-[10pt] text-slate-600">
                  {edu.school}
                  {edu.location && `, ${edu.location}`}
                  {edu.gpa && ` — GPA: ${edu.gpa}`}
                </p>
                {edu.description && (
                  <p className="text-[9.5pt] text-gray-600 mt-0.5">{edu.description}</p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {resume.projects.length > 0 && (
          <section className="mb-5">
            <h2 className="text-[11pt] font-bold uppercase text-slate-800 border-b-2 border-slate-300 pb-1 mb-2">
              Projects
            </h2>
            {resume.projects.map((proj) => (
              <div key={proj.id} className="mb-2">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-bold text-[10.5pt]">{proj.name}</h3>
                  {proj.url && (
                    <span className="text-[8.5pt] text-gray-400">{proj.url}</span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-[10pt] text-gray-700">{proj.description}</p>
                )}
                {proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {proj.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="inline-block bg-slate-100 text-slate-600 text-[8pt] px-1.5 py-0.5 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
