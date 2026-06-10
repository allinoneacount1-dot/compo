"use client";

import { useState } from "react";
import { ScanLine, Shield, AlertTriangle, CheckCircle, XCircle, Search } from "lucide-react";

const SCAN_RESULTS = [
  { token: "$BONK", verdict: "SAFE", score: 92, honeypot: false, liquidity: "$2.1M", holders: 12400, mint: "Renounced", top10: "12%" },
  { token: "$WIF", verdict: "SAFE", score: 88, honeypot: false, liquidity: "$8.4M", holders: 8200, mint: "Renounced", top10: "18%" },
  { token: "$POPCAT", verdict: "CAUTION", score: 64, honeypot: false, liquidity: "$1.2M", holders: 3400, mint: "Mutable", top10: "34%" },
  { token: "$RUGGED", verdict: "DANGER", score: 12, honeypot: true, liquidity: "$0.1M", holders: 47, mint: "Mutable", top10: "89%" },
  { token: "$NEWCOIN", verdict: "CAUTION", score: 51, honeypot: false, liquidity: "$0.4M", holders: 1200, mint: "Renounced", top10: "42%" },
];

const RECENT_SCANS = [
  { token: "BONK...a4f2", time: "2m ago", result: "SAFE", score: 92 },
  { token: "WIF...b3e1", time: "5m ago", result: "SAFE", score: 88 },
  { token: "RUGGED...f9c2", time: "8m ago", result: "DANGER", score: 12 },
  { token: "NEWCOIN...d7a1", time: "12m ago", result: "CAUTION", score: 51 },
];

function verdictColor(v: string) {
  if (v === "SAFE") return "text-[#00ff9f]";
  if (v === "DANGER") return "text-[#ff3b5c]";
  return "text-[#f59e0b]";
}

function verdictBg(v: string) {
  if (v === "SAFE") return "bg-[#00ff9f]/10";
  if (v === "DANGER") return "bg-[#ff3b5c]/10";
  return "bg-[#f59e0b]/10";
}

export default function ScannerPage() {
  const [scanToken, setScanToken] = useState("");
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    if (!scanToken) return;
    setScanning(true);
    setTimeout(() => setScanning(false), 1500);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

        {/* Scan Input — full width */}
        <div className="xl:col-span-12 bg-[#161616] border border-[#222] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <ScanLine className="w-3.5 h-3.5 text-[#00ff9f]" />
            <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Token Scanner</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={scanToken}
              onChange={(e) => setScanToken(e.target.value)}
              placeholder="Token address or symbol..."
              className="flex-1 h-10 bg-[#111] border border-[#222] rounded-lg px-4 text-sm text-white placeholder:text-[#52525b] focus:outline-none focus:border-[#00ff9f]/40 font-mono"
            />
            <button
              onClick={handleScan}
              disabled={scanning}
              className="h-10 px-5 bg-[#00ff9f] text-black font-semibold rounded-lg hover:bg-[#00e08f] transition-colors disabled:opacity-50 cursor-pointer font-mono text-sm"
            >
              {scanning ? "SCANNING..." : "SCAN"}
            </button>
          </div>
          {/* Quick scan chips */}
          <div className="flex flex-wrap gap-2 mt-2">
            {["BONK", "WIF", "POPCAT", "JUP", "PYTH"].map((t) => (
              <button key={t} onClick={() => setScanToken(t)} className="px-2 py-0.5 text-[10px] bg-[#222] text-[#52525b] rounded hover:text-white transition-colors cursor-pointer font-mono">
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Scan Results Table — 8 cols */}
        <div className="xl:col-span-8 bg-[#161616] border border-[#222] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Scan Results</span>
            <div className="flex gap-1">
              {["All", "Safe", "Caution", "Danger"].map((f) => (
                <button key={f} className="px-2 py-0.5 text-[9px] bg-[#222] text-[#52525b] rounded hover:text-white transition-colors cursor-pointer">{f}</button>
              ))}
            </div>
          </div>
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="text-[#52525b] text-[9px] border-b border-[#222]">
                <th className="text-left py-1.5 px-2">Token</th>
                <th className="text-center py-1.5 px-2">Verdict</th>
                <th className="text-center py-1.5 px-2">Score</th>
                <th className="text-center py-1.5 px-2">Honeypot</th>
                <th className="text-right py-1.5 px-2">Liquidity</th>
                <th className="text-right py-1.5 px-2">Holders</th>
                <th className="text-center py-1.5 px-2">Mint</th>
                <th className="text-right py-1.5 px-2">Top 10</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {SCAN_RESULTS.map((r) => (
                <tr key={r.token} className="hover:bg-[#1a1a1a]">
                  <td className="py-1.5 px-2 text-white text-[11px] font-bold">{r.token}</td>
                  <td className="py-1.5 px-2 text-center">
                    <span className={["text-[9px] font-bold px-1.5 py-0.5 rounded", verdictBg(r.verdict), verdictColor(r.verdict)].join(" ")}>{r.verdict}</span>
                  </td>
                  <td className={["py-1.5 px-2 text-center text-[11px] font-bold", verdictColor(r.verdict)].join(" ")}>{r.score}</td>
                  <td className="py-1.5 px-2 text-center">
                    {r.honeypot ? <XCircle className="w-3 h-3 text-[#ff3b5c] mx-auto" /> : <CheckCircle className="w-3 h-3 text-[#00ff9f] mx-auto" />}
                  </td>
                  <td className="py-1.5 px-2 text-right text-white text-[11px]">{r.liquidity}</td>
                  <td className="py-1.5 px-2 text-right text-[#a1a1aa] text-[11px]">{r.holders.toLocaleString()}</td>
                  <td className={["py-1.5 px-2 text-center text-[10px]", r.mint === "Renounced" ? "text-[#00ff9f]" : "text-[#f59e0b]"].join(" ")}>{r.mint}</td>
                  <td className={["py-1.5 px-2 text-right text-[11px]", parseInt(r.top10) > 40 ? "text-[#ff3b5c]" : parseInt(r.top10) > 20 ? "text-[#f59e0b]" : "text-[#00ff9f]"].join(" ")}>{r.top10}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Scans — 4 cols */}
        <div className="xl:col-span-4 bg-[#161616] border border-[#222] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Recent Scans</span>
          </div>
          <div className="space-y-2">
            {RECENT_SCANS.map((s, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-[#222] last:border-0">
                <div>
                  <div className="font-mono text-[11px] text-white">{s.token}</div>
                  <div className="font-mono text-[9px] text-[#52525b]">{s.time}</div>
                </div>
                <div className="text-right">
                  <span className={["text-[9px] font-bold", verdictColor(s.result)].join(" ")}>{s.result}</span>
                  <div className="font-mono text-[10px] text-[#52525b]">{s.score}/100</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-4 pt-3 border-t border-[#222]">
            <span className="font-mono text-[9px] text-[#52525b] uppercase tracking-wider">Today</span>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <div className="font-mono text-[10px] text-[#52525b]">Scanned</div>
                <div className="font-mono text-sm text-white font-bold">1,247</div>
              </div>
              <div>
                <div className="font-mono text-[10px] text-[#52525b]">Rugs Found</div>
                <div className="font-mono text-sm text-[#ff3b5c] font-bold">23</div>
              </div>
              <div>
                <div className="font-mono text-[10px] text-[#52525b]">Safe</div>
                <div className="font-mono text-sm text-[#00ff9f] font-bold">892</div>
              </div>
              <div>
                <div className="font-mono text-[10px] text-[#52525b]">Avg Score</div>
                <div className="font-mono text-sm text-white font-bold">71</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
