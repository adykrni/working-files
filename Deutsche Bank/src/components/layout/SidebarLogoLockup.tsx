/** Sidebar header logo — SVG lockup scaled to 24px height for crisp rendering on Retina */
const LOGO_HEIGHT = 24;
const NATIVE_ICON_SIZE = 16.1;
const SCALE = LOGO_HEIGHT / NATIVE_ICON_SIZE;

const iconSize = NATIVE_ICON_SIZE * SCALE;
const titleWidth = 55.6854 * SCALE;
const titleHeight = 6.00034 * SCALE;
const subtitleWidth = 77.372 * SCALE;
const subtitleHeight = 7.57116 * SCALE;
const iconTextGap = 7.824 * SCALE;
const lineGap = 2.8 * SCALE;

export function SidebarLogoLockup() {
  return (
    <div
      className="flex shrink-0 items-center"
      style={{ gap: iconTextGap, height: LOGO_HEIGHT }}
      role="img"
      aria-label="Deutsche Bank Wealth Management"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/db-logo-icon.svg"
        alt=""
        width={iconSize}
        height={iconSize}
        aria-hidden
        className="block shrink-0"
      />
      <div className="flex flex-col" style={{ gap: lineGap }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/db-logo-title.svg"
          alt=""
          width={titleWidth}
          height={titleHeight}
          aria-hidden
          className="block shrink-0"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/db-logo-subtitle.svg"
          alt=""
          width={subtitleWidth}
          height={subtitleHeight}
          aria-hidden
          className="block shrink-0"
        />
      </div>
    </div>
  );
}
