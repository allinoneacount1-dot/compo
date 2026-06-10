import type { ReactNode, MouseEvent } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  hoverable?: boolean;
}

export function Card({ children, className = "", onClick, hoverable = false }: CardProps) {
  const hoverClasses = hoverable
    ? "hover:border-[rgba(255,255,255,0.12)] cursor-pointer transition-colors duration-150"
    : "";

  return (
    <div
      onClick={onClick}
      className={[
        "bg-[#111113] border border-[rgba(255,255,255,0.08)] rounded p-4",
        hoverClasses,
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
