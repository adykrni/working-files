# Components — Base Component Specifications

> **How to use this file in Cursor**
> This file specifies every base component in `components/base/`. Each component wraps a Shadcn UI primitive and applies the design system tokens from `designsystem.md`. When building or modifying a component:
> 1. Start from the Shadcn source (`components/ui/`)
> 2. Apply the variant spec below (update the `cva` call)
> 3. Save the result to `components/base/`
> 4. Never import from `components/ui/` in pages — always import from `components/base/`

---

## Folder structure

```
components/
├── ui/          ← Shadcn originals (auto-generated, do not edit)
├── base/        ← Your 41 base components (edit these)
│   ├── accordion.tsx
│   ├── alert.tsx
│   ├── alert-dialog.tsx
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── button.tsx
│   ├── button-group.tsx
│   ├── calendar.tsx
│   ├── collapsible.tsx
│   ├── command.tsx
│   ├── combobox.tsx
│   ├── data-table.tsx
│   ├── date-picker.tsx
│   ├── dialog.tsx
│   ├── drawer.tsx
│   ├── dropdown-menu.tsx
│   ├── empty.tsx
│   ├── field.tsx
│   ├── hover-card.tsx
│   ├── input.tsx
│   ├── input-group.tsx
│   ├── item.tsx
│   ├── label.tsx
│   ├── menubar.tsx
│   ├── navigation-menu.tsx
│   ├── popover.tsx
│   ├── progress.tsx
│   ├── radio-group.tsx
│   ├── scroll-area.tsx
│   ├── select.tsx
│   ├── separator.tsx
│   ├── sheet.tsx
│   ├── sidebar.tsx
│   ├── slider.tsx
│   ├── sonner.tsx
│   ├── spinner.tsx
│   ├── switch.tsx
│   ├── tabs.tsx
│   ├── text-area.tsx
│   ├── toggle-group.tsx
│   └── typography.tsx
└── custom/      ← Composite components (see patterns.md)
```

---

## Global rules (apply to every component)

- Use `cn()` from `@/lib/utils` for all className merging
- Colours: always use semantic CSS variable tokens (`bg-primary`, `text-muted-foreground`) — never raw palette classes (`bg-teal-500`) in component JSX
- Radius: use the design system scale — `rounded-sm` (6px) for controls, `rounded-md` (8px) for containers
- Focus rings: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`
- Disabled state: `disabled:opacity-50 disabled:pointer-events-none`
- Transitions: `transition-colors duration-150` for colour changes

---

## 1. Accordion

**Shadcn source**: `accordion`
**Use case**: Collapsible content sections, FAQs

### Variant spec
```tsx
// No cva needed — extend with className
// Trigger: neutral by default, brand colour on hover
trigger: "hover:text-primary hover:no-underline"
// Content: muted background when open
content: "text-muted-foreground"
// Border: use border-border (neutral-200)
item: "border-border"
```

### Usage
```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/base/accordion"

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section title</AccordionTrigger>
    <AccordionContent>Content goes here.</AccordionContent>
  </AccordionItem>
</Accordion>
```

---

## 2. Alert

**Shadcn source**: `alert`
**Use case**: Inline status messages — info, success, warning, error

### Variant spec (cva)
```tsx
const alertVariants = cva(
  "relative w-full rounded-md border p-4 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11",
  {
    variants: {
      variant: {
        default:     "bg-secondary text-secondary-foreground border-border",
        info:        "bg-blue-50 text-blue-800 border-blue-200",   // fill once blue values exported
        success:     "bg-green-50 text-green-800 border-green-200",
        warning:     "bg-orange-50 text-orange-800 border-orange-200",
        destructive: "bg-red-50 text-destructive border-destructive/30",
      },
    },
    defaultVariants: { variant: "default" },
  }
)
```

### Usage
```tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/base/alert"

<Alert variant="success">
  <AlertTitle>Saved</AlertTitle>
  <AlertDescription>Your changes have been saved.</AlertDescription>
</Alert>
```

---

## 3. Alert Dialog

**Shadcn source**: `alert-dialog`
**Use case**: Destructive confirmations — delete, reset, irreversible actions

### Styling notes
- Overlay: `bg-black/50`
- Content: `rounded-lg border border-border bg-card shadow-lg`
- Cancel button: secondary variant
- Confirm button: destructive variant
- Max width: `max-w-md`

### Usage
```tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/base/alert-dialog"

<AlertDialog>
  <AlertDialogTrigger asChild><Button variant="destructive">Delete</Button></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## 4. Avatar

**Shadcn source**: `avatar`
**Use case**: User profile images with fallback initials

### Size variants
```tsx
const avatarVariants = cva("relative flex shrink-0 overflow-hidden rounded-full", {
  variants: {
    size: {
      xs: "h-6 w-6 text-xs",
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm",   // default
      lg: "h-12 w-12 text-base",
      xl: "h-16 w-16 text-lg",
    },
  },
  defaultVariants: { size: "md" },
})
```

### Fallback styling
```tsx
// AvatarFallback: brand tint background
"bg-secondary text-secondary-foreground font-medium"
```

### Usage
```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/base/avatar"

<Avatar size="md">
  <AvatarImage src="/user.jpg" alt="Jane Doe" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

---

## 5. Badge

**Shadcn source**: `badge`
**Use case**: Status labels, counts, category tags

### Variant spec (cva)
```tsx
const badgeVariants = cva(
  "inline-flex items-center rounded-s px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:     "bg-primary text-primary-foreground",
        secondary:   "bg-secondary text-secondary-foreground",
        outline:     "border border-border text-foreground bg-transparent",
        muted:       "bg-muted text-muted-foreground",
        success:     "bg-green-100 text-green-800",
        warning:     "bg-orange-100 text-orange-800",
        destructive: "bg-red-100 text-destructive",
      },
    },
    defaultVariants: { variant: "default" },
  }
)
```

### Usage
```tsx
import { Badge } from "@/components/base/badge"

<Badge variant="success">Active</Badge>
<Badge variant="outline">Draft</Badge>
```

---

## 6. Button

**Shadcn source**: `button`
**Use case**: Primary actions, form submissions, navigation triggers

### Variant spec (cva)
```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:     "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:   "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:     "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
        ghost:       "hover:bg-accent hover:text-accent-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link:        "text-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        xs:   "h-7 px-2.5 text-xs",
        sm:   "h-8 px-3 text-sm",
        md:   "h-9 px-4 text-sm",    // default
        lg:   "h-10 px-6 text-base",
        xl:   "h-11 px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  }
)
```

### Usage
```tsx
import { Button } from "@/components/base/button"

<Button variant="default" size="md">Save changes</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="ghost" size="icon"><TrashIcon /></Button>
```

---

## 7. Button Group

**No direct Shadcn source** — compose from Button
**Use case**: Segmented controls, sets of related actions

### Implementation
```tsx
// Wrap Button components; apply negative margin and adjust border-radius
// First child: rounded-r-none
// Middle children: rounded-none border-l-0
// Last child: rounded-l-none border-l-0
```

### Usage
```tsx
import { ButtonGroup } from "@/components/base/button-group"
import { Button } from "@/components/base/button"

<ButtonGroup>
  <Button variant="outline">Day</Button>
  <Button variant="outline">Week</Button>
  <Button variant="default">Month</Button>
</ButtonGroup>
```

---

## 8. Calendar

**Shadcn source**: `calendar` (uses react-day-picker)
**Use case**: Date selection, embedded in DatePicker

### Styling overrides
```tsx
classNames={{
  day_selected: "bg-primary text-primary-foreground hover:bg-primary/90",
  day_today:    "bg-accent text-accent-foreground",
  day_range_middle: "bg-secondary text-secondary-foreground",
  nav_button:   "border border-border hover:bg-accent",
  head_cell:    "text-muted-foreground text-xs font-medium",
}}
```

---

## 9. Collapsible

**Shadcn source**: `collapsible`
**Use case**: Show/hide secondary content inline

### Styling notes
- Trigger: ghost button style
- Content: animate open/close with `data-[state=open]:animate-in data-[state=closed]:animate-out`

---

## 10. Command

**Shadcn source**: `command`
**Use case**: Command palette, global search, keyboard-driven navigation

### Styling overrides
```tsx
// Input: no border, full width
CommandInput: "h-10 w-full border-0 bg-transparent text-sm placeholder:text-muted-foreground focus:ring-0"
// Item selected state
CommandItem: "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground rounded-sm px-3 py-2 text-sm"
// Group heading
CommandGroup heading: "text-xs font-medium text-muted-foreground px-3 py-1.5"
```

---

## 11. Combobox

**Shadcn source**: Compose `Popover` + `Command`
**Use case**: Searchable select dropdowns

### Implementation pattern
```tsx
// Trigger: outline Button with ChevronDown icon
// Popover content: Command component
// Selected state: check icon on left of selected item
// Empty state: use Empty component
```

### Usage
```tsx
<Combobox
  options={frameworks}
  value={value}
  onValueChange={setValue}
  placeholder="Select framework..."
  searchPlaceholder="Search..."
/>
```

---

## 12. Data Table

**Shadcn source**: `table` + TanStack Table
**Use case**: Tabular data with sorting, filtering, pagination

### Styling overrides
```tsx
// Table wrapper
"w-full overflow-auto rounded-md border border-border"
// Header row
TableHead: "h-10 px-4 text-left text-xs font-medium text-muted-foreground bg-muted"
// Body row
TableRow: "border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-accent"
// Cell
TableCell: "px-4 py-3 text-sm"
// Footer / pagination bar
"border-t border-border bg-muted/30 px-4 py-3 flex items-center justify-between text-sm text-muted-foreground"
```

### Anatomy
- Toolbar: search input + filter buttons + column toggle (top)
- Table: header + body rows
- Pagination: rows per page selector + page navigator (bottom)

---

## 13. Date Picker

**Shadcn source**: Compose `Popover` + `Calendar`
**Use case**: Single date selection via a trigger input

### Usage
```tsx
<DatePicker
  value={date}
  onChange={setDate}
  placeholder="Pick a date"
/>
```

---

## 14. Dialog

**Shadcn source**: `dialog`
**Use case**: Modals — forms, confirmations, detail views

### Styling overrides
```tsx
DialogOverlay: "bg-black/50 backdrop-blur-sm"
DialogContent: "rounded-lg border border-border bg-card shadow-xl max-w-lg w-full p-6 gap-4"
DialogTitle: "text-lg font-semibold text-foreground"
DialogDescription: "text-sm text-muted-foreground"
// Close button: ghost icon button, top-right
```

### Sizes
```tsx
// Apply via className on DialogContent
sm: "max-w-sm"
md: "max-w-lg"     // default
lg: "max-w-2xl"
xl: "max-w-4xl"
full: "max-w-[90vw]"
```

---

## 15. Drawer

**Shadcn source**: `drawer` (vaul)
**Use case**: Mobile-friendly slide-up panels, secondary actions

### Styling overrides
```tsx
DrawerContent: "rounded-t-xl border-t border-border bg-card px-4 pb-safe"
DrawerHandle: "bg-border mx-auto mt-3 mb-4 h-1 w-10 rounded-full"
DrawerTitle: "text-lg font-semibold text-foreground"
```

---

## 16. Dropdown Menu

**Shadcn source**: `dropdown-menu`
**Use case**: Contextual action menus, overflow menus

### Styling overrides
```tsx
DropdownMenuContent: "min-w-[180px] rounded-md border border-border bg-popover shadow-md p-1"
DropdownMenuItem: "flex items-center gap-2 rounded-sm px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
DropdownMenuSeparator: "my-1 h-px bg-border"
DropdownMenuLabel: "px-3 py-1.5 text-xs font-medium text-muted-foreground"
// Destructive item
DropdownMenuItem destructive: "text-destructive hover:bg-destructive/10"
```

---

## 17. Empty

**No Shadcn source** — custom component
**Use case**: Empty states for lists, tables, search results

### Implementation
```tsx
interface EmptyProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

// Layout: centred column, muted icon, title, description, optional CTA
// Container: py-16 flex flex-col items-center gap-3 text-center
// Icon wrapper: rounded-full bg-muted p-4 text-muted-foreground
// Title: text-base font-medium text-foreground
// Description: text-sm text-muted-foreground max-w-xs
```

### Usage
```tsx
<Empty
  icon={<InboxIcon />}
  title="No results found"
  description="Try adjusting your filters or search query."
  action={<Button variant="outline" size="sm">Clear filters</Button>}
/>
```

---

## 18. Field

**No direct Shadcn source** — compose Label + Input + error/hint text
**Use case**: Form field wrapper — label, input, hint, error message

### Implementation
```tsx
interface FieldProps {
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

// Layout: flex flex-col gap-1.5
// Label: text-sm font-medium text-foreground
// Required mark: text-destructive ml-0.5
// Hint: text-xs text-muted-foreground
// Error: text-xs text-destructive
```

### Usage
```tsx
<Field label="Email address" hint="We'll never share your email." error={errors.email}>
  <Input type="email" {...register("email")} />
</Field>
```

---

## 19. Hover Card

**Shadcn source**: `hover-card`
**Use case**: Preview tooltips with richer content on hover

### Styling overrides
```tsx
HoverCardContent: "rounded-md border border-border bg-popover p-4 shadow-md w-64 text-sm"
```

---

## 20. Input

**Shadcn source**: `input`
**Use case**: Single-line text entry

### Variant spec (cva)
```tsx
const inputVariants = cva(
  "flex w-full rounded-sm border bg-background text-sm text-foreground placeholder:text-muted-foreground transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-3 text-sm",    // default
        lg: "h-10 px-4 text-base",
      },
      state: {
        default: "border-input hover:border-input/80",
        error:   "border-destructive focus-visible:ring-destructive",
        success: "border-green-500 focus-visible:ring-green-500",
      },
    },
    defaultVariants: { size: "md", state: "default" },
  }
)
```

---

## 21. Input Group

**No direct Shadcn source** — compose from Input + Button/Badge
**Use case**: Input with leading icon, trailing button, or affix text

### Implementation
```tsx
// Wrapper: relative flex items-center
// Leading icon: absolute left-3 text-muted-foreground
// Input with leading icon: pl-9
// Trailing button: absolute right-1 (small ghost/icon button)
// Affix text (e.g. ".com"): bg-muted border border-input px-3 h-9 text-sm text-muted-foreground
```

### Usage
```tsx
<InputGroup>
  <InputGroupLeading><SearchIcon /></InputGroupLeading>
  <Input placeholder="Search..." />
</InputGroup>

<InputGroup>
  <Input placeholder="yourdomain" />
  <InputGroupTrailing>.com</InputGroupTrailing>
</InputGroup>
```

---

## 22. Item

**No direct Shadcn source** — custom component
**Use case**: Reusable list row — avatar/icon + content + optional meta + trailing action

### Implementation
```tsx
interface ItemProps {
  leading?: React.ReactNode    // icon or avatar
  title: string
  description?: string
  meta?: string                // timestamp, badge, etc.
  trailing?: React.ReactNode   // button, chevron, etc.
  onClick?: () => void
  selected?: boolean
}

// Layout: flex items-center gap-3 px-3 py-2.5 rounded-md
// Selected: bg-accent
// Hover: hover:bg-muted cursor-pointer
// Title: text-sm font-medium text-foreground
// Description: text-xs text-muted-foreground
// Meta: text-xs text-muted-foreground ml-auto
```

---

## 23. Label

**Shadcn source**: `label`
**Use case**: Form labels, field identifiers

### Styling overrides
```tsx
"text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
```

---

## 24. Menubar

**Shadcn source**: `menubar`
**Use case**: Application-style horizontal menu (File, Edit, View...)

### Styling overrides
```tsx
Menubar: "flex h-10 items-center gap-1 border-b border-border bg-background px-4"
MenubarTrigger: "flex cursor-pointer items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none hover:bg-accent data-[state=open]:bg-accent"
MenubarContent: "rounded-md border border-border bg-popover p-1 shadow-md min-w-[200px]"
```

---

## 25. Navigation Menu

**Shadcn source**: `navigation-menu`
**Use case**: Top-level site navigation with dropdowns

### Styling overrides
```tsx
NavigationMenuLink: "text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
NavigationMenuTrigger: "text-sm font-medium hover:bg-accent rounded-sm px-3 py-1.5"
NavigationMenuContent: "rounded-md border border-border bg-popover shadow-lg p-4"
// Active indicator: bottom border using primary colour
active: "text-primary"
```

---

## 26. Popover

**Shadcn source**: `popover`
**Use case**: Floating content panels attached to a trigger

### Styling overrides
```tsx
PopoverContent: "rounded-md border border-border bg-popover shadow-md p-4 w-72 text-sm"
```

---

## 27. Progress

**Shadcn source**: `progress`
**Use case**: Upload progress, loading states, completion percentage

### Variant spec
```tsx
const progressVariants = cva("relative h-2 w-full overflow-hidden rounded-full bg-muted", {
  variants: {
    variant: {
      default: "[&>div]:bg-primary",
      success: "[&>div]:bg-green-500",
      warning: "[&>div]:bg-orange-400",
      destructive: "[&>div]:bg-destructive",
    },
  },
  defaultVariants: { variant: "default" },
})
```

### Sizes
```
xs: h-1
sm: h-1.5
md: h-2      // default
lg: h-3
```

---

## 28. Radio Group

**Shadcn source**: `radio-group`
**Use case**: Single selection from a list of options

### Styling overrides
```tsx
RadioGroupItem: "h-4 w-4 rounded-full border border-input text-primary focus:ring-ring focus:ring-2 focus:ring-offset-2 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
// Selected indicator: small circle inside, primary colour
```

---

## 29. Scroll Area

**Shadcn source**: `scroll-area`
**Use case**: Custom-styled scrollable containers

### Styling overrides
```tsx
ScrollBar: "flex touch-none select-none transition-colors"
// Vertical: "h-full w-1.5 border-l border-l-transparent p-[1px]"
// Thumb: "relative flex-1 rounded-full bg-border hover:bg-muted-foreground/40"
```

---

## 30. Select

**Shadcn source**: `select`
**Use case**: Dropdown selection from a list

### Styling overrides
```tsx
SelectTrigger: "flex h-9 w-full items-center justify-between rounded-sm border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-0 disabled:opacity-50"
SelectContent: "rounded-md border border-border bg-popover shadow-md overflow-hidden"
SelectItem: "relative flex items-center rounded-sm px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground data-[state=checked]:text-primary"
SelectLabel: "px-3 py-1.5 text-xs font-medium text-muted-foreground"
```

---

## 31. Separator

**Shadcn source**: `separator`
**Use case**: Visual dividers between sections

### Styling overrides
```tsx
// Horizontal
"h-px w-full bg-border"
// Vertical
"h-full w-px bg-border"
```

---

## 32. Sheet

**Shadcn source**: `sheet`
**Use case**: Slide-in side panels — filters, detail views, forms

### Styling overrides
```tsx
SheetContent: "bg-card border-border shadow-xl"
SheetHeader: "border-b border-border pb-4"
SheetTitle: "text-lg font-semibold text-foreground"
SheetDescription: "text-sm text-muted-foreground mt-1"
// Sizes (side="right" default)
sm: "w-80"
md: "w-96"     // default
lg: "w-[480px]"
xl: "w-[600px]"
```

---

## 33. Sidebar

**Shadcn source**: `sidebar` (shadcn sidebar primitive)
**Use case**: Application sidebar navigation

### Structure
```tsx
// Root: fixed left-0 top-0 h-screen w-64 border-r border-border bg-card flex flex-col
// Header: px-4 py-3 border-b border-border (logo / workspace switcher)
// Nav: flex-1 overflow-y-auto px-2 py-4 space-y-1
// Footer: px-4 py-3 border-t border-border (user avatar + settings)
```

### Nav item states
```tsx
// Default: text-sm text-muted-foreground rounded-md px-3 py-2 hover:bg-accent hover:text-foreground
// Active: bg-accent text-foreground font-medium
// Icon: w-4 h-4 mr-2.5
```

### Collapsed state (icon-only, width 56px)
```tsx
// Label hidden, tooltip shows on hover
// Width: w-14
```

---

## 34. Slider

**Shadcn source**: `slider`
**Use case**: Range inputs — volume, zoom, numeric values

### Styling overrides
```tsx
SliderTrack: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted"
SliderRange: "absolute h-full bg-primary"
SliderThumb: "block h-4 w-4 rounded-full border-2 border-primary bg-background shadow transition-colors focus-visible:ring-2 focus-visible:ring-ring"
```

---

## 35. Sonner (Toast)

**Shadcn source**: `sonner`
**Use case**: Non-blocking notification toasts

### Configuration
```tsx
// In layout.tsx
<Toaster
  toastOptions={{
    classNames: {
      toast:   "bg-card border border-border shadow-md rounded-md text-sm",
      success: "border-green-200 text-green-800",
      error:   "border-destructive/30 text-destructive",
      warning: "border-orange-200 text-orange-800",
    },
  }}
  position="bottom-right"
/>
```

### Usage
```tsx
import { toast } from "sonner"

toast.success("Saved successfully")
toast.error("Something went wrong")
```

---

## 36. Spinner

**No Shadcn source** — custom component
**Use case**: Loading states for buttons, sections, pages

### Implementation
```tsx
const spinnerVariants = cva("animate-spin rounded-full border-2 border-current border-t-transparent", {
  variants: {
    size: {
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      md: "h-5 w-5",    // default
      lg: "h-6 w-6",
      xl: "h-8 w-8",
    },
    variant: {
      default: "text-primary",
      muted:   "text-muted-foreground",
      white:   "text-white",
    },
  },
  defaultVariants: { size: "md", variant: "default" },
})
```

### Usage
```tsx
<Spinner size="sm" />
<Button disabled><Spinner size="xs" variant="white" className="mr-2" />Saving...</Button>
```

---

## 37. Switch

**Shadcn source**: `switch`
**Use case**: Boolean toggles — settings, feature flags

### Styling overrides
```tsx
Switch: "peer h-5 w-9 cursor-pointer rounded-full border border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
SwitchThumb: "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
```

---

## 38. Tabs

**Shadcn source**: `tabs`
**Use case**: Content panels with tab navigation

### Variant spec
```tsx
// Default (underline style)
TabsList: "inline-flex h-10 items-center border-b border-border w-full justify-start gap-0 bg-transparent rounded-none p-0"
TabsTrigger: "inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-muted-foreground border-b-2 border-transparent -mb-px transition-colors hover:text-foreground data-[state=active]:text-primary data-[state=active]:border-primary"

// Pill style (alternate)
TabsList pill: "inline-flex items-center gap-1 rounded-md bg-muted p-1"
TabsTrigger pill: "rounded-sm px-3 py-1.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
```

### Usage
```tsx
<Tabs defaultValue="overview" variant="underline">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="details">Details</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">...</TabsContent>
  <TabsContent value="details">...</TabsContent>
</Tabs>
```

---

## 39. Text Area

**Shadcn source**: `textarea`
**Use case**: Multi-line text input

### Styling overrides
```tsx
"flex min-h-[80px] w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:opacity-50 resize-y"
```

---

## 40. Toggle Group

**Shadcn source**: `toggle-group`
**Use case**: Multi- or single-select option buttons (view mode, text alignment)

### Styling overrides
```tsx
ToggleGroup: "inline-flex items-center gap-0.5 rounded-md border border-border p-0.5 bg-muted"
ToggleGroupItem: "inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm"
```

---

## 41. Typography

**No Shadcn source** — custom component + Tailwind utility classes
**Use case**: Consistent text rendering across headings, body, captions

### Type scale
```tsx
// Use these className presets — never write ad-hoc text sizes

// Headings
h1: "scroll-m-20 text-4xl font-bold tracking-tight text-foreground"
h2: "scroll-m-20 text-3xl font-semibold tracking-tight text-foreground"
h3: "scroll-m-20 text-2xl font-semibold tracking-tight text-foreground"
h4: "scroll-m-20 text-xl font-semibold text-foreground"

// Body
body-lg:  "text-base text-foreground leading-7"
body:     "text-sm text-foreground leading-6"
body-sm:  "text-xs text-foreground leading-5"

// Supporting
lead:     "text-lg text-muted-foreground leading-7"
muted:    "text-sm text-muted-foreground"
caption:  "text-xs text-muted-foreground"
label:    "text-sm font-medium text-foreground"
code:     "font-mono text-sm bg-muted rounded px-1.5 py-0.5"
```

### Usage
```tsx
import { Typography } from "@/components/base/typography"

<Typography variant="h1">Page title</Typography>
<Typography variant="body">Body text paragraph.</Typography>
<Typography variant="muted">Secondary information.</Typography>
```

---

## Cursor instructions for this file

When generating or updating components:

1. The base component lives in `components/base/` — import Shadcn primitives from `@/components/ui/` inside it
2. Pages and features always import from `components/base/`, never directly from `components/ui/`
3. When adding props, extend the Shadcn props interface — never replace it
4. Match the variant names defined here exactly — consistency enables Cursor to reason about them
5. Every component must accept `className` as an override prop
6. Components that compose multiple primitives (Field, Combobox, InputGroup) live only in `components/base/` — they have no `components/ui/` equivalent
