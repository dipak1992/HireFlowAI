import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  FileText,
  TrendingUp,
  Target,
  ArrowUpRight,
  Clock,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const { data: preferences } = await supabase
    .from("preferences")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  const firstName = profile?.full_name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Welcome back, {firstName}! 👋
        </h2>
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of your job search progress.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Job Matches"
          value="0"
          description="New this week"
          icon={<Target className="h-4 w-4" />}
          trend="+0%"
        />
        <StatCard
          title="Applications"
          value="0"
          description="Total sent"
          icon={<Briefcase className="h-4 w-4" />}
          trend="+0%"
        />
        <StatCard
          title="Resume Score"
          value="--"
          description="ATS compatibility"
          icon={<FileText className="h-4 w-4" />}
          trend=""
        />
        <StatCard
          title="Profile Views"
          value="0"
          description="Last 30 days"
          icon={<TrendingUp className="h-4 w-4" />}
          trend="+0%"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription>Your latest job search activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">No activity yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Start by completing your profile and preferences.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
            <CardDescription>Get started with these steps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <QuickAction
                title="Complete your profile"
                description="Add your skills and experience"
                done={!!profile?.full_name && !!profile?.headline}
              />
              <QuickAction
                title="Set job preferences"
                description="Tell us what you're looking for"
                done={!!preferences?.goal}
              />
              <QuickAction
                title="Build your resume"
                description="Generate an ATS-optimized resume"
                done={false}
              />
              <QuickAction
                title="Browse job matches"
                description="See AI-curated opportunities"
                done={false}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
  trend,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="text-muted-foreground">{icon}</div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-2xl font-bold">{value}</p>
          {trend && (
            <Badge variant="secondary" className="text-xs font-normal">
              <ArrowUpRight className="h-3 w-3 mr-0.5" />
              {trend}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

function QuickAction({
  title,
  description,
  done,
}: {
  title: string;
  description: string;
  done: boolean;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
          done
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {done ? "✓" : "→"}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium ${
            done ? "line-through text-muted-foreground" : ""
          }`}
        >
          {title}
        </p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
