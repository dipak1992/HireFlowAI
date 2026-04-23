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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signOut } from "@/lib/auth-actions";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview & activity",
  },
  {
    title: "Jobs",
    href: "/dashboard/jobs",
    icon: Briefcase,
    description: "AI-matched opportunities",
  },
  {
    title: "Resume Studio",
    href: "/dashboard/resume",
    icon: FileText,
    description: "Build & export resumes",
  },
  {
    title: "Tailoring",
    href: "/dashboard/tailoring",
    icon: Target,
    description: "Optimize for job posts",
  },
  {
    title: "Tracker",
    href: "/dashboard/tracker",
    icon: ClipboardList,
    description: "Track applications",
  },
  {
    title: "Insights",
    href: "/dashboard/insights",
    icon: TrendingUp,
    description: "Career analytics",
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
    description: "Plan & usage",
  },
  {
    title: "Referrals",
    href: "/dashboard/referrals",
    icon: Users,
    description: "Invite & earn",
  },
];

const bottomNavItems = [
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-r bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-5 border-b shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm group-hover:shadow-md transition-shadow">
            <Zap className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <span className="text-base font-bold tracking-tight">
            HireFlow<span className="text-primary">AI</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col px-3 py-4 overflow-y-auto">
        <div className="space-y-0.5">
          <p className="px-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-2">
            Navigation
          </p>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform duration-150",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground",
                    !isActive && "group-hover:scale-110"
                  )}
                />
                <span className="flex-1 truncate">{item.title}</span>
                {isActive && (
                  <ChevronRight className="h-3.5 w-3.5 text-primary-foreground/70 shrink-0" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto space-y-0.5 pt-4">
          <Separator className="mb-3 opacity-50" />
          <p className="px-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-2">
            Account
          </p>
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
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
              className="w-full justify-start gap-3 px-3 py-2.5 h-auto text-sm font-medium text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-destructive transition-colors"
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
