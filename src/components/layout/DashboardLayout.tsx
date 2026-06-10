"use client";

import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { StatusBar } from "./StatusBar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="h-[100dvh] overflow-hidden">
      <Sidebar />
      <TopBar />
      <StatusBar />
      <main
        className="h-[100dvh] overflow-y-auto"
        style={{
          marginLeft: 240,
          paddingTop: 56,
          paddingBottom: 28,
        }}
      >
        {children}
      </main>
    </div>
  );
}
