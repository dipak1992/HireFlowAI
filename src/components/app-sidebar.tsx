"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Target,
  Zap,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Briefcase,
  FileText,
  TrendingUp,
  ClipboardList,
  CreditCard,
  Users,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signOut } from "@/lib/auth-actions";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Find Jobs", href: "/dashboard/jobs", icon: Briefcase },
  { title: "Resume Studio", href: "/dashboard/resume", icon: FileText },
  { title: "Tailoring", href: "/dashboard/tailoring", icon: Target },
  { title: "Tracker", href: "/dashboard/tracker", icon: ClipboardList },
  { title: "Insights", href: "/dashboard/insights", icon: TrendingUp },
  { title: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { title: "Referrals", href: "/dashboard/referrals", icon: Users },
];

const bottomNavItems = [
  { title: "Profile", href: "/dashboard/profile", icon: User },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function AppSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-r bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-5 border-b shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/30 transition-all group-hover:shadow-md group-hover:shadow-primary/40 group-hover:scale-105">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-base font-bold tracking-tight">
            HireFlow<span className="text-primary">AI</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col px-3 py-4 overflow-y-auto gap-0.5">
        {/* Main nav */}
        <div className="space-y-0.5">
          <p className="px-3 text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest mb-2 mt-1">
            Menu
          </p>
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "text-sidebar-foreground/65 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-all duration-150",
                    active
                      ? "text-primary-foreground"
                      : "text-muted-foreground group-hover:text-foreground group-hover:scale-110"
                  )}
                />
                <span className="flex-1 truncate">{item.title}</span>
                {active && (
                  <ChevronRight className="h-3.5 w-3.5 text-primary-foreground/60 shrink-0" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Upgrade nudge */}
        <div className="mx-1 mt-4 mb-2 rounded-xl border border-primary/15 bg-gradient-to-br from-primary/8 to-indigo-50/30 p-3.5">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">Upgrade to Pro</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed mb-2.5">
            Unlock AI interview prep, unlimited tailoring & more.
          </p>
          <Link
            href="/dashboard/billing"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
          >
            View Plans <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Bottom nav */}
        <div className="mt-auto space-y-0.5 pt-2">
          <Separator className="mb-3 opacity-40" />
          <p className="px-3 text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest mb-2">
            Account
          </p>
          {bottomNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "text-sidebar-foreground/65 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                {item.title}
              </Link>
            );
          })}

          <form action={signOut}>
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start gap-3 px-3 py-2.5 h-auto text-sm font-medium text-sidebar-foreground/55 hover:bg-destructive/8 hover:text-destructive transition-all rounded-xl"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Sign Out
            </Button>
          </form>
        </div>
      </nav>
    </aside>
  );
}
