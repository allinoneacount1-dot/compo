"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Book,
  Terminal,
  Shield,
  Zap,
  Eye,
  BarChart3,
  Bell,
  Trophy,
  ChevronRight,
  ArrowRight,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const sections = [
  {
    id: "getting-started",
    icon: <Terminal className="w-4 h-4" />,
    title: "Getting Started",
    items: ["Installation", "Configuration", "First Run"],
  },
  {
    id: "scanner",
    icon: <Shield className="w-4 h-4" />,
    title: "Token Scanner",
    items: ["Risk Scoring", "Honeypot Detection", "LP Audit", "Holder Analysis"],
  },
  {
    id: "whales",
    icon: <Eye className="w-4 h-4" />,
    title: "Whale Radar",
    items: ["Live Tracking", "Movement Alerts", "Profitability Profiling", "Copy Trading"],
  },
  {
    id: "sniper",
    icon: <Zap className="w-4 h-4" />,
    title: "Sniper Engine",
    items: ["Execution", "Auto TP/SL", "Anti-Rug Protection", "Copy-Trade Mirroring"],
  },
  {
    id: "portfolio",
    icon: <BarChart3 className="w-4 h-4" />,
    title: "Portfolio Intel",
    items: ["Multi-Wallet", "Real-Time P&L", "Tax Reports", "Risk Scoring"],
  },
  {
    id: "alerts",
    icon: <Bell className="w-4 h-4" />,
    title: "Alert System",
    items: ["Custom Triggers", "Multi-Channel", "Priority Levels", "Quiet Hours"],
  },
  {
    id: "leaderboard",
    icon: <Trophy className="w-4 h-4" />,
    title: "Leaderboard",
    items: ["Rankings", "Verification", "Achievements", "Leaderboards"],
  },
  {
    id: "api",
    icon: <Wallet className="w-4 h-4" />,
    title: "API & SDK",
    items: ["REST API", "WebSocket", "SDK", "Rate Limits"],
  },
];

export default function DocsPage() {
  const [active, setActive] = useState("getting-started");
  const current = sections.find((s) => s.id === active);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-[#222]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Book className="w-8 h-8 text-[#00ff9f]" />
            <h1 className="text-3xl sm:text-4xl font-bold">
              <span className="text-[#00ff9f] font-mono">COMPO</span> Documentation
            </h1>
          </div>
          <p className="text-[#52525b] max-w-2xl">
            Everything you need to integrate, configure, and master the Solana Intelligence Terminal.
          </p>
          <div className="flex gap-3 mt-6">
            <Button onClick={() => { window.location.hash = "#/dashboard"; }}>
              LAUNCH TERMINAL <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
            <Button variant="secondary" onClick={() => { window.location.hash = "#/landing"; }}>
              BACK TO HOME
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="hidden md:block w-56 shrink-0">
          <div className="sticky top-24 space-y-1">
            <p className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider mb-3">
              Navigation
            </p>
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={[
                  "w-full flex items-center gap-2 h-9 px-3 text-left cursor-pointer",
                  "font-mono text-[12px] transition-colors duration-100 rounded",
                  active === s.id
                    ? "text-[#00ff9f] bg-[#00ff9f]/10"
                    : "text-[#52525b] hover:text-white hover:bg-[#1a1a1a]",
                ].join(" ")}
              >
                {s.icon}
                <span>{s.title}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          {/* Mobile selector */}
          <div className="md:hidden mb-6">
            <select
              value={active}
              onChange={(e) => setActive(e.target.value)}
              className="w-full bg-[#111] border border-[#222] rounded px-3 py-2 text-white font-mono text-sm"
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>

          {current && (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-[#00ff9f]/10 flex items-center justify-center text-[#00ff9f]">
                  {current.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{current.title}</h2>
                  <Badge variant="success" size="sm">v1.0</Badge>
                </div>
              </div>

              <div className="grid gap-4">
                {current.items.map((item, i) => (
                  <Card key={i} className="group">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-white group-hover:text-[#00ff9f] transition-colors">
                          {item}
                        </h3>
                        <p className="text-sm text-[#52525b] mt-1">
                          Learn about {item.toLowerCase()} in COMPO.
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#52525b] group-hover:text-[#00ff9f] transition-colors mt-1 ml-4 shrink-0" />
                    </div>
                  </Card>
                ))}
              </div>

              {/* Code example */}
              <div className="mt-8">
                <p className="font-mono text-xs text-[#00ff9f] mb-3">$ install --quickstart</p>
                <div className="bg-[#111] border border-[#222] rounded p-4 font-mono text-sm">
                  <p className="text-[#52525b]"># Clone the repository</p>
                  <p>
                    <span className="text-[#00ff9f]">git</span>{" "}
                    clone https://github.com/compo/compo.git
                  </p>
                  <p className="mt-2 text-[#52525b]"># Install dependencies</p>
                  <p>
                    <span className="text-[#00ff9f]">cd</span> compo &&{" "}
                    <span className="text-[#3b82f6]">npm</span> install
                  </p>
                  <p className="mt-2 text-[#52525b]"># Configure environment</p>
                  <p>
                    <span className="text-[#00ff9f]">cp</span> .env.example .env
                  </p>
                  <p className="mt-2 text-[#52525b]"># Launch COMPO</p>
                  <p>
                    <span className="text-[#00ff9f]">npm</span> run dev
                  </p>
                  <p className="mt-2 text-[#52525b]">
                    Ready at <span className="text-[#3b82f6]">http://localhost:5173</span>
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#222]">
                {sections.indexOf(current) > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const idx = sections.indexOf(current);
                      setActive(sections[idx - 1].id);
                    }}
                  >
                    {sections[sections.indexOf(current) - 1].title}
                  </Button>
                )}
                <div className="flex-1" />
                {sections.indexOf(current) < sections.length - 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const idx = sections.indexOf(current);
                      setActive(sections[idx + 1].id);
                    }}
                  >
                    {sections[sections.indexOf(current) + 1].title}
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Footer */}
      <div className="border-t border-[#222] py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-xs text-[#52525b]">
            (c) 2026 COMPO - Solana Intelligence Terminal
          </p>
          <button
            onClick={() => { window.location.hash = "#/landing"; }}
            className="font-mono text-xs text-[#52525b] hover:text-[#00ff9f] transition-colors cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
