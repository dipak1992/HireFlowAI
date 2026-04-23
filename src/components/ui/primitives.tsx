/**
 * Reusable UI primitives for HireFlow AI
 * Phase F — Code Quality / Shared Components
 */

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

// ─── PageHeader ───────────────────────────────────────────────────────────────

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 flex-wrap", className)}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

interface SectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export function Section({ title, description, children, className, headerAction }: SectionProps) {
  return (
    <div className={cn("rounded-xl border bg-card p-6 space-y-4", className)}>
      {(title || description || headerAction) && (
        <div className="flex items-start justify-between gap-3">
          <div>
            {title && <h3 className="font-semibold text-base">{title}</h3>}
            {description && (
              <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-14 text-center px-4", className)}>
      {icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
          {icon}
        </div>
      )}
      <p className="text-sm font-semibold">{title}</p>
      {description && (
        <p className="text-sm text-muted-foreground mt-1.5 max-w-xs leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ─── LoadingState ─────────────────────────────────────────────────────────────

interface LoadingStateProps {
  text?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingState({ text, className, size = "md" }: LoadingStateProps) {
  const sizeMap = { sm: "h-5 w-5", md: "h-7 w-7", lg: "h-10 w-10" };
  return (
    <div className={cn("flex flex-col items-center justify-center py-14 gap-3", className)}>
      <Loader2 className={cn("animate-spin text-muted-foreground", sizeMap[size])} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

type StatColor = "blue" | "violet" | "emerald" | "orange" | "rose" | "default";

const statColorMap: Record<StatColor, string> = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
  violet: "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
  orange: "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
  rose: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
  default: "bg-muted text-muted-foreground",
};

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  color?: StatColor;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  color = "default",
  trend,
  trendUp,
  className,
}: StatCardProps) {
  return (
    <div className={cn("rounded-xl border bg-card p-5 space-y-3 hover:shadow-sm transition-shadow", className)}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        {icon && (
          <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg", statColorMap[color])}>
            {icon}
          </div>
        )}
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {trend && (
            <span
              className={cn(
                "text-xs font-medium",
                trendUp ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {trend}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}

// ─── FeatureCard ──────────────────────────────────────────────────────────────

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: StatColor;
  className?: string;
}

export function FeatureCard({ icon, title, description, color = "blue", className }: FeatureCardProps) {
  return (
    <div className={cn("rounded-xl border bg-card p-5 space-y-3 hover:shadow-sm hover:-translate-y-0.5 transition-all", className)}>
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", statColorMap[color])}>
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// ─── InfoBanner ───────────────────────────────────────────────────────────────

type BannerVariant = "info" | "success" | "warning" | "error";

const bannerStyles: Record<BannerVariant, string> = {
  info: "border-primary/20 bg-primary/5 text-primary",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
  warning: "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  error: "border-red-200 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400",
};

interface InfoBannerProps {
  variant?: BannerVariant;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function InfoBanner({ variant = "info", icon, children, className }: InfoBannerProps) {
  return (
    <div className={cn("flex items-start gap-3 rounded-xl border p-4 text-sm", bannerStyles[variant], className)}>
      {icon && <div className="shrink-0 mt-0.5">{icon}</div>}
      <div className="flex-1">{children}</div>
    </div>
  );
}

// ─── Container ────────────────────────────────────────────────────────────────

interface ContainerProps {
  children: React.ReactNode;
  size?: "tight" | "default" | "wide";
  className?: string;
}

export function Container({ children, size = "default", className }: ContainerProps) {
  const sizeMap = {
    tight: "max-w-2xl",
    default: "max-w-4xl",
    wide: "max-w-6xl",
  };
  return (
    <div className={cn(sizeMap[size], className)}>
      {children}
    </div>
  );
}

// ─── Badge variants helper ────────────────────────────────────────────────────

export function StatusBadge({
  status,
  className,
}: {
  status: "active" | "pending" | "cancelled" | "past_due" | string;
  className?: string;
}) {
  const styles: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    cancelled: "bg-muted text-muted-foreground",
    past_due: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        styles[status] ?? styles.pending,
        className
      )}
    >
      {status}
    </span>
  );
}
