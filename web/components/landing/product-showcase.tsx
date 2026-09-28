"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BarChart3, Briefcase, Building2, FileText, Gauge, Layers, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { EvidenceList, type Evidence } from "@/components/octo/evidence-list";
import { DUR, EASE, Pill, type PillTone, Reveal, SampleLabel, Section, SectionHeader, focusRing, useTabs } from "./primitives";

type Cell = string | { pill: PillTone; text: string };
type Col = { label: string; right?: boolean; hideBelow?: "sm" | "md" | "lg" };
type Table = { caption: string; cols: Col[]; rows: Cell[][] };
type Chart = { label: string; kind: "line" | "bars"; points: number[]; x: string[]; accent?: number };
type ListBlock = { title: string; items: { primary: string; secondary: string; tone?: PillTone; tag?: string }[] };
type View = {
  tab: string;
  nav: string;
  title: string;
  kpis: [string, string][];
  facts?: [string, string, PillTone?][];
  why?: { label: string; evidence: Evidence[] };
  chart?: Chart;
  lists?: ListBlock[];
  table?: Table;
};

const QUARTERS = ["Q4 24", "Q1 25", "Q2 25", "Q3 25", "Q4 25", "Q1 26", "Q2 26", "Q3 26"];

const HIDE = { sm: "hidden sm:table-cell", md: "hidden md:table-cell", lg: "hidden lg:table-cell" } as const;

/* All figures are illustrative and formatted one way: $x.xM, IRR to one decimal, multiples to two (PROD-105). */
const VIEWS: View[] = [
  {
    tab: "Control Panel",
    nav: "Control Panel",
    title: "Control panel",
    kpis: [
      ["Alerts", "3"],
      ["Drafts", "2"],
      ["Tasks", "5"],
      ["Exceptions", "3"],
      ["Signals", "4"],
      ["Approvals", "2"],
    ],
    table: {
      caption: "Items needing action",
      cols: [{ label: "Item" }, { label: "Type", hideBelow: "sm" }, { label: "Entity", hideBelow: "md" }, { label: "State", right: true }],
      rows: [
        ["Covenant headroom < 15%", "Alert", "Atlas Components", { pill: "warn", text: "Open" }],
        ["Q3 variance explanation", "Draft", "Harbor Logistics", { pill: "accent", text: "Review" }],
        ["FX rate mismatch", "Exception", "Harbor Logistics", { pill: "warn", text: "Assigned" }],
        ["Request Q3 management accounts", "Task", "FN NYC", { pill: "info", text: "Due 3 Oct" }],
        ["Peer refinancing announced", "Signal", "Keller Tooling", { pill: "neutral", text: "New" }],
        ["Q3 LP report · Growth Fund II", "Approval", "Growth Fund II", { pill: "accent", text: "2 of 3" }],
      ],
    },
  },
  {
    tab: "Portfolio",
    nav: "Portfolio",
    title: "Portfolio overview",
    kpis: [
      ["Invested", "$1.82B"],
      ["Gross IRR", "18.4%"],
      ["TVPI", "2.31x"],
      ["Needs attention", "7"],
    ],
    chart: { label: "Net asset value · $B", kind: "line", points: [1.21, 1.28, 1.35, 1.41, 1.52, 1.58, 1.66, 1.74], x: QUARTERS },
    lists: [
      {
        title: "Companies requiring attention",
        items: [
          { primary: "Atlas Components", secondary: "Covenant headroom 12%", tone: "warn", tag: "Exception" },
          { primary: "Harbor Logistics", secondary: "EBITDA −8.2% QoQ", tone: "warn", tag: "Review" },
          { primary: "FN NYC", secondary: "Q3 accounts overdue", tone: "info", tag: "Task" },
        ],
      },
      {
        title: "Recent material changes",
        items: [
          { primary: "Valuation approved", secondary: "Growth Fund II · 30 Sep" },
          { primary: "FX adjustment posted", secondary: "Harbor Logistics · 29 Sep" },
          { primary: "Distribution $6.8M", secondary: "US Manufacturing III · 26 Sep" },
        ],
      },
    ],
  },
  {
    tab: "Fund",
    nav: "Funds",
    title: "US Manufacturing III",
    kpis: [
      ["Gross IRR", "21.8%"],
      ["TVPI", "2.70x"],
      ["MOIC", "2.55x"],
      ["Portfolio companies", "12"],
    ],
    facts: [
      ["Open items", "03"],
      ["Latest valuation", "24 Sep 2026"],
      ["Market comps", "Stale · updated 3 days ago", "warn"],
    ],
    why: {
      label: "Why 21.8% gross IRR?",
      evidence: [
        { ref: "1", title: "Fund cash flows 2019–2026 · 48 ledger events", kind: "IBOR", excerpt: "Calls $612.0M · distributions $418.6M · NAV $1,234.8M as of 30 Sep 2026." },
        { ref: "2", title: "Gross IRR definition v3.2", kind: "Metric", excerpt: "XIRR over fund-level cash flows and closing NAV, before fees and carry." },
        { ref: "3", title: "Q3 valuation report · 24 Sep 2026", kind: "Document", excerpt: "12 portfolio company fair values, approved by the valuation committee on 30 Sep." },
      ],
    },
    table: {
      caption: "Holdings",
      cols: [{ label: "Company" }, { label: "Entry", hideBelow: "sm" }, { label: "Cost", right: true, hideBelow: "md" }, { label: "Fair value", right: true }, { label: "MOIC", right: true }],
      rows: [
        ["Meridian Fluid Systems", "Oct 2019", "$52.5M", "$121.0M", "2.30x"],
        ["Keller Tooling", "Jun 2021", "$36.8M", "$96.4M", "2.80x"],
        ["Brightline Castings", "Mar 2020", "$41.2M", "$88.9M", "2.16x"],
      ],
    },
  },
  {
    tab: "Investment",
    nav: "Investments",
    title: "Investments",
    kpis: [
      ["Investments", "38"],
      ["Active", "34"],
      ["Realized", "4"],
      ["On watch", "3"],
    ],
    table: {
      caption: "Investment register",
      cols: [
        { label: "Investment", hideBelow: "lg" },
        { label: "Fund", hideBelow: "md" },
        { label: "Company" },
        { label: "Entry", hideBelow: "lg" },
        { label: "Current value", right: true },
        { label: "IRR", right: true, hideBelow: "sm" },
        { label: "TVPI", right: true, hideBelow: "sm" },
        { label: "Status", right: true },
      ],
      rows: [
        ["Buyout", "US Manufacturing III", "Keller Tooling", "Jun 2021", "$96.4M", "21.8%", "2.80x", { pill: "ok", text: "Performing" }],
        ["Series B", "Growth Fund II", "Atlas Components", "Mar 2023", "$142.5M", "19.2%", "1.66x", { pill: "warn", text: "On watch" }],
        ["Growth equity", "Growth Fund I", "FN NYC", "Apr 2018", "$54.0M", "17.3%", "2.21x", { pill: "ok", text: "Performing" }],
        ["Growth equity", "Growth Fund II", "Northgate Software", "Aug 2022", "$38.7M", "14.6%", "1.42x", { pill: "ok", text: "Performing" }],
        ["Buyout", "Growth Fund II", "Harbor Logistics", "Nov 2021", "$61.2M", "9.8%", "1.28x", { pill: "warn", text: "Exception" }],
      ],
    },
  },
  {
    tab: "Company",
    nav: "Companies",
    title: "Atlas Components",
    kpis: [
      ["Revenue LTM", "$212.0M"],
      ["EBITDA LTM", "$38.4M"],
      ["EBITDA margin", "18.1%"],
      ["Net debt / EBITDA", "2.10x"],
    ],
    chart: { label: "Quarterly EBITDA · $M", kind: "bars", points: [8.1, 8.6, 9.0, 9.2, 9.4, 9.8, 9.6, 9.6], x: QUARTERS },
    table: {
      caption: "Reported metrics",
      cols: [{ label: "Metric" }, { label: "Period", hideBelow: "sm" }, { label: "Source", hideBelow: "md" }, { label: "Value", right: true }],
      rows: [
        ["Revenue", "Q3 2026", "Management accounts", "$54.2M"],
        ["EBITDA", "Q3 2026", "Management accounts", "$9.6M"],
        ["Net debt", "30 Sep 2026", "Lender report", "$80.6M"],
        ["Headcount", "Q3 2026", "HR export", "1,140"],
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
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px]",
              label === current ? "bg-canvas font-medium text-ink shadow-[0_0_0_1px_var(--color-line)]" : "text-ink-3",
            )}
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
    <dl className={cn("grid gap-px overflow-hidden rounded-lg border border-line bg-line", kpis.length === 6 ? "grid-cols-3 lg:grid-cols-6" : "grid-cols-2 lg:grid-cols-4")}>
      {kpis.map(([k, v]) => (
        <div key={k} className="min-w-0 bg-canvas px-4 py-3">
          <dt className="truncate text-xs text-ink-3">{k}</dt>
          <dd className="mt-1 text-xl font-semibold tabular-nums tracking-tight md:text-2xl">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function MiniChart({ chart }: { chart: Chart }) {
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
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 h-24 w-full md:h-32" preserveAspectRatio="none" aria-hidden>
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

function DataTable({ table }: { table: Table }) {
  const cellCls = (c: Col) => cn(c.right && "text-right", c.hideBelow && HIDE[c.hideBelow]);
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full text-left text-[13px]">
        <caption className="sr-only">{table.caption}</caption>
        <thead className="bg-subtle">
          <tr>
            {table.cols.map((c) => (
              <th key={c.label} scope="col" className={cn("whitespace-nowrap px-4 py-2 text-xs font-medium text-ink-3", cellCls(c))}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {table.rows.map((r, ri) => (
            <tr key={ri}>
              {r.map((cell, ci) => {
                const col = table.cols[ci];
                return (
                  <td
                    key={ci}
                    className={cn(
                      "px-4 py-2.5",
                      ci === table.cols.findIndex((c) => !c.hideBelow) ? "min-w-40 font-medium text-ink" : "whitespace-nowrap text-ink-2",
                      col.right && typeof cell === "string" && "font-data tabular-nums",
                      cellCls(col),
                    )}
                  >
                    {typeof cell === "string" ? cell : <Pill tone={cell.pill} dot>{cell.text}</Pill>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Object facts plus a "why this number?" disclosure (PAL-005, PAL-008). */
function ObjectFacts({ facts, why }: { facts?: View["facts"]; why?: View["why"] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-line">
      {facts && (
        <dl className="grid grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {facts.map(([k, v, tone]) => (
            <div key={k} className="flex items-baseline justify-between gap-3 px-4 py-2.5 sm:block">
              <dt className="text-xs text-ink-3">{k}</dt>
              <dd className={cn("text-[13px] font-medium sm:mt-0.5", tone === "warn" ? "text-warn" : "text-ink")}>{v}</dd>
            </div>
          ))}
        </dl>
      )}
      {why && (
        <div className="border-t border-line px-4 py-3">
          <button
            type="button"
            aria-expanded={open}
            aria-controls="product-why"
            onClick={() => setOpen((v) => !v)}
            className={cn("inline-flex min-h-9 items-center gap-2 rounded-md text-[13px] font-medium text-accent hover:text-accent-hover", focusRing)}
          >
            {why.label} {open ? "Hide sources" : "Show sources"}
          </button>
          {open && (
            <div id="product-why" className="mt-2">
              <EvidenceList items={why.evidence} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Lists({ lists }: { lists: ListBlock[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {lists.map((l) => (
        <section key={l.title} aria-label={l.title} className="rounded-lg border border-line">
          <p className="border-b border-line bg-subtle px-4 py-2 text-xs font-medium text-ink-3">{l.title}</p>
          <ul className="divide-y divide-line">
            {l.items.map((it) => (
              <li key={it.primary} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-ink">{it.primary}</p>
                  <p className="truncate text-xs text-ink-3">{it.secondary}</p>
                </div>
                {it.tag && (
                  <Pill tone={it.tone} dot>
                    {it.tag}
                  </Pill>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** Product proof: one coherent OCTO interface across five surfaces (PROD-100..105). */
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
        title="Know what changed. Know why. Know what needs a decision."
        lead="The control panel, portfolio, fund, investment, and company views all read from the same book of record, so every screen agrees with every other screen."
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
                "min-h-11 shrink-0 rounded-md border px-3.5 text-sm transition-colors sm:min-h-9",
                i === active ? "border-ink bg-ink text-white" : "border-line bg-canvas text-ink-2 hover:border-line-strong hover:text-ink",
                focusRing,
              )}
            >
              {v.tab}
            </button>
          ))}
        </div>

        <div
          id="product-panel"
          role="tabpanel"
          aria-labelledby={`product-tab-${active}`}
          className="mt-4 overflow-hidden rounded-xl border border-line-strong bg-canvas shadow-[0_20px_40px_-32px_rgb(17_19_24/0.28)]"
        >
          <div className="flex items-center gap-3 border-b border-line bg-subtle px-4 py-2.5">
            <span aria-hidden className="flex gap-1.5">
              {[0, 1, 2].map((d) => (
                <span key={d} className="size-2 rounded-full bg-line-strong" />
              ))}
            </span>
            <p className="min-w-0 flex-1 truncate font-data text-[11px] text-ink-2">octo / {view.nav.toLowerCase().replace(" ", "-")}</p>
            <SampleLabel className="hidden sm:inline">Illustrative portfolio · as of 30 Sep 2026</SampleLabel>
          </div>

          <div className="flex min-h-[540px]">
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
                {(view.facts || view.why) && <ObjectFacts key={view.tab} facts={view.facts} why={view.why} />}
                {view.chart && <MiniChart chart={view.chart} />}
                {view.lists && <Lists lists={view.lists} />}
                {view.table && <DataTable table={view.table} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
