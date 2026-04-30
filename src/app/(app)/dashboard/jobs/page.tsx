// src/app/(app)/dashboard/jobs/page.tsx
import { JobSearch } from "@/components/jobs/job-search";

export const metadata = {
  title: "Job Search | HireFlow AI",
  description:
    "Search real jobs from Indeed, LinkedIn, Glassdoor, and more.",
};

export default function JobsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Find Jobs
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Search real job listings from Indeed, LinkedIn, Glassdoor,
          ZipRecruiter, and more.
        </p>
      </div>

      <JobSearch />
    </div>
  );
}
