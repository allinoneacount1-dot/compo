"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, Terminal, Shield, Zap, Eye, BarChart3, Bell, Trophy, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { TERMINAL_MESSAGES, COMPO } from "@/lib/utils/constants";
import "@/styles/terminal.css";

// ─── Section wrapper with scroll animation ───
function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ─── Navigation ───
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
        scrolled ? "bg-[#030303]/90 backdrop-blur-md border-b border-[rgba(255,255,255,0.06)]" : "bg-transparent",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-6">
        <a href="#top" className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#00ff41]" />
          <span className="font-mono font-bold text-[#00ff41] text-lg tracking-tight">COMPO</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {["Scanner", "Whale Radar", "Sniper", "Terminal"].map((link) => (
            <a key={link} href={`#${link.toLowerCase().replace(" ", "-")}`} className="font-mono text-sm text-[#71717a] hover:text-[#e4e4e7] transition-colors">
              [{link}]
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981] terminal-glow" />
            <span className="font-mono text-xs text-[#71717a]">SOLANA ● LIVE</span>
          </div>
          <Button variant="secondary" size="sm">
            Connect Wallet
          </Button>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ───
function Hero() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    const full = TERMINAL_MESSAGES.hero[msgIndex];
    let i = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      i++;
      setDisplayed(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(interval);
        setTimeout(() => setMsgIndex((prev) => (prev + 1) % TERMINAL_MESSAGES.hero.length), 2000);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [msgIndex]);

  const stats = [
    { label: "24h Scans", value: 14847 },
    { label: "Active Whales", value: 1203 },
    { label: "Alerts Sent", value: 892 },
    { label: "Rugs Detected", value: 3 },
  ];

  return (
    <section id="top" className="relative min-h-screen flex flex-col justify-center pt-14 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      {/* Radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[rgba(0,255,65,0.04)] blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-6">
              <Badge variant="success" size="sm">v{COMPO.version} — NOW LIVE</Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6"
            >
              <span className="text-[#00ff41] font-mono">{COMPO.name}</span>
              <br />
              <span className="text-[#e4e4e7]">{COMPO.description}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-xl sm:text-2xl font-mono text-[#00ff41] mb-3"
            >
              {COMPO.tagline}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="text-[#71717a] mb-8 max-w-md"
            >
              Real-time token scanning, whale tracking, and sniping infrastructure for Solana. Built for degens who refuse to be exit liquidity.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              <Button size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                LAUNCH TERMINAL
              </Button>
              <Button variant="ghost" size="lg">
                READ DOCS
              </Button>
            </motion.div>
          </div>

          {/* Right: Terminal window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="terminal-window crt-effect"
          >
            <div className="terminal-header">
              <div className="terminal-dot bg-[#ef4444]" />
              <div className="terminal-dot bg-[#f59e0b]" />
              <div className="terminal-dot bg-[#10b981]" />
              <span className="ml-2 text-[10px] font-mono text-[#525252]">compo@solana:~</span>
            </div>
            <div className="terminal-body min-h-[220px] text-[#00ff41]">
              <p className="text-[#71717a] mb-2">$ compo --version</p>
              <p className="mb-4">COMPO v{COMPO.version} — Solana Intelligence Terminal</p>
              <p className="text-[#71717a] mb-1">$ compo --scan solana</p>
              <p className="text-[#e4e4e7] min-h-[20px]">
                {displayed}
                <span className="terminal-blink">█</span>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Live stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((s) => (
            <Card key={s.label} className="text-center py-4">
              <p className="font-mono text-2xl font-bold text-[#00ff41]">
                <CountUp value={s.value} />
              </p>
              <p className="font-mono text-xs text-[#71717a] mt-1 uppercase tracking-wider">{s.label}</p>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Terminal Preview ───
interface CommandDef {
  label: string;
  command: string;
  output: React.ReactNode;
}

const commands: CommandDef[] = [
  {
    label: "scan",
    command: "$ compo scan 6EcSoSYGxXzMrZ6r8aL2d3GtBq4iCWoLs2mHR4VjFbSbuA",
    output: (
      <div className="space-y-1">
        <p className="text-[#71717a]">Scanning token...</p>
        <p><span className="text-[#3b82f6]">Risk Score:</span> <span className="text-[#10b981] font-bold">87/100</span> | <span className="text-[#10b981]">SAFE</span></p>
        <p className="text-[#71717a]">Honeypot: <span className="text-[#10b981]">PASS</span> | LP Locked: <span className="text-[#10b981]">PASS</span></p>
        <p className="text-[#71717a]">Holders: 1,247 | Top 10: 34.2% | Mint: <span className="text-[#10b981]">REVOKED</span></p>
        <p><span className="text-[#f59e0b]">⚠ Caution:</span> High concentration in top 5 wallets</p>
      </div>
    ),
  },
  {
    label: "whale",
    command: "$ compo whale --top 10",
    output: (
      <div className="space-y-1">
        <p className="text-[#71717a] mb-2">Top Whale Wallets (24h volume):</p>
        {[
          { addr: "0x7a2F...e4B1", vol: "$2.4M", change: "+12%" },
          { addr: "0x3bC8...f2A9", vol: "$1.8M", change: "+8%" },
          { addr: "0x9eD1...c7F3", vol: "$1.2M", change: "-3%" },
          { addr: "0x1fE5...a8D6", vol: "$980K", change: "+22%" },
          { addr: "0x5cA2...b1E4", vol: "$740K", change: "+5%" },
        ].map((w, i) => (
          <p key={i} className="flex gap-4 font-mono text-xs">
            <span className="text-[#525252] w-6">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-[#3b82f6] w-24">{w.addr}</span>
            <span className="text-[#e4e4e7] w-16">{w.vol}</span>
            <span className={w.change.startsWith("+") ? "text-[#10b981]" : "text-[#ef4444]"}>{w.change}</span>
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
        <p><span className="text-[#3b82f6]">Route:</span> Jupiter → Raydium</p>
        <p><span className="text-[#3b82f6]">Slippage:</span> 1.0% | <span className="text-[#3b82f6]">Gas:</span> 0.000005 SOL</p>
        <p className="text-[#10b981]">✓ Executed: 0.5 SOL → 12,450 BONK</p>
        <p className="text-[#71717a]">Tx: 0x3f8a...b2c1 • Block: 284,192,447</p>
        <p className="text-[#00ff41] font-bold">Stonks.</p>
      </div>
    ),
  },
];

function TerminalPreview() {
  const [active, setActive] = useState(0);
  const [executed, setExecuted] = useState(false);

  const runCommand = (idx: number) => {
    setActive(idx);
    setExecuted(false);
    setTimeout(() => setExecuted(true), 600);
  };

  return (
    <Section id="terminal" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-mono text-xs text-[#00ff41] mb-2">$ preview --interactive</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Try It Now</h2>
          <p className="text-[#71717a]">Click a command below to see COMPO in action.</p>
        </div>

        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-dot bg-[#ef4444]" />
            <div className="terminal-dot bg-[#f59e0b]" />
            <div className="terminal-dot bg-[#10b981]" />
            <span className="ml-2 text-[10px] font-mono text-[#525252]">compo@demo:~</span>
          </div>
          <div className="p-4">
            {/* Command tabs */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {commands.map((c, i) => (
                <button
                  key={c.label}
                  onClick={() => runCommand(i)}
                  className={[
                    "font-mono text-xs px-3 py-1.5 rounded transition-all",
                    active === i && executed
                      ? "bg-[rgba(0,255,65,0.15)] text-[#00ff41] border border-[rgba(0,255,65,0.3)]"
                      : "bg-[rgba(255,255,255,0.04)] text-[#71717a] border border-[rgba(255,255,255,0.08)] hover:text-[#e4e4e7] hover:border-[rgba(255,255,255,0.15)]",
                  ].join(" ")}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Command + output */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-[#71717a] mb-3">{commands[active].command}</p>
                {executed && <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)]">{commands[active].output}</div>}
                {!executed && <p className="text-[#525252] font-mono text-xs mt-4">Executing...</p>}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─── Features ───
const features = [
  {
    icon: <Shield className="w-5 h-5" />,
    command: "TOKEN_SCANNER",
    title: "Token Scanner",
    desc: "12-point contract audit. Honeypot detection. LP lock verification. Holder concentration analysis. Every token scored in seconds.",
    tags: ["Risk Score", "Honeypot", "LP Audit", "Mint Authority"],
  },
  {
    icon: <Eye className="w-5 h-5" />,
    command: "WHALE_RADAR",
    title: "Whale Radar",
    desc: "Real-time tracking of 500+ verified whale wallets. Movement alerts within 2 blocks. Full wallet profitability profiling.",
    tags: ["Live Tracking", "500+ Wallets", "2-Block Alerts", "Profiling"],
  },
  {
    icon: <Zap className="w-5 h-5" />,
    command: "SNIPER_ENGINE",
    title: "Sniper Engine",
    desc: "Sub-second execution across Jupiter & Raydium. Auto TP/SL. Anti-rug protection. Optional copy-trade mirroring.",
    tags: ["< 1s Execution", "Auto TP/SL", "Anti-Rug", "Copy Trade"],
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    command: "PORTFOLIO_INTEL",
    title: "Portfolio Intel",
    desc: "Multi-wallet aggregation. Real-time P&L analytics. Tax report generation. Unified risk scoring across all positions.",
    tags: ["Multi-Wallet", "P&L Analytics", "Tax Reports", "Risk Score"],
  },
  {
    icon: <Bell className="w-5 h-5" />,
    command: "ALERT_SYSTEM",
    title: "Alert System",
    desc: "Custom trigger engine. Push to Telegram, Discord, or webhook API. Price, volume, whale movement, and more.",
    tags: ["Real-Time", "Telegram", "Discord", "Webhooks"],
  },
  {
    icon: <Trophy className="w-5 h-5" />,
    command: "LEADERBOARD",
    title: "Leaderboard",
    desc: "Top traders ranked by accuracy and earnings. Verified wallet performance. Follow the money, follow the winners.",
    tags: ["Traders", "Accuracy", "Earnings", "Verified"],
  },
];

function Features() {
  return (
    <Section id="scanner" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-xs text-[#00ff41] mb-2">$ ls modules/</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Six Modules. One Terminal.</h2>
          <p className="text-[#71717a]">Every tool you need to trade Solana. Nothing you don't.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.command}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <Card hoverable className="h-full group">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[#00ff41]">{f.icon}</span>
                  <span className="font-mono text-xs text-[#00ff41] bg-[rgba(0,255,65,0.08)] px-2 py-0.5 rounded">{f.command}</span>
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-[#00ff41] transition-colors">{f.title}</h3>
                <p className="text-sm text-[#71717a] mb-4 leading-relaxed">{f.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {f.tags.map((t) => (
                    <Badge key={t} variant="neutral" size="sm">{t}</Badge>
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
      title: "Connect Your Wallet",
      desc: "Connect Phantom, Solflare, or any Solana wallet in one click. Non-custodial. Your keys, your coins.",
    },
    {
      step: "02",
      command: "$ configure --alerts",
      title: "Configure Alerts",
      desc: "Set custom triggers: whale movements, price thresholds, token deployments, liquidity changes. Route alerts to any channel.",
    },
    {
      step: "03",
      command: "$ execute --strategy",
      title: "Execute Strategy",
      desc: "Snipe launches, copy-trade whales, or set automated TP/SL. Sub-second execution. Built for speed.",
    },
  ];

  return (
    <Section id="sniper" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-[rgba(0,255,65,0.01)]" />
      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-xs text-[#00ff41] mb-2">$ run --setup</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Three Steps. Zero BS.</h2>
          <p className="text-[#71717a]">From wallet connect to alpha execution in under 60 seconds.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative"
            >
              <Card className="text-center py-8">
                <div className="w-12 h-12 rounded-full border-2 border-[#00ff41] flex items-center justify-center mx-auto mb-4">
                  <span className="font-mono text-[#00ff41] font-bold">{s.step}</span>
                </div>
                <p className="font-mono text-xs text-[#525252] mb-4">{s.command}</p>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-[#71717a] leading-relaxed">{s.desc}</p>
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
    { user: "@solwhale99", action: "sniped", token: "$MOON", amount: "2.1 SOL", time: "2 blocks ago" },
    { user: "@d3gen_queen", action: "flagged", token: "$RUGGY", reason: "Honeypot detected", time: "4 blocks ago" },
    { user: "@alpha_leaks", action: "tracked", whale: "0x7a2F...e4B1", movement: "+$1.2M $SOL", time: "6 blocks ago" },
    { user: "@bonk_hunter", action: "alerted", token: "$BONK", event: "Whale accumulation", time: "8 blocks ago" },
  ];

  const quotes = [
    { text: "I caught 3 rugs before they happened. COMPO paid for itself in 10 minutes.", user: "@sol_architect", acc: "92% accuracy" },
    { text: "The whale tracking is insane. I mirror-traded 0x7a2F and cleared 4.2 SOL profit.", user: "@whale_watcher", acc: "87% accuracy" },
    { text: "\"Sub-second sniping with auto TP/SL? That's basically legal cheating.\"", user: "@mech_degen", acc: "95% accuracy" },
  ];

  return (
    <Section id="whale-radar" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-xs text-[#00ff41] mb-2">$ tail -f alerts.log</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Live. Loud. Proven.</h2>
          <p className="text-[#71717a]">
            Trusted by{" "}
            <span className="text-[#00ff41] font-mono font-bold">
              <CountUp value={2847} /> traders
            </span>{" "}
            across Solana
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Live alerts feed */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981] terminal-glow" />
                <span className="font-mono text-xs text-[#71717a]">LIVE_ALERTS</span>
              </div>
              <Badge variant="success" size="sm">STREAMING</Badge>
            </div>
            <div className="space-y-3">
              {alerts.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 py-2 border-b border-[rgba(255,255,255,0.04)] last:border-0"
                >
                  <div className="w-2 h-2 rounded-full bg-[#3b82f6] mt-1.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm">
                      <span className="text-[#3b82f6] font-mono">{a.user}</span>
                      {" "}
                      <span className="text-[#71717a]">{a.action}</span>
                      {" "}
                      <span className="text-[#e4e4e7] font-mono">{a.token ?? a.whale}</span>
                      {(a.amount || a.movement || a.reason || a.event) && (
                        <span className="text-[#71717a]"> — {a.amount ?? a.movement ?? a.reason ?? a.event}</span>
                      )}
                    </p>
                    <p className="text-[10px] text-[#525252] font-mono">{a.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Quotes */}
          <div className="space-y-4">
            {quotes.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <Card>
                  <p className="text-[#e4e4e7] italic mb-3 text-sm leading-relaxed">&ldquo;{q.text}&rdquo;</p>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#3b82f6]">{q.user}</span>
                    <Badge variant="success" size="sm">{q.acc}</Badge>
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

// ─── Footer ───
function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.06)] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="w-4 h-4 text-[#00ff41]" />
              <span className="font-mono font-bold text-[#00ff41] text-lg">COMPO</span>
            </div>
            <p className="text-sm text-[#71717a] mb-3">Solana Intelligence Terminal</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10b981] terminal-glow" />
              <span className="font-mono text-xs text-[#525252]">Solana [● LIVE]</span>
            </div>
          </div>

          {/* Links */}
          {[
            { title: "Product", links: ["Scanner", "Whale Radar", "Sniper", "Portfolio"] },
            { title: "Developers", links: ["Documentation", "API Reference", "SDK", "Status"] },
            { title: "Community", links: ["Discord", "Twitter", "Telegram", "Blog"] },
          ].map((col) => (
            <div key={col.title}>
              <p className="font-mono text-xs text-[#525252] uppercase tracking-wider mb-3">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-[#71717a] hover:text-[#00ff41] transition-colors font-mono">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[rgba(255,255,255,0.04)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-xs text-[#525252]">
            The chain doesn&apos;t lie. &copy; 2026 COMPO
          </p>
          <div className="flex items-center gap-4">
            {["Docs", "API", "Discord", "Twitter"].map((l) => (
              <a key={l} href="#" className="font-mono text-xs text-[#525252] hover:text-[#71717a] transition-colors">
                {l}
              </a>
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
      <Hero />
      <TerminalPreview />
      <Features />
      <HowItWorks />
      <SocialProof />
      <Footer />
    </div>
  );
}
