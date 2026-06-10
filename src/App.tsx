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

type Page = "booting" | "landing" | "dashboard" | "scanner" | "whales" | "sniper";

function getInitialPage(): Page {
  if (typeof window === "undefined") return "booting";
  const hash = window.location.hash.replace("#", "") || "/";
  if (hash.startsWith("/scanner")) return "scanner";
  if (hash.startsWith("/whales")) return "whales";
  if (hash.startsWith("/sniper")) return "sniper";
  if (hash.startsWith("/dashboard")) return "dashboard";
  if (hash === "/landing") return "landing";
  return "booting";
}

function App() {
  const [page, setPage] = useState<Page>(getInitialPage);

  const handleHash = useCallback(() => {
    const hash = window.location.hash.replace("#", "") || "/";
    if (hash.startsWith("/scanner")) setPage("scanner");
    else if (hash.startsWith("/whales")) setPage("whales");
    else if (hash.startsWith("/sniper")) setPage("sniper");
    else if (hash.startsWith("/dashboard")) setPage("dashboard");
    else if (hash === "/landing") setPage("landing");
    else setPage("landing");
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
    default:
      content = <DashboardOverview />;
  }

  return <DashboardLayout>{content}</DashboardLayout>;
}

export default App;
