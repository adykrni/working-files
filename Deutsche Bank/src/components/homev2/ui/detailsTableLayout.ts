/** Figma 745:3322 / 758:2994 / 745:3490 — tab-panel table tokens */

export const TABLE_BORDER = "border-b border-[#dfe3e9]";

/** Holdings — 895px, 4 × 221.25px columns, 41px rows */
export const HOLDINGS_GRID = "grid w-full max-w-[895px] grid-cols-4";

export const holdingsCell = {
  name: `flex h-[41px] items-center ${TABLE_BORDER} py-2.5 pl-2.5`,
  value: `flex h-[41px] items-center justify-center ${TABLE_BORDER} py-2.5 pl-2.5`,
  change: `flex h-[41px] items-center justify-end ${TABLE_BORDER} py-2.5 pr-2.5`,
  actions: `flex h-[41px] items-center justify-end gap-2 ${TABLE_BORDER} py-2.5 pr-2.5`,
} as const;

/** Standing orders — 895px: 9 | 256 | 130×4 | 100 */
export const ORDERS_GRID =
  "grid w-full min-w-[895px] grid-cols-[9px_256px_130px_130px_130px_130px_100px]";

export const ordersHeaderCell = {
  dot: `flex h-[34px] items-center ${TABLE_BORDER} py-2.5`,
  security: `flex h-[34px] items-center ${TABLE_BORDER} py-2.5 pl-2.5`,
  metric: `flex h-[34px] items-center justify-center ${TABLE_BORDER} px-1.5 py-2.5`,
  status: `flex h-[34px] items-center ${TABLE_BORDER} px-[30px] py-2.5`,
  action: `flex h-[34px] items-center justify-end ${TABLE_BORDER} px-2.5 py-2.5`,
} as const;

export const ordersCell = {
  dot: `flex h-[41px] items-center justify-center ${TABLE_BORDER} pl-0.5`,
  security: `flex h-[41px] min-w-0 items-center ${TABLE_BORDER} py-2.5 pl-2.5 pr-1.5`,
  metric: `flex h-[41px] items-center justify-center ${TABLE_BORDER} px-1.5 py-2.5`,
  status: `flex h-[41px] items-center ${TABLE_BORDER} px-[30px] py-2.5`,
  action: `flex h-[41px] items-center justify-end gap-1 ${TABLE_BORDER} p-2.5`,
} as const;

/** Allocations — 505px table, 4 equal columns, 39px rows */
export const allocationNameCell = `flex h-[39px] items-center gap-2 ${TABLE_BORDER} px-5 py-2.5`;
export const allocationMetricCell = `flex h-[39px] items-center justify-center ${TABLE_BORDER} px-5 py-2.5`;
