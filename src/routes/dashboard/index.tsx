"use client";

import {
  TrendingUp,
  TrendingDown,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Search,
  ShieldAlert,
  ShieldX,
  ExternalLink,
} from "lucide-react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { CountUp } from "../../components/ui/CountUp";
import { formatNumber } from "../../lib/utils/format";

// ─── Mock data ───

const portfolioCards = [
  {
    label: "Total Portfolio Value",
    value: "$12,847",
    change: "+2.4%",
    positive: true,
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    label: "24h P&L",
    value: "+$308",
    change: "+2.46%",
    positive: true,
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    label: "Active Positions",
    value: "3",
    change: "tokens",
    positive: true,
    icon: <Eye className="w-4 h-4" />,
  },
  {
    label: "Risk Score Avg",
    value: "74/100",
    change: "MODERATE",
    positive: false,
    icon: <ShieldAlert className="w-4 h-4" />,
  },
];

const recentAlerts = [
  {
    token: "$BONK",
    action: "Whale Buy",
    amount: "42.5 SOL",
    time: "2m ago",
    variant: "success" as const,
    icon: <ArrowUpRight className="w-3.5 h-3.5" />,
  },
  {
    token: "$WIF",
    action: "LP Pulled",
    amount: "847 SOL",
    time: "8m ago",
    variant: "danger" as const,
    icon: <ArrowDownRight className="w-3.5 h-3.5" />,
  },
  {
    token: "$POPCAT",
    action: "Whale Sell",
    amount: "120 SOL",
    time: "14m ago",
    variant: "warning" as const,
    icon: <ArrowDownRight className="w-3.5 h-3.5" />,
  },
  {
    token: "$PYTH",
    action: "New Listing",
    amount: "Raydium",
    time: "22m ago",
    variant: "success" as const,
    icon: <ArrowUpRight className="w-3.5 h-3.5" />,
  },
  {
    token: "$MOODENG",
    action: "Honeypot Alert",
    amount: "—",
    time: "31m ago",
    variant: "danger" as const,
    icon: <ShieldX className="w-3.5 h-3.5" />,
  },
];

const whaleMovements = [
  {
    wallet: "0x7a3F...3f2e",
    action: "BUY",
    token: "$BONK",
    amount: 42.5,
    time: "2m ago",
  },
  {
    wallet: "0x9eD1...c7F3",
    action: "SELL",
    token: "$WIF",
    amount: 120.0,
    time: "8m ago",
  },
  {
    wallet: "0x3bC8...f2A9",
    action: "BUY",
    token: "$POPCAT",
    amount: 68.3,
    time: "14m ago",
  },
  {
    wallet: "0x5cA2...b1E4",
    action: "BUY",
    token: "$PYTH",
    amount: 215.7,
    time: "22m ago",
  },
  {
    wallet: "0x1fE5...a8D6",
    action: "SELL",
    token: "$JUP",
    amount: 512.0,
    time: "31m ago",
  },
];

const watchlist = [
  { token: "BONK", price: 0.00001245, change: 12.4, risk: 82 },
  { token: "WIF", price: 2.84, change: -3.2, risk: 91 },
  { token: "POPCAT", price: 0.412, change: 8.7, risk: 67 },
  { token: "PYTH", price: 0.384, change: 1.1, risk: 88 },
  { token: "JUP", price: 0.921, change: -1.8, risk: 85 },
];

const recentScans = [
  { address: "0x6Ec...bA12", score: 87, verdict: "SAFE" as const },
  { address: "0x2Df...e9F4", score: 94, verdict: "SAFE" as const },
  { address: "0x8Ab...c3D7", score: 34, verdict: "DANGER" as const },
  { address: "0x4Gh...f1A8", score: 56, verdict: "CAUTION" as const },
  { address: "0x9Jk...b2E5", score: 78, verdict: "SAFE" as const },
];

function getVerdictVariant(verdict: string) {
  if (verdict === "SAFE") return "success" as const;
  if (verdict === "DANGER") return "danger" as const;
  return "warning" as const;
}

function getScoreColor(score: number) {
  if (score >= 70) return "text-[#10b981]";
  if (score >= 40) return "text-[#f59e0b]";
  return "text-[#ef4444]";
}

// ─── Component ───

export default function DashboardOverview() {
  return (
    <DashboardLayout>
      <div className="p-4 space-y-4">
        {/* ── Portfolio Summary Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {portfolioCards.map((card) => (
            <Card key={card.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                  {card.label}
                </span>
                <span
                  className={
                    card.positive
                      ? "text-[#10b981]/60"
                      : "text-[#f59e0b]/60"
                  }
                >
                  {card.icon}
                </span>
              </div>
              <p className="text-xl font-bold font-mono text-[#e4e4e7]">
                {card.label === "Total Portfolio Value" ? (
                  <CountUp value={12847} prefix="$" />
                ) : card.label === "Active Positions" ? (
                  <CountUp value={3} />
                ) : (
                  card.value
                )}
              </p>
              <p
                className={[
                  "text-xs font-mono mt-1",
                  card.positive ? "text-[#10b981]" : "text-[#f59e0b]",
                ].join(" ")}
              >
                {card.change}
              </p>
            </Card>
          ))}
        </div>

        {/* ── Active Alerts + Whale Movements Row ── */}
        <div className="grid lg:grid-cols-[30%_70%] gap-3">
          {/* Active Alerts */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse" />
                <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                  Active Alerts
                </span>
              </div>
              <Badge variant="danger" size="sm">
                3 HOT
              </Badge>
            </div>
            <div className="space-y-0">
              {recentAlerts.map((alert, i) => {
                const bgColor =
                  alert.variant === "success"
                    ? "rgba(16,185,129,0.1)"
                    : alert.variant === "danger"
                      ? "rgba(239,68,68,0.1)"
                      : "rgba(245,158,11,0.1)";
                const textColor =
                  alert.variant === "success"
                    ? "text-[#10b981]"
                    : alert.variant === "danger"
                      ? "text-[#ef4444]"
                      : "text-[#f59e0b]";

                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-2.5 px-2 rounded hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                  >
                    <div
                      className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
                      style={{ background: bgColor }}
                    >
                      <span className={textColor}>{alert.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-[#e4e4e7]">
                          {alert.token}
                        </span>
                        <span className="font-mono text-[10px] text-[#525252]">
                          {alert.action}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-[#71717a]">
                        {alert.amount}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Clock className="w-3 h-3 text-[#525252]" />
                      <span className="font-mono text-[10px] text-[#525252]">
                        {alert.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Whale Movements 1h */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />
                <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                  Whale Movements — 1H
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#525252]">
                12 flagged
              </span>
            </div>
            <div className="space-y-0">
              {/* Header */}
              <div className="grid grid-cols-[1fr_60px_80px_80px_60px] gap-2 px-3 py-1.5 border-b border-[rgba(255,255,255,0.06)]">
                {["Wallet", "Action", "Token", "Amount", "Time"].map(
                  (h) => (
                    <span
                      key={h}
                      className="font-mono text-[10px] text-[#525252] uppercase tracking-wider"
                    >
                      {h}
                    </span>
                  )
                )}
              </div>
              {whaleMovements.map((m, i) => {
                const isBuy = m.action === "BUY";
                return (
                  <div
                    key={i}
                    className="grid grid-cols-[1fr_60px_80px_80px_60px] gap-2 px-3 py-2.5 border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                  >
                    <span className="font-mono text-xs text-[#3b82f6] truncate">
                      {m.wallet}
                    </span>
                    <span
                      className={[
                        "font-mono text-[10px] font-bold uppercase px-1.5 py-0.5 rounded w-fit",
                        isBuy
                          ? "text-[#10b981] bg-[rgba(16,185,129,0.12)]"
                          : "text-[#ef4444] bg-[rgba(239,68,68,0.12)]",
                      ].join(" ")}
                    >
                      {m.action}
                    </span>
                    <span className="font-mono text-xs text-[#e4e4e7] truncate">
                      {m.token}
                    </span>
                    <span className="font-mono text-xs text-[#71717a]">
                      {formatNumber(m.amount)} SOL
                    </span>
                    <span className="font-mono text-[10px] text-[#525252]">
                      {m.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* ── Watchlist + Recent Scans Row ── */}
        <div className="grid lg:grid-cols-2 gap-3">
          {/* Watchlist */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41]" />
                <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                  Watchlist
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#525252]">
                5 tokens
              </span>
            </div>
            <div className="space-y-0">
              {/* Header */}
              <div className="grid grid-cols-[1fr_100px_60px_60px] gap-2 px-3 py-1.5 border-b border-[rgba(255,255,255,0.06)]">
                {["Token", "Price", "24h", "Risk"].map((h) => (
                  <span
                    key={h}
                    className="font-mono text-[10px] text-[#525252] uppercase tracking-wider"
                  >
                    {h}
                  </span>
                ))}
              </div>
              {watchlist.map((t) => (
                <div
                  key={t.token}
                  className="grid grid-cols-[1fr_100px_60px_60px] gap-2 px-3 py-2.5 border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                >
                  <span className="font-mono text-xs text-[#00ff41] font-bold">
                    ${t.token}
                  </span>
                  <span className="font-mono text-xs text-[#e4e4e7]">
                    ${t.price.toFixed(6)}
                  </span>
                  <span
                    className={[
                      "font-mono text-xs font-bold flex items-center gap-0.5",
                      t.change >= 0 ? "text-[#10b981]" : "text-[#ef4444]",
                    ].join(" ")}
                  >
                    {t.change >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {t.change >= 0 ? "+" : ""}
                    {t.change}%
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={[
                        "font-mono text-xs font-bold",
                        getScoreColor(t.risk),
                      ].join(" ")}
                    >
                      {t.risk}
                    </span>
                    <span className="font-mono text-[10px] text-[#525252]">
                      /100
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Scans */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-[#3b82f6]" />
                <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                  Recent Scans
                </span>
              </div>
              <button className="flex items-center gap-1 text-[#3b82f6] hover:text-[#60a5fa] transition-colors">
                <span className="font-mono text-[10px]">View All</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-0">
              {/* Header */}
              <div className="grid grid-cols-[1fr_80px_100px] gap-2 px-3 py-1.5 border-b border-[rgba(255,255,255,0.06)]">
                {["Address", "Risk Score", "Verdict"].map((h) => (
                  <span
                    key={h}
                    className="font-mono text-[10px] text-[#525252] uppercase tracking-wider"
                  >
                    {h}
                  </span>
                ))}
              </div>
              {recentScans.map((s, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_80px_100px] gap-2 px-3 py-2.5 border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                >
                  <span className="font-mono text-xs text-[#3b82f6]">
                    {s.address}
                  </span>
                  <div className="flex items-center gap-1">
                    <span
                      className={[
                        "font-mono text-xs font-bold",
                        getScoreColor(s.score),
                      ].join(" ")}
                    >
                      {s.score}
                    </span>
                    <span className="font-mono text-[10px] text-[#525252]">
                      /100
                    </span>
                  </div>
                  <Badge
                    variant={getVerdictVariant(s.verdict)}
                    size="sm"
                  >
                    {s.verdict}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
