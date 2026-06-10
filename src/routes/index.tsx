"use client";

import { useEffect, useState } from "react";
import { TERMINAL_MESSAGES } from "../lib/utils/constants";
import "../styles/terminal.css";

export default function BootingPage() {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [exiting, setExiting] = useState(false);

  const messages = TERMINAL_MESSAGES.booting;

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setStep(1), 500));
    timers.push(setTimeout(() => setStep(2), 1300));
    timers.push(setTimeout(() => setStep(3), 1900));
    timers.push(setTimeout(() => {
      let p = 0;
      const interval = setInterval(() => { p += 2; setProgress(p); if (p >= 100) clearInterval(interval); }, 25);
    }, 1900));
    for (let i = 0; i < messages.length; i++) {
      timers.push(setTimeout(() => setVisibleLines(i + 1), 2500 + i * 400));
    }
    timers.push(setTimeout(() => setStep(5), 2500 + messages.length * 400 + 400));
    timers.push(setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        const hasWallet = localStorage.getItem("compo_wallet_connected") === "true";
        window.location.hash = hasWallet ? "#/dashboard" : "#/landing";
      }, 600);
    }, 2500 + messages.length * 400 + 1400));
    return () => timers.forEach(clearTimeout);
  }, [messages.length]);

  return (
    <div
      className="w-screen h-screen bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden"
      style={{ fontFamily: '"JetBrains Mono", "SF Mono", monospace', opacity: exiting ? 0 : 1, transition: "opacity 0.6s ease-out" }}
    >
      {/* Scanline */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,255,159,0.06) 1px, rgba(0,255,159,0.06) 2px)", backgroundSize: "100% 3px" }} />

      {step >= 1 && (
        <div className="text-center mb-2" style={{ opacity: step >= 5 ? 0.5 : 1, transform: step >= 5 ? "scale(0.95)" : "scale(1)", transition: "all 0.6s ease-out" }}>
          <h1 className="text-5xl md:text-6xl font-bold tracking-[0.2em] text-[#00ff9f]" style={{ textShadow: "0 0 20px rgba(0,255,159,0.4), 0 0 40px rgba(0,255,159,0.15)" }}>COMPO</h1>
        </div>
      )}

      {step >= 2 && (
        <p className="text-sm tracking-[0.15em] uppercase text-[#00ff9f]/50 mb-6" style={{ opacity: step >= 5 ? 0 : 0.8 }}>Solana Intelligence Terminal</p>
      )}

      {step >= 3 && (
        <div className="w-64 mb-4">
          <div className="h-[2px] bg-[#222] rounded-full overflow-hidden">
            <div className="h-full bg-[#00ff9f] rounded-full" style={{ width: `${progress}%`, transition: "width 0.1s linear", boxShadow: "0 0 8px rgba(0,255,159,0.3)" }} />
          </div>
        </div>
      )}

      {step >= 3 && visibleLines > 0 && (
        <div className="text-left space-y-1 mt-2">
          {messages.slice(0, visibleLines).map((msg, i) => (
            <div key={i} className="text-xs font-mono" style={{ color: msg.includes("OK") || msg.includes("ACTIVE") || msg.includes("ONLINE") ? "#00ff9f" : msg.includes("ACCESS GRANTED") ? "#00ff9f" : "#52525b", fontWeight: msg.includes("ACCESS GRANTED") ? 700 : 400 }}>
              {msg.includes("ACCESS GRANTED") ? <span className="text-base tracking-wider">[{msg}]</span> : <span>[{msg}]</span>}
            </div>
          ))}
        </div>
      )}

      <div className="absolute top-4 left-4 text-[9px] font-mono text-[#52525b]">COMPO v2.0.0</div>
      <div className="absolute top-4 right-4 text-[9px] font-mono text-[#52525b] flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9f] animate-pulse" /> CONNECTED
      </div>
      <div className="absolute bottom-4 left-4 text-[9px] font-mono text-[#52525b]">SYS.BOOT</div>
      <div className="absolute bottom-4 right-4 text-[9px] font-mono text-[#52525b]"><span className="animate-pulse">█</span></div>
    </div>
  );
}
