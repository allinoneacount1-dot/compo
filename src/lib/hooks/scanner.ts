// --- Scanner React Hooks ------------------------------------------------------
// Hooks for token scanning, honeypot detection, and liquidity lock checks.

import { useState, useCallback } from "react";
import { scanToken, scanMultipleTokens } from "../api/honeypot";
import type { TokenScanResult } from "../api/honeypot";
import { getTokenMetadata, getTokenCreationInfo } from "../api/helius";
import type { TokenMetadata, TokenCreationInfo } from "../api/helius";
import { getLPSummary } from "../api/liquidity-lock";
import type { LPSummary } from "../api/liquidity-lock";

// --- Token Scanner Hook -------------------------------------------------------

export function useTokenScanner() {
  const [result, setResult] = useState<TokenScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState("");

  const scan = useCallback(async (tokenAddress: string) => {
    if (!tokenAddress.trim()) return;

    setIsScanning(true);
    setResult(null);
    setError(null);
    setProgress("Fetching pair data...");

    try {
      const scanResult = await scanToken(tokenAddress.trim());
      if (!scanResult) {
        setError("No pair data found for this token address on Solana.");
        setIsScanning(false);
        return;
      }
      setResult(scanResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed");
    } finally {
      setIsScanning(false);
      setProgress("");
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setProgress("");
  }, []);

  return { result, isScanning, error, progress, scan, reset };
}

// --- Batch Scanner Hook -------------------------------------------------------

export function useBatchScanner() {
  const [results, setResults] = useState<TokenScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scan = useCallback(async (addresses: string[]) => {
    const valid = addresses.map((a) => a.trim()).filter(Boolean);
    if (valid.length === 0) return;

    setIsScanning(true);
    setResults([]);
    setError(null);

    try {
      const scanResults = await scanMultipleTokens(valid);
      setResults(scanResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Batch scan failed");
    } finally {
      setIsScanning(false);
    }
  }, []);

  return { results, isScanning, error, scan };
}

// --- Token Metadata Hook ------------------------------------------------------

export function useTokenMetadata(mintAddress: string | null) {
  const [metadata, setMetadata] = useState<TokenMetadata | null>(null);
  const [creationInfo, setCreationInfo] = useState<TokenCreationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!mintAddress) return;
    setLoading(true);
    setError(null);

    try {
      const [meta, creation] = await Promise.all([
        getTokenMetadata(mintAddress),
        getTokenCreationInfo(mintAddress),
      ]);
      setMetadata(meta);
      setCreationInfo(creation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch metadata");
    } finally {
      setLoading(false);
    }
  }, [mintAddress]);

  return { metadata, creationInfo, loading, error, fetch };
}

// --- Liquidity Lock Hook ------------------------------------------------------

export function useLiquidityLock(pairAddress: string | null) {
  const [lpSummary, setLpSummary] = useState<LPSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(async () => {
    if (!pairAddress) return;
    setLoading(true);
    setError(null);

    try {
      const summary = await getLPSummary(pairAddress);
      setLpSummary(summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check LP lock");
    } finally {
      setLoading(false);
    }
  }, [pairAddress]);

  return { lpSummary, loading, error, check };
}
