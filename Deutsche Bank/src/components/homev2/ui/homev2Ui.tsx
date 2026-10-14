import { formatCurrencyParts, percentColorClass } from "@/lib/format";

export const CARD_SHADOW =
  "0px 0.49px 0.979px 0px rgba(0,32,91,0.1),0px 0.979px 0px -0.979px rgba(0,32,91,0.2),0px 0px 0px 0.49px rgba(0,32,91,0.2)";

export const TABLE_SHADOW =
  "0px 0.5px 1px 0px rgba(0,32,91,0.1),0px 1px 0px -1px rgba(0,32,91,0.2),0px 0px 0px 0.5px rgba(0,32,91,0.2)";

/** Figma 730:2592 insight card + tab panel emphasis border */
export const PANEL_SHADOW =
  "0px 0.5px 1px 0px rgba(0,32,91,0.1),0px 1px 0px -1px rgba(0,32,91,0.2),0px 0px 0px 0.5px rgba(0,32,91,0.7)";

export const PORTFOLIO_CARD_SHADOW = "0px 0px 0px 0.5px rgba(0,32,91,0.2)";

/** White main panel inset — Figma-aligned edge spacing */
export const HOME_V2_PANEL_PADDING = "p-[80px]";

/** Full-width list rows inside tab panels */
export const HOLDINGS_ROW_GRID =
  "grid w-full grid-cols-[minmax(0,1fr)_minmax(140px,1fr)_minmax(96px,auto)] items-center gap-x-8";

export const ALLOCATION_ROW_GRID =
  "grid w-full grid-cols-[minmax(0,1.5fr)_minmax(72px,auto)_minmax(140px,1fr)_minmax(96px,auto)] items-center gap-x-8";

export function CommandMetricRow({ label, value }: { label: string; value: number }) {
  const { whole, decimals } = formatCurrencyParts(value);
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <span className="text-[16px] leading-normal text-[#3c4556]">{label}</span>
      <span className="shrink-0 font-display text-[#07132a]">
        <span className="text-[16px] leading-normal">{whole}</span>
        <span className="text-[10px] leading-normal">.{decimals} USD</span>
      </span>
    </div>
  );
}

export function SplitMetricValue({ value }: { value: number }) {
  const { whole, decimals } = formatCurrencyParts(value);
  return (
    <p className="font-display leading-none text-[#07132a]">
      <span className="text-[24px] leading-normal">{whole}</span>
      <span className="text-[10px] leading-normal">.{decimals} USD</span>
    </p>
  );
}

export function SplitHeroValue({
  value,
  currency = "USD",
  className = "",
}: {
  value: number;
  currency?: string;
  className?: string;
}) {
  const { whole, decimals } = formatCurrencyParts(value);
  return (
    <p className={`font-display leading-none text-[#07132a] ${className}`}>
      <span className="text-[18px] leading-normal md:text-[24px]">{whole}</span>
      <span className="text-[10px] leading-normal">
        .{decimals} {currency}
      </span>
    </p>
  );
}

export function SplitCompactValue({
  value,
  currency = "USD",
  change,
  changeLabel,
}: {
  value: number;
  currency?: string;
  change?: number;
  changeLabel?: string;
}) {
  const { whole, decimals } = formatCurrencyParts(value);
  return (
    <span className="font-display text-[#07132a]">
      <span className="text-[14px] leading-normal">{whole}</span>
      <span className="text-[10px] leading-normal">.{decimals}</span>
      <span className="text-[10px] leading-normal"> {currency} </span>
      {change !== undefined ? (
        <span className={`text-[10px] leading-normal ${percentColorClass(change)}`}>
          ({change >= 0 ? "+" : ""}
          {change.toFixed(1)}%{changeLabel ? ` ${changeLabel}` : ""})
        </span>
      ) : null}
    </span>
  );
}

export function SplitPercent({ value, className }: { value: number; className?: string }) {
  const abs = Math.abs(value).toFixed(2);
  const sign = value < 0 ? "-" : "";
  return (
    <span className={className}>
      <span className="text-[14px] leading-normal">
        {sign}
        {abs}
      </span>
      <span className="text-[10px] leading-normal">%</span>
    </span>
  );
}

export function ChevronRight({ className = "" }: { className?: string }) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={`rotate-180 ${className}`}
    >
      <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
    </svg>
  );
}
