"use client";

import { useState, useEffect } from "react";
import { Search, Menu, Bell, Wallet } from "lucide-react";

interface TopBarProps {
  title?: string;
  onMobileMenuToggle?: () => void;
  sidebarCollapsed?: boolean;
}

export function TopBar({ title = "Overview", onMobileMenuToggle, sidebarCollapsed = false }: TopBarProps) {
  const [solPrice, setSolPrice] = useState("178.00");

  useEffect(() => {
    const interval = setInterval(() => {
      setSolPrice((prev) => {
        const base = parseFloat(prev);
        return (base + (Math.random() - 0.5) * 0.5).toFixed(2);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 right-0 z-20 h-16 flex items-center justify-between px-4 bg-[#111]/95 backdrop-blur-md border-b border-[#222] transition-all duration-300"
      style={{ left: sidebarCollapsed ? 72 : 260 }}
    >
      {/* Left: Mobile menu + Title */}
      <div className="flex items-center gap-3">
        <button onClick={onMobileMenuToggle} className="md:hidden text-[#52525b] hover:text-white cursor-pointer">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="font-mono text-sm font-semibold text-white">{title}</h1>
      </div>

      {/* Right: Search + SOL price + Wallet + Notifications */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 bg-[#1a1a1a] border border-[#222] rounded-lg px-3 h-8">
          <Search className="w-3.5 h-3.5 text-[#52525b]" />
          <span className="font-mono text-[10px] text-[#52525b]">⌘K</span>
        </div>

        {/* SOL Price */}
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-[#1a1a1a] rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9945FF]" />
          <span className="font-mono text-[11px] text-white">◎{solPrice}</span>
        </div>

        {/* Notifications */}
        <button className="relative text-[#52525b] hover:text-white cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#ff3b5c] rounded-full" />
        </button>

        {/* Wallet */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00ff9f] text-black font-mono text-[11px] font-bold rounded-lg hover:bg-[#00e08f] transition-colors cursor-pointer">
          <Wallet className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Connect</span>
        </button>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9f] animate-pulse" />
          <span className="font-mono text-[9px] text-[#52525b]">LIVE</span>
        </div>
      </div>
    </header>
  );
}
