export const COMPO = {
  name: "COMPO",
  tagline: "See Everything. Before Everyone.",
  headline: "MARKET WARFARE TERMINAL",
  subhead: "The Operating System For Solana Markets",
  description: "Solana Intelligence Terminal",
  version: "1.0.0",
} as const;

export const ALPHA_SCORE = {
  score: 91,
  label: "ALPHA SCORE",
  status: "EXCELLENT",
  trend: "+3.2%",
} as const;

export const LIVE_STATS = {
  whalesTracked: 1203,
  smartMoneyFlow: "+$12.4M",
  rugAlerts: 3,
  trackedVolume: "$742M",
  walletsMonitored: 12491,
  alertsTriggered: 89302,
  tradersCount: 2847,
} as const;

export const RISK_THRESHOLDS = {
  SAFE: 70,
  CAUTION: 40,
  DANGER: 20,
} as const;

export const TERMINAL_MESSAGES = {
  booting: [
    "Connecting to Solana RPC... OK",
    "Loading whale database... OK",
    "Scanner engine... ACTIVE",
    "Alert system... ONLINE",
    "ACCESS GRANTED",
  ],
  hero: [
    "$ compo --scan solana",
    "Scanning 14,847 tokens...",
    "3 rug pulls detected",
    "12 whale movements flagged",
    "You're early. Or you're exit liquidity.",
  ],
} as const;

// Live feed mock data generator
export const WHALE_FEEDS = [
  { type: "BUY", amount: "$430k", token: "BONK", time: "2 sec ago", addr: "0x7a2F...e4B1" },
  { type: "BUY", amount: "$218k", token: "WIF", time: "5 sec ago", addr: "0x3bC8...f2A9" },
  { type: "SELL", amount: "$95k", token: "JUP", time: "11 sec ago", addr: "0x9eD1...c7F3" },
  { type: "BUY", amount: "$1.2M", token: "SOL", time: "18 sec ago", addr: "0x1fE5...a8D6" },
  { type: "BUY", amount: "$560k", token: "PYTH", time: "22 sec ago", addr: "0x5cA2...b1E4" },
  { type: "SELL", amount: "$340k", token: "BONK", time: "29 sec ago", addr: "0x8dF3...a2C7" },
  { type: "BUY", amount: "$890k", token: "ORCA", time: "34 sec ago", addr: "0x2eA7...b3F9" },
  { type: "ALERT", amount: "LP Unlocked", token: "RUGGY", time: "41 sec ago", addr: "0x4fC1...d8E2" },
];

export const SMART_MONEY_FEEDS = [
  { label: "Wallet #291", action: "Bought 14,000 USDC worth of PYTH", time: "5 sec ago", direction: "buy" },
  { label: "Wallet #103", action: "Added 420 SOL liquidity to WIF/SOL", time: "12 sec ago", direction: "buy" },
  { label: "Wallet #447", action: "Sold 8,200 BONK for 185 SOL", time: "19 sec ago", direction: "sell" },
  { label: "Wallet #088", action: "Deployed new position: 2,400 SOL into JUP", time: "27 sec ago", direction: "buy" },
  { label: "Wallet #512", action: "Executed limit order: 500 SOL → USDC at $178.2", time: "35 sec ago", direction: "sell" },
  { label: "Wallet #369", action: "Accumulating ORCA: +$340K in last hour", time: "43 sec ago", direction: "buy" },
];
