// ─── DexScreener API Client ───────────────────────────────────────────────────
// Docs: https://docs.dexscreener.com/api/reference
// Rate limits: 60 req/min (profiles), 300 req/min (pairs, search, tokens)

const BASE_URL = "https://api.dexscreener.com";
const CHAIN_ID = "solana";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DexPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd: string;
  txns: {
    m5: { buys: number; sells: number };
    h1: { buys: number; sells: number };
    h6: { buys: number; sells: number };
    h24: { buys: number; sells: number };
  };
  volume: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  liquidity: {
    usd: number;
    base: number;
    quote: number;
  };
  fdv: number;
  marketCap: number;
  pairCreatedAt: number;
  info?: {
    imageUrl?: string;
    websites?: { url: string; label: string }[];
    socials?: { type: string; url: string }[];
    description?: string;
  };
  boosts?: { active: number };
}

export interface DexScreenerPairsResponse {
  schemaVersion: string;
  pairs: DexPair[] | null;
  pair: DexPair | null;
}

export interface DexScreenerSearchResponse {
  pairs: DexPair[];
}

export interface TokenProfile {
  url: string;
  chainId: string;
  tokenAddress: string;
  icon?: string;
  description?: string | null;
  links?: { type: string; label: string; url: string }[];
}

export interface BoostedToken {
  url: string;
  chainId: string;
  tokenAddress: string;
  amount: number;
  totalAmount: number;
  icon?: string;
  description?: string | null;
}

export interface TrendingMeta {
  name: string;
  slug: string;
  description: string;
  marketCap: number;
  liquidity: number;
  volume: number;
  tokenCount: number;
  marketCapChange: { m5: number; h1: number; h6: number; h24: number };
}

// ─── Known Solana token addresses ─────────────────────────────────────────────

export const KNOWN_TOKENS = {
  SOL: "So11111111111111111111111111111111111111112",
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  USDT: "Es9vMFrzaCERmJfrF4F2GoFYQkFJTQpQSEPw6bD1uDzef",
  BONK: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  WIF: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
  POPCAT: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
  JUP: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
  PYTH: "HZ1JovNiVvGrGNiiYvE4EZEDZR3tFeVGiapCHE5CTuBkxu",
  ORCA: "orcaEKTdK7LKz57vaAYr9QeNsEoGKQOURQegeQKV6H7b1eK",
  RAY: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
  HBB: "Hbrc4GCrjzwN3btGG9e7nL4RSR8QoPYFXLkcmwzbDSMMJuDk",
  DRIFT: "DrfgYo89DNoq2eaQvh3L3aMXFcDt1HxK5sKYbtNbw8SU1gP"
} as const;

// ─── API Functions ────────────────────────────────────────────────────────────

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  if (!res.ok) {
    throw new Error(`DexScreener API error: ${res.status} ${res.statusText} — ${url}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Search for trading pairs by token symbol or query.
 * Rate limit: 300 req/min.
 */
export async function searchPairs(query: string): Promise<DexPair[]> {
  const url = `${BASE_URL}/latest/dex/search?q=${encodeURIComponent(query)}`;
  const data = await fetchJSON<DexScreenerSearchResponse>(url);
  return data.pairs ?? [];
}

/**
 * Get all trading pairs for a specific token address.
 * Rate limit: 300 req/min.
 */
export async function getPairsByToken(tokenAddress: string): Promise<DexPair[]> {
  const url = `${BASE_URL}/token-pairs/v1/${CHAIN_ID}/${tokenAddress}`;
  const data = await fetchJSON<DexScreenerPairsResponse>(url);
  return data.pairs ?? [];
}

/**
 * Get pair data for multiple token addresses at once (comma-separated, up to 30).
 * Rate limit: 300 req/min.
 */
export async function getPairsByTokens(tokenAddresses: string[]): Promise<DexPair[]> {
  if (tokenAddresses.length === 0) return [];
  const url = `${BASE_URL}/tokens/v1/${CHAIN_ID}/${tokenAddresses.join(",")}`;
  const data = await fetchJSON<DexScreenerPairsResponse>(url);
  return data.pairs ?? [];
}

/**
 * Get a specific pair by its address.
 * Rate limit: 300 req/min.
 */
export async function getPair(pairAddress: string): Promise<DexPair | null> {
  const url = `${BASE_URL}/latest/dex/pairs/${CHAIN_ID}/${pairAddress}`;
  const data = await fetchJSON<DexScreenerPairsResponse>(url);
  return data.pair;
}

/**
 * Get latest token profiles (newest tokens added to DexScreener).
 * Rate limit: 60 req/min.
 */
export async function getLatestProfiles(): Promise<TokenProfile[]> {
  const url = `${BASE_URL}/token-profiles/latest/v1`;
  return fetchJSON<TokenProfile[]>(url);
}

/**
 * Get top boosted tokens.
 * Rate limit: 60 req/min.
 */
export async function getTopBoosts(): Promise<BoostedToken[]> {
  const url = `${BASE_URL}/token-boosts/top/v1`;
  return fetchJSON<BoostedToken[]>(url);
}

/**
 * Get trending metadata categories (AI, Memes, etc.).
 * Rate limit: 60 req/min.
 */
export async function getTrendingMetas(): Promise<TrendingMeta[]> {
  const url = `${BASE_URL}/metas/trending/v1`;
  return fetchJSON<TrendingMeta[]>(url);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Extract a flat list of unique tokens from pairs, picking best liquidity per token.
 */
export function extractUniqueTokens(pairs: DexPair[]): {
  symbol: string;
  name: string;
  address: string;
  priceUsd: number;
  priceChangeH24: number;
  volumeH24: number;
  liquidityUsd: number;
  txnsH24: { buys: number; sells: number };
}[] {
  const tokenMap = new Map<string, { best: DexPair; allVolume: number }>();

  for (const pair of pairs) {
    const addr = pair.baseToken.address;
    const existing = tokenMap.get(addr);
    const vol = existing ? existing.allVolume + (pair.volume?.h24 ?? 0) : pair.volume?.h24 ?? 0;

    if (!existing || (pair.liquidity?.usd ?? 0) > (existing.best.liquidity?.usd ?? 0)) {
      tokenMap.set(addr, { best: pair, allVolume: vol });
    } else {
      existing.allVolume = vol;
    }
  }

  return Array.from(tokenMap.values())
    .map(({ best, allVolume }) => ({
      symbol: best.baseToken.symbol ?? "UNKNOWN",
      name: best.baseToken.name ?? "Unknown",
      address: best.baseToken.address,
      priceUsd: parseFloat(best.priceUsd) || 0,
      priceChangeH24: best.priceChange?.h24 ?? 0,
      volumeH24: allVolume,
      liquidityUsd: best.liquidity?.usd ?? 0,
      txnsH24: {
        buys: best.txns?.h24?.buys ?? 0,
        sells: best.txns?.h24?.sells ?? 0,
      },
    }))
    .filter((t) => t.priceUsd > 0)
    .sort((a, b) => b.volumeH24 - a.volumeH24);
}

/**
 * Build watchlist from known tokens — fetches their pair data and formats.
 */
export async function fetchKnownTokenPrices(): Promise<
  {
    symbol: string;
    name: string;
    address: string;
    priceUsd: number;
    priceChangeH24: number;
    volumeH24: number;
    liquidityUsd: number;
    txnsH24: { buys: number; sells: number };
  }[]
> {
  // Fetch in batches to respect the 30-address limit
  const addresses = Object.values(KNOWN_TOKENS);
  const batchSize = 20;
  let allPairs: DexPair[] = [];

  for (let i = 0; i < addresses.length; i += batchSize) {
    const batch = addresses.slice(i, i + batchSize);
    const pairs = await getPairsByTokens(batch);
    allPairs = allPairs.concat(pairs);

    // Small delay between batches to respect rate limits
    if (i + batchSize < addresses.length) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  // Map back to symbols
  const addrToSymbol = {} as Record<string, string>;
  for (const [sym, addr] of Object.entries(KNOWN_TOKENS)) {
    addrToSymbol[addr] = sym;
  }

  return allPairs
    .filter((p) => p.baseToken?.address)
    .map((p) => ({
      symbol: addrToSymbol[p.baseToken.address] ?? p.baseToken.symbol ?? "UNKNOWN",
      name: p.baseToken.name ?? "Unknown",
      address: p.baseToken.address,
      priceUsd: parseFloat(p.priceUsd) || 0,
      priceChangeH24: p.priceChange?.h24 ?? 0,
      volumeH24: p.volume?.h24 ?? 0,
      liquidityUsd: p.liquidity?.usd ?? 0,
      txnsH24: {
        buys: p.txns?.h24?.buys ?? 0,
        sells: p.txns?.h24?.sells ?? 0,
      },
    }))
    .filter((t) => t.priceUsd > 0);
}
