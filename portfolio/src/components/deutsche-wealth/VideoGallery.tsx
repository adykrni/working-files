"use client";

import { AssetAllocationsEmbed } from "@/components/deutsche-wealth/AssetAllocationsEmbed";
import { GoalMonitoringEmbed } from "@/components/deutsche-wealth/GoalMonitoringEmbed";
import { WealthOverviewEmbed } from "@/components/deutsche-wealth/WealthOverviewEmbed";

type VideoGalleryProps = {
  frameHeight?: 379 | 435 | 474;
};

const frameHeightClass: Record<NonNullable<VideoGalleryProps["frameHeight"]>, string> = {
  379: "h-[379px]",
  435: "h-[435px]",
  474: "h-[474px]",
};

export function VideoGallery({ frameHeight = 435 }: VideoGalleryProps) {
  const heightClass = frameHeightClass[frameHeight];

  return (
    <div className="w-full overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#cdd9e3]">
      <div className="flex w-max gap-5">
        <div
          className={`relative w-[675px] shrink-0 overflow-hidden rounded-[10px] border border-[#dee3ec] bg-[#ffffff] ${heightClass}`}
        >
          <WealthOverviewEmbed />
        </div>

        <div
          className={`relative w-[675px] shrink-0 overflow-hidden rounded-[10px] border border-[#dee3ec] bg-[#ffffff] ${heightClass}`}
        >
          <AssetAllocationsEmbed />
        </div>

        <div
          className={`relative w-[675px] shrink-0 overflow-hidden rounded-[10px] border border-[#dee3ec] bg-[#ffffff] ${heightClass}`}
        >
          <GoalMonitoringEmbed />
        </div>
      </div>
    </div>
  );
}
