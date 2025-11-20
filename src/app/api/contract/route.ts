import { NextRequest, NextResponse } from "next/server";
import { fetchBaseScanAbi } from "@/lib/apis";
import { callGemini } from "@/lib/gemini";
import { contractRiskFromAbi, fallbackNoData } from "@/lib/guardrails";
import { buildNoContextPrompt, buildSearchPrompt } from "@/lib/prompt";
import type { ContractAnalysisResponse, ContractFunctionMeta } from "@/lib/types";

const adminKeywords = ["owner", "admin", "pause", "unpause", "upgrade", "set"];
const tokenKeywords = ["transfer", "approve", "mint", "burn"];

function categorizeFunctions(abi: any[]): string[] {
  const names = abi
    .filter((item) => item?.type === "function")
    .map((item) => String(item.name ?? "").toLowerCase());

  const categories = new Set<string>();

  if (names.some((name) => adminKeywords.some((keyword) => name.includes(keyword)))) {
    categories.add("admin-controls");
  }

  if (names.some((name) => tokenKeywords.some((keyword) => name.includes(keyword)))) {
    categories.add("token-logic");
  }

  if (names.some((name) => name.includes("proxy") || name.includes("upgrade"))) {
    categories.add("proxy-upgradeable");
  }

  return Array.from(categories);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = (searchParams.get("address") ?? "").toLowerCase();

  if (!address) {
    return NextResponse.json({ error: "address parameter required" }, { status: 400 });
  }

  const abi = (await fetchBaseScanAbi(address)) ?? [];

  if (!abi.length) {
    return NextResponse.json(
      {
        address,
        abi: [],
        categories: [],
        risks: [],
        aiSummary: fallbackNoData()
      },
      { status: 200 }
    );
  }

  const prompt = buildSearchPrompt(`Jelaskan risiko kontrak ${address}`, { abi });
  let aiSummary = await callGemini(prompt);
  if (!aiSummary?.trim() || aiSummary.trim() === fallbackNoData()) {
    aiSummary = await callGemini(
      buildNoContextPrompt(`Contract risk request for ${address}. Summarize common risk considerations when ABI data is unavailable.`)
    );
  }
  const risks = contractRiskFromAbi(abi);
  const categories = categorizeFunctions(abi);

  const formattedAbi: ContractFunctionMeta[] = abi
    .filter((item: any) => item?.type === "function")
    .slice(0, 20)
    .map((item: any) => ({
      name: item.name,
      stateMutability: item.stateMutability,
      inputs: item.inputs?.map((input: any) => ({ name: input.name, type: input.type })) ?? []
    }));

  const payload: ContractAnalysisResponse = {
    address,
    abi: formattedAbi,
    categories,
    risks,
    aiSummary
  };

  return NextResponse.json(payload, { status: 200 });
}
