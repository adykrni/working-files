/** Figma measurements — Homepage cards (node 468:4081) */

export const homepage = {
  viewportInset: 20,
  panel: {
    borderRadius: 10,
    paddingX: 178,
  },
  projectCard: {
    width: 533,
    height: 400,
    outerPadding: 8,
    outerRadius: 14,
    innerRadius: 9,
    previewPadding: 20,
    contentGap: 10,
    textGap: 6,
    textPaddingLeft: 8,
    textPaddingRight: 100,
    textPaddingBottom: 6,
    rowGap: 20,
  },
} as const;

export const panelPaddingX = `${homepage.panel.paddingX / 16}rem`;
export const contentMaxWidth = `calc(100vw - ${homepage.viewportInset * 2}px)`;
