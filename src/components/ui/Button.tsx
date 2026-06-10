import type { ReactNode, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-[#3b82f6] text-white hover:bg-[#2563eb] active:bg-[#1d4ed8]",
  secondary:
    "bg-transparent border border-[rgba(255,255,255,0.1)] text-[#e4e4e7] hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.03)]",
  danger: "bg-[#ef4444] text-white hover:bg-[#dc2626] active:bg-[#b91c1c]",
  ghost: "bg-transparent text-[#71717a] hover:text-[#a1a1aa] hover:bg-[rgba(255,255,255,0.03)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  icon,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-2 rounded font-medium",
        "transition-colors duration-150",
        "focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/40 focus:ring-offset-1 focus:ring-offset-[#0a0a0b]",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(" ")}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : icon ? (
        <span className="w-4 h-4 flex items-center justify-center">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
