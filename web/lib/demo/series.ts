/**
 * Demo time series and derived aggregates. Allocation is computed from
 * INVESTMENTS so it always agrees with the holdings table.
 */

import { AS_OF, COMPANIES, FUNDS, INVESTMENTS, PORTFOLIO, companyById, type Fund } from "./entities";

export const QUARTERS = ["Q4 23", "Q1 24", "Q2 24", "Q3 24", "Q4 24", "Q1 25", "Q2 25", "Q3 25", "Q4 25", "Q1 26", "Q2 26", "Q3 26"];

/** Quarter-end portfolio NAV ($M) with a public-market benchmark rebased to the same start. */
export const NAV_SERIES = [612.0, 629.5, 648.1, 671.4, 698.0, 716.2, 731.0, 742.3, 760.1, 779.4, 787.0, 812.4].map((nav, i) => ({
  q: QUARTERS[i],
  nav,
  benchmark: Math.round(612 * Math.pow(1.021, i) * 10) / 10,
  called: [410, 438, 462, 489, 512, 531, 548, 560, 581, 598, 603, 644.8][i],
}));

/** Per-fund NAV path ($M) ending at each fund's current NAV. */
export function fundNavSeries(f: Fund) {
  const growth = f.netIrr / 100 / 4;
  const out: { q: string; nav: number }[] = [];
  let v = f.nav / 1e6;
  for (let i = QUARTERS.length - 1; i >= 0; i--) {
    out.unshift({ q: QUARTERS[i], nav: Math.round(v * 10) / 10 });
    v = v / (1 + growth + Math.sin(i * 1.7 + f.vintage) * 0.012);
  }
  return out;
}

/** Quarterly capital calls vs distributions ($M). */
export const CASH_FLOWS = [
  { q: "Q4 25", calls: 38, dists: 21 },
  { q: "Q1 26", calls: 44, dists: 18 },
  { q: "Q2 26", calls: 29, dists: 26 },
  { q: "Q3 26", calls: 42, dists: 31.8 },
];

export function fundCashFlows(f: Fund) {
  const scale = f.called / 644.8e6;
  return QUARTERS.slice(-8).map((q, i) => ({
    q,
    calls: Math.round((18 + ((i * 7 + f.vintage) % 13)) * scale * 10 * 10) / 10,
    dists: Math.round((f.distributions > 0 ? 6 + ((i * 5 + f.vintage) % 11) : 0) * scale * 10 * 10) / 10,
  }));
}

/** Q3 value-creation bridge ($M): 787.0 + 42.0 − 31.8 + 17.4 − 2.2 = 812.4 */
export const BRIDGE = [
  { label: "Opening NAV", value: 787.0, kind: "total" as const },
  { label: "Capital calls", value: 42.0, kind: "step" as const },
  { label: "Distributions", value: -31.8, kind: "step" as const },
  { label: "Valuation", value: 17.4, kind: "step" as const },
  { label: "FX", value: -2.2, kind: "step" as const },
  { label: "Closing NAV", value: 812.4, kind: "total" as const },
];

type Slice = { key: string; value: number; share: number };

function group(by: (companyId: string, fundId: string) => string): Slice[] {
  const m = new Map<string, number>();
  for (const i of INVESTMENTS) {
    const k = by(i.companyId, i.fundId);
    m.set(k, (m.get(k) ?? 0) + i.fairValue);
  }
  const total = [...m.values()].reduce((a, b) => a + b, 0);
  return [...m.entries()].map(([key, value]) => ({ key, value, share: (value / total) * 100 })).sort((a, b) => b.value - a.value);
}

const CURRENCY: Record<string, string> = { Indonesia: "IDR", Vietnam: "VND", Philippines: "PHP", Thailand: "THB", Malaysia: "MYR", Singapore: "SGD" };

export const ALLOCATION = {
  sector: group((c) => companyById(c)?.sector ?? "Other"),
  geography: group((c) => companyById(c)?.geography ?? "Other"),
  strategy: group((_, f) => FUNDS.find((x) => x.id === f)?.strategy ?? "Other"),
  fund: group((_, f) => FUNDS.find((x) => x.id === f)?.short ?? "Other"),
  currency: group((c) => CURRENCY[companyById(c)?.geography ?? ""] ?? "USD"),
};

/** Change in sector weight vs prior quarter (pts) — illustrative. */
export const EXPOSURE_CHANGE: Record<string, number> = {
  "Digital infrastructure": 1.8,
  Renewables: 0.9,
  Consumer: -1.4,
  Healthcare: 0.3,
  Industrials: -0.6,
  Fintech: -0.7,
  Education: 0.1,
  Technology: 0.4,
};

/** Company quarterly financials ($M) ending at the current LTM run rate. */
export function companyFinancials(companyId: string) {
  const c = companyById(companyId);
  if (!c || !c.revenue) return [];
  const qRev = c.revenue / 4 / 1e6;
  const g = c.revenueGrowth / 100 / 4;
  const margin = c.ebitda / c.revenue;
  return QUARTERS.slice(-8).map((q, i) => {
    const rev = qRev / Math.pow(1 + g, 7 - i);
    const m = margin * (1 + Math.sin(i * 1.3 + c.founded) * 0.06);
    return { q, revenue: Math.round(rev * 10) / 10, ebitda: Math.round(rev * m * 10) / 10, margin: Math.round(m * 1000) / 10 };
  });
}

/** Vintage comparison for fund pages: net IRR and TVPI by fund. */
export const VINTAGE = FUNDS.map((f) => ({ fund: f.short, vintage: f.vintage, irr: f.netIrr, tvpi: (f.distributions + f.nav) / f.called }));

/** Risk vs return scatter for analytics (x = IRR %, y = MOIC, r = FV). */
export const RISK_RETURN = INVESTMENTS.map((i) => {
  const c = companyById(i.companyId)!;
  return { id: i.id, label: c.name, x: i.irr, y: (i.fairValue + i.realized) / i.cost, r: i.fairValue, group: c.sector };
});

/** Monthly heatmap of valuation change by sector (%), last 6 months. */
export const MONTHS_6 = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
export const SECTOR_HEAT = [...new Set(COMPANIES.filter((c) => c.status !== "Exited").map((c) => c.sector))].slice(0, 8).map((sector, si) => ({
  sector,
  values: MONTHS_6.map((_, mi) => Math.round(Math.sin(si * 2.1 + mi * 0.9) * 30) / 10),
}));

export const PORTFOLIO_AS_OF = AS_OF;
export { PORTFOLIO };
