/** Bleed sticky bars to the scroll container edges while keeping content aligned. */
export const PORTFOLIOS_HOME_STICKY_BLEED =
  "-mx-4 px-4 sm:-mx-5 sm:px-5 md:-mx-6 md:px-6 lg:-mx-[30px] lg:px-[30px]";

/** Padding above tab pills when the sticky stack is pinned (inside opaque chrome). */
export const PORTFOLIOS_HOME_STICKY_TOP_OFFSET_PX = 20;

/** Full-viewport white backdrop so rows never show through side gaps or underlap. */
export const STICKY_CHROME_BACKDROP =
  "relative overflow-x-clip bg-white before:pointer-events-none before:absolute before:inset-y-0 before:-left-4 before:-right-4 before:-z-10 before:bg-white before:content-[''] sm:before:-left-5 sm:before:-right-5 md:before:-left-6 md:before:-right-6 lg:before:-left-[30px] lg:before:-right-[30px]";

/** Sticky block wrapping the header table (not individual th — avoids overflow-x clipping). */
export const STICKY_TABLE_HEAD_BLOCK = [
  STICKY_CHROME_BACKDROP,
  "sticky z-[25] bg-white shadow-[0_1px_0_0_#dfe3e9]",
].join(" ");
