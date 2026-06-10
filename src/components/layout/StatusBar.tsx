"use client";

import { COMPO } from "../../lib/utils/constants";

export function StatusBar() {
  // Mock data — in real app would come from store
  const slot = 284_192_447;
  const latency = 42;
  const scans = 14_847;

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-30 h-[28px] flex items-center justify-between px-4"
      style={{
        background: "#030303",
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Left: Solana network status */}
      <div className="flex items-center gap-4 font-mono text-[10px] text-[#525252]">
        <span className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-[#10b981]" />
          SOL
        </span>
        <span>SLOT {slot.toLocaleString()}</span>
        <span>{latency}ms</span>
        <span>SCANS {scans.toLocaleString()}</span>
      </div>

      {/* Right: Version + connection */}
      <div className="flex items-center gap-4 font-mono text-[10px] text-[#525252]">
        <span>{COMPO.name} v{COMPO.version}</span>
        <span>© 2026</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-[#10b981] animate-pulse" />
          CONNECTED
        </span>
      </div>
    </footer>
  );
}
