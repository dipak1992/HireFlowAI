import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User, ArrowRight } from "lucide-react";
import { getPostBySlug, getAllSlugs, blogPosts, categoryColors } from "@/lib/blog-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found — HireFlow AI Blog" };
  }

  return {
    title: `${post.title} — HireFlow AI Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Get 2 related posts (same category, excluding current)
  const related = blogPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 2);

  // If not enough same-category, fill with other posts
  const otherPosts = blogPosts
    .filter((p) => p.slug !== slug && p.category !== post.category)
    .slice(0, 2 - related.length);

  const relatedPosts = [...related, ...otherPosts].slice(0, 2);

  // Parse markdown-like content into HTML paragraphs
  const sections = post.content.split("\n\n").filter(Boolean);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="section-padding-sm bg-gradient-to-b from-muted/30 to-background border-b">
        <div className="max-w-3xl mx-auto px-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Blog
          </Link>

          <div className="space-y-4">
            <span
              className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                categoryColors[post.category] ?? "bg-muted text-muted-foreground"
              }`}
            >
              {post.category}
            </span>

            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              {post.title}
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                {post.author}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {post.date}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {post.readTime}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="section-padding-sm">
        <div className="max-w-3xl mx-auto px-4">
          <div className="prose prose-slate max-w-none">
            {sections.map((section, i) => {
              // H2 headings
              if (section.startsWith("## ")) {
                return (
                  <h2 key={i} className="text-xl font-bold mt-8 mb-3 text-foreground">
                    {section.replace("## ", "")}
                  </h2>
                );
              }
              // H3 headings
              if (section.startsWith("### ")) {
                return (
                  <h3 key={i} className="text-base font-semibold mt-6 mb-2 text-foreground">
                    {section.replace("### ", "")}
                  </h3>
                );
              }
              // Horizontal rule
              if (section.trim() === "---") {
                return <hr key={i} className="my-6 border-border" />;
              }
              // Table (markdown table)
              if (section.includes("| ") && section.includes("|---")) {
                const rows = section.split("\n").filter((r) => r.trim() && !r.match(/^\|[-\s|]+\|$/));
                const headers = rows[0]?.split("|").filter(Boolean).map((h) => h.trim()) ?? [];
                const bodyRows = rows.slice(1);
                return (
                  <div key={i} className="overflow-x-auto my-6">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-border">
                          {headers.map((h, j) => (
                            <th key={j} className="text-left py-2 pr-4 font-semibold text-foreground">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {bodyRows.map((row, j) => {
                          const cells = row.split("|").filter(Boolean).map((c) => c.trim());
                          return (
                            <tr key={j} className="border-b border-border/50">
                              {cells.map((cell, k) => (
                                <td key={k} className="py-2 pr-4 text-muted-foreground">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              }
              // Bullet list
              if (section.split("\n").every((line) => line.startsWith("- ") || line.trim() === "")) {
                const items = section.split("\n").filter((l) => l.startsWith("- "));
                return (
                  <ul key={i} className="my-4 space-y-1.5 list-none pl-0">
                    {items.map((item, j) => {
                      const text = item.replace("- ", "");
                      return (
                        <li key={j} className="flex items-start gap-2 text-muted-foreground">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          <span dangerouslySetInnerHTML={{ __html: renderInline(text) }} />
                        </li>
                      );
                    })}
                  </ul>
                );
              }
              // Numbered list
              if (section.split("\n").some((line) => /^\d+\./.test(line))) {
                const items = section.split("\n").filter((l) => /^\d+\./.test(l));
                return (
                  <ol key={i} className="my-4 space-y-1.5 list-none pl-0 counter-reset-[item]">
                    {items.map((item, j) => {
                      const text = item.replace(/^\d+\.\s*/, "");
                      return (
                        <li key={j} className="flex items-start gap-3 text-muted-foreground">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold mt-0.5">
                            {j + 1}
                          </span>
                          <span dangerouslySetInnerHTML={{ __html: renderInline(text) }} />
                        </li>
                      );
                    })}
                  </ol>
                );
              }
              // Regular paragraph
              return (
                <p
                  key={i}
                  className="text-muted-foreground leading-relaxed my-4"
                  dangerouslySetInnerHTML={{ __html: renderInline(section) }}
                />
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
            <h3 className="font-bold text-lg mb-2">Ready to put this into practice?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              HireFlow AI helps you tailor your resume, find matching jobs, and track your applications — all in one place.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="section-padding-sm border-t bg-muted/20">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-lg font-bold mb-6">More Articles</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group rounded-xl border bg-card p-5 hover:border-primary/30 hover:shadow-sm transition-all"
                >
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      categoryColors[related.category] ?? "bg-muted text-muted-foreground"
                    }`}
                  >
                    {related.category}
                  </span>
                  <h3 className="font-semibold text-sm mt-3 mb-1 group-hover:text-primary transition-colors leading-snug">
                    {related.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{related.excerpt}</p>
                  <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {related.readTime}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// Simple inline markdown renderer (bold, italic, inline code)
function renderInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-xs font-mono">$1</code>');
}
