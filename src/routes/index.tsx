"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Shield, Activity, Database, Cpu, Radio } from "lucide-react";
import { TERMINAL_MESSAGES } from "../lib/utils/constants";
import "../styles/terminal.css";

type BootPhase =
  | "black"
  | "logo"
  | "tagline"
  | "progress"
  | "status"
  | "access"
  | "done";

const STATUS_ICONS = [Database, Cpu, Radio];

const BOOT_PHASE_DURATIONS = {
  black: 600,
  progress: 2000, // 2s for progress bar
  access: 1200,
  done: 800,
} as const;

const STATUS_INTERVAL = 380; // ms between each status line

export default function BootingPage() {
  const [phase, setPhase] = useState<BootPhase>("black");
  const [progress, setProgress] = useState(0);
  const [visibleStatuses, setVisibleStatuses] = useState(0);
  const [bootMessages] = useState(TERMINAL_MESSAGES.booting);

  // ---- Phase machine ----
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setPhase("logo"), BOOT_PHASE_DURATIONS.black));
    timers.push(setTimeout(() => setPhase("tagline"), 900));
    timers.push(setTimeout(() => setPhase("progress"), 1500));

    // Progress bar animation (0 -> 100 over ~2s)
    timers.push(
      setTimeout(() => {
        let p = 0;
        const step = setInterval(() => {
          p += 2;
          if (p >= 100) {
            p = 100;
            clearInterval(step);
            setPhase("status");
          }
          setProgress(p);
        }, 40);
        timers.push(step as unknown as ReturnType<typeof setTimeout>);
      }, 2000)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  // ---- Status lines appear one-by-one ----
  useEffect(() => {
    if (phase !== "status") return;

    let idx = 0;

    const showNext = () => {
      idx++;
      setVisibleStatuses(idx);
      if (idx < bootMessages.length - 1) {
        // Still showing system lines
        setTimeout(showNext, STATUS_INTERVAL);
      } else if (idx === bootMessages.length - 1) {
        // Last system line shown — wait, then show ACCESS GRANTED
        setTimeout(() => {
          idx++;
          setVisibleStatuses(idx);
          setTimeout(() => setPhase("done"), BOOT_PHASE_DURATIONS.access);
        }, STATUS_INTERVAL);
      }
    };

    const initial = setTimeout(showNext, 300);
    return () => clearTimeout(initial);
  }, [phase, bootMessages.length]);

  // ---- Navigate after boot completes ----
  const navigate = useCallback((path: string) => {
    window.location.hash = path;
  }, []);

  useEffect(() => {
    if (phase !== "done") return;

    // Check wallet connection
    const hasWallet = localStorage.getItem("compo_wallet_connected") === "true";

    const timer = setTimeout(() => {
      navigate(hasWallet ? "#/dashboard" : "#/landing");
    }, BOOT_PHASE_DURATIONS.done);

    return () => clearTimeout(timer);
  }, [phase, navigate]);

  // ---- Derived state ----
  const isDone = phase === "done";

  return (
    <div className="relative w-screen h-screen bg-[#030303] overflow-hidden crt-effect">
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,255,65,0.03) 1px, rgba(0,255,65,0.03) 2px)",
          backgroundSize: "100% 2px",
        }}
      />

      {/* Moving scanline bar */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] bg-[#00ff41]/20 blur-[1px] z-40"
        initial={{ top: 0 }}
        animate={{ top: "100%" }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 font-[var(--font-data)]">
        {/* ---- Phase: Logo ---- */}
        <AnimatePresence>
          {(phase === "logo" || phase === "tagline" || phase === "progress" || phase === "status" || phase === "done") && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, scale: 0.8, filter: "blur(8px)" }}
              animate={{
                opacity: isDone ? 0.6 : 1,
                scale: isDone ? 0.9 : 1,
                filter: "blur(0px)",
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <Terminal
                  className="w-10 h-10 text-[#00ff41]"
                  style={{ filter: "drop-shadow(0 0 8px rgba(0,255,65,0.5))" }}
                />
                <h1
                  className="text-5xl md:text-6xl font-bold tracking-[0.2em] text-[#00ff41]"
                  style={{
                    textShadow: "0 0 20px rgba(0,255,65,0.6), 0 0 40px rgba(0,255,65,0.2)",
                  }}
                >
                  COMPO
                </h1>
              </div>

              {/* Tagline */}
              <AnimatePresence>
                {(phase === "tagline" || phase === "progress" || phase === "status" || phase === "done") && (
                  <motion.p
                    key="tagline"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: isDone ? 0 : 0.7, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-sm md:text-base tracking-[0.15em] uppercase text-[#00ff41]/70 font-medium"
                  >
                    Solana Intelligence Terminal
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Spacer */}
        {(phase === "progress" || phase === "status" || phase === "done") && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 12 }}
            className="w-full"
          />
        )}

        {/* ---- Phase: Progress bar ---- */}
        {(phase === "progress" || phase === "status" || isDone) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: isDone ? 0 : 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-2 text-[10px] uppercase tracking-wider">
              <span className="text-[#00ff41]/50 flex items-center gap-1.5">
                <Activity className="w-3 h-3" />
                Initializing
              </span>
              <span className="text-[#00ff41]/70 tabular-nums">{progress}%</span>
            </div>
            <div className="h-[2px] w-full bg-[#00ff41]/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#00ff41] rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.05 }}
              />
            </div>
          </motion.div>
        )}

        {/* ---- Phase: Status lines ---- */}
        {(phase === "status" || isDone) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isDone ? 0.4 : 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md mt-8 space-y-2"
          >
            {bootMessages.map((msg, i) => {
              if (i >= visibleStatuses) return null;

              const isAccessGranted = i === bootMessages.length - 1;
              const Icon = STATUS_ICONS[i - 1]; // First message has no icon prefix (index 0)

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{
                    opacity: isDone ? 0.4 : isAccessGranted ? 1 : 0.7,
                    x: 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`flex items-center gap-3 text-xs md:text-sm ${
                    isAccessGranted
                      ? "text-[#00ff41] font-bold tracking-wider"
                      : "text-[#00ff41]/60"
                  }`}
                >
                  {/* Status bracket prefix */}
                  <span className="text-[#00ff41]/30 select-none">[</span>

                  {/* Icon for system lines */}
                  {!isAccessGranted && Icon && (
                    <Icon className="w-3.5 h-3.5 text-[#00ff41]/50 flex-shrink-0" />
                  )}
                  {isAccessGranted && (
                    <Shield
                      className="w-3.5 h-3.5 text-[#00ff41] flex-shrink-0"
                      style={{ filter: "drop-shadow(0 0 4px rgba(0,255,65,0.6))" }}
                    />
                  )}

                  <span className="flex-1">{msg}</span>

                  {/* Blinking cursor on last visible line */}
                  {i === visibleStatuses - 1 && !isDone && (
                    <span className="terminal-blink text-[#00ff41] w-[6px] h-[12px] bg-[#00ff41] inline-block" />
                  )}

                  <span className="text-[#00ff41]/30 select-none">]</span>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ---- ACCESS GRANTED flash ---- */}
        {(visibleStatuses >= bootMessages.length || isDone) && (
          <AnimatePresence>
            {!isDone && (
              <motion.div
                key="access-shield"
                initial={{ opacity: 0, scale: 2 }}
                animate={{ opacity: 0.08, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute bottom-8 right-8"
              >
                <Shield className="w-32 h-32 text-[#00ff41]" />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* ---- Corner decorations ---- */}
        <div className="absolute top-4 left-4 text-[9px] text-[#00ff41]/20 space-y-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00ff41]/30" />
            SYS v1.0.0
          </div>
        </div>

        <div className="absolute top-4 right-4 text-[9px] text-[#00ff41]/20 space-y-0.5 text-right">
          <div className="flex items-center justify-end gap-1.5">
            CONNECTED
            <Radio className="w-2.5 h-2.5" />
          </div>
        </div>

        {/* Bottom status */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4 text-[9px] text-[#00ff41]/15">
          <span>SOLANA MAINNET-BETA</span>
          <span className="terminal-blink">_</span>
          <span>COMPO INTELLIGENCE TERMINAL</span>
        </div>
      </div>

      {/* Transition fade-out */}
      <AnimatePresence>
        {isDone && (
          <motion.div
            key="fade-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-[#030303] z-30"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
