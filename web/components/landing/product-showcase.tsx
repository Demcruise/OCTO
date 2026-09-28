"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BarChart3, Briefcase, Building2, FileText, Gauge, Layers, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { DUR, EASE, Pill, type PillTone, Reveal, SampleLabel, Section, SectionHeader, focusRing, useTabs } from "./primitives";

type Cell = string | { pill: PillTone; text: string };
type View = {
  tab: string;
  nav: string;
  title: string;
  kpis: [string, string][];
  chart: { label: string; kind: "line" | "bars"; points: number[]; x: string[]; accent?: number };
  table: { head: string[]; right: number[]; rows: Cell[][] };
};

const QUARTERS = ["Q4 24", "Q1 25", "Q2 25", "Q3 25", "Q4 25", "Q1 26", "Q2 26", "Q3 26"];

const VIEWS: View[] = [
  {
    tab: "Portfolio",
    nav: "Portfolio",
    title: "Portfolio overview",
    kpis: [["Invested", "$1.82B"], ["Gross IRR", "18.4%"], ["TVPI", "2.31x"], ["DPI", "0.84x"]],
    chart: { label: "Net asset value · $B", kind: "line", points: [1.21, 1.28, 1.35, 1.41, 1.52, 1.58, 1.66, 1.74], x: QUARTERS },
    table: {
      head: ["Fund", "Vintage", "IRR", "TVPI"],
      right: [2, 3],
      rows: [
        ["US Manufacturing III", "2019", "21.4%", "2.7x"],
        ["Growth Fund II", "2021", "18.2%", "2.3x"],
        ["Growth Fund I", "2016", "16.9%", "2.1x"],
        ["Credit Opportunities I", "2022", "11.3%", "1.3x"],
      ],
    },
  },
  {
    tab: "Investment",
    nav: "Investments",
    title: "Atlas Components · Growth Fund II",
    kpis: [["Cost", "$86.0M"], ["Fair value", "$142.5M"], ["MOIC", "1.66x"], ["Gross IRR", "19.2%"]],
    chart: { label: "Fair value · $M", kind: "line", points: [86, 92, 101, 108, 117, 126, 134, 142.5], x: QUARTERS },
    table: {
      head: ["Date", "Event", "Source", "Amount"],
      right: [3],
      rows: [
        ["30 Sep 2026", "Valuation", "Q3 valuation report", "$142.5M"],
        ["18 Sep 2026", "Follow-on", "Capital call notice", "$4.2M"],
        ["30 Jun 2026", "Valuation", "Q2 valuation report", "$134.0M"],
        ["12 Mar 2026", "Dividend", "Fund administrator", "($1.1M)"],
      ],
    },
  },
  {
    tab: "Company",
    nav: "Companies",
    title: "Atlas Components",
    kpis: [["Revenue LTM", "$212M"], ["EBITDA LTM", "$38.4M"], ["EBITDA margin", "18.1%"], ["Net debt / EBITDA", "2.1x"]],
    chart: { label: "Quarterly EBITDA · $M", kind: "bars", points: [8.1, 8.6, 9.0, 9.2, 9.4, 9.8, 9.6, 9.6], x: QUARTERS },
    table: {
      head: ["Metric", "Period", "Source", "Value"],
      right: [3],
      rows: [
        ["Revenue", "Q3 2026", "Management accounts", "$54.2M"],
        ["EBITDA", "Q3 2026", "Management accounts", "$9.6M"],
        ["Net debt", "30 Sep 2026", "Lender report", "$80.6M"],
        ["Headcount", "Q3 2026", "HR export", "1,140"],
      ],
    },
  },
  {
    tab: "Control Panel",
    nav: "Control Panel",
    title: "Control panel",
    kpis: [["Open alerts", "7"], ["In review", "3"], ["Approvals due", "2"], ["Active rules", "24"]],
    chart: { label: "Alerts raised per week", kind: "bars", points: [4, 6, 3, 5, 8, 4, 6, 7], x: ["W32", "W33", "W34", "W35", "W36", "W37", "W38", "W39"] },
    table: {
      head: ["Rule", "Entity", "Raised", "State"],
      right: [3],
      rows: [
        ["Covenant headroom < 15%", "Atlas Components", "30 Sep", { pill: "warn", text: "Open" }],
        ["Valuation variance > 5% vs admin", "Growth Fund II", "29 Sep", { pill: "accent", text: "In review" }],
        ["Missing Q3 management accounts", "FN NYC", "28 Sep", { pill: "info", text: "Assigned" }],
        ["LP report ready for approval", "Growth Fund II", "27 Sep", { pill: "ok", text: "Approved" }],
      ],
    },
  },
  {
    tab: "Analytics",
    nav: "Analytics",
    title: "Look-through exposure",
    kpis: [["Industrials", "34%"], ["Technology", "22%"], ["Healthcare", "18%"], ["Consumer", "12%"]],
    chart: { label: "Exposure by sector · %", kind: "bars", points: [34, 22, 18, 12, 9, 5], x: ["Ind.", "Tech", "Health", "Cons.", "Fin.", "Other"], accent: 0 },
    table: {
      head: ["Metric", "Definition", "Owner", "Version"],
      right: [3],
      rows: [
        ["Net IRR", "XIRR(net cash flows, NAV)", "Finance", "v3.2"],
        ["TVPI", "(Distributions + NAV) / Paid-in", "Finance", "v2.0"],
        ["DPI", "Distributions / Paid-in", "Finance", "v2.0"],
        ["Look-through", "Σ holding × underlying weight", "Risk", "v1.4"],
      ],
    },
  },
];

const SIDEBAR = [
  { label: "Control Panel", icon: Gauge },
  { label: "Portfolio", icon: PieChart },
  { label: "Funds", icon: Layers },
  { label: "Investments", icon: Briefcase },
  { label: "Companies", icon: Building2 },
  { label: "Analytics", icon: BarChart3 },
  { label: "Reports", icon: FileText },
];

function ProductSidebar({ current }: { current: string }) {
  return (
    <nav aria-label="Product navigation (preview)" className="hidden w-52 shrink-0 border-r border-line bg-subtle p-2 lg:block">
      <p className="px-2 pb-3 pt-1 text-[13px] font-semibold tracking-[0.16em]">OCTO</p>
      <ul className="space-y-0.5">
        {SIDEBAR.map(({ label, icon: Icon }) => (
          <li
            key={label}
            aria-current={label === current ? "page" : undefined}
            className={cn("flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px]", label === current ? "bg-canvas font-medium text-ink shadow-[0_0_0_1px_var(--color-line)]" : "text-ink-3")}
          >
            <Icon aria-hidden className={cn("size-3.5", label === current && "text-accent")} />
            {label}
          </li>
        ))}
      </ul>
    </nav>
  );
}

function KpiStrip({ kpis }: { kpis: View["kpis"] }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line lg:grid-cols-4">
      {kpis.map(([k, v]) => (
        <div key={k} className="bg-canvas px-4 py-3">
          <dt className="text-xs text-ink-3">{k}</dt>
          <dd className="mt-1 text-xl font-semibold tabular-nums tracking-tight md:text-2xl">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function MiniChart({ chart }: { chart: View["chart"] }) {
  const W = 600;
  const H = 150;
  const pad = 8;
  const max = Math.max(...chart.points);
  const min = chart.kind === "line" ? Math.min(...chart.points) * 0.92 : 0;
  const n = chart.points.length;
  const x = (i: number) => pad + (i * (W - pad * 2)) / (n - 1);
  const y = (v: number) => H - pad - ((v - min) / (max - min)) * (H - pad * 2);
  const line = chart.points.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const bw = (W - pad * 2) / n;

  return (
    <figure className="rounded-lg border border-line p-4">
      <figcaption className="text-xs text-ink-3">{chart.label}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 h-28 w-full md:h-36" preserveAspectRatio="none" aria-hidden>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} className="stroke-line" strokeDasharray="2 4" vectorEffect="non-scaling-stroke" />
        ))}
        {chart.kind === "line" ? (
          <>
            <path d={`${line} L${x(n - 1)} ${H} L${x(0)} ${H} Z`} className="fill-accent/8" />
            <path d={line} fill="none" className="stroke-accent" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </>
        ) : (
          chart.points.map((v, i) => (
            <rect
              key={i}
              x={pad + i * bw + bw * 0.2}
              width={bw * 0.6}
              y={y(v)}
              height={H - pad - y(v)}
              rx="2"
              className={i === (chart.accent ?? n - 1) ? "fill-accent" : "fill-accent/35"}
            />
          ))
        )}
      </svg>
      <div className="mt-2 flex justify-between font-data text-[10px] text-ink-3">
        {chart.x.map((l, i) => (
          <span key={l} className={cn(chart.x.length > 6 && i % 2 === 1 && "hidden sm:inline")}>
            {l}
          </span>
        ))}
      </div>
    </figure>
  );
}

function DataTable({ table }: { table: View["table"] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full text-left text-[13px] sm:min-w-[520px]">
        <thead className="bg-subtle">
          <tr>
            {table.head.map((h, i) => (
              <th key={h} scope="col" className={cn("px-4 py-2 text-xs font-medium text-ink-3", table.right.includes(i) && "text-right", i === 1 && "hidden sm:table-cell")}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {table.rows.map((r, ri) => (
            <tr key={ri}>
              {r.map((c, ci) => (
                <td key={ci} className={cn("px-4 py-2.5", ci === 0 ? "font-medium text-ink" : "text-ink-2", table.right.includes(ci) && "text-right font-data tabular-nums", ci === 1 && "hidden sm:table-cell")}>
                  {typeof c === "string" ? c : <Pill tone={c.pill} dot>{c.text}</Pill>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Product proof: a coherent, deterministic OCTO interface (PRODUCT-001/002/003). */
export function ProductShowcase() {
  const { active, onKeyDown, tabProps } = useTabs(VIEWS.length);
  const reduce = useReducedMotion();
  const view = VIEWS[active];

  return (
    <Section id="product" labelledBy="product-title">
      <SectionHeader
        id="product-title"
        index="04"
        eyebrow="The product"
        title="One interface for the whole portfolio."
        lead="Portfolio, investments, companies, alerts, and analytics read from the same book of record, so every screen agrees with every other screen."
      />

      <Reveal className="mt-12">
        <div role="tablist" aria-label="Product views" onKeyDown={onKeyDown} className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          {VIEWS.map((v, i) => (
            <button
              key={v.tab}
              {...tabProps(i)}
              id={`product-tab-${i}`}
              aria-controls="product-panel"
              className={cn(
                "h-9 shrink-0 rounded-md border px-3.5 text-sm transition-colors",
                i === active ? "border-ink bg-ink text-white" : "border-line bg-canvas text-ink-2 hover:border-line-strong hover:text-ink",
                focusRing,
              )}
            >
              {v.tab}
            </button>
          ))}
        </div>

        <div id="product-panel" role="tabpanel" aria-labelledby={`product-tab-${active}`} className="mt-4 overflow-hidden rounded-xl border border-line-strong bg-canvas shadow-[0_20px_40px_-32px_rgb(17_19_24/0.28)]">
          <div className="flex items-center gap-3 border-b border-line bg-subtle px-4 py-2.5">
            <span aria-hidden className="flex gap-1.5">
              {[0, 1, 2].map((d) => (
                <span key={d} className="size-2.5 rounded-full bg-line-strong" />
              ))}
            </span>
            <p className="min-w-0 flex-1 truncate font-data text-[11px] text-ink-3">
              octo / {view.nav.toLowerCase().replace(" ", "-")}
            </p>
            <SampleLabel className="hidden sm:inline">Illustrative portfolio · as of 30 Sep 2026</SampleLabel>
          </div>

          <div className="flex min-h-[520px]">
            <ProductSidebar current={view.nav} />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={view.tab}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: DUR.standard, ease: EASE }}
                className="min-w-0 flex-1 space-y-4 p-4 md:p-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold tracking-tight">{view.title}</h3>
                  <SampleLabel className="sm:hidden">Sample data</SampleLabel>
                </div>
                <KpiStrip kpis={view.kpis} />
                <MiniChart chart={view.chart} />
                <DataTable table={view.table} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
