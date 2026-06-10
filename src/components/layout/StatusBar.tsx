"use client";

import { useNetworkHealth } from "../../lib/hooks/useDexScreener";
import { COMPO } from "../../lib/utils/constants";

export function StatusBar() {
  const { data: networkHealth, error: networkError } = useNetworkHealth();

  const slot = networkHealth?.slot ?? 284_192_447;
  const latency = networkHealth?.latencyMs ?? 42;
  const isHealthy = !networkError;

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-30 h-[28px] flex items-center justify-between px-4"
      style={{
        background: "#030303",
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Left: Solana network status + live data indicators */}
      <div className="flex items-center gap-4 font-mono text-[10px] text-[#525252]">
        <span className="flex items-center gap-1.5">
          <span className={["w-1 h-1 rounded-full", isHealthy ? "bg-[#10b981]" : "bg-[#FFB800]"].join(" ")} />
          SOL
        </span>
        <span>SLOT {slot.toLocaleString()}</span>
        <span>{latency}ms</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-[#3b82f6] animate-pulse" />
          DEXSCREENER
        </span>
      </div>

      {/* Right: Version + connection */}
      <div className="flex items-center gap-4 font-mono text-[10px] text-[#525252]">
        <span>{COMPO.name} v{COMPO.version}</span>
        <span>© 2026</span>
        <span className="flex items-center gap-1.5">
          <span className={["w-1 h-1 rounded-full", isHealthy ? "bg-[#10b981] animate-pulse" : "bg-[#FFB800]"].join(" ")} />
          {isHealthy ? "CONNECTED" : "DEGRADED"}
        </span>
      </div>
    </footer>
  );
}
