import { Metadata } from "next";
import Link from "next/link";
import { Zap, Users, Target, Heart, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "About HireFlow AI — Our Mission & Story",
  description:
    "HireFlow AI is on a mission to make job searching faster, smarter, and less stressful. Learn about our team and what drives us.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-muted/30 to-background">
        <div className="container-tight text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm font-medium text-muted-foreground mb-8">
            <Zap className="h-3.5 w-3.5 text-primary" />
            Our Story
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            We&apos;re making job searching{" "}
            <span className="gradient-text">less painful</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            HireFlow AI was built by people who spent months sending hundreds of
            applications into the void. We knew there had to be a better way.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding-sm">
        <div className="container-tight">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We believe everyone deserves access to the tools that give them
                the best shot at landing a great job. For too long, those tools
                have been expensive, complicated, or locked behind paywalls.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                HireFlow AI democratizes the job search by putting AI-powered
                resume tailoring, job matching, and application tracking in the
                hands of every job seeker — from warehouse workers to software
                engineers.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Users className="h-5 w-5" />, stat: "12,000+", label: "Job seekers helped" },
                { icon: <Target className="h-5 w-5" />, stat: "94%", label: "Interview rate" },
                { icon: <Heart className="h-5 w-5" />, stat: "$31k", label: "Avg. salary increase" },
                { icon: <Globe className="h-5 w-5" />, stat: "50+", label: "Industries covered" },
              ].map((item) => (
                <div key={item.label} className="premium-card p-5 text-center">
                  <div className="flex justify-center mb-2 text-primary">{item.icon}</div>
                  <div className="text-2xl font-bold">{item.stat}</div>
                  <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding-sm bg-muted/20">
        <div className="container-tight">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Honesty First",
                desc: "We never fabricate experience or skills. Our AI only highlights what you actually have — just better.",
              },
              {
                title: "Accessibility",
                desc: "Great career tools shouldn't be reserved for the privileged. We keep our free tier genuinely useful.",
              },
              {
                title: "Speed & Results",
                desc: "We obsess over getting you hired faster. Every feature is designed to reduce time-to-offer.",
              },
            ].map((v) => (
              <div key={v.title} className="premium-card p-6">
                <h3 className="font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding-sm">
        <div className="container-tight text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to join us?</h2>
          <p className="text-muted-foreground mb-6">
            Start your job search with HireFlow AI today — free, no credit card required.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
