// Address truncation: 0x7a3...3f2e
export function truncateAddress(address: string, start = 5, end = 4): string {
  if (!address) return "";
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

// Number formatting
export function formatNumber(num: number, decimals = 2): string {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(decimals)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(decimals)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(decimals)}K`;
  return num.toFixed(decimals);
}

// SOL formatting
export function formatSOL(lamports: number): string {
  const sol = lamports / 1_000_000_000;
  return `${formatNumber(sol)} SOL`;
}

// Currency formatting
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Time ago
export function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// Risk score color (Green 71-100, Yellow 41-70, Red 0-40)
export function riskColor(score: number): string {
  if (score >= 71) return "text-[#10b981]";
  if (score >= 41) return "text-[#f59e0b]";
  return "text-[#ef4444]";
}

// Risk score label
export function riskLabel(score: number): string {
  if (score >= 71) return "SAFE";
  if (score >= 41) return "CAUTION";
  return "DANGER";
}

// Risk score hex color for backgrounds/borders
export function riskHex(score: number): string {
  if (score >= 71) return "#10b981";
  if (score >= 41) return "#f59e0b";
  return "#ef4444";
}

// Price formatting:
// < $1: 6 decimals, $1-$100: 4 decimals, > $100: 2 decimals with commas
export function formatPriceDetailed(price: number): string {
  if (price >= 100) {
    return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (price >= 1) {
    return `$${price.toFixed(4)}`;
  }
  return `$${price.toFixed(6)}`;
}

// SOL amount formatting: always 4 decimals
export function formatSOLAmount(sol: number): string {
  return `${sol.toFixed(4)} SOL`;
}

// Percentage formatting: 2 decimals with sign
export function formatPercent(pct: number): string {
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`;
}

// CSV export helper
export function downloadCSV(filename: string, headers: string[], rows: string[][]): void {
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
