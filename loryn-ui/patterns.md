# Patterns — Composite Component Recipes

> Composite components live in `components/custom/`. They are always built by composing from `components/base/` — never from `components/ui/` directly, and never from scratch.
>
> **Rule**: If you find yourself writing a new `<div className="flex items-center gap-3 ...">` wrapper that could be an `<Item>`, use `<Item>`. Composites exist to prevent ad-hoc layouts from proliferating.

---

## How composite components work

```
components/base/button.tsx        ← base
components/base/badge.tsx         ← base
components/base/avatar.tsx        ← base
components/base/item.tsx          ← base
          ↓
components/custom/action-list.tsx ← composite (wraps Item)
components/custom/card.tsx        ← composite (wraps base primitives)
components/custom/page-header.tsx ← composite (wraps Typography + Button)
```

Each composite:
- Imports only from `@/components/base/`
- Accepts strongly-typed props
- Has no inline styles
- Has its own `className` escape hatch

---

## 1. Card

**Composes**: Separator, Badge, Button, Typography, Avatar
**Use cases**: Content containers, entity summaries, stat panels

### Variants

#### Basic card
```tsx
// components/custom/card.tsx
import { cn } from "@/lib/utils"

interface CardProps {
  className?: string
  children: React.ReactNode
  padding?: "sm" | "md" | "lg"
}

const paddingMap = { sm: "p-4", md: "p-5", lg: "p-6" }

export function Card({ className, children, padding = "md" }: CardProps) {
  return (
    <div className={cn(
      "rounded-md border border-border bg-card",
      paddingMap[padding],
      className
    )}>
      {children}
    </div>
  )
}
```

#### Stat card
```tsx
interface StatCardProps {
  label: string
  value: string | number
  change?: { value: string; direction: "up" | "down" | "neutral" }
  icon?: React.ReactNode
}

export function StatCard({ label, value, change, icon }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <Typography variant="caption">{label}</Typography>
          <Typography variant="h3" className="mt-1">{value}</Typography>
          {change && (
            <Badge variant={change.direction === "up" ? "success" : change.direction === "down" ? "destructive" : "muted"} className="mt-2">
              {change.value}
            </Badge>
          )}
        </div>
        {icon && (
          <div className="rounded-md bg-secondary p-2 text-primary">{icon}</div>
        )}
      </div>
    </Card>
  )
}
```

#### Media card (image + content)
```tsx
interface MediaCardProps {
  image: string
  imageAlt: string
  title: string
  description?: string
  badge?: string
  action?: React.ReactNode
}

export function MediaCard({ image, imageAlt, title, description, badge, action }: MediaCardProps) {
  return (
    <div className="rounded-md border border-border bg-card overflow-hidden">
      <img src={image} alt={imageAlt} className="w-full h-40 object-cover" />
      <div className="p-4">
        {badge && <Badge variant="secondary" className="mb-2">{badge}</Badge>}
        <Typography variant="label">{title}</Typography>
        {description && <Typography variant="muted" className="mt-1">{description}</Typography>}
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  )
}
```

---

## 2. Action List

**Composes**: Item, Separator, Badge, Button, Spinner
**Use cases**: Activity feeds, entity lists, menu-like selections

### Implementation
```tsx
// components/custom/action-list.tsx
import { Item } from "@/components/base/item"
import { Separator } from "@/components/base/separator"
import { Empty } from "@/components/base/empty"
import { Spinner } from "@/components/base/spinner"

interface ActionListItem {
  id: string
  leading?: React.ReactNode
  title: string
  description?: string
  meta?: string
  trailing?: React.ReactNode
  onClick?: () => void
  selected?: boolean
}

interface ActionListProps {
  items: ActionListItem[]
  loading?: boolean
  emptyState?: React.ReactNode
  divided?: boolean
  className?: string
}

export function ActionList({ items, loading, emptyState, divided = false, className }: ActionListProps) {
  if (loading) return (
    <div className="flex justify-center py-8">
      <Spinner />
    </div>
  )

  if (items.length === 0) return (
    <>{emptyState || <Empty title="No items" />}</>
  )

  return (
    <div className={cn("rounded-md border border-border overflow-hidden", className)}>
      {items.map((item, i) => (
        <div key={item.id}>
          <Item {...item} />
          {divided && i < items.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  )
}
```

---

## 3. Page Header

**Composes**: Typography, Button, Badge, Separator
**Use cases**: Top of every page — title, description, primary action

### Implementation
```tsx
// components/custom/page-header.tsx
interface PageHeaderProps {
  title: string
  description?: string
  badge?: string
  actions?: React.ReactNode
  breadcrumbs?: React.ReactNode
  bordered?: boolean
}

export function PageHeader({ title, description, badge, actions, breadcrumbs, bordered = false }: PageHeaderProps) {
  return (
    <div className={cn("pb-6", bordered && "border-b border-border mb-6")}>
      {breadcrumbs && <div className="mb-3">{breadcrumbs}</div>}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Typography variant="h1">{title}</Typography>
            {badge && <Badge variant="secondary">{badge}</Badge>}
          </div>
          {description && (
            <Typography variant="muted" className="mt-1.5 max-w-2xl">{description}</Typography>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>
    </div>
  )
}
```

### Usage
```tsx
<PageHeader
  title="Projects"
  description="Manage and track all your active projects."
  badge="12"
  actions={<Button>New project</Button>}
  bordered
/>
```

---

## 4. Empty State

**Composes**: Empty, Button, Typography
**Use cases**: Page-level empty states (no data, no results, first use)

```tsx
// components/custom/empty-state.tsx
// This is a full-page centred variant of the base Empty component
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  primaryAction?: { label: string; onClick: () => void }
  secondaryAction?: { label: string; onClick: () => void }
}

export function EmptyState({ icon, title, description, primaryAction, secondaryAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      {icon && (
        <div className="rounded-full bg-secondary p-5 text-primary">{icon}</div>
      )}
      <div>
        <Typography variant="h3">{title}</Typography>
        {description && <Typography variant="muted" className="mt-1.5 max-w-sm">{description}</Typography>}
      </div>
      {(primaryAction || secondaryAction) && (
        <div className="flex items-center gap-2 mt-2">
          {primaryAction && <Button onClick={primaryAction.onClick}>{primaryAction.label}</Button>}
          {secondaryAction && <Button variant="outline" onClick={secondaryAction.onClick}>{secondaryAction.label}</Button>}
        </div>
      )}
    </div>
  )
}
```

---

## 5. Data List

**Composes**: Typography, Separator, Badge
**Use cases**: Key-value displays — entity details, settings summaries

```tsx
// components/custom/data-list.tsx
interface DataListItem {
  label: string
  value: React.ReactNode
}

interface DataListProps {
  items: DataListItem[]
  columns?: 1 | 2
  className?: string
}

export function DataList({ items, columns = 1, className }: DataListProps) {
  return (
    <dl className={cn(
      "divide-y divide-border",
      columns === 2 && "grid grid-cols-2",
      className
    )}>
      {items.map(({ label, value }) => (
        <div key={label} className="flex items-baseline justify-between py-3 gap-4">
          <dt><Typography variant="caption">{label}</Typography></dt>
          <dd className="text-sm text-foreground text-right">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
```

### Usage
```tsx
<DataList items={[
  { label: "Status", value: <Badge variant="success">Active</Badge> },
  { label: "Created", value: "12 Jan 2025" },
  { label: "Owner", value: "Jane Doe" },
]} />
```

---

## 6. Form Section

**Composes**: Typography, Separator, Field
**Use cases**: Grouped form sections with title and description

```tsx
// components/custom/form-section.tsx
interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  bordered?: boolean
}

export function FormSection({ title, description, children, bordered = true }: FormSectionProps) {
  return (
    <div className={cn("py-6", bordered && "border-b border-border")}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <Typography variant="label">{title}</Typography>
          {description && <Typography variant="muted" className="mt-1">{description}</Typography>}
        </div>
        <div className="md:col-span-2 space-y-4">
          {children}
        </div>
      </div>
    </div>
  )
}
```

### Usage
```tsx
<FormSection title="Personal info" description="Update your name and email address.">
  <Field label="Full name"><Input /></Field>
  <Field label="Email"><Input type="email" /></Field>
</FormSection>
```

---

## 7. Confirmation Dialog

**Composes**: AlertDialog, Button, Typography
**Use cases**: Wraps AlertDialog with a simpler API for common confirmations

```tsx
// components/custom/confirmation-dialog.tsx
interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "default" | "destructive"
  onConfirm: () => void
  loading?: boolean
}

export function ConfirmationDialog({ title, description, confirmLabel = "Confirm", cancelLabel = "Cancel", variant = "default", onConfirm, loading, ...props }: ConfirmationDialogProps) {
  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            className={variant === "destructive" ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" : ""}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <Spinner size="xs" variant="white" className="mr-2" />}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

---

## 8. Search Input

**Composes**: InputGroup, Input, Button, Spinner
**Use cases**: Search fields with clear button and loading state

```tsx
// components/custom/search-input.tsx
interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  loading?: boolean
  className?: string
}

export function SearchInput({ value, onChange, placeholder = "Search...", loading, className }: SearchInputProps) {
  return (
    <InputGroup className={className}>
      <InputGroupLeading>
        {loading ? <Spinner size="xs" variant="muted" /> : <SearchIcon className="h-4 w-4" />}
      </InputGroupLeading>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <InputGroupTrailing>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onChange("")}>
            <XIcon className="h-3 w-3" />
          </Button>
        </InputGroupTrailing>
      )}
    </InputGroup>
  )
}
```

---

## 9. User Menu

**Composes**: DropdownMenu, Avatar, Typography
**Use cases**: Authenticated user menu in navbar or sidebar footer

```tsx
// components/custom/user-menu.tsx
interface UserMenuProps {
  user: { name: string; email: string; avatar?: string }
  items: Array<{ label: string; icon?: React.ReactNode; onClick: () => void; destructive?: boolean }>
}

export function UserMenu({ user, items }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-accent w-full">
          <Avatar size="sm">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left min-w-0">
            <Typography variant="label" className="truncate">{user.name}</Typography>
            <Typography variant="caption" className="truncate">{user.email}</Typography>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {items.map((item) => (
          <DropdownMenuItem
            key={item.label}
            onClick={item.onClick}
            className={item.destructive ? "text-destructive hover:bg-destructive/10" : ""}
          >
            {item.icon}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

---

## 10. Notification Toast helper

**Composes**: Sonner (toast)
**Use cases**: Standardised toast calls across the app — never call `toast()` directly in features

```tsx
// lib/notify.ts
import { toast } from "sonner"

export const notify = {
  success: (message: string, description?: string) =>
    toast.success(message, { description }),
  error: (message: string, description?: string) =>
    toast.error(message, { description }),
  warning: (message: string, description?: string) =>
    toast.warning(message, { description }),
  info: (message: string, description?: string) =>
    toast.info(message, { description }),
  loading: (message: string) =>
    toast.loading(message),
  promise: <T,>(promise: Promise<T>, messages: { loading: string; success: string; error: string }) =>
    toast.promise(promise, messages),
}
```

---

## How to add a new composite component

1. Identify which base components it needs
2. Create `components/custom/[name].tsx`
3. Import ONLY from `@/components/base/`
4. Define a clean TypeScript interface for its props
5. Add it to the list above with its use case
6. Never duplicate logic that already exists in a base component

---

## Cursor instructions for this file

When Cursor builds a new composite:
- Check this file first — does a pattern already exist?
- If extending an existing composite, modify its props interface here too
- Composites NEVER import from `@/components/ui/` — only `@/components/base/`
- If a new primitive is needed that isn't in the 41 base components, add it to `components.md` first
