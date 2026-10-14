export function formatInteger(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export function formatCurrencyParts(value: number): {
  whole: string;
  decimals: string;
} {
  const [whole, dec = "00"] = value
    .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .split(".");
  return { whole, decimals: dec };
}

export function formatSignedPercent(value: number, options?: { parens?: boolean }): string {
  const abs = Math.abs(value).toFixed(2);
  if (options?.parens) {
    return value >= 0 ? `(+${abs}%)` : `(${value.toFixed(2)}%)`;
  }
  return value >= 0 ? `+${abs}%` : `${value.toFixed(2)}%`;
}

export function formatSignedPercentWhole(value: number): string {
  const abs = Math.abs(value).toFixed(1);
  return value >= 0 ? `+${abs}%` : `${value.toFixed(1)}%`;
}

/** Matches CurrencyDisplay sm split: whole at 22px, ".X%" suffix at 14px */
export function formatSignedPercentParts(value: number): { whole: string; suffix: string } {
  const abs = Math.abs(value);
  const [intPart, decPart = "0"] = abs.toFixed(1).split(".");
  const sign = value < 0 ? "-" : "+";
  return {
    whole: `${sign}${intPart}`,
    suffix: `.${decPart}%`,
  };
}

export function percentColorClass(value: number): string {
  if (value > 0) return "text-[var(--db-success)]";
  if (value < 0) return "text-red-600";
  return "text-[var(--db-secondary-light)]";
}

export function formatMillions(value: number, digits = 1): string {
  return `$${(value / 1_000_000).toFixed(digits)}M`;
}
