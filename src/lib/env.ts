function getEnv(key: string, fallback?: string) {
  const value = process.env[key];
  return value ?? fallback ?? undefined;
}

export const env = {
  geminiApiKey: getEnv("GEMINI_API_KEY"),
  geminiModel: getEnv("GEMINI_MODEL", "gemini-3.0-flash"),
  basescanApiKey: getEnv("BASESCAN_API_KEY"),
  etherscanApiKey: getEnv("ETHERSCAN_API_KEY"),
  geckoTerminalApiKey: getEnv("GECKOTERMINAL_API_KEY"),
  etherscanChainId: getEnv("ETHERSCAN_CHAIN_ID", "8453"),
  appUrl: getEnv("APP_URL", "http://localhost:3000")
};
