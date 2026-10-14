import { formatCurrencyParts } from "@/lib/format";

interface HoldingsCurrencyValueProps {
  value: number;
  className?: string;
  showSign?: boolean;
}

/** Figma split typography: 14px whole, 8px decimals + USD */
export function HoldingsCurrencyValue({
  value,
  className = "",
  showSign = false,
}: HoldingsCurrencyValueProps) {
  const { whole, decimals } = formatCurrencyParts(Math.abs(value));
  const sign = showSign && value < 0 ? "-" : "";

  return (
    <span className={`text-[var(--db-primary)] ${className}`}>
      <span className="text-[14px] leading-normal">
        {sign}
        {whole}.
      </span>
      <span className="text-[8px] leading-normal">
        {decimals} USD{" "}
      </span>
    </span>
  );
}

interface HoldingsReturnsValueProps {
  dollar: number;
  percent: number;
}

/** Figma returns column: currency + 8px colored percent */
export function HoldingsReturnsValue({ dollar, percent }: HoldingsReturnsValueProps) {
  const percentColor =
    percent > 0
      ? "text-[var(--db-success)]"
      : percent < 0
        ? "text-[#ff5040]"
        : "text-[var(--db-muted)]";

  return (
    <span className="text-[var(--db-primary)]">
      <HoldingsCurrencyValue value={dollar} showSign />
      <span className={`text-[8px] leading-normal ${percentColor}`}>
        ({percent >= 0 ? "+" : ""}
        {percent.toFixed(1)}%)
      </span>
    </span>
  );
}
