"use client";

import { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { StatusBar } from "./StatusBar";
import { CommandPalette, useCommandPalette } from "../ui/CommandPalette";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  onMobileMenuToggle?: () => void;
}

export function DashboardLayout({ children, title = "Overview", isMobileOpen = false, onMobileClose, onMobileMenuToggle }: DashboardLayoutProps) {
  const { isOpen, setIsOpen } = useCommandPalette();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches && isMobileOpen) {
        onMobileClose?.();
      }
    };
    mq.addEventListener("change", handler as any);
    return () => mq.removeEventListener("change", handler as any);
  }, [isMobileOpen, onMobileClose]);

  const handleNavigate = useCallback((route: string) => {
    window.location.hash = route;
    setIsOpen(false);
  }, [setIsOpen]);

  const sidebarW = sidebarCollapsed ? 72 : 260;

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#0a0a0a]">
      {/* Mobile overlay when sidebar is open */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onMobileClose} aria-hidden="true" />
      )}

      {/* Sidebar: collapsible */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        onMobileClose={onMobileClose}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Topbar: fixed 64px */}
      <TopBar title={title} onMobileMenuToggle={onMobileMenuToggle} sidebarCollapsed={sidebarCollapsed} />

      {/* Status bar */}
      <StatusBar sidebarCollapsed={sidebarCollapsed} />

      {/* Command Palette */}
      <CommandPalette isOpen={isOpen} onClose={() => setIsOpen(false)} onNavigate={handleNavigate} />

      {/* Main content: scrollable, offset by topbar + sidebar */}
      <main
        className="h-[calc(100dvh-64px)] overflow-y-auto overflow-x-auto pt-16 transition-all duration-300"
        style={{ marginLeft: sidebarW, paddingBottom: 28 }}
      >
        {children}
      </main>
    </div>
  );
}
