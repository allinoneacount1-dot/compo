"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { StatusBar } from "./StatusBar";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  onMobileMenuToggle?: () => void;
}

export function DashboardLayout({ children, title = "Overview", isMobileOpen = false, onMobileClose, onMobileMenuToggle }: DashboardLayoutProps) {
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

  return (
    <div className="h-[100dvh] overflow-hidden">
      {/* Mobile overlay when sidebar is open */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
        isMobileOpen={isMobileOpen}
        onMobileClose={onMobileClose}
      />
      <TopBar
        title={title}
        isMobileOpen={isMobileOpen}
        onMobileClose={onMobileClose}
        onMobileMenuToggle={onMobileMenuToggle}
      />
      <StatusBar />
      <main
        className={[
          "h-[100dvh] overflow-y-auto overflow-x-hidden transition-[margin-left] duration-200 ease-out",
          "ml-0",
          sidebarCollapsed ? "md:ml-[64px]" : "md:ml-[240px]",
        ].join(" ")}
        style={{
          paddingTop: 56,
          paddingBottom: 28,
        }}
      >
        {children}
      </main>
    </div>
  );
}
