import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Career Insights</h2>
        <p className="text-muted-foreground mt-1">
          Personalized career recommendations and market insights.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Insights</CardTitle>
          <CardDescription>
            AI-powered career recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Insights coming soon</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              We&apos;re analyzing market trends and your profile to generate
              personalized career insights. Coming soon in Phase 2.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
