"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { signOut } from "@/lib/auth-actions";
import {
  Zap,
  Menu,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Briefcase,
  FileText,
  TrendingUp,
  Target,
  ClipboardList,
  CreditCard,
  Users,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const allNavItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Find Jobs", href: "/dashboard/jobs", icon: Briefcase },
  { title: "Resume Studio", href: "/dashboard/resume", icon: FileText },
  { title: "Tailoring", href: "/dashboard/tailoring", icon: Target },
  { title: "Tracker", href: "/dashboard/tracker", icon: ClipboardList },
  { title: "Insights", href: "/dashboard/insights", icon: TrendingUp },
  { title: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { title: "Referrals", href: "/dashboard/referrals", icon: Users },
];

const accountItems = [
  { title: "Profile", href: "/dashboard/profile", icon: User },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

// Page title map for breadcrumb
const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/jobs": "Find Jobs",
  "/dashboard/resume": "Resume Studio",
  "/dashboard/tailoring": "Tailoring",
  "/dashboard/tracker": "Tracker",
  "/dashboard/insights": "Insights",
  "/dashboard/billing": "Billing",
  "/dashboard/referrals": "Referrals",
  "/dashboard/profile": "Profile",
  "/dashboard/settings": "Settings",
};

interface AppNavbarProps {
  user: {
    email?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export default function AppNavbar({ user }: AppNavbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const initials = user.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.charAt(0).toUpperCase() || "U";

  // Find current page title — check exact match first, then prefix
  const currentPage =
    pageTitles[pathname] ||
    Object.entries(pageTitles)
      .filter(([key]) => key !== "/dashboard" && pathname.startsWith(key))
      .sort((a, b) => b[0].length - a[0].length)[0]?.[1] ||
    "Dashboard";

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6">
      {/* Mobile Menu Trigger */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          className="lg:hidden inline-flex items-center justify-center rounded-lg h-8 w-8 hover:bg-muted transition-colors shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Open navigation menu</span>
        </SheetTrigger>

        <SheetContent side="left" className="w-72 p-0 flex flex-col">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

          {/* Mobile Logo */}
          <div className="flex h-14 items-center gap-2.5 px-5 border-b shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-base font-bold tracking-tight">
              HireFlow<span className="text-primary">AI</span>
            </span>
          </div>

          {/* Mobile Nav */}
          <nav className="flex-1 flex flex-col px-3 py-4 overflow-y-auto">
            <div className="space-y-0.5">
              <p className="px-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-2">
                Navigation
              </p>
              {allNavItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.title}
                    {isActive && <ChevronRight className="h-3.5 w-3.5 ml-auto text-primary-foreground/70" />}
                  </Link>
                );
              })}
            </div>

            <div className="mt-auto pt-4 space-y-0.5">
              <Separator className="mb-3 opacity-50" />
              <p className="px-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-2">
                Account
              </p>
              {accountItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.title}
                  </Link>
                );
              })}
              <form action={signOut}>
                <Button
                  type="submit"
                  variant="ghost"
                  className="w-full justify-start gap-3 px-3 py-2.5 h-auto text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  Sign Out
                </Button>
              </form>
            </div>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Page Title */}
      <div className="flex items-center gap-2 min-w-0">
        <h1 className="text-sm font-semibold truncate">{currentPage}</h1>
      </div>

      {/* Right Side */}
      <div className="ml-auto flex items-center gap-2">
        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="relative flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-opacity hover:opacity-80"
            aria-label="User menu"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user.avatar_url || ""}
                alt={user.full_name || "User"}
              />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-60" align="end" sideOffset={8}>
            {/* User info header */}
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage
                    src={user.avatar_url || ""}
                    alt={user.full_name || "User"}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <p className="text-sm font-semibold leading-tight truncate">
                    {user.full_name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <Link href="/dashboard/profile" className="flex w-full items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/dashboard/settings" className="flex w-full items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/dashboard/billing" className="flex w-full items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                Billing
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <form action={signOut} className="w-full">
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 text-sm text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
