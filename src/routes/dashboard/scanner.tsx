"use client";

import { useState, useCallback } from "react";
import { Search, Shield, AlertTriangle, Clock, ExternalLink, Zap, Download, Filter } from "lucide-react";

const QUICK_SCAN = ["BONK", "WIF", "POPCAT", "JUP", "MYRO", "PYTH"];

const RECENT_SCANS = [
  { time: "2m ago", token: "BONK", contract: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", score: 87, verdict: "SAFE", risk: "low" },
  { time: "8m ago", token: "WIF", contract: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", score: 94, verdict: "SAFE", risk: "low" },
  { time: "14m ago", token: "POPCAT", contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr", score: 34, verdict: "DANGER", risk: "high" },
  { time: "22m ago", token: "JUP", contract: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN", score: 56, verdict: "CAUTION", risk: "medium" },
  { time: "31m ago", token: "MYRO", contract: "HhJpBhRRn4g56VsyLuTgaVJR28UQ3WnkX8aB2R8Xq2v6", score: 72, verdict: "SAFE", risk: "low" },
  { time: "45m ago", token: "PYTH", contract: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3", score: 88, verdict: "SAFE", risk: "low" },
  { time: "1h ago", token: "MOODENG", contract: "ED5nyyWEzpPPiWimP8vYm7sD7TD3LJay97za4Ux9t2ur", score: 91, verdict: "SAFE", risk: "low" },
  { time: "2h ago", token: "BOME", contract: "ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82", score: 23, verdict: "DANGER", risk: "high" },
];

function verdictStyle(v: string) {
  if (v === "SAFE") return "bg-[#00ff9f]/10 text-[#00ff9f]";
  if (v === "DANGER") return "bg-[#ff3b5c]/10 text-[#ff3b5c]";
  return "bg-[#f59e0b]/10 text-[#f59e0b]";
}

export default function ScannerPage() {
  const [query, setQuery] = useState("");
  const [scanning, setScanning] = useState(false);

  const handleScan = useCallback(() => {
    if (!query.trim()) return;
    setScanning(true);
    setTimeout(() => setScanning(false), 2000);
  }, [query]);

  return (
    <div className="p-6 max-w-[1200px]">
      {/* Scanner Form */}
      <div className="bg-[#161616] border border-[#222] rounded-xl p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-4 h-4 text-[#00ff9f]" />
          <span className="font-mono text-sm font-semibold">Token Security Scanner</span>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Solana token address or symbol..."
            className="flex-1 h-12 bg-[#111] border border-[#222] rounded-lg px-4 text-sm text-white placeholder:text-[#52525b] focus:outline-none focus:border-[#00ff9f]/40 font-mono"
          />
          <button
            onClick={handleScan}
            disabled={scanning}
            className="h-12 px-8 bg-[#00ff9f] text-black font-semibold rounded-lg hover:bg-[#00cc7f] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {scanning ? <Zap className="w-4 h-4 animate-pulse" /> : <Shield className="w-4 h-4" />}
            SCAN
          </button>
        </div>
        {/* Quick Scan */}
        <div className="flex items-center gap-2 mt-3">
          <span className="font-mono text-[10px] text-[#52525b]">Quick Scan:</span>
          {QUICK_SCAN.map((t) => (
            <button key={t} onClick={() => setQuery(t)} className="px-3 py-1 text-[11px] bg-[#222] text-[#a1a1aa] rounded hover:bg-[#333] hover:text-white transition-colors font-mono">
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Scans */}
      <div className="bg-[#161616] border border-[#222] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Recent Scans</span>
            <span className="font-mono text-[9px] text-[#52525b]">({RECENT_SCANS.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-2 py-1 text-[10px] bg-[#222] text-[#a1a1aa] rounded hover:bg-[#333] transition-colors">
              <Filter className="w-3 h-3" /> Filter
            </button>
            <button className="flex items-center gap-1 px-2 py-1 text-[10px] bg-[#222] text-[#a1a1aa] rounded hover:bg-[#333] transition-colors">
              <Download className="w-3 h-3" /> Export
            </button>
          </div>
        </div>

        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="text-[#52525b] text-[10px] border-b border-[#222]">
              <th className="text-left py-2 px-2">Time</th>
              <th className="text-left py-2 px-2">Token</th>
              <th className="text-left py-2 px-2">Contract</th>
              <th className="text-center py-2 px-2">Score</th>
              <th className="text-center py-2 px-2">Verdict</th>
              <th className="text-right py-2 px-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222]">
            {RECENT_SCANS.map((s, i) => (
              <tr key={i} className="hover:bg-[#1a1a1a]">
                <td className="py-2 px-2 text-[#52525b] text-[11px]">{s.time}</td>
                <td className="py-2 px-2 text-white text-[11px] font-bold">${s.token}</td>
                <td className="py-2 px-2 text-[#3b82f6] text-[10px]">{s.contract.slice(0, 8)}...{s.contract.slice(-6)}</td>
                <td className="py-2 px-2 text-center">
                  <span className={["text-[11px] font-bold", s.score >= 70 ? "text-[#00ff9f]" : s.score >= 40 ? "text-[#f59e0b]" : "text-[#ff3b5c]"].join(" ")}>
                    {s.score}
                  </span>
                </td>
                <td className="py-2 px-2 text-center">
                  <span className={["text-[10px] font-bold px-2 py-0.5 rounded", verdictStyle(s.verdict)].join(" ")}>
                    {s.verdict}
                  </span>
                </td>
                <td className="py-2 px-2 text-right">
                  <button className="text-[10px] text-[#3b82f6] hover:text-white transition-colors">
                    View <ExternalLink className="w-3 h-3 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
