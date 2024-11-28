import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        tablet: "868px",
      },
      keyframes: {
        textFade: {
          "0%": { color: "var(--text-color)" },
          "100%": { color: "black" },
        },
      },
      animation: {
        textFade: "textFade 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
