"use client";

import { useState, useMemo } from "react";
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

// ─── Constants ───

const SOL_PRICE = 178;
const TOTAL_PORTFOLIO_USD = 12847;
const TOTAL_PORTFOLIO_SOL = TOTAL_PORTFOLIO_USD / SOL_PRICE;
const PNL_24H_USD = 308;
const PNL_24H_PCT = 2.46;

// 7-day portfolio trend (ending at TOTAL_PORTFOLIO_USD)
const TREND_7D = [11200, 11800, 11400, 12100, 11900, 12400, 12847];
const TREND_30D = [
  9800, 10200, 9600, 10800, 11200, 10600, 11000,
  11400, 11100, 11800, 12200, 11600, 12000, 12400,
  11900, 12100, 12600, 12300, 11800, 12200, 12700,
  12400, 12100, 12500, 12800, 12300, 12600, 12900,
  12700, 12847,
];

const TOKEN_ALLOCATION = [
  { name: "SOL", pct: 35, color: "#9945FF" },
  { name: "ETH", pct: 20, color: "#627EEA" },
  { name: "BTC", pct: 15, color: "#F7931A" },
  { name: "BNB", pct: 10, color: "#F3BA2F" },
  { name: "JUP", pct: 8, color: "#00ff41" },
  { name: "WIF", pct: 7, color: "#FF6B6B" },
  { name: "USDC", pct: 5, color: "#2775CA" },
];

const recentAlerts = [
  { token: "$BONK", action: "Whale Buy", amount: "42.5 SOL", time: "2m ago", variant: "success" as const, icon: <ArrowUpRight className="w-3.5 h-3.5" /> },
  { token: "$WIF", action: "LP Pulled", amount: "847 SOL", time: "8m ago", variant: "danger" as const, icon: <ArrowDownRight className="w-3.5 h-3.5" /> },
  { token: "$POPCAT", action: "Whale Sell", amount: "120 SOL", time: "14m ago", variant: "warning" as const, icon: <ArrowDownRight className="w-3.5 h-3.5" /> },
  { token: "$PYTH", action: "New Listing", amount: "Raydium", time: "22m ago", variant: "success" as const, icon: <ArrowUpRight className="w-3.5 h-3.5" /> },
  { token: "$MOODENG", action: "Honeypot Alert", amount: "—", time: "31m ago", variant: "danger" as const, icon: <ShieldX className="w-3.5 h-3.5" /> },
];

const whaleMovements = [
  { wallet: "0x7a3F...3f2e", action: "BUY", token: "$BONK", amount: 42.5, time: "2m ago" },
  { wallet: "0x9eD1...c7F3", action: "SELL", token: "$WIF", amount: 120.0, time: "8m ago" },
  { wallet: "0x3bC8...f2A9", action: "BUY", token: "$POPCAT", amount: 68.3, time: "14m ago" },
  { wallet: "0x5cA2...b1E4", action: "BUY", token: "$PYTH", amount: 215.7, time: "22m ago" },
  { wallet: "0x1fE5...a8D6", action: "SELL", token: "$JUP", amount: 512.0, time: "31m ago" },
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

// ─── Helpers ───

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

// ─── SVG Line Chart ───

function PortfolioChart({ data, width = 500, height = 160 }: { data: number[]; width?: number; height?: number }) {
  const padding = { top: 16, bottom: 20, left: 0, right: 0 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;

  const points = data.map((v, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartW,
    y: padding.top + chartH - ((v - minVal) / range) * chartH,
  }));

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPath = `${polyline} ${points[points.length - 1].x},${height - padding.bottom} ${points[0].x},${height - padding.bottom} Z`;

  const gradId = useMemo(() => `chartGrad-${Math.random().toString(36).slice(2, 8)}`, []);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00ff41" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#00ff41" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
        const y = padding.top + chartH * frac;
        return (
          <line key={frac} x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        );
      })}
      {/* Area fill */}
      <path d={areaPath} fill={`url(#${gradId})`} />
      {/* Line */}
      <polyline points={polyline} fill="none" stroke="#00ff41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Data points */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#030303" stroke="#00ff41" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

// ─── SVG Donut Chart ───

function DonutChart({ size = 180, strokeWidth = 28 }: { size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let cumulativeOffset = 0;

  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} className="flex-shrink-0">
        <defs>
          <filter id="donutGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {TOKEN_ALLOCATION.map((token) => {
          const dashLength = (token.pct / 100) * circumference;
          const dashOffset = -cumulativeOffset;
          cumulativeOffset += dashLength;
          return (
            <circle
              key={token.name}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={token.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              filter="url(#donutGlow)"
              style={{ transition: "stroke-dasharray 0.3s ease" }}
            />
          );
        })}
        {/* Center text */}
        <text x={center} y={center - 6} textAnchor="middle" className="fill-[#e4e4e7] text-[15px] font-bold font-mono">
          ${formatNumber(TOTAL_PORTFOLIO_USD)}
        </text>
        <text x={center} y={center + 12} textAnchor="middle" className="fill-[#525252] text-[10px] font-mono">
          Total Value
        </text>
      </svg>
      {/* Legend */}
      <div className="space-y-1.5">
        {TOKEN_ALLOCATION.map((token) => (
          <div key={token.name} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: token.color }} />
            <span className="font-mono text-[11px] text-[#a1a1aa] w-10">{token.name}</span>
            <span className="font-mono text-[11px] text-[#e4e4e7] font-bold w-8 text-right">{token.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Component ───

export default function DashboardOverview() {
  const [chartPeriod, setChartPeriod] = useState<"7D" | "30D">("7D");
  const chartData = chartPeriod === "7D" ? TREND_7D : TREND_30D;

  return (
    <DashboardLayout>
      <div className="p-3 space-y-3">
        {/* ── Row 1: Portfolio Value + Token Allocation ── */}
        <div className="grid grid-cols-12 gap-3">
          {/* Portfolio Value Card — 7 cols */}
          <div className="col-span-12 lg:col-span-7">
            <Card hoverable>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse" />
                  <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                    Portfolio Value
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-[#0a0a0b] rounded p-0.5">
                  {(["7D", "30D"] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setChartPeriod(period)}
                      className={[
                        "font-mono text-[10px] px-2 py-0.5 rounded transition-colors duration-150",
                        chartPeriod === period
                          ? "bg-[rgba(0,255,65,0.15)] text-[#00ff41]"
                          : "text-[#525252] hover:text-[#a1a1aa]",
                      ].join(" ")}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* Big value */}
              <div className="mt-2 mb-0.5">
                <span className="text-3xl font-bold font-mono text-[#e4e4e7] tracking-tight">
                  <CountUp value={TOTAL_PORTFOLIO_USD} prefix="$" />
                </span>
                <span className="font-mono text-xs text-[#525252] ml-2">
                  ≈ {TOTAL_PORTFOLIO_SOL.toFixed(2)} SOL
                </span>
              </div>

              {/* P&L row */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  {PNL_24H_USD >= 0 ? (
                    <TrendingUp className="w-3.5 h-3.5 text-[#10b981]" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-[#ef4444]" />
                  )}
                  <span className={["font-mono text-xs font-bold", PNL_24H_USD >= 0 ? "text-[#10b981]" : "text-[#ef4444]"].join(" ")}>
                    {PNL_24H_USD >= 0 ? "+" : ""}${PNL_24H_USD} ({PNL_24H_PCT >= 0 ? "+" : ""}{PNL_24H_PCT}%)
                  </span>
                  <span className="font-mono text-[10px] text-[#525252] ml-1">24h</span>
                </div>
                <span className="font-mono text-[10px] text-[#71717a]">High: $13,200</span>
                <span className="font-mono text-[10px] text-[#71717a]">Low: $11,200</span>
              </div>

              {/* Chart */}
              <div className="-mx-1">
                <PortfolioChart data={chartData} />
              </div>
            </Card>
          </div>

          {/* Token Allocation Donut — 5 cols */}
          <div className="col-span-12 lg:col-span-5">
            <Card hoverable>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                  Token Allocation
                </span>
              </div>
              <DonutChart />
            </Card>
          </div>
        </div>

        {/* ── Row 2: Stats Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Active Positions", value: "3", sub: "tokens", icon: <Eye className="w-3.5 h-3.5" />, color: "text-[#00ff41]" },
            { label: "Risk Score Avg", value: "74", sub: "/100 MODERATE", icon: <ShieldAlert className="w-3.5 h-3.5" />, color: "text-[#f59e0b]" },
            { label: "24h Volume", value: "$2,340", sub: "across 3 tokens", icon: <TrendingUp className="w-3.5 h-3.5" />, color: "text-[#3b82f6]" },
            { label: "Whale Alerts", value: "12", sub: "last 1h", icon: <ArrowUpRight className="w-3.5 h-3.5" />, color: "text-[#a855f7]" },
          ].map((stat) => (
            <Card key={stat.label} hoverable>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">{stat.label}</span>
                <span className={stat.color + "/60"}>{stat.icon}</span>
              </div>
              <p className="text-xl font-bold font-mono text-[#e4e4e7]">{stat.value}</p>
              <p className="font-mono text-[10px] text-[#71717a] mt-0.5">{stat.sub}</p>
            </Card>
          ))}
        </div>

        {/* ── Row 3: Active Alerts + Whale Movements ── */}
        <div className="grid grid-cols-12 gap-3">
          {/* Active Alerts — 4 cols */}
          <div className="col-span-12 lg:col-span-4">
            <Card hoverable>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse" />
                  <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                    Active Alerts
                  </span>
                </div>
                <Badge variant="danger" size="sm">3 HOT</Badge>
              </div>
              <div className="space-y-0">
                {recentAlerts.map((alert, i) => {
                  const bgColor =
                    alert.variant === "success" ? "rgba(16,185,129,0.1)"
                    : alert.variant === "danger" ? "rgba(239,68,68,0.1)"
                    : "rgba(245,158,11,0.1)";
                  const textColor =
                    alert.variant === "success" ? "text-[#10b981]"
                    : alert.variant === "danger" ? "text-[#ef4444]"
                    : "text-[#f59e0b]";
                  return (
                    <div key={i} className="flex items-center gap-2 py-2 px-1.5 rounded hover:bg-[rgba(255,255,255,0.02)] transition-colors duration-150">
                      <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0" style={{ background: bgColor }}>
                        <span className={textColor}>{alert.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-[11px] font-bold text-[#e4e4e7]">{alert.token}</span>
                          <span className="font-mono text-[10px] text-[#525252]">{alert.action}</span>
                        </div>
                        <span className="font-mono text-[10px] text-[#71717a]">{alert.amount}</span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Clock className="w-2.5 h-2.5 text-[#525252]" />
                        <span className="font-mono text-[10px] text-[#525252]">{alert.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Whale Movements — 8 cols */}
          <div className="col-span-12 lg:col-span-8">
            <Card hoverable>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />
                  <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                    Whale Movements — 1H
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#525252]">12 flagged</span>
              </div>
              <div className="space-y-0">
                <div className="grid grid-cols-[1fr_60px_80px_80px_60px] gap-2 px-2 py-1 border-b border-[rgba(255,255,255,0.06)]">
                  {["Wallet", "Action", "Token", "Amount", "Time"].map((h) => (
                    <span key={h} className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">{h}</span>
                  ))}
                </div>
                {whaleMovements.map((m, i) => {
                  const isBuy = m.action === "BUY";
                  return (
                    <div key={i} className="grid grid-cols-[1fr_60px_80px_80px_60px] gap-2 px-2 py-1.5 border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)] transition-colors duration-150">
                      <span className="font-mono text-[11px] text-[#3b82f6] truncate">{m.wallet}</span>
                      <span className={["font-mono text-[10px] font-bold uppercase px-1.5 py-0.5 rounded w-fit", isBuy ? "text-[#10b981] bg-[rgba(16,185,129,0.12)]" : "text-[#ef4444] bg-[rgba(239,68,68,0.12)]"].join(" ")}>
                        {m.action}
                      </span>
                      <span className="font-mono text-[11px] text-[#e4e4e7] truncate">{m.token}</span>
                      <span className="font-mono text-[11px] text-[#71717a]">{formatNumber(m.amount)} SOL</span>
                      <span className="font-mono text-[10px] text-[#525252]">{m.time}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>

        {/* ── Row 4: Watchlist + Recent Scans ── */}
        <div className="grid grid-cols-12 gap-3">
          {/* Watchlist — 7 cols */}
          <div className="col-span-12 lg:col-span-7">
            <Card hoverable>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41]" />
                  <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">Watchlist</span>
                </div>
                <span className="font-mono text-[10px] text-[#525252]">5 tokens</span>
              </div>
              <div className="space-y-0">
                <div className="grid grid-cols-[1fr_100px_60px_60px] gap-2 px-2 py-1 border-b border-[rgba(255,255,255,0.06)]">
                  {["Token", "Price", "24h", "Risk"].map((h) => (
                    <span key={h} className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">{h}</span>
                  ))}
                </div>
                {watchlist.map((t) => (
                  <div key={t.token} className="grid grid-cols-[1fr_100px_60px_60px] gap-2 px-2 py-1.5 border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)] transition-colors duration-150">
                    <span className="font-mono text-[11px] text-[#00ff41] font-bold">${t.token}</span>
                    <span className="font-mono text-[11px] text-[#e4e4e7]">${t.price.toFixed(6)}</span>
                    <span className={["font-mono text-[11px] font-bold flex items-center gap-0.5", t.change >= 0 ? "text-[#10b981]" : "text-[#ef4444]"].join(" ")}>
                      {t.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {t.change >= 0 ? "+" : ""}{t.change}%
                    </span>
                    <div className="flex items-center gap-1">
                      <span className={["font-mono text-[11px] font-bold", getScoreColor(t.risk)].join(" ")}>{t.risk}</span>
                      <span className="font-mono text-[10px] text-[#525252]">/100</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Scans — 5 cols */}
          <div className="col-span-12 lg:col-span-5">
            <Card hoverable>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-[#3b82f6]" />
                  <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">Recent Scans</span>
                </div>
                <button className="flex items-center gap-1 text-[#3b82f6] hover:text-[#60a5fa] transition-colors duration-150">
                  <span className="font-mono text-[10px]">View All</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-0">
                <div className="grid grid-cols-[1fr_80px_100px] gap-2 px-2 py-1 border-b border-[rgba(255,255,255,0.06)]">
                  {["Address", "Risk Score", "Verdict"].map((h) => (
                    <span key={h} className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">{h}</span>
                  ))}
                </div>
                {recentScans.map((s, i) => (
                  <div key={i} className="grid grid-cols-[1fr_80px_100px] gap-2 px-2 py-1.5 border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)] transition-colors duration-150">
                    <span className="font-mono text-[11px] text-[#3b82f6]">{s.address}</span>
                    <div className="flex items-center gap-1">
                      <span className={["font-mono text-[11px] font-bold", getScoreColor(s.score)].join(" ")}>{s.score}</span>
                      <span className="font-mono text-[10px] text-[#525252]">/100</span>
                    </div>
                    <Badge variant={getVerdictVariant(s.verdict)} size="sm">{s.verdict}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
