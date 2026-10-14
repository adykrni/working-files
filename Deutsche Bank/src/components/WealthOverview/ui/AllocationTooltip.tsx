"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { AllocationHolding } from "@/types/wealth";

const CURSOR_OFFSET_X = 16;
const BOUNDARY_PADDING = 10;
const TOOLTIP_ESTIMATE_WIDTH = 200;

interface AllocationTooltipProps {
  label: string;
  holdings: AllocationHolding[];
  children: ReactNode;
}

function getBoundaryRect(trigger: HTMLElement | null): DOMRect | null {
  const panel = trigger?.closest("[data-tooltip-boundary]");
  return panel?.getBoundingClientRect() ?? null;
}

function resolvePosition(
  clientX: number,
  clientY: number,
  tooltipWidth: number,
  boundary: DOMRect | null,
): { x: number; y: number } {
  const right = (boundary?.right ?? window.innerWidth) - BOUNDARY_PADDING;
  const left = (boundary?.left ?? 0) + BOUNDARY_PADDING;

  let x = clientX + CURSOR_OFFSET_X;

  if (x + tooltipWidth > right) {
    x = clientX - CURSOR_OFFSET_X - tooltipWidth;
  }

  x = Math.max(left, Math.min(x, right - tooltipWidth));

  return { x, y: clientY };
}

export function AllocationTooltip({ label, holdings, children }: AllocationTooltipProps) {
  const tooltipId = useId();
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef({ clientX: 0, clientY: 0 });
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 380, damping: 32, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 380, damping: 32, mass: 0.4 });

  useEffect(() => setMounted(true), []);

  const setMotionPosition = useCallback(
    (px: number, py: number, immediate: boolean) => {
      if (immediate) {
        x.jump(px);
        y.jump(py);
        springX.jump(px);
        springY.jump(py);
      } else {
        x.set(px);
        y.set(py);
      }
    },
    [x, y, springX, springY],
  );

  const applyPosition = useCallback(
    (clientX: number, clientY: number, immediate: boolean) => {
      cursorRef.current = { clientX, clientY };
      const tooltipWidth = tooltipRef.current?.offsetWidth ?? TOOLTIP_ESTIMATE_WIDTH;
      const boundary = getBoundaryRect(triggerRef.current);
      const { x: px, y: py } = resolvePosition(clientX, clientY, tooltipWidth, boundary);
      setMotionPosition(px, py, immediate);
    },
    [setMotionPosition],
  );

  useLayoutEffect(() => {
    if (!visible) return;
    const { clientX, clientY } = cursorRef.current;
    applyPosition(clientX, clientY, true);
  }, [visible, holdings, label, applyPosition]);

  const placeAtTrigger = useCallback(
    (immediate: boolean) => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      applyPosition(rect.right, rect.top + rect.height / 2, immediate);
    },
    [applyPosition],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      applyPosition(e.clientX, e.clientY, false);
    },
    [applyPosition],
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      applyPosition(e.clientX, e.clientY, true);
      setVisible(true);
    },
    [applyPosition],
  );

  const handleMouseLeave = useCallback(() => {
    setVisible(false);
  }, []);

  const handleFocus = useCallback(() => {
    placeAtTrigger(true);
    setVisible(true);
  }, [placeAtTrigger]);

  const handleBlur = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <>
      <div
        ref={triggerRef}
        tabIndex={0}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="flex min-w-0 flex-col gap-2 rounded-[6px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--db-primary)] focus-visible:ring-offset-2"
        aria-describedby={visible ? tooltipId : undefined}
      >
        {children}
      </div>

      {mounted &&
        visible &&
        createPortal(
          <motion.div
            ref={tooltipRef}
            id={tooltipId}
            role="tooltip"
            className="pointer-events-none fixed top-0 left-0 z-50 w-max min-w-[200px] max-w-[min(280px,calc(100vw-24px))] -translate-y-1/2 rounded-[8px] border border-[var(--db-border-secondary)] bg-[var(--db-surface)] px-3 py-2.5 shadow-[var(--shadow-card)]"
            style={{ x: springX, y: springY }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ opacity: { duration: 0.12 } }}
          >
            <p className="mb-2 text-[12px] font-medium text-[var(--db-label)]">{label} holdings</p>
            <ul className="flex flex-col gap-1.5">
              {holdings.map((holding) => (
                <li
                  key={holding.security}
                  className="flex items-center justify-between gap-4 text-[13px] text-[var(--db-primary)]"
                >
                  <span className="min-w-0 truncate">{holding.security}</span>
                  <span className="shrink-0 font-display tabular-nums">{holding.allocation}%</span>
                </li>
              ))}
            </ul>
          </motion.div>,
          document.body,
        )}
    </>
  );
}
