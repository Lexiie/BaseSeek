import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        base: {
          50: "#f5f8ff",
          300: "#7ca7ff",
          500: "#3b82f6",
          700: "#1d4ed8",
          900: "#0f172a"
        }
      },
      boxShadow: {
        card: "0 10px 40px -15px rgba(15, 23, 42, 0.35)"
      },
      animation: {
        pulseSlow: "pulse 3s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
