// src/app/api/inngest/route.ts
// Inngest serve handler for background job processing

import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import {
  tailorResume,
  generateInterviewPrepJob,
  winBackSequence,
  cleanupCacheJob,
} from "@/lib/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [tailorResume, generateInterviewPrepJob, winBackSequence, cleanupCacheJob],
});
