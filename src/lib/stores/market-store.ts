// ─── Zustand store for live market data ─────────────────────────────────────
// Shared across all dashboard pages — fetches once, consumes everywhere.

import { create } from "zustand";
import * as dexscreener from "../api/dexscreener";
import type { DexPair } from "../api/dexscreener";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LiveTokenPrice {
  symbol: string;
  name: string;
  address: string;
  priceUsd: number;
  priceChangeH24: number;
  volumeH24: number;
  liquidityUsd: number;
  txnsH24: { buys: number; sells: number };
  lastUpdated: Date;
}

export interface MarketStats {
  totalVolumeH24: number;
  totalLiquidity: number;
  activePairs: number;
  topGainers: LiveTokenPrice[];
  topLosers: LiveTokenPrice[];
}

interface MarketState {
  // Data
  tokens: LiveTokenPrice[];
  pairs: DexPair[];
  stats: MarketStats | null;
  networkSlot: number;
  networkLatency: number;
  isOnline: boolean;

  // Status
  isLoading: boolean;
  error: string | null;
  lastFetched: Date | null;

  // Actions
  refresh: () => Promise<void>;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useMarketStore = create<MarketState>((set, get) => ({
  tokens: [],
  pairs: [],
  stats: null,
  networkSlot: 0,
  networkLatency: 0,
  isOnline: true,
  isLoading: false,
  error: null,
  lastFetched: null,

  refresh: async () => {
    set({ isLoading: true });
    try {
      // Fetch known tokens
      const tokens = await dexscreener.fetchKnownTokenPrices();

      // Fetch some pairs for volume data
      const solPairs = await dexscreener.searchPairs("SOL");
      const topPairs = solPairs.sort((a, b) => (b.volume?.h24 ?? 0) - (a.volume?.h24 ?? 0)).slice(0, 50);

      // Compute stats
      const liveTokens: LiveTokenPrice[] = tokens.map((t) => ({
        ...t,
        lastUpdated: new Date(),
      }));

      const totalVolumeH24 = liveTokens.reduce((s, t) => s + t.volumeH24, 0);
      const totalLiquidity = liveTokens.reduce((s, t) => s + t.liquidityUsd, 0);

      const sorted = [...liveTokens].sort((a, b) => b.priceChangeH24 - a.priceChangeH24);
      const topGainers = sorted.slice(0, 5);
      const topLosers = sorted.slice(-5).reverse();

      set({
        tokens: liveTokens,
        pairs: topPairs,
        stats: {
          totalVolumeH24,
          totalLiquidity,
          activePairs: topPairs.length,
          topGainers,
          topLosers,
        },
        isOnline: true,
        error: null,
        lastFetched: new Date(),
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
        isLoading: false,
        isOnline: get().tokens.length > 0, // Keep online if we have cached data
      });
    }
  },
}));

// ─── Auto-refresh (client-side only) ─────────────────────────────────────────

let refreshInterval: ReturnType<typeof setInterval> | null = null;

export function startMarketRefresh(intervalMs = 30_000) {
  if (refreshInterval) clearInterval(refreshInterval);
  refreshInterval = setInterval(async () => {
    await useMarketStore.getState().refresh();
  }, intervalMs);
}

export function stopMarketRefresh() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}
