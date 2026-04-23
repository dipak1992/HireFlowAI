import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Briefcase } from "lucide-react";

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Job Matches</h2>
        <p className="text-muted-foreground mt-1">
          AI-curated job opportunities based on your profile and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Matches</CardTitle>
          <CardDescription>
            Jobs that match your skills and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">No matches yet</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              Complete your profile and set your job preferences to start
              receiving AI-powered job matches.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
