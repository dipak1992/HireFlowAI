"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Zap, Menu, X, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Blog", href: "/blog" },
];

export default function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-200",
          scrolled
            ? "border-b bg-background/90 backdrop-blur-xl shadow-sm shadow-black/5"
            : "border-b border-transparent bg-background/60 backdrop-blur-md"
        )}
      >
        <div className="container-wide flex h-15 items-center justify-between" style={{ height: "3.75rem" }}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/30 transition-all group-hover:shadow-md group-hover:shadow-primary/40 group-hover:scale-105">
              <Zap className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              HireFlow<span className="text-primary">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-all duration-150"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-sm font-medium")}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ size: "sm" }),
                "text-sm font-medium shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/25 transition-all"
              )}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute top-[3.75rem] left-0 right-0 bg-background border-b shadow-lg animate-fade-in-down">
            <nav className="container-wide py-4 flex flex-col gap-1">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50 rounded-lg transition-colors group"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
              ))}

              <div className="flex flex-col gap-2 pt-3 mt-2 border-t">
                <Link
                  href="/login"
                  className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center")}
                  onClick={() => setMobileOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className={cn(buttonVariants(), "w-full justify-center")}
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started Free
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
