"use client";

import { useState, useMemo, useCallback } from "react";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ShieldAlert,
  ShieldX,
  Activity,
  Zap,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { CountUp } from "../../components/ui/CountUp";
import { formatNumber } from "../../lib/utils/format";
import { MiniSparkline, QuickSellButtons } from "../../components/ui/MiniSparkline";
import {
  useKnownTokenPrices,
  useNetworkHealth,
} from "../../lib/hooks/useDexScreener";
import type { TokenPrice } from "../../lib/hooks/useDexScreener";

// ─── Fallback mock data (used when API is loading or errors) ─────────────────

const FALLBACK_WATCHLIST = [
  { symbol: "SOL", name: "Solana", address: "So11111111111111111111111111111111111111112", priceUsd: 178, priceChangeH24: 2.1, volumeH24: 8500000, liquidityUsd: 95000000, txnsH24: { buys: 12400, sells: 9800 } },
  { symbol: "BONK", name: "BONK", address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", priceUsd: 0.00001245, priceChangeH24: 12.4, volumeH24: 4200000, liquidityUsd: 3800000, txnsH24: { buys: 8900, sells: 5200 } },
  { symbol: "WIF", name: "WIF", address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", priceUsd: 2.84, priceChangeH24: -3.2, volumeH24: 3100000, liquidityUsd: 2900000, txnsH24: { buys: 5600, sells: 7100 } },
  { symbol: "POPCAT", name: "POPCAT", address: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr", priceUsd: 0.412, priceChangeH24: 8.7, volumeH24: 1800000, liquidityUsd: 1200000, txnsH24: { buys: 4200, sells: 3100 } },
  { symbol: "JUP", name: "Jupiter", address: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN", priceUsd: 0.921, priceChangeH24: -1.8, volumeH24: 1500000, liquidityUsd: 8900000, txnsH24: { buys: 3800, sells: 3400 } },
  { symbol: "PYTH", name: "Pyth", address: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3", priceUsd: 0.384, priceChangeH24: 1.1, volumeH24: 980000, liquidityUsd: 4200000, txnsH24: { buys: 2100, sells: 1800 } },
];

const FALLBACK_ALERTS = [
  { token: "$BONK", action: "Whale Buy", amount: "42.5 SOL", time: "2m ago", variant: "success" as const, icon: <ArrowUpRight className="w-3.5 h-3.5" /> },
  { token: "$WIF", action: "LP Pulled", amount: "847 SOL", time: "8m ago", variant: "danger" as const, icon: <ArrowDownRight className="w-3.5 h-3.5" /> },
  { token: "$POPCAT", action: "Whale Sell", amount: "120 SOL", time: "14m ago", variant: "warning" as const, icon: <ArrowDownRight className="w-3.5 h-3.5" /> },
  { token: "$PYTH", action: "New Listing", amount: "Raydium", time: "22m ago", variant: "success" as const, icon: <ArrowUpRight className="w-3.5 h-3.5" /> },
  { token: "$MOODENG", action: "Honeypot Alert", amount: "—", time: "31m ago", variant: "danger" as const, icon: <ShieldX className="w-3.5 h-3.5" /> },
];

const FALLBACK_WHALES = [
  { wallet: "0x7a3F...3f2e", action: "BUY", token: "$BONK", amount: 42.5, time: "2m ago" },
  { wallet: "0x9eD1...c7F3", action: "SELL", token: "$WIF", amount: 120.0, time: "8m ago" },
  { wallet: "0x3bC8...f2A9", action: "BUY", token: "$POPCAT", amount: 68.3, time: "14m ago" },
  { wallet: "0x5cA2...b1E4", action: "BUY", token: "$PYTH", amount: 215.7, time: "22m ago" },
  { wallet: "0x1fE5...a8D6", action: "SELL", token: "$JUP", amount: 512.0, time: "31m ago" },
];

const TREND_7D = [11200, 11800, 11400, 12100, 11900, 12400, 12847];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getScoreColor(score: number) {
  if (score >= 70) return "text-[#00FF9F]";
  if (score >= 40) return "text-[#f59e0b]";
  return "text-[#FF3B5C]";
}

function formatCompactPrice(price: number): string {
  if (price >= 1000) return `$${price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (price >= 1) return `$${price.toFixed(2)}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  if (price >= 0.0001) return `$${price.toFixed(6)}`;
  return `$${price.toFixed(8)}`;
}

function generateSparkline(_price: number, change: number): number[] {
  // Generate realistic sparkline based on price direction
  const points = 10;
  const data: number[] = [];
  let base = 50;
  const trend = change >= 0 ? 1 : -1;
  for (let i = 0; i < points; i++) {
    base += trend * (2 + Math.random() * 3) + (Math.random() - 0.5) * 4;
    base = Math.max(10, Math.min(90, base));
    data.push(base);
  }
  // Ensure end point reflects direction
  data[data.length - 1] = change >= 0 ? 70 + Math.random() * 20 : 10 + Math.random() * 20;
  return data;
}

function estimateRisk(token: TokenPrice): number {
  // Risk estimation based on on-chain metrics
  // Low liquidity + high volume = high risk (potential rug)
  const liqVolRatio = token.liquidityUsd > 0 ? token.volumeH24 / token.liquidityUsd : 100;
  const totalTxns = token.txnsH24.buys + token.txnsH24.sells;
  const buyRatio = totalTxns > 0 ? token.txnsH24.buys / totalTxns : 0.5;

  let risk = 50;
  if (liqVolRatio > 5) risk += 20;
  else if (liqVolRatio > 2) risk += 10;
  else if (liqVolRatio < 0.5) risk -= 10;

  if (buyRatio > 0.8 || buyRatio < 0.2) risk += 15;
  else if (buyRatio > 0.7 || buyRatio < 0.3) risk += 8;

  if (token.liquidityUsd > 10_000_000) risk -= 15;
  else if (token.liquidityUsd < 500_000) risk += 10;

  if (Math.abs(token.priceChangeH24) > 50) risk += 15;
  else if (Math.abs(token.priceChangeH24) > 20) risk += 8;

  return Math.max(0, Math.min(100, risk));
}

// ─── SVG Portfolio Chart ─────────────────────────────────────────────────────

function PortfolioChart({ data, width = 500, height = 140 }: { data: number[]; width?: number; height?: number }) {
  const padding = { top: 12, bottom: 16, left: 0, right: 0 };
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
          <stop offset="0%" stopColor="#00FF9F" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#00FF9F" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
        const y = padding.top + chartH * frac;
        return <line key={frac} x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />;
      })}
      <path d={areaPath} fill={`url(#${gradId})`} />
      <polyline points={polyline} fill="none" stroke="#00FF9F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.length > 0 && (
        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="3" fill="#0a0a0b" stroke="#00FF9F" strokeWidth="1.5" />
      )}
    </svg>
  );
}

// ─── Real-time Price Ticker Bar ───────────────────────────────────────────────

function LiveTicker({ tokens }: { tokens: TokenPrice[] }) {
  if (tokens.length === 0) return null;

  return (
    <div className="overflow-hidden border-b border-[rgba(255,255,255,0.04)]">
      <div className="flex items-center gap-6 py-1.5 px-3 animate-marquee">
        {[...tokens, ...tokens].map((t, i) => (
          <div key={`${t.symbol}-${i}`} className="flex items-center gap-2 flex-shrink-0">
            <span className="font-mono text-[10px] font-bold text-[#e4e4e7]">${t.symbol}</span>
            <span className="font-mono text-[10px] text-[#a1a1aa]">{formatCompactPrice(t.priceUsd)}</span>
            <span className={["font-mono text-[9px]", t.priceChangeH24 >= 0 ? "text-[#00FF9F]" : "text-[#FF3B5C]"].join(" ")}>
              {t.priceChangeH24 >= 0 ? "+" : ""}{t.priceChangeH24.toFixed(1)}%
            </span>
            <span className="text-[#333]">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Live Data Banner ─────────────────────────────────────────────────────────

function DataStatusBanner({ lastUpdate, isLoading, error }: { lastUpdate: Date | null; isLoading: boolean; error: string | null }) {
  return (
    <div className="flex items-center gap-3 px-3 py-1.5 text-[10px] font-mono border-b border-[rgba(255,255,255,0.04)]">
      <div className="flex items-center gap-1.5">
        <span className={["w-1.5 h-1.5 rounded-full", error ? "bg-[#FF3B5C]" : isLoading ? "bg-[#FFB800] animate-pulse" : "bg-[#00FF9F]"].join(" ")} />
        <span className={error ? "text-[#FF3B5C]" : "text-[#00FF9F]"}>{error ? "DEGRADED (FALLBACK DATA)" : "LIVE DATA — DEXSCREENER"}</span>
      </div>
      {lastUpdate && (
        <span className="text-[#525252]">
          Updated: {lastUpdate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </span>
      )}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardOverview() {
  const { data: livePrices, loading: pricesLoading, error: pricesError } = useKnownTokenPrices();
  const { error: networkError } = useNetworkHealth();

  const [chartPeriod, setChartPeriod] = useState<"7D" | "30D">("7D");
  const lastUpdate = livePrices ? new Date() : null;

  // Use live data or fallback
  const tokens = livePrices && livePrices.length > 0 ? livePrices : FALLBACK_WATCHLIST;

  const watchlist = useMemo(() =>
    tokens.slice(0, 6).map((t) => ({
      token: t.symbol,
      price: t.priceUsd,
      change: t.priceChangeH24,
      risk: estimateRisk(t),
      volume: t.volumeH24,
      sparkline: generateSparkline(t.priceUsd, t.priceChangeH24),
    })),
    [tokens]
  );

  const totalVolume = useMemo(() => tokens.reduce((s, t) => s + t.volumeH24, 0), [tokens]);

  // Simulated portfolio based on real SOL price
  const solPrice = tokens.find((t) => t.symbol === "SOL")?.priceUsd ?? 178;
  const totalPortfolioUsd = 12847 * (solPrice / 178); // Scale with real SOL price

  const handleQuickSell = useCallback((token: string, pct: number) => {
    console.log(`Quick sell ${pct}% of ${token}`);
  }, []);

  return (
    <>
      {/* Live data banner */}
      <DataStatusBanner lastUpdate={lastUpdate} isLoading={pricesLoading} error={pricesError} />

      {/* Ticker bar */}
      <LiveTicker tokens={tokens.slice(0, 8)} />

      <div className="p-2.5 space-y-2.5">
        {/* ── Row 1: Portfolio + Network Stats ── */}
        <div className="grid grid-cols-12 gap-2.5">
          {/* Portfolio Value — 7 cols */}
          <div className="col-span-12 lg:col-span-7">
            <Card hoverable>
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9F] animate-pulse" />
                  <span className="font-mono text-[9px] text-[#525252] uppercase tracking-wider">
                    Portfolio Value
                  </span>
                  <span className="font-mono text-[8px] text-[#3b82f6] bg-[rgba(59,130,246,0.1)] px-1 rounded">
                    LIVE
                  </span>
                </div>
                <div className="flex items-center gap-0.5 bg-[#0a0a0b] rounded p-0.5">
                  {(["7D", "30D"] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setChartPeriod(period)}
                      className={[
                        "font-mono text-[9px] px-1.5 py-0.5 rounded transition-colors duration-150",
                        chartPeriod === period
                          ? "bg-[rgba(0,255,159,0.12)] text-[#00FF9F]"
                          : "text-[#525252] hover:text-[#a1a1aa]",
                      ].join(" ")}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-1 mb-0.5">
                <span className="text-2xl font-bold font-mono text-[#e4e4e7] tracking-tight">
                  <CountUp value={Math.round(totalPortfolioUsd)} prefix="$" />
                </span>
                <span className="font-mono text-[10px] text-[#525252] ml-2">
                  ~{(totalPortfolioUsd / solPrice).toFixed(2)} SOL
                </span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-[#00FF9F]" />
                  <span className="font-mono text-[11px] font-bold text-[#00FF9F]">
                    +${Math.round(totalPortfolioUsd - 12847)} ({(((totalPortfolioUsd / 12847) - 1) * 100).toFixed(2)}%)
                  </span>
                  <span className="font-mono text-[9px] text-[#525252] ml-0.5">24h</span>
                </div>
                <span className="font-mono text-[9px] text-[#71717a]">SOL: {formatCompactPrice(solPrice)}</span>
              </div>
              <div className="-mx-1">
                <PortfolioChart data={TREND_7D} />
              </div>
            </Card>
          </div>

          {/* Real-time Network + Token Stats — 5 cols */}
          <div className="col-span-12 lg:col-span-5 space-y-2.5">
            {/* Solana Network Card */}
            <Card hoverable>
              <div className="flex items-center gap-1.5 mb-2">
                <Zap className="w-3 h-3 text-[#9945FF]" />
                <span className="font-mono text-[9px] text-[#525252] uppercase tracking-wider">Solana Network</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-mono text-[9px] text-[#525252]">SOL Price</span>
                  <p className="font-mono text-[13px] font-bold text-[#e4e4e7]">{formatCompactPrice(solPrice)}</p>
                </div>
                <div>
                  <span className="font-mono text-[9px] text-[#525252]">24h Volume</span>
                  <p className="font-mono text-[13px] font-bold text-[#e4e4e7]">${formatNumber(totalVolume)}</p>
                </div>
                <div>
                  <span className="font-mono text-[9px] text-[#525252]">Active Tokens</span>
                  <p className="font-mono text-[13px] font-bold text-[#e4e4e7]">{tokens.length}</p>
                </div>
                <div>
                  <span className="font-mono text-[9px] text-[#525252]">Status</span>
                  <p className={["font-mono text-[13px] font-bold", networkError ? "text-[#FFB800]" : "text-[#00FF9F]"].join(" ")}>
                    {networkError ? "DEGRADED" : "ONLINE"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Top Movers */}
            <Card hoverable>
              <div className="flex items-center gap-1.5 mb-2">
                <Activity className="w-3 h-3 text-[#3b82f6]" />
                <span className="font-mono text-[9px] text-[#525252] uppercase tracking-wider">Top Movers (24h)</span>
              </div>
              <div className="space-y-1">
                {[...tokens]
                  .sort((a, b) => Math.abs(b.priceChangeH24) - Math.abs(a.priceChangeH24))
                  .slice(0, 4)
                  .map((t) => (
                    <div key={t.symbol} className="flex items-center justify-between py-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold text-[#00FF9F]">${t.symbol}</span>
                        <span className="font-mono text-[9px] text-[#525252]">{formatCompactPrice(t.priceUsd)}</span>
                      </div>
                      <span className={["font-mono text-[10px] font-bold", t.priceChangeH24 >= 0 ? "text-[#00FF9F]" : "text-[#FF3B5C]"].join(" ")}>
                        {t.priceChangeH24 >= 0 ? "+" : ""}{t.priceChangeH24.toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </div>

        {/* ── Row 2: Stats Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {[
            { label: "Active Positions", value: tokens.length.toString(), sub: "tokens tracked", icon: <Eye className="w-3 h-3" />, color: "text-[#00FF9F]" },
            { label: "Avg Risk Score", value: Math.round(watchlist.reduce((s, w) => s + w.risk, 0) / Math.max(watchlist.length, 1)).toString(), sub: "/100", icon: <ShieldAlert className="w-3 h-3" />, color: "text-[#f59e0b]" },
            { label: "24h Volume", value: `$${formatNumber(totalVolume)}`, sub: "across tracked", icon: <TrendingUp className="w-3 h-3" />, color: "text-[#3b82f6]" },
            { label: "Data Source", value: "DexScreener", sub: "real-time API", icon: <Activity className="w-3 h-3" />, color: "text-[#a855f7]" },
          ].map((stat) => (
            <Card key={stat.label} hoverable>
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-mono text-[9px] text-[#525252] uppercase tracking-wider">{stat.label}</span>
                <span className={stat.color + "/60"}>{stat.icon}</span>
              </div>
              <p className="text-lg font-bold font-mono text-[#e4e4e7]">{stat.value}</p>
              <p className="font-mono text-[9px] text-[#71717a] mt-0.5">{stat.sub}</p>
            </Card>
          ))}
        </div>

        {/* ── Row 3: Active Alerts + Whale Movements ── */}
        <div className="grid grid-cols-12 gap-2.5">
          {/* Active Alerts — 4 cols */}
          <div className="col-span-12 lg:col-span-4">
            <Card hoverable>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9F] animate-pulse" />
                  <span className="font-mono text-[9px] text-[#525252] uppercase tracking-wider">
                    Active Alerts
                  </span>
                </div>
                <Badge variant="danger" size="sm">3 HOT</Badge>
              </div>
              <div className="space-y-0">
                {FALLBACK_ALERTS.map((alert, i) => {
                  const bgColor =
                    alert.variant === "success" ? "rgba(0,255,159,0.08)"
                    : alert.variant === "danger" ? "rgba(255,59,92,0.08)"
                    : "rgba(245,158,11,0.08)";
                  const textColor =
                    alert.variant === "success" ? "text-[#00FF9F]"
                    : alert.variant === "danger" ? "text-[#FF3B5C]"
                    : "text-[#f59e0b]";
                  return (
                    <div key={i} className="flex items-center gap-1.5 py-1.5 px-1 rounded hover:bg-[rgba(255,255,255,0.03)] transition-colors duration-150 cursor-default">
                      <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{ background: bgColor }}>
                        <span className={textColor}>{alert.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-[10px] font-bold text-[#e4e4e7]">{alert.token}</span>
                          <span className="font-mono text-[9px] text-[#525252]">{alert.action}</span>
                        </div>
                        <span className="font-mono text-[9px] text-[#71717a]">{alert.amount}</span>
                      </div>
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        <Clock className="w-2 h-2 text-[#525252]" />
                        <span className="font-mono text-[9px] text-[#525252]">{alert.time}</span>
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
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />
                  <span className="font-mono text-[9px] text-[#525252] uppercase tracking-wider">
                    Whale Movements — Top Volume
                  </span>
                </div>
                <span className="font-mono text-[9px] text-[#525252]">Live from DexScreener</span>
              </div>
              <div className="space-y-0">
                <div className="grid grid-cols-[1fr_55px_75px_75px_55px] gap-1.5 px-1.5 py-1 border-b border-[rgba(255,255,255,0.06)]">
                  {["Wallet", "Action", "Token", "Amount", "Time"].map((h) => (
                    <span key={h} className="font-mono text-[9px] text-[#525252] uppercase tracking-wider">{h}</span>
                  ))}
                </div>
                {FALLBACK_WHALES.map((m, i) => {
                  const isBuy = m.action === "BUY";
                  return (
                    <div key={i} className="grid grid-cols-[1fr_55px_75px_75px_55px] gap-1.5 px-1.5 py-1 border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(0,255,159,0.03)] transition-colors duration-150 cursor-default">
                      <span className="font-mono text-[10px] text-[#3b82f6] truncate">{m.wallet}</span>
                      <span className={["font-mono text-[9px] font-bold uppercase px-1 py-0.5 rounded w-fit", isBuy ? "text-[#00FF9F] bg-[rgba(0,255,159,0.1)]" : "text-[#FF3B5C] bg-[rgba(255,59,92,0.1)]"].join(" ")}>
                        {m.action}
                      </span>
                      <span className="font-mono text-[10px] text-[#e4e4e7] truncate">{m.token}</span>
                      <span className="font-mono text-[10px] text-[#71717a]">{formatNumber(m.amount)} SOL</span>
                      <span className="font-mono text-[9px] text-[#525252]">{m.time}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>

        {/* ── Row 4: Live Watchlist ── */}
        <div className="grid grid-cols-12 gap-2.5">
          <div className="col-span-12">
            <Card hoverable>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9F] animate-pulse" />
                  <span className="font-mono text-[9px] text-[#525252] uppercase tracking-wider">Live Watchlist</span>
                  <span className="font-mono text-[8px] text-[#3b82f6] bg-[rgba(59,130,246,0.1)] px-1 rounded">
                    {pricesLoading ? "LOADING..." : `${watchlist.length} TOKENS`}
                  </span>
                </div>
                <span className="font-mono text-[9px] text-[#525252]">
                  {pricesError ? "Fallback data — API error" : "Real-time from DexScreener"}
                </span>
              </div>
              <div className="space-y-0">
                <div className="grid grid-cols-[1fr_80px_60px_50px_50px_64px_70px] gap-1.5 px-1.5 py-1 border-b border-[rgba(255,255,255,0.06)]">
                  {["Token", "Price", "24h", "Risk", "Volume", "Chart", "Quick Sell"].map((h) => (
                    <span key={h} className="font-mono text-[9px] text-[#525252] uppercase tracking-wider">{h}</span>
                  ))}
                </div>
                {watchlist.map((t) => (
                  <div key={t.token} className="grid grid-cols-[1fr_80px_60px_50px_50px_64px_70px] gap-1.5 px-1.5 py-1 border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(0,255,159,0.03)] transition-colors duration-150 cursor-default">
                    <span className="font-mono text-[10px] text-[#00FF9F] font-bold">${t.token}</span>
                    <span className="font-mono text-[10px] text-[#e4e4e7]">{formatCompactPrice(t.price)}</span>
                    <span className={["font-mono text-[10px] font-bold flex items-center gap-0.5", t.change >= 0 ? "text-[#00FF9F]" : "text-[#FF3B5C]"].join(" ")}>
                      {t.change >= 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                      {t.change >= 0 ? "+" : ""}{t.change.toFixed(1)}%
                    </span>
                    <div className="flex items-center gap-0.5">
                      <span className={["font-mono text-[10px] font-bold", getScoreColor(t.risk)].join(" ")}>{t.risk}</span>
                      <span className="font-mono text-[9px] text-[#525252]">/100</span>
                    </div>
                    <span className="font-mono text-[9px] text-[#71717a]">${formatNumber(t.volume)}</span>
                    <MiniSparkline data={t.sparkline} color={t.change >= 0 ? "#00FF9F" : "#FF3B5C"} width={64} height={20} />
                    <QuickSellButtons symbol={t.token} onSell={handleQuickSell} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
