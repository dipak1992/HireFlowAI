import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers — Join the HireFlow AI Team",
  description:
    "Help us build the future of job searching. See open roles at HireFlow AI.",
};

const openRoles = [
  {
    title: "Senior Full Stack Engineer",
    team: "Engineering",
    location: "Remote (US)",
    type: "Full-time",
  },
  {
    title: "AI/ML Engineer",
    team: "Engineering",
    location: "Remote (US)",
    type: "Full-time",
  },
  {
    title: "Product Designer",
    team: "Design",
    location: "Remote (US)",
    type: "Full-time",
  },
  {
    title: "Growth Marketing Manager",
    team: "Marketing",
    location: "Remote (US)",
    type: "Full-time",
  },
  {
    title: "Customer Success Manager",
    team: "Customer Success",
    location: "Remote (US)",
    type: "Full-time",
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-muted/30 to-background">
        <div className="container-tight text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm font-medium text-muted-foreground mb-8">
            <Zap className="h-3.5 w-3.5 text-primary" />
            We&apos;re hiring
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Build the future of{" "}
            <span className="gradient-text">job searching</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join a small, ambitious team on a mission to make job searching
            faster, smarter, and less stressful for everyone.
          </p>
        </div>
      </section>

      {/* Why Join */}
      <section className="section-padding-sm">
        <div className="container-tight">
          <h2 className="text-2xl font-bold mb-8 text-center">Why HireFlow AI?</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              {
                title: "Remote-first",
                desc: "Work from anywhere in the US. We believe great work happens when you have flexibility.",
              },
              {
                title: "Meaningful impact",
                desc: "Every feature you ship helps real people find better jobs and improve their lives.",
              },
              {
                title: "Competitive comp",
                desc: "Market-rate salary, equity, full benefits, and a generous home office stipend.",
              },
            ].map((item) => (
              <div key={item.title} className="premium-card p-6">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Open Roles */}
          <h2 className="text-2xl font-bold mb-6">Open Roles</h2>
          <div className="space-y-3">
            {openRoles.map((role) => (
              <div
                key={role.title}
                className="premium-card p-5 flex items-center justify-between hover-lift group"
              >
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {role.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">{role.team}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{role.location}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{role.type}</span>
                  </div>
                </div>
                <Link
                  href="/contact"
                  className="text-sm text-primary hover:underline flex items-center gap-1 shrink-0"
                >
                  Apply <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground text-sm">
              Don&apos;t see a role that fits?{" "}
              <Link href="/contact" className="text-primary hover:underline">
                Send us your resume anyway
              </Link>{" "}
              — we&apos;re always looking for great people.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
