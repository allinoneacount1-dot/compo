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
    // Step 0: black screen (500ms)
    // Step 1: logo appears (800ms after black)
    // Step 2: tagline appears (600ms after logo)
    // Step 3: progress bar starts (400ms after tagline)
    // Step 4: status lines appear one by one
    // Step 5: access granted
    // Step 6: navigate

    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setStep(1), 500));   // logo
    timers.push(setTimeout(() => setStep(2), 1300));  // tagline
    timers.push(setTimeout(() => setStep(3), 1900));  // progress

    // Progress bar: 0-100 over 2.5s starting at 1900ms
    timers.push(setTimeout(() => {
      let p = 0;
      const interval = setInterval(() => {
        p += 2;
        setProgress(p);
        if (p >= 100) clearInterval(interval);
      }, 25);
    }, 1900));

    // Status lines: appear one by one every 400ms starting at 2500ms
    for (let i = 0; i < messages.length; i++) {
      timers.push(setTimeout(() => setVisibleLines(i + 1), 2500 + i * 400));
    }

    // Access granted flash
    timers.push(setTimeout(() => setStep(5), 2500 + messages.length * 400 + 400));

    // Exit + navigate
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
      className="w-screen h-screen bg-[#030303] flex flex-col items-center justify-center overflow-hidden"
      style={{
        fontFamily: '"JetBrains Mono", "SF Mono", monospace',
        opacity: exiting ? 0 : 1,
        transition: "opacity 0.6s ease-out",
      }}
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-50 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,255,65,0.06) 1px, rgba(0,255,65,0.06) 2px)",
          backgroundSize: "100% 3px",
        }}
      />

      {/* Logo */}
      {step >= 1 && (
        <div
          className="text-center mb-2"
          style={{
            opacity: step >= 5 ? 0.5 : 1,
            transform: step >= 5 ? "scale(0.95)" : "scale(1)",
            transition: "all 0.6s ease-out",
          }}
        >
          <h1
            className="text-5xl md:text-6xl font-bold tracking-[0.2em] text-[#00ff41]"
            style={{
              textShadow: "0 0 20px rgba(0,255,65,0.5), 0 0 40px rgba(0,255,65,0.2)",
            }}
          >
            COMPO
          </h1>
        </div>
      )}

      {/* Tagline */}
      {step >= 2 && (
        <p
          className="text-sm tracking-[0.15em] uppercase text-[#00ff41]/60 mb-6"
          style={{ opacity: step >= 5 ? 0 : 0.8 }}
        >
          Solana Intelligence Terminal
        </p>
      )}

      {/* Progress bar */}
      {step >= 3 && (
        <div className="w-64 mb-4">
          <div className="h-[2px] bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00ff41] rounded-full"
              style={{
                width: `${progress}%`,
                transition: "width 0.1s linear",
                boxShadow: "0 0 8px rgba(0,255,65,0.4)",
              }}
            />
          </div>
        </div>
      )}

      {/* Status lines */}
      {step >= 3 && visibleLines > 0 && (
        <div className="text-left space-y-1 mt-2">
          {messages.slice(0, visibleLines).map((msg, i) => (
            <div
              key={i}
              className="text-xs font-mono"
              style={{
                color: msg.includes("OK") || msg.includes("ACTIVE") || msg.includes("ONLINE")
                  ? "#10b981"
                  : msg.includes("ACCESS GRANTED")
                  ? "#00ff41"
                  : "#71717a",
                fontWeight: msg.includes("ACCESS GRANTED") ? 700 : 400,
                opacity: 1,
                animation: i === visibleLines - 1 ? "fadeIn 0.3s ease-out" : undefined,
              }}
            >
              {msg.includes("ACCESS GRANTED") ? (
                <span className="text-base tracking-wider">{msg}</span>
              ) : (
                <span>
                  {"["}
                  {msg}
                  {"]"}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 text-[9px] font-mono text-[#525252]">
        COMPO v1.0.0
      </div>
      <div className="absolute top-4 right-4 text-[9px] font-mono text-[#525252] flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
        CONNECTED
      </div>
      <div className="absolute bottom-4 left-4 text-[9px] font-mono text-[#525252]">
        SYS.BOOT
      </div>
      <div className="absolute bottom-4 right-4 text-[9px] font-mono text-[#525252]">
        <span className="animate-pulse">█</span>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
