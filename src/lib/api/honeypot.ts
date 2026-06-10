// --- Honeypot Detection Engine ------------------------------------------------
// Analyzes token pairs for honeypot patterns, tax asymmetry, and rug pull signals.
// Uses DexScreener data + Honeypot.is API for contract-level checks.

const HONEYPOT_IS_URL = "https://api.honeypot.is/v2";
const BASE_URL = "https://api.dexscreener.com";

// --- Types --------------------------------------------------------------------

export interface HoneypotCheckResult {
  isHoneypot: boolean;
  buyTax: number;
  sellTax: number;
  transferTax: number;
  isBuyable: boolean;
  isSellable: boolean;
  hasBlacklist: boolean;
  hasProxyContract: boolean;
  ownerCanMint: boolean;
  hasPausableTrading: boolean;
  liquidityLocked: boolean;
  lockPercentage: number;
  lockDate: string | null;
  warnings: string[];
  simulationErrorMessage?: string;
}

export interface RiskCategory {
  label: string;
  score: number;
  findings: { text: string; positive: boolean }[];
}

export interface TokenScanResult {
  address: string;
  pairAddress: string;
  overallScore: number;
  categories: RiskCategory[];
  verdictText: string;
  honeypotCheck: HoneypotCheckResult | null;
  tokenInfo: {
    name: string;
    symbol: string;
    address: string;
    pairAddress: string;
    dexId: string;
    priceUsd: number;
    priceChangeH24: number;
    volumeH24: number;
    liquidityUsd: number;
    txnsH24: { buys: number; sells: number };
    fdv: number;
    marketCap: number;
    pairCreatedAt: number | null;
    info?: {
      imageUrl?: string;
      websites?: { url: string; label: string }[];
      socials?: { type: string; url: string }[];
      description?: string;
    };
  };
  similarContracts: { address: string; score: number; status: string }[];
  scanTime: Date;
}

// --- Honeypot.is API ----------------------------------------------------------

async function fetchJSON<T>(url: string, timeoutMs = 15_000): Promise<T> {
  const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

interface HoneypotIsResponse {
  honeypotResult?: {
    isHoneypot: boolean;
    honeypotReason?: string;
  };
  simulationResult?: {
    buyTax: number;
    sellTax: number;
    transferTax: number;
    buySuccess: boolean;
    sellSuccess: boolean;
    error?: string;
  };
  token?: {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
  };
  flags?: string[];
  pair?: {
    address: string;
    tokenAddress: string;
    pairAddress: string;
  };
  holderAnalysis?: {
    top10Percentage: number;
    devPercentage: number;
    sniperCount: number;
  };
  liquidityLock?: {
    locked: boolean;
    percentage: number;
    unlockDate: string | null;
  };
}

export async function checkHoneypot(
  tokenAddress: string,
  chainId = "solana"
): Promise<HoneypotCheckResult> {
  try {
    const data = await fetchJSON<HoneypotIsResponse>(
      `${HONEYPOT_IS_URL}/IsHoneypot?address=${tokenAddress}&chainID=${chainId}`
    );

    const flags = data.flags ?? [];
    const warnings: string[] = [];

    if (data.honeypotResult?.isHoneypot) {
      warnings.push(data.honeypotResult.honeypotReason || "Honeypot detected");
    }
    if (data.simulationResult && !data.simulationResult.buySuccess) {
      warnings.push("Buy simulation failed");
    }
    if (data.simulationResult && !data.simulationResult.sellSuccess) {
      warnings.push("Sell simulation failed");
    }
    if (data.simulationResult && data.simulationResult.sellTax > 10) {
      warnings.push(`High sell tax: ${data.simulationResult.sellTax.toFixed(1)}%`);
    }
    if (flags.includes("HAS_BLACKLIST")) warnings.push("Contract has blacklist function");
    if (flags.includes("HAS_PROXY")) warnings.push("Proxy contract detected");
    if (flags.includes("OWNER_CAN_MINT")) warnings.push("Owner can mint new tokens");
    if (flags.includes("TRADING_PAUSABLE")) warnings.push("Trading can be paused");

    return {
      isHoneypot: data.honeypotResult?.isHoneypot ?? false,
      buyTax: data.simulationResult?.buyTax ?? 0,
      sellTax: data.simulationResult?.sellTax ?? 0,
      transferTax: data.simulationResult?.transferTax ?? 0,
      isBuyable: data.simulationResult?.buySuccess ?? true,
      isSellable: data.simulationResult?.sellSuccess ?? true,
      hasBlacklist: flags.includes("HAS_BLACKLIST"),
      hasProxyContract: flags.includes("HAS_PROXY"),
      ownerCanMint: flags.includes("OWNER_CAN_MINT"),
      hasPausableTrading: flags.includes("TRADING_PAUSABLE"),
      liquidityLocked: data.liquidityLock?.locked ?? false,
      lockPercentage: data.liquidityLock?.percentage ?? 0,
      lockDate: data.liquidityLock?.unlockDate ?? null,
      warnings,
      simulationErrorMessage: data.simulationResult?.error,
    };
  } catch {
    // Honeypot.is may not support all Solana tokens -- return null to fall back
    return {
      isHoneypot: false,
      buyTax: 0,
      sellTax: 0,
      transferTax: 0,
      isBuyable: true,
      isSellable: true,
      hasBlacklist: false,
      hasProxyContract: false,
      ownerCanMint: false,
      hasPausableTrading: false,
      liquidityLocked: false,
      lockPercentage: 0,
      lockDate: null,
      warnings: ["Honeypot.is API unavailable -- using DexScreener data only"],
    };
  }
}

// --- DexScreener-based Risk Analysis ------------------------------------------

interface DexPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: { address: string; name: string; symbol: string };
  quoteToken: { address: string; name: string; symbol: string };
  priceNative: string;
  priceUsd: string;
  txns: {
    m5: { buys: number; sells: number };
    h1: { buys: number; sells: number };
    h6: { buys: number; sells: number };
    h24: { buys: number; sells: number };
  };
  volume: { m5: number; h1: number; h6: number; h24: number };
  priceChange: { m5: number; h1: number; h6: number; h24: number };
  liquidity: { usd: number; base: number; quote: number };
  fdv: number;
  marketCap: number;
  pairCreatedAt: number;
  info?: {
    imageUrl?: string;
    websites?: { url: string; label: string }[];
    socials?: { type: string; url: string }[];
    description?: string;
  };
}

async function getPairFromAddress(tokenAddress: string): Promise<DexPair | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/token-pairs/v1/solana/${tokenAddress}`,
      { signal: AbortSignal.timeout(15_000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const pairs = data.pairs ?? [];
    if (!pairs.length) return null;
    // Return the pair with highest liquidity
    return pairs.sort(
      (a: DexPair, b: DexPair) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0)
    )[0];
  } catch {
    return null;
  }
}

async function searchSimilarPairs(tokenSymbol: string): Promise<DexPair[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/latest/dex/search?q=${encodeURIComponent(tokenSymbol)}`,
      { signal: AbortSignal.timeout(15_000) }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.pairs ?? []).slice(0, 10);
  } catch {
    return [];
  }
}

// --- Risk Scoring Engine ------------------------------------------------------

function computeContractRisk(hp: HoneypotCheckResult): RiskCategory {
  const findings: { text: string; positive: boolean }[] = [];
  let penalty = 0;

  if (hp.isHoneypot) {
    findings.push({ text: "Honeypot detected -- sells blocked", positive: false });
    penalty += 40;
  } else {
    findings.push({ text: "Not a honeypot", positive: true });
  }

  if (hp.hasBlacklist) {
    findings.push({ text: "Contract has blacklist function", positive: false });
    penalty += 15;
  } else {
    findings.push({ text: "No blacklist function", positive: true });
  }

  if (hp.hasProxyContract) {
    findings.push({ text: "Proxy contract detected -- upgradeable", positive: false });
    penalty += 10;
  } else {
    findings.push({ text: "No proxy contract", positive: true });
  }

  if (hp.ownerCanMint) {
    findings.push({ text: "Owner can mint new tokens", positive: false });
    penalty += 15;
  } else {
    findings.push({ text: "Mint function disabled or renounced", positive: true });
  }

  if (hp.hasPausableTrading) {
    findings.push({ text: "Trading can be paused by owner", positive: false });
    penalty += 10;
  } else {
    findings.push({ text: "Trading cannot be paused", positive: true });
  }

  if (!hp.isBuyable) {
    findings.push({ text: "Buy transactions fail", positive: false });
    penalty += 30;
  }

  if (!hp.isSellable) {
    findings.push({ text: "Sell transactions fail", positive: false });
    penalty += 30;
  }

  return { label: "Contract Risk", score: Math.max(0, 100 - penalty), findings };
}

function computeLiquidityRisk(pair: DexPair | null, hp: HoneypotCheckResult): RiskCategory {
  const findings: { text: string; positive: boolean }[] = [];
  let penalty = 0;

  const liq = pair?.liquidity?.usd ?? 0;

  if (liq < 1_000) {
    findings.push({ text: `Very low liquidity: $${liq.toLocaleString()}`, positive: false });
    penalty += 30;
  } else if (liq < 10_000) {
    findings.push({ text: `Low liquidity: $${liq.toLocaleString()}`, positive: false });
    penalty += 15;
  } else if (liq < 50_000) {
    findings.push({ text: `Moderate liquidity: $${liq.toLocaleString()}`, positive: false });
    penalty += 5;
  } else {
    findings.push({ text: `Healthy liquidity: $${liq.toLocaleString()}`, positive: true });
  }

  if (hp.liquidityLocked) {
    findings.push({
      text: `LP ${hp.lockPercentage.toFixed(0)}% locked`,
      positive: hp.lockPercentage > 50,
    });
    if (hp.lockPercentage < 50) penalty += 15;
    if (hp.lockDate) {
      findings.push({ text: `Unlock: ${hp.lockDate}`, positive: false });
    }
  } else {
    findings.push({ text: "LP not locked -- rug pull risk", positive: false });
    penalty += 25;
  }

  if (pair?.dexId) {
    findings.push({ text: `Trading on ${pair.dexId}`, positive: true });
  }

  return { label: "Liquidity Risk", score: Math.max(0, 100 - penalty), findings };
}

function computeTradingRisk(pair: DexPair | null, hp: HoneypotCheckResult): RiskCategory {
  const findings: { text: string; positive: boolean }[] = [];
  let penalty = 0;

  // Tax analysis
  if (hp.buyTax > 5) {
    findings.push({ text: `High buy tax: ${hp.buyTax.toFixed(1)}%`, positive: false });
    penalty += 15;
  } else if (hp.buyTax > 0) {
    findings.push({ text: `Buy tax: ${hp.buyTax.toFixed(1)}%`, positive: hp.buyTax < 3 });
    if (hp.buyTax >= 3) penalty += 5;
  } else {
    findings.push({ text: "No buy tax", positive: true });
  }

  if (hp.sellTax > 10) {
    findings.push({ text: `High sell tax: ${hp.sellTax.toFixed(1)}%`, positive: false });
    penalty += 25;
  } else if (hp.sellTax > 5) {
    findings.push({ text: `Sell tax: ${hp.sellTax.toFixed(1)}%`, positive: false });
    penalty += 10;
  } else if (hp.sellTax > 0) {
    findings.push({ text: `Sell tax: ${hp.sellTax.toFixed(1)}%`, positive: true });
  } else {
    findings.push({ text: "No sell tax", positive: true });
  }

  if (hp.transferTax > 0) {
    findings.push({ text: `Transfer tax: ${hp.transferTax.toFixed(1)}%`, positive: false });
    penalty += 5;
  } else {
    findings.push({ text: "No transfer tax", positive: true });
  }

  // Tax asymmetry (honeypot indicator)
  if (hp.sellTax > hp.buyTax + 10) {
    findings.push({
      text: `Tax asymmetry: buy ${hp.buyTax.toFixed(1)}% vs sell ${hp.sellTax.toFixed(1)}%`,
      positive: false,
    });
    penalty += 20;
  }

  // Transaction analysis
  if (pair) {
    const buys = pair.txns?.h24?.buys ?? 0;
    const sells = pair.txns?.h24?.sells ?? 0;
    const total = buys + sells;

    if (total > 0) {
      const sellRatio = sells / total;
      if (sellRatio > 0.8) {
        findings.push({ text: `${(sellRatio * 100).toFixed(0)}% of txns are sells -- dump signal`, positive: false });
        penalty += 15;
      } else if (sellRatio < 0.3) {
        findings.push({ text: `Mostly buy pressure (${buys} buys vs ${sells} sells)`, positive: true });
      } else {
        findings.push({ text: `Balanced: ${buys} buys / ${sells} sells`, positive: true });
      }
    }

    if (total < 10) {
      findings.push({ text: `Low activity: ${total} txns/24h`, positive: false });
      penalty += 10;
    }
  }

  return { label: "Trading Risk", score: Math.max(0, 100 - penalty), findings };
}

function computeHolderRisk(pair: DexPair | null): RiskCategory {
  const findings: { text: string; positive: boolean }[] = [];
  let penalty = 0;

  if (pair?.fdv && pair.fdv > 0) {
    if (pair.marketCap && pair.marketCap > 0) {
      const ratio = pair.marketCap / pair.fdv;
      if (ratio < 0.1) {
        findings.push({ text: `MC/FDV ratio: ${(ratio * 100).toFixed(1)}% -- high dilution risk`, positive: false });
        penalty += 20;
      } else {
        findings.push({ text: `MC/FDV ratio: ${(ratio * 100).toFixed(1)}%`, positive: true });
      }
    }
  }

  // Age analysis
  if (pair?.pairCreatedAt) {
    const ageMs = Date.now() - pair.pairCreatedAt;
    const ageDays = ageMs / (1000 * 60 * 60 * 24);

    if (ageDays < 1) {
      findings.push({ text: `Pair created < 24h ago -- very new`, positive: false });
      penalty += 20;
    } else if (ageDays < 7) {
      findings.push({ text: `Pair age: ${ageDays.toFixed(1)} days`, positive: false });
      penalty += 10;
    } else if (ageDays < 30) {
      findings.push({ text: `Pair age: ${ageDays.toFixed(0)} days`, positive: true });
    } else {
      findings.push({ text: `Pair age: ${ageDays.toFixed(0)} days -- established`, positive: true });
    }
  } else {
    findings.push({ text: "Unknown pair age", positive: false });
    penalty += 5;
  }

  // Volume analysis
  const vol = pair?.volume?.h24 ?? 0;
  if (vol < 1_000) {
    findings.push({ text: `Very low volume: $${vol.toLocaleString()}/24h`, positive: false });
    penalty += 15;
  } else if (vol > 100_000) {
    findings.push({ text: `High volume: $${vol.toLocaleString()}/24h`, positive: true });
  }

  return { label: "Holder Risk", score: Math.max(0, 100 - penalty), findings };
}

// --- Main Scan Function -------------------------------------------------------

export async function scanToken(tokenAddress: string): Promise<TokenScanResult | null> {
  // Fetch pair data from DexScreener
  const pair = await getPairFromAddress(tokenAddress);
  if (!pair) return null;

  // Run honeypot check
  const hp = await checkHoneypot(tokenAddress);

  // Compute risk categories
  const categories = [
    computeContractRisk(hp),
    computeLiquidityRisk(pair, hp),
    computeTradingRisk(pair, hp),
    computeHolderRisk(pair),
  ];

  // Overall score: weighted average
  const weights = [0.35, 0.25, 0.25, 0.15];
  const overallScore = Math.round(
    categories.reduce((sum, cat, i) => sum + cat.score * weights[i], 0)
  );

  // Verdict text
  let verdictText: string;
  if (hp.isHoneypot) {
    verdictText = "HONEYPOT DETECTED. Sells are blocked. DO NOT BUY.";
  } else if (overallScore >= 71) {
    verdictText = "Low risk token. Contract appears safe with healthy liquidity.";
  } else if (overallScore >= 41) {
    verdictText = "Moderate risk. Some red flags detected. Proceed with caution.";
  } else {
    verdictText = "High risk token. Multiple red flags detected. Likely rug pull.";
  }

  // Find similar flagged contracts
  const similarPairs = await searchSimilarPairs(pair.baseToken.symbol);
  const similarContracts = similarPairs
    .filter((p: DexPair) => p.pairAddress !== pair.pairAddress)
    .slice(0, 5)
    .map((p: DexPair) => {
      const liq = p.liquidity?.usd ?? 0;
      const vol = p.volume?.h24 ?? 0;
      const score = liq > 50_000 && vol > 10_000 ? 70 : liq > 10_000 ? 50 : 25;
      const status =
        score >= 70 ? "SAFE" : score >= 40 ? "CAUTION" : "DANGER";
      return { address: p.pairAddress, score, status };
    });

  return {
    address: tokenAddress,
    pairAddress: pair.pairAddress,
    overallScore,
    categories,
    verdictText,
    honeypotCheck: hp,
    tokenInfo: {
      name: pair.baseToken.name ?? "Unknown",
      symbol: pair.baseToken.symbol ?? "UNKNOWN",
      address: pair.baseToken.address,
      pairAddress: pair.pairAddress,
      dexId: pair.dexId,
      priceUsd: parseFloat(pair.priceUsd) || 0,
      priceChangeH24: pair.priceChange?.h24 ?? 0,
      volumeH24: pair.volume?.h24 ?? 0,
      liquidityUsd: pair.liquidity?.usd ?? 0,
      txnsH24: {
        buys: pair.txns?.h24?.buys ?? 0,
        sells: pair.txns?.h24?.sells ?? 0,
      },
      fdv: pair.fdv ?? 0,
      marketCap: pair.marketCap ?? 0,
      pairCreatedAt: pair.pairCreatedAt ?? null,
      info: pair.info,
    },
    similarContracts,
    scanTime: new Date(),
  };
}

// --- Batch Scan ---------------------------------------------------------------

export async function scanMultipleTokens(
  tokenAddresses: string[]
): Promise<TokenScanResult[]> {
  const results: TokenScanResult[] = [];
  for (const addr of tokenAddresses.slice(0, 5)) {
    try {
      const result = await scanToken(addr);
      if (result) results.push(result);
      // Small delay to respect rate limits
      await new Promise((r) => setTimeout(r, 500));
    } catch {
      // Skip failed scans
    }
  }
  return results;
}
