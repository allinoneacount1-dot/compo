"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRightLeft,
  Download,
  Settings,
  ChevronUp,
  ChevronDown,
  Wallet,
  Activity,
  BarChart3,
  PieChart,
  RefreshCw,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { formatPriceDetailed, formatPercent, downloadCSV } from "../../lib/utils/format";

// --- Types ---

type TokenCategory = "all" | "bluechips" | "memecoins" | "stablecoins";
type SortField = "token" | "price" | "change" | "value" | "pnl" | "allocation";
type SortDir = "asc" | "desc";

interface Holding {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  holdingsValue: number;
  pnl: number;
  pnlPercent: number;
  allocation: number;
  category: "bluechip" | "memecoin" | "stablecoin";
  amount: number;
}

interface Transaction {
  id: string;
  type: "buy" | "sell" | "swap";
  token: string;
  amount: number;
  value: number;
  time: string;
  timeDate: Date;
}

interface DayPerformance {
  day: string;
  value: number;
}

// --- Mock Data ---

const HOLDINGS: Holding[] = [
  {
    symbol: "SOL",
    name: "Solana",
    price: 178.42,
    change24h: 3.84,
    holdingsValue: 48200,
    pnl: 1782,
    pnlPercent: 3.84,
    allocation: 32.1,
    category: "bluechip",
    amount: 270.18,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: 3245.67,
    change24h: -1.23,
    holdingsValue: 32456,
    pnl: -402,
    pnlPercent: -1.23,
    allocation: 21.6,
    category: "bluechip",
    amount: 10.0,
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: 104523.0,
    change24h: 1.56,
    holdingsValue: 20904,
    pnl: 321,
    pnlPercent: 1.56,
    allocation: 13.9,
    category: "bluechip",
    amount: 0.2,
  },
  {
    symbol: "BNB",
    name: "BNB",
    price: 687.32,
    change24h: -0.45,
    holdingsValue: 6873,
    pnl: -31,
    pnlPercent: -0.45,
    allocation: 4.6,
    category: "bluechip",
    amount: 10.0,
  },
  {
    symbol: "JUP",
    name: "Jupiter",
    price: 0.92,
    change24h: 8.42,
    holdingsValue: 9200,
    pnl: 714,
    pnlPercent: 8.42,
    allocation: 6.1,
    category: "bluechip",
    amount: 10000,
  },
  {
    symbol: "WIF",
    name: "dogwifhat",
    price: 2.84,
    change24h: -5.67,
    holdingsValue: 5680,
    pnl: -342,
    pnlPercent: -5.67,
    allocation: 3.8,
    category: "memecoin",
    amount: 2000,
  },
  {
    symbol: "BONK",
    name: "Bonk",
    price: 0.00001245,
    change24h: 15.23,
    holdingsValue: 6225,
    pnl: 821,
    pnlPercent: 15.23,
    allocation: 4.1,
    category: "memecoin",
    amount: 500000000,
  },
  {
    symbol: "PYTH",
    name: "Pyth Network",
    price: 0.384,
    change24h: 2.11,
    holdingsValue: 3840,
    pnl: 79,
    pnlPercent: 2.11,
    allocation: 2.6,
    category: "bluechip",
    amount: 10000,
  },
  {
    symbol: "ORCA",
    name: "Orca",
    price: 3.21,
    change24h: -2.89,
    holdingsValue: 3210,
    pnl: -96,
    pnlPercent: -2.89,
    allocation: 2.1,
    category: "bluechip",
    amount: 1000,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    price: 1.0,
    change24h: 0.01,
    holdingsValue: 13650,
    pnl: 1,
    pnlPercent: 0.01,
    allocation: 9.1,
    category: "stablecoin",
    amount: 13650,
  },
];

const TRANSACTIONS: Transaction[] = [
  {
    id: "tx1",
    type: "buy",
    token: "SOL",
    amount: 12.5,
    value: 2230,
    time: "3m ago",
    timeDate: new Date(Date.now() - 3 * 60 * 1000),
  },
  {
    id: "tx2",
    type: "sell",
    token: "WIF",
    amount: 500,
    value: 1420,
    time: "18m ago",
    timeDate: new Date(Date.now() - 18 * 60 * 1000),
  },
  {
    id: "tx3",
    type: "swap",
    token: "BONK → SOL",
    amount: 50000000,
    value: 622,
    time: "42m ago",
    timeDate: new Date(Date.now() - 42 * 60 * 1000),
  },
  {
    id: "tx4",
    type: "buy",
    token: "JUP",
    amount: 2500,
    value: 2300,
    time: "1h ago",
    timeDate: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: "tx5",
    type: "sell",
    token: "ORCA",
    amount: 200,
    value: 642,
    time: "2h ago",
    timeDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
];

const WEEKLY_PERFORMANCE: DayPerformance[] = [
  { day: "Mon", value: 142500 },
  { day: "Tue", value: 145200 },
  { day: "Wed", value: 141800 },
  { day: "Thu", value: 148900 },
  { day: "Fri", value: 150200 },
  { day: "Sat", value: 147600 },
  { day: "Sun", value: 150045 },
];

// --- Animated Counter Hook (no framer-motion) ---

function useAnimatedValue(target: number, duration = 1200) {
  const [current, setCurrent] = useState(0);
  const startRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    startRef.current = current;
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCurrent(startRef.current + (target - startRef.current) * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return current;
}

// --- CountUp Component ---

function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const animated = useAnimatedValue(value);
  return (
    <span className={className}>
      {prefix}
      {animated.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

// --- Donut Chart Component ---

function DonutChart({ holdings }: { holdings: Holding[] }) {
  // Filter out negligible holdings for the chart
  const chartData = holdings.filter((h) => h.allocation > 1);
  const total = chartData.reduce((sum, h) => sum + h.allocation, 0);

  const colors: Record<string, string> = {
    SOL: "#9945FF",
    ETH: "#627EEA",
    BTC: "#F7931A",
    BNB: "#F3BA2F",
    JUP: "#00ff41",
    WIF: "#eab308",
    BONK: "#ef4444",
    PYTH: "#3b82f6",
    ORCA: "#06b6d4",
    USDC: "#2775CA",
  };

  // Build conic-gradient stops
  let cumulative = 0;
  const stops = chartData.map((h) => {
    const start = cumulative;
    cumulative += (h.allocation / total) * 360;
    return `${colors[h.symbol] || "#71717a"} ${start}deg ${cumulative}deg`;
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="w-[180px] h-[180px] rounded-full relative"
        style={{
          background: `conic-gradient(${stops.join(", ")})`,
        }}
      >
        {/* Inner cutout */}
        <div
          className="absolute rounded-full"
          style={{
            inset: 52,
            background: "#111113",
          }}
        />
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
            Assets
          </span>
          <span className="font-mono text-lg font-bold text-[#e4e4e7]">
            {chartData.length}
          </span>
        </div>
      </div>
      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full">
        {chartData.map((h) => (
          <div key={h.symbol} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: colors[h.symbol] || "#71717a" }}
            />
            <span className="font-mono text-[10px] text-[#71717a]">
              {h.symbol}
            </span>
            <span className="font-mono text-[10px] text-[#525252] ml-auto">
              {h.allocation.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Performance Bar Chart ---

function PerformanceChart({ data }: { data: DayPerformance[] }) {
  const maxVal = Math.max(...data.map((d) => d.value));
  const minVal = Math.min(...data.map((d) => d.value));
  const range = maxVal - minVal || 1;

  return (
    <div className="flex items-end gap-2 h-[140px]">
      {data.map((d, i) => {
        const heightPercent = ((d.value - minVal) / range) * 100;
        const isLast = i === data.length - 1;
        return (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
            <span className="font-mono text-[9px] text-[#525252]">
              {(d.value / 1000).toFixed(1)}k
            </span>
            <div className="w-full flex-1 flex items-end relative">
              <div
                className="w-full rounded-t transition-all duration-700 ease-out"
                style={{
                  height: `${Math.max(heightPercent, 8)}%`,
                  background: isLast
                    ? "linear-gradient(to top, rgba(0,255,65,0.3), rgba(0,255,65,0.8))"
                    : "linear-gradient(to top, rgba(59,130,246,0.2), rgba(59,130,246,0.5))",
                  border: isLast
                    ? "1px solid rgba(0,255,65,0.4)"
                    : "1px solid rgba(59,130,246,0.2)",
                }}
              />
            </div>
            <span
              className={[
                "font-mono text-[10px]",
                isLast ? "text-[#00ff41]" : "text-[#525252]",
              ].join(" ")}
            >
              {d.day}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// --- Main Component ---

export default function PortfolioPage() {
  const [filter, setFilter] = useState<TokenCategory>("all");
  const [sortField, setSortField] = useState<SortField>("allocation");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [showSettings, setShowSettings] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Derived data
  const totalValue = HOLDINGS.reduce((s, h) => s + h.holdingsValue, 0);
  const totalSOL = totalValue / 178;
  const totalPnl = HOLDINGS.reduce((s, h) => s + h.pnl, 0);
  const totalPnlPercent = (totalPnl / (totalValue - totalPnl)) * 100;
  const bestPerformer = HOLDINGS.reduce((best, h) =>
    h.change24h > best.change24h ? h : best
  );
  const worstPerformer = HOLDINGS.reduce((worst, h) =>
    h.change24h < worst.change24h ? h : worst
  );

  // Filter
  const filteredHoldings = HOLDINGS.filter((h) => {
    if (filter === "all") return true;
    if (filter === "bluechips") return h.category === "bluechip";
    if (filter === "memecoins") return h.category === "memecoin";
    if (filter === "stablecoins") return h.category === "stablecoin";
    return true;
  });

  // Sort
  const sortedHoldings = [...filteredHoldings].sort((a, b) => {
    let cmp = 0;
    switch (sortField) {
      case "token":
        cmp = a.symbol.localeCompare(b.symbol);
        break;
      case "price":
        cmp = a.price - b.price;
        break;
      case "change":
        cmp = a.change24h - b.change24h;
        break;
      case "value":
        cmp = a.holdingsValue - b.holdingsValue;
        break;
      case "pnl":
        cmp = a.pnl - b.pnl;
        break;
      case "allocation":
        cmp = a.allocation - b.allocation;
        break;
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDir("desc");
      }
    },
    [sortField]
  );

  const handleExport = useCallback(() => {
    downloadCSV(
      `compo-portfolio-${new Date().toISOString().slice(0, 10)}.csv`,
      ["Symbol", "Name", "Price", "Change 24h", "Holdings Value", "P&L", "P&L %", "Allocation", "Amount", "Category"],
      HOLDINGS.map((h) => [
        h.symbol,
        h.name,
        h.price.toString(),
        h.change24h.toString(),
        h.holdingsValue.toString(),
        h.pnl.toString(),
        h.pnlPercent.toString(),
        h.allocation.toString(),
        h.amount.toString(),
        h.category,
      ])
    );
  }, []);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ChevronDown className="w-3 h-3 text-[#525252] opacity-30" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 text-[#00ff41]" />
    ) : (
      <ChevronDown className="w-3 h-3 text-[#00ff41]" />
    );
  };

  const formatAmount = (amount: number, symbol: string) => {
    if (symbol === "BONK") return `${(amount / 1e9).toFixed(2)}B`;
    if (amount >= 1000000) return `${(amount / 1e6).toFixed(2)}M`;
    if (amount >= 1000) return `${(amount / 1e3).toFixed(1)}K`;
    return amount.toFixed(4);
  };

  const txIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "buy":
        return <ArrowUpRight className="w-3.5 h-3.5" />;
      case "sell":
        return <ArrowDownRight className="w-3.5 h-3.5" />;
      case "swap":
        return <ArrowRightLeft className="w-3.5 h-3.5" />;
    }
  };

  const txColor = (type: Transaction["type"]) => {
    switch (type) {
      case "buy":
        return { bg: "rgba(0,255,65,0.12)", text: "text-[#00ff41]", label: "BUY" };
      case "sell":
        return { bg: "rgba(239,68,68,0.12)", text: "text-[#ef4444]", label: "SELL" };
      case "swap":
        return { bg: "rgba(59,130,246,0.12)", text: "text-[#3b82f6]", label: "SWAP" };
    }
  };

  const categories: { key: TokenCategory; label: string }[] = [
    { key: "all", label: "ALL" },
    { key: "bluechips", label: "BLUECHIPS" },
    { key: "memecoins", label: "MEMES" },
    { key: "stablecoins", label: "STABLES" },
  ];

  return (
      <div className="p-4 space-y-4 max-w-[1400px]">
        {/* -- Header -- */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[rgba(0,255,65,0.12)] flex items-center justify-center">
              <Wallet className="w-4 h-4 text-[#00ff41]" />
            </div>
            <div>
              <h1 className="font-mono text-sm font-bold text-[#e4e4e7] tracking-wide">
                PORTFOLIO INTEL
              </h1>
              <p className="font-mono text-[10px] text-[#525252]">
                Real-time asset tracking &amp; performance analytics
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[rgba(59,130,246,0.12)] border border-[rgba(59,130,246,0.2)] text-[#3b82f6] hover:bg-[rgba(59,130,246,0.2)] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="font-mono text-[10px] uppercase tracking-wider">
                Export
              </span>
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={[
                "flex items-center gap-1.5 px-3 py-1.5 rounded border transition-colors",
                showSettings
                  ? "bg-[rgba(0,255,65,0.12)] border-[rgba(0,255,65,0.2)] text-[#00ff41]"
                  : "bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.08)] text-[#71717a] hover:text-[#e4e4e7]",
              ].join(" ")}
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="font-mono text-[10px] uppercase tracking-wider">
                Settings
              </span>
            </button>
          </div>
        </div>

        {/* -- Settings Panel -- */}
        {showSettings && (
          <Card className="border-[rgba(0,255,65,0.15)] bg-[rgba(0,255,65,0.03)]">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="w-3.5 h-3.5 text-[#00ff41]" />
              <span className="font-mono text-[10px] text-[#00ff41] uppercase tracking-wider">
                Display Settings
              </span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="font-mono text-[10px] text-[#525252] uppercase tracking-wider block mb-1">
                  Currency
                </label>
                <select className="w-full bg-[#0a0a0b] border border-[rgba(255,255,255,0.08)] rounded px-2 py-1.5 font-mono text-xs text-[#e4e4e7] focus:border-[#00ff41] focus:outline-none transition-colors">
                  <option>USD</option>
                  <option>EUR</option>
                  <option>SOL</option>
                </select>
              </div>
              <div>
                <label className="font-mono text-[10px] text-[#525252] uppercase tracking-wider block mb-1">
                  Price Alerts
                </label>
                <select className="w-full bg-[#0a0a0b] border border-[rgba(255,255,255,0.08)] rounded px-2 py-1.5 font-mono text-xs text-[#e4e4e7] focus:border-[#00ff41] focus:outline-none transition-colors">
                  <option>Enabled</option>
                  <option>Disabled</option>
                </select>
              </div>
              <div>
                <label className="font-mono text-[10px] text-[#525252] uppercase tracking-wider block mb-1">
                  Refresh Rate
                </label>
                <select className="w-full bg-[#0a0a0b] border border-[rgba(255,255,255,0.08)] rounded px-2 py-1.5 font-mono text-xs text-[#e4e4e7] focus:border-[#00ff41] focus:outline-none transition-colors">
                  <option>5s</option>
                  <option>15s</option>
                  <option>30s</option>
                  <option>60s</option>
                </select>
              </div>
              <div>
                <label className="font-mono text-[10px] text-[#525252] uppercase tracking-wider block mb-1">
                  Theme
                </label>
                <select className="w-full bg-[#0a0a0b] border border-[rgba(255,255,255,0.08)] rounded px-2 py-1.5 font-mono text-xs text-[#e4e4e7] focus:border-[#00ff41] focus:outline-none transition-colors">
                  <option>Terminal Dark</option>
                  <option>Midnight</option>
                  <option>OLED Black</option>
                </select>
              </div>
            </div>
          </Card>
        )}

        {/* -- Summary Cards -- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Total Value */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                Total Value
              </span>
              <span className="text-[#00ff41]/60">
                <Wallet className="w-4 h-4" />
              </span>
            </div>
            <p className="text-xl font-bold font-mono text-[#e4e4e7]">
              {mounted ? (
                <AnimatedCounter
                  value={totalValue}
                  prefix="$"
                  decimals={0}
                />
              ) : (
                "$0"
              )}
            </p>
            <p className="font-mono text-[10px] text-[#71717a] mt-1">
              {mounted ? (
                <AnimatedCounter
                  value={totalSOL}
                  suffix=" SOL"
                  decimals={4}
                />
              ) : (
                "0.0000 SOL"
              )}
            </p>
            <p className="text-xs font-mono mt-1 text-[#00ff41]">
              ● LIVE
            </p>
          </Card>

          {/* P&L 24h */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                P&amp;L 24H
              </span>
              <span className={totalPnl >= 0 ? "text-[#00ff41]/60" : "text-[#ef4444]/60"}>
                {totalPnl >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
              </span>
            </div>
            <p
              className={[
                "text-xl font-bold font-mono",
                totalPnl >= 0 ? "text-[#00ff41]" : "text-[#ef4444]",
              ].join(" ")}
            >
              {mounted ? (
                <AnimatedCounter
                  value={Math.abs(totalPnl)}
                  prefix={totalPnl >= 0 ? "+$" : "-$"}
                  decimals={0}
                />
              ) : (
                "$0"
              )}
            </p>
            <p
              className={[
                "text-xs font-mono mt-1",
                totalPnl >= 0 ? "text-[#00ff41]" : "text-[#ef4444]",
              ].join(" ")}
            >
              {formatPercent(totalPnlPercent)} today
            </p>
          </Card>

          {/* Best Performer */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                Best Performer
              </span>
              <span className="text-[#00ff41]/60">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <p className="text-xl font-bold font-mono text-[#00ff41]">
              {bestPerformer.symbol}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="success" size="sm">
                {formatPercent(bestPerformer.change24h)}
              </Badge>
              <span className="font-mono text-[10px] text-[#525252]">
                {formatPriceDetailed(bestPerformer.price)}
              </span>
            </div>
          </Card>

          {/* Worst Performer */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                Worst Performer
              </span>
              <span className="text-[#ef4444]/60">
                <TrendingDown className="w-4 h-4" />
              </span>
            </div>
            <p className="text-xl font-bold font-mono text-[#ef4444]">
              {worstPerformer.symbol}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="danger" size="sm">
                {formatPercent(worstPerformer.change24h)}
              </Badge>
              <span className="font-mono text-[10px] text-[#525252]">
                {formatPriceDetailed(worstPerformer.price)}
              </span>
            </div>
          </Card>
        </div>

        {/* -- Allocation + Performance Row -- */}
        <div className="grid lg:grid-cols-[340px_1fr] gap-3">
          {/* Allocation Donut */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PieChart className="w-3.5 h-3.5 text-[#3b82f6]" />
                <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                  Allocation
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#525252]">
                {HOLDINGS.length} assets
              </span>
            </div>
            <DonutChart holdings={HOLDINGS} />
          </Card>

          {/* Performance Chart */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5 text-[#00ff41]" />
                <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                  7-Day Performance
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#3b82f6]" />
                  <span className="font-mono text-[10px] text-[#525252]">
                    Historical
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00ff41]" />
                  <span className="font-mono text-[10px] text-[#525252]">
                    Current
                  </span>
                </div>
              </div>
            </div>
            <PerformanceChart data={WEEKLY_PERFORMANCE} />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgba(255,255,255,0.04)]">
              <span className="font-mono text-[10px] text-[#525252]">
                Week Range
              </span>
              <span className="font-mono text-[10px] text-[#71717a]">
                {(Math.min(...WEEKLY_PERFORMANCE.map((d) => d.value)) / 1000).toFixed(1)}k
                {" -- "}
                {(Math.max(...WEEKLY_PERFORMANCE.map((d) => d.value)) / 1000).toFixed(1)}k
              </span>
            </div>
          </Card>
        </div>

        {/* -- Holdings Table -- */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-[#00ff41]" />
              <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                Holdings
              </span>
              <span className="font-mono text-[10px] text-[#525252]">
                ({sortedHoldings.length} tokens)
              </span>
            </div>
            <div className="flex items-center gap-1">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setFilter(cat.key)}
                  className={[
                    "px-2 py-1 rounded font-mono text-[10px] uppercase tracking-wider transition-colors",
                    filter === cat.key
                      ? "bg-[rgba(0,255,65,0.15)] text-[#00ff41] border border-[rgba(0,255,65,0.2)]"
                      : "text-[#525252] hover:text-[#71717a] border border-transparent",
                  ].join(" ")}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.06)]">
                  {(
                    [
                      { field: "token" as SortField, label: "Token" },
                      { field: "price" as SortField, label: "Price" },
                      { field: "change" as SortField, label: "24h Change" },
                      { field: "value" as SortField, label: "Holdings Value" },
                      { field: "pnl" as SortField, label: "P&L" },
                      {
                        field: "allocation" as SortField,
                        label: "Allocation",
                      },
                    ] as const
                  ).map((col) => (
                    <th
                      key={col.field}
                      className="text-left px-3 py-2 cursor-pointer hover:text-[#e4e4e7] transition-colors select-none"
                      onClick={() => handleSort(col.field)}
                    >
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                          {col.label}
                        </span>
                        <SortIcon field={col.field} />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedHoldings.map((h) => (
                  <tr
                    key={h.symbol}
                    className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(0,255,65,0.03)] transition-colors duration-150"
                  >
                    {/* Token */}
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded flex items-center justify-center font-mono text-[10px] font-bold"
                          style={{
                            background:
                              h.category === "memecoin"
                                ? "rgba(234,179,8,0.15)"
                                : h.category === "stablecoin"
                                  ? "rgba(39,117,202,0.15)"
                                  : "rgba(0,255,65,0.12)",
                            color:
                              h.category === "memecoin"
                                ? "#eab308"
                                : h.category === "stablecoin"
                                  ? "#2775CA"
                                  : "#00ff41",
                          }}
                        >
                          {h.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <span className="font-mono text-xs font-bold text-[#e4e4e7]">
                            {h.symbol}
                          </span>
                          <span className="font-mono text-[10px] text-[#525252] ml-1.5">
                            {formatAmount(h.amount, h.symbol)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-3 py-2.5">
                      <span className="font-mono text-xs text-[#e4e4e7]">
                        {formatPriceDetailed(h.price)}
                      </span>
                    </td>

                    {/* 24h Change */}
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1">
                        {h.change24h >= 0 ? (
                          <TrendingUp className="w-3 h-3 text-[#00ff41]" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-[#ef4444]" />
                        )}
                        <span
                          className={[
                            "font-mono text-xs font-bold",
                            h.change24h >= 0
                              ? "text-[#00ff41]"
                              : "text-[#ef4444]",
                          ].join(" ")}
                        >
                          {formatPercent(h.change24h)}
                        </span>
                      </div>
                    </td>

                    {/* Holdings Value */}
                    <td className="px-3 py-2.5">
                      <span className="font-mono text-xs text-[#e4e4e7]">
                        ${h.holdingsValue.toLocaleString("en-US")}
                      </span>
                    </td>

                    {/* P&L */}
                    <td className="px-3 py-2.5">
                      <div>
                        <span
                          className={[
                            "font-mono text-xs font-bold",
                            h.pnl >= 0 ? "text-[#00ff41]" : "text-[#ef4444]",
                          ].join(" ")}
                        >
                          {h.pnl >= 0 ? "+" : "-"}$
                          {Math.abs(h.pnl).toLocaleString("en-US")}
                        </span>
                        <span
                          className={[
                            "font-mono text-[10px] ml-1.5",
                            h.pnlPercent >= 0
                              ? "text-[#00ff41]/70"
                              : "text-[#ef4444]/70",
                          ].join(" ")}
                        >
                          ({formatPercent(h.pnlPercent)})
                        </span>
                      </div>
                    </td>

                    {/* Allocation */}
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${h.allocation}%`,
                              background:
                                h.allocation > 20
                                  ? "#00ff41"
                                  : h.allocation > 10
                                    ? "#3b82f6"
                                    : "#525252",
                            }}
                          />
                        </div>
                        <span className="font-mono text-[10px] text-[#71717a] w-10 text-right">
                          {h.allocation.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgba(255,255,255,0.04)]">
            <span className="font-mono text-[10px] text-[#525252]">
              Showing {sortedHoldings.length} of {HOLDINGS.length} tokens
            </span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-[#525252]">
                Total:{" "}
                <span className="text-[#e4e4e7]">
                  ${totalValue.toLocaleString("en-US")}
                </span>
              </span>
              <span className="font-mono text-[10px] text-[#525252]">
                P&amp;L:{" "}
                <span
                  className={
                    totalPnl >= 0 ? "text-[#00ff41]" : "text-[#ef4444]"
                  }
                >
                  {totalPnl >= 0 ? "+" : "-"}$
                  {Math.abs(totalPnl).toLocaleString("en-US")}
                </span>
              </span>
            </div>
          </div>
        </Card>

        {/* -- Recent Activity -- */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />
              <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                Recent Activity
              </span>
            </div>
            <button className="flex items-center gap-1 text-[#3b82f6] hover:text-[#60a5fa] transition-colors">
              <span className="font-mono text-[10px]">View All</span>
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-0">
            {/* Header */}
            <div className="grid grid-cols-[80px_1fr_100px_100px_80px] gap-2 px-3 py-1.5 border-b border-[rgba(255,255,255,0.06)]">
              {["Type", "Token", "Amount", "Value", "Time"].map((h) => (
                <span
                  key={h}
                  className="font-mono text-[10px] text-[#525252] uppercase tracking-wider"
                >
                  {h}
                </span>
              ))}
            </div>

            {TRANSACTIONS.map((tx) => {
              const colors = txColor(tx.type);
              return (
                <div
                  key={tx.id}
                  className="grid grid-cols-[80px_1fr_100px_100px_80px] gap-2 px-3 py-2.5 border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(0,255,65,0.03)] transition-colors duration-150"
                >
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center"
                      style={{ background: colors.bg }}
                    >
                      <span className={colors.text}>{txIcon(tx.type)}</span>
                    </div>
                    <Badge
                      variant={
                        tx.type === "buy"
                          ? "success"
                          : tx.type === "sell"
                            ? "danger"
                            : "info"
                      }
                      size="sm"
                    >
                      {colors.label}
                    </Badge>
                  </div>
                  <span className="font-mono text-xs text-[#e4e4e7] truncate flex items-center">
                    {tx.token}
                  </span>
                  <span className="font-mono text-xs text-[#71717a] flex items-center">
                    {tx.amount.toLocaleString("en-US")}
                  </span>
                  <span className="font-mono text-xs text-[#e4e4e7] flex items-center">
                    ${tx.value.toLocaleString("en-US")}
                  </span>
                  <span className="font-mono text-[10px] text-[#525252] flex items-center">
                    {tx.time}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* -- Footer Status Bar -- */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse" />
              <span className="font-mono text-[10px] text-[#525252]">
                Data refreshed: just now
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#525252]">
              Source: Helius RPC / Jupiter API
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#525252]">
            COMPO Portfolio Intelligence v1.0
          </span>
        </div>
      </div>
  );
}
