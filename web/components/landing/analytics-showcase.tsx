"use client";

import { Fragment, useState } from "react";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Pill, Reveal, SampleLabel, Section, SectionHeader, focusRing } from "./primitives";

type Fund = {
  id: string;
  name: string;
  irr: string;
  tvpi: string;
  moic: string;
  realized: string;
  unrealized: string;
  bench: string;
  nav: number[];
  holdings: [string, string, string][];
};

/* Paid-in: 612 + 510 + 598 + 100 = $1,820M. Realized + unrealized / paid-in reproduces each TVPI and the 2.31x total. */
const FUNDS: Fund[] = [
  {
    id: "usm3",
    name: "US Manufacturing III",
    irr: "21.8%",
    tvpi: "2.70x",
    moic: "2.55x",
    realized: "$418.6M",
    unrealized: "$1,234.8M",
    bench: "+9.1 pts",
    nav: [880, 930, 985, 1040, 1090, 1140, 1190, 1235],
    holdings: [["Meridian Fluid Systems", "$121.0M", "2.30x"], ["Keller Tooling", "$96.4M", "2.80x"], ["Brightline Castings", "$88.9M", "2.16x"]],
  },
  {
    id: "gf2",
    name: "Growth Fund II",
    irr: "18.2%",
    tvpi: "2.30x",
    moic: "2.12x",
    realized: "$214.2M",
    unrealized: "$958.8M",
    bench: "+5.5 pts",
    nav: [720, 760, 800, 845, 880, 915, 940, 959],
    holdings: [["Atlas Components", "$142.5M", "1.66x"], ["Harbor Logistics", "$61.2M", "1.28x"], ["Northgate Software", "$38.7M", "1.42x"]],
  },
  {
    id: "gf1",
    name: "Growth Fund I",
    irr: "16.9%",
    tvpi: "2.10x",
    moic: "1.98x",
    realized: "$487.3M",
    unrealized: "$768.5M",
    bench: "+4.2 pts",
    nav: [840, 830, 815, 805, 795, 785, 776, 769],
    holdings: [["FN NYC", "$54.0M", "2.21x"], ["Solace Health", "$73.4M", "1.94x"]],
  },
  {
    id: "coi",
    name: "Credit Opportunities I",
    irr: "11.3%",
    tvpi: "1.30x",
    moic: "1.26x",
    realized: "$41.0M",
    unrealized: "$89.0M",
    bench: "+1.8 pts",
    nav: [70, 74, 78, 81, 84, 86, 88, 89],
    holdings: [["Senior loan book", "$89.0M", "1.26x"]],
  },
];

const ALL = { irr: "18.4%", tvpi: "2.31x", moic: "2.18x", realized: "$1.16B", unrealized: "$3.05B", bench: "+6.2 pts" };
const EXPOSURE = [
  ["Industrials", 34],
  ["Technology", 22],
  ["Healthcare", 18],
  ["Consumer", 12],
  ["Financials", 9],
  ["Other", 5],
] as const;

function Line({ points, bench }: { points: number[]; bench: number[] }) {
  const all = [...points, ...bench];
  const max = Math.max(...all);
  const min = Math.min(...all) * 0.95;
  const path = (pts: number[]) => pts.map((v, i) => `${i ? "L" : "M"}${((i / (pts.length - 1)) * 600).toFixed(1)} ${(120 - ((v - min) / (max - min)) * 110).toFixed(1)}`).join(" ");
  return (
    <svg aria-hidden viewBox="0 0 600 125" preserveAspectRatio="none" className="h-32 w-full">
      {[30, 60, 90].map((y) => (
        <line key={y} x1="0" x2="600" y1={y} y2={y} stroke="var(--color-line)" vectorEffect="non-scaling-stroke" />
      ))}
      <path d={path(bench)} fill="none" stroke="var(--color-line-strong)" strokeWidth="1" strokeDasharray="4 3" vectorEffect="non-scaling-stroke" />
      <path d={path(points)} fill="none" stroke="var(--color-accent)" strokeWidth="1.75" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Dense analytics surface: filter, KPIs, benchmark, exposure, drill-down, save (PAL-017). */
export function AnalyticsShowcase() {
  const [fund, setFund] = useState<string>("all");
  const [open, setOpen] = useState<string | null>("usm3");
  const [saved, setSaved] = useState(false);
  const f = FUNDS.find((x) => x.id === fund);
  const k = f ?? ALL;
  const nav = f ? f.nav : FUNDS[0].nav.map((_, i) => FUNDS.reduce((s, x) => s + x.nav[i], 0));
  const bench = nav.map((v, i) => v * (0.9 + i * 0.004));

  return (
    <Section id="analytics" labelledBy="analytics-title">
      <SectionHeader
        id="analytics-title"
        index="09"
        eyebrow="Analytics"
        title="From data to decision without losing context."
        lead="Filter a fund, drill into its holdings, and trace any figure to its source — without exporting to a spreadsheet."
      />

      <Reveal className="mt-16 overflow-hidden rounded-sm border border-line-strong bg-canvas">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-subtle px-4 py-2.5">
          <p className="font-data text-[11px] text-ink-2">octo / analytics / portfolio · Q3 2026</p>
          <div className="flex items-center gap-3">
            <SampleLabel>Illustrative portfolio</SampleLabel>
            <button
              type="button"
              onClick={() => setSaved(true)}
              className={cn("inline-flex min-h-8 items-center gap-1.5 border px-2.5 text-[12px]", saved ? "border-ok/30 text-ok" : "border-line-strong text-ink hover:bg-canvas", focusRing)}
            >
              {saved ? <Check aria-hidden className="size-3" /> : null}
              {saved ? "Saved to workspace" : "Save analysis"}
            </button>
          </div>
        </div>

        <div role="radiogroup" aria-label="Fund filter" className="no-scrollbar flex overflow-x-auto border-b border-line">
          {[{ id: "all", name: "All funds" }, ...FUNDS].map((x) => (
            <button
              key={x.id}
              type="button"
              role="radio"
              aria-checked={fund === x.id}
              onClick={() => setFund(x.id)}
              className={cn(
                "min-h-11 shrink-0 border-b-2 px-4 text-[13px] transition-colors",
                fund === x.id ? "border-accent text-ink" : "border-transparent text-ink-3 hover:text-ink",
                focusRing,
              )}
            >
              {x.name}
            </button>
          ))}
        </div>

        <dl aria-live="polite" className="grid grid-cols-2 gap-px border-b border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
          {(
            [
              ["Gross IRR", k.irr],
              ["TVPI", k.tvpi],
              ["MOIC", k.moic],
              ["Realized", k.realized],
              ["Unrealized", k.unrealized],
              ["vs. benchmark", k.bench],
            ] as const
          ).map(([label, v]) => (
            <div key={label} className="bg-canvas px-4 py-3">
              <dt className="text-xs text-ink-3">{label}</dt>
              <dd className={cn("mt-0.5 text-xl font-medium tabular-nums tracking-tight", label === "vs. benchmark" && "text-ok")}>{v}</dd>
            </div>
          ))}
        </dl>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="min-w-0 border-b border-line lg:col-span-8 lg:border-b-0 lg:border-r">
            <div className="border-b border-line p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-ink-3">Net asset value · $M · Q4 24 – Q3 26</p>
                <p className="flex items-center gap-4 font-data text-[10px] text-ink-3">
                  <span className="flex items-center gap-1.5">
                    <span aria-hidden className="h-px w-4 bg-accent" /> {f ? f.name : "Portfolio"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span aria-hidden className="h-px w-4 border-t border-dashed border-ink-3" /> Public-market benchmark
                  </span>
                </p>
              </div>
              <Line points={nav} bench={bench} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-[13px]">
                <caption className="sr-only">Funds. Expand a fund to see its holdings.</caption>
                <thead className="border-b border-line">
                  <tr>
                    {["Fund", "Gross IRR", "TVPI", "MOIC", "vs. benchmark"].map((h, i) => (
                      <th key={h} scope="col" className={cn("px-4 py-2 font-data text-[10px] font-normal uppercase tracking-[0.1em] text-ink-3", i > 0 && "text-right")}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {FUNDS.map((x) => (
                    <Fragment key={x.id}>
                      <tr className={cn(fund === x.id && "bg-accent-soft")}>
                        <th scope="row" className="px-2 py-1.5 text-left font-medium">
                          <button
                            type="button"
                            aria-expanded={open === x.id}
                            onClick={() => setOpen(open === x.id ? null : x.id)}
                            className={cn("flex min-h-9 items-center gap-1.5 px-2 text-ink", focusRing)}
                          >
                            <ChevronRight aria-hidden className={cn("size-3.5 text-ink-3 transition-transform", open === x.id && "rotate-90")} />
                            {x.name}
                          </button>
                        </th>
                        <td className="px-4 text-right font-data tabular-nums">{x.irr}</td>
                        <td className="px-4 text-right font-data tabular-nums">{x.tvpi}</td>
                        <td className="px-4 text-right font-data tabular-nums">{x.moic}</td>
                        <td className="px-4 text-right font-data tabular-nums text-ok">{x.bench}</td>
                      </tr>
                      {open === x.id &&
                        x.holdings.map(([name, fv, moic]) => (
                          <tr key={name} className="bg-subtle">
                            <td className="py-2 pl-12 pr-4 text-ink-2">{name}</td>
                            <td className="px-4 text-right font-data text-[12px] text-ink-3" colSpan={2}>
                              FV {fv}
                            </td>
                            <td className="px-4 text-right font-data text-[12px] tabular-nums">{moic}</td>
                            <td className="px-4 text-right">
                              <a href="#lineage" className={cn("inline-flex min-h-8 items-center gap-1 text-[12px] text-accent hover:underline", focusRing)}>
                                Trace source <ArrowRight aria-hidden className="size-3" />
                              </a>
                            </td>
                          </tr>
                        ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-4">
            <section aria-label="Look-through exposure" className="border-b border-line p-4">
              <p className="text-xs text-ink-3">Look-through exposure · by sector</p>
              <ul className="mt-3 space-y-2">
                {EXPOSURE.map(([s, v]) => (
                  <li key={s} className="grid grid-cols-[92px_1fr_36px] items-center gap-3 text-[12px]">
                    <span className="text-ink-2">{s}</span>
                    <span className="h-1.5 bg-muted">
                      <span className="block h-full bg-accent" style={{ width: `${(v / 34) * 100}%` }} />
                    </span>
                    <span className="text-right font-data tabular-nums text-ink">{v}%</span>
                  </li>
                ))}
              </ul>
            </section>
            <section aria-label="Alerts" className="p-4">
              <p className="text-xs text-ink-3">Alerts</p>
              <ul className="mt-2 divide-y divide-line">
                {(
                  [
                    ["Covenant headroom < 15%", "Atlas Components", "warn"],
                    ["Valuation variance > 5%", "Growth Fund II", "accent"],
                    ["Market comps stale · 3 days", "US Manufacturing III", "warn"],
                  ] as const
                ).map(([a, o, t]) => (
                  <li key={a} className="flex items-center justify-between gap-3 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] text-ink">{a}</p>
                      <p className="text-[11px] text-ink-3">{o}</p>
                    </div>
                    <Pill tone={t} dot>
                      {t === "warn" ? "Needs review" : "In review"}
                    </Pill>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
