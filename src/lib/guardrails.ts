import type { GuardrailNotice, RiskFlag, TokenMetrics } from "./types";

const prohibitedPatterns = [
  /rug ?pull/i,
  /exploit/i,
  /hack/i,
  /private key/i,
  /seed phrase/i,
  /malware/i
];

const financialAdvicePatterns = [/\b(buy|sell|hold)\b/i, /target price/i];

export function detectProhibitedRequest(query: string): GuardrailNotice {
  const matched = prohibitedPatterns.some((pattern) => pattern.test(query));
  if (matched) {
    return {
      blocked: true,
      reason:
        "This request cannot be answered for security reasons. I can help with contract structure or safety reviews instead."
    };
  }

  return { blocked: false };
}

export function removeFinancialAdvice(text: string): string {
  if (!text) return text;
  return financialAdvicePatterns.reduce((acc, pattern) => acc.replace(pattern, ""), text);
}

export function fallbackNoData(): string {
  return "No data found from the available sources.";
}

export function tokenRiskFlags(metrics: TokenMetrics): RiskFlag[] {
  const risks: RiskFlag[] = [];

  if (metrics.liquidityUsd !== undefined && metrics.liquidityUsd < 20000) {
    risks.push({
      id: "low-liquidity",
      label: "Extremely low liquidity",
      description: "Liquidity < $20k makes the token easy to manipulate.",
      severity: "high"
    });
  }

  if (!metrics.address) {
    risks.push({
      id: "no-address",
      label: "Contract address missing",
      description: "A verified contract address was not supplied.",
      severity: "medium"
    });
  }

  return risks;
}

export function contractRiskFromAbi(abi: any[]): RiskFlag[] {
  const risks: RiskFlag[] = [];
  const lowerNames = abi.map((item) => (typeof item?.name === "string" ? item.name.toLowerCase() : ""));

  if (lowerNames.includes("mint")) {
    risks.push({
      id: "mint-open",
      label: "Mint function detected",
      description: "⚠ Tokens may be minted without limit if the mint function is exposed.",
      severity: "high"
    });
  }

  if (lowerNames.includes("owner") || lowerNames.includes("setowner")) {
    risks.push({
      id: "owner-control",
      label: "Owner privilege",
      description: "Owner-reserved functions grant administrative control.",
      severity: "medium"
    });
  }

  if (lowerNames.includes("pause") || lowerNames.includes("unpause")) {
    risks.push({
      id: "pausable",
      label: "Pausable contract",
      description: "Pause/unpause controls allow the team to halt activity.",
      severity: "info"
    });
  }

  return risks;
}
