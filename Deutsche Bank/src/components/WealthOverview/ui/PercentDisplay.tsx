import { formatSignedPercentParts, percentColorClass } from "@/lib/format";

interface PercentDisplayProps {
  value: number;
  size?: "sm" | "md";
}

const sizeClasses = {
  sm: { whole: "text-[22px]", suffix: "text-[14px]" },
  md: { whole: "text-[24px]", suffix: "text-[14px]" },
};

export function PercentDisplay({ value, size = "sm" }: PercentDisplayProps) {
  const { whole, suffix } = formatSignedPercentParts(value);

  return (
    <p className={`font-display leading-none ${percentColorClass(value)}`}>
      <span className={sizeClasses[size].whole}>{whole}</span>
      <span className={sizeClasses[size].suffix}>{suffix}</span>
    </p>
  );
}
