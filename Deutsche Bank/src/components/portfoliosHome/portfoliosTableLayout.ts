/** Figma 1032:2310 (NewVersion) — table grid Frame 1000003780 → 1032:2469 */

export const PORTFOLIOS_TABLE_NODE_ID = "1032:2310";
export const PORTFOLIOS_TABLE_GRID_NODE_ID = "1032:2469";

/** Frame width in Figma */
export const PORTFOLIOS_TABLE_MIN_WIDTH_PX = 1059;

/** Column widths: 223 · 223 · 223 · 223 · 168 */
export const PORTFOLIOS_TABLE_COL = {
  lg: {
    portfolio: "21.057%",
    value: "21.057%",
    dayGain: "21.057%",
    totalGain: "21.057%",
    risk: "15.864%",
  },
  sm: {
    portfolio: "28%",
    value: "22%",
    dayGain: "22%",
    totalGain: "22%",
    risk: "20%",
  },
} as const;

export const PORTFOLIOS_TABLE_ROW = {
  headerHeightPx: 39,
  bodyHeightPx: 53,
  totalHeightPx: 54,
} as const;

export const portfoliosTableShell =
  "w-full min-w-[1059px] table-fixed border-collapse bg-white text-left";

export const portfoliosTableFrame = "relative w-full min-w-0";

const cellBorder = "border border-[#dfe3e9]";

export const portfoliosGridHead = {
  base: `box-border ${cellBorder} bg-white align-middle`,
  portfolio: "h-[39px] py-[12px] pl-[20px] pr-0 text-left",
  metric: "h-[39px] py-[12px] pl-[12px] pr-[6px] text-left",
  risk: "h-[39px] py-[12px] pl-[12px] pr-[6px] text-left",
} as const;

export const portfoliosGridBody = {
  base: `box-border ${cellBorder} bg-white align-middle`,
  portfolio: "h-[53px] py-[16px] pl-[20px] pr-0 text-left",
  metric: "h-[53px] py-[16px] pl-[12px] pr-[6px] text-left",
  risk: "h-[53px] py-[16px] pl-[12px] pr-[6px] text-left",
  total: "!h-[54px] bg-white",
  hover: "transition-colors group-hover:bg-[#f8fbff]",
} as const;
