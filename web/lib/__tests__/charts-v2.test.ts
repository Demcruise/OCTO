import { describe, expect, it } from "vitest";
import { niceTicks, yGutter } from "@/components/chart/core";
import { BRIDGE, DEALS, FUNDS, buildDealEvents, fundBridge, fundCashFlows, navSeries, type NavRange } from "@/lib/demo";

describe("niceTicks (V2 NAV-006 axis safety)", () => {
  const cases: [number, number][] = [
    [612, 812.4], // currency, NAV
    [-12.5, 31.2], // negative percentages
    [0.12, 0.38], // small multiples
    [0, 1_250_000_000], // large numbers
    [740.2, 812.4],
  ];
  it.each(cases)("encloses [%d, %d]", (lo, hi) => {
    const t = niceTicks(lo, hi, 4);
    expect(t[0]).toBeLessThanOrEqual(lo);
    expect(t[t.length - 1]).toBeGreaterThanOrEqual(hi);
  });
});

describe("yGutter", () => {
  it("reserves 64 / 56 / 48px minimums by width", () => {
    expect(yGutter(["$8M"], 1200)).toBe(64);
    expect(yGutter(["$8M"], 600)).toBe(56);
    expect(yGutter(["$8M"], 360)).toBe(48);
  });
  it("grows for long labels without clipping", () => {
    expect(yGutter(["$1,250.0M"], 1200)).toBeGreaterThan(64);
  });
});

describe("navSeries (V2 NAV-003/005)", () => {
  const ranges: NavRange[] = ["daily", "weekly", "monthly", "quarterly", "yearly"];
  it.each(ranges)("%s ends at the reconciled $812.4M mark", (r) => {
    const s = navSeries(r);
    expect(s[s.length - 1].nav).toBe(812.4);
  });
  it.each(ranges.filter((r) => r !== "yearly"))("%s expanded shows deeper history", (r) => {
    expect(navSeries(r, undefined, true).length).toBeGreaterThan(navSeries(r).length);
  });
  it("labels weeks as ISO weeks", () => {
    expect(navSeries("weekly").at(-1)!.label).toMatch(/^W\d{1,2} ’26$/);
  });
});

describe("value bridges (V2 ANA-021)", () => {
  const sum = (b: { value: number; kind: string }[]) => b.slice(0, -1).reduce((n, x) => n + x.value, 0);
  it("portfolio bridge: opening + steps = closing", () => {
    expect(sum(BRIDGE)).toBeCloseTo(BRIDGE[BRIDGE.length - 1].value, 1);
  });
  it.each(FUNDS.map((f) => [f.short, f] as const))("%s bridge balances", (_, f) => {
    const b = fundBridge(f);
    expect(Math.abs(sum(b) - b[b.length - 1].value)).toBeLessThan(0.06);
  });
});

describe("fund cash flows", () => {
  it.each(FUNDS.map((f) => [f.short, f] as const))("%s: eight quarters of calls never exceed total called", (_, f) => {
    expect(fundCashFlows(f).reduce((n, c) => n + c.calls, 0) * 1e6).toBeLessThanOrEqual(f.called);
  });
});

describe("deal events (V2 DEAL-003)", () => {
  it("every deal has a sourcing event and events are date-ordered", () => {
    const ev = buildDealEvents(DEALS);
    for (const d of DEALS) expect(ev.some((e) => e.dealId === d.id && e.type === "Sourcing")).toBe(true);
    expect([...ev].sort((a, b) => a.date.localeCompare(b.date))).toEqual(ev);
  });
  it("stage moves change the shared schedule", () => {
    const moved = DEALS.map((d) => (d.id === "DL-0305" ? { ...d, stage: "IC Review" as const } : d));
    expect(buildDealEvents(moved).some((e) => e.dealId === "DL-0305" && e.type === "IC meeting")).toBe(true);
  });
});
