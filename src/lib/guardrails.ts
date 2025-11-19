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
        "Permintaan tersebut tidak dapat dijawab demi alasan keamanan. Namun saya dapat bantu analisis keamanan kontrak atau struktur teknisnya."
    };
  }

  return { blocked: false };
}

export function removeFinancialAdvice(text: string): string {
  if (!text) return text;
  return financialAdvicePatterns.reduce((acc, pattern) => acc.replace(pattern, ""), text);
}

export function fallbackNoData(): string {
  return "Data tidak ditemukan pada sumber yang tersedia.";
}

export function tokenRiskFlags(metrics: TokenMetrics): RiskFlag[] {
  const risks: RiskFlag[] = [];

  if (metrics.liquidityUsd !== undefined && metrics.liquidityUsd < 20000) {
    risks.push({
      id: "low-liquidity",
      label: "Likuiditas sangat rendah",
      description: "Likuiditas < $20k menandakan token mudah dipump/dump.",
      severity: "high"
    });
  }

  if (!metrics.address) {
    risks.push({
      id: "no-address",
      label: "Alamat tidak tersedia",
      description: "Tidak ada alamat kontrak yang divalidasi.",
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
      label: "Mint function terdeteksi",
      description: "⚠ Token dapat dicetak tanpa batas jika fungsi mint terbuka.",
      severity: "high"
    });
  }

  if (lowerNames.includes("owner") || lowerNames.includes("setowner")) {
    risks.push({
      id: "owner-control",
      label: "Owner privilege",
      description: "Owner dapat memegang hak administratif, pastikan ada tim tepercaya.",
      severity: "medium"
    });
  }

  if (lowerNames.includes("pause") || lowerNames.includes("unpause")) {
    risks.push({
      id: "pausable",
      label: "Kontrak dapat dipause",
      description: "Pause/unpause memungkinkan tim menghentikan aktivitas token.",
      severity: "info"
    });
  }

  return risks;
}
