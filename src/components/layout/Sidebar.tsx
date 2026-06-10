"use client";

import { useState } from "react";
import {
  LayoutDashboard, ScanLine, Radio, Crosshair, Briefcase,
  Bell, Trophy, Settings, Activity, ChevronLeft, ChevronRight,
  Terminal,
} from "lucide-react";

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview", route: "#/dashboard" },
  { icon: ScanLine, label: "Scanner", route: "#/scanner" },
  { icon: Radio, label: "Whale Radar", route: "#/whales" },
  { icon: Crosshair, label: "Sniper", route: "#/sniper" },
  { icon: Briefcase, label: "Portfolio", route: "#/portfolio" },
  { icon: Bell, label: "Alerts", route: "#/alerts" },
  { icon: Trophy, label: "Leaderboard", route: "#/leaderboard" },
  { icon: Activity, label: "On-Chain Intel", route: "#/onchain" },
  { icon: Settings, label: "Settings", route: "#/settings" },
];

export function Sidebar({ isMobileOpen = false, onMobileClose, collapsed = false, onToggleCollapse }: SidebarProps) {
  const [active, setActive] = useState("#/dashboard");

  const handleNav = (route: string) => {
    setActive(route);
    window.location.hash = route;
    onMobileClose?.();
  };

  const w = collapsed ? "w-[72px]" : "w-[260px]";

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={[
          "hidden md:flex flex-col h-[100dvh] bg-[#111] border-r border-[#222]",
          "fixed left-0 top-0 z-30 transition-all duration-300",
          w,
        ].join(" ")}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#222] shrink-0">
          {!collapsed && (
            <button onClick={() => handleNav("#/landing")} className="flex items-center gap-2 cursor-pointer">
              <Terminal className="w-4 h-4 text-[#00ff9f]" />
              <span className="font-mono font-bold text-[#00ff9f] text-sm tracking-[0.15em]">COMPO_</span>
            </button>
          )}
          {collapsed && (
            <button onClick={() => handleNav("#/landing")} className="mx-auto cursor-pointer">
              <Terminal className="w-4 h-4 text-[#00ff9f]" />
            </button>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex items-center justify-center h-8 border-b border-[#222] text-[#52525b] hover:text-white transition-colors shrink-0"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.route;
            return (
              <button
                key={item.route}
                onClick={() => handleNav(item.route)}
                title={collapsed ? item.label : undefined}
                className={[
                  "w-full flex items-center gap-3 h-10 px-4 transition-colors cursor-pointer",
                  "hover:bg-[#1a1a1a]",
                  isActive ? "bg-[#00ff9f]/5 text-[#00ff9f] border-r-[3px] border-r-[#00ff9f]" : "text-[#52525b]",
                  collapsed ? "justify-center px-0" : "",
                ].join(" ")}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="font-mono text-[11px] tracking-wider">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <aside className="md:hidden fixed inset-y-0 left-0 z-50 w-[260px] bg-[#111] border-r border-[#222] flex flex-col">
          <div className="h-16 flex items-center justify-between px-4 border-b border-[#222]">
            <button onClick={() => handleNav("#/landing")} className="flex items-center gap-2 cursor-pointer">
              <Terminal className="w-4 h-4 text-[#00ff9f]" />
              <span className="font-mono font-bold text-[#00ff9f] text-sm tracking-[0.15em]">COMPO_</span>
            </button>
            <button onClick={onMobileClose} className="text-[#52525b] hover:text-white text-xl cursor-pointer">✕</button>
          </div>
          <nav className="flex-1 overflow-y-auto py-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => handleNav(item.route)}
                  className={[
                    "w-full flex items-center gap-3 h-10 px-4 transition-colors cursor-pointer",
                    "hover:bg-[#1a1a1a]",
                    isActive ? "bg-[#00ff9f]/5 text-[#00ff9f] border-r-[3px] border-r-[#00ff9f]" : "text-[#52525b]",
                  ].join(" ")}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="font-mono text-[11px] tracking-wider">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>
      )}
    </>
  );
}
