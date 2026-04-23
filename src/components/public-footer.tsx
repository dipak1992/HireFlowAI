import Link from "next/link";
import { Zap, Mail } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Success Stories", href: "/success-stories" },
    { label: "Job Search", href: "/jobs/remote-software-jobs/united-states" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
};

export default function PublicFooter() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary transition-all group-hover:scale-105 group-hover:shadow-md group-hover:shadow-primary/30">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-base font-bold tracking-tight">
                HireFlow<span className="text-primary">AI</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              AI-powered job matching that helps you find the right
              opportunities faster. Build resumes, tailor applications, and
              track your job search.
            </p>
            <a
              href="mailto:hello@hireflow.ai"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              hello@hireflow.ai
            </a>
            <p className="text-xs text-muted-foreground/50">
              &copy; {new Date().getFullYear()} HireFlow AI, Inc. All rights reserved.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                {category}
              </h4>
              <nav className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all duration-150 w-fit"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground/50">
          <p>Built with ❤️ for job seekers everywhere.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-muted-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-muted-foreground transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-muted-foreground transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
