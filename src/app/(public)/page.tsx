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
  ClipboardList,
  Star,
  ChevronRight,
  Rocket,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  FeatureCard,
  PricingCard,
  DashboardMockup,
} from "@/components/landing/landing-components";

export default function LandingPage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden min-h-[88vh] flex items-center">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-dot-pattern opacity-40" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="container-wide relative w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-20 md:py-24 lg:py-28">
            {/* Left — Copy */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/6 px-4 py-1.5 text-sm font-medium text-primary mb-8">
                <Sparkles className="h-3.5 w-3.5" />
                AI-Powered Career Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08]">
                Find Jobs Near Me.{" "}
                <span className="gradient-text">Grow Your Career</span>{" "}
                Faster.
              </h1>

              <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Build resumes, tailor every application, discover real jobs, and
                track your progress — all powered by AI.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-10">
                <Link
                  href="/signup"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "text-base px-8 h-12 glow-primary-sm transition-all"
                  )}
                >
                  Get Started Free
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

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-8 text-sm text-muted-foreground">
                {["Free to start", "No fake jobs", "Resume AI included"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — Dashboard Mockup */}
            <div className="hidden lg:block">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trust Bar ─── */}
      <section className="border-y bg-muted/25 py-6">
        <div className="container-wide">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground/50 uppercase tracking-widest text-xs">
              Built for modern job seekers
            </span>
            <div className="hidden sm:block w-px h-5 bg-border" />
            {["AI Resume Builder", "Real Job Listings", "Application Tracker", "Interview Prep"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Two User Flows ─── */}
      <section className="section-padding">
        <div className="container-tight">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="badge-pill-primary inline-flex mb-4">Two paths, one platform</div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Find local jobs near you or grow your career
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              HireFlow AI adapts to your situation — find jobs hiring now nearby or build toward your next big role.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Find Jobs Near Me */}
            <div className="feature-card border-orange-200/60 bg-gradient-to-br from-orange-50/50 to-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 mb-6">
                <Zap className="h-6 w-6" />
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 text-orange-700 px-2.5 py-0.5 text-xs font-semibold mb-3">
                Hiring Now Nearby
              </div>
              <h3 className="text-xl font-bold mb-2">Find Jobs Near Me</h3>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Warehouse, logistics, restaurant, retail, delivery, hotel, and local jobs hiring near you. See what&apos;s available today and apply fast.
              </p>
              <ul className="space-y-2.5 mb-8">
                {[
                  "Warehouse, logistics & forklift jobs near you",
                  "Restaurant, retail & hotel jobs hiring now",
                  "Delivery, cleaning & general labor roles",
                  "Weekly pay and shift jobs available",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "border-orange-200 text-orange-700 hover:bg-orange-50")}
              >
                Find Jobs Now <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Grow Career */}
            <div className="feature-card border-primary/20 bg-gradient-to-br from-primary/4 to-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-semibold mb-3">
                Career Growth
              </div>
              <h3 className="text-xl font-bold mb-2">Grow Your Career</h3>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Ready for the next level? Strategically position yourself for better roles, higher pay, and more meaningful work with AI-powered tools.
              </p>
              <ul className="space-y-2.5 mb-8">
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
              <Link href="/signup" className={cn(buttonVariants({ size: "sm" }))}>
                Start Growing <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Feature Grid ─── */}
      <section id="features" className="section-padding bg-muted/20">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="badge-pill-primary inline-flex mb-4">Features</div>
            <h2 className="text-3xl md:text-4xl font-bold">Everything you need to land your next role</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful AI tools designed to accelerate every step of your job search.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            <FeatureCard icon={<Brain className="h-5 w-5" />} title="AI Job Matching" colorClass="bg-blue-50 text-blue-600"
              description="Our AI analyzes your skills, experience, and preferences to surface the most relevant opportunities — ranked by fit." />
            <FeatureCard icon={<FileText className="h-5 w-5" />} title="Resume Studio" colorClass="bg-violet-50 text-violet-600"
              description="Build ATS-optimized resumes with 3 professional templates. Export as PDF, DOCX, or plain text in seconds." />
            <FeatureCard icon={<Target className="h-5 w-5" />} title="Job Tailoring Engine" colorClass="bg-emerald-50 text-emerald-600"
              description="AI rewrites your resume bullets to match each job description. Never send a generic application again." />
            <FeatureCard icon={<ClipboardList className="h-5 w-5" />} title="Application Tracker" colorClass="bg-orange-50 text-orange-600"
              description="Kanban board and table view to track every application, interview, and offer — all in one organized place." />
            <FeatureCard icon={<Sparkles className="h-5 w-5" />} title="AI Interview Prep" colorClass="bg-pink-50 text-pink-600"
              description="Get tailored interview questions and STAR-format answers based on the specific job you're applying for." />
            <FeatureCard icon={<Shield className="h-5 w-5" />} title="Privacy First" colorClass="bg-slate-100 text-slate-600"
              description="Your data is encrypted and secure. We never share your information without explicit consent. You own your data." />
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="section-padding">
        <div className="container-tight">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="badge-pill-primary inline-flex mb-4">How it works</div>
            <h2 className="text-3xl md:text-4xl font-bold">From sign-up to hired in 4 steps</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              No complicated setup. Import your profile, discover jobs, tailor, and apply.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 stagger-children">
            {[
              { step: "01", icon: <Users className="h-5 w-5" />, title: "Import Profile", colorClass: "bg-blue-100 text-blue-600",
                desc: "Connect LinkedIn or upload your resume. AI builds your profile in seconds." },
              { step: "02", icon: <Brain className="h-5 w-5" />, title: "Discover Jobs", colorClass: "bg-violet-100 text-violet-600",
                desc: "Get AI-matched job recommendations ranked by how well they fit your profile." },
              { step: "03", icon: <Target className="h-5 w-5" />, title: "Tailor Resume", colorClass: "bg-emerald-100 text-emerald-600",
                desc: "AI rewrites your resume for each specific job posting in one click." },
              { step: "04", icon: <Rocket className="h-5 w-5" />, title: "Apply & Track", colorClass: "bg-orange-100 text-orange-600",
                desc: "Apply with confidence. Track every application and interview in your dashboard." },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center group">
                <div className={`relative flex h-16 w-16 items-center justify-center rounded-2xl ${item.colorClass} mb-5 transition-transform duration-200 group-hover:scale-110`}>
                  {item.icon}
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-bold">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-base font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Early User Trust Section ─── */}
      <section className="section-padding bg-muted/20">
        <div className="container-tight">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="badge-pill-primary inline-flex mb-4">Early Users</div>
            <h2 className="text-3xl md:text-4xl font-bold">Built with feedback from real users</h2>
            <p className="mt-4 text-muted-foreground">
              HireFlow AI is an early-stage platform. Here&apos;s what our first users are saying.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 stagger-children">
            {[
              { quote: "The resume tailoring feature saved me so much time. Instead of rewriting my resume for every job, the AI does it in seconds.", name: "M.T.", role: "Warehouse Supervisor", location: "Dallas, TX" },
              { quote: "Way easier than juggling LinkedIn, Indeed, and a spreadsheet. Having everything in one place makes the job search feel manageable.", name: "S.K.", role: "Software Developer", location: "Austin, TX" },
              { quote: "The application tracker keeps me organized. I used to forget which jobs I applied to — now I can see everything at a glance.", name: "J.R.", role: "Registered Nurse", location: "Houston, TX" },
            ].map((t, i) => (
              <div key={i} className="premium-card p-6 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((j) => (
                    <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role} · {t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8">
            Feedback from early users of HireFlow AI. Names abbreviated for privacy.
          </p>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section className="section-padding">
        <div className="container-tight">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="badge-pill-primary inline-flex mb-4">Pricing</div>
            <h2 className="text-3xl md:text-4xl font-bold">Simple, transparent pricing</h2>
            <p className="mt-4 text-lg text-muted-foreground">Start free. Upgrade when you&apos;re ready. No hidden fees.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto items-start">
            <PricingCard name="Free" price="$0" period="forever" description="Get started with the essentials"
              features={["3 resume tailorings/mo", "Basic job matching", "1 resume template", "Application tracker"]}
              cta="Get Started" href="/signup" variant="outline" />
            <PricingCard name="Pro" price="$19" period="/month" description="For serious job seekers"
              features={["25 resume tailorings/mo", "Priority job matching", "All resume templates", "AI interview prep", "Career insights"]}
              cta="Start Pro" href="/signup" variant="default" popular />
            <PricingCard name="FastHire" price="$15" period="/month" description="Maximum speed to employment"
              features={["50 resume tailorings/mo", "Fast-track applications", "All resume templates", "AI interview prep", "Priority support"]}
              cta="Start FastHire" href="/signup" variant="outline" />
          </div>

          <div className="text-center mt-8">
            <Link href="/pricing" className="text-sm text-primary hover:underline inline-flex items-center gap-1 font-medium">
              Compare all features <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="section-padding bg-muted/20">
        <div className="container-narrow">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="badge-pill-primary inline-flex mb-4">FAQ</div>
            <h2 className="text-3xl md:text-4xl font-bold">Frequently asked questions</h2>
          </div>

          <div className="space-y-3">
            {[
              { q: "Is HireFlow AI really free to start?", a: "Yes. Our Free plan gives you 3 resume tailorings per month, basic job matching, and full access to the application tracker. No credit card required." },
              { q: "How does AI job matching work?", a: "Our AI analyzes your skills, experience, and career goals from your profile. It then scores and ranks open positions based on how well they match, surfacing the most relevant opportunities first." },
              { q: "Will the AI fabricate experience on my resume?", a: "Never. Our AI only reorganizes and highlights your real experience. It rewrites bullet points to better match job descriptions, but never invents skills or experience you don't have." },
              { q: "Can I import my LinkedIn profile?", a: "Yes. Connect your LinkedIn account during onboarding and we'll automatically import your work history, education, and skills to build your profile." },
              { q: "What's the difference between Pro and FastHire?", a: "Pro is designed for strategic career growth with 25 tailorings/month and career insights. FastHire is optimized for speed with 50 tailorings/month — ideal for warehouse, retail, restaurant, and local job seekers who need to find work fast." },
              { q: "Can I cancel anytime?", a: "Absolutely. No contracts, no hidden fees. Cancel your subscription anytime from your billing dashboard and you'll keep access until the end of your billing period." },
            ].map((faq, i) => (
              <details key={i} className="group premium-card">
                <summary className="flex items-center justify-between cursor-pointer p-5 text-sm font-medium hover:text-primary transition-colors [&::-webkit-details-marker]:hidden list-none">
                  {faq.q}
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 ml-4 transition-transform duration-200 group-open:rotate-90" />
                </summary>
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
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
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-8 py-16 md:px-16 md:py-20 text-center">
            <div className="absolute inset-0 bg-dot-pattern opacity-20" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-primary/20 blur-3xl rounded-full" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/70 mb-8">
                <Rocket className="h-3.5 w-3.5" />
                Start your job search today
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                Ready to land your next role?
              </h2>
              <p className="mt-4 text-lg text-white/60 leading-relaxed">
                Join early users who are finding better jobs faster with HireFlow AI. Free to start — no credit card needed.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
                <Link
                  href="/signup"
                  className={cn(buttonVariants({ size: "lg" }), "text-base px-8 h-12 bg-white text-slate-900 hover:bg-white/92 shadow-xl shadow-black/20")}
                >
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/success-stories"
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "text-base px-8 h-12 border-white/15 text-white hover:bg-white/8 hover:border-white/25")}
                >
                  Read Success Stories
                </Link>
              </div>
              <p className="mt-6 text-sm text-white/40">Free plan · No credit card · Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
