import type { ReactNode, MouseEvent } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  hoverable?: boolean;
  compact?: boolean;
}

export function Card({ children, className = "", onClick, hoverable = false, compact = false }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={[
        "bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded",
        compact ? "p-3" : "p-4",
        "shadow-[var(--shadow-card)]",
        hoverable
          ? "hover:border-[var(--color-border-accent)] hover:bg-[var(--color-bg-hover)] hover:shadow-[var(--shadow-glow-green)] cursor-pointer transition-all duration-150"
          : "transition-all duration-150",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
