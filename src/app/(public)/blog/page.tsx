import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — HireFlow AI",
  description:
    "Career advice, job search tips, resume writing guides, and AI insights from the HireFlow AI team.",
};

const posts = [
  {
    slug: "how-to-tailor-resume-for-ats",
    title: "How to Tailor Your Resume for ATS Systems in 2024",
    excerpt:
      "Applicant Tracking Systems reject up to 75% of resumes before a human ever sees them. Here's how to beat the bots.",
    category: "Resume Tips",
    date: "April 15, 2024",
    readTime: "6 min read",
  },
  {
    slug: "warehouse-jobs-dallas-guide",
    title: "The Complete Guide to Finding Warehouse Jobs in Dallas",
    excerpt:
      "Dallas has over 2,400 open warehouse positions right now. Here's how to find them, apply fast, and stand out.",
    category: "Job Search",
    date: "April 10, 2024",
    readTime: "8 min read",
  },
  {
    slug: "ai-interview-prep-tips",
    title: "5 Ways AI Can Help You Prepare for Job Interviews",
    excerpt:
      "From generating practice questions to crafting STAR-format answers, AI is changing how candidates prepare.",
    category: "Interview Prep",
    date: "April 5, 2024",
    readTime: "5 min read",
  },
  {
    slug: "nurse-jobs-career-guide",
    title: "Nursing Career Guide: How to Land Your Dream Hospital Job",
    excerpt:
      "The nursing shortage means more opportunities than ever. Here's how to position yourself for the best roles.",
    category: "Healthcare",
    date: "March 28, 2024",
    readTime: "7 min read",
  },
  {
    slug: "remote-software-jobs-guide",
    title: "How to Land a Remote Software Engineering Job in 2024",
    excerpt:
      "Remote software jobs are competitive. Here's the exact strategy top candidates use to stand out.",
    category: "Tech Careers",
    date: "March 20, 2024",
    readTime: "9 min read",
  },
  {
    slug: "salary-negotiation-tips",
    title: "Salary Negotiation: How to Get 20% More Than the Initial Offer",
    excerpt:
      "Most candidates leave money on the table. These proven negotiation tactics can significantly boost your offer.",
    category: "Career Growth",
    date: "March 15, 2024",
    readTime: "6 min read",
  },
];

const categoryColors: Record<string, string> = {
  "Resume Tips": "bg-blue-100 text-blue-700",
  "Job Search": "bg-orange-100 text-orange-700",
  "Interview Prep": "bg-purple-100 text-purple-700",
  Healthcare: "bg-green-100 text-green-700",
  "Tech Careers": "bg-cyan-100 text-cyan-700",
  "Career Growth": "bg-pink-100 text-pink-700",
};

export default function BlogPage() {
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
            {posts.map((post) => (
              <article
                key={post.slug}
                className="premium-card overflow-hidden hover-lift flex flex-col"
              >
                <div className="h-2 bg-gradient-to-r from-primary to-indigo-500" />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[post.category] || "bg-muted text-muted-foreground"}`}
                    >
                      {post.category}
                    </span>
                  </div>
                  <h2 className="font-semibold text-base leading-snug mb-2 hover:text-primary transition-colors">
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
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground text-sm">
              More articles coming soon.{" "}
              <Link href="/signup" className="text-primary hover:underline">
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
