export type IntentKind =
  | "token"
  | "project"
  | "contract"
  | "ecosystem"
  | "trend"
  | "general";

export type SourceLink = {
  label: string;
  url: string;
};

export type RiskFlag = {
  id: string;
  label: string;
  description: string;
  severity: "info" | "low" | "medium" | "high";
};

export interface GuardrailNotice {
  blocked: boolean;
  reason?: string;
}

export interface SearchResultPayload {
  query: string;
  intent: IntentKind;
  summary: string;
  insights: string[];
  sources: SourceLink[];
  risks: RiskFlag[];
  raw: Record<string, unknown>;
  guardrail: GuardrailNotice;
}

export interface TokenMetrics {
  address?: string;
  name?: string;
  symbol?: string;
  priceUsd?: number;
  fdv?: number;
  liquidityUsd?: number;
  volume24hUsd?: number;
  holders?: number;
  pairs?: Array<Record<string, unknown>>;
}

export interface TokenApiResponse {
  token: TokenMetrics;
  risks: RiskFlag[];
  sources: SourceLink[];
  aiSummary: string;
}

export interface ContractFunctionMeta {
  name: string;
  stateMutability?: string;
  inputs?: Array<{ name: string; type: string }>;
}

export interface ContractAnalysisResponse {
  address: string;
  abi: ContractFunctionMeta[];
  categories: string[];
  risks: RiskFlag[];
  aiSummary: string;
}

export interface ProjectEntry {
  name: string;
  category: string;
  description: string;
  website: string;
  tags: string[];
  contracts?: string[];
  highlights?: string[];
}

export interface SearchContext {
  [key: string]: unknown;
  intent: IntentKind;
  query: string;
  trendingTokens?: TokenMetrics[];
  aerodromePools?: Array<Record<string, unknown>>;
  projects?: ProjectEntry[];
}
