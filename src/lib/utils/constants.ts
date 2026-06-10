export const COMPO = {
  name: "COMPO",
  tagline: "See Everything. Before Everyone.",
  description: "Solana Intelligence Terminal",
  version: "1.0.0",
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
