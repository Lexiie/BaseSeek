import projectDirectory from "../../data/projects.json";
import { env } from "./env";
import { fetchJson, safeFetch } from "./http";
import type { ProjectEntry, TokenMetrics } from "./types";

const DEXSCREENER_BASE_URL = (env.dexscreenerBaseUrl ?? "https://api.dexscreener.com").replace(/\/$/, "");
const DEXSCREENER_TOKEN_ENDPOINT = `${DEXSCREENER_BASE_URL}/latest/dex/tokens/`;
const DEXSCREENER_TRENDING_ENDPOINT = `${DEXSCREENER_BASE_URL}/latest/dex/trending/base`;
const GECKOTERMINAL_AERODROME_ENDPOINT =
  "https://api.geckoterminal.com/api/v2/networks/base/dexes/aerodrome-base/pools";
const BASESCAN_API_ENDPOINT = (env.basescanApiUrl ?? "https://api.basescan.org/api").replace(/\/$/, "");
const BASESCAN_AUTH_HEADERS = env.basescanMcpAuthToken
  ? { Authorization: `Bearer ${env.basescanMcpAuthToken}` }
  : undefined;

function getEtherscanApiKey() {
  return env.etherscanApiKey ?? env.basescanApiKey ?? "";
}

function buildBaseExplorerUrl(params: Record<string, string>) {
  const search = new URLSearchParams({
    chainid: env.etherscanChainId ?? "8453",
    apikey: getEtherscanApiKey(),
    ...params
  });
  return `${BASESCAN_API_ENDPOINT}?${search.toString()}`;
}

export async function fetchTrendingTokens() {
  return safeFetch(async () => {
    const data = await fetchJson<{ pairs?: TokenMetrics[] }>(DEXSCREENER_TRENDING_ENDPOINT, {
      timeoutMs: 3_000
    });
    return data?.pairs ?? [];
  });
}

export async function fetchDexScreenerToken(address: string): Promise<TokenMetrics | undefined> {
  return safeFetch(async () => {
    const data = await fetchJson<{ pairs: TokenMetrics[] }>(`${DEXSCREENER_TOKEN_ENDPOINT}${address}`);
    return data.pairs?.[0];
  });
}

export async function fetchBaseScanToken(address: string) {
  const apiKey = getEtherscanApiKey();
  if (!apiKey) return undefined;

  return safeFetch(async () => {
    const url = buildBaseExplorerUrl({ module: "token", action: "tokeninfo", contractaddress: address });
    const data = await fetchJson<{ result?: TokenMetrics | TokenMetrics[] }>(url, {
      headers: BASESCAN_AUTH_HEADERS
    });
    const result = data.result;
    if (Array.isArray(result)) {
      return result[0];
    }
    return result as TokenMetrics | undefined;
  });
}

export async function fetchBaseScanAbi(address: string) {
  const apiKey = getEtherscanApiKey();
  if (!apiKey) return undefined;

  return safeFetch(async () => {
    const url = buildBaseExplorerUrl({ module: "contract", action: "getabi", address });
    const data = await fetchJson<{ result?: unknown }>(url, {
      headers: BASESCAN_AUTH_HEADERS
    });
    const result = data.result;
    let abiRaw: string | undefined;

    if (typeof result === "string") {
      abiRaw = result;
    } else if (Array.isArray(result) && result[0]) {
      const first = result[0] as Record<string, string>;
      abiRaw = first?.ABI ?? first?.abi;
    } else if (result && typeof result === "object") {
      const obj = result as Record<string, string>;
      abiRaw = obj.ABI ?? obj.abi;
    }

    if (!abiRaw || abiRaw.toLowerCase().startsWith("missing")) {
      return undefined;
    }

    try {
      return JSON.parse(abiRaw);
    } catch (error) {
      console.error("Failed to parse ABI", { address, error: (error as Error).message });
      return undefined;
    }
  });
}

export async function fetchAerodromeTopPools() {
  return safeFetch(async () => {
    const data = await fetchJson<{
      data?: Array<{
        attributes?: {
          name?: string;
          symbol?: string;
          reserve_in_usd?: number;
          volume_usd?: { h24?: number };
        };
      }>;
    }>(`${GECKOTERMINAL_AERODROME_ENDPOINT}?page=1`, {
      headers: {
        Accept: "application/json",
        ...(env.geckoTerminalApiKey ? { "X-API-KEY": env.geckoTerminalApiKey } : {})
      }
    });

    return (
      data?.data?.map((pool) => ({
        name: pool.attributes?.name ?? pool.attributes?.symbol,
        reserveUsd: pool.attributes?.reserve_in_usd,
        volume24hUsd: pool.attributes?.volume_usd?.h24
      })) ?? []
    );
  });
}

export function getProjectDirectory(): ProjectEntry[] {
  return projectDirectory as unknown as ProjectEntry[];
}
