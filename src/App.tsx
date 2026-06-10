import { useState, useEffect, useCallback } from "react";
import "./styles/globals.css";
import "./styles/terminal.css";
import BootingPage from "./routes/index";
import LandingPage from "./routes/landing";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import DashboardOverview from "./routes/dashboard/index";
import ScannerPage from "./routes/dashboard/scanner";
import WhalesPage from "./routes/dashboard/whales";
import SniperPage from "./routes/dashboard/sniper";
import PortfolioPage from "./routes/dashboard/portfolio";
import AlertsPage from "./routes/dashboard/alerts";
import LeaderboardPage from "./routes/dashboard/leaderboard";
import SettingsPage from "./routes/dashboard/settings";
import DocsPage from "./routes/docs";

type Page = "booting" | "landing" | "docs" | "dashboard" | "scanner" | "whales" | "sniper" | "portfolio" | "alerts" | "leaderboard" | "settings";

function getInitialPage(): Page {
  if (typeof window === "undefined") return "booting";
  const hash = window.location.hash.replace("#", "") || "/";
  if (hash.startsWith("/scanner")) return "scanner";
  if (hash.startsWith("/whales")) return "whales";
  if (hash.startsWith("/sniper")) return "sniper";
  if (hash.startsWith("/portfolio")) return "portfolio";
  if (hash.startsWith("/alerts")) return "alerts";
  if (hash.startsWith("/leaderboard")) return "leaderboard";
  if (hash.startsWith("/settings")) return "settings";
  if (hash.startsWith("/docs")) return "docs";
  if (hash.startsWith("/dashboard")) return "dashboard";
  if (hash === "/landing") return "landing";
  return "booting";
}

function getPageTitle(page: Page): string {
  switch (page) {
    case "scanner": return "Scanner";
    case "whales": return "Whale Radar";
    case "sniper": return "Sniper";
    case "portfolio": return "Portfolio";
    case "alerts": return "Alerts";
    case "leaderboard": return "Leaderboard";
    case "settings": return "Settings";
    default: return "Overview";
  }
}

function App() {
  const [page, setPage] = useState<Page>(getInitialPage);

  const handleHash = useCallback(() => {
    setPage(getInitialPage());
  }, []);

  useEffect(() => {
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [handleHash]);

  if (page === "booting") {
    return <BootingPage />;
  }

  if (page === "landing") {
    return <LandingPage />;
  }

  if (page === "docs") {
    return <DocsPage />;
  }

  let content;
  switch (page) {
    case "scanner":
      content = <ScannerPage />;
      break;
    case "whales":
      content = <WhalesPage />;
      break;
    case "sniper":
      content = <SniperPage />;
      break;
    case "portfolio":
      content = <PortfolioPage />;
      break;
    case "alerts":
      content = <AlertsPage />;
      break;
    case "leaderboard":
      content = <LeaderboardPage />;
      break;
    case "settings":
      content = <SettingsPage />;
      break;
    default:
      content = <DashboardOverview />;
  }

  return <DashboardLayout title={getPageTitle(page)}>{content}</DashboardLayout>;
}

export default App;
