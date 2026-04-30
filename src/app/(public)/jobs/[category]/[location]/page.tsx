// src/app/(public)/jobs/[category]/[location]/page.tsx
// ISR SEO landing page for job category + location

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Building2,
  CheckCircle2,
  ChevronRight,
  Star,
  ArrowRight,
  Clock,
} from "lucide-react";
import { getSeoPage, getAllSeoPages } from "@/lib/seo-pages-config";
import { searchJobs } from "@/lib/jsearch-client";

export const revalidate = 21600; // 6 hours ISR

type Props = {
  params: Promise<{ category: string; location: string }>;
};

export async function generateStaticParams() {
  return getAllSeoPages();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, location } = await params;
  const page = getSeoPage(category, location);
  if (!page) return { title: "Jobs | HireFlow AI" };

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      type: "website",
    },
    alternates: {
      canonical: `/jobs/${category}/${location}`,
    },
  };
}

export default async function SeoJobPage({ params }: Props) {
  const { category, location } = await params;
  const page = getSeoPage(category, location);
  if (!page) notFound();

  // Fetch real jobs from JSearch
  const { jobs } = await searchJobs({
    query: page.searchQuery,
    location: page.searchLocation,
    num_pages: 1,
    page: 1,
  });

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: page.title,
    description: page.metaDescription,
    numberOfItems: jobs.length,
    itemListElement: jobs.slice(0, 10).map((job, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "JobPosting",
        title: job.title,
        hiringOrganization: {
          "@type": "Organization",
          name: job.company,
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.city,
            addressRegion: job.state,
            addressCountry: job.country,
          },
        },
        employmentType: job.job_type,
        datePosted: job.posted_at,
        description: job.description?.slice(0, 500),
        directApply: job.apply_is_direct,
      },
    })),
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hireflow.ai" },
      { "@type": "ListItem", position: 2, name: "Jobs", item: "https://hireflow.ai/jobs" },
      {
        "@type": "ListItem",
        position: 3,
        name: page.title,
        item: `https://hireflow.ai/jobs/${category}/${location}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <div className="min-h-screen bg-background">
        {/* Breadcrumbs */}
        <div className="border-b bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href="/jobs" className="hover:text-foreground transition-colors">
                Jobs
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-foreground font-medium">{page.title}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background border-b">
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                {page.h1}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">{page.intro}</p>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 bg-background rounded-lg border px-4 py-2.5 shadow-sm">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Salary Range</p>
                    <p className="text-sm font-semibold">{page.salaryRange}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-background rounded-lg border px-4 py-2.5 shadow-sm">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-semibold">{page.searchLocation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-background rounded-lg border px-4 py-2.5 shadow-sm">
                  <Briefcase className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Open Positions</p>
                    <p className="text-sm font-semibold">{jobs.length > 0 ? `${jobs.length}+ found` : "Loading..."}</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Apply with AI-Tailored Resume
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard/jobs"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3 text-sm font-semibold hover:bg-muted transition-colors"
                >
                  Search All Jobs
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content + Sidebar */}
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Job Listings */}
            <div className="lg:col-span-2 space-y-6">
              {/* CTA Banner */}
              <div className="rounded-xl bg-primary/5 border border-primary/20 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-sm">🚀 Get 3x more callbacks</p>
                  <p className="text-sm text-muted-foreground">
                    HireFlow AI tailors your resume to each job in seconds
                  </p>
                </div>
                <Link
                  href="/signup"
                  className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Try Free
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Job Listings */}
              <div>
                <h2 className="text-xl font-bold mb-4">
                  Latest {page.title} ({jobs.length > 0 ? `${jobs.length} found` : "Loading..."})
                </h2>

                {jobs.length === 0 ? (
                  <div className="rounded-xl border bg-muted/30 p-8 text-center">
                    <Briefcase className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="font-medium">Job listings loading...</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Real-time jobs are fetched fresh. Try refreshing the page.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div
                        key={job.id}
                        className="rounded-xl border bg-card p-5 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base leading-snug mb-1">
                              {job.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground mb-3">
                              <span className="flex items-center gap-1">
                                <Building2 className="h-3.5 w-3.5" />
                                {job.company}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {job.is_remote ? "Remote" : job.location}
                              </span>
                              {job.posted_at && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  {new Date(job.posted_at).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              )}
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                                {job.job_type === "FULLTIME"
                                  ? "Full-time"
                                  : job.job_type === "PARTTIME"
                                  ? "Part-time"
                                  : job.job_type === "CONTRACTOR"
                                  ? "Contract"
                                  : job.job_type}
                              </span>
                              {job.is_remote && (
                                <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-0.5 text-xs font-medium">
                                  Remote
                                </span>
                              )}
                              {job.salary_min && job.salary_max && (
                                <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2.5 py-0.5 text-xs font-medium">
                                  ${Math.round(job.salary_min / 1000)}k–$
                                  {Math.round(job.salary_max / 1000)}k
                                </span>
                              )}
                            </div>

                            {/* Description snippet */}
                            {job.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {job.description.slice(0, 200)}...
                              </p>
                            )}
                          </div>

                          {job.company_logo && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={job.company_logo}
                              alt={`${job.company} logo`}
                              className="h-12 w-12 rounded-lg object-contain border bg-white p-1 shrink-0"
                            />
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                          <a
                            href={job.apply_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                          >
                            Apply Now
                            <ArrowRight className="h-3.5 w-3.5" />
                          </a>
                          <Link
                            href="/signup"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Tailor resume with AI →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Requirements Section */}
              <div className="rounded-xl border bg-card p-6">
                <h2 className="text-xl font-bold mb-4">
                  Common Requirements for {page.title}
                </h2>
                <ul className="space-y-2.5">
                  {page.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits Section */}
              <div className="rounded-xl border bg-card p-6">
                <h2 className="text-xl font-bold mb-4">
                  Typical Benefits for {page.title}
                </h2>
                <ul className="space-y-2.5">
                  {page.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <Star className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* FAQ Section */}
              <div className="rounded-xl border bg-card p-6">
                <h2 className="text-xl font-bold mb-5">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-5">
                  {page.faqs.map((faq, i) => (
                    <div key={i} className="border-b last:border-0 pb-5 last:pb-0">
                      <h3 className="font-semibold text-sm mb-2">{faq.question}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-5">
              {/* Top Employers */}
              <div className="rounded-xl border bg-card p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  Top Employers Hiring
                </h3>
                <ul className="space-y-2">
                  {page.topEmployers.map((employer, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm py-1.5 border-b last:border-0"
                    >
                      <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                        {employer[0]}
                      </span>
                      {employer}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Salary Range */}
              <div className="rounded-xl border bg-card p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  Salary Range
                </h3>
                <p className="text-2xl font-bold text-green-600">{page.salaryRange}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on current market data for {page.searchLocation}
                </p>
              </div>

              {/* Related Searches */}
              <div className="rounded-xl border bg-card p-5">
                <h3 className="font-semibold mb-3">Related Job Searches</h3>
                <ul className="space-y-2">
                  {page.relatedSearches.map((related, i) => (
                    <li key={i}>
                      <Link
                        href={`/jobs/${related.category}/${related.location}`}
                        className="flex items-center gap-2 text-sm text-primary hover:underline py-1"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                        {related.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Card */}
              <div className="rounded-xl bg-primary p-5 text-primary-foreground">
                <h3 className="font-bold mb-2">Land More Interviews</h3>
                <p className="text-sm opacity-90 mb-4">
                  HireFlow AI tailors your resume to each job posting in seconds.
                  Get 3x more callbacks.
                </p>
                <Link
                  href="/signup"
                  className="block text-center rounded-lg bg-white text-primary px-4 py-2.5 text-sm font-semibold hover:bg-white/90 transition-colors"
                >
                  Start Free — No Credit Card
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
