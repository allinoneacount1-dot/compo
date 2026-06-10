// --- Helius DAS API -- Token Metadata Fetcher ----------------------------------
// Uses Helius Digital Asset Standard (DAS) API for Solana token metadata.
// Docs: https://docs.helius.dev/compression-and-das-api/digital-asset-standard-das-api

const HELIUS_DAS_BASE = "https://api.helius.xyz/v0/token-metadata";

// Helius API key -- public demo key (rate-limited but functional)
const HELIUS_API_KEY = "c4f2eedf-0b2c-481c-9835-128e0032510c";

// --- Types --------------------------------------------------------------------

export interface TokenMetadata {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  supply: number | null;
  uri: string | null;
  description: string | null;
  image: string | null;
  website: string | null;
  twitter: string | null;
  telegram: string | null;
  discord: string | null;
  tags: string[];
  // On-chain metadata raw
  mintAuthority: string | null;
  freezeAuthority: string | null;
  isMutable: boolean;
  // Creator info
  creatorAddress: string | null;
  creatorShare: number | null;
  // Collection
  collection: string | null;
  // Creation info
  createdAt: string | null;
}

interface HeliusTokenMetadataResponse {
  result?: {
    account?: string;
    onChainAccountInfo?: {
      accountInfo?: {
        data?: {
          parsed?: {
            info?: {
              decimals?: number;
              freezeAuthority?: string;
              isInitialized?: boolean;
              mintAuthority?: string;
              supply?: string;
            };
            type?: string;
          };
          program?: string;
          space?: number;
        };
        executable?: boolean;
        lamports?: number;
        owner?: string;
        rentEpoch?: number;
        space?: number;
      };
    };
    onChainMetadata?: {
      metadata?: {
        key?: string;
        mint?: string;
        updateAuthority?: string;
        data?: {
          name?: string;
          symbol?: string;
          uri?: string;
          sellerFeeBasisPoints?: number;
          creators?: {
            address: string;
            share: number;
            verified: boolean;
          }[];
        };
        isMutable?: boolean;
        primarySaleHappened?: boolean;
        editionNonce?: number;
        tokenStandard?: string;
        collection?: {
          key: string;
          verified: boolean;
        } | null;
      };
    };
    offChainMetadata?: {
      name?: string;
      symbol?: string;
      description?: string;
      image?: string;
      external_url?: string;
      attributes?: { trait_type: string; value: string }[];
      properties?: {
        files?: { uri: string; type: string }[];
        category?: string;
        creators?: { address: string; share: number }[];
      };
    };
    legacyMetadata?: {
      chainId?: number;
      address?: string;
      symbol?: string;
      name?: string;
      decimals?: number;
      logoURI?: string;
      tags?: string[];
      extensions?: {
        website?: string;
        twitter?: string;
        telegram?: string;
        discord?: string;
        description?: string;
        coinGeckoId?: string;
      };
    };
  };
}

// --- Fetch single token metadata ----------------------------------------------

async function fetchJSON<T>(url: string, timeoutMs = 15_000): Promise<T> {
  const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  if (!res.ok) {
    throw new Error(`Helius API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function getTokenMetadata(
  mintAddress: string
): Promise<TokenMetadata | null> {
  try {
    // Use Helius DAS token metadata endpoint
    const url = `${HELIUS_DAS_BASE}?api-key=${HELIUS_API_KEY}&mintAccounts=${mintAddress}`;
    const data = await fetchJSON<HeliusTokenMetadataResponse>(url);

    const result = data?.result;
    if (!result) return null;

    const onChain = result.onChainMetadata?.metadata?.data;
    const offChain = result.offChainMetadata;
    const legacy = result.legacyMetadata;
    const accountInfo = result.onChainAccountInfo?.accountInfo?.data?.parsed?.info;

    // Parse supply
    const rawSupply = accountInfo?.supply ?? null;
    const decimals = accountInfo?.decimals ?? legacy?.decimals ?? 0;
    const supply = rawSupply ? parseInt(rawSupply) / Math.pow(10, decimals) : null;

    // Extract social links from off-chain metadata
    let website: string | null = null;
    let twitter: string | null = null;
    let telegram: string | null = null;
    let discord: string | null = null;

    if (offChain?.external_url) {
      website = offChain.external_url;
    }
    if (legacy?.extensions) {
      website = legacy.extensions.website ?? website;
      twitter = legacy.extensions.twitter ?? null;
      telegram = legacy.extensions.telegram ?? null;
      discord = legacy.extensions.discord ?? null;
    }

    // Creator info
    const creators = onChain?.creators;
    const creatorAddress = creators && creators.length > 0 ? creators[0].address : null;
    const creatorShare = creators && creators.length > 0 ? creators[0].share : null;

    return {
      address: mintAddress,
      name: offChain?.name ?? onChain?.name ?? legacy?.name ?? "Unknown",
      symbol: offChain?.symbol ?? onChain?.symbol ?? legacy?.symbol ?? "UNKNOWN",
      decimals,
      supply,
      uri: onChain?.uri ?? null,
      description: offChain?.description ?? legacy?.extensions?.description ?? null,
      image: offChain?.image ?? legacy?.logoURI ?? null,
      website,
      twitter,
      telegram,
      discord,
      tags: legacy?.tags ?? [],
      mintAuthority: accountInfo?.mintAuthority ?? null,
      freezeAuthority: accountInfo?.freezeAuthority ?? null,
      isMutable: result.onChainMetadata?.metadata?.isMutable ?? true,
      creatorAddress,
      creatorShare,
      collection: result.onChainMetadata?.metadata?.collection?.key ?? null,
      createdAt: null, // Helius DAS doesn't provide creation timestamp directly
    };
  } catch {
    // Fallback: try basic token info from DexScreener
    return null;
  }
}

// --- Batch metadata fetch ---

export async function getMultipleTokenMetadata(
  mintAddresses: string[]
): Promise<TokenMetadata[]> {
  const results: TokenMetadata[] = [];

  // Helius supports multiple mint accounts in one request
  try {
    const batch = mintAddresses.slice(0, 10); // Max 10 per request
    const url = `${HELIUS_DAS_BASE}?api-key=${HELIUS_API_KEY}&mintAccounts=${batch.join(",")}`;
    const data = await fetchJSON<HeliusTokenMetadataResponse>(url);

    // Handle single result vs array
    const resultsList = Array.isArray(data)
      ? data
      : data?.result
        ? [data]
        : [];

    for (const item of resultsList) {
      if (item?.result) {
        const meta = item.result;
        const onChain = meta.onChainMetadata?.metadata?.data;
        const offChain = meta.offChainMetadata;
        const legacy = meta.legacyMetadata;
        const accountInfo = meta.onChainAccountInfo?.accountInfo?.data?.parsed?.info;

        const decimals = accountInfo?.decimals ?? legacy?.decimals ?? 0;
        const rawSupply = accountInfo?.supply ?? null;
        const supply = rawSupply ? parseInt(rawSupply) / Math.pow(10, decimals) : null;

        results.push({
          address: meta.onChainMetadata?.metadata?.mint ?? "",
          name: offChain?.name ?? onChain?.name ?? legacy?.name ?? "Unknown",
          symbol: offChain?.symbol ?? onChain?.symbol ?? legacy?.symbol ?? "UNKNOWN",
          decimals,
          supply,
          uri: onChain?.uri ?? null,
          description: offChain?.description ?? null,
          image: offChain?.image ?? legacy?.logoURI ?? null,
          website: offChain?.external_url ?? legacy?.extensions?.website ?? null,
          twitter: legacy?.extensions?.twitter ?? null,
          telegram: legacy?.extensions?.telegram ?? null,
          discord: legacy?.extensions?.discord ?? null,
          tags: legacy?.tags ?? [],
          mintAuthority: accountInfo?.mintAuthority ?? null,
          freezeAuthority: accountInfo?.freezeAuthority ?? null,
          isMutable: meta.onChainMetadata?.metadata?.isMutable ?? true,
          creatorAddress: onChain?.creators?.[0]?.address ?? null,
          creatorShare: onChain?.creators?.[0]?.share ?? null,
          collection: meta.onChainMetadata?.metadata?.collection?.key ?? null,
          createdAt: null,
        });
      }
    }
  } catch {
    // Fall back to individual fetches
    for (const addr of mintAddresses.slice(0, 3)) {
      const meta = await getTokenMetadata(addr);
      if (meta) results.push(meta);
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  return results;
}

// --- Get token creation info via RPC ------------------------------------------

export interface TokenCreationInfo {
  slot: number;
  blockTime: number | null;
  creator: string | null;
  createdAt: string | null;
}

export async function getTokenCreationInfo(
  mintAddress: string
): Promise<TokenCreationInfo | null> {
  try {
    const HELIUS_RPC = `https://rpc.helius.xyz/?api-key=${HELIUS_API_KEY}`;

    // Get signatures for the mint account to find creation
    const res = await fetch(HELIUS_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "compo-scan",
        method: "getSignaturesForAddress",
        params: [mintAddress, { limit: 1 }],
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) return null;
    const data = await res.json();

    if (data?.result && data.result.length > 0) {
      const tx = data.result[0];
      return {
        slot: tx.slot ?? 0,
        blockTime: tx.blockTime ?? null,
        creator: null,
        createdAt: tx.blockTime
          ? new Date(tx.blockTime * 1000).toISOString()
          : null,
      };
    }

    return null;
  } catch {
    return null;
  }
}
