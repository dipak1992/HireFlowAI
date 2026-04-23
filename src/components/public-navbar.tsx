import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Zap, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container-wide flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary transition-transform group-hover:scale-105">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            HireFlow<span className="text-primary">AI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: "Features", href: "/#features" },
            { label: "Pricing", href: "/pricing" },
            { label: "Success Stories", href: "/success-stories" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-sm"
            )}
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "sm" }),
              "text-sm shadow-sm shadow-primary/20"
            )}
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
