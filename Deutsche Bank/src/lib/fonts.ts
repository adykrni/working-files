import localFont from "next/font/local";

export const deutscheBankDisplay = localFont({
  src: "../fonts/DeutscheBankDisplay-Regular.ttf",
  variable: "--font-deutsche-display",
  display: "swap",
  fallback: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
});

export const deutscheBankText = localFont({
  src: "../fonts/DeutscheBankText-Regular.ttf",
  variable: "--font-deutsche-text",
  display: "swap",
  fallback: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
});
