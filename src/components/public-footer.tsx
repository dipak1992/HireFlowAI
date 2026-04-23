import Link from "next/link";
import { Zap } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Success Stories", href: "/success-stories" },
    { label: "Job Search", href: "/jobs/remote-software-jobs/united-states" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary transition-transform group-hover:scale-105">
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
            <p className="text-xs text-muted-foreground/60">
              &copy; {new Date().getFullYear()} HireFlow AI. All rights
              reserved.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
                {category}
              </h4>
              <nav className="flex flex-col gap-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
