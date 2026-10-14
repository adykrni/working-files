"use client";

import { motion } from "framer-motion";
import type { PortfolioId, WealthData } from "@/types/wealth";
import { focusLayoutSpring } from "../motion";
import { jakubContainerVariants } from "../motion/jakub";
import { PortfolioContent } from "./PortfolioContent";

interface PortfolioDetailContentProps {
  selectedId: PortfolioId;
  data: WealthData;
}

export function PortfolioDetailContent({ selectedId, data }: PortfolioDetailContentProps) {
  return (
    <motion.div layout="size" transition={{ layout: focusLayoutSpring }} className="w-full">
      <motion.div
        key={selectedId}
        variants={jakubContainerVariants}
        initial="initial"
        animate="animate"
      >
        <PortfolioContent selectedId={selectedId} data={data} />
      </motion.div>
    </motion.div>
  );
}
