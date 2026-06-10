"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Terminal,
  Shield,
  Zap,
  Eye,
  BarChart3,
  Bell,
  Trophy,
  ChevronRight,
  TrendingUp,
  Activity,
  AlertTriangle,
  Users,
  DollarSign,
  Target,
  Wifi,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import {
  COMPO,
  ALPHA_SCORE,
  LIVE_STATS,
  WHALE_FEEDS,
  SMART_MONEY_FEEDS,
} from "@/lib/utils/constants";
import "@/styles/terminal.css";

// ─── Navigation helper ───
function navTo(route: string) {
  window.location.hash = route;
}

// ─── Section wrapper ───
function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ─── Live Ticker Bar ───
function LiveTicker() {
  const items = [
    { token: "SOL", price: "$178.24", change: "+3.42%", up: true },
    { token: "BTC", price: "$104,891", change: "+1.28%", up: true },
    { token: "ETH", price: "$2,412", change: "-0.84%", up: false },
    { token: "BONK", price: "$0.0000142", change: "+12.3%", up: true },
    { token: "WIF", price: "$2.84", change: "-5.67%", up: false },
    { token: "JUP", price: "$0.98", change: "+8.12%", up: true },
    { token: "PYTH", price: "$0.42", change: "+1.04%", up: true },
    { token: "ORCA", price: "$3.12", change: "-2.18%", up: false },
  ];

  return (
    <div className="bg-[#0a0a0b] border-b border-[rgba(255,255,255,0.04)] overflow-hidden">
      <div className="flex items-center animate-marquee">
        {[...items, ...items].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-4 py-1.5 shrink-0"
          >
            <span className="font-mono text-[11px] text-[#71717a] font-medium">
              {item.token}
            </span>
            <span className="font-mono text-[11px] text-[#e4e4e7]">
              {item.price}
            </span>
            <span
              className={`font-mono text-[10px] ${
                item.up ? "text-[#10b981]" : "text-[#ef4444]"
              }`}
            >
              {item.change}
            </span>
            <span className="text-[#333] mx-1">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Navbar ───
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#030303]/95 backdrop-blur-md border-b border-[rgba(255,255,255,0.06)]"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-12 px-6">
        <button
          onClick={() => navTo("#/landing")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Terminal className="w-4 h-4 text-[#00ff41]" />
          <span className="font-mono font-bold text-[#00ff41] text-sm tracking-[0.15em]">
            COMPO_
          </span>
          <span className="terminal-blink text-[#00ff41] font-mono text-sm">
            █
          </span>
        </button>

        <div className="hidden md:flex items-center gap-6">
          {[
            { label: "SCANNER", route: "#/scanner" },
            { label: "WHALES", route: "#/whales" },
            { label: "SNIPER", route: "#/sniper" },
            { label: "DOCS", route: "#/docs" },
          ].map((link) => (
            <button
              key={link.label}
              onClick={() => navTo(link.route)}
              className="font-mono text-[11px] text-[#525252] hover:text-[#00ff41] transition-colors cursor-pointer tracking-wider"
            >
              [{link.label}]
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            <span className="font-mono text-[10px] text-[#525252]">
              LIVE
            </span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navTo("#/dashboard")}
          >
            ENTER TERMINAL
          </Button>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ───
function Hero() {

  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col justify-center pt-12 pb-8 overflow-hidden"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[rgba(0,255,65,0.03)] blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-6 w-full">
        {/* Alpha Score Bar — Bloomberg style */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-8 py-3 border-b border-[rgba(255,255,255,0.04)]"
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
              Alpha Score
            </span>
            <span className="font-mono text-lg font-bold text-[#00ff41]">
              {ALPHA_SCORE.score}
            </span>
            <span className="font-mono text-[10px] text-[#10b981]">
              {ALPHA_SCORE.trend}
            </span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-[rgba(255,255,255,0.06)]" />
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3 text-[#525252]" />
            <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
              Whales
            </span>
            <span className="font-mono text-sm font-bold text-[#e4e4e7]">
              <CountUp value={LIVE_STATS.whalesTracked} />
            </span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-[rgba(255,255,255,0.06)]" />
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-[#10b981]" />
            <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
              Smart Money
            </span>
            <span className="font-mono text-sm font-bold text-[#10b981]">
              {LIVE_STATS.smartMoneyFlow}
            </span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-[rgba(255,255,255,0.06)]" />
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3 h-3 text-[#f59e0b]" />
            <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
              Rugs
            </span>
            <span className="font-mono text-sm font-bold text-[#f59e0b]">
              {LIVE_STATS.rugAlerts} today
            </span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Copy — Massive hierarchy */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="mb-4"
            >
              <Badge variant="success" size="sm">
                v{COMPO.version} — MARKET WARFARE TERMINAL
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight mb-2"
            >
              <span className="text-[#e4e4e7]">SEE</span>
              <br />
              <span className="text-[#e4e4e7]">EVERYTHING</span>
              <br />
              <span className="text-[#00ff41] font-mono">BEFORE</span>
              <br />
              <span className="text-[#00ff41] font-mono">EVERYONE</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-base sm:text-lg font-mono text-[#525252] mb-2 tracking-wider uppercase"
            >
              {COMPO.subhead}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="text-[#71717a] mb-6 max-w-md text-sm leading-relaxed"
            >
              Track whales. Detect rugs. Execute faster. The command center for
              Solana market intelligence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              <Button
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={() => navTo("#/dashboard")}
              >
                ENTER TERMINAL
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => navTo("#/docs")}
              >
                READ DOCS
              </Button>
            </motion.div>

            {/* Social proof micro */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-4 mt-6"
            >
              <div className="flex items-center gap-1.5">
                <Users className="w-3 h-3 text-[#525252]" />
                <span className="font-mono text-[11px] text-[#71717a]">
                  <span className="text-[#e4e4e7] font-bold">
                    <CountUp value={LIVE_STATS.tradersCount} />
                  </span>{" "}
                  traders
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-3 h-3 text-[#525252]" />
                <span className="font-mono text-[11px] text-[#71717a]">
                  <span className="text-[#e4e4e7] font-bold">
                    {LIVE_STATS.trackedVolume}
                  </span>{" "}
                  tracked
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3 h-3 text-[#525252]" />
                <span className="font-mono text-[11px] text-[#71717a]">
                  <span className="text-[#e4e4e7] font-bold">
                    <CountUp value={LIVE_STATS.walletsMonitored} />
                  </span>{" "}
                  wallets
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right: Live Terminal — ALIVE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative"
          >
            <div className="terminal-window crt-effect">
              <div className="terminal-header">
                <div className="terminal-dot bg-[#ef4444]" />
                <div className="terminal-dot bg-[#f59e0b]" />
                <div className="terminal-dot bg-[#10b981]" />
                <span className="ml-2 text-[10px] font-mono text-[#525252]">
                  compo@live:~ — market feed
                </span>
              </div>
              <div className="p-4 space-y-3 min-h-[280px]">
                {/* Live whale feed */}
                <LiveWhaleFeed />
              </div>
            </div>

            {/* Alpha Score overlay */}
            <div className="absolute -bottom-4 -right-4 bg-[#0a0a0b] border border-[rgba(0,255,65,0.2)] rounded-lg p-3 shadow-lg shadow-[rgba(0,255,65,0.05)]">
              <p className="font-mono text-[9px] text-[#525252] uppercase tracking-wider mb-1">
                Alpha Score
              </p>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-2xl font-bold text-[#00ff41]">
                  {ALPHA_SCORE.score}
                </span>
                <span className="font-mono text-[10px] text-[#10b981]">
                  /100
                </span>
              </div>
              <p className="font-mono text-[9px] text-[#10b981] mt-0.5">
                {ALPHA_SCORE.status}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Live Whale Feed ───
function LiveWhaleFeed() {
  const [feeds, setFeeds] = useState(WHALE_FEEDS.slice(0, 5));

  useEffect(() => {
    const interval = setInterval(() => {
      setFeeds((prev) => {
        const next = [...prev];
        const randomFeed =
          WHALE_FEEDS[Math.floor(Math.random() * WHALE_FEEDS.length)];
        const now = randomFeed;
        now.time = "just now";
        next.unshift(now);
        return next.slice(0, 5);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
        <span className="font-mono text-[10px] text-[#10b981] uppercase tracking-wider">
          Live Feed
        </span>
        <span className="font-mono text-[10px] text-[#525252]">
          — Whale Movements
        </span>
      </div>
      <AnimatePresence initial={false}>
        {feeds.map((feed, i) => (
          <motion.div
            key={`${feed.addr}-${i}-${feed.time}`}
            initial={{ opacity: 0, x: -10, height: 0 }}
            animate={{ opacity: 1, x: 0, height: "auto" }}
            exit={{ opacity: 0, x: 10, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 py-1 border-b border-[rgba(255,255,255,0.03)] last:border-0"
          >
            <span
              className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                feed.type === "BUY"
                  ? "bg-[rgba(16,185,129,0.15)] text-[#10b981]"
                  : feed.type === "SELL"
                  ? "bg-[rgba(239,68,68,0.15)] text-[#ef4444]"
                  : "bg-[rgba(245,158,11,0.15)] text-[#f59e0b]"
              }`}
            >
              {feed.type}
            </span>
            <span className="font-mono text-[11px] text-[#e4e4e7]">
              {feed.amount}
            </span>
            <span className="font-mono text-[11px] text-[#3b82f6]">
              {feed.token}
            </span>
            <span className="font-mono text-[10px] text-[#525252] ml-auto">
              {feed.time}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Smart Money Section ───
function SmartMoneySection() {
  return (
    <Section id="smart-money" className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Smart Money Feed */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-[#3b82f6]" />
              <span className="font-mono text-xs text-[#3b82f6] uppercase tracking-wider">
                Smart Money Feed
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />
            </div>
            <Card className="divide-y divide-[rgba(255,255,255,0.04)]">
              {SMART_MONEY_FEEDS.map((feed, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 py-3 px-4"
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                      feed.direction === "buy"
                        ? "bg-[#10b981]"
                        : "bg-[#ef4444]"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[11px] text-[#3b82f6]">
                      {feed.label}
                    </p>
                    <p className="text-[12px] text-[#e4e4e7] mt-0.5">
                      {feed.action}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] text-[#525252] shrink-0">
                    {feed.time}
                  </span>
                </motion.div>
              ))}
            </Card>
          </div>

          {/* Stats Grid */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-[#00ff41]" />
              <span className="font-mono text-xs text-[#00ff41] uppercase tracking-wider">
                Market Intel
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Tracked Volume",
                  value: LIVE_STATS.trackedVolume,
                  icon: <DollarSign className="w-4 h-4" />,
                  color: "#00ff41",
                },
                {
                  label: "Wallets Monitored",
                  value: String(LIVE_STATS.walletsMonitored),
                  icon: <Users className="w-4 h-4" />,
                  color: "#3b82f6",
                },
                {
                  label: "Alerts Triggered",
                  value: String(LIVE_STATS.alertsTriggered),
                  icon: <Bell className="w-4 h-4" />,
                  color: "#f59e0b",
                },
                {
                  label: "Active Traders",
                  value: String(LIVE_STATS.tradersCount),
                  icon: <Target className="w-4 h-4" />,
                  color: "#10b981",
                },
              ].map((stat) => (
                <Card key={stat.label} className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ color: stat.color }}>{stat.icon}</span>
                    <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </div>
                  <p
                    className="font-mono text-xl font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.value.startsWith("$") ? stat.value : <CountUp value={parseInt(stat.value.replace(/,/g, ""))} />}
                  </p>
                </Card>
              ))}
            </div>

            {/* Whale Heatmap placeholder */}
            <Card className="mt-3 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                  Whale Activity Heatmap (24h)
                </span>
                <Badge variant="success" size="sm">LIVE</Badge>
              </div>
              <div className="grid grid-cols-12 gap-0.5">
                {Array.from({ length: 48 }, (_, i) => {
                  const intensity = Math.random();
                  const bg =
                    intensity > 0.7
                      ? "rgba(0,255,65,0.4)"
                      : intensity > 0.4
                      ? "rgba(0,255,65,0.2)"
                      : intensity > 0.2
                      ? "rgba(0,255,65,0.08)"
                      : "rgba(255,255,255,0.02)";
                  return (
                    <div
                      key={i}
                      className="aspect-[2/1] rounded-[1px]"
                      style={{ background: bg }}
                      title={`${Math.floor(i / 4)}:00 — ${Math.round(intensity * 100)}% activity`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between mt-1">
                <span className="font-mono text-[8px] text-[#333]">00:00</span>
                <span className="font-mono text-[8px] text-[#333]">12:00</span>
                <span className="font-mono text-[8px] text-[#333]">24:00</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─── Terminal Preview ───
function TerminalPreview() {
  const [active, setActive] = useState(0);
  const [executed, setExecuted] = useState(false);

  const runCommand = (idx: number) => {
    setActive(idx);
    setExecuted(false);
    setTimeout(() => setExecuted(true), 600);
  };

  const commands = [
    {
      label: "scan",
      command: "$ compo scan 6EcSoSYGxXzMrZ6r8aL2d3GtBq4iCWoLs2mHR4VjFbSbuA",
      output: (
        <div className="space-y-1">
          <p className="text-[#71717a]">Scanning token...</p>
          <p>
            <span className="text-[#3b82f6]">Risk Score:</span>{" "}
            <span className="text-[#10b981] font-bold">87/100</span> |{" "}
            <span className="text-[#10b981]">SAFE</span>
          </p>
          <p className="text-[#71717a]">
            Honeypot: <span className="text-[#10b981]">PASS</span> | LP
            Locked: <span className="text-[#10b981]">PASS</span>
          </p>
          <p className="text-[#71717a]">
            Holders: 1,247 | Top 10: 34.2% | Mint:{" "}
            <span className="text-[#10b981]">REVOKED</span>
          </p>
          <p>
            <span className="text-[#f59e0b]">Caution:</span> High
            concentration in top 5 wallets
          </p>
        </div>
      ),
    },
    {
      label: "whale",
      command: "$ compo whale --top 10",
      output: (
        <div className="space-y-1">
          <p className="text-[#71717a] mb-2">
            Top Whale Wallets (24h volume):
          </p>
          {[
            { addr: "0x7a2F...e4B1", vol: "$2.4M", change: "+12%" },
            { addr: "0x3bC8...f2A9", vol: "$1.8M", change: "+8%" },
            { addr: "0x9eD1...c7F3", vol: "$1.2M", change: "-3%" },
            { addr: "0x1fE5...a8D6", vol: "$980K", change: "+22%" },
            { addr: "0x5cA2...b1E4", vol: "$740K", change: "+5%" },
          ].map((w, i) => (
            <p key={i} className="flex gap-4 font-mono text-xs">
              <span className="text-[#525252] w-6">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[#3b82f6] w-24">{w.addr}</span>
              <span className="text-[#e4e4e7] w-16">{w.vol}</span>
              <span
                className={
                  w.change.startsWith("+")
                    ? "text-[#10b981]"
                    : "text-[#ef4444]"
                }
              >
                {w.change}
              </span>
            </p>
          ))}
        </div>
      ),
    },
    {
      label: "snipe",
      command: "$ compo snipe --token 6EcSoSYGx... --amount 0.5",
      output: (
        <div className="space-y-1">
          <p className="text-[#71717a]">Initializing snipe...</p>
          <p>
            <span className="text-[#3b82f6]">Route:</span> Jupiter →
            Raydium
          </p>
          <p>
            <span className="text-[#3b82f6]">Slippage:</span> 1.0% |{" "}
            <span className="text-[#3b82f6]">Gas:</span> 0.000005 SOL
          </p>
          <p className="text-[#10b981]">
            Executed: 0.5 SOL → 12,450 BONK
          </p>
          <p className="text-[#71717a]">
            Tx: 0x3f8a...b2c1 | Block: 284,192,447
          </p>
          <p className="text-[#00ff41] font-bold">Stonks.</p>
        </div>
      ),
    },
  ];

  return (
    <Section id="terminal" className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <p className="font-mono text-xs text-[#00ff41] mb-2">
            $ preview --interactive
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Try It Now
          </h2>
          <p className="text-[#71717a] text-sm">
            Click a command to see COMPO in action.
          </p>
        </div>

        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-dot bg-[#ef4444]" />
            <div className="terminal-dot bg-[#f59e0b]" />
            <div className="terminal-dot bg-[#10b981]" />
            <span className="ml-2 text-[10px] font-mono text-[#525252]">
              compo@demo:~
            </span>
          </div>
          <div className="p-4">
            <div className="flex gap-2 mb-4 flex-wrap">
              {commands.map((c, i) => (
                <button
                  key={c.label}
                  onClick={() => runCommand(i)}
                  className={[
                    "font-mono text-xs px-3 py-1.5 rounded transition-all cursor-pointer",
                    active === i && executed
                      ? "bg-[rgba(0,255,65,0.15)] text-[#00ff41] border border-[rgba(0,255,65,0.3)]"
                      : "bg-[rgba(255,255,255,0.04)] text-[#71717a] border border-[rgba(255,255,255,0.08)] hover:text-[#e4e4e7] hover:border-[rgba(255,255,255,0.15)]",
                  ].join(" ")}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-[#71717a] mb-3">
                  {commands[active].command}
                </p>
                {executed && (
                  <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)]">
                    {commands[active].output}
                  </div>
                )}
                {!executed && (
                  <p className="text-[#525252] font-mono text-xs mt-4">
                    Executing...
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="text-center mt-6">
          <Button
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navTo("#/dashboard")}
          >
            ENTER TERMINAL
          </Button>
        </div>
      </div>
    </Section>
  );
}

// ─── Features — Terminal Operational Style ───
const features = [
  {
    icon: <Shield className="w-5 h-5" />,
    command: "TOKEN_SCANNER",
    title: "Token Scanner",
    status: "ACTIVE",
    stats: [
      { label: "Risk Score", value: "92/100" },
      { label: "LP Locked", value: "YES" },
      { label: "Ownership", value: "RENounced" },
      { label: "Mint", value: "REVOKED" },
    ],
    route: "#/scanner",
  },
  {
    icon: <Eye className="w-5 h-5" />,
    command: "WHALE_RADAR",
    title: "Whale Radar",
    status: "TRACKING",
    stats: [
      { label: "Wallets", value: "1,203" },
      { label: "24h Volume", value: "$742M" },
      { label: "Last Move", value: "2 blocks" },
      { label: "Accuracy", value: "94%" },
    ],
    route: "#/whales",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    command: "SNIPER_ENGINE",
    title: "Sniper Engine",
    status: "ARMED",
    stats: [
      { label: "Avg Speed", value: "< 1s" },
      { label: "Success Rate", value: "87%" },
      { label: "Anti-Rug", value: "ON" },
      { label: "Copy Trade", value: "READY" },
    ],
    route: "#/sniper",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    command: "PORTFOLIO_INTEL",
    title: "Portfolio Intel",
    status: "SYNCED",
    stats: [
      { label: "Total Value", value: "$150K" },
      { label: "P&L 24h", value: "+2.0%" },
      { label: "Positions", value: "12" },
      { label: "Risk Score", value: "LOW" },
    ],
    route: "#/portfolio",
  },
  {
    icon: <Bell className="w-5 h-5" />,
    command: "ALERT_SYSTEM",
    title: "Alert System",
    status: "ONLINE",
    stats: [
      { label: "Active Alerts", value: "23" },
      { label: "Triggered", value: "89K" },
      { label: "Channels", value: "3" },
      { label: "Latency", value: "< 2s" },
    ],
    route: "#/alerts",
  },
  {
    icon: <Trophy className="w-5 h-5" />,
    command: "LEADERBOARD",
    title: "Leaderboard",
    status: "RANKING",
    stats: [
      { label: "Top Trader", value: "+340%" },
      { label: "Your Rank", value: "#47" },
      { label: "Win Rate", value: "72%" },
      { label: "Traders", value: "2,847" },
    ],
    route: "#/leaderboard",
  },
];

function Features() {
  return (
    <Section id="scanner" className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-mono text-xs text-[#00ff41] mb-2">
            $ ls modules/ --status
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Six Modules. One Terminal.
          </h2>
          <p className="text-[#71717a] text-sm">
            Every tool you need. Nothing you don't.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((f, i) => (
            <motion.div
              key={f.command}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <Card
                hoverable
                className="h-full group cursor-pointer"
                onClick={() => navTo(f.route)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[#00ff41]">{f.icon}</span>
                    <span className="font-mono text-[10px] text-[#00ff41] bg-[rgba(0,255,65,0.08)] px-2 py-0.5 rounded">
                      {f.command}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-[#10b981] bg-[rgba(16,185,129,0.1)] px-1.5 py-0.5 rounded flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-[#10b981] animate-pulse" />
                    {f.status}
                  </span>
                </div>
                <h3 className="text-base font-bold mb-3 group-hover:text-[#00ff41] transition-colors">
                  {f.title}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {f.stats.map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center justify-between"
                    >
                      <span className="font-mono text-[10px] text-[#525252]">
                        {s.label}
                      </span>
                      <span className="font-mono text-[11px] text-[#e4e4e7] font-medium">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── How It Works ───
function HowItWorks() {
  const steps = [
    {
      step: "01",
      command: "$ connect --wallet",
      title: "Connect Wallet",
      desc: "Phantom, Solflare, or any Solana wallet. One click. Non-custodial.",
    },
    {
      step: "02",
      command: "$ configure --alerts",
      title: "Set Intel",
      desc: "Whale movements, price thresholds, token deployments. Route to any channel.",
    },
    {
      step: "03",
      command: "$ execute --strategy",
      title: "Dominate",
      desc: "Snipe launches, copy-trade whales, auto TP/SL. Sub-second execution.",
    },
  ];

  return (
    <Section id="sniper" className="py-16 px-6 relative">
      <div className="absolute inset-0 bg-[rgba(0,255,65,0.01)]" />
      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-mono text-xs text-[#00ff41] mb-2">
            $ run --setup
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Three Steps. Zero BS.
          </h2>
          <p className="text-[#71717a] text-sm">
            Wallet to alpha in under 60 seconds.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="relative"
            >
              <Card className="text-center py-6">
                <div className="w-10 h-10 rounded-full border border-[#00ff41] flex items-center justify-center mx-auto mb-3">
                  <span className="font-mono text-[#00ff41] font-bold text-sm">
                    {s.step}
                  </span>
                </div>
                <p className="font-mono text-[10px] text-[#525252] mb-3">
                  {s.command}
                </p>
                <h3 className="text-base font-bold mb-1">{s.title}</h3>
                <p className="text-xs text-[#71717a] leading-relaxed">
                  {s.desc}
                </p>
              </Card>
              {i < 2 && (
                <div className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <ChevronRight className="w-5 h-5 text-[#00ff41]" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── Social Proof ───
function SocialProof() {
  const alerts = [
    {
      user: "@solwhale99",
      action: "sniped",
      token: "$MOON",
      amount: "2.1 SOL",
      time: "2 blocks ago",
    },
    {
      user: "@d3gen_queen",
      action: "flagged",
      token: "$RUGGY",
      reason: "Honeypot detected",
      time: "4 blocks ago",
    },
    {
      user: "@alpha_leaks",
      action: "tracked",
      whale: "0x7a2F...e4B1",
      movement: "+$1.2M $SOL",
      time: "6 blocks ago",
    },
    {
      user: "@bonk_hunter",
      action: "alerted",
      token: "$BONK",
      event: "Whale accumulation",
      time: "8 blocks ago",
    },
  ];

  const quotes = [
    {
      text: "I caught 3 rugs before they happened. COMPO paid for itself in 10 minutes.",
      user: "@sol_architect",
      acc: "92% accuracy",
    },
    {
      text: "The whale tracking is insane. I mirror-traded 0x7a2F and cleared 4.2 SOL profit.",
      user: "@whale_watcher",
      acc: "87% accuracy",
    },
    {
      text: '"Sub-second sniping with auto TP/SL? That\'s basically legal cheating."',
      user: "@mech_degen",
      acc: "95% accuracy",
    },
  ];

  return (
    <Section id="whale-radar" className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-mono text-xs text-[#00ff41] mb-2">
            $ tail -f alerts.log
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Live. Loud. Proven.
          </h2>
          <p className="text-[#71717a] text-sm">
            Trusted by{" "}
            <span className="text-[#00ff41] font-mono font-bold">
              <CountUp value={2847} /> traders
            </span>{" "}
            across Solana
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                <span className="font-mono text-[10px] text-[#71717a]">
                  LIVE_ALERTS
                </span>
              </div>
              <Badge variant="success" size="sm">
                STREAMING
              </Badge>
            </div>
            <div className="space-y-2">
              {alerts.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-2 py-1.5 border-b border-[rgba(255,255,255,0.03)] last:border-0"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] mt-1.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs">
                      <span className="text-[#3b82f6] font-mono">
                        {a.user}
                      </span>{" "}
                      <span className="text-[#71717a]">{a.action}</span>{" "}
                      <span className="text-[#e4e4e7] font-mono">
                        {a.token ?? a.whale}
                      </span>
                      {(a.amount || a.movement || a.reason || a.event) && (
                        <span className="text-[#71717a]">
                          {" "}
                          —{" "}
                          {a.amount ?? a.movement ?? a.reason ?? a.event}
                        </span>
                      )}
                    </p>
                    <p className="text-[9px] text-[#525252] font-mono">
                      {a.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          <div className="space-y-3">
            {quotes.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card>
                  <p className="text-[#e4e4e7] italic mb-2 text-xs leading-relaxed">
                    &ldquo;{q.text}&rdquo;
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#3b82f6]">
                      {q.user}
                    </span>
                    <Badge variant="success" size="sm">
                      {q.acc}
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─── CTA Section ───
function CTASection() {
  return (
    <section className="py-20 px-6 relative">
      <div className="absolute inset-0 bg-[rgba(0,255,65,0.02)]" />
      <div className="relative max-w-3xl mx-auto text-center">
        <p className="font-mono text-xs text-[#00ff41] mb-3">
          $ status --ready
        </p>
        <h2 className="text-3xl sm:text-4xl font-black mb-3">
          <span className="text-[#e4e4e7]">READY TO</span>{" "}
          <span className="text-[#00ff41] font-mono">SEE FIRST?</span>
        </h2>
        <p className="text-[#71717a] mb-8 max-w-md mx-auto text-sm">
          Stop being exit liquidity. Start seeing everything before everyone
          else.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navTo("#/dashboard")}
          >
            ENTER TERMINAL
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navTo("#/docs")}
          >
            VIEW DOCUMENTATION
          </Button>
        </div>
        <p className="font-mono text-[10px] text-[#333] mt-4">
          v{COMPO.version} — Solana Mainnet — No API key required for demo
        </p>
      </div>
    </section>
  );
}

// ─── Footer ───
function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.04)] py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1">
            <button
              onClick={() => navTo("#/landing")}
              className="flex items-center gap-2 mb-2 cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-[#00ff41]" />
              <span className="font-mono font-bold text-[#00ff41] text-sm">
                COMPO_
              </span>
              <span className="terminal-blink text-[#00ff41] font-mono text-sm">
                █
              </span>
            </button>
            <p className="text-xs text-[#525252] mb-2">
              Market Warfare Terminal
            </p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              <span className="font-mono text-[9px] text-[#333]">
                Solana [LIVE]
              </span>
            </div>
          </div>

          {[
            {
              title: "PRODUCT",
              links: [
                { label: "Scanner", route: "#/scanner" },
                { label: "Whale Radar", route: "#/whales" },
                { label: "Sniper", route: "#/sniper" },
                { label: "Portfolio", route: "#/portfolio" },
              ],
            },
            {
              title: "DEVELOPERS",
              links: [
                { label: "Documentation", route: "#/docs" },
                { label: "API Reference", route: "#/docs" },
                { label: "SDK", route: "#/docs" },
                { label: "Status", route: "#/docs" },
              ],
            },
            {
              title: "COMMUNITY",
              links: [
                { label: "Discord", route: "#/docs" },
                { label: "Twitter", route: "#/docs" },
                { label: "Telegram", route: "#/docs" },
                { label: "Blog", route: "#/docs" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <p className="font-mono text-[9px] text-[#333] uppercase tracking-wider mb-2">
                {col.title}
              </p>
              <ul className="space-y-1">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => navTo(link.route)}
                      className="text-xs text-[#525252] hover:text-[#00ff41] transition-colors font-mono cursor-pointer"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[rgba(255,255,255,0.03)] pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-mono text-[9px] text-[#333]">
            (c) 2026 COMPO — Market Warfare Terminal
          </p>
          <div className="flex items-center gap-3">
            {[
              { label: "Docs", route: "#/docs" },
              { label: "API", route: "#/docs" },
              { label: "Discord", route: "#/docs" },
              { label: "Twitter", route: "#/docs" },
            ].map((l) => (
              <button
                key={l.label}
                onClick={() => navTo(l.route)}
                className="font-mono text-[9px] text-[#333] hover:text-[#525252] transition-colors cursor-pointer"
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Landing Page ───
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-[#e4e4e7] overflow-x-hidden">
      <Navbar />
      <LiveTicker />
      <Hero />
      <SmartMoneySection />
      <TerminalPreview />
      <Features />
      <HowItWorks />
      <SocialProof />
      <CTASection />
      <Footer />
    </div>
  );
}
