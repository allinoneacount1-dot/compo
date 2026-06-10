"use client";

import { Search, Bell, Wallet, Menu } from "lucide-react";

interface TopBarProps {
  title?: string;
  onMobileMenuToggle?: () => void;
}

export function TopBar({ title = "Overview", onMobileMenuToggle }: TopBarProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6"
      style={{ background: "#111111", borderBottom: "1px solid #222" }}
    >
      {/* Left: Mobile menu + Logo */}
      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded hover:bg-[#1a1a1a] transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 text-[#a1a1aa]" />
        </button>
        <span className="font-mono text-lg font-bold text-[#00ff9f]">&gt; COMPO</span>
      </div>

      {/* Center: Global Search */}
      <div className="flex-1 flex justify-center px-6">
        <div className="relative w-full max-w-[420px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525b] pointer-events-none" />
          <input
            type="text"
            placeholder="Search tokens, wallets, or commands..."
            className="w-full h-10 bg-[#161616] border border-[#222] rounded-lg pl-10 pr-14 text-sm text-white placeholder:text-[#52525b] focus:outline-none focus:border-[#00ff9f]/40 transition-colors font-mono"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-[#222] text-[#52525b] text-[10px] font-mono">⌘K</kbd>
        </div>
      </div>

      {/* Right: SOL price + Connect + Notifications + Live */}
      <div className="flex items-center gap-4 shrink-0">
        {/* SOL price */}
        <div className="hidden sm:flex items-center gap-1.5 font-mono text-sm">
          <span className="text-[#a1a1aa]">$SOL</span>
          <span className="text-[#00ff9f]">178.00</span>
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-lg flex items-center justify-center bg-[#161616] border border-[#222] hover:border-[#333] transition-colors">
          <Bell className="w-4 h-4 text-[#a1a1aa]" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ff3b5c] text-white text-[8px] flex items-center justify-center font-bold">3</span>
        </button>

        {/* Wallet Connect */}
        <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[#00ff9f] hover:bg-[#00cc7f] transition-colors">
          <Wallet className="w-4 h-4 text-black" />
          <span className="hidden sm:inline text-xs text-black font-semibold">Connect</span>
        </button>

        {/* Live indicator */}
        <div className="hidden lg:flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00ff9f] animate-pulse" />
          <span className="text-xs text-[#00ff9f] font-mono">LIVE</span>
        </div>
      </div>
    </header>
  );
}
