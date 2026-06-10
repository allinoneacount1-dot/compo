"use client";

import { useState, useEffect } from "react";
import { Star, TrendingUp, TrendingDown, X } from "lucide-react";

interface WatchItem {
  symbol: string;
  price: number;
  change: number;
}

const DEFAULT_WATCHLIST: WatchItem[] = [
  { symbol: "SOL", price: 178.00, change: 2.1 },
  { symbol: "BONK", price: 0.00001245, change: 12.4 },
  { symbol: "WIF", price: 2.84, change: -3.2 },
  { symbol: "POPCAT", price: 0.412, change: 8.7 },
  { symbol: "JUP", price: 0.921, change: -1.8 },
];

function formatPrice(p: number): string {
  if (p >= 1000) return `$${p.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (p >= 1) return `$${p.toFixed(2)}`;
  if (p >= 0.0001) return `$${p.toFixed(6)}`;
  return `$${p.toFixed(8)}`;
}

export function QuickWatchlist() {
  const [items, setItems] = useState<WatchItem[]>(DEFAULT_WATCHLIST);
  const [isExpanded, setIsExpanded] = useState(false);

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) =>
        prev.map((item) => ({
          ...item,
          price: item.price * (1 + (Math.random() - 0.5) * 0.002),
          change: item.change + (Math.random() - 0.5) * 0.5,
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#161616] border border-[#222] rounded-xl overflow-hidden">
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#1a1a1a] transition-colors">
        <div className="flex items-center gap-2">
          <Star className="w-3.5 h-3.5 text-[#f59e0b]" />
          <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Quick Watchlist</span>
          <span className="font-mono text-[9px] text-[#52525b]">({items.length})</span>
        </div>
        <span className="font-mono text-[10px] text-[#52525b]">{isExpanded ? "−" : "+"}</span>
      </button>

      {isExpanded && (
        <div className="border-t border-[#222]">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="text-[#52525b] text-[9px] border-b border-[#222]">
                <th className="text-left py-1.5 px-4">Token</th>
                <th className="text-right py-1.5 px-2">Price</th>
                <th className="text-right py-1.5 px-2">24h</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {items.map((item) => (
                <tr key={item.symbol} className="hover:bg-[#1a1a1a]">
                  <td className="py-2 px-4 text-[#00ff9f] font-bold text-[11px]">${item.symbol}</td>
                  <td className="py-2 px-2 text-right text-white text-[11px]">{formatPrice(item.price)}</td>
                  <td className="py-2 px-2 text-right">
                    <span className={["text-[11px] font-bold flex items-center justify-end gap-0.5", item.change >= 0 ? "text-[#00ff9f]" : "text-[#ff3b5c]"].join(" ")}>
                      {item.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {item.change >= 0 ? "+" : ""}{item.change.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
