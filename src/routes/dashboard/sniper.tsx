"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  ChevronDown,
  Settings,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Trash2,
  Target,
  Shield,
  ToggleLeft,
  ToggleRight,
  History,
  Users,
  Wallet,
  LineChart,
  CheckCircle,
  Flame,
  Activity,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { CountUp } from "../../components/ui/CountUp";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
} from "../../components/ui/Table";
import {
  truncateAddress,
  timeAgo,
} from "../../lib/utils/format";
import { cn } from "../../lib/utils/cn";

// --- Types ---

interface ActivePosition {
  id: string;
  name: string;
  symbol: string;
  iconColor: string;
  entryPrice: number;
  currentPrice: number;
  amount: number;
  pnlPercent: number;
  pnlSOL: number;
  sparkline: number[];
}

interface HistoryEntry {
  id: string;
  time: Date;
  token: string;
  symbol: string;
  type: "SNIPE" | "COPY" | "MANUAL";
  amount: number;
  price: number;
  pnlPercent: number;
  txHash: string;
}

interface FollowedWallet {
  address: string;
  label: string;
  pnl: number;
  trades: number;
  winRate: number;
}

// --- Mock Data ---

const PRESET_TOKENS = [
  { label: "BONK", address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263" },
  { label: "WIF", address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm" },
  { label: "POPCAT", address: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr" },
  { label: "JUP", address: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN" },
  { label: "MYRO", address: "HhJpBhRRn4g56VsyLuTgaYcnN4h9vOjBS8t5cZNjiW9Q" },
];

function generateSparkline(trend: "up" | "down" | "volatile"): number[] {
  const points: number[] = [];
  let v = 50;
  for (let i = 0; i < 20; i++) {
    const delta =
      trend === "up"
        ? Math.random() * 6 - 1
        : trend === "down"
          ? Math.random() * 6 - 5
          : Math.random() * 10 - 5;
    v = Math.max(5, Math.min(95, v + delta));
    points.push(Math.round(v));
  }
  return points;
}

const MOCK_POSITIONS: ActivePosition[] = [
  {
    id: "1",
    name: "BONK Inu",
    symbol: "BONK",
    iconColor: "#f59e0b",
    entryPrice: 0.00001245,
    currentPrice: 0.00001892,
    amount: 2.5,
    pnlPercent: 52.0,
    pnlSOL: 1.3,
    sparkline: generateSparkline("up"),
  },
  {
    id: "2",
    name: "dogwifhat",
    symbol: "WIF",
    iconColor: "#3b82f6",
    entryPrice: 2.45,
    currentPrice: 3.12,
    amount: 1.8,
    pnlPercent: 27.3,
    pnlSOL: 0.49,
    sparkline: generateSparkline("up"),
  },
  {
    id: "3",
    name: "Popcat",
    symbol: "POPCAT",
    iconColor: "#10b981",
    entryPrice: 0.0045,
    currentPrice: 0.0038,
    amount: 0.8,
    pnlPercent: -15.6,
    pnlSOL: -0.12,
    sparkline: generateSparkline("down"),
  },
  {
    id: "4",
    name: "Myro",
    symbol: "MYRO",
    iconColor: "#a855f7",
    entryPrice: 0.12,
    currentPrice: 0.135,
    amount: 3.2,
    pnlPercent: 12.5,
    pnlSOL: 0.4,
    sparkline: generateSparkline("volatile"),
  },
];

const MOCK_HISTORY: HistoryEntry[] = [
  {
    id: "h1",
    time: new Date(Date.now() - 1000 * 60 * 3),
    token: "BONK Inu",
    symbol: "BONK",
    type: "SNIPE",
    amount: 2.5,
    price: 0.00001245,
    pnlPercent: 52.0,
    txHash: "5UfDuX93gS7GZnKpLmNqRtVwYzBcDeFgHiJkLmNoPqRs",
  },
  {
    id: "h2",
    time: new Date(Date.now() - 1000 * 60 * 28),
    token: "dogwifhat",
    symbol: "WIF",
    type: "SNIPE",
    amount: 1.8,
    price: 2.45,
    pnlPercent: 27.3,
    txHash: "3HkPwRt92FnLmTqVzBcDeFgHiJkLmNoPqRsTuVwXyZa",
  },
  {
    id: "h3",
    time: new Date(Date.now() - 1000 * 60 * 74),
    token: "Popcat",
    symbol: "POPCAT",
    type: "SNIPE",
    amount: 0.8,
    price: 0.0045,
    pnlPercent: -15.6,
    txHash: "8JkLmNoPqRsTuVwXyZaBcDeFgHiJkLmNoPqRsTuVwX",
  },
  {
    id: "h4",
    time: new Date(Date.now() - 1000 * 60 * 156),
    token: "Jupiter",
    symbol: "JUP",
    type: "COPY",
    amount: 1.5,
    price: 0.85,
    pnlPercent: 18.2,
    txHash: "2AbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKlMnO",
  },
  {
    id: "h5",
    time: new Date(Date.now() - 1000 * 60 * 240),
    token: "Myro",
    symbol: "MYRO",
    type: "MANUAL",
    amount: 3.2,
    price: 0.12,
    pnlPercent: 12.5,
    txHash: "9PqRsTuVwXyZaBcDeFgHiJkLmNoPqRsTuVwXyZaBcD",
  },
  {
    id: "h6",
    time: new Date(Date.now() - 1000 * 60 * 380),
    token: "Book of Meme",
    symbol: "BOME",
    type: "SNIPE",
    amount: 0.5,
    price: 0.0085,
    pnlPercent: -45.0,
    txHash: "7WxYzAbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIj",
  },
  {
    id: "h7",
    time: new Date(Date.now() - 1000 * 60 * 520),
    token: "SolLayr",
    symbol: "LAYR",
    type: "COPY",
    amount: 2.0,
    price: 0.35,
    pnlPercent: 62.0,
    txHash: "1LmNoPqRsTuVwXyZaBcDeFgHiJkLmNoPqRsTuVwXy",
  },
  {
    id: "h8",
    time: new Date(Date.now() - 1000 * 60 * 720),
    token: "Smol Cat",
    symbol: "SCAT",
    type: "SNIPE",
    amount: 1.0,
    price: 0.0012,
    pnlPercent: 340.0,
    txHash: "4QrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYzAbCd",
  },
];

const MOCK_FOLLOWED: FollowedWallet[] = [
  {
    address: "7a3F2e8b9cD1fE4a5B6c7D8e9F0a1B2c3D4e5F6a",
    label: "Alpha Hunter",
    pnl: 45.2,
    trades: 87,
    winRate: 78,
  },
  {
    address: "1B2c3D4e5F6a7A8b9Cd0E1f2A3b4C5d6E7f8A9b0",
    label: "Rug Survivor",
    pnl: 12.8,
    trades: 43,
    winRate: 65,
  },
];

// --- Mini Sparkline ---

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");

  return (
    <svg width={w} height={h} className="opacity-80">
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

// --- Toggle ---

function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="text-[#3b82f6] hover:text-[#60a5fa] transition-colors"
    >
      {enabled ? (
        <ToggleRight className="w-8 h-8" />
      ) : (
        <ToggleLeft className="w-8 h-8 text-[#525252]" />
      )}
    </button>
  );
}

// --- Type badge colors ---

function TypeBadge({ type }: { type: HistoryEntry["type"] }) {
  const styles: Record<string, string> = {
    SNIPE: "text-[#3b82f6] bg-[rgba(59,130,246,0.15)]",
    COPY: "text-[#06b6d4] bg-[rgba(6,182,212,0.15)]",
    MANUAL: "text-[#71717a] bg-[rgba(113,113,122,0.15)]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded font-mono uppercase tracking-wider font-medium text-[10px] px-2 py-0.5",
        styles[type]
      )}
    >
      {type}
    </span>
  );
}

// --- Main Component ---

export default function SniperCenter() {
  const [contractAddress, setContractAddress] = useState("");
  const [snipeAmount, setSnipeAmount] = useState("0.5");
  const [slippage, setSlippage] = useState("1");
  const [gasBoost, setGasBoost] = useState<"Normal" | "Fast" | "Turbo">("Fast");
  const [isExecuting, setIsExecuting] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [copyTradeEnabled, setCopyTradeEnabled] = useState(false);
  const [followWalletInput, setFollowWalletInput] = useState("");
  const [historyFilter, setHistoryFilter] = useState<
    "All" | "Wins" | "Losses" | "Pending"
  >("All");

  const gasOptions: Array<"Normal" | "Fast" | "Turbo"> = [
    "Normal",
    "Fast",
    "Turbo",
  ];
  const gasColors: Record<string, string> = {
    Normal: "text-[#10b981] border-[rgba(16,185,129,0.3)]",
    Fast: "text-[#f59e0b] border-[rgba(245,158,11,0.3)]",
    Turbo: "text-[#ef4444] border-[rgba(239,68,68,0.3)]",
  };

  const handlePreset = (address: string) => {
    setContractAddress(address);
  };

  const handleExecute = useCallback(() => {
    if (!contractAddress) return;
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setContractAddress("");
    }, 2500);
  }, [contractAddress]);

  const filteredHistory = useMemo(() => {
    switch (historyFilter) {
      case "Wins":
        return MOCK_HISTORY.filter((h) => h.pnlPercent > 0);
      case "Losses":
        return MOCK_HISTORY.filter((h) => h.pnlPercent <= 0);
      case "Pending":
        return MOCK_HISTORY.filter((h) => h.time > new Date(Date.now() - 1000 * 60 * 10));
      default:
        return MOCK_HISTORY;
    }
  }, [historyFilter]);

  return (
      <div className="p-4 space-y-5 max-w-[1280px]">
        {/* ===============================================================
            1. QUICK SNIPE
        =============================================================== */}
        <Card className="relative overflow-hidden">
          {/* Subtle red accent glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[rgba(239,68,68,0.03)] rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-[#ef4444]" />
            <h2 className="font-mono text-sm font-bold text-[#e4e4e7] uppercase tracking-wider">
              ⚡ Quick Snipe
            </h2>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse" />
              <span className="font-mono text-[10px] text-[#ef4444] uppercase tracking-wider">
                Live
              </span>
            </div>
          </div>

          {/* Contract Address Input */}
          <div className="flex gap-2 mb-3">
            <div className="flex-1">
              <Input
                mono
                placeholder="Enter contract address (e.g., DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263)"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
              />
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider mr-1">
              Presets:
            </span>
            {PRESET_TOKENS.map((preset) => (
              <Button
                key={preset.label}
                variant="secondary"
                size="sm"
                onClick={() => handlePreset(preset.address)}
                className="font-mono text-[11px]"
              >
                {preset.label}
              </Button>
            ))}
          </div>

          {/* Amount + Slippage + Gas Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {/* Amount */}
            <div>
              <label className="font-mono text-[10px] text-[#525252] uppercase tracking-wider mb-1.5 block">
                Amount (SOL)
              </label>
              <Input
                mono
                type="number"
                step="0.1"
                min="0"
                value={snipeAmount}
                onChange={(e) => setSnipeAmount(e.target.value)}
                className="font-mono"
              />
            </div>

            {/* Slippage */}
            <div>
              <label className="font-mono text-[10px] text-[#525252] uppercase tracking-wider mb-1.5 block">
                Slippage
              </label>
              <div className="relative">
                <select
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                  className="w-full h-10 rounded px-3 bg-[#0a0a0b] border border-[rgba(255,255,255,0.08)] text-[#e4e4e7] font-mono text-sm focus:outline-none focus:border-[#3b82f6] appearance-none cursor-pointer"
                >
                  <option value="0.5">0.5%</option>
                  <option value="1">1%</option>
                  <option value="2">2%</option>
                  <option value="5">5%</option>
                  <option value="custom">Custom</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#525252] pointer-events-none" />
              </div>
            </div>

            {/* Gas Boost */}
            <div>
              <label className="font-mono text-[10px] text-[#525252] uppercase tracking-wider mb-1.5 block">
                Gas Priority
              </label>
              <div className="flex gap-1.5">
                {gasOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setGasBoost(opt)}
                    className={cn(
                      "flex-1 h-10 rounded border font-mono text-xs uppercase tracking-wider transition-all duration-150",
                      gasBoost === opt
                        ? cn("bg-[rgba(255,255,255,0.04)]", gasColors[opt])
                        : "border-[rgba(255,255,255,0.06)] text-[#525252] hover:text-[#71717a]"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Execute Button */}
          <motion.button
            onClick={handleExecute}
            disabled={isExecuting || !contractAddress}
            className={cn(
              "w-full h-14 rounded font-mono text-base font-bold uppercase tracking-widest transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-[#ef4444]/40 focus:ring-offset-2 focus:ring-offset-[#0a0a0b]",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              isExecuting
                ? "bg-[#991b1b] text-white"
                : "bg-[#ef4444] text-white hover:bg-[#dc2626] active:bg-[#b91c1c]"
            )}
            animate={
              !isExecuting && contractAddress
                ? {
                    boxShadow: [
                      "0 0 0 0 rgba(239,68,68,0)",
                      "0 0 20px 2px rgba(239,68,68,0.3)",
                      "0 0 0 0 rgba(239,68,68,0)",
                    ],
                  }
                : {}
            }
            transition={
              !isExecuting && contractAddress
                ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                : {}
            }
          >
            {isExecuting ? (
              <span className="flex items-center justify-center gap-2">
                <Activity className="w-5 h-5 animate-pulse" />
                EXECUTING...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" />
                EXECUTE SNIPE
              </span>
            )}
          </motion.button>

          {/* Warning */}
          <p className="mt-3 font-mono text-[10px] text-[#f59e0b] text-center">
            ⚠️ Always verify the contract address. Transactions are irreversible.
          </p>
        </Card>

        {/* ===============================================================
            2. ACTIVE POSITIONS
        =============================================================== */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <LineChart className="w-4 h-4 text-[#3b82f6]" />
            <h2 className="font-mono text-sm font-bold text-[#e4e4e7] uppercase tracking-wider">
              Active Positions
            </h2>
            <Badge variant="info" size="sm">
              {MOCK_POSITIONS.length} open
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {MOCK_POSITIONS.map((pos) => {
              const isProfit = pos.pnlPercent >= 0;
              const cardBg = isProfit
                ? "bg-[rgba(16,185,129,0.03)]"
                : "bg-[rgba(239,68,68,0.03)]";
              const borderColor = isProfit
                ? "border-[rgba(16,185,129,0.12)]"
                : "border-[rgba(239,68,68,0.12)]";

              return (
                <motion.div
                  key={pos.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className={cn(cardBg, "border", borderColor)}
                    hoverable
                  >
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        {/* Token icon */}
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-[10px] font-bold text-white"
                          style={{ backgroundColor: pos.iconColor }}
                        >
                          {pos.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-mono text-sm font-medium text-[#e4e4e7]">
                            {pos.name}
                          </div>
                          <div className="font-mono text-[10px] text-[#525252]">
                            {pos.symbol} . {pos.amount} SOL
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MiniSparkline
                          data={pos.sparkline}
                          color={isProfit ? "#10b981" : "#ef4444"}
                        />
                      </div>
                    </div>

                    {/* Price row */}
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div>
                        <div className="font-mono text-[9px] text-[#525252] uppercase tracking-wider mb-0.5">
                          Entry
                        </div>
                        <div className="font-mono text-xs text-[#a1a1aa]">
                          ${pos.entryPrice.toFixed(6)}
                        </div>
                      </div>
                      <div>
                        <div className="font-mono text-[9px] text-[#525252] uppercase tracking-wider mb-0.5">
                          Current
                        </div>
                        <div
                          className={cn(
                            "font-mono text-xs font-medium",
                            isProfit ? "text-[#10b981]" : "text-[#ef4444]"
                          )}
                        >
                          ${pos.currentPrice.toFixed(6)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-[9px] text-[#525252] uppercase tracking-wider mb-0.5">
                          P&L
                        </div>
                        <div className="flex items-center justify-end gap-1">
                          {isProfit ? (
                            <TrendingUp className="w-3 h-3 text-[#10b981]" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-[#ef4444]" />
                          )}
                          <span
                            className={cn(
                              "font-mono text-xs font-bold",
                              isProfit ? "text-[#10b981]" : "text-[#ef4444]"
                            )}
                          >
                            {isProfit ? "+" : ""}
                            {pos.pnlPercent.toFixed(1)}%
                          </span>
                        </div>
                        <div
                          className={cn(
                            "font-mono text-[10px]",
                            isProfit ? "text-[#10b981]" : "text-[#ef4444]"
                          )}
                        >
                          {isProfit ? "+" : ""}
                          {pos.pnlSOL.toFixed(2)} SOL
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-1.5">
                      <Button variant="secondary" size="sm" className="flex-1 font-mono text-[10px]">
                        Sell 25%
                      </Button>
                      <Button variant="secondary" size="sm" className="flex-1 font-mono text-[10px]">
                        Sell 50%
                      </Button>
                      <Button variant="danger" size="sm" className="flex-1 font-mono text-[10px]">
                        Sell All
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="font-mono text-[10px]"
                        icon={<Target className="w-3 h-3" />}
                      >
                        TP/SL
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ===============================================================
            3. SNIPER CONFIGURATION
        =============================================================== */}
        <div>
          <button
            onClick={() => setConfigOpen(!configOpen)}
            className="flex items-center gap-2 mb-3 group"
          >
            <Settings className="w-4 h-4 text-[#71717a] group-hover:text-[#a1a1aa] transition-colors" />
            <h2 className="font-mono text-sm font-bold text-[#e4e4e7] uppercase tracking-wider group-hover:text-white transition-colors">
              ⚙️ Sniper Configuration
            </h2>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-[#525252] transition-transform duration-200",
                configOpen && "rotate-180"
              )}
            />
          </button>

          <AnimatePresence>
            {configOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <Card>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Buy Settings */}
                    <div>
                      <h3 className="font-mono text-[11px] text-[#3b82f6] uppercase tracking-wider mb-4 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        Buy Settings
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="font-mono text-[10px] text-[#525252] uppercase tracking-wider mb-1 block">
                            Default Amount (SOL)
                          </label>
                          <Input mono defaultValue="0.5" type="number" step="0.1" />
                        </div>
                        <div>
                          <label className="font-mono text-[10px] text-[#525252] uppercase tracking-wider mb-1 block">
                            Slippage Tolerance
                          </label>
                          <div className="relative">
                            <select className="w-full h-10 rounded px-3 bg-[#0a0a0b] border border-[rgba(255,255,255,0.08)] text-[#e4e4e7] font-mono text-sm focus:outline-none focus:border-[#3b82f6] appearance-none cursor-pointer">
                              <option>0.5%</option>
                              <option>1%</option>
                              <option>2%</option>
                              <option>5%</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#525252] pointer-events-none" />
                          </div>
                        </div>
                        <div>
                          <label className="font-mono text-[10px] text-[#525252] uppercase tracking-wider mb-1 block">
                            Gas Priority
                          </label>
                          <div className="relative">
                            <select className="w-full h-10 rounded px-3 bg-[#0a0a0b] border border-[rgba(255,255,255,0.08)] text-[#e4e4e7] font-mono text-sm focus:outline-none focus:border-[#3b82f6] appearance-none cursor-pointer">
                              <option>Normal</option>
                              <option>Fast</option>
                              <option>Turbo</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#525252] pointer-events-none" />
                          </div>
                        </div>
                        <div>
                          <label className="font-mono text-[10px] text-[#525252] uppercase tracking-wider mb-1 block">
                            Max Tax Acceptance
                          </label>
                          <Input mono defaultValue="15" type="number" />
                        </div>
                        <div>
                          <label className="font-mono text-[10px] text-[#525252] uppercase tracking-wider mb-1 block">
                            Min Liquidity (SOL)
                          </label>
                          <Input mono defaultValue="50" type="number" />
                        </div>
                      </div>
                    </div>

                    {/* Right: Sell Settings */}
                    <div>
                      <h3 className="font-mono text-[11px] text-[#ef4444] uppercase tracking-wider mb-4 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Sell Settings
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="font-mono text-[10px] text-[#525252] uppercase tracking-wider mb-1 block">
                            Take Profit Tiers
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="bg-[#0a0a0b] border border-[rgba(255,255,255,0.08)] rounded p-2 text-center">
                              <div className="font-mono text-[9px] text-[#525252] uppercase">
                                TP1
                              </div>
                              <div className="font-mono text-xs text-[#10b981] font-bold">
                                2×
                              </div>
                            </div>
                            <div className="bg-[#0a0a0b] border border-[rgba(255,255,255,0.08)] rounded p-2 text-center">
                              <div className="font-mono text-[9px] text-[#525252] uppercase">
                                TP2
                              </div>
                              <div className="font-mono text-xs text-[#10b981] font-bold">
                                5×
                              </div>
                            </div>
                            <div className="bg-[#0a0a0b] border border-[rgba(255,255,255,0.08)] rounded p-2 text-center">
                              <div className="font-mono text-[9px] text-[#525252] uppercase">
                                TP3
                              </div>
                              <div className="font-mono text-xs text-[#10b981] font-bold">
                                10×
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="font-mono text-[10px] text-[#525252] uppercase tracking-wider mb-1 block">
                            Stop Loss %
                          </label>
                          <Input mono defaultValue="25" type="number" />
                        </div>
                        <div>
                          <label className="font-mono text-[10px] text-[#525252] uppercase tracking-wider mb-1 block">
                            Trailing Stop %
                          </label>
                          <Input mono defaultValue="10" type="number" />
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="font-mono text-[11px] text-[#a1a1aa]">
                            Auto-sell on rug detection
                          </span>
                          <Toggle enabled={true} onToggle={() => {}} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Safety Filters */}
                  <div className="mt-6 pt-5 border-t border-[rgba(255,255,255,0.06)]">
                    <h3 className="font-mono text-[11px] text-[#f59e0b] uppercase tracking-wider mb-4 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      Safety Filters
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        { label: "Honeypot check required", checked: true },
                        { label: "Min liquidity lock 50%+", checked: true },
                        { label: "Max owner concentration 30%", checked: true },
                        { label: "Skip tokens with >20% tax", checked: false },
                        { label: "Abandon on failed tx (max 3 retries)", checked: true },
                      ].map((filter, i) => (
                        <label
                          key={i}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <div
                            className={cn(
                              "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                              filter.checked
                                ? "bg-[#3b82f6] border-[#3b82f6]"
                                : "border-[rgba(255,255,255,0.15)] group-hover:border-[rgba(255,255,255,0.3)]"
                            )}
                          >
                            {filter.checked && (
                              <CheckCircle className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="font-mono text-[11px] text-[#a1a1aa] group-hover:text-[#e4e4e7] transition-colors">
                            {filter.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <Button
                      variant="primary"
                      icon={<CheckCircle className="w-4 h-4" />}
                    >
                      Save Configuration
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ===============================================================
            4. SNIPER ANALYTICS
        =============================================================== */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-[#06b6d4]" />
            <h2 className="font-mono text-sm font-bold text-[#e4e4e7] uppercase tracking-wider">
              📊 Performance
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              {
                label: "Total Snipes",
                value: 47,
                suffix: "",
                color: "#e4e4e7",
                icon: <Zap className="w-3.5 h-3.5" />,
              },
              {
                label: "Success Rate",
                value: 72,
                suffix: "%",
                color: "#10b981",
                icon: <Target className="w-3.5 h-3.5" />,
              },
              {
                label: "Total Invested",
                value: 125,
                suffix: " SOL",
                color: "#a1a1aa",
                icon: <Wallet className="w-3.5 h-3.5" />,
              },
              {
                label: "Current Value",
                value: 198,
                suffix: " SOL",
                color: "#3b82f6",
                icon: <LineChart className="w-3.5 h-3.5" />,
              },
              {
                label: "Total P&L",
                value: 73,
                prefix: "+",
                suffix: " SOL",
                color: "#10b981",
                icon: <TrendingUp className="w-3.5 h-3.5" />,
              },
              {
                label: "Best Trade",
                value: 340,
                prefix: "+",
                suffix: "%",
                color: "#f59e0b",
                icon: <Flame className="w-3.5 h-3.5" />,
              },
            ].map((stat) => (
              <Card key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="text-[#525252]">{stat.icon}</span>
                  <span className="font-mono text-[9px] text-[#525252] uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
                <div
                  className="font-mono text-xl font-bold tabular-nums"
                  style={{ color: stat.color }}
                >
                  <CountUp
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* ===============================================================
            5. SNIPE HISTORY
        =============================================================== */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#71717a]" />
              <h2 className="font-mono text-sm font-bold text-[#e4e4e7] uppercase tracking-wider">
                📋 Execution History
              </h2>
            </div>
            <div className="flex gap-1.5">
              {(["All", "Wins", "Losses", "Pending"] as const).map((f) => (
                <Button
                  key={f}
                  variant={historyFilter === f ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setHistoryFilter(f)}
                  className="font-mono text-[10px]"
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>

          <Card className="p-0 overflow-hidden">
            <Table
              columns="120px 1fr 90px 80px 100px 80px 140px"
              dense
            >
              <TableHeader>
                <div>Time</div>
                <div>Token</div>
                <div>Type</div>
                <div className="text-right">Amount</div>
                <div className="text-right">Price</div>
                <div className="text-right">P&L</div>
                <div className="text-right">Tx</div>
              </TableHeader>

              {filteredHistory.map((entry) => {
                const isProfit = entry.pnlPercent > 0;
                return (
                  <TableRow key={entry.id}>
                    <div className="font-mono text-[11px] text-[#71717a]">
                      {timeAgo(entry.time)}
                    </div>
                    <div>
                      <div className="font-mono text-xs text-[#e4e4e7]">
                        {entry.token}
                      </div>
                      <div className="font-mono text-[10px] text-[#525252]">
                        {entry.symbol}
                      </div>
                    </div>
                    <TypeBadge type={entry.type} />
                    <TableCell align="right" mono>
                      {entry.amount} SOL
                    </TableCell>
                    <TableCell align="right" mono>
                      ${entry.price.toFixed(6)}
                    </TableCell>
                    <TableCell
                      align="right"
                      mono
                      className={isProfit ? "text-[#10b981]" : "text-[#ef4444]"}
                    >
                      {isProfit ? "+" : ""}
                      {entry.pnlPercent.toFixed(1)}%
                    </TableCell>
                    <TableCell align="right">
                      <a
                        href={`https://solscan.io/tx/${entry.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[10px] text-[#3b82f6] hover:text-[#60a5fa] transition-colors inline-flex items-center gap-1"
                      >
                        {truncateAddress(entry.txHash, 4, 4)}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </TableCell>
                  </TableRow>
                );
              })}
            </Table>
          </Card>
        </div>

        {/* ===============================================================
            6. COPY TRADE
        =============================================================== */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-[#06b6d4]" />
            <h2 className="font-mono text-sm font-bold text-[#e4e4e7] uppercase tracking-wider">
              👥 Copy Trade
            </h2>
            <div className="ml-auto flex items-center gap-2">
              <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                {copyTradeEnabled ? "Enabled" : "Disabled"}
              </span>
              <Toggle
                enabled={copyTradeEnabled}
                onToggle={() => setCopyTradeEnabled(!copyTradeEnabled)}
              />
            </div>
          </div>

          <AnimatePresence>
            {copyTradeEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <Card>
                  {/* Follow wallet input */}
                  <div className="flex gap-2 mb-4">
                    <div className="flex-1">
                      <Input
                        mono
                        placeholder="Enter wallet address to follow..."
                        value={followWalletInput}
                        onChange={(e) => setFollowWalletInput(e.target.value)}
                      />
                    </div>
                    <Button
                      variant="primary"
                      icon={<Users className="w-4 h-4" />}
                    >
                      Follow
                    </Button>
                  </div>

                  {/* Copy settings row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                    <div>
                      <label className="font-mono text-[10px] text-[#525252] uppercase tracking-wider mb-1.5 block">
                        Copy Ratio
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="10"
                          max="100"
                          defaultValue="50"
                          className="flex-1 accent-[#3b82f6]"
                        />
                        <span className="font-mono text-sm text-[#e4e4e7] w-10 text-right">
                          50%
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="font-mono text-[10px] text-[#525252] uppercase tracking-wider mb-1.5 block">
                        Max Daily Copy (SOL)
                      </label>
                      <Input mono defaultValue="10" type="number" />
                    </div>
                    <div>
                      <label className="font-mono text-[10px] text-[#525252] uppercase tracking-wider mb-1.5 block">
                        Whitelist Tokens
                      </label>
                      <Input mono placeholder="Comma-separated symbols..." />
                    </div>
                  </div>

                  {/* Followed wallets */}
                  <div className="mb-5">
                    <h3 className="font-mono text-[10px] text-[#525252] uppercase tracking-wider mb-2">
                      Followed Wallets ({MOCK_FOLLOWED.length})
                    </h3>
                    <div className="space-y-2">
                      {MOCK_FOLLOWED.map((wallet) => (
                        <div
                          key={wallet.address}
                          className="flex items-center justify-between bg-[#0a0a0b] border border-[rgba(255,255,255,0.06)] rounded p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[rgba(59,130,246,0.15)] flex items-center justify-center">
                              <Wallet className="w-4 h-4 text-[#3b82f6]" />
                            </div>
                            <div>
                              <div className="font-mono text-xs text-[#e4e4e7] font-medium">
                                {wallet.label}
                              </div>
                              <div className="font-mono text-[10px] text-[#525252]">
                                {truncateAddress(wallet.address, 6, 4)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="font-mono text-[9px] text-[#525252] uppercase">
                                Trades
                              </div>
                              <div className="font-mono text-xs text-[#a1a1aa]">
                                {wallet.trades}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="font-mono text-[9px] text-[#525252] uppercase">
                                Win Rate
                              </div>
                              <div className="font-mono text-xs text-[#10b981]">
                                {wallet.winRate}%
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="font-mono text-[9px] text-[#525252] uppercase">
                                P&L
                              </div>
                              <div className="font-mono text-xs text-[#10b981]">
                                +{wallet.pnl} SOL
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Copy trade stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[#0a0a0b] border border-[rgba(255,255,255,0.06)] rounded p-3 text-center">
                      <div className="font-mono text-[9px] text-[#525252] uppercase tracking-wider mb-1">
                        Copied Trades
                      </div>
                      <div className="font-mono text-lg font-bold text-[#e4e4e7]">
                        12
                      </div>
                    </div>
                    <div className="bg-[#0a0a0b] border border-[rgba(255,255,255,0.06)] rounded p-3 text-center">
                      <div className="font-mono text-[9px] text-[#525252] uppercase tracking-wider mb-1">
                        Wins
                      </div>
                      <div className="font-mono text-lg font-bold text-[#10b981]">
                        8
                      </div>
                    </div>
                    <div className="bg-[#0a0a0b] border border-[rgba(255,255,255,0.06)] rounded p-3 text-center">
                      <div className="font-mono text-[9px] text-[#525252] uppercase tracking-wider mb-1">
                        Copy P&L
                      </div>
                      <div className="font-mono text-lg font-bold text-[#10b981]">
                        +23 SOL
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
  );
}
