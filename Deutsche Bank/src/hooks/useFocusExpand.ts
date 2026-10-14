"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDashboardFocus } from "@/context/DashboardFocusContext";
import type { DashboardFocusTarget } from "@/types/dashboardFocus";

/**
 * Coordinates local L1/L2 expand state with page-level single-focus overlay.
 * Enter: shared layout morph (L1 grid → centred portal).
 * Exit: portal fades out in place, then L1 remounts — no reverse layout morph.
 */
export function useFocusExpand(focusId: DashboardFocusTarget) {
  const { focusTarget, requestFocus, releaseFocus } = useDashboardFocus();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [portalVisible, setPortalVisible] = useState(false);
  const [l1Entering, setL1Entering] = useState(false);
  const [placeholderHeight, setPlaceholderHeight] = useState<number | undefined>();
  const isCollapsingRef = useRef(false);
  const measureRef = useRef<HTMLDivElement>(null);

  const isFocused = focusTarget === focusId;
  const isBackground = focusTarget !== null && focusTarget !== focusId;

  const capturePlaceholderHeight = useCallback(() => {
    if (measureRef.current) {
      setPlaceholderHeight(measureRef.current.offsetHeight);
    }
  }, []);

  const expand = useCallback(() => {
    capturePlaceholderHeight();
    isCollapsingRef.current = false;
    setL1Entering(false);
    requestFocus(focusId);
    setIsExpanded(true);
    setShowDetail(true);
    setPortalVisible(true);
  }, [capturePlaceholderHeight, focusId, requestFocus]);

  const collapse = useCallback(() => {
    if (isCollapsingRef.current || !portalVisible) return;
    isCollapsingRef.current = true;
    setPortalVisible(false);
  }, [portalVisible]);

  const onPortalExitComplete = useCallback(() => {
    if (!isCollapsingRef.current) return;
    isCollapsingRef.current = false;
    setShowDetail(false);
    setIsExpanded(false);
    setPlaceholderHeight(undefined);
    releaseFocus();
    setL1Entering(true);
  }, [releaseFocus]);

  const onL1EnterComplete = useCallback(() => {
    setL1Entering(false);
  }, []);

  useEffect(() => {
    if (focusTarget === focusId) return;
    if (!isExpanded && !showDetail && !portalVisible) return;
    isCollapsingRef.current = false;
    setPortalVisible(false);
    setShowDetail(false);
    setIsExpanded(false);
    setPlaceholderHeight(undefined);
    setL1Entering(false);
  }, [focusTarget, focusId, isExpanded, showDetail, portalVisible]);

  useEffect(() => {
    if (!isFocused) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") collapse();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocused, collapse]);

  const showCloseIcon = portalVisible && isFocused;

  return {
    isFocused,
    isBackground,
    isExpanded,
    showDetail,
    portalVisible,
    l1Entering,
    showCloseIcon,
    expand,
    collapse,
    onPortalExitComplete,
    onL1EnterComplete,
    measureRef,
    placeholderHeight,
  };
}
