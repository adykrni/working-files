# Design System — Source of Truth

> This file is the authoritative reference for all design decisions.
> When building components, always reference this file. Use Shadcn UI as the base component library, but override all tokens (colours, spacing, radius, etc.) with the values defined here.

---

## Architecture

- **Base layer**: Shadcn UI components (via `shadcn-ui` CLI)
- **Styling engine**: Tailwind CSS v3
- **Token strategy**: CSS custom properties in `globals.css`, extended in `tailwind.config.ts`
- **Colour mode**: Light mode primary (extend to dark using the same token names)

---

## 1. Colour System

### 1.1 Core Palette

These are the raw colour values. Never use these directly in components — always use Semantic tokens (Section 1.2).

#### Base
```
black:       #000000
white:       #FFFFFF
transparent: transparent
```

#### Neutral (near-black/white greys)
```
neutral-25:  #FBFBFB
neutral-50:  #FAFAFA
neutral-100: #F5F5F5
neutral-200: #E5E5E5
neutral-300: #D4D4D4
neutral-400: #A3A3A3
neutral-500: #737373
neutral-600: #525252
neutral-700: #404040
neutral-800: #262626
neutral-900: #171717
neutral-950: #0A0A0A
```

#### Gray (warm blue-grey tones)
```
gray-50:  #F6FAFA
gray-100: #EEF5F5
gray-200: #DCE7E7
gray-300: #C2D2D2
gray-400: #9FB4B4
gray-500: #7C9696
gray-600: #5F7A7A
gray-700: #485F5F
gray-800: #2F4545
gray-900: #1C2E2E
```

#### Teal (primary brand colour)
```
teal-50:  #F3FBFA
teal-100: #E7F5F4
teal-200: #CFF0EC
teal-300: #A6E3DC
teal-400: #6FD1C5
teal-500: #3DB8AA
teal-600: #209688
teal-700: #1B7F72
teal-800: #16695E
teal-900: #124F47
```

> **Note**: Green, orange, and red palettes exist in the system (2 values each). Add their hex values here once exported from Figma.

---

### 1.2 Semantic Colour Tokens

Map core palette values to roles. These are what components consume. Override Shadcn's CSS variables with these in `globals.css`.

#### Surface colours
```
--color-surface-default:    var(--white)          /* Page background */
--color-surface-subtle:     var(--neutral-50)     /* Subtle card/panel backgrounds */
--color-surface-raised:     var(--neutral-100)    /* Raised surfaces, hover states */
--color-surface-overlay:    var(--neutral-200)    /* Modals, popovers */
--color-surface-inverted:   var(--neutral-950)    /* Dark surfaces, tooltips */
--color-surface-brand:      var(--teal-500)       /* Primary brand background */
--color-surface-brand-subtle: var(--teal-50)      /* Light brand tint */
--color-surface-brand-muted:  var(--teal-100)     /* Muted brand tint */
```

#### Text colours
```
--color-text-primary:       var(--neutral-900)    /* Main body text */
--color-text-secondary:     var(--neutral-600)    /* Secondary/supporting text */
--color-text-tertiary:      var(--neutral-400)    /* Placeholders, disabled */
--color-text-inverted:      var(--white)          /* Text on dark surfaces */
--color-text-brand:         var(--teal-600)       /* Brand-coloured text */
--color-text-brand-strong:  var(--teal-800)       /* Strong brand text, headings */
```

#### Border colours
```
--color-border-default:     var(--neutral-200)    /* Default borders */
--color-border-strong:      var(--neutral-300)    /* Stronger borders, inputs */
--color-border-subtle:      var(--neutral-100)    /* Subtle dividers */
--color-border-brand:       var(--teal-300)       /* Brand-accented borders */
--color-border-brand-strong: var(--teal-500)      /* Focus rings, active borders */
```

#### Icon colours
```
--color-icon-default:       var(--neutral-600)
--color-icon-subtle:        var(--neutral-400)
--color-icon-brand:         var(--teal-500)
--color-icon-inverted:      var(--white)
```

#### System / Status colours
```
--color-system-success:     /* Map to green values once available */
--color-system-warning:     /* Map to orange values once available */
--color-system-error:       /* Map to red values once available */
--color-system-info:        var(--teal-500)
```

---

## 2. Spacing Scale

The spacing system follows Tailwind's default scale (1 unit = 4px). Values in pixels.

```
0:    0px
px:   1px
0.5:  2px
1:    4px
1.5:  6px
2:    8px
2.5:  10px
3:    12px
3.5:  14px
4:    16px
5:    20px
6:    24px
7:    28px
8:    32px
9:    36px
10:   40px
11:   44px
12:   48px
14:   56px
16:   64px
20:   80px
24:   96px
28:   112px
32:   128px
36:   144px
40:   160px
44:   176px
48:   192px
52:   208px
56:   224px
60:   240px
64:   256px
72:   288px
80:   320px
96:   384px
```

---

## 3. Sizing

### Width
Follows Tailwind convention: `w-{n}` = `n × 4px`.
Full scale: `w-0` (0) through `w-96` (384px), including half-steps (`w-0.5`, `w-1.5`, etc.).

### Height
Identical scale to width. `h-{n}` = `n × 4px`.
Full scale: `h-0` (0) through `h-96` (384px).

### Min/Max Width
14 min-width values and 15 max-width values are defined. Add specific values here once exported.

---

## 4. Breakpoints

```
xs:  640px
sm:  768px
md:  1024px
lg:  1280px
xl:  1536px
```

Semantic breakpoints (from 2. Semantic collection):
```
xs:  2   (likely rem-based — verify with Figma)
s:   4
sm:  6
md:  8
lg:  10
xl:  14
2xl: 16
3xl: 24
4xl: 32
```

---

## 5. Border Radius

From the Semantic `radius` group:

```
radius-xs:  2px   /* Tags, badges */
radius-s:   4px   /* Small inputs */
radius-sm:  6px   /* Buttons, inputs */
radius-md:  8px   /* Cards, panels */
radius-lg:  10px  /* Modals, large cards */
radius-xl:  14px  /* Large containers */
radius-2xl: 16px  /* Hero sections */
radius-3xl: 24px  /* Pill-shaped large elements */
radius-4xl: 32px  /* Maximum rounding */
```

---

## 6. Opacity Scale

Steps of 5 from 0 to 100.
```
opacity-0:   0%
opacity-5:   5%
opacity-10:  10%
opacity-15:  15%
opacity-20:  20%
opacity-25:  25%
opacity-30:  30%
opacity-35:  35%
opacity-40:  40%
opacity-45:  45%
opacity-50:  50%
opacity-55:  55%
opacity-60:  60%
opacity-65:  65%
opacity-70:  70%
opacity-75:  75%
opacity-80:  80%
opacity-85:  85%
opacity-90:  90%
opacity-95:  95%
opacity-100: 100%
```

---

## 7. Typography

> Font values are defined in the Semantic `font` group (1 variable) and `text` group (28 variables). Add specific font families, sizes, weights, and line-heights here once exported from Figma.

### Font Weights (from `font-weight` group — 9 values)
Add values here once exported.

### Suggested type scale (fill in from Figma):
```
text-xs:   12px / line-height: ?
text-sm:   14px / line-height: ?
text-base: 16px / line-height: ?
text-lg:   18px / line-height: ?
text-xl:   20px / line-height: ?
text-2xl:  24px / line-height: ?
text-3xl:  30px / line-height: ?
text-4xl:  36px / line-height: ?
```

---

## 8. Shadows

Shadow groups defined in Semantic: `shadow` (5), `inset-shadow` (15), `drop-shadow` (30).
Add values here once exported from Figma.

---

## 9. Tailwind Configuration

Add this to `tailwind.config.ts` to wire up your design tokens:

```typescript
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
```

---

## 10. CSS Variables (globals.css)

Replace the default Shadcn CSS vars with your brand tokens. Shadcn uses HSL format — convert your hex values below.
> ⚠️ This project uses Tailwind v4. Use @import "tailwindcss" 
> instead of @tailwind directives. Never use @apply in base layers — 
> use direct CSS properties instead.

```css
@layer base {
  :root {
    /* Raw colour primitives (for reference in semantic vars) */
    --teal-50:  #F3FBFA;
    --teal-100: #E7F5F4;
    --teal-200: #CFF0EC;
    --teal-300: #A6E3DC;
    --teal-400: #6FD1C5;
    --teal-500: #3DB8AA;
    --teal-600: #209688;
    --teal-700: #1B7F72;
    --teal-800: #16695E;
    --teal-900: #124F47;

    --neutral-25:  #FBFBFB;
    --neutral-50:  #FAFAFA;
    --neutral-100: #F5F5F5;
    --neutral-200: #E5E5E5;
    --neutral-300: #D4D4D4;
    --neutral-400: #A3A3A3;
    --neutral-500: #737373;
    --neutral-600: #525252;
    --neutral-700: #404040;
    --neutral-800: #262626;
    --neutral-900: #171717;
    --neutral-950: #0A0A0A;

    /* Shadcn semantic overrides — your brand applied */
    --background:            0 0% 100%;          /* white */
    --foreground:            0 0% 9%;            /* neutral-900 #171717 */

    --card:                  0 0% 100%;
    --card-foreground:       0 0% 9%;

    --popover:               0 0% 100%;
    --popover-foreground:    0 0% 9%;

    --primary:               174 49% 47%;        /* teal-500 #3DB8AA */
    --primary-foreground:    0 0% 100%;          /* white */

    --secondary:             174 12% 96%;        /* teal-50 #F3FBFA */
    --secondary-foreground:  174 49% 27%;        /* teal-800 #16695E */

    --muted:                 0 0% 96%;           /* neutral-100 #F5F5F5 */
    --muted-foreground:      0 0% 32%;           /* neutral-600 #525252 */

    --accent:                174 12% 96%;        /* teal-50 */
    --accent-foreground:     174 49% 27%;        /* teal-800 */

    --destructive:           0 84% 60%;          /* red — update once Figma value exported */
    --destructive-foreground: 0 0% 100%;

    --border:                0 0% 90%;           /* neutral-200 #E5E5E5 */
    --input:                 0 0% 83%;           /* neutral-300 #D4D4D4 */
    --ring:                  174 49% 47%;        /* teal-500 — focus ring */

    --radius: 0.5rem;                            /* Base radius = radius-sm (8px) */
  }

  .dark {
    --background:            0 0% 4%;            /* neutral-950 */
    --foreground:            0 0% 96%;           /* neutral-100 */

    --card:                  0 0% 9%;
    --card-foreground:       0 0% 96%;

    --popover:               0 0% 9%;
    --popover-foreground:    0 0% 96%;

    --primary:               174 49% 47%;        /* teal-500 stays consistent */
    --primary-foreground:    0 0% 100%;

    --secondary:             174 25% 12%;        /* teal-900 */
    --secondary-foreground:  174 49% 75%;        /* teal-300 */

    --muted:                 0 0% 15%;
    --muted-foreground:      0 0% 64%;           /* neutral-400 */

    --accent:                174 25% 12%;
    --accent-foreground:     174 40% 86%;        /* teal-200 */

    --destructive:           0 62% 30%;
    --destructive-foreground: 0 0% 96%;

    --border:                0 0% 25%;           /* neutral-700 */
    --input:                 0 0% 25%;
    --ring:                  174 49% 47%;        /* teal-500 */
  }
}
```

---

## 11. Component Rules

When building or modifying components, follow these rules:

### Buttons
- **Primary**: `bg-primary text-primary-foreground` → teal-500 background, white text
- **Secondary**: `bg-secondary text-secondary-foreground` → teal-50 background, teal-800 text
- **Ghost**: `hover:bg-accent hover:text-accent-foreground`
- **Destructive**: `bg-destructive text-destructive-foreground`
- Default radius: `rounded-sm` (6px) for compact buttons, `rounded-md` (8px) for standard

### Cards
- Background: `bg-card` (white)
- Border: `border border-border` (neutral-200)
- Radius: `rounded-md` (8px) or `rounded-lg` (10px)
- Shadow: add once Figma shadow values are exported

### Inputs
- Border: `border-input` (neutral-300)
- Focus ring: `ring-ring` (teal-500)
- Radius: `rounded-sm` (6px)
- Background: `bg-background`

### Text hierarchy
```
Page title:     text-foreground font-bold text-3xl or text-4xl
Section heading: text-foreground font-semibold text-xl or text-2xl
Body:           text-foreground text-base
Secondary:      text-muted-foreground text-sm
Caption:        text-muted-foreground text-xs
Brand link:     text-primary hover:text-primary/80
```

### Spacing guidelines
- Component internal padding: `p-4` (16px) standard, `p-6` (24px) for cards
- Gap between elements: `gap-2` (8px) tight, `gap-4` (16px) default, `gap-6` (24px) loose
- Section vertical spacing: `py-12` (48px) or `py-16` (64px)
- Page horizontal padding: `px-4` mobile, `px-6` sm, `px-8` md+

---

## 12. Cursor Instructions

When Cursor generates or modifies code:

1. **Always** use Tailwind utility classes — never inline styles
2. **Always** use semantic colour tokens (`text-primary`, `bg-muted`, etc.) — not raw palette classes (`text-teal-500`) in component JSX
3. **Always** use spacing values from the scale — no arbitrary values like `p-[13px]`
4. **Always** use Shadcn components as the base — extend via `className`, never rewrite from scratch
5. **Radius**: use the named radius tokens (`rounded-sm`, `rounded-md`) not `rounded-full` unless intentional
6. **Responsive**: mobile-first, use breakpoints `sm:`, `md:`, `lg:` (768, 1024, 1280px)
7. When adding a new component, look for a matching Shadcn primitive first before building custom
8. Keep dark mode support by only using CSS variable-backed colours

---

## 13. Setup Checklist

When starting a new project:

- [ ] `npx create-next-app@latest` (or Vite + React)
- [ ] `npx shadcn@latest init` — select default style, use CSS variables: yes
- [ ] Copy the Tailwind config from Section 9
- [ ] Copy the CSS variables from Section 10 into `globals.css`
- [ ] Install `tailwindcss-animate`
- [ ] Add `designsystem.md` to the project root
- [ ] In Cursor, add this file to context via `.cursorrules` or reference it directly in prompts

### .cursorrules snippet
Add to `.cursorrules` at project root:
```
Always follow the design system defined in designsystem.md.
Use Shadcn UI components as the base. Apply tokens from designsystem.md — never deviate from the colour, spacing, radius, or typography scales defined there.
```

---

## 14. Missing Values (To Export from Figma)

The following groups were visible in the Figma variable panel but not fully captured in these screenshots. Export and add them here:

- [ ] `green` palette (2 values)
- [ ] `orange` palette (2 values)  
- [ ] `red` palette (2 values)
- [ ] `min-width` (14 values)
- [ ] `max-width` (15 values)
- [ ] `border-radius` core values (11 values from Core collection)
- [ ] `border-width` (9 values)
- [ ] `line-height` (20 values)
- [ ] Semantic: `font` (1 value) — font family
- [ ] Semantic: `text` (28 values) — full type scale
- [ ] Semantic: `font-weight` (9 values)
- [ ] Semantic: `shadow` (5 values)
- [ ] Semantic: `inset-shadow` (15 values)
- [ ] Semantic: `drop-shadow` (30 values)
- [ ] Semantic: `blur` (7 values)
- [ ] Semantic: `colours/surface` (9 values)
- [ ] Semantic: `colours/text` (10 values)
- [ ] Semantic: `colours/borders` (9 values)
- [ ] Semantic: `colours/system` (9 values)
- [ ] Semantic: `colours/icon` (11 values)
- [ ] Semantic: `container` (13 values)
- [ ] Semantic: `components` (84 values)
