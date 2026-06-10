"use client";

import { type ReactNode, useState } from "react";
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
  badge?: number;
  active?: boolean;
}

const navItems: NavItem[] = [
  { label: "Overview", icon: <LayoutDashboard className="w-5 h-5" />, active: true },
  { label: "Scanner", icon: <Search className="w-5 h-5" /> },
  { label: "Whale Radar", icon: <Radar className="w-5 h-5" /> },
  { label: "Sniper", icon: <Zap className="w-5 h-5" /> },
  { label: "Portfolio", icon: <Wallet className="w-5 h-5" /> },
  { label: "Alerts", icon: <Bell className="w-5 h-5" />, badge: 3 },
  { label: "Leaderboard", icon: <Trophy className="w-5 h-5" /> },
  { label: "Settings", icon: <Settings className="w-5 h-5" /> },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <aside
      className={[
        "fixed left-0 bottom-[28px] flex flex-col",
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
            onClick={() => setActiveIndex(i)}
            className={[
              "w-full flex items-center h-10 px-4 relative",
              "font-mono text-[13px] transition-colors duration-100",
              collapsed ? "justify-center" : "gap-3",
              activeIndex === i
                ? "text-[#00ff41] bg-[rgba(0,255,65,0.05)]"
                : "text-[#71717a] hover:text-[#e4e4e7] hover:bg-[rgba(255,255,255,0.02)]",
            ].join(" ")}
          >
            {/* Active indicator */}
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
    </aside>
  );
}
