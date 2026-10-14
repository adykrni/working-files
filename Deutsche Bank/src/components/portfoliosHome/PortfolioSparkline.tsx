"use client";

/** Deterministic mini sparkline for sidebar portfolio rows (Figma 1034). */
function seedPoints(id: string, trendUp: boolean): number[] {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const pts: number[] = [];
  for (let i = 0; i < 12; i++) {
    h = (h * 1664525 + 1013904223) >>> 0;
    const n = (h % 1000) / 1000;
    pts.push(n);
  }
  if (trendUp) pts.sort((a, b) => a - b);
  else pts.sort((a, b) => b - a);
  return pts;
}

type Props = {
  id: string;
  positive: boolean;
  width?: number;
  height?: number;
  className?: string;
};

export function PortfolioSparkline({
  id,
  positive,
  width = 184,
  height = 13,
  className = "",
}: Props) {
  const values = seedPoints(id, positive);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = width / (values.length - 1);
  const d = values
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / span) * (height - 2) - 1;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  const stroke = positive ? "#11810d" : "#d72735";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden
    >
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
