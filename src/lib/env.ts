function getEnv(key: string, fallback?: string) {
  const value = process.env[key];
  return value ?? fallback ?? undefined;
}

export const env = {
  geminiApiKey: getEnv("GEMINI_API_KEY"),
  geminiModel: getEnv("GEMINI_MODEL", "gemini-2.5-flash"),
  geminiFallbackModel: getEnv("GEMINI_FALLBACK_MODEL", "gemma-3-27b"),
  basescanApiKey: getEnv("BASESCAN_API_KEY"),
  etherscanApiKey: getEnv("ETHERSCAN_API_KEY"),
  geckoTerminalApiKey: getEnv("GECKOTERMINAL_API_KEY"),
  etherscanChainId: getEnv("ETHERSCAN_CHAIN_ID", "8453"),
  appUrl: getEnv("APP_URL", "http://localhost:3000"),
  dexscreenerBaseUrl: getEnv("DEXSCREENER_MCP_BASE_URL", "https://mcpmarket.com/server/dexscreener"),
  basescanApiUrl: getEnv("BASESCAN_API_URL", "https://mcpmarket.com/server/basescan/api"),
  etherscanApiUrl: getEnv("ETHERSCAN_API_URL", "https://mcpmarket.com/server/basescan/api"),
  basescanMcpAuthToken: getEnv("BASESCAN_MCP_TOKEN")
};
