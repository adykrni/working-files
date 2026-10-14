/** Plot content gutters — shared by header, series, x-axis, and footer */
export const CHART_PLOT_INSET_LEFT = 38;
export const CHART_PLOT_INSET_RIGHT = 4;

/** Compact home chart — no Y-axis; symmetric horizontal plot inset */
export const CHART_PLOT_INSET_COMPACT = 20;

/** Chart view — dedicated Y gutter; plot runs to the right edge */
export { CHART_EMPHASIS_Y_GUTTER as CHART_PLOT_INSET_EMPHASIS_LEFT } from "./chartAxis";
/** Chart view plot runs flush to the right content edge */
export const CHART_PLOT_INSET_EMPHASIS_RIGHT = 0;

export const chartPlotContentInsetStyle = {
  paddingLeft: CHART_PLOT_INSET_LEFT,
  paddingRight: CHART_PLOT_INSET_RIGHT,
} as const;
