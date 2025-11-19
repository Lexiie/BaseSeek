import projectDirectory from "../../data/projects.json";
import { env } from "./env";
import { fetchJson, safeFetch } from "./http";
import type { ProjectEntry, TokenMetrics } from "./types";

const DEXSCREENER_TOKEN_ENDPOINT = "https://api.dexscreener.com/latest/dex/tokens/";
const DEXSCREENER_TRENDING_ENDPOINT = "https://api.dexscreener.com/latest/dex/trending/base";
const AERODROME_POOLS_ENDPOINT = "https://api.aerodrome.finance/pools";
const BASESCAN_API = "https://api.basescan.org/api";

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
  if (!env.basescanApiKey) return undefined;

  return safeFetch(async () => {
    const url = `${BASESCAN_API}?module=token&action=tokeninfo&contractaddress=${address}&apikey=${env.basescanApiKey}`;
    const data = await fetchJson<{ result?: TokenMetrics[] }>(url);
    return data.result?.[0];
  });
}

export async function fetchBaseScanAbi(address: string) {
  if (!env.basescanApiKey) return undefined;

  return safeFetch(async () => {
    const url = `${BASESCAN_API}?module=contract&action=getabi&address=${address}&apikey=${env.basescanApiKey}`;
    const data = await fetchJson<{ result?: string }>(url);
    if (!data.result) return undefined;
    return JSON.parse(data.result);
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
