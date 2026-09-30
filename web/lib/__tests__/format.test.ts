import { describe, expect, it } from "vitest";
import { ago, date, dateRange, dateTime, delta, money, moneyFull, multiple, num, pct } from "../format";

describe("money", () => {
  it("compacts to one decimal by default", () => {
    expect(money(812.4e6)).toBe("$812.4M");
    expect(money(1.24e9, 2)).toBe("$1.24B");
    expect(money(428_400)).toBe("$428.4K");
  });
  it("wraps negatives in parentheses", () => {
    expect(money(-31.8e6)).toBe("($31.8M)");
  });
  it("uses Indonesian units and decimal comma", () => {
    expect(money(812.4e6, 1, "id")).toBe("$812,4Jt");
    expect(money(1.24e9, 2, "id")).toBe("$1,24M");
  });
});

describe("moneyFull", () => {
  it("keeps full precision with separators", () => {
    expect(moneyFull(486_213_400)).toBe("$486,213,400");
    expect(moneyFull(486_213_400, "id")).toBe("$486.213.400");
    expect(moneyFull(-7_500)).toBe("($7,500)");
  });
});

describe("ratios", () => {
  it("formats percentages and multiples", () => {
    expect(pct(18.2)).toBe("18.2%");
    expect(pct(18.2, 1, "id")).toBe("18,2%");
    expect(multiple(1.64)).toBe("1.64×");
    expect(num(-3, 0)).toBe("−3");
  });
});

describe("delta", () => {
  it("always signs, with a real minus", () => {
    expect(delta(3.2)).toBe("+3.2%");
    expect(delta(-0.4, "pts")).toBe("−0.4 pts");
    expect(delta(0.05, "×")).toBe("+0.05×");
    expect(delta(42e6, "$")).toBe("+$42.0M");
    expect(delta(0)).toBe("±0.0%");
  });
});

describe("dates", () => {
  const iso = "2026-09-30T13:42:00Z";
  it("formats absolute dates in UTC", () => {
    expect(date(iso)).toBe("30 Sep 2026");
    expect(date("2026-05-02T00:00:00Z", "id")).toBe("2 Mei 2026");
    expect(dateTime(iso)).toBe("30 Sep 2026, 13:42");
  });
  it("collapses a shared year in ranges", () => {
    expect(dateRange("2026-07-01T00:00:00Z", iso)).toBe("1 Jul – 30 Sep 2026");
    expect(dateRange("2025-12-01T00:00:00Z", iso)).toBe("1 Dec 2025 – 30 Sep 2026");
  });
  it("describes recent times relatively", () => {
    const now = new Date(iso);
    expect(ago("2026-09-30T11:42:00Z", now)).toBe("2h ago");
    expect(ago("2026-09-30T11:42:00Z", now, "id")).toBe("2 jam lalu");
    expect(ago("2026-09-01T00:00:00Z", now)).toBe("1 Sep 2026");
  });
});
