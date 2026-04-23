import { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Star,
  MessageSquare,
  Sparkles,
  Users,
  FileText,
  ClipboardList,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Early User Feedback — HireFlow AI",
  description:
    "See what early users are saying about HireFlow AI. Real feedback from real job seekers using our platform.",
  openGraph: {
    title: "HireFlow AI — Early User Feedback",
    description:
      "Built with early user feedback. Here's what job seekers are saying about HireFlow AI.",
  },
};

const FEEDBACK = [
  {
    initials: "M.T.",
    color: "bg-blue-500",
    quote: "Easy to tailor my resume fast. Used to spend 45 minutes per application — now it takes under 5.",
    role: "Software Engineer",
    location: "Austin, TX",
    rating: 5,
  },
  {
    initials: "S.K.",
    color: "bg-emerald-500",
    quote: "Cleaner than using 5 different job sites. Everything I need is in one place.",
    role: "Registered Nurse",
    location: "Dallas, TX",
    rating: 5,
  },
  {
    initials: "J.R.",
    color: "bg-orange-500",
    quote: "Helpful for organizing applications. The tracker alone is worth it — I was using a spreadsheet before.",
    role: "Warehouse Supervisor",
    location: "Houston, TX",
    rating: 5,
  },
  {
    initials: "P.M.",
    color: "bg-purple-500",
    quote: "The AI tailoring actually works. It caught keywords I was missing and my callback rate improved.",
    role: "Data Analyst",
    location: "Remote",
    rating: 5,
  },
  {
    initials: "C.V.",
    color: "bg-red-500",
    quote: "Simple and fast. I applied to 12 jobs in the time it used to take me to apply to 3.",
    role: "Sales Professional",
    location: "Chicago, IL",
    rating: 5,
  },
  {
    initials: "E.W.",
    color: "bg-pink-500",
    quote: "The resume builder is genuinely good. It helped me highlight experience I didn't know how to frame.",
    role: "Marketing Coordinator",
    location: "Remote",
    rating: 5,
  },
];

const FEATURES = [
  {
    icon: <FileText className="h-5 w-5" />,
    title: "AI Resume Tailoring",
    description: "Customize your resume for each job in minutes, not hours.",
    color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "Job Matching",
    description: "AI surfaces roles that match your skills and preferences.",
    color: "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
  },
  {
    icon: <ClipboardList className="h-5 w-5" />,
    title: "Application Tracker",
    description: "Keep every application organized in one place.",
    color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
  },
];

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm font-medium text-white/80 mb-6">
            <MessageSquare className="h-3.5 w-3.5" />
            Early User Feedback
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Built with Real{" "}
            <span className="text-blue-400">Job Seekers</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            HireFlow AI is a growing platform shaped by early user feedback.
            Here&apos;s what job seekers are saying about their experience.
          </p>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-white text-slate-900 hover:bg-white/90 font-semibold px-8 h-12 text-base shadow-lg"
            )}
          >
            Try It Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Honest transparency bar */}
      <section className="border-b bg-muted/30 py-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Transparency note:</span>{" "}
            HireFlow AI is an early-stage platform. The feedback below is from real early users.
            We&apos;re growing our community and improving every week.{" "}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Join us early
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Features overview */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-3">What Users Are Using It For</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Early users are finding the most value in these three areas.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-xl border bg-card p-6 text-center space-y-3">
              <div className={cn("inline-flex h-12 w-12 items-center justify-center rounded-xl", feature.color)}>
                {feature.icon}
              </div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feedback Grid */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-3">What Early Users Are Saying</h2>
          <p className="text-sm text-muted-foreground">
            Feedback from our growing community of job seekers. More stories coming soon.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEEDBACK.map((item) => (
            <div
              key={item.initials}
              className="rounded-xl border bg-card p-5 space-y-4 hover:shadow-sm transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                &ldquo;{item.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t">
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold",
                    item.color
                  )}
                >
                  {item.initials}
                </div>
                <div>
                  <p className="text-sm font-medium">{item.role}</p>
                  <p className="text-xs text-muted-foreground">{item.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Community note */}
        <div className="mt-10 rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-base">Growing Community of Early Users</h3>
          </div>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
            We&apos;re building HireFlow AI with our users. If you try it and have feedback,
            we&apos;d love to hear from you — it directly shapes what we build next.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "px-8 h-11 text-sm font-semibold"
              )}
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "px-8 h-11 text-sm font-semibold"
              )}
            >
              Share Feedback
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
