"use client";

import { useMemo } from "react";

// --- Mini Sparkline ---
// Renders a tiny inline SVG sparkline chart for tables/cards.

interface MiniSparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

export function MiniSparkline({
  data,
  color = "#00FF9F",
  width = 64,
  height = 22,
}: MiniSparklineProps) {
  const points = useMemo(() => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    return data
      .map(
        (v, i) =>
          `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`
      )
      .join(" ");
  }, [data, width, height]);

  return (
    <svg width={width} height={height} className="flex-shrink-0 opacity-90">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// --- Quick Sell Buttons ---

interface QuickSellButtonsProps {
  symbol: string;
  onSell: (symbol: string, pct: number) => void;
}

export function QuickSellButtons({ symbol, onSell }: QuickSellButtonsProps) {
  return (
    <div className="flex items-center gap-1">
      {([25, 50, 100] as const).map((pct) => (
        <button
          key={pct}
          onClick={(e) => {
            e.stopPropagation();
            onSell(symbol, pct);
          }}
          className={[
            "font-mono text-[9px] px-1.5 py-0.5 rounded border transition-all duration-150",
            "hover:bg-[rgba(255,59,92,0.15)] hover:border-[rgba(255,59,92,0.3)] hover:text-[#FF3B5C]",
            "border-[rgba(255,59,92,0.15)] text-[#FF3B5C]/70",
          ].join(" ")}
        >
          {pct === 100 ? "ALL" : `${pct}%`}
        </button>
      ))}
    </div>
  );
}
