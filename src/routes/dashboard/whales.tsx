"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRightLeft,
  Flame,
  ExternalLink,
  Copy,
  Check,
  X,
  Bell,
  UserPlus,
  GitBranch,
  Eye,
  BarChart3,
  Clock,
  Wallet,
  Download,
  Zap,
  Pause,
  Play,
  Star,
  SlidersHorizontal,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { CountUp } from "../../components/ui/CountUp";
import {
  Table,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import {
  truncateAddress,
  formatNumber,
  formatSOLAmount,
  downloadCSV,
  riskColor,
} from "../../lib/utils/format";
import { cn } from "../../lib/utils/cn";

// ─── Types ───────────────────────────────────────────────────────────────────

type TxAction = "BUY" | "SELL" | "TRANSFER" | "MINT";

interface LiveTx {
  id: string;
  time: string;
  wallet: string;
  action: TxAction;
  tokenSymbol: string;
  amountSOL: number;
  txHash: string;
}

interface WhaleEntry {
  rank: number;
  wallet: string;
  volumeSOL: number;
  trades: number;
  pnlSOL: number;
  riskScore: number;
}

interface NotableMovement {
  id: string;
  icon: string;
  text: string;
  type: "info" | "warning" | "success";
  time: string;
}

interface WalletProfile {
  address: string;
  portfolioValueUSD: number;
  winRate: number;
  totalTrades: number;
  avgHoldTime: string;
  pnl7d: number;
  recentTrades: {
    time: string;
    action: TxAction;
    token: string;
    amountSOL: number;
    pnlSOL: number;
  }[];
  pnlChartData: number[];
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_LIVE_TX: LiveTx[] = [
  {
    id: "tx-1",
    time: "0.4s ago",
    wallet: "7a3F2e8b9cD1e4A6f0B3c7D2E1a8F5e9C4d6B0a3",
    action: "BUY",
    tokenSymbol: "WIF",
    amountSOL: 124.5,
    txHash: "5UfD...3kR2",
  },
  {
    id: "tx-2",
    time: "1.2s ago",
    wallet: "B5e8C1d3F7a2E0b6D4c9A8f1E3d5C7b0A2e4F6d8",
    action: "SELL",
    tokenSymbol: "BONK",
    amountSOL: 89.3,
    txHash: "8HpL...9mN4",
  },
  {
    id: "tx-3",
    time: "2.8s ago",
    wallet: "E2d4C6b8A0f3E1d5C7b9A2e4F6d0C8a1B3e5D7f9",
    action: "MINT",
    tokenSymbol: "PYTH",
    amountSOL: 12.0,
    txHash: "2WqR...7tY6",
  },
  {
    id: "tx-4",
    time: "3.5s ago",
    wallet: "9A1b3C5d7E9f1A2b4C6d8E0f2A4b6C8d0E2a4B6c",
    action: "TRANSFER",
    tokenSymbol: "SOL",
    amountSOL: 500.0,
    txHash: "4JkM...1nP8",
  },
  {
    id: "tx-5",
    time: "4.1s ago",
    wallet: "3C5d7E9f1A2b4C6d8E0f2A4b6C8d0E2a4B6c8D0e",
    action: "BUY",
    tokenSymbol: "JUP",
    amountSOL: 67.8,
    txHash: "6TrP...5sL3",
  },
  {
    id: "tx-6",
    time: "5.9s ago",
    wallet: "F0e2D4c6B8a0E2d4C6b8A0e2D4c6B8a0E2d4C6b8",
    action: "SELL",
    tokenSymbol: "WEN",
    amountSOL: 234.1,
    txHash: "9BnV...2xK7",
  },
  {
    id: "tx-7",
    time: "6.3s ago",
    wallet: "1D3e5C7b9A2e4F6d0C8a1B3e5D7f9A1b3C5d7E9f",
    action: "BUY",
    tokenSymbol: "POPCAT",
    amountSOL: 45.2,
    txHash: "3MqW...8jH5",
  },
  {
    id: "tx-8",
    time: "7.8s ago",
    wallet: "A4b6C8d0E2a4B6c8D0e2F4a6B8c0D2e4F6a8B0c2",
    action: "TRANSFER",
    tokenSymbol: "USDC",
    amountSOL: 1024.0,
    txHash: "7LsD...4rF9",
  },
  {
    id: "tx-9",
    time: "8.5s ago",
    wallet: "B7c9D1e3F5a7B9c1D3e5F7a9B1c3D5e7F9a1B3c5",
    action: "BUY",
    tokenSymbol: "DRIFT",
    amountSOL: 312.6,
    txHash: "1KpN...6hT2",
  },
  {
    id: "tx-10",
    time: "9.2s ago",
    wallet: "C0d2E4f6A8b0C2d4E6f8A0b2C4d6E8f0A2b4C6d8",
    action: "SELL",
    tokenSymbol: "PYTH",
    amountSOL: 56.4,
    txHash: "5GwR...0nM8",
  },
];

const MOCK_WHALES: WhaleEntry[] = [
  { rank: 1, wallet: "7a3F2e8b9cD1e4A6f0B3c7D2E1a8F5e9C4d6B0a3", volumeSOL: 12450, trades: 342, pnlSOL: 3240, riskScore: 85 },
  { rank: 2, wallet: "B5e8C1d3F7a2E0b6D4c9A8f1E3d5C7b0A2e4F6d8", volumeSOL: 9870, trades: 218, pnlSOL: -1250, riskScore: 35 },
  { rank: 3, wallet: "E2d4C6b8A0f3E1d5C7b9A2e4F6d0C8a1B3e5D7f9", volumeSOL: 7650, trades: 189, pnlSOL: 2180, riskScore: 72 },
  { rank: 4, wallet: "9A1b3C5d7E9f1A2b4C6d8E0f2A4b6C8d0E2a4B6c", volumeSOL: 5420, trades: 156, pnlSOL: -890, riskScore: 55 },
  { rank: 5, wallet: "3C5d7E9f1A2b4C6d8E0f2A4b6C8d0E2a4B6c8D0e", volumeSOL: 4230, trades: 97, pnlSOL: 1560, riskScore: 90 },
];

const MOCK_NOTABLE: NotableMovement[] = [
  {
    id: "n1",
    icon: "🐋",
    text: "Smart Money bought 500 SOL of WIF",
    type: "success",
    time: "2m ago",
  },
  {
    id: "n2",
    icon: "⚠️",
    text: "Known ruggers wallet active — 0x7a3...3f2e",
    type: "warning",
    time: "5m ago",
  },
  {
    id: "n3",
    icon: "💎",
    text: "New wallet accumulated 1,200 SOL in 30m",
    type: "info",
    time: "12m ago",
  },
];

const MOCK_WALLET_PROFILE: WalletProfile = {
  address: "7a3F2e8b9cD1e4A6f0B3c7D2E1a8F5e9C4d6B0a3",
  portfolioValueUSD: 284_500,
  winRate: 73.2,
  totalTrades: 1247,
  avgHoldTime: "4h 23m",
  pnl7d: 12400,
  recentTrades: [
    { time: "2m ago", action: "BUY", token: "WIF", amountSOL: 124.5, pnlSOL: 0 },
    { time: "15m ago", action: "SELL", token: "BONK", amountSOL: 89.3, pnlSOL: 12.4 },
    { time: "32m ago", action: "BUY", token: "JUP", amountSOL: 67.8, pnlSOL: -3.2 },
    { time: "1h ago", action: "SELL", token: "POPCAT", amountSOL: 45.2, pnlSOL: 8.7 },
    { time: "2h ago", action: "BUY", token: "DRIFT", amountSOL: 312.6, pnlSOL: 0 },
  ],
  pnlChartData: [120, 145, 132, 168, 155, 189, 210, 198, 234, 256, 243, 278, 265, 290, 312, 298, 324, 345, 330, 358],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getActionBadgeVariant(action: TxAction): "success" | "danger" | "info" | "warning" {
  switch (action) {
    case "BUY":
      return "success";
    case "SELL":
      return "danger";
    case "TRANSFER":
      return "info";
    case "MINT":
      return "warning";
  }
}

function getActionIcon(action: TxAction) {
  switch (action) {
    case "BUY":
      return <ArrowUpRight className="w-3 h-3" />;
    case "SELL":
      return <ArrowDownRight className="w-3 h-3" />;
    case "TRANSFER":
      return <ArrowRightLeft className="w-3 h-3" />;
    case "MINT":
      return <Flame className="w-3 h-3" />;
  }
}

function formatSOLAmountDisplay(sol: number): string {
  return formatSOLAmount(sol);
}

// ─── Copy Button Component ───────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleCopy();
      }}
      className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider transition-all duration-200 hover:bg-[rgba(0,255,65,0.1)]"
      title="Copy address"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 text-[#00ff41]" />
          <span className="text-[#00ff41]">COPIED!</span>
        </>
      ) : (
        <Copy className="w-3 h-3 text-[#525252] hover:text-[#00ff41]" />
      )}
    </button>
  );
}

// ─── PnL Mini Chart ──────────────────────────────────────────────────────────

function PnLChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 400;
  const h = 120;
  const pad = 4;

  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = pad + (1 - (v - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  });

  const linePoints = points.join(" ");
  const areaPoints = `${pad},${h - pad} ${linePoints} ${w - pad},${h - pad}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[120px]" preserveAspectRatio="none">
      <defs>
        <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map((pct) => (
        <line
          key={pct}
          x1={pad}
          y1={pad + pct * (h - pad * 2)}
          x2={w - pad}
          y2={pad + pct * (h - pad * 2)}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
        />
      ))}
      {/* Area fill */}
      <polygon points={areaPoints} fill="url(#pnlGrad)" />
      {/* Line */}
      <motion.polyline
        points={linePoints}
        fill="none"
        stroke="#10b981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      {/* End dot */}
      {data.length > 0 && (
        <motion.circle
          cx={pad + ((data.length - 1) / (data.length - 1)) * (w - pad * 2)}
          cy={pad + (1 - (data[data.length - 1] - min) / range) * (h - pad * 2)}
          r="4"
          fill="#10b981"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2, duration: 0.3 }}
        />
      )}
    </svg>
  );
}

// ─── Live Dot ────────────────────────────────────────────────────────────────

function LiveDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff41] opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff41]" />
    </span>
  );
}

// ─── Wallet Profile Modal ────────────────────────────────────────────────────

function WalletProfileModal({
  profile,
  onClose,
}: {
  profile: WalletProfile;
  onClose: () => void;
}) {
  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-[#111113] border border-[rgba(255,255,255,0.08)] rounded-lg w-full max-w-[640px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#00ff41]" />
            <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
              Wallet Profile
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[rgba(255,255,255,0.06)] transition-colors"
          >
            <X className="w-4 h-4 text-[#71717a]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-5">
          {/* Address + Copy */}
          <div className="flex items-center gap-2">
            <code className="font-mono text-xs text-[#e4e4e7] bg-[#0a0a0b] px-3 py-1.5 rounded flex-1 truncate">
              {profile.address}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(profile.address)}
              icon={<Copy className="w-3.5 h-3.5" />}
            >
              Copy
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="!p-3">
              <div className="font-mono text-[10px] text-[#525252] uppercase tracking-wider mb-1">
                Portfolio Value
              </div>
              <div className="font-mono text-lg text-[#00ff41] font-bold">
                <CountUp
                  value={profile.portfolioValueUSD}
                  prefix="$"
                  duration={1.5}
                  decimals={0}
                />
              </div>
            </Card>
            <Card className="!p-3">
              <div className="font-mono text-[10px] text-[#525252] uppercase tracking-wider mb-1">
                Win Rate
              </div>
              <div className="font-mono text-lg text-[#10b981] font-bold">
                <CountUp
                  value={profile.winRate}
                  suffix="%"
                  duration={1.2}
                  decimals={1}
                />
              </div>
            </Card>
            <Card className="!p-3">
              <div className="font-mono text-[10px] text-[#525252] uppercase tracking-wider mb-1">
                Total Trades
              </div>
              <div className="font-mono text-lg text-[#e4e4e7] font-bold">
                <CountUp value={profile.totalTrades} duration={1.2} />
              </div>
            </Card>
            <Card className="!p-3">
              <div className="font-mono text-[10px] text-[#525252] uppercase tracking-wider mb-1">
                Avg Hold Time
              </div>
              <div className="font-mono text-lg text-[#e4e4e7] font-bold">
                {profile.avgHoldTime}
              </div>
            </Card>
          </div>

          {/* P&L 7d */}
          <Card className="!p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                P&L (7d)
              </span>
              <span className="font-mono text-sm text-[#10b981] font-bold">
                +${profile.pnl7d.toLocaleString()}
              </span>
            </div>
            <PnLChart data={profile.pnlChartData} />
          </Card>

          {/* Recent Trades */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-3.5 h-3.5 text-[#525252]" />
              <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                Recent Trades
              </span>
            </div>
            <Table columns="1fr 80px 1fr 1fr 1fr" dense>
              <TableHeader>
                <span>Time</span>
                <span>Action</span>
                <span>Token</span>
                <span className="text-right">Amount</span>
                <span className="text-right">P&L</span>
              </TableHeader>
              {profile.recentTrades.map((trade, i) => (
                <TableRow key={i}>
                  <span className="font-mono text-[11px] text-[#71717a]">
                    {trade.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Badge variant={getActionBadgeVariant(trade.action)} size="sm">
                      {trade.action}
                    </Badge>
                  </span>
                  <span className="font-mono text-[11px] text-[#e4e4e7]">
                    {trade.token}
                  </span>
                  <span className="font-mono text-[11px] text-[#e4e4e7] text-right">
                    {formatSOLAmountDisplay(trade.amountSOL)}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[11px] text-right",
                      trade.pnlSOL > 0
                        ? "text-[#10b981]"
                        : trade.pnlSOL < 0
                          ? "text-[#ef4444]"
                          : "text-[#525252]"
                    )}
                  >
                    {trade.pnlSOL > 0
                      ? `+${trade.pnlSOL}`
                      : trade.pnlSOL < 0
                        ? trade.pnlSOL
                        : "—"}
                  </span>
                </TableRow>
              ))}
            </Table>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              icon={<UserPlus className="w-4 h-4" />}
            >
              Follow Wallet
            </Button>
            <Button
              variant="secondary"
              size="md"
              className="flex-1"
              icon={<Bell className="w-4 h-4" />}
            >
              Set Alert
            </Button>
            <Button
              variant="secondary"
              size="md"
              className="flex-1"
              icon={<GitBranch className="w-4 h-4" />}
            >
              Copy Trade
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function WhaleRadar() {
  const [selectedWallet, setSelectedWallet] = useState<WalletProfile | null>(null);
  const [liveTx] = useState<LiveTx[]>(MOCK_LIVE_TX);

  // Advanced filter state
  const [minBuySOL, setMinBuySOL] = useState<string>("");
  const [watchlistOnly, setWatchlistOnly] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [feedSpeed, setFeedSpeed] = useState<"realtime" | "fast" | "slow">("realtime");
  const [showFilters, setShowFilters] = useState(false);

  const handleWalletClick = useCallback((wallet: string) => {
    setSelectedWallet({
      ...MOCK_WALLET_PROFILE,
      address: wallet,
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedWallet(null);
  }, []);

  const handleExportCSV = useCallback(() => {
    downloadCSV(
      `compo-whale-movements-${new Date().toISOString().slice(0, 10)}.csv`,
      ["Time", "Wallet", "Action", "Token", "Amount (SOL)", "Tx Hash"],
      liveTx.map((tx) => [
        tx.time,
        tx.wallet,
        tx.action,
        tx.tokenSymbol,
        tx.amountSOL.toString(),
        tx.txHash,
      ])
    );
  }, [liveTx]);

  const stats = useMemo(
    () => [
      {
        label: "Active Wallets Tracked",
        value: 1247,
        icon: <Eye className="w-4 h-4 text-[#00ff41]" />,
      },
      {
        label: "Movements (24h)",
        value: 89,
        icon: <Activity className="w-4 h-4 text-[#3b82f6]" />,
      },
      {
        label: "Large Buys (>$50K)",
        value: 12,
        icon: <TrendingUp className="w-4 h-4 text-[#10b981]" />,
      },
      {
        label: "Large Sells (>$50K)",
        value: 7,
        icon: <TrendingDown className="w-4 h-4 text-[#ef4444]" />,
      },
    ],
    []
  );

  return (
    <>
    <div className="p-3 space-y-3 max-w-[1400px]">
        {/* ── 1. Stats Bar ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                  {stat.label}
                </span>
                {stat.icon}
              </div>
              <div className="font-mono text-2xl font-bold text-[#00ff41] tabular-nums">
                <CountUp value={stat.value} duration={1.2} />
              </div>
            </Card>
          ))}
        </div>

        {/* ── 2. Main Content: Live Feed + Top Movers ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          {/* ── Live Feed (60%) ── */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {!isPaused && <LiveDot />}
                  {isPaused && <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />}
                  <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                    Live Transaction Stream
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {/* Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded border font-mono text-[9px] uppercase tracking-wider transition-colors",
                      showFilters
                        ? "border-[rgba(0,255,65,0.3)] text-[#00ff41] bg-[rgba(0,255,65,0.05)]"
                        : "border-[rgba(255,255,255,0.08)] text-[#525252] hover:text-[#71717a]"
                    )}
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    Filters
                  </button>

                  {/* Speed Control */}
                  <div className="flex items-center gap-0.5 border border-[rgba(255,255,255,0.08)] rounded">
                    {(["realtime", "fast", "slow"] as const).map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setFeedSpeed(speed)}
                        className={cn(
                          "px-1.5 py-1 font-mono text-[8px] uppercase tracking-wider transition-colors",
                          feedSpeed === speed
                            ? "text-[#00ff41]"
                            : "text-[#525252] hover:text-[#71717a]",
                          speed !== "realtime" && "border-l border-[rgba(255,255,255,0.06)]"
                        )}
                      >
                        {speed === "realtime" ? "RT" : speed === "fast" ? "1x" : "0.5x"}
                      </button>
                    ))}
                  </div>

                  {/* Pause/Play */}
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className={cn(
                      "flex items-center justify-center w-7 h-7 rounded border transition-colors",
                      isPaused
                        ? "border-[rgba(245,158,11,0.3)] text-[#f59e0b] bg-[rgba(245,158,11,0.05)]"
                        : "border-[rgba(255,255,255,0.08)] text-[#525252] hover:text-[#71717a]"
                    )}
                    title={isPaused ? "Resume feed" : "Pause feed"}
                  >
                    {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                  </button>

                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-[rgba(59,130,246,0.12)] border border-[rgba(59,130,246,0.2)] text-[#3b82f6] hover:bg-[rgba(59,130,246,0.2)] transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span className="font-mono text-[9px] uppercase tracking-wider">
                      CSV
                    </span>
                  </button>
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      "font-mono text-[10px] terminal-blink font-bold",
                      isPaused ? "text-[#f59e0b]" : "text-[#00ff41]"
                    )}>
                      {isPaused ? "PAUSED" : "LIVE"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Advanced Filters Panel */}
              {showFilters && (
                <div className="mb-3 p-3 rounded border border-[rgba(255,255,255,0.06)] bg-[#0a0a0b]">
                  <div className="flex flex-wrap items-end gap-3">
                    {/* Min Buy Amount */}
                    <div>
                      <label className="font-mono text-[9px] text-[#525252] uppercase tracking-wider mb-1 block">
                        Min Buy (SOL)
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={minBuySOL}
                          onChange={(e) => setMinBuySOL(e.target.value)}
                          placeholder="e.g. 100"
                          className="w-24 h-7 px-2 rounded bg-[#111113] border border-[rgba(255,255,255,0.08)] text-[#e4e4e7] font-mono text-[11px] focus:outline-none focus:border-[#00ff41]"
                        />
                        {minBuySOL && (
                          <button
                            onClick={() => setMinBuySOL("")}
                            className="text-[#525252] hover:text-[#71717a] transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Watchlist Only Toggle */}
                    <div>
                      <label className="font-mono text-[9px] text-[#525252] uppercase tracking-wider mb-1 block">
                        Wallet Filter
                      </label>
                      <button
                        onClick={() => setWatchlistOnly(!watchlistOnly)}
                        className={cn(
                          "flex items-center gap-1.5 h-7 px-2.5 rounded border font-mono text-[10px] uppercase tracking-wider transition-colors",
                          watchlistOnly
                            ? "border-[rgba(245,158,11,0.3)] text-[#f59e0b] bg-[rgba(245,158,11,0.05)]"
                            : "border-[rgba(255,255,255,0.08)] text-[#525252] hover:text-[#71717a]"
                        )}
                      >
                        <Star className="w-3 h-3" />
                        Watchlist Only
                      </button>
                    </div>

                    {/* Active filter indicator */}
                    {(minBuySOL || watchlistOnly) && (
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse" />
                        <span className="font-mono text-[9px] text-[#00ff41]">
                          {[minBuySOL && `Buy > ${minBuySOL} SOL`, watchlistOnly && "Watchlist"].filter(Boolean).join(" · ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-0 -mx-4">
                <div className="grid grid-cols-[36px_70px_1fr_80px_70px_90px_80px_40px] gap-1 px-4 py-1 border-b border-[rgba(255,255,255,0.06)]">
                  {["", "Time", "Wallet", "Action", "Token", "Amount", "Tx", ""].map(
                    (h) => (
                      <span
                        key={h}
                        className="font-mono text-[9px] text-[#525252] uppercase tracking-wider"
                      >
                        {h}
                      </span>
                    )
                  )}
                </div>

                <div className="max-h-[480px] overflow-y-auto">
                  <AnimatePresence initial={false}>
                    {liveTx.map((tx, index) => (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.05,
                        }}
                        className="grid grid-cols-[36px_70px_1fr_80px_70px_90px_80px_40px] gap-1 px-4 py-1.5 border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(0,255,65,0.03)] transition-colors duration-150 items-center"
                      >
                        {/* Live dot */}
                        <div className="flex justify-center">
                          {index === 0 ? (
                            <LiveDot />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-[rgba(255,255,255,0.08)]" />
                          )}
                        </div>

                        {/* Time */}
                        <span className="font-mono text-[10px] text-[#525252]">
                          {tx.time}
                        </span>

                        {/* Wallet */}
                        <div className="flex items-center gap-1 min-w-0">
                          <button
                            onClick={() => handleWalletClick(tx.wallet)}
                            className="font-mono text-[11px] text-[#3b82f6] hover:text-[#60a5fa] transition-colors truncate text-left"
                          >
                            {truncateAddress(tx.wallet, 6, 4)}
                          </button>
                          <CopyButton text={tx.wallet} />
                        </div>

                        {/* Action */}
                        <span className="flex items-center gap-1">
                          <Badge variant={getActionBadgeVariant(tx.action)} size="sm">
                            <span className="flex items-center gap-0.5">
                              {getActionIcon(tx.action)}
                              {tx.action}
                            </span>
                          </Badge>
                        </span>

                        {/* Token */}
                        <span className="font-mono text-[11px] text-[#e4e4e7]">
                          {tx.tokenSymbol}
                        </span>

                        {/* Amount */}
                        <span className="font-mono text-[11px] text-[#e4e4e7] text-right">
                          {formatSOLAmountDisplay(tx.amountSOL)}
                        </span>

                        {/* Tx Hash */}
                        <a
                          href={`https://solscan.io/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[10px] text-[#3b82f6] hover:text-[#60a5fa] transition-colors truncate flex items-center gap-0.5 justify-end"
                        >
                          {tx.txHash}
                          <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                        </a>

                        {/* Quick Snipe */}
                        <button
                          className="flex items-center justify-center w-6 h-6 rounded hover:bg-[rgba(245,158,11,0.15)] transition-colors duration-150"
                          title="Quick Snipe"
                        >
                          <Zap className="w-3 h-3 text-[#f59e0b]" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </Card>
          </div>

          {/* ── Top Movers (40%) ── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Whale Leaderboard */}
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-3.5 h-3.5 text-[#00ff41]" />
                <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                  Top Whales by Volume (24h)
                </span>
              </div>

              <Table columns="36px 1fr 90px 50px 80px 60px 40px" dense>
                <TableHeader>
                  <span>#</span>
                  <span>Wallet</span>
                  <span className="text-right">Volume</span>
                  <span className="text-right">Trades</span>
                  <span className="text-right">P&L</span>
                  <span className="text-right">Risk</span>
                  <span></span>
                </TableHeader>
                {MOCK_WHALES.map((whale) => (
                  <TableRow
                    key={whale.rank}
                    onClick={() => handleWalletClick(whale.wallet)}
                  >
                    <span className="font-mono text-[11px] text-[#525252]">
                      {whale.rank}
                    </span>
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="font-mono text-[11px] text-[#3b82f6] hover:text-[#60a5fa] transition-colors truncate">
                        {truncateAddress(whale.wallet, 5, 4)}
                      </span>
                      <CopyButton text={whale.wallet} />
                    </div>
                    <span className="font-mono text-[11px] text-[#e4e4e7] text-right">
                      {formatNumber(whale.volumeSOL)} SOL
                    </span>
                    <span className="font-mono text-[11px] text-[#71717a] text-right">
                      {whale.trades}
                    </span>
                    <span
                      className={cn(
                        "font-mono text-[11px] text-right font-medium",
                        whale.pnlSOL >= 0 ? "text-[#10b981]" : "text-[#ef4444]"
                      )}
                    >
                      {whale.pnlSOL >= 0 ? "+" : ""}
                      {formatNumber(whale.pnlSOL)} SOL
                    </span>
                    <span
                      className={cn(
                        "font-mono text-[11px] text-right font-medium",
                        riskColor(whale.riskScore)
                      )}
                    >
                      {whale.riskScore}
                    </span>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center w-6 h-6 rounded hover:bg-[rgba(245,158,11,0.15)] transition-colors duration-150"
                      title="Quick Snipe"
                    >
                      <Zap className="w-3 h-3 text-[#f59e0b]" />
                    </button>
                  </TableRow>
                ))}
              </Table>
            </Card>

            {/* Notable Movements */}
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                  Notable Movements
                </span>
              </div>

              <div className="space-y-2">
                {MOCK_NOTABLE.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "flex items-start gap-2.5 p-2.5 rounded border",
                      item.type === "success"
                        ? "border-[rgba(16,185,129,0.15)] bg-[rgba(16,185,129,0.04)]"
                        : item.type === "warning"
                          ? "border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.04)]"
                          : "border-[rgba(59,130,246,0.15)] bg-[rgba(59,130,246,0.04)]"
                    )}
                  >
                    <span className="text-base flex-shrink-0 mt-px">
                      {item.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[11px] text-[#e4e4e7] leading-snug">
                        {item.text}
                      </p>
                      <span className="font-mono text-[9px] text-[#525252] mt-0.5 block">
                        {item.time}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* ── Wallet Profile Modal ── */}
      <AnimatePresence>
        {selectedWallet && (
          <WalletProfileModal
            profile={selectedWallet}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </>
  );
}
