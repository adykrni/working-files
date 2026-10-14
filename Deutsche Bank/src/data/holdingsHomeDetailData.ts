import {
  ASSET_CLASS_OPTIONS,
  getHoldingAssetClass,
  type HoldingRow,
} from "./holdingsHomeData";

export type HoldingPortfolioSlice = {
  portfolioName: string;
  quantity: number;
  valueUsd: number;
  portfolioPct: number;
};

export type HoldingDetail = {
  ticker: string;
  isin: string;
  assetClassLabel: string;
  sector: string;
  lastPrice: number;
  dayChangePct: number;
  dayChangeUsd: number;
  quantity: number;
  avgCost: number;
  costBasis: number;
  unrealizedGlUsd: number;
  unrealizedGlPct: number;
  guidelineLimitPct: number;
  portfolioSlices: HoldingPortfolioSlice[];
};

const SECURITY_META: Record<
  string,
  { ticker: string; isin: string; sector: string }
> = {
  "agg-bond": { ticker: "AGG", isin: "US4642872265", sector: "Fixed income" },
  cash: { ticker: "USD", isin: "—", sector: "Cash" },
  "pe-fund": { ticker: "PE-IV", isin: "LUPEFUND004", sector: "Private equity" },
  brk: { ticker: "BRK.B", isin: "US0846707026", sector: "Financials" },
  "core-sp500": { ticker: "IVV", isin: "US4642872000", sector: "Equity — US" },
  "db-ag": { ticker: "DBK", isin: "DE0005140008", sector: "Financials" },
  asml: { ticker: "ASML", isin: "NL0010273215", sector: "Technology" },
  aapl: { ticker: "AAPL", isin: "US0378331005", sector: "Technology" },
  sap: { ticker: "SAP", isin: "DE0007164600", sector: "Technology" },
  msft: { ticker: "MSFT", isin: "US5949181045", sector: "Technology" },
  nvda: { ticker: "NVDA", isin: "US67066G1040", sector: "Technology" },
  tsla: { ticker: "TSLA", isin: "US88160R1014", sector: "Consumer" },
  lvmh: { ticker: "MC", isin: "FR0000121014", sector: "Consumer" },
  nestle: { ticker: "NESN", isin: "CH0038863350", sector: "Consumer" },
  siemens: { ticker: "SIE", isin: "DE0007236101", sector: "Industrials" },
  vnq: { ticker: "VNQ", isin: "US9229085538", sector: "Real estate" },
};

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) {
    h = (h * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function fallbackMeta(row: HoldingRow) {
  const words = row.security.replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
  const ticker =
    words.length >= 2
      ? (words[0]!.slice(0, 2) + words[1]!.slice(0, 2)).toUpperCase()
      : words[0]!.slice(0, 4).toUpperCase();
  return {
    ticker,
    isin: `XS${hashId(row.id).toString().padStart(10, "0").slice(0, 10)}`,
    sector: ASSET_CLASS_OPTIONS.find((o) => o.id === getHoldingAssetClass(row))?.label ?? "Equity",
  };
}

function parsePortfolioNames(heldIn: string): string[] {
  if (!heldIn.trim()) return ["Consolidated"];
  if (/^\d+\s*portfolio/i.test(heldIn)) {
    return [
      "Advisory – Global Balanced",
      "Execution US",
      "Trust – Thomas Family",
      "Retirement – Primary",
    ];
  }
  if (heldIn === "Retirement – Primary, Children") {
    return ["Retirement – Primary", "Retirement – Children"];
  }
  return heldIn.split(",").map((p) => p.trim()).filter(Boolean);
}

function splitWeights(count: number, seed: number): number[] {
  const raw = Array.from({ length: count }, (_, i) => 1 + ((seed + i * 17) % 40));
  const sum = raw.reduce((a, b) => a + b, 0);
  return raw.map((w) => w / sum);
}

/** Consolidated holding snapshot — portfolio-specific detail lives in portfolio view */
export function getHoldingDetail(row: HoldingRow): HoldingDetail {
  const meta = SECURITY_META[row.id] ?? fallbackMeta(row);
  const assetClassLabel =
    ASSET_CLASS_OPTIONS.find((o) => o.id === getHoldingAssetClass(row))?.label ?? "Equity";
  const h = hashId(row.id);

  const isCash = row.id === "cash";
  const quantity = isCash
    ? row.valueUsd
    : Math.max(1, Math.round(row.valueUsd / (80 + (h % 400))));
  const lastPrice = isCash ? 1 : row.valueUsd / quantity;

  const unrealizedGlPct = Number((row.ytdPct * 0.72 + ((h % 11) - 5) * 0.35).toFixed(2));
  const costBasis = row.valueUsd / (1 + unrealizedGlPct / 100);
  const unrealizedGlUsd = row.valueUsd - costBasis;
  const avgCost = costBasis / quantity;

  const dayChangePct = Number((((h % 200) - 100) / 40).toFixed(2));
  const dayChangeUsd = (row.valueUsd * dayChangePct) / 100;

  const portfolioNames = parsePortfolioNames(row.heldIn);
  const weights = splitWeights(portfolioNames.length, h);
  const portfolioSlices: HoldingPortfolioSlice[] = portfolioNames.map((name, i) => {
    const valueUsd = row.valueUsd * weights[i]!;
    const qty = isCash ? valueUsd : Math.round(quantity * weights[i]!);
    const portfolioPct = Number((3 + ((h + i * 7) % 18)).toFixed(1));
    return {
      portfolioName: name,
      quantity: qty,
      valueUsd: Number(valueUsd.toFixed(2)),
      portfolioPct,
    };
  });

  return {
    ticker: meta.ticker,
    isin: meta.isin,
    assetClassLabel,
    sector: meta.sector,
    lastPrice: Number(lastPrice.toFixed(2)),
    dayChangePct,
    dayChangeUsd: Number(dayChangeUsd.toFixed(2)),
    quantity,
    avgCost: Number(avgCost.toFixed(isCash ? 4 : 2)),
    costBasis: Number(costBasis.toFixed(2)),
    unrealizedGlUsd: Number(unrealizedGlUsd.toFixed(2)),
    unrealizedGlPct,
    guidelineLimitPct: 5,
    portfolioSlices,
  };
}
