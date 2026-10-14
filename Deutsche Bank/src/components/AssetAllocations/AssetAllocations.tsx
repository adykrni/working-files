"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, X } from "lucide-react";
import { FocusPortal } from "@/components/layout/FocusPortal";
import {
  closeIconVariants,
  detailPanelVariants,
  expandIconVariants,
  focusL1EnterTransition,
} from "@/components/layout/focusMotion";
import { focusLayoutSpring } from "@/components/WealthOverview/motion";
import { useDashboardFocus } from "@/context/DashboardFocusContext";
import { useFocusExpand } from "@/hooks/useFocusExpand";
import { useAssetAllocationsData } from "@/hooks/useAssetAllocationsData";
import type { AssetAllocationData } from "@/types/assetAllocations";
import { AssetAllocationCard } from "./AssetAllocationCard";
import { AssetAllocationExpanded } from "./AssetAllocationExpanded";

interface AssetAllocationsPanelProps {
  data: AssetAllocationData;
  layoutId?: string;
  showDetail: boolean;
  isExpanded: boolean;
  showCloseIcon: boolean;
  onExpand: () => void;
  onCollapse: () => void;
}

function AssetAllocationsPanel({
  data,
  layoutId = "asset-allocations-root",
  showDetail,
  isExpanded,
  showCloseIcon,
  onExpand,
  onCollapse,
}: AssetAllocationsPanelProps) {
  return (
    <motion.div
      layout
      layoutId={layoutId}
      transition={focusLayoutSpring}
      className="flex h-full w-full flex-col rounded-[10px] bg-[var(--db-surface-light)] p-1.5"
    >
      <motion.div
        layout
        transition={focusLayoutSpring}
        className="flex items-center justify-between px-1 py-0.5"
      >
        <motion.p
          layout
          transition={focusLayoutSpring}
          className="px-1 py-0.5 font-display text-[14px] text-[var(--db-primary)]"
        >
          Asset class allocation
        </motion.p>

        <motion.button
          type="button"
          onClick={showCloseIcon ? onCollapse : onExpand}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.12 }}
          className="relative flex size-4 shrink-0 items-center justify-center text-[var(--db-primary)]"
          aria-label={
            showCloseIcon ? "Collapse asset class allocation" : "Expand asset class allocation"
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
      </motion.div>

      <motion.div
        layout
        layoutId="asset-allocation-surface"
        transition={focusLayoutSpring}
        className={[
          "flex flex-1 flex-col overflow-hidden rounded-md bg-white shadow-[0px_0.5px_1px_0px_rgba(0,32,91,0.1),0px_1px_0px_-1px_rgba(0,32,91,0.2),0px_0px_0px_0.5px_rgba(0,32,91,0.2)]",
          showDetail ? "p-5" : "p-2.5",
        ].join(" ")}
      >
        {!showDetail && <AssetAllocationCard data={data} onExpand={onExpand} />}

        {showDetail && isExpanded && (
          <motion.div
            layout
            variants={detailPanelVariants}
            initial="initial"
            animate="animate"
            className="overflow-hidden"
          >
            <AssetAllocationExpanded data={data} onCollapse={onCollapse} />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

interface AssetAllocationsProps {
  dataOverride?: ReturnType<typeof useAssetAllocationsData>["data"];
}

export default function AssetAllocations({ dataOverride }: AssetAllocationsProps) {
  const { data: fetchedData, loading, error } = useAssetAllocationsData();
  const data = dataOverride ?? fetchedData;
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
  } = useFocusExpand("asset-allocations");

  if (loading) {
    return (
      <div
        className="w-full rounded-[10px] bg-[var(--db-surface-light)] p-2.5 text-[14px] text-[var(--db-muted)]"
        role="status"
        aria-live="polite"
      >
        Loading asset allocation…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        className="w-full rounded-[10px] bg-[var(--db-surface-light)] p-2.5 text-[14px] text-[#d8331d]"
        role="alert"
      >
        {error ?? "Unable to load asset allocation data."}
      </div>
    );
  }

  const l1PanelProps = {
    data,
    showDetail: false,
    isExpanded: false,
    showCloseIcon: false,
    onExpand: expand,
    onCollapse: collapse,
  };

  const portalPanelProps = {
    ...l1PanelProps,
    showDetail: true,
    isExpanded: true,
    showCloseIcon,
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
            <AssetAllocationsPanel {...l1PanelProps} layoutId="asset-allocations-root" />
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
        <AssetAllocationsPanel {...portalPanelProps} layoutId="asset-allocations-root" />
      </FocusPortal>
    </>
  );
}
