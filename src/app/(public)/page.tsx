import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Zap,
  Target,
  Brain,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Shield,
  FileText,
  BarChart3,
  ClipboardList,
  Star,
  ChevronRight,
  Rocket,
  Briefcase,
  TrendingUp,
  Users,
} from "lucide-react";

export default function LandingPage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/8 via-background to-background" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-60" />
        <div className="container-wide relative">
          <div className="flex flex-col items-center text-center py-20 md:py-28 lg:py-36 max-w-4xl mx-auto animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border bg-white/80 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-muted-foreground mb-8 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI-Powered Career Platform
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Need Work Fast.{" "}
              <span className="gradient-text">Grow Your Career</span>{" "}
              Faster.
            </h1>

            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Build resumes, tailor applications, discover jobs, and stay
              organized with AI. Everything you need to land your next role — in
              one place.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-10">
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "text-base px-8 h-12 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/25 transition-all"
                )}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "text-base px-8 h-12"
                )}
              >
                See Pricing
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Free to start
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                LinkedIn import
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Social Proof ─── */}
      <section className="border-y bg-muted/30 py-8">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["bg-blue-500", "bg-emerald-500", "bg-orange-500", "bg-purple-500", "bg-pink-500"].map((color, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full ${color} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                    {["M", "S", "J", "P", "A"][i]}
                  </div>
                ))}
              </div>
              <div className="ml-2">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Loved by 12,000+ job seekers</p>
              </div>
            </div>
            <div className="hidden md:block w-px h-8 bg-border" />
            <div className="flex items-center gap-8 text-center">
              <div>
                <div className="text-2xl font-bold">94%</div>
                <div className="text-xs text-muted-foreground">Interview rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold">3 wks</div>
                <div className="text-xs text-muted-foreground">Avg. time to hire</div>
              </div>
              <div>
                <div className="text-2xl font-bold">$31k</div>
                <div className="text-xs text-muted-foreground">Avg. salary increase</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="section-padding">
        <div className="container-tight">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              From sign-up to hired in 3 steps
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              No complicated setup. Just import, match, and apply.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
            {[
              {
                step: "01",
                icon: <Users className="h-5 w-5" />,
                title: "Import your profile",
                desc: "Connect LinkedIn or upload your resume. Our AI builds your professional profile in seconds.",
              },
              {
                step: "02",
                icon: <Brain className="h-5 w-5" />,
                title: "AI matches & tailors",
                desc: "Get matched with relevant jobs. Your resume is automatically tailored for each application.",
              },
              {
                step: "03",
                icon: <Rocket className="h-5 w-5" />,
                title: "Apply & track",
                desc: "Apply with one click. Track every application, interview, and offer in your dashboard.",
              },
            ].map((item) => (
              <div key={item.step} className="relative group">
                <div className="premium-card p-8 h-full hover-lift">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      {item.icon}
                    </div>
                    <span className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">Step {item.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Core Features ─── */}
      <section id="features" className="section-padding bg-muted/20">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything you need to land your dream job
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful AI tools designed to accelerate every step of your job search.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            <FeatureCard
              icon={<Brain className="h-5 w-5" />}
              title="AI Job Matching"
              description="Our AI analyzes your skills, experience, and preferences to surface the most relevant opportunities."
            />
            <FeatureCard
              icon={<FileText className="h-5 w-5" />}
              title="Resume Studio"
              description="Build ATS-optimized resumes with 3 professional templates. Export as PDF, DOCX, or plain text."
            />
            <FeatureCard
              icon={<Target className="h-5 w-5" />}
              title="Job Tailoring Engine"
              description="AI rewrites your resume for each job posting. Never send a generic application again."
            />
            <FeatureCard
              icon={<ClipboardList className="h-5 w-5" />}
              title="Application Tracker"
              description="Kanban board and table view to track every application, interview, and offer in one place."
            />
            <FeatureCard
              icon={<Sparkles className="h-5 w-5" />}
              title="AI Interview Prep"
              description="Get tailored interview questions and STAR-format answers based on the specific job description."
            />
            <FeatureCard
              icon={<Shield className="h-5 w-5" />}
              title="Privacy First"
              description="Your data is encrypted and secure. We never share your information without explicit consent."
            />
          </div>
        </div>
      </section>

      {/* ─── Two Flows ─── */}
      <section className="section-padding">
        <div className="container-tight">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">Two paths, one platform</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Whether you need work fast or want to grow
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Need Work Fast */}
            <div className="premium-card p-8 hover-lift border-orange-200/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 mb-6">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Need Work Fast</h3>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Urgently looking for a job? We prioritize speed — fast matching, quick applications, and immediate results.
              </p>
              <ul className="space-y-2.5">
                {[
                  "Instant job matching based on your skills",
                  "One-click apply with tailored resume",
                  "Warehouse, retail, healthcare & more",
                  "Daily new job alerts",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Grow Career */}
            <div className="premium-card p-8 hover-lift border-primary/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Grow Your Career</h3>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Ready for the next level? We help you strategically position yourself for better roles and higher pay.
              </p>
              <ul className="space-y-2.5">
                {[
                  "Strategic resume tailoring per role",
                  "AI interview prep with STAR answers",
                  "Career insights & skill gap analysis",
                  "Application tracking & follow-ups",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pricing Preview ─── */}
      <section className="section-padding bg-muted/20">
        <div className="container-tight">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start free. Upgrade when you&apos;re ready.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <PricingCard
              name="Free"
              price="$0"
              period="forever"
              description="Get started with basic features"
              features={["3 resume tailorings/mo", "Basic job matching", "1 resume template", "Application tracker"]}
              cta="Get Started"
              href="/signup"
              variant="outline"
            />
            <PricingCard
              name="Pro"
              price="$19"
              period="/month"
              description="For serious job seekers"
              features={["25 resume tailorings/mo", "Priority job matching", "All resume templates", "AI interview prep", "Career insights"]}
              cta="Start Pro Trial"
              href="/signup"
              variant="default"
              popular
            />
            <PricingCard
              name="FastHire"
              price="$15"
              period="/month"
              description="Maximum speed to employment"
              features={["50 resume tailorings/mo", "Fast-track applications", "All resume templates", "AI interview prep", "Priority support"]}
              cta="Start FastHire"
              href="/signup"
              variant="outline"
            />
          </div>

          <div className="text-center mt-8">
            <Link href="/pricing" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
              Compare all features <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="section-padding">
        <div className="container-tight">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Frequently asked questions
            </h2>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            {[
              {
                q: "Is HireFlow AI really free to start?",
                a: "Yes! Our Free plan gives you 3 resume tailorings per month, basic job matching, and full access to the application tracker. No credit card required.",
              },
              {
                q: "How does AI job matching work?",
                a: "Our AI analyzes your skills, experience, and career goals from your profile. It then scores and ranks open positions based on how well they match, surfacing the most relevant opportunities first.",
              },
              {
                q: "Will the AI fabricate experience on my resume?",
                a: "Never. Our AI only reorganizes and highlights your real experience. It rewrites bullet points to better match job descriptions, but never invents skills or experience you don't have.",
              },
              {
                q: "Can I import my LinkedIn profile?",
                a: "Yes! Connect your LinkedIn account during onboarding and we'll automatically import your work history, education, and skills to build your profile.",
              },
              {
                q: "What's the difference between Pro and FastHire?",
                a: "Pro is designed for strategic career growth with 25 tailorings/month and career insights. FastHire is optimized for speed with 50 tailorings/month and fast-track applications — ideal if you need work quickly.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Absolutely. No contracts, no hidden fees. Cancel your subscription anytime from your billing dashboard and you'll keep access until the end of your billing period.",
              },
            ].map((faq, i) => (
              <details key={i} className="group premium-card">
                <summary className="flex items-center justify-between cursor-pointer p-5 text-sm font-medium hover:text-primary transition-colors [&::-webkit-details-marker]:hidden list-none">
                  {faq.q}
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 ml-4 transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed -mt-1">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="section-padding">
        <div className="container-tight">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-primary/90 to-indigo-900 px-8 py-16 md:px-16 md:py-20 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiLz48L2c+PC9nPjwvc3ZnPg==')] " />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                Ready to land your next role?
              </h2>
              <p className="mt-4 text-lg text-white/70">
                Join 12,000+ professionals who found better jobs faster with
                HireFlow AI. Start free today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
                <Link
                  href="/signup"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "text-base px-8 h-12 bg-white text-slate-900 hover:bg-white/90 shadow-lg"
                  )}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/success-stories"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "text-base px-8 h-12 border-white/20 text-white hover:bg-white/10"
                  )}
                >
                  Read Success Stories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ─── Feature Card Component ─── */
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
    <div className="premium-card p-6 hover-lift">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

/* ─── Pricing Card Component ─── */
function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  href,
  variant,
  popular,
}: {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  variant: "default" | "outline";
  popular?: boolean;
}) {
  return (
    <div className={cn(
      "premium-card p-6 flex flex-col relative",
      popular && "border-primary shadow-md ring-1 ring-primary/10"
    )}>
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      </div>
      <div className="mb-6">
        <span className="text-3xl font-bold">{price}</span>
        <span className="text-sm text-muted-foreground">{period}</span>
      </div>
      <ul className="space-y-2.5 mb-8 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={cn(
          buttonVariants({ variant, size: "lg" }),
          "w-full"
        )}
      >
        {cta}
      </Link>
    </div>
  );
}
