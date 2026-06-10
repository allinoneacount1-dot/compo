import type { ReactNode } from "react";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";
type BadgeSize = "sm" | "md";

const variantStyles: Record<BadgeVariant, string> = {
  success: "text-[#10b981] bg-[rgba(16,185,129,0.15)]",
  warning: "text-[#f59e0b] bg-[rgba(245,158,11,0.15)]",
  danger: "text-[#ef4444] bg-[rgba(239,68,68,0.15)]",
  info: "text-[#06b6d4] bg-[rgba(6,182,212,0.15)]",
  neutral: "text-[#71717a] bg-[rgba(113,113,122,0.15)]",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "text-[10px] px-1.5 py-0.5",
  md: "text-xs px-2 py-1",
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

export function Badge({ children, variant = "neutral", size = "md", className = "" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded font-mono uppercase tracking-wider font-medium",
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
