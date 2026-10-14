import { formatCurrencyParts } from "@/lib/format";

interface CurrencyDisplayProps {
  value: number;
  size?: "compact" | "sm" | "md" | "lg";
  inverted?: boolean;
}

const sizeClasses = {
  compact: { whole: "text-[15px]", dec: "" },
  sm: { whole: "text-[22px]", dec: "text-[14px]" },
  md: { whole: "text-[24px]", dec: "text-[14px]" },
  lg: { whole: "text-[24px]", dec: "text-[14px]" },
};

export function CurrencyDisplay({
  value,
  size = "md",
  inverted = false,
}: CurrencyDisplayProps) {
  const { whole, decimals } = formatCurrencyParts(value);
  const color = inverted ? "text-white" : "text-[var(--db-primary)]";

  return (
    <p className={`font-display leading-none ${color}`}>
      {size === "compact" ? (
        <span className={sizeClasses.compact.whole}>
          {whole}.{decimals} USD
        </span>
      ) : (
        <>
          <span className={sizeClasses[size].whole}>{whole}</span>
          <span className={sizeClasses[size].dec}>.{decimals} USD</span>
        </>
      )}
    </p>
  );
}
