import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Zap,
  Target,
  Brain,
  Link2,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Shield,
} from "lucide-react";

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="flex flex-col items-center text-center py-24 md:py-32 lg:py-40 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur px-4 py-1.5 text-sm font-medium text-muted-foreground mb-8">
              <Sparkles className="h-4 w-4 text-primary" />
              AI-Powered Job Matching
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Find Your Next Role{" "}
              <span className="text-primary">10x Faster</span> with AI
            </h1>

            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              HireFlow AI matches you with the right opportunities based on your
              skills, experience, and career goals. Import your LinkedIn profile
              and let AI do the heavy lifting.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "text-base px-8 h-12"
                )}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/#features"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "text-base px-8 h-12"
                )}
              >
                See How It Works
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Free to start
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                No credit card required
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                LinkedIn import
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Everything You Need to Land Your Dream Job
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful AI tools designed to accelerate your job search and career
              growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="h-6 w-6" />}
              title="AI Job Matching"
              description="Our AI analyzes your skills, experience, and preferences to match you with the most relevant opportunities."
            />
            <FeatureCard
              icon={<Link2 className="h-6 w-6" />}
              title="LinkedIn Import"
              description="Import your LinkedIn profile in one click to auto-build your resume and speed up onboarding."
            />
            <FeatureCard
              icon={<Target className="h-6 w-6" />}
              title="Smart Onboarding"
              description="Tell us your goals — whether you need work fast or want to grow your career — and we'll tailor everything."
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Instant Resume Builder"
              description="Generate a professional resume from your profile data in seconds, optimized for ATS systems."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Privacy First"
              description="Your data is encrypted and secure. We only use your information with your explicit consent."
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="Career Insights"
              description="Get personalized recommendations on skills to develop and roles that match your trajectory."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 md:px-16 md:py-20 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary-foreground">
                Ready to Accelerate Your Job Search?
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Join thousands of professionals who found their next role faster
                with HireFlow AI.
              </p>
              <div className="mt-8">
                <Link
                  href="/signup"
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "lg" }),
                    "text-base px-8 h-12"
                  )}
                >
                  Start Free Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-5">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
