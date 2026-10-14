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
import { ACTIVE_BOX_SHADOW, HOVER_BOX_SHADOW, focusLayoutSpring } from "@/components/WealthOverview/motion";
import { useDashboardFocus } from "@/context/DashboardFocusContext";
import { useFocusExpand } from "@/hooks/useFocusExpand";
import { useGoalMonitoringData } from "@/hooks/useGoalMonitoringData";
import type { GoalPortfolioType, GoalTimeframe } from "@/types/goalMonitoring";
import { GoalMonitoringCard } from "./GoalMonitoringCard";
import { GoalMonitoringExpanded } from "./GoalMonitoringExpanded";

const PORTFOLIO_TABS: { id: GoalPortfolioType; label: string }[] = [
  { id: "advisory", label: "Advisory" },
  { id: "execution", label: "Execution" },
  { id: "retirement", label: "Retirement" },
];

interface GoalMonitoringPanelProps {
  layoutId?: string;
  title: string;
  portfolio: ReturnType<typeof useGoalMonitoringData>["portfolios"][GoalPortfolioType];
  selectedPortfolioType: GoalPortfolioType;
  showDetail: boolean;
  isExpanded: boolean;
  showCloseIcon: boolean;
  showLevel3: boolean;
  selectedTimeframe: GoalTimeframe;
  onExpand: () => void;
  onCollapse: () => void;
  onPortfolioChange: (type: GoalPortfolioType) => void;
  onToggleLevel3: () => void;
  onTimeframeChange: (timeframe: GoalTimeframe) => void;
}

function GoalMonitoringPanel({
  layoutId = "goal-monitoring-root",
  title,
  portfolio,
  selectedPortfolioType,
  showDetail,
  isExpanded,
  showCloseIcon,
  showLevel3,
  selectedTimeframe,
  onExpand,
  onCollapse,
  onPortfolioChange,
  onToggleLevel3,
  onTimeframeChange,
}: GoalMonitoringPanelProps) {
  const [hoveredTab, setHoveredTab] = useState<GoalPortfolioType | null>(null);

  return (
    <motion.div
      layout="position"
      layoutId={layoutId}
      transition={focusLayoutSpring}
      className="w-full rounded-[10px] bg-[var(--db-surface-light)] p-1.5"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          <p className="font-display text-[14px] text-[var(--db-primary)]">
            {title}
          </p>
          <div
            className="flex flex-wrap items-center gap-2.5"
            role="tablist"
            aria-label="Portfolio type"
          >
            {PORTFOLIO_TABS.map((tab) => {
              const isSelected = selectedPortfolioType === tab.id;
              const isHovered = hoveredTab === tab.id && !isSelected;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => onPortfolioChange(tab.id)}
                  onMouseEnter={() => setHoveredTab(tab.id)}
                  onMouseLeave={() => setHoveredTab(null)}
                  className={[
                    "rounded-[4px] px-2.5 py-1.5 text-[12px] leading-none text-[var(--db-primary)] transition-shadow",
                    isSelected ? "bg-white" : "bg-transparent",
                  ].join(" ")}
                  style={{
                    boxShadow: isSelected
                      ? ACTIVE_BOX_SHADOW
                      : isHovered
                        ? HOVER_BOX_SHADOW
                        : undefined,
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <motion.button
          type="button"
          onClick={showCloseIcon ? onCollapse : onExpand}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.12 }}
          className="relative flex size-[18px] shrink-0 items-center justify-center text-[var(--db-primary)]"
          aria-label={
            showCloseIcon ? "Collapse wealth monitoring" : "Expand wealth monitoring"
          }
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
                <Maximize2 size={16} strokeWidth={1.5} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <div className="rounded-[6px] bg-white p-2.5 shadow-[0px_0.5px_1px_0px_rgba(0,32,91,0.1),0px_1px_0px_-1px_rgba(0,32,91,0.2),0px_0px_0px_0.5px_rgba(0,32,91,0.2)]">
        {!showDetail && <GoalMonitoringCard portfolio={portfolio} onExpand={onExpand} />}

        {showDetail && isExpanded && (
          <motion.div
            variants={detailPanelVariants}
            initial="initial"
            animate="animate"
          >
            <GoalMonitoringExpanded
              portfolio={portfolio}
              showLevel3={showLevel3}
              selectedTimeframe={selectedTimeframe}
              onToggleLevel3={onToggleLevel3}
              onTimeframeChange={onTimeframeChange}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/** Main container — Jakub-style expand/collapse with single-focus overlay */
export default function GoalMonitoring() {
  const [showLevel3, setShowLevel3] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<GoalTimeframe>("MAX");
  const [selectedPortfolioType, setSelectedPortfolioType] =
    useState<GoalPortfolioType>("advisory");

  const data = useGoalMonitoringData();
  const portfolio = data.portfolios[selectedPortfolioType];
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
  } = useFocusExpand("goal-monitoring");

  const handlePortfolioChange = useCallback((type: GoalPortfolioType) => {
    setSelectedPortfolioType(type);
    setShowLevel3(false);
  }, []);

  const handleToggleLevel3 = useCallback(() => {
    setShowLevel3((prev) => !prev);
  }, []);

  const handleCollapse = useCallback(() => {
    setShowLevel3(false);
    collapse();
  }, [collapse]);

  const l1PanelProps = {
    title: data.title,
    portfolio,
    selectedPortfolioType,
    showDetail: false,
    isExpanded: false,
    showCloseIcon: false,
    showLevel3,
    selectedTimeframe,
    onExpand: expand,
    onCollapse: handleCollapse,
    onPortfolioChange: handlePortfolioChange,
    onToggleLevel3: handleToggleLevel3,
    onTimeframeChange: setSelectedTimeframe,
  };

  const portalPanelProps = {
    ...l1PanelProps,
    showDetail: true,
    isExpanded: true,
    showCloseIcon,
  };

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
            <GoalMonitoringPanel {...l1PanelProps} layoutId="goal-monitoring-root" />
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
        <GoalMonitoringPanel {...portalPanelProps} layoutId="goal-monitoring-root" />
      </FocusPortal>
    </>
  );
}
