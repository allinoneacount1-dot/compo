// --- Re-export from API client -------------------------------------------------
// This file exists so existing imports from "../hooks/dexscreener" keep working.
// The real implementation is in "../api/dexscreener".

export {
  searchPairs,
  getPairsByToken,
  getPairsByTokens,
  getPair,
  getLatestProfiles,
  getTopBoosts,
  getTrendingMetas,
  extractUniqueTokens,
  fetchKnownTokenPrices,
  KNOWN_TOKENS,
} from "../api/dexscreener";
export type {
  DexPair,
  DexScreenerPairsResponse,
  DexScreenerSearchResponse,
  TokenProfile,
  BoostedToken,
  TrendingMeta,
} from "../api/dexscreener";
