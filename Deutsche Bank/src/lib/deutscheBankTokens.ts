export const deutscheBankTokens = {
  colors: {
    primary: "#00205b",
    secondary: "#535b61",
    secondaryLight: "#6f7580",
    muted: "#6d7686",
    label: "#39404f",
    background: "#fbfbfb",
    surface: "#ffffff",
    surfaceLight: "#f5f7f9",
    cardBg: "#f4f7fc",
    border: "#dee3ec",
    borderSecondary: "#e8eef5",
    success: "#088242",
    successBright: "#3fff9a",
    info: "#1a69de",
    warning: "#f59e0b",
    alertDot: "#db7045",
    equities: "#6ab4e7",
    bonds: "#88c3ed",
    cash: "#b8d9f0",
  },
  fonts: {
    display:
      'var(--font-deutsche-display), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    text: 'var(--font-deutsche-text), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  shadows: {
    card: "0px 1px 2px 0px rgba(0, 0, 0, 0.1), 0px 1px 0px -1px rgba(0, 0, 0, 0.15), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.15)",
  },
} as const;

export type DeutscheBankTokens = typeof deutscheBankTokens;
