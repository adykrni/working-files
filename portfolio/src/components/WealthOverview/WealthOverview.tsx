"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, X } from "lucide-react";
import { FocusPortal } from "@/components/layout/FocusPortal";
import {
  closeIconVariants,
  detailPanelVariants,
  expandIconVariants,
  focusL1EnterTransition,
} from "@/components/layout/focusMotion";
import { useDashboardFocus } from "@/context/DashboardFocusContext";
import { useFocusExpand } from "@/hooks/useFocusExpand";
import { useWealthData } from "@/hooks/useWealthData";
import type { PortfolioId } from "@/types/wealth";
import { PortfolioCell } from "./PortfolioCell";
import { PortfolioDetailContent } from "./animation/PortfolioDetailContent";
import { focusLayoutSpring } from "./motion";

function ExpandCollapseButton({
  showCloseIcon,
  onExpand,
  onCollapse,
}: {
  showCloseIcon: boolean;
  onExpand: () => void;
  onCollapse: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={showCloseIcon ? onCollapse : onExpand}
      whileTap={{ scale: 0.92 }}
      transition={{ duration: 0.12 }}
      className="relative flex size-[26px] items-center justify-center rounded p-1 text-[var(--db-primary)] transition-colors hover:bg-white/80"
      aria-label={showCloseIcon ? "Collapse wealth overview" : "Expand wealth overview"}
    >
      <AnimatePresence mode="sync" initial={false}>
        {showCloseIcon ? (
          <motion.span
            key="close"
            className="absolute inset-0 flex items-center justify-center"
            variants={closeIconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <X size={18} strokeWidth={1.5} />
          </motion.span>
        ) : (
          <motion.span
            key="expand"
            className="absolute inset-0 flex items-center justify-center"
            variants={expandIconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Maximize2 size={18} strokeWidth={1.5} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

interface WealthOverviewPanelProps {
  data: ReturnType<typeof useWealthData>;
  selectedId: PortfolioId;
  showDetail: boolean;
  isExpanded: boolean;
  showCloseIcon: boolean;
  onExpandAll: () => void;
  onCollapse: () => void;
  onPortfolioActivate: (portfolioId: PortfolioId) => void;
  layoutId?: string;
}

function WealthOverviewPanel({
  data,
  selectedId,
  showDetail,
  isExpanded,
  showCloseIcon,
  onExpandAll,
  onCollapse,
  onPortfolioActivate,
  layoutId = "wealth-overview-root",
}: WealthOverviewPanelProps) {
  return (
    <motion.div
      layout
      layoutId={layoutId}
      transition={focusLayoutSpring}
      className="w-full rounded-[16px] bg-[var(--db-surface-light)] p-1.5"
    >
      <motion.div
        layout
        transition={focusLayoutSpring}
        className="flex items-start justify-between p-1.5"
      >
        <motion.p layout transition={focusLayoutSpring} className="text-[var(--db-primary)]">
          <span className="text-[16px] leading-normal">{data.level1Title} </span>
          <span className="text-[14px] leading-normal text-[#6b717b]">{data.timestamp}</span>
        </motion.p>
        <ExpandCollapseButton
          showCloseIcon={showCloseIcon}
          onExpand={onExpandAll}
          onCollapse={onCollapse}
        />
      </motion.div>

      <motion.div
        layout
        layoutId="wealth-surface"
        transition={focusLayoutSpring}
        className="overflow-hidden rounded-[10px] bg-white p-1.5 shadow-[var(--shadow-card)]"
        data-tooltip-boundary
      >
        <div className={`flex flex-col ${showDetail && isExpanded ? "gap-2.5" : ""}`}>
          <div className="flex w-full gap-1.5 overflow-x-auto px-0.5 py-0.5">
            {data.portfolios.map((portfolio) => (
              <PortfolioCell
                key={portfolio.id}
                portfolio={portfolio}
                layoutId={`portfolio-${portfolio.id}`}
                isExpanded={isExpanded}
                isSelected={selectedId === portfolio.id}
                showDetail={showDetail}
                onActivate={() => onPortfolioActivate(portfolio.id as PortfolioId)}
              />
            ))}
          </div>

          {showDetail && isExpanded && (
            <motion.div
              layout
              variants={detailPanelVariants}
              initial="initial"
              animate="animate"
              className="overflow-hidden p-2.5"
            >
              <PortfolioDetailContent selectedId={selectedId} data={data} />
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function WealthOverview() {
  const [selectedId, setSelectedId] = useState<PortfolioId>("all");
  const data = useWealthData();
  const { focusPortalNode } = useDashboardFocus();
  const {
    isFocused,
    portalVisible,
    l1Entering,
    showCloseIcon,
    expand,
    collapse,
    onPortalExitComplete,
    onL1EnterComplete,
    measureRef,
    placeholderHeight,
  } = useFocusExpand("wealth-overview");

  const openToPortfolio = useCallback(
    (portfolioId: PortfolioId) => {
      setSelectedId(portfolioId);
      expand();
    },
    [expand],
  );

  const handlePortfolioActivate = useCallback(
    (portfolioId: PortfolioId) => {
      if (isFocused) {
        setSelectedId(portfolioId);
        return;
      }
      openToPortfolio(portfolioId);
    },
    [isFocused, openToPortfolio],
  );

  const handleExpandAll = useCallback(() => {
    openToPortfolio("all");
  }, [openToPortfolio]);

  return (
    <>
      <div ref={measureRef} className="w-full">
        {!isFocused ? (
          <motion.div
            initial={l1Entering ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={focusL1EnterTransition}
            onAnimationComplete={() => {
              if (l1Entering) onL1EnterComplete();
            }}
          >
            <WealthOverviewPanel
              data={data}
              selectedId={selectedId}
              showDetail={false}
              isExpanded={false}
              showCloseIcon={false}
              onExpandAll={handleExpandAll}
              onCollapse={collapse}
              onPortfolioActivate={handlePortfolioActivate}
              layoutId="wealth-overview-root"
            />
          </motion.div>
        ) : (
          <div
            aria-hidden
            className="w-full"
            style={{ height: placeholderHeight ?? 0 }}
          />
        )}
      </div>

      <FocusPortal
        portalNode={focusPortalNode}
        visible={portalVisible && isFocused}
        onExitComplete={onPortalExitComplete}
      >
        <WealthOverviewPanel
          data={data}
          selectedId={selectedId}
          showDetail
          isExpanded
          showCloseIcon={showCloseIcon}
          onExpandAll={handleExpandAll}
          onCollapse={collapse}
          onPortfolioActivate={handlePortfolioActivate}
          layoutId="wealth-overview-root"
        />
      </FocusPortal>
    </>
  );
}
