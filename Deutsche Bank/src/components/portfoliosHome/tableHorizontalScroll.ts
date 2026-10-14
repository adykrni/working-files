import type { RefObject } from "react";

export const TABLE_X_SCROLL =
  "overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

export function createHorizontalScrollSync(
  headRef: RefObject<HTMLDivElement | null>,
  bodyRef: RefObject<HTMLDivElement | null>,
) {
  let syncing = false;
  return (from: "head" | "body") => {
    if (syncing) return;
    const head = headRef.current;
    const body = bodyRef.current;
    if (!head || !body) return;
    syncing = true;
    if (from === "body") head.scrollLeft = body.scrollLeft;
    else body.scrollLeft = head.scrollLeft;
    syncing = false;
  };
}
