"use client";

import { useCallback, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, X } from "lucide-react";
import { FocusPortal } from "@/components/layout/FocusPortal";
import {
  closeIconVariants,
  expandIconVariants,
  focusL1EnterTransition,
} from "@/components/layout/focusMotion";
import { focusLayoutSpring } from "@/components/WealthOverview/motion";
import { useDashboardFocus } from "@/context/DashboardFocusContext";
import { useFocusExpand } from "@/hooks/useFocusExpand";
import {
  getHoldingsSecurityDetails,
  useHoldingsData,
} from "@/hooks/useHoldingsData";
import type { HoldingsAssetClass } from "@/types/holdings";
import { AssetAllocationSelector } from "./AssetAllocationSelector";
import { HoldingsRowExpanded } from "./HoldingsRowExpanded";
import { HoldingsTable } from "./HoldingsTable";

const SURFACE_SHADOW =
  "0px 0.5px 1px 0px rgba(0,32,91,0.1), 0px 1px 0px -1px rgba(0,32,91,0.2), 0px 0px 0px 0.5px rgba(0,32,91,0.2)";

function HoldingsSurface({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex min-h-[230px] flex-col gap-2.5 rounded-[6px] bg-white p-2.5"
      style={{ boxShadow: SURFACE_SHADOW }}
    >
      {children}
    </div>
  );
}

interface HoldingsPanelProps {
  layoutId?: string;
  /** L2 focused view — enables row expand and Show more/less */
  isDetailView: boolean;
  selectedAssetClass: HoldingsAssetClass;
  showCloseIcon: boolean;
  expandedSecurityIds: Set<string>;
  data: NonNullable<ReturnType<typeof useHoldingsData>["data"]>;
  onExpand: () => void;
  onCollapse: () => void;
  onAssetClassChange: (assetClass: HoldingsAssetClass) => void;
  onSecurityToggle: (securityId: string) => void;
}

function HoldingsPanel({
  layoutId = "holdings-root",
  isDetailView,
  selectedAssetClass,
  showCloseIcon,
  expandedSecurityIds,
  data,
  onExpand,
  onCollapse,
  onAssetClassChange,
  onSecurityToggle,
}: HoldingsPanelProps) {
  return (
    <motion.div
      layout="position"
      layoutId={layoutId}
      transition={focusLayoutSpring}
      className="flex w-full min-w-0 flex-col gap-1.5 rounded-[10px] bg-[var(--db-surface-light)] p-1.5"
    >
      <div className="flex items-center justify-between gap-4 px-0.5">
        <div className="flex flex-wrap items-center gap-1">
          <p className="font-display text-[14px] text-[var(--db-primary)]">Holdings</p>
          <AssetAllocationSelector
            assetClass={selectedAssetClass}
            onAssetClassChange={onAssetClassChange}
          />
        </div>
        <motion.button
          type="button"
          onClick={showCloseIcon ? onCollapse : onExpand}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.12 }}
          className="relative flex size-4 shrink-0 items-center justify-center text-[var(--db-primary)]"
          aria-label={showCloseIcon ? "Collapse holdings" : "Expand holdings"}
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
                <X size={16} strokeWidth={1.5} />
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

      <HoldingsSurface>
        <HoldingsTable
          holdings={data.holdings}
          isDetailView={isDetailView}
          expandedSecurityIds={expandedSecurityIds}
          onExpandComponent={onExpand}
          onSecurityToggle={onSecurityToggle}
          getReturnForSecurity={(securityId) => {
            const details = getHoldingsSecurityDetails(selectedAssetClass, securityId);
            if (!details) return undefined;
            return {
              dollar: details.performance.ytdReturnDollar,
              percent: details.performance.ytdReturn,
            };
          }}
          renderExpandedRow={(security) => {
            const details = getHoldingsSecurityDetails(selectedAssetClass, security.id);
            if (!details) return null;
            return (
              <HoldingsRowExpanded
                security={security}
                performance={details.performance}
                riskMetrics={details.riskMetrics}
                costBasis={details.costBasis}
                benchmarkLabel={data.benchmarkLabel}
                performanceHistory={details.performanceHistory}
              />
            );
          }}
        />
      </HoldingsSurface>
    </motion.div>
  );
}

function HoldingsLoading() {
  return (
    <div className="w-full min-w-0">
      <div className="rounded-[10px] bg-[var(--db-surface-light)] p-1.5">
        <p className="mb-1.5 px-1 font-display text-[14px] text-[var(--db-primary)]">
          Holdings
        </p>
        <HoldingsSurface>
          <div
            className="flex min-h-[200px] items-center justify-center text-[14px] text-[var(--db-muted)]"
            role="status"
            aria-live="polite"
          >
            Loading holdings…
          </div>
        </HoldingsSurface>
      </div>
    </div>
  );
}

export default function Holdings() {
  const [selectedAssetClass, setSelectedAssetClass] =
    useState<HoldingsAssetClass>("equities");
  const [expandedSecurityIds, setExpandedSecurityIds] = useState<Set<string>>(
    () => new Set(),
  );

  const { data, loading, error } = useHoldingsData(selectedAssetClass);
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
  } = useFocusExpand("holdings");

  const handleAssetClassChange = useCallback((assetClass: HoldingsAssetClass) => {
    setSelectedAssetClass(assetClass);
    setExpandedSecurityIds(new Set());
  }, []);

  const handleSecurityToggle = useCallback((securityId: string) => {
    setExpandedSecurityIds((prev) => {
      const next = new Set(prev);
      if (next.has(securityId)) {
        next.delete(securityId);
      } else {
        next.add(securityId);
      }
      return next;
    });
  }, []);

  const handleCollapse = useCallback(() => {
    setExpandedSecurityIds(new Set());
    collapse();
  }, [collapse]);

  if (loading) {
    return <HoldingsLoading />;
  }

  if (error || !data) {
    return (
      <div className="w-full min-w-0">
        <div className="rounded-[10px] bg-[var(--db-surface-light)] p-1.5">
          <p className="mb-1.5 px-1 font-display text-[14px] text-[var(--db-primary)]">
            Holdings
          </p>
          <HoldingsSurface>
            <div
              className="flex min-h-[120px] items-center justify-center text-[14px] text-[#ff5040]"
              role="alert"
            >
              {error ?? "Unable to load holdings data."}
            </div>
          </HoldingsSurface>
        </div>
      </div>
    );
  }

  const l1PanelProps = {
    isDetailView: false,
    selectedAssetClass,
    showCloseIcon: false,
    expandedSecurityIds,
    data,
    onExpand: expand,
    onCollapse: handleCollapse,
    onAssetClassChange: handleAssetClassChange,
    onSecurityToggle: handleSecurityToggle,
  };

  const portalPanelProps = {
    ...l1PanelProps,
    isDetailView: true,
    showCloseIcon,
    onCollapse: handleCollapse,
  };

  return (
    <>
      <div ref={measureRef} className="h-full w-full min-w-0">
        {!isFocused ? (
          <motion.div
            className="h-full"
            initial={l1Entering ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={focusL1EnterTransition}
            onAnimationComplete={() => {
              if (l1Entering) onL1EnterComplete();
            }}
          >
            <HoldingsPanel {...l1PanelProps} layoutId="holdings-root" />
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
        <HoldingsPanel {...portalPanelProps} layoutId="holdings-root" />
      </FocusPortal>
    </>
  );
}
