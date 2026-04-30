"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  BookOpen,
  Target,
} from "lucide-react";

const navItems = [
  {
    href: "/dashboard",
    label: "Home",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/dashboard/jobs",
    label: "Jobs",
    icon: Briefcase,
    exact: false,
  },
  {
    href: "/dashboard/resume",
    label: "Resume",
    icon: FileText,
    exact: false,
  },
  {
    href: "/dashboard/tailoring",
    label: "Tailor",
    icon: Target,
    exact: false,
  },
  {
    href: "/dashboard/tracker",
    label: "Tracker",
    icon: BookOpen,
    exact: false,
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors min-w-0 ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  isActive ? "bg-primary/10" : ""
                }`}
              >
                <Icon className="h-4.5 w-4.5" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span
                className={`text-[10px] font-medium leading-none ${
                  isActive ? "text-primary" : ""
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
