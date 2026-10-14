import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Core palette — available as Tailwind utilities
        neutral: {
          25:  "#FBFBFB",
          50:  "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0A0A0A",
        },
        gray: {
          50:  "#F6FAFA",
          100: "#EEF5F5",
          200: "#DCE7E7",
          300: "#C2D2D2",
          400: "#9FB4B4",
          500: "#7C9696",
          600: "#5F7A7A",
          700: "#485F5F",
          800: "#2F4545",
          900: "#1C2E2E",
        },
        teal: {
          50:  "#F3FBFA",
          100: "#E7F5F4",
          200: "#CFF0EC",
          300: "#A6E3DC",
          400: "#6FD1C5",
          500: "#3DB8AA",
          600: "#209688",
          700: "#1B7F72",
          800: "#16695E",
          900: "#124F47",
        },
        // Semantic aliases — what Shadcn components use
        background:    "hsl(var(--background))",
        foreground:    "hsl(var(--foreground))",
        primary: {
          DEFAULT:     "hsl(var(--primary))",
          foreground:  "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:     "hsl(var(--secondary))",
          foreground:  "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT:     "hsl(var(--muted))",
          foreground:  "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:     "hsl(var(--accent))",
          foreground:  "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT:     "hsl(var(--destructive))",
          foreground:  "hsl(var(--destructive-foreground))",
        },
        border:        "hsl(var(--border))",
        input:         "hsl(var(--input))",
        ring:          "hsl(var(--ring))",
        card: {
          DEFAULT:     "hsl(var(--card))",
          foreground:  "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT:     "hsl(var(--popover))",
          foreground:  "hsl(var(--popover-foreground))",
        },
      },
      borderRadius: {
        xs:  "2px",
        s:   "4px",
        sm:  "6px",
        md:  "8px",
        lg:  "10px",
        xl:  "14px",
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "32px",
      },
      screens: {
        xs: "640px",
        sm: "768px",
        md: "1024px",
        lg: "1280px",
        xl: "1536px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
