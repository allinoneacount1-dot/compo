// --- Liquidity Lock Verification -----------------------------------------------
// Checks if token LP tokens are locked, burned, or unlocked.
// Supports Raydium, Orca, and generic Solana LP tokens.

// --- Types --------------------------------------------------------------------

export interface LiquidityLockInfo {
  status: "Locked" | "Burned" | "Partial" | "None" | "Unknown";
  lockedPercentage: number;
  unlockedPercentage: number;
  lockProvider: string | null;
  lockDate: string | null;
  unlockDate: string | null;
  lockedAmount: number | null;
  totalLPAmount: number | null;
  walletAddress: string | null;
  explorerUrl: string | null;
  details: string[];
}

// --- Known LP lockers on Solana -----------------------------------------------

const KNOWN_LOCKERS = [
  { name: "Team Finance", pattern: /teamfi|teamfinance/i },
  { name: "Uncx Network", pattern: /uncx|uncl/i },
  { name: "PinkSale", pattern: /pinksale/i },
  { name: "DeepLock", pattern: /deeplock/i },
  { name: "Mollis", pattern: /mollis/i },
  { name: "Solana Locker", pattern: /sollocker|sol locker/i },
  { name: "Raydium LP Locker", pattern: /raydiumlocker/i },
];

// Dead addresses (burned tokens)
const DEAD_ADDRESSES = [
  "11111111111111111111111111111111",
  "So11111111111111111111111111111111111111112",
  "dead111111111111111111111111111111111111111",
  "burn111111111111111111111111111111111111111",
];

// --- Helius API for token accounts --------------------------------------------

const HELIUS_API_KEY = "c4f2eedf-0b2c-481c-9835-128e0032510c";
const HELIUS_RPC = `https://rpc.helius.xyz/?api-key=${HELIUS_API_KEY}`;

async function heliusRPC(method: string, params: unknown): Promise<unknown> {
  const res = await fetch(HELIUS_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "compo-lp-check",
      method,
      params,
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`Helius RPC error: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message ?? "RPC error");
  return data.result;
}

// --- Main LP Lock Check -------------------------------------------------------

export async function checkLiquidityLock(
  lpTokenAddress: string,
  _pairAddress?: string
): Promise<LiquidityLockInfo> {
  const details: string[] = [];

  try {
    // Get all token accounts for the LP token
    const accounts = await heliusRPC("getTokenLargestAccounts", [lpTokenAddress]) as {
      context: { slot: number };
      value: {
        address: string;
        amount: string;
        decimals: number;
        uiAmount: number;
      }[];
    };

    if (!accounts?.value || accounts.value.length === 0) {
      return {
        status: "Unknown",
        lockedPercentage: 0,
        unlockedPercentage: 100,
        lockProvider: null,
        lockDate: null,
        unlockDate: null,
        lockedAmount: null,
        totalLPAmount: null,
        walletAddress: null,
        explorerUrl: `https://solscan.io/token/${lpTokenAddress}`,
        details: ["No LP token accounts found"],
      };
    }

    const totalSupply = accounts.value.reduce(
      (sum, acc) => sum + (acc.uiAmount ?? 0),
      0
    );

    // Check each holder
    let burnedAmount = 0;
    let lockedAmount = 0;
    let lockProvider: string | null = null;
    let maxSingleHolder = 0;
    let maxHolderAddress: string | null = null;

    for (const acc of accounts.value) {
      const amount = acc.uiAmount ?? 0;
      const addr = acc.address;

      if (amount > maxSingleHolder) {
        maxSingleHolder = amount;
        maxHolderAddress = addr;
      }

      // Check if held by dead address (burned)
      if (DEAD_ADDRESSES.some((d) => addr.toLowerCase().includes(d.toLowerCase()))) {
        burnedAmount += amount;
        details.push(`${amount.toLocaleString()} LP burned (${addr.slice(0, 8)}...)`);
        continue;
      }

      // Check if held by known locker (heuristic: large single wallet)
      // In production, you'd check against known locker program addresses
      if (amount > totalSupply * 0.1) {
        // Large holder -- could be locker or DEX pool
        try {
          const accountInfo = await heliusRPC("getAccountInfo", [
            addr,
            { encoding: "jsonParsed" },
          ]) as {
            value?: {
              owner?: string;
              data?: {
                parsed?: {
                  info?: {
                    owner?: string;
                    mint?: string;
                  };
                };
              };
            };
          };

          const owner = accountInfo?.value?.data?.parsed?.info?.owner ?? "";

          // Check if this is a known locker program
          const lockerMatch = KNOWN_LOCKERS.find((l) => l.pattern.test(owner));
          if (lockerMatch) {
            lockedAmount += amount;
            lockProvider = lockerMatch.name;
            details.push(
              `${amount.toLocaleString()} LP locked via ${lockerMatch.name} (${addr.slice(0, 8)}...)`
            );
          }
        } catch {
          // Skip account info check on failure
        }
      }
    }

    const burnedPct = totalSupply > 0 ? (burnedAmount / totalSupply) * 100 : 0;
    const lockedPct = totalSupply > 0 ? (lockedAmount / totalSupply) * 100 : 0;
    const totalSecuredPct = burnedPct + lockedPct;
    const unlockedPct = 100 - totalSecuredPct;

    // Determine status
    let status: LiquidityLockInfo["status"];
    if (burnedPct >= 95) {
      status = "Burned";
      details.push("LP tokens are burned -- liquidity is permanently locked");
    } else if (totalSecuredPct >= 80) {
      status = "Locked";
      details.push(`${totalSecuredPct.toFixed(1)}% of LP is secured`);
    } else if (totalSecuredPct >= 20) {
      status = "Partial";
      details.push(`Only ${totalSecuredPct.toFixed(1)}% of LP is secured`);
    } else {
      status = "None";
      details.push("LP is not locked -- high rug pull risk");
    }

    if (maxHolderAddress && maxSingleHolder > totalSupply * 0.5) {
      details.push(
        `⚠️ Single wallet holds ${((maxSingleHolder / totalSupply) * 100).toFixed(1)}% of LP`
      );
    }

    return {
      status,
      lockedPercentage: Math.round(totalSecuredPct * 10) / 10,
      unlockedPercentage: Math.round(unlockedPct * 10) / 10,
      lockProvider,
      lockDate: null,
      unlockDate: null,
      lockedAmount: lockedAmount + burnedAmount,
      totalLPAmount: totalSupply,
      walletAddress: maxHolderAddress,
      explorerUrl: `https://solscan.io/token/${lpTokenAddress}`,
      details,
    };
  } catch (err) {
    return {
      status: "Unknown",
      lockedPercentage: 0,
      unlockedPercentage: 100,
      lockProvider: null,
      lockDate: null,
      unlockDate: null,
      lockedAmount: null,
      totalLPAmount: null,
      walletAddress: null,
      explorerUrl: `https://solscan.io/token/${lpTokenAddress}`,
      details: [
        `Error checking LP lock: ${err instanceof Error ? err.message : "Unknown error"}`,
      ],
    };
  }
}

// --- Get LP token address from pair -------------------------------------------

export async function getLPTokenAddress(pairAddress: string): Promise<string | null> {
  try {
    const result = await heliusRPC("getAccountInfo", [
      pairAddress,
      { encoding: "jsonParsed" },
    ]) as {
      value?: {
        data?: {
          parsed?: {
            info?: {
              mint?: string;
              tokenAccountA?: string;
              tokenAccountB?: string;
            };
          };
        };
      };
    };

    // For AMM pairs, the LP mint is often in the account data
    return result?.value?.data?.parsed?.info?.mint ?? null;
  } catch {
    return null;
  }
}

// --- Quick LP lock summary for scanner ----------------------------------------

export interface LPSummary {
  status: "Locked" | "Burned" | "Partial" | "None" | "Unknown";
  percentage: number;
  provider: string | null;
  unlockDate: string | null;
  riskNote: string;
}

export async function getLPSummary(pairAddress: string): Promise<LPSummary> {
  const lpToken = await getLPTokenAddress(pairAddress);

  if (!lpToken) {
    return {
      status: "Unknown",
      percentage: 0,
      provider: null,
      unlockDate: null,
      riskNote: "Could not determine LP token address",
    };
  }

  const lockInfo = await checkLiquidityLock(lpToken, pairAddress);

  const riskNote =
    lockInfo.status === "Burned"
      ? "LP burned -- permanently locked"
      : lockInfo.status === "Locked"
        ? `LP ${lockInfo.lockedPercentage}% locked${lockInfo.lockProvider ? ` via ${lockInfo.lockProvider}` : ""}`
        : lockInfo.status === "Partial"
          ? `Only ${lockInfo.lockedPercentage}% LP secured`
          : "LP not locked -- rug pull risk";

  return {
    status: lockInfo.status,
    percentage: lockInfo.lockedPercentage,
    provider: lockInfo.lockProvider,
    unlockDate: lockInfo.unlockDate,
    riskNote,
  };
}
