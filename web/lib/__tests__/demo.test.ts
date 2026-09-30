import { describe, expect, it } from "vitest";
import { COMPANIES, DEALS, FUNDS, INVESTMENTS, PORTFOLIO, companyById, fundById } from "../demo/entities";

describe("demo dataset reconciles", () => {
  it("fund NAVs sum to $812.4M", () => {
    expect(Math.round(PORTFOLIO.nav / 1e5) / 10).toBe(812.4);
  });
  it("investment fair values plus cash equal each fund NAV", () => {
    for (const f of FUNDS) {
      const fv = INVESTMENTS.filter((i) => i.fundId === f.id).reduce((n, i) => n + i.fairValue, 0);
      expect(Math.abs(fv + f.cash - f.nav)).toBeLessThan(1);
    }
  });
  it("portfolio TVPI and DPI match the published KPIs", () => {
    expect(PORTFOLIO.tvpi.toFixed(2)).toBe("1.64");
    expect(PORTFOLIO.dpi.toFixed(2)).toBe("0.38");
  });
  it("every reference resolves", () => {
    for (const i of INVESTMENTS) {
      expect(companyById(i.companyId)).toBeDefined();
      expect(fundById(i.fundId)).toBeDefined();
    }
    for (const d of DEALS) expect(fundById(d.fundId)).toBeDefined();
    expect(new Set(COMPANIES.map((c) => c.id)).size).toBe(COMPANIES.length);
  });
});
