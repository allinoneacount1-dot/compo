"use client";

import { useState } from "react";
import { Bell, Plus, Trash2 } from "lucide-react";

const ACTIVE_ALERTS = [
  { id: 1, token: "$BONK", type: "Price", trigger: "Above $0.000015", current: "$0.000012", status: "pending" },
  { id: 2, token: "$WIF", type: "Volume", trigger: "Spike > 500 SOL", current: "320 SOL", status: "pending" },
  { id: 3, token: "$POPCAT", type: "Honeypot", trigger: "Rug detected", current: "Safe", status: "triggered" },
  { id: 4, token: "$JUP", type: "Price", trigger: "Below $0.90", current: "$0.92", status: "triggered" },
];

export default function AlertsPage() {
  const [token, setToken] = useState("");
  const [condition, setCondition] = useState("price_above");
  const [value, setValue] = useState("");

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Active Alerts — 7 cols */}
        <div className="lg:col-span-7 bg-[#161616] border border-[#222] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 text-[#00ff9f]" />
              <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Active Alerts</span>
              <span className="font-mono text-[10px] text-[#52525b]">({ACTIVE_ALERTS.length})</span>
            </div>
            <div className="flex gap-1">
              {["All", "Price", "Volume", "Contract"].map((f) => (
                <button key={f} className="px-2 py-0.5 text-[9px] bg-[#222] text-[#52525b] rounded hover:text-white transition-colors cursor-pointer">{f}</button>
              ))}
            </div>
          </div>
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="text-[#52525b] text-[9px] border-b border-[#222]">
                <th className="text-left py-1.5 px-2">Token</th>
                <th className="text-left py-1.5 px-2">Type</th>
                <th className="text-left py-1.5 px-2">Trigger</th>
                <th className="text-left py-1.5 px-2">Current</th>
                <th className="text-center py-1.5 px-2">Status</th>
                <th className="text-right py-1.5 px-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {ACTIVE_ALERTS.map((a) => (
                <tr key={a.id} className="hover:bg-[#1a1a1a]">
                  <td className="py-1.5 px-2 text-white text-[11px] font-bold">{a.token}</td>
                  <td className="py-1.5 px-2 text-[#a1a1aa] text-[10px]">{a.type}</td>
                  <td className="py-1.5 px-2 text-[#a1a1aa] text-[10px]">{a.trigger}</td>
                  <td className="py-1.5 px-2 text-[#52525b] text-[10px]">{a.current}</td>
                  <td className="py-1.5 px-2 text-center">
                    <span className={["text-[9px] font-bold px-1.5 py-0.5 rounded", a.status === "triggered" ? "bg-[#00ff9f]/10 text-[#00ff9f]" : "bg-[#f59e0b]/10 text-[#f59e0b]"].join(" ")}>
                      {a.status === "triggered" ? "Triggered" : "Pending"}
                    </span>
                  </td>
                  <td className="py-1.5 px-2 text-right">
                    <button className="text-[#52525b] hover:text-[#ff3b5c] transition-colors cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create Alert — 5 cols */}
        <div className="lg:col-span-5 bg-[#161616] border border-[#222] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="w-3.5 h-3.5 text-[#00ff9f]" />
            <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">Create New Alert</span>
          </div>
          <div className="space-y-3">
            <div>
              <label className="font-mono text-[9px] text-[#52525b] mb-1 block">Token</label>
              <input type="text" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Token address or symbol" className="w-full h-10 bg-[#111] border border-[#222] rounded-lg px-3 text-sm text-white placeholder:text-[#52525b] focus:outline-none focus:border-[#00ff9f]/40 font-mono" />
            </div>
            <div>
              <label className="font-mono text-[9px] text-[#52525b] mb-1 block">Condition</label>
              <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full h-10 bg-[#111] border border-[#222] rounded-lg px-3 text-sm text-white focus:outline-none font-mono">
                <option value="price_above">Price above</option>
                <option value="price_below">Price below</option>
                <option value="volume_spike">Volume spike</option>
                <option value="honeypot">Honeypot detected</option>
                <option value="liquidity_pull">Liquidity pulled</option>
              </select>
            </div>
            <div>
              <label className="font-mono text-[9px] text-[#52525b] mb-1 block">Value / Threshold</label>
              <input type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 0.000015 or 500 SOL" className="w-full h-10 bg-[#111] border border-[#222] rounded-lg px-3 text-sm text-white placeholder:text-[#52525b] focus:outline-none font-mono" />
            </div>
            <button className="w-full h-10 bg-[#00ff9f] text-black font-semibold rounded-lg hover:bg-[#00e08f] transition-colors font-mono text-sm cursor-pointer">
              Create Alert
            </button>
          </div>
          <div className="mt-3 pt-3 border-t border-[#222]">
            <span className="font-mono text-[9px] text-[#52525b]">Popular:</span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {["BONK > $0.00002", "WIF volume spike", "Any honeypot"].map((p) => (
                <button key={p} className="px-2 py-0.5 text-[9px] bg-[#222] text-[#a1a1aa] rounded hover:bg-[#333] transition-colors cursor-pointer">{p}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
