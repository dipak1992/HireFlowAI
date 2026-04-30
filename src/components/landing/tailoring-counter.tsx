// src/components/landing/tailoring-counter.tsx
"use client";

import { useEffect, useState } from "react";
import { getTailoringCountAction } from "@/lib/job-actions";
import { FileText } from "lucide-react";

export function TailoringCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    getTailoringCountAction().then(setCount);
  }, []);

  // Show nothing while loading or if count is 0
  if (count === null || count === 0) {
    return null;
  }

  const displayCount = count;

  return (
    <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center justify-center gap-1.5">
      <FileText className="h-4 w-4 text-blue-500" />
      <span>
        <span className="font-semibold text-zinc-700 dark:text-zinc-300">
          {displayCount.toLocaleString()}
        </span>{" "}
        resumes tailored{" "}
        {displayCount > 100
          ? "this month"
          : displayCount > 10
          ? "this week"
          : "so far"}
      </span>
    </p>
  );
}
