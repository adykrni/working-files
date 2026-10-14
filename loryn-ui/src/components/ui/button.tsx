import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Component Tokens ──────────────────────────────────────────
// All visual values for Button live here.
// To restyle any variant, change values in this object only.
// All values must come from the primitive palette in globals.css.

const t = {
  // Shared
  focus:    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2",
  disabled: "disabled:pointer-events-none",
  base:     "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 cursor-pointer",

  // Variants
  default: {
    bg:           "bg-teal-600",
    bgHover:      "hover:bg-teal-700",
    bgSelected:   "data-[selected=true]:bg-teal-600",
    bgDisabled:   "disabled:bg-neutral-100",
    text:         "text-gray-50",
    textSelected: "data-[selected=true]:text-white",
    textDisabled: "disabled:text-neutral-400",
  },
  secondary: {
    bg:           "bg-teal-100",
    bgHover:      "hover:bg-gray-100",
    bgSelected:   "data-[selected=true]:bg-teal-600",
    bgDisabled:   "disabled:bg-neutral-100",
    text:         "text-neutral-900",
    textSelected: "data-[selected=true]:text-white",
    textDisabled: "disabled:text-neutral-400",
  },
  destructive: {
    bg:           "bg-red-500",
    bgHover:      "hover:bg-red-600",
    bgSelected:   "data-[selected=true]:bg-red-700",
    bgDisabled:   "disabled:bg-red-100",
    text:         "text-white",
    textDisabled: "disabled:text-red-300",
  },
  outline: {
    bg:           "bg-white",
    bgHover:      "hover:bg-gray-100",
    bgSelected:   "data-[selected=true]:bg-neutral-100",
    bgDisabled:   "disabled:bg-white",
    text:         "text-neutral-900",
    textDisabled: "disabled:text-neutral-400",
    border:       "border border-neutral-200",
    borderHover:  "hover:border-neutral-300",
    borderSelected: "data-[selected=true]:border-neutral-400",
  },
  ghost: {
    bg:           "bg-transparent",
    bgHover:      "hover:bg-gray-100",
    bgSelected:   "data-[selected=true]:bg-neutral-100",
    text:         "text-neutral-900",
    textDisabled: "disabled:text-neutral-400",
  },
  link: {
    text:         "text-neutral-900",
    textHover:    "hover:text-neutral-600",
    textDisabled: "disabled:text-neutral-400",
  },

  // Sizes
  size: {
    sm:   { h: "h-8",  px: "px-3", text: "text-sm",   radius: "rounded-md"   },
    md:   { h: "h-9",  px: "px-4", text: "text-sm",   radius: "rounded-md"   },
    lg:   { h: "h-11", px: "px-6", text: "text-base", radius: "rounded-md"   },
    icon: { h: "h-9",  px: "w-9",  text: "text-sm",   radius: "rounded-full" },
  },

  // Icon slots (leading / trailing)
  icon: {
    sm:   "size-3.5 [&_svg]:size-full",
    md:   "size-4 [&_svg]:size-full",
    lg:   "size-5 [&_svg]:size-full",
    icon: "size-4 [&_svg]:size-full",
  },

  // Numeric badge (trailing, before trailing icon)
  badge: {
    base: "inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-xs font-medium tabular-nums leading-none",
    default:     "bg-teal-800 text-white",
    secondary:   "bg-neutral-900 text-white",
    destructive: "bg-red-800 text-white",
    outline:     "bg-neutral-100 text-neutral-900",
    ghost:       "bg-neutral-100 text-neutral-900",
    link:        "bg-neutral-100 text-neutral-900",
  },
}

// ─── Variants ──────────────────────────────────────────────────

const buttonVariants = cva(
  [t.base, t.focus, t.disabled].join(" "),
  {
    variants: {
      variant: {
        default: [
          t.default.bg,
          t.default.bgHover,
          t.default.bgSelected,
          t.default.bgDisabled,
          t.default.text,
          t.default.textSelected,
          t.default.textDisabled,
        ].join(" "),

        secondary: [
          t.secondary.bg,
          t.secondary.bgHover,
          t.secondary.bgSelected,
          t.secondary.bgDisabled,
          t.secondary.text,
          t.secondary.textSelected,
          t.secondary.textDisabled,
        ].join(" "),

        destructive: [
          t.destructive.bg,
          t.destructive.bgHover,
          t.destructive.bgSelected,
          t.destructive.bgDisabled,
          t.destructive.text,
          t.destructive.textDisabled,
        ].join(" "),

        outline: [
          t.outline.bg,
          t.outline.bgHover,
          t.outline.bgSelected,
          t.outline.bgDisabled,
          t.outline.text,
          t.outline.textDisabled,
          t.outline.border,
          t.outline.borderHover,
          t.outline.borderSelected,
        ].join(" "),

        ghost: [
          t.ghost.bg,
          t.ghost.bgHover,
          t.ghost.bgSelected,
          t.ghost.text,
          t.ghost.textDisabled,
        ].join(" "),

        link: [
          t.link.text,
          t.link.textHover,
          t.link.textDisabled,
          "underline underline-offset-4 p-0 h-auto",
        ].join(" "),
      },

      size: {
        sm:   [t.size.sm.h,   t.size.sm.px,   t.size.sm.text,   t.size.sm.radius].join(" "),
        md:   [t.size.md.h,   t.size.md.px,   t.size.md.text,   t.size.md.radius].join(" "),
        lg:   [t.size.lg.h,   t.size.lg.px,   t.size.lg.text,   t.size.lg.radius].join(" "),
        icon: [t.size.icon.h, t.size.icon.px, t.size.icon.text, t.size.icon.radius, "p-0 shrink-0"].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

// ─── Props ─────────────────────────────────────────────────────

type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?:       boolean
  isLoading?:     boolean
  selected?:      boolean
  /** Icon before the label. Omit to hide. */
  leadingIcon?:   React.ReactNode
  /** Icon after the label (after badge if present). Omit to hide. */
  trailingIcon?:  React.ReactNode
  /** Numeric count badge. Omit to hide. */
  badge?:         number
}

function ButtonIconSlot({
  icon,
  size = "md",
}: {
  icon: React.ReactNode
  size: ButtonSize
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center [&_svg]:pointer-events-none",
        t.icon[size]
      )}
      aria-hidden
    >
      {icon}
    </span>
  )
}

function ButtonBadge({
  value,
  variant = "default",
}: {
  value: number
  variant: NonNullable<ButtonProps["variant"]>
}) {
  return (
    <span className={cn(t.badge.base, t.badge[variant])}>{value}</span>
  )
}

// ─── Component ─────────────────────────────────────────────────

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      asChild = false,
      isLoading = false,
      selected = false,
      leadingIcon,
      trailingIcon,
      badge,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const resolvedSize = size ?? "md"
    const showLeadingIcon = !isLoading && leadingIcon != null
    const showTrailingIcon = trailingIcon != null
    const showBadge = badge != null
    const label =
      size === "icon" && !children && leadingIcon != null ? null : children

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        data-selected={selected ? "true" : undefined}
        {...props}
      >
        {isLoading && (
          <Loader2
            className={cn("animate-spin shrink-0", t.icon[resolvedSize])}
            aria-hidden
          />
        )}
        {showLeadingIcon && (
          <ButtonIconSlot icon={leadingIcon} size={resolvedSize} />
        )}
        {label}
        {showBadge && (
          <ButtonBadge value={badge} variant={variant ?? "default"} />
        )}
        {showTrailingIcon && (
          <ButtonIconSlot icon={trailingIcon} size={resolvedSize} />
        )}
      </Comp>
    )
  }
)

Button.displayName = "Button"

// ─── Exports ───────────────────────────────────────────────────

export { Button, buttonVariants }

/*
  Usage examples:

  <Button>Save changes</Button>
  <Button variant="secondary">Cancel</Button>
  <Button variant="destructive">Delete</Button>
  <Button variant="outline" size="sm">Filter</Button>
  <Button variant="ghost">Dismiss</Button>
  <Button variant="link">Learn more</Button>
  <Button size="icon" leadingIcon={<PlusIcon />} aria-label="Add" />
  <Button leadingIcon={<PlusIcon />}>New item</Button>
  <Button trailingIcon={<ArrowRightIcon />}>Continue</Button>
  <Button badge={3}>Inbox</Button>
  <Button leadingIcon={<PlusIcon />} badge={12} trailingIcon={<ChevronDownIcon />}>
    Workspace
  </Button>
  <Button isLoading>Saving...</Button>
  <Button selected>Active view</Button>
  <Button disabled>Unavailable</Button>
  <Button variant="secondary" size="lg" isLoading>Processing...</Button>
*/