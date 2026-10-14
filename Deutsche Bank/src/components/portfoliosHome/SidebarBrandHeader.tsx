"use client";

/** Figma 1034:2715 — 211×46 brand strip above sidebar nav */

function CollapseIcon() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/sidebar/homev2/collapse.svg" alt="" width={14} height={14} aria-hidden className="block" />
  );
}

function SidebarLogo() {
  return (
    <div
      className="flex w-[94px] shrink-0 items-center justify-between"
      role="img"
      aria-label="Deutsche Bank Wealth Management"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/db-logo-icon.svg" alt="" width={16} height={16} aria-hidden className="block shrink-0" />
      <div className="relative shrink-0 leading-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/db-logo-title.svg" alt="" width={56} height={6} aria-hidden className="block" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/db-logo-subtitle.svg"
          alt=""
          width={77}
          height={8}
          aria-hidden
          className="mt-1 block"
        />
      </div>
    </div>
  );
}

export function SidebarBrandHeader() {
  return (
    <div
      data-node-id="1034:2715"
      className="flex h-[46px] shrink-0 items-center justify-between border-b border-[#dfe3e9] bg-[#f9fbfd] pl-[18px] pr-[10px]"
    >
      <SidebarLogo />
      <button
        type="button"
        className="flex size-4 shrink-0 items-center justify-center rounded-[4px] transition-colors hover:bg-[#eef2f5]"
        aria-label="Collapse sidebar"
      >
        <CollapseIcon />
      </button>
    </div>
  );
}
