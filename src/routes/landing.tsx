"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Terminal, Shield, Zap, Eye, BarChart3, Bell, Trophy,
  ChevronRight, TrendingUp, Activity, AlertTriangle, Users, DollarSign, Target, Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/Button.tsx";
import { Badge } from "@/components/ui/Badge.tsx";
import { CountUp } from "@/components/ui/CountUp.tsx";
import { COMPO, ALPHA_SCORE, LIVE_STATS, WHALE_FEEDS, SMART_MONEY_FEEDS } from "@/lib/utils/constants.ts";

function navTo(route: string) { window.location.hash = route; }

function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section id={id} ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.section>
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
    <nav className={["fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-16 flex items-center px-6", scrolled ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#222]" : "bg-transparent"].join(" ")}>
      <div className="max-w-[1600px] mx-auto flex items-center justify-between w-full">
        <button onClick={() => navTo("#/landing")} className="flex items-center gap-2 cursor-pointer shrink-0">
          <Terminal className="w-4 h-4 text-[#00ff9f]" />
          <span className="font-mono font-bold text-[#00ff9f] text-sm tracking-[0.15em]">COMPO_</span>
          <span className="terminal-blink text-[#00ff9f] font-mono text-sm">█</span>
        </button>
        <div className="hidden lg:flex items-center gap-8">
          {[{ label: "SCANNER", route: "#/scanner" }, { label: "WHALES", route: "#/whales" }, { label: "SNIPER", route: "#/sniper" }, { label: "DOCS", route: "#/docs" }].map((link) => (
            <button key={link.label} onClick={() => navTo(link.route)} className="font-mono text-[11px] text-[#52525b] hover:text-[#00ff9f] transition-colors cursor-pointer tracking-wider">[{link.label}]</button>
          ))}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9f] animate-pulse" />
            <span className="font-mono text-[10px] text-[#52525b]">LIVE</span>
          </div>
          <Button variant="primary" size="sm" onClick={() => navTo("#/dashboard")}>ENTER TERMINAL</Button>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ───
function Hero() {
  return (
    <section id="top" className="relative flex flex-col justify-center pt-12 pb-6 overflow-hidden" style={{ minHeight: 380 }}>
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")` }} />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[rgba(0,255,159,0.02)] blur-[120px]" />

      <div className="relative max-w-[1600px] mx-auto px-6 w-full">
        {/* Alpha Score Bar */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-4 py-2 border-b border-[#222]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Alpha Score</span>
            <span className="font-mono text-lg font-bold text-[#00ff9f]">{ALPHA_SCORE.score}</span>
            <span className="font-mono text-[10px] text-[#00ff9f]">{ALPHA_SCORE.trend}</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-[#222]" />
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3 text-[#52525b]" />
            <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Whales</span>
            <span className="font-mono text-sm font-bold text-white"><CountUp value={LIVE_STATS.whalesTracked} /></span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-[#222]" />
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-[#00ff9f]" />
            <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Smart Money</span>
            <span className="font-mono text-sm font-bold text-[#00ff9f]">{LIVE_STATS.smartMoneyFlow}</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-[#222]" />
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3 h-3 text-[#f59e0b]" />
            <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Rugs</span>
            <span className="font-mono text-sm font-bold text-[#f59e0b]">{LIVE_STATS.rugAlerts} today</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 items-center">
          {/* Left: Copy */}
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mb-4">
              <Badge variant="success" size="sm">v{COMPO.version} — MARKET WARFARE TERMINAL</Badge>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight mb-2">
              <span className="text-white">SEE</span><br />
              <span className="text-white">EVERYTHING</span><br />
              <span className="text-[#00ff9f] font-mono">BEFORE</span><br />
              <span className="text-[#00ff9f] font-mono">EVERYONE</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.4 }} className="text-base sm:text-lg font-mono text-[#52525b] mb-2 tracking-wider uppercase">{COMPO.subhead}</motion.p>
            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }} className="text-[#52525b] mb-4 max-w-md text-sm leading-relaxed">Track whales. Detect rugs. Execute faster. The command center for Solana market intelligence.</motion.p>
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.4 }} className="flex flex-wrap gap-3">
              <Button size="lg" icon={<ArrowRight className="w-4 h-4" />} onClick={() => navTo("#/dashboard")}>ENTER TERMINAL</Button>
              <Button variant="ghost" size="lg" onClick={() => navTo("#/docs")}>READ DOCS</Button>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-1.5"><Users className="w-3 h-3 text-[#52525b]" /><span className="font-mono text-[11px] text-[#52525b]"><span className="text-white font-bold"><CountUp value={LIVE_STATS.tradersCount} /></span> traders</span></div>
              <div className="flex items-center gap-1.5"><DollarSign className="w-3 h-3 text-[#52525b]" /><span className="font-mono text-[11px] text-[#52525b]"><span className="text-white font-bold">{LIVE_STATS.trackedVolume}</span> tracked</span></div>
              <div className="flex items-center gap-1.5"><Wifi className="w-3 h-3 text-[#52525b]" /><span className="font-mono text-[11px] text-[#52525b]"><span className="text-white font-bold"><CountUp value={LIVE_STATS.walletsMonitored} /></span> wallets</span></div>
            </motion.div>
          </div>

          {/* Right: Live Terminal */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }} className="relative">
            <div className="bg-[#161616] border border-[#222] rounded-xl overflow-hidden" style={{ height: 320 }}>
              <div className="flex items-center gap-2 px-4 py-2 border-b border-[#222]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff3b5c]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#00ff9f]" />
                <span className="ml-2 text-[10px] font-mono text-[#52525b]">compo@live:~ — market feed</span>
              </div>
              <div className="p-4 space-y-2">
                <LiveWhaleFeed />
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-[#161616] border border-[#00ff9f]/20 rounded-lg p-3">
              <p className="font-mono text-[9px] text-[#52525b] uppercase tracking-wider mb-1">Alpha Score</p>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-2xl font-bold text-[#00ff9f]">{ALPHA_SCORE.score}</span>
                <span className="font-mono text-[10px] text-[#00ff9f]">/100</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function LiveWhaleFeed() {
  const [feeds, setFeeds] = useState(WHALE_FEEDS.slice(0, 5));
  useEffect(() => {
    const interval = setInterval(() => {
      setFeeds((prev) => {
        const next = [...prev];
        const randomFeed = WHALE_FEEDS[Math.floor(Math.random() * WHALE_FEEDS.length)];
        next.unshift({ ...randomFeed, time: "just now" });
        return next.slice(0, 5);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9f] animate-pulse" />
        <span className="font-mono text-[10px] text-[#00ff9f] uppercase tracking-wider">Live Feed — Whale Movements</span>
      </div>
      <AnimatePresence initial={false}>
        {feeds.map((feed, i) => (
          <motion.div key={`${feed.addr}-${i}-${feed.time}`} initial={{ opacity: 0, x: -10, height: 0 }} animate={{ opacity: 1, x: 0, height: "auto" }} exit={{ opacity: 0, x: 10, height: 0 }} transition={{ duration: 0.3 }} className="flex items-center gap-2 py-1 border-b border-[#222] last:border-0">
            <span className={["font-mono text-[10px] font-bold px-1.5 py-0.5 rounded", feed.type === "BUY" ? "bg-[#00ff9f]/10 text-[#00ff9f]" : feed.type === "SELL" ? "bg-[#ff3b5c]/10 text-[#ff3b5c]" : "bg-[#f59e0b]/10 text-[#f59e0b]"].join(" ")}>{feed.type}</span>
            <span className="font-mono text-[11px] text-white">{feed.amount}</span>
            <span className="font-mono text-[11px] text-[#3b82f6]">{feed.token}</span>
            <span className="font-mono text-[10px] text-[#52525b] ml-auto">{feed.time}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Modules ───
function Modules() {
  const modules = [
    { eyebrow: "TOKEN_SCANNER", title: "Scanner", desc: "12-point contract analysis. Honeypot detection. Liquidity verification.", tags: ["RISK SCORE", "HONEYPOT", "LP AUDIT"], icon: <Shield className="w-5 h-5 text-[#00ff9f]" /> },
    { eyebrow: "WHALE_RADAR", title: "Whale Radar", desc: "Real-time whale transaction tracking. Smart Money flow detection.", tags: ["REAL-TIME", "WALLET LABELS", "ALERTS"], icon: <Eye className="w-5 h-5 text-[#3b82f6]" /> },
    { eyebrow: "SNIPER_ENGINE", title: "Sniper", desc: "Fast DEX execution. MEV-resistant. One-click buy/sell.", tags: ["QUICK SNIPING", "RAYDIUM", "JUPITER"], icon: <Zap className="w-5 h-5 text-[#f59e0b]" /> },
    { eyebrow: "PORTFOLIO_INTEL", title: "Portfolio", desc: "Wallets tracking. P&L calculation. Risk exposure monitoring.", tags: ["P&L", "RISK SCORE", "ALERTS"], icon: <BarChart3 className="w-5 h-5 text-[#a855f7]" /> },
    { eyebrow: "ALERT_SYSTEM", title: "Alerts", desc: "Price triggers. Volume spikes. Contract warnings.", tags: ["PRICE", "VOLUME", "CONTRACT"], icon: <Bell className="w-5 h-5 text-[#ff3b5c]" /> },
    { eyebrow: "LEADERBOARD", title: "Leaderboard", desc: "Ranked traders. Performance tracking. Alpha attribution.", tags: ["TRADERS", "P&L", "VERIFIED"], icon: <Trophy className="w-5 h-5 text-[#00ff9f]" /> },
  ];

  return (
    <Section id="modules" className="py-10 px-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-[#00ff9f]" />
          <span className="font-mono text-xs text-[#00ff9f] uppercase tracking-wider">Terminal Modules</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {modules.map((m) => (
            <div key={m.eyebrow} className="bg-[#161616] border border-[#222] rounded-xl p-4 hover:border-[#00ff9f]/30 transition-colors group">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] text-[#00ff9f] uppercase tracking-wider">{m.eyebrow}</span>
                {m.icon}
              </div>
              <h3 className="font-mono text-base font-bold text-white mb-2">{m.title}</h3>
              <p className="text-[12px] text-[#52525b] leading-relaxed mb-3">{m.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {m.tags.map((t) => (
                  <span key={t} className="border border-[#222] text-[#52525b] font-mono text-[9px] px-2 py-0.5 rounded">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── Footer ───
function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-[#222]">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-wrap gap-8 mb-4">
          <div>
            <div className="font-mono text-sm text-[#00ff9f] mb-1">&gt;_ COMPO_</div>
            <div className="font-mono text-[10px] text-[#52525b]">Solana Intelligence Terminal</div>
          </div>
          <div>
            <h4 className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider mb-3">Product</h4>
            <div className="space-y-1.5">
              {["Scanner", "Whale Radar", "Sniper", "Portfolio", "Alerts"].map((l) => (
                <button key={l} className="block font-mono text-[11px] text-[#52525b] hover:text-white transition-colors">{l}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider mb-3">Resources</h4>
            <div className="space-y-1.5">
              {["Docs", "API", "Changelog"].map((l) => (
                <button key={l} className="block font-mono text-[11px] text-[#52525b] hover:text-white transition-colors">{l}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider mb-3">Community</h4>
            <div className="space-y-1.5">
              {["Telegram", "Twitter", "Discord"].map((l) => (
                <button key={l} className="block font-mono text-[11px] text-[#52525b] hover:text-white transition-colors">{l}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="font-mono text-[9px] text-[#52525b] text-center">© 2026 COMPO. All rights reserved.</div>
      </div>
    </footer>
  );
}

// ─── Landing Page ───
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <Hero />
      <Modules />
      <Footer />
    </div>
  );
}
