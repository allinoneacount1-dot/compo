import type { ReactNode } from "react";

type ProgressColor = "success" | "warning" | "danger" | "accent";
type ProgressSize = "sm" | "md";

const colorMap: Record<ProgressColor, string> = {
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  accent: "#3b82f6",
};

const sizeMap: Record<ProgressSize, number> = {
  sm: 4,
  md: 8,
};

interface ProgressBarProps {
  /** 0-100 */
  value: number;
  color?: ProgressColor;
  size?: ProgressSize;
  showLabel?: boolean;
  /** Optional label node rendered instead of percentage */
  label?: ReactNode;
  className?: string;
}

export function ProgressBar({
  value,
  color = "accent",
  size = "sm",
  showLabel = false,
  label,
  className = "",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const h = sizeMap[size];
  const fillColor = colorMap[color];

  return (
    <div className={["w-full", className].join(" ")}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5 text-xs text-[#71717a]">
          <span>{label ?? "Progress"}</span>
          <span className="font-mono">{clamped.toFixed(0)}%</span>
        </div>
      )}
      <div
        className="w-full rounded-sm bg-[rgba(255,255,255,0.06)] overflow-hidden"
        style={{ height: h }}
      >
        <div
          className="h-full rounded-sm transition-[width] duration-500 ease-out"
          style={{ width: `${clamped}%`, backgroundColor: fillColor }}
        />
      </div>
    </div>
  );
}
