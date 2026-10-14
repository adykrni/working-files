"use client";

import { motion } from "framer-motion";
import { useCallback, useState, type KeyboardEvent } from "react";
import type { Portfolio } from "@/types/wealth";
import { CurrencyDisplay } from "./ui/CurrencyDisplay";
import { formatSignedPercent, percentColorClass } from "@/lib/format";
import {
  ACTIVE_BOX_SHADOW,
  HOVER_BOX_SHADOW,
  focusLayoutSpring,
  ringTabTransition,
  shadowFade,
} from "./motion";

interface PortfolioCellProps {
  portfolio: Portfolio;
  layoutId: string;
  isExpanded: boolean;
  isSelected: boolean;
  showDetail: boolean;
  onActivate: () => void;
}

export function PortfolioCell({
  portfolio,
  layoutId,
  isExpanded,
  isSelected,
  showDetail,
  onActivate,
}: PortfolioCellProps) {
  const [isHovered, setIsHovered] = useState(false);

  const showActiveShadow = isExpanded && isSelected && showDetail;
  const showHoverL1 = !isExpanded && isHovered;
  const showHoverL2 = isExpanded && showDetail && isHovered && !isSelected;
  const isCollapsingRing = isExpanded && isSelected && !showDetail;

  const ringOpacity = showActiveShadow ? 1 : showHoverL2 ? 0.5 : showHoverL1 ? 1 : 0;
  const ringShadow = showHoverL1 ? HOVER_BOX_SHADOW : ACTIVE_BOX_SHADOW;

  const handleActivate = useCallback(() => {
    setIsHovered(false);
    onActivate();
  }, [onActivate]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleActivate();
    }
  };

  return (
    <motion.div
      layoutId={layoutId}
      transition={focusLayoutSpring}
      role="button"
      tabIndex={0}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={[
        "relative flex min-w-0 flex-1 flex-col items-start gap-1 rounded-[6px] bg-[var(--db-card-bg)] p-2.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--db-primary)] focus-visible:ring-offset-2",
        isExpanded && "min-w-[140px]",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[6px]"
        initial={false}
        animate={{
          opacity: ringOpacity,
          filter: isCollapsingRing ? "blur(4px)" : "blur(0px)",
        }}
        transition={isCollapsingRing ? shadowFade : ringTabTransition}
        style={{ boxShadow: ringShadow }}
      />
      <p className="relative w-full truncate text-left text-[12px] leading-none text-[var(--db-primary)]">
        {portfolio.name}
      </p>
      <div className="relative w-full text-left">
        <CurrencyDisplay value={portfolio.value} size="compact" />
      </div>
      <p
        className={`relative w-full text-left text-[12px] leading-normal ${percentColorClass(portfolio.changePercentage)}`}
      >
        {formatSignedPercent(portfolio.changePercentage)}
      </p>
    </motion.div>
  );
}
