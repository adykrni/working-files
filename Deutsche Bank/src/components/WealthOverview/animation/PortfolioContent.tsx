"use client";

import type { PortfolioId, WealthData } from "@/types/wealth";
import { AllPortfoliosContent } from "../content/AllPortfoliosContent";
import { AdvisoryPortfolioContent } from "../content/AdvisoryPortfolioContent";
import { ExecutionPortfolioContent } from "../content/ExecutionPortfolioContent";
import { RetirementPortfolioContent } from "../content/RetirementPortfolioContent";

interface PortfolioContentProps {
  selectedId: PortfolioId;
  data: WealthData;
}

export function PortfolioContent({ selectedId, data }: PortfolioContentProps) {
  switch (selectedId) {
    case "all":
      return <AllPortfoliosContent data={data} />;
    case "advisory":
      return <AdvisoryPortfolioContent data={data} />;
    case "execution":
      return <ExecutionPortfolioContent data={data} />;
    case "retirement":
      return <RetirementPortfolioContent data={data} />;
  }
}
