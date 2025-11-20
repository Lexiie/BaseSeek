import projectDirectory from "../../data/projects.json";
import { env } from "./env";
import { fetchJson, safeFetch } from "./http";
import type { ProjectEntry, TokenMetrics } from "./types";

const DEXSCREENER_TOKEN_ENDPOINT = "https://api.dexscreener.com/latest/dex/tokens/";
const DEXSCREENER_TRENDING_ENDPOINT = "https://api.dexscreener.com/latest/dex/trending/base";
const AERODROME_POOLS_ENDPOINT = "https://aerodrome.finance/api/pools.json";
const ETHERSCAN_API_V2 = "https://api.etherscan.io/v2/api";

function getEtherscanApiKey() {
  return env.etherscanApiKey ?? env.basescanApiKey ?? "";
}

function buildEtherscanUrl(params: Record<string, string>) {
  const search = new URLSearchParams({ chain: "base", apikey: getEtherscanApiKey(), ...params });
  return `${ETHERSCAN_API_V2}?${search.toString()}`;
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
    const url = buildEtherscanUrl({ module: "token", action: "tokeninfo", contractaddress: address });
    const data = await fetchJson<{ result?: TokenMetrics | TokenMetrics[] }>(url);
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
    const url = buildEtherscanUrl({ module: "contract", action: "getabi", address });
    const data = await fetchJson<{ result?: unknown }>(url);
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

    if (!abiRaw) return undefined;

    try {
      return JSON.parse(abiRaw);
    } catch (error) {
      console.error("Failed to parse ABI", error);
      return undefined;
    }
  });
}

export async function fetchAerodromeTopPools() {
  return safeFetch(async () => {
    const data = await fetchJson<{ data?: Array<Record<string, unknown>> }>(AERODROME_POOLS_ENDPOINT);
    return data?.data ?? [];
  });
}

export function getProjectDirectory(): ProjectEntry[] {
  return projectDirectory as unknown as ProjectEntry[];
}
