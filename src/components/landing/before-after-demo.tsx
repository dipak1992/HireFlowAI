// src/components/landing/before-after-demo.tsx
"use client";

import { CheckCircle2, XCircle } from "lucide-react";

export function BeforeAfterDemo() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* BEFORE */}
      <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-widest text-red-500 uppercase">
            Before
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-semibold">
            <XCircle className="h-3.5 w-3.5" />
            ATS Score: 34/100
          </span>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
              Summary
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              &ldquo;Experienced software developer with a passion for building
              applications. Worked on various projects using different
              technologies. Team player with good communication skills.&rdquo;
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
              Experience Bullet
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              &ldquo;Managed team of developers and worked on various projects
              to improve the system.&rdquo;
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
              Missing Keywords
            </p>
            <div className="flex flex-wrap gap-1">
              {[
                "React",
                "Node.js",
                "TypeScript",
                "CI/CD",
                "microservices",
                "REST APIs",
              ].map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs"
                >
                  <XCircle className="h-3 w-3" />
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AFTER */}
      <div className="rounded-2xl border border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-900/10 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-widest text-green-600 uppercase">
            After
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5" />
            ATS Score: 91/100
          </span>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
              Tailored Summary
            </p>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              &ldquo;Full-stack software engineer with 5+ years of experience
              building scalable{" "}
              <mark className="bg-green-200 dark:bg-green-800/50 text-green-800 dark:text-green-300 rounded px-0.5">
                React
              </mark>{" "}
              and{" "}
              <mark className="bg-green-200 dark:bg-green-800/50 text-green-800 dark:text-green-300 rounded px-0.5">
                Node.js
              </mark>{" "}
              applications. Proficient in{" "}
              <mark className="bg-green-200 dark:bg-green-800/50 text-green-800 dark:text-green-300 rounded px-0.5">
                TypeScript
              </mark>
              ,{" "}
              <mark className="bg-green-200 dark:bg-green-800/50 text-green-800 dark:text-green-300 rounded px-0.5">
                REST APIs
              </mark>
              , and{" "}
              <mark className="bg-green-200 dark:bg-green-800/50 text-green-800 dark:text-green-300 rounded px-0.5">
                CI/CD
              </mark>{" "}
              pipelines.&rdquo;
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
              Tailored Bullet
            </p>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              &ldquo;Led cross-functional team of 8 engineers delivering{" "}
              <mark className="bg-green-200 dark:bg-green-800/50 text-green-800 dark:text-green-300 rounded px-0.5">
                React/Node.js microservices
              </mark>{" "}
              that reduced API response time by 40% via{" "}
              <mark className="bg-green-200 dark:bg-green-800/50 text-green-800 dark:text-green-300 rounded px-0.5">
                CI/CD
              </mark>{" "}
              automation.&rdquo;
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
              Matched Keywords
            </p>
            <div className="flex flex-wrap gap-1">
              {[
                "React",
                "Node.js",
                "TypeScript",
                "CI/CD",
                "microservices",
                "REST APIs",
              ].map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
