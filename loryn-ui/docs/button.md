# Button — Component Specification

**Product:** Loryn UI  
**Component:** Button  
**Version:** 1.0  
**Last updated:** June 2025  
**Source file:** `src/components/ui/button.tsx`  
**Public import:** `@/components/base/button` (re-exports from `ui`)

---

## 1. Overview

The Button is the primary interactive control for actions, form submission, and navigation triggers. It is built with **class-variance-authority (CVA)** for variants, **Radix Slot** for composition (`asChild`), and **Lucide** for the loading spinner.

All visual values live in a single **token object (`t`)** at the top of the source file. To change how any variant looks, edit tokens there only — not scattered class strings in JSX.

### Design principles

- Use semantic palette tokens from `globals.css` (teal, neutral, gray, red).
- Every optional adornment (leading icon, trailing icon, badge) is **opt-in** — omit the prop to hide it.
- Focus ring: teal-500, 2px ring with offset.
- Transitions: `transition-colors duration-150`.
- Disabled: `disabled:pointer-events-none` plus variant-specific muted backgrounds/text.

### When to use

| Variant       | Use for                                              |
|---------------|------------------------------------------------------|
| `default`     | Primary CTAs, form submit, main actions               |
| `secondary`   | Secondary actions, cancel pairs with primary        |
| `destructive` | Delete, remove, irreversible actions                |
| `outline`     | Tertiary actions, filters, low-emphasis controls    |
| `ghost`       | Toolbar actions, dismiss, inline controls           |
| `link`        | Text-style navigation, “Learn more” patterns          |

---

## 2. Import

```tsx
import { Button } from "@/components/base/button"
import { Plus, ArrowRight } from "lucide-react"
```

Pages and features must import from **`@/components/base/button`**, not `@/components/ui/button`.

---

## 3. Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default"` \| `"secondary"` \| `"destructive"` \| `"outline"` \| `"ghost"` \| `"link"` | `"default"` | Visual style |
| `size` | `"sm"` \| `"md"` \| `"lg"` \| `"icon"` | `"md"` | Height, padding, type scale |
| `children` | `React.ReactNode` | — | Button label text |
| `leadingIcon` | `React.ReactNode` | — | Icon before label. **Omit to hide.** |
| `trailingIcon` | `React.ReactNode` | — | Icon after label and badge. **Omit to hide.** |
| `badge` | `number` | — | Numeric count pill. **Omit to hide.** Only integers/counts. |
| `isLoading` | `boolean` | `false` | Shows spinner; disables button; hides `leadingIcon` |
| `selected` | `boolean` | `false` | Toggle/pressed state via `data-selected="true"` |
| `disabled` | `boolean` | `false` | Native disabled + variant disabled styles |
| `asChild` | `boolean` | `false` | Merge props onto child via Radix `Slot` |
| `className` | `string` | — | Escape hatch for one-off overrides |
| `...props` | `ButtonHTMLAttributes` | — | Native `<button>` attributes (`onClick`, `type`, `aria-*`, etc.) |

### Content layout order

When multiple slots are used, content renders in this order:

```
[ Loading spinner ] → [ Leading icon ] → [ Label ] → [ Badge ] → [ Trailing icon ]
```

| Slot | Shown when |
|------|------------|
| Loading spinner | `isLoading={true}` |
| Leading icon | `leadingIcon` is set **and** not loading |
| Label | `children` (hidden for `size="icon"` when only `leadingIcon` is used) |
| Badge | `badge` is a number (including `0`) |
| Trailing icon | `trailingIcon` is set |

---

## 4. Variants

### 4.1 `default` — Primary

Primary brand action. Teal fill, light text.

| State | Background | Text |
|-------|------------|------|
| Default | `teal-600` | `gray-50` |
| Hover | `teal-700` | `gray-50` |
| Selected | `teal-600` | `white` |
| Disabled | `neutral-100` | `neutral-400` |

**Badge:** `teal-800` background, white text.

---

### 4.2 `secondary` — Secondary

Soft teal surface, dark text. **No border.**

| State | Background | Text |
|-------|------------|------|
| Default | `teal-100` | `neutral-900` |
| Hover | `gray-100` | `neutral-900` |
| Selected | `teal-600` | `white` |
| Disabled | `neutral-100` | `neutral-400` |

**Badge:** `neutral-900` background, white text.

---

### 4.3 `destructive` — Destructive

Red fill for dangerous actions.

| State | Background | Text |
|-------|------------|------|
| Default | `red-500` | `white` |
| Hover | `red-600` | `white` |
| Selected | `red-700` | `white` |
| Disabled | `red-100` | `red-300` |

**Badge:** `red-800` background, white text.

---

### 4.4 `outline` — Outline

White surface with neutral border.

| State | Background | Border | Text |
|-------|------------|--------|------|
| Default | `white` | `neutral-200` | `neutral-900` |
| Hover | `gray-100` | `neutral-300` | `neutral-900` |
| Selected | `neutral-100` | `neutral-400` | `neutral-900` |
| Disabled | `white` | `neutral-200` | `neutral-400` |

**Badge:** `neutral-100` background, `neutral-900` text.

---

### 4.5 `ghost` — Ghost

Transparent until hover/selected.

| State | Background | Text |
|-------|------------|------|
| Default | transparent | `neutral-900` |
| Hover | `gray-100` | `neutral-900` |
| Selected | `neutral-100` | `neutral-900` |
| Disabled | transparent | `neutral-400` |

**Badge:** `neutral-100` background, `neutral-900` text.

---

### 4.6 `link` — Link

Text-only, underlined. No fixed height/padding (`p-0 h-auto`).

| State | Text |
|-------|------|
| Default | `neutral-900`, underline |
| Hover | `neutral-600` |
| Disabled | `neutral-400` |

**Badge:** `neutral-100` background, `neutral-900` text.

---

## 5. Sizes

| Size | Height | Horizontal padding | Font | Border radius | Notes |
|------|--------|-------------------|------|---------------|-------|
| `sm` | 32px (`h-8`) | `px-3` (12px) | `text-sm` | `rounded-md` (8px) | Compact toolbars, tables |
| `md` | 36px (`h-9`) | `px-4` (16px) | `text-sm` | `rounded-md` | **Default** |
| `lg` | 44px (`h-11`) | `px-6` (24px) | `text-base` | `rounded-md` | Hero CTAs, emphasis |
| `icon` | 36×36px (`h-9 w-9`) | none (`p-0`) | `text-sm` | `rounded-full` | Icon-only; use `leadingIcon` + `aria-label` |

### Icon slot dimensions (leading / trailing / loading)

| Button size | Icon container |
|-------------|----------------|
| `sm` | 14px (`size-3.5`) |
| `md` | 16px (`size-4`) |
| `lg` | 20px (`size-5`) |
| `icon` | 16px (`size-4`) |

Pass Lucide (or any) icons without manual `className` — the slot sizes the SVG.

---

## 6. States

### 6.1 Loading (`isLoading`)

- Renders `Loader2` (Lucide) as the first child.
- Sets `disabled` on the native button.
- **Suppresses** `leadingIcon` while loading (spinner occupies leading position).
- Label, `badge`, and `trailingIcon` still render unless you remove them.

```tsx
<Button isLoading>Saving…</Button>
<Button variant="secondary" isLoading>Processing…</Button>
```

### 6.2 Selected (`selected`)

- Sets `data-selected="true"` on the element.
- Variant-specific `data-[selected=true]:` classes apply (see variant tables).
- Use for toggle groups, active filters, segmented controls.

```tsx
<Button selected>Active view</Button>
<Button variant="outline" selected>Filtered</Button>
```

### 6.3 Disabled (`disabled`)

- Native `disabled` attribute.
- Variant-specific disabled background and text colors.
- No pointer events.

```tsx
<Button disabled>Unavailable</Button>
```

---

## 7. Icons & badge

### 7.1 Leading icon

```tsx
<Button leadingIcon={<Plus />}>New item</Button>
```

### 7.2 Trailing icon

```tsx
<Button trailingIcon={<ArrowRight />}>Continue</Button>
```

### 7.3 Badge (number only)

```tsx
<Button badge={3}>Inbox</Button>
<Button badge={0}>Empty state count</Button>
```

Badge styling is variant-aware (see variant sections). Rendered **after** the label, **before** the trailing icon.

### 7.4 Combined

```tsx
<Button
  leadingIcon={<Plus />}
  badge={12}
  trailingIcon={<ChevronDown />}
>
  Workspace
</Button>
```

### 7.5 Icon-only button

```tsx
<Button size="icon" leadingIcon={<Plus />} aria-label="Add item" />
```

Always provide **`aria-label`** (or `aria-labelledby`) for icon-only buttons.

### 7.6 Plain label (no adornments)

```tsx
<Button>Save changes</Button>
```

---

## 8. Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Icon-only buttons | Required `aria-label` |
| Loading | Button is `disabled` while loading; consider `aria-busy` via spread props if needed |
| Decorative icons | Icon slots use `aria-hidden` on wrappers |
| Focus | Visible `focus-visible:ring-2 ring-teal-500 ring-offset-2` |
| Keyboard | Native `<button>` behavior unless `asChild` |

---

## 9. Composition (`asChild`)

When `asChild` is true, the button styles merge onto a single child (e.g. Next.js `Link`):

```tsx
<Button asChild variant="link">
  <a href="/docs">Documentation</a>
</Button>
```

**Limitation:** With `asChild`, Slot expects one child. Avoid combining `asChild` with multiple internal slots unless the child renders the full content itself.

---

## 10. Usage examples

### Basic

```tsx
<Button>Save changes</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline" size="sm">Filter</Button>
<Button variant="ghost">Dismiss</Button>
<Button variant="link">Learn more</Button>
```

### Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="icon" leadingIcon={<Plus />} aria-label="Add" />
```

### States

```tsx
<Button isLoading>Saving…</Button>
<Button selected>Active</Button>
<Button disabled>Unavailable</Button>
```

### Icons & badge

```tsx
<Button leadingIcon={<Plus />}>New item</Button>
<Button trailingIcon={<ArrowRight />}>Continue</Button>
<Button badge={3}>Inbox</Button>
<Button leadingIcon={<Plus />} badge={12} trailingIcon={<ChevronDown />}>
  Workspace
</Button>
```

### Override (escape hatch)

```tsx
<Button className="w-full">Full width</Button>
```

---

## 11. Visual QA

A living reference page is available at:

**Route:** `/design-test`

Sections: Variants, Sizes, States (loading, selected, disabled, with icon).

Run locally: `npm run dev` → open `http://localhost:3000/design-test`.

---

## 12. Token reference (implementation)

Maintainers edit the `t` object in `src/components/ui/button.tsx`.

### Shared

| Token | Classes |
|-------|---------|
| Base layout | `inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 cursor-pointer` |
| Focus | `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2` |
| Disabled | `disabled:pointer-events-none` |

### Badge base

`inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-xs font-medium tabular-nums leading-none`

---

## 13. Do's and don'ts

### Do

- Import from `@/components/base/button`.
- Use `leadingIcon` / `trailingIcon` / `badge` props instead of manually placing icons in `children`.
- Pair `destructive` with confirmation dialogs for irreversible actions.
- Use `md` as the default size unless space is constrained.
- Provide `aria-label` on `size="icon"` buttons.

### Don't

- Import from `@/components/ui/button` in pages or features.
- Put raw palette classes on instances — extend tokens in `t` instead.
- Use `badge` for non-numeric content (strings, dots) — prop is `number` only.
- Rely on `leadingIcon` during `isLoading` — it is hidden; spinner shows instead.
- Edit `src/components/ui/button.tsx` from the Shadcn CLI overwrite without reconciling tokens.

---

## 14. Dependencies

| Package | Purpose |
|---------|---------|
| `class-variance-authority` | Variant definitions |
| `@radix-ui/react-slot` | `asChild` composition |
| `lucide-react` | `Loader2` loading icon |
| `@/lib/utils` | `cn()` class merging |

Icons in examples use **Lucide React**; any `ReactNode` is accepted for icon slots.

---

## 15. Export surface

```tsx
export { Button, buttonVariants }
export type { ButtonProps }
```

`buttonVariants` is exported for advanced composition (e.g. custom elements that need the same classes).

---

*This document reflects the implementation in `src/components/ui/button.tsx`. For system-wide colour and spacing rules, see `designsystem.md` at the project root.*
