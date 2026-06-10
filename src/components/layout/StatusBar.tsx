"use client";

import { useState, useEffect } from "react";

export function StatusBar() {
  const [slot, setSlot] = useState(284192447);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlot((prev) => prev + 400);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 h-7 flex items-center gap-4 px-6 md:ml-[260px]"
      style={{ background: "#111111", borderTop: "1px solid #222" }}
    >
      <span className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9f] animate-pulse" />
        <span className="font-mono text-[10px] text-[#00ff9f]">SOL</span>
      </span>
      <span className="font-mono text-[10px] text-[#52525b]">|</span>
      <span className="font-mono text-[10px] text-[#a1a1aa]">SLOT {slot.toLocaleString()}</span>
      <span className="font-mono text-[10px] text-[#52525b]">|</span>
      <span className="font-mono text-[10px] text-[#a1a1aa]">42ms</span>
      <span className="font-mono text-[10px] text-[#52525b]">|</span>
      <span className="font-mono text-[10px] text-[#a1a1aa]">SCANS 14,847</span>
      <span className="font-mono text-[10px] text-[#52525b]">|</span>
      <span className="font-mono text-[10px] text-[#52525b]">COMPO v2.0.0</span>
      <span className="ml-auto flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9f] animate-pulse" />
        <span className="font-mono text-[10px] text-[#00ff9f]">CONNECTED</span>
      </span>
    </div>
  );
}
