import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { blogPosts, categoryColors } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Blog — HireFlow AI",
  description:
    "Career advice, job search tips, resume writing guides, and AI insights from the HireFlow AI team.",
};

export default function BlogPage() {
  // Show the 5 new 2025 SEO posts first, then the rest
  const featuredSlugs = [
    "ats-resume-tips-2025",
    "entry-level-jobs-no-experience",
    "how-to-write-cover-letter-with-ai",
    "job-search-tips-for-career-changers",
    "best-jobs-for-remote-work-2025",
  ];

  const featured = featuredSlugs
    .map((slug) => blogPosts.find((p) => p.slug === slug))
    .filter(Boolean) as typeof blogPosts;

  const rest = blogPosts.filter((p) => !featuredSlugs.includes(p.slug));
  const allPosts = [...featured, ...rest];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="section-padding-sm bg-gradient-to-b from-muted/30 to-background">
        <div className="container-tight text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Career Insights & Job Search Tips
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Practical advice to help you find better jobs faster, write stronger
            resumes, and ace your interviews.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="section-padding-sm">
        <div className="container-tight">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPosts.map((post) => (
              <article
                key={post.slug}
                className="premium-card overflow-hidden hover-lift flex flex-col group"
              >
                <div className="h-1.5 bg-gradient-to-r from-primary to-indigo-500" />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                        categoryColors[post.category] ?? "bg-muted text-muted-foreground"
                      }`}
                    >
                      {post.category}
                    </span>
                  </div>
                  <h2 className="font-semibold text-base leading-snug mb-2 group-hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </div>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    Read article
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground text-sm">
              More articles coming soon.{" "}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>{" "}
              to get notified.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
