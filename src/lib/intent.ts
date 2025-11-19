import type { IntentKind } from "./types";

const tokenKeywords = ["token", "price", "volume", "dex", "lp", "market"];
const contractKeywords = ["contract", "abi", "function", "mint", "owner", "pause"];
const trendKeywords = ["trending", "hot", "baru", "today", "minggu"];
const projectKeywords = ["project", "dapp", "ecosystem", "directory", "apps", "daftar"];

export function detectIntent(query: string): IntentKind {
  const normalized = query.toLowerCase();

  if (contractKeywords.some((word) => normalized.includes(word))) {
    return "contract";
  }

  if (tokenKeywords.some((word) => normalized.includes(word))) {
    return "token";
  }

  if (trendKeywords.some((word) => normalized.includes(word))) {
    return "trend";
  }

  if (projectKeywords.some((word) => normalized.includes(word))) {
    return "project";
  }

  if (normalized.includes("base") || normalized.includes("ecosystem")) {
    return "ecosystem";
  }

  return "general";
}
