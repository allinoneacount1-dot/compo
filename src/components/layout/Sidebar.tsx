"use client";

import { type ReactNode, useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard, Search, Radar, Zap, Wallet, Bell, Trophy, Settings, Activity,
  ChevronLeft, ChevronRight,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: ReactNode;
  route: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: "Overview", icon: <LayoutDashboard className="w-[18px] h-[18px]" />, route: "#/dashboard" },
  { label: "Scanner", icon: <Search className="w-[18px] h-[18px]" />, route: "#/scanner" },
  { label: "Whale Radar", icon: <Radar className="w-[18px] h-[18px]" />, route: "#/whales" },
  { label: "Sniper", icon: <Zap className="w-[18px] h-[18px]" />, route: "#/sniper" },
  { label: "Portfolio", icon: <Wallet className="w-[18px] h-[18px]" />, route: "#/portfolio" },
  { label: "Alerts", icon: <Bell className="w-[18px] h-[18px]" />, route: "#/alerts", badge: 3 },
  { label: "Leaderboard", icon: <Trophy className="w-[18px] h-[18px]" />, route: "#/leaderboard" },
  { label: "On-Chain", icon: <Activity className="w-[18px] h-[18px]" />, route: "#/onchain" },
  { label: "Settings", icon: <Settings className="w-[18px] h-[18px]" />, route: "#/settings" },
];

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ isMobileOpen = false, onMobileClose }: SidebarProps) {
  const [activeIndex, setActiveIndex] = useState(() => {
    if (typeof window === "undefined") return 0;
    const hash = window.location.hash || "#/dashboard";
    const idx = navItems.findIndex((item) => hash.startsWith(item.route));
    return idx >= 0 ? idx : 0;
  });

  const [collapsed, setCollapsed] = useState(false);

  const navigateTo = useCallback((route: string) => {
    window.location.hash = route;
    const idx = navItems.findIndex((item) => item.route === route);
    if (idx >= 0) setActiveIndex(idx);
    onMobileClose?.();
  }, [onMobileClose]);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash || "#/dashboard";
      const idx = navItems.findIndex((item) => hash.startsWith(item.route));
      if (idx >= 0) setActiveIndex(idx);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <>
      {/* Mobile: off-canvas drawer */}
      <aside
        className={[
          "md:hidden fixed inset-y-0 left-0 z-50 flex flex-col",
          "bg-[#111111] border-r border-[#222]",
          "w-[260px]",
          "transition-transform duration-300 ease-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        style={{ top: 64, bottom: 28 }}
      >
        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map((item, i) => (
            <button
              key={item.label}
              onClick={() => navigateTo(item.route)}
              className={[
                "w-full flex items-center h-11 px-4 relative cursor-pointer",
                "font-mono text-[13px] transition-colors duration-100 gap-3",
                activeIndex === i
                  ? "text-[#00ff9f] bg-[#1a1a1a]"
                  : "text-[#52525b] hover:text-white hover:bg-[#1a1a1a]",
              ].join(" ")}
            >
              {activeIndex === i && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#00ff9f]" />
              )}
              <span className="flex-shrink-0 relative">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#ff3b5c] text-white text-[7px] flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Desktop: static sidebar, fixed, starts below topbar */}
      <aside
        className={[
          "hidden md:flex fixed left-0 flex-col z-40",
          "bg-[#111111] border-r border-[#222]",
          "transition-[width] duration-200 ease-out",
          collapsed ? "w-[60px]" : "w-[260px]",
        ].join(" ")}
        style={{ top: 64, bottom: 28 }}
      >
        {/* Navigation */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map((item, i) => (
            <button
              key={item.label}
              onClick={() => navigateTo(item.route)}
              title={collapsed ? item.label : undefined}
              className={[
                "w-full flex items-center h-11 relative cursor-pointer",
                "font-mono text-[13px] transition-colors duration-100",
                collapsed ? "justify-center px-0" : "gap-3 px-4",
                activeIndex === i
                  ? "text-[#00ff9f] bg-[#1a1a1a]"
                  : "text-[#52525b] hover:text-white hover:bg-[#1a1a1a]",
              ].join(" ")}
            >
              {activeIndex === i && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#00ff9f]" />
              )}
              <span className="flex-shrink-0 relative">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#ff3b5c] text-white text-[7px] flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center h-10 border-t border-[#222] text-[#52525b] hover:text-white transition-colors cursor-pointer"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>
    </>
  );
}
