"use client";

import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { StatusBar } from "./StatusBar";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title = "Overview" }: DashboardLayoutProps) {
  return (
    <div className="h-[100dvh] overflow-hidden">
      <Sidebar />
      <TopBar title={title} />
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
