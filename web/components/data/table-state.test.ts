import { describe, expect, it } from "vitest";
import { decodeView, encodeView, facetOptions, filterRows, groupRows, nextSort, orderColumns, sortRows, toCsv, type ColumnLogic, type ViewState } from "./table-state";

type Row = { name: string; fund: string; nav: number; sev: string | null };
const rows: Row[] = [
  { name: "Helios", fund: "Flagship II", nav: 70, sev: "critical" },
  { name: "Kirana", fund: "Flagship II", nav: 80, sev: "high" },
  { name: "Meridian", fund: "Flagship I", nav: 50, sev: null },
  { name: "Arcadia", fund: "Flagship II", nav: 70, sev: "low" },
];
const rank: Record<string, number> = { critical: 0, high: 1, low: 3 };
const cols: ColumnLogic<Row>[] = [
  { id: "name", header: "Name", value: (r) => r.name },
  { id: "fund", header: "Fund", value: (r) => r.fund, facet: true },
  { id: "nav", header: "NAV", value: (r) => r.nav },
  { id: "sev", header: "Severity", value: (r) => r.sev, sortValue: (r) => (r.sev ? rank[r.sev] : 99), facet: true },
];

describe("filterRows", () => {
  it("combines text search and facets", () => {
    expect(filterRows(rows, cols, "", { fund: ["Flagship II"] }).map((r) => r.name)).toEqual(["Helios", "Kirana", "Arcadia"]);
    expect(filterRows(rows, cols, "kir", { fund: ["Flagship II"] }).map((r) => r.name)).toEqual(["Kirana"]);
    expect(filterRows(rows, cols, "", { sev: ["—"] }).map((r) => r.name)).toEqual(["Meridian"]);
  });
});

describe("sortRows", () => {
  it("sorts by sortValue and keeps ties stable", () => {
    expect(sortRows(rows, cols, [{ id: "sev", desc: false }]).map((r) => r.name)).toEqual(["Helios", "Kirana", "Arcadia", "Meridian"]);
  });
  it("applies secondary sorts", () => {
    expect(sortRows(rows, cols, [{ id: "nav", desc: true }, { id: "name", desc: false }]).map((r) => r.name)).toEqual(["Kirana", "Arcadia", "Helios", "Meridian"]);
  });
});

describe("nextSort", () => {
  it("cycles asc → desc → off", () => {
    expect(nextSort([], "nav", false)).toEqual([{ id: "nav", desc: false }]);
    expect(nextSort([{ id: "nav", desc: false }], "nav", false)).toEqual([{ id: "nav", desc: true }]);
    expect(nextSort([{ id: "nav", desc: true }], "nav", false)).toEqual([]);
  });
  it("adds a secondary sort with shift", () => {
    expect(nextSort([{ id: "nav", desc: true }], "name", true)).toEqual([{ id: "nav", desc: true }, { id: "name", desc: false }]);
  });
});

describe("grouping and facets", () => {
  it("groups in sorted order", () => {
    const g = groupRows(rows, cols[1]);
    expect(g.map((x) => [x.key, x.rows.length])).toEqual([["Flagship II", 3], ["Flagship I", 1]]);
  });
  it("counts facet options", () => {
    expect(facetOptions(rows, cols[1])).toEqual([["Flagship I", 1], ["Flagship II", 3]]);
  });
});

describe("orderColumns", () => {
  it("keeps pinned columns first and appends unknown ids", () => {
    expect(orderColumns(cols, ["nav", "name"], ["fund"]).map((c) => c.id)).toEqual(["fund", "nav", "name", "sev"]);
  });
});

describe("view encoding", () => {
  it("round-trips a view", () => {
    const v: ViewState = { query: "Kirana — añadir", sort: [{ id: "nav", desc: true }], facets: { fund: ["Flagship II"] }, hidden: ["sev"], order: ["name"], pinned: ["name"], groupBy: "fund" };
    expect(decodeView(encodeView(v))).toEqual(v);
  });
  it("rejects garbage", () => {
    expect(decodeView("not-base64!!")).toBeNull();
  });
});

describe("toCsv", () => {
  it("quotes cells with commas and quotes", () => {
    expect(toCsv(["a", "b"], [["x,y", 'say "hi"'], [1, null]])).toBe('a,b\n"x,y","say ""hi"""\n1,');
  });
});
