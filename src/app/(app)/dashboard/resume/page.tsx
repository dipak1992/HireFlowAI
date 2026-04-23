import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function ResumePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Resume Builder</h2>
        <p className="text-muted-foreground mt-1">
          Generate and manage ATS-optimized resumes powered by AI.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Resumes</CardTitle>
          <CardDescription>
            Create and manage multiple resume versions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">No resumes yet</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              Build your first AI-powered resume from your profile data.
              Coming soon in Phase 2.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
