import { TrendingUp, BarChart2, Target, Lightbulb, Sparkles, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { PageHeader, Section, EmptyState, FeatureCard } from "@/components/ui/primitives";

export default function InsightsPage() {
  const comingSoonFeatures = [
    {
      icon: <BarChart2 className="h-5 w-5" />,
      title: "Application Funnel",
      description: "Track your conversion rate from application to offer across all stages.",
      color: "blue" as const,
    },
    {
      icon: <Target className="h-5 w-5" />,
      title: "Job Match Score Trends",
      description: "See how your profile match score improves over time as you optimize.",
      color: "violet" as const,
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Salary Benchmarks",
      description: "Compare your target salary against real market data for your role and location.",
      color: "emerald" as const,
    },
    {
      icon: <Lightbulb className="h-5 w-5" />,
      title: "Skill Gap Analysis",
      description: "Discover which skills are most in-demand for your target roles.",
      color: "orange" as const,
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <PageHeader
        title="Career Insights"
        description="AI-powered analytics and recommendations for your job search."
      />

      {/* Coming Soon Hero */}
      <Section>
        <EmptyState
          icon={<Sparkles className="h-6 w-6 text-primary" />}
          title="Insights are on the way"
          description="We're building powerful analytics to help you understand your job search performance and make smarter career decisions."
          action={
            <Link
              href="/dashboard/jobs"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Browse Jobs in the meantime
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          }
        />
      </Section>

      {/* Preview of upcoming features */}
      <div>
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Coming Soon
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {comingSoonFeatures.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
