function getEnv(key: string, fallback?: string) {
  const value = process.env[key];
  return value ?? fallback ?? undefined;
}

export const env = {
  geminiApiKey: getEnv("GEMINI_API_KEY"),
  geminiModel: getEnv("GEMINI_MODEL", "gemini-2.5-flash"),
  basescanApiKey: getEnv("BASESCAN_API_KEY"),
  etherscanApiKey: getEnv("ETHERSCAN_API_KEY"),
  appUrl: getEnv("APP_URL", "http://localhost:3000")
};
