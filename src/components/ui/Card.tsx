import type { ReactNode, MouseEvent } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  hoverable?: boolean;
}

export function Card({ children, className = "", onClick, hoverable = false }: CardProps) {
  const hoverClasses = hoverable
    ? "hover:border-[rgba(0,255,65,0.15)] hover:bg-[rgba(0,255,65,0.02)] cursor-pointer transition-all duration-150"
    : "";

  return (
    <div
      onClick={onClick}
      className={[
        "bg-[#0a0a0b] border border-[rgba(255,255,255,0.06)] rounded p-3",
        hoverClasses,
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
