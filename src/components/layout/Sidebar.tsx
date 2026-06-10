"use client";

import { type ReactNode, useState, useEffect, useCallback, useRef } from "react";
import { X } from "lucide-react";
import {
  LayoutDashboard,
  Search,
  Radar,
  Zap,
  Wallet,
  Bell,
  Trophy,
  Settings,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: ReactNode;
  route: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: "Overview", icon: <LayoutDashboard className="w-5 h-5" />, route: "#/dashboard" },
  { label: "Scanner", icon: <Search className="w-5 h-5" />, route: "#/scanner" },
  { label: "Whale Radar", icon: <Radar className="w-5 h-5" />, route: "#/whales" },
  { label: "Sniper", icon: <Zap className="w-5 h-5" />, route: "#/sniper" },
  { label: "Portfolio", icon: <Wallet className="w-5 h-5" />, route: "#/portfolio" },
  { label: "Alerts", icon: <Bell className="w-5 h-5" />, route: "#/alerts", badge: 3 },
  { label: "Leaderboard", icon: <Trophy className="w-5 h-5" />, route: "#/leaderboard" },
  { label: "Settings", icon: <Settings className="w-5 h-5" />, route: "#/settings" },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ collapsed = false, onToggle, isMobileOpen = false, onMobileClose }: SidebarProps) {
  const [activeIndex, setActiveIndex] = useState(() => {
    if (typeof window === "undefined") return 0;
    const hash = window.location.hash || "#/dashboard";
    const idx = navItems.findIndex((item) => hash.startsWith(item.route));
    return idx >= 0 ? idx : 0;
  });

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

  // Swipe-to-close: track touch start/end on the drawer
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    // Swipe left more than 80px → close
    if (diff > 80) {
      onMobileClose?.();
    }
  }, [onMobileClose]);

  return (
    <>
      {/* Mobile: off-canvas drawer */}
      <aside
        className={[
          "md:hidden fixed inset-y-0 left-0 z-50 flex flex-col",
          "bg-[#0a0a0b] border-r border-[rgba(255,255,255,0.06)]",
          "w-[280px]",
          "transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        style={{ paddingTop: 56, paddingBottom: 28 }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Mobile header with close button */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#00ff41]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-[#00ff41] font-mono font-bold text-xs">C</span>
            </div>
            <span className="font-mono font-bold text-[#00ff41] tracking-[0.15em] text-sm">
              COMPO
            </span>
          </div>
          <button
            onClick={onMobileClose}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-[rgba(255,255,255,0.06)] transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-4 h-4 text-[#71717a]" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2 overflow-y-auto overscroll-contain">
          {navItems.map((item, i) => (
            <button
              key={item.label}
              onClick={() => navigateTo(item.route)}
              className={[
                "w-full flex items-center h-11 px-4 relative cursor-pointer",
                "font-mono text-[13px] transition-colors duration-100",
                "gap-3",
                activeIndex === i
                  ? "text-[#00ff41] bg-[rgba(0,255,65,0.05)]"
                  : "text-[#71717a] hover:text-[#e4e4e7] hover:bg-[rgba(255,255,255,0.02)]",
              ].join(" ")}
            >
              {activeIndex === i && (
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#00ff41]" />
              )}
              <span className="flex-shrink-0 relative">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#ef4444] text-white text-[8px] flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Mobile: swipe hint */}
        <div className="px-4 py-2 border-t border-[rgba(255,255,255,0.04)]">
          <p className="font-mono text-[9px] text-[#3a3a3a] text-center">
            ← swipe to close
          </p>
        </div>
      </aside>

      {/* Desktop: static sidebar */}
      <aside
        className={[
          "hidden md:flex fixed left-0 bottom-[28px] flex-col",
          "bg-[#0a0a0b] border-r border-[rgba(255,255,255,0.06)]",
          "transition-all duration-200 ease-out",
          collapsed ? "w-[64px]" : "w-[240px]",
        ].join(" ")}
        style={{ top: 56 }}
      >
        {/* Logo */}
        <div
          className={[
            "flex items-center h-14 px-4 border-b border-[rgba(255,255,255,0.06)]",
            collapsed ? "justify-center" : "gap-2",
          ].join(" ")}
        >
          <div className="w-6 h-6 rounded bg-[#00ff41]/10 flex items-center justify-center flex-shrink-0">
            <span className="text-[#00ff41] font-mono font-bold text-xs">C</span>
          </div>
          {!collapsed && (
            <span className="font-mono font-bold text-[#00ff41] tracking-[0.15em] text-sm">
              COMPO
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {navItems.map((item, i) => (
            <button
              key={item.label}
              onClick={() => navigateTo(item.route)}
              className={[
                "w-full flex items-center h-10 px-4 relative cursor-pointer",
                "font-mono text-[13px] transition-colors duration-100",
                collapsed ? "justify-center" : "gap-3",
                activeIndex === i
                  ? "text-[#00ff41] bg-[rgba(0,255,65,0.05)]"
                  : "text-[#71717a] hover:text-[#e4e4e7] hover:bg-[rgba(255,255,255,0.02)]",
              ].join(" ")}
            >
              {activeIndex === i && (
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#00ff41]" />
              )}
              <span className="flex-shrink-0 relative">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#ef4444] text-white text-[8px] flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Collapse toggle */}
        {onToggle && (
          <button
            onClick={onToggle}
            className="flex items-center justify-center h-10 border-t border-[rgba(255,255,255,0.06)] text-[#525252] hover:text-[#e4e4e7] transition-colors cursor-pointer"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span className="text-xs font-mono">{collapsed ? "»" : "«"}</span>
          </button>
        )}
      </aside>
    </>
  );
}
