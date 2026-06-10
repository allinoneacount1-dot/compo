"use client";

import type { ReactNode } from "react";
import { Search, Bell, Wallet, ChevronDown } from "lucide-react";
import { truncateAddress } from "../../lib/utils/format";

interface TopBarProps {
  title?: string;
  actions?: ReactNode;
}

export function TopBar({ title = "Overview", actions }: TopBarProps) {
  // Mock wallet state — would come from zustand store in real app
  const walletConnected = false;
  const walletAddress = "0x7a3F8e2B9c4D1e5F6a7B3C8d9E0f2A1b4c5D3f2e";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 h-[56px] flex items-center justify-between px-4"
      style={{
        background: "#0a0a0b",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Left: Page title */}
      <div className="flex items-center gap-3">
        <h1 className="font-mono text-[15px] font-bold text-[#00ff41] tracking-wide">
          {title}
        </h1>
      </div>

      {/* Right: Search + Chain + Notifications + Wallet */}
      <div className="flex items-center gap-3">
        {/* Global search */}
        <div className="hidden md:flex items-center relative">
          <Search className="absolute left-3 w-4 h-4 text-[#525252] pointer-events-none" />
          <input
            type="text"
            placeholder="Search tokens, wallets, commands..."
            className={[
              "h-9 w-[280px] rounded pl-9 pr-14",
              "bg-[#030303] border border-[rgba(255,255,255,0.08)]",
              "text-[#e4e4e7] text-xs placeholder:text-[#525252]",
              "focus:outline-none focus:border-[#3b82f6]/50",
              "transition-colors duration-150 font-mono",
            ].join(" ")}
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.06)] text-[#525252] text-[10px] font-mono">
            ⌘K
          </kbd>
        </div>

        {/* Chain indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.15)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
          <span className="font-mono text-[10px] text-[#10b981] tracking-wider font-medium">
            SOLANA ● LIVE
          </span>
        </div>

        {/* Notification bell */}
        <button className="relative w-9 h-9 rounded flex items-center justify-center bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] transition-colors">
          <Bell className="w-4 h-4 text-[#71717a]" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ef4444] text-white text-[8px] flex items-center justify-center font-bold">
            5
          </span>
        </button>

        {/* Wallet button */}
        {walletConnected ? (
          <button className="flex items-center gap-2 h-9 px-3 rounded bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.2)] hover:border-[rgba(59,130,246,0.4)] transition-colors">
            <Wallet className="w-4 h-4 text-[#3b82f6]" />
            <span className="font-mono text-xs text-[#3b82f6]">
              {truncateAddress(walletAddress, 4, 4)}
            </span>
            <ChevronDown className="w-3 h-3 text-[#3b82f6]" />
          </button>
        ) : (
          <button className="flex items-center gap-2 h-9 px-3 rounded bg-[#3b82f6] hover:bg-[#2563eb] transition-colors">
            <Wallet className="w-4 h-4 text-white" />
            <span className="text-xs text-white font-medium">Connect Wallet</span>
          </button>
        )}

        {/* Slot for additional actions */}
        {actions}
      </div>
    </header>
  );
}
