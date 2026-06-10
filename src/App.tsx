import { useState, useEffect } from "react";
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

function App() {
  const [page, setPage] = useState<Page>("booting");

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "") || "/";
      if (hash.startsWith("/scanner")) setPage("scanner");
      else if (hash.startsWith("/whales")) setPage("whales");
      else if (hash.startsWith("/sniper")) setPage("sniper");
      else if (hash.startsWith("/dashboard")) setPage("dashboard");
      else setPage("landing");
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  if (page === "booting") {
    return <BootingPage />;
  }

  if (page === "landing") {
    return <LandingPage />;
  }

  // All dashboard pages wrapped in DashboardLayout
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
