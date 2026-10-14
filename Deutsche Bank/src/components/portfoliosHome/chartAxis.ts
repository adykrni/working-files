/** Fintech axis layout — single origin, shared by grid, series, and labels */

/** Axis spine — soft grey, lighter than tick labels */
export const CHART_AXIS_COLOR = "#c5cad3";
export const CHART_GRID_COLOR = "#e2e8f0";
export const CHART_TICK_COLOR = "#8b939e";

/** Left gutter: Y labels right-align to the axis at `originX` */
export const CHART_EMPHASIS_Y_GUTTER = 48;
export const CHART_EMPHASIS_PLOT_TOP = 16;
export const CHART_EMPHASIS_X_LABEL_BAND = 26;
export const CHART_Y_LABEL_GAP = 8;
export const CHART_X_TICK_LEN = 4;
export const CHART_X_LABEL_OFFSET = 14;

export function formatAxisIndexValue(value: number): string {
  if (Math.abs(value - Math.round(value)) < 0.05) return Math.round(value).toString();
  return value.toFixed(1);
}

/** Nice linear ticks (Heckbert-style step) for readable Y-axis labels */
export function getNiceLinearTicks(min: number, max: number, targetCount = 5): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0];
  if (min === max) return [min];

  const span = max - min;
  const rawStep = span / Math.max(1, targetCount - 1);
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const normalized = rawStep / magnitude;

  let niceStep = magnitude;
  if (normalized <= 1) niceStep = magnitude;
  else if (normalized <= 2) niceStep = 2 * magnitude;
  else if (normalized <= 5) niceStep = 5 * magnitude;
  else niceStep = 10 * magnitude;

  const niceMin = Math.floor(min / niceStep) * niceStep;
  const niceMax = Math.ceil(max / niceStep) * niceStep;

  const ticks: number[] = [];
  for (let v = niceMin; v <= niceMax + niceStep * 0.0001; v += niceStep) {
    ticks.push(Number(v.toFixed(4)));
  }

  if (ticks.length < 2) return [min, max];
  return ticks;
}

export function getYTicksInDomain(yMin: number, yMax: number, targetCount = 5): number[] {
  const nice = getNiceLinearTicks(yMin, yMax, targetCount);
  const inside = nice.filter((t) => t >= yMin - 1e-6 && t <= yMax + 1e-6);
  if (inside.length >= 2) return inside;
  return [yMin, yMax];
}

/** Scale domain snapped to nice ticks so grid, labels, and axis share one frame */
export function getNiceYScale(dataMin: number, dataMax: number, targetCount = 5) {
  const ticks = getNiceLinearTicks(dataMin, dataMax, targetCount);
  return {
    ticks,
    scaleMin: ticks[0] ?? dataMin,
    scaleMax: ticks[ticks.length - 1] ?? dataMax,
  };
}
