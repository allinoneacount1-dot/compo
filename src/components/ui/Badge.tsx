import type { ReactNode } from "react";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";
type BadgeSize = "sm" | "md";

const variantStyles: Record<BadgeVariant, string> = {
  success: "text-[#00FF9F] bg-[rgba(0,255,159,0.12)] border border-[rgba(0,255,159,0.2)]",
  warning: "text-[#FFB800] bg-[rgba(255,184,0,0.12)] border border-[rgba(255,184,0,0.2)]",
  danger: "text-[#FF3B5C] bg-[rgba(255,59,92,0.12)] border border-[rgba(255,59,92,0.2)]",
  info: "text-[#3B82F6] bg-[rgba(59,130,246,0.12)] border border-[rgba(59,130,246,0.2)]",
  neutral: "text-[#A0A0A0] bg-[rgba(160,160,160,0.1)] border border-[rgba(160,160,160,0.15)]",
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
