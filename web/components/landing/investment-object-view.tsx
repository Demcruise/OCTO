"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { EventLog } from "@/components/octo/event-log";
import { DUR, EASE, Pill, type PillTone, Reveal, SampleLabel, Section, SectionHeader, focusRing, useTabs } from "./primitives";

const META = [
  ["Type", "Buyout fund · 2019"],
  ["Ownership", "Majority · avg. 64%"],
  ["Geography", "North America"],
  ["Stage", "Value creation"],
  ["Status", "Current"],
  ["Latest valuation", "24 Sep 2026"],
] as const;

const TABS = ["Overview", "Metrics", "Documents", "Workflow", "Audit"] as const;

const label = "font-data text-[10px] uppercase tracking-[0.1em] text-ink-3";

function Module({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section aria-label={title} className={cn("border-line p-4", className)}>
      <p className={label}>{title}</p>
      <div className="mt-2">{children}</div>
    </section>
  );
}

const rows = (items: [string, string, PillTone?][]) => (
  <ul className="divide-y divide-line">
    {items.map(([a, b, tone]) => (
      <li key={a} className="flex items-center justify-between gap-3 py-1.5 text-[13px]">
        <span className="min-w-0 truncate text-ink">{a}</span>
        {tone ? (
          <Pill tone={tone} dot>
            {b}
          </Pill>
        ) : (
          <span className="shrink-0 font-data text-[12px] text-ink-3">{b}</span>
        )}
      </li>
    ))}
  </ul>
);

function Overview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6">
      <Module title="Performance" className="border-b md:col-span-6">
        <dl className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
          {[
            ["Gross IRR", "21.8%"],
            ["TVPI", "2.70x"],
            ["MOIC", "2.55x"],
            ["DPI", "0.68x"],
          ].map(([k, v]) => (
            <div key={k} className="bg-canvas py-2 pr-3">
              <dt className="text-xs text-ink-3">{k}</dt>
              <dd className="mt-0.5 text-2xl font-medium tabular-nums tracking-tight">{v}</dd>
            </div>
          ))}
        </dl>
        <svg aria-hidden viewBox="0 0 600 70" preserveAspectRatio="none" className="mt-3 h-14 w-full">
          <polyline points="0,62 75,58 150,52 225,47 300,38 375,33 450,24 525,17 600,10" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <polyline points="0,64 75,61 150,58 225,55 300,51 375,48 450,44 525,41 600,38" fill="none" stroke="var(--color-line-strong)" strokeWidth="1" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
        </svg>
        <p className="font-data text-[10px] text-ink-3">NAV vs. public-market benchmark · Q4 24 – Q3 26</p>
      </Module>
      <Module title="Thesis" className="border-b md:col-span-3 md:border-r">
        <p className="text-[13px] leading-relaxed text-ink-2">
          Consolidate North American precision-components suppliers; margin expansion through procurement and pricing discipline.
        </p>
      </Module>
      <Module title="Risks" className="border-b md:col-span-3">
        {rows([
          ["Input-cost inflation", "Medium", "warn"],
          ["Customer concentration · Brightline", "Low", "ok"],
          ["Refinancing 2027", "Medium", "warn"],
        ])}
      </Module>
      <Module title="Linked documents" className="border-b md:col-span-2 md:border-b-0 md:border-r">
        <ul className="space-y-1.5">
          {["Q2 valuation report", "Q3 LP report draft", "IC memo · 2019"].map((d) => (
            <li key={d} className="flex items-center gap-2 text-[13px] text-ink">
              <FileText aria-hidden className="size-3.5 text-ink-3" />
              {d}
            </li>
          ))}
        </ul>
      </Module>
      <Module title="Open tasks" className="border-b md:col-span-2 md:border-b-0 md:border-r">
        {rows([
          ["Q3 valuation sign-off", "Due 3 Oct"],
          ["Refresh market comps", "Stale"],
          ["LP report review", "Due 10 Oct"],
        ])}
      </Module>
      <Module title="IC history" className="md:col-span-2">
        {rows([
          ["Keller Tooling follow-on", "Mar 2022"],
          ["Keller Tooling entry", "Jun 2021"],
          ["Meridian entry", "Oct 2019"],
        ])}
      </Module>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-subtle px-4 py-3 md:col-span-6">
        <p className="text-[13px] text-ink">
          <span className={label}>Data lineage · </span> Gross IRR 21.84% resolves to 48 ledger events and 12 valuations.
        </p>
        <a href="#lineage" className={cn("inline-flex min-h-9 items-center gap-1.5 text-[13px] font-medium text-accent hover:text-accent-hover", focusRing)}>
          Trace source <ArrowRight aria-hidden className="size-3.5" />
        </a>
      </div>
    </div>
  );
}

function Table({ head, body }: { head: string[]; body: (string | { tone: PillTone; text: string })[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-left text-[13px]">
        <thead className="border-b border-line">
          <tr>
            {head.map((h, i) => (
              <th key={h} scope="col" className={cn("px-4 py-2 font-data text-[10px] font-normal uppercase tracking-[0.1em] text-ink-3", i === head.length - 1 && "text-right")}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {body.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} className={cn("px-4 py-2.5", j === 0 ? "font-medium text-ink" : "text-ink-2", j === r.length - 1 && "text-right", j > 0 && typeof c === "string" && /[\d$%]/.test(c) && "font-data tabular-nums")}>
                  {typeof c === "string" ? c : <Pill tone={c.tone} dot>{c.text}</Pill>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const PANELS: Record<(typeof TABS)[number], React.ReactNode> = {
  Overview: <Overview />,
  Metrics: (
    <Table
      head={["Metric", "Value", "Definition", "Source"]}
      body={[
        ["Gross IRR", "21.84%", "v3.2", "IBOR · 48 events"],
        ["Net IRR", "17.9%", "v3.2", "IBOR · after fees"],
        ["TVPI", "2.70x", "v2.0", "IBOR"],
        ["DPI", "0.68x", "v2.0", "IBOR"],
        ["RVPI", "2.02x", "v2.0", "Q3 valuation"],
        ["MOIC", "2.55x", "v1.1", "Q3 valuation"],
      ]}
    />
  ),
  Documents: (
    <Table
      head={["Document", "Type", "Linked to", "Received"]}
      body={[
        ["Q2 valuation report", "Valuation", "12 companies", "14 Jul 2026"],
        ["Q3 LP report", "Report · draft", "Fund", "29 Sep 2026"],
        ["Capital account statements", "Administrator", "38 LPs", "30 Sep 2026"],
        ["IC memo · Keller Tooling", "Committee", "Investment", "12 May 2021"],
      ]}
    />
  ),
  Workflow: (
    <Table
      head={["Item", "Owner", "Due", "State"]}
      body={[
        ["Q3 valuation sign-off", "Valuation committee", "3 Oct", { tone: "warn", text: "2 of 3" }],
        ["Refresh market comps", "Analyst", "Overdue", { tone: "danger", text: "Stale" }],
        ["Q3 LP report review", "Investor relations", "10 Oct", { tone: "accent", text: "Drafted by AI" }],
        ["Distribution notice", "Fund accounting", "26 Sep", { tone: "ok", text: "Complete" }],
      ]}
    />
  ),
  Audit: (
    <div className="p-4">
      <EventLog
        label="Fund audit trail"
        events={[
          { time: "30 Sep", event: "Valuation approved", detail: "Valuation committee · 2 of 3", actor: "person", emphasis: true },
          { time: "29 Sep", event: "LP report drafted", detail: "3 sources cited · draft", actor: "ai" },
          { time: "26 Sep", event: "Distribution recorded", detail: "$6.8M · fund administrator", actor: "system" },
          { time: "24 Sep", event: "Fair values proposed", detail: "12 companies · Q3", actor: "person" },
        ]}
      />
    </div>
  ),
};

/** Investment object view as a real product surface (PAL-014, PAL-041). */
export function InvestmentObjectView() {
  const { active, onKeyDown, tabProps } = useTabs(TABS.length);
  const reduce = useReducedMotion();
  const tab = TABS[active];

  return (
    <Section id="object-view" labelledBy="object-title">
      <SectionHeader
        id="object-title"
        index="06"
        eyebrow="Object view"
        title="Everything about an investment, in one view."
        lead="Performance, thesis, risks, documents, tasks, committee history, and lineage — read from the same record, one click from its source."
      />

      <Reveal className="mt-16 overflow-hidden rounded-sm border border-line-strong bg-canvas">
        <div className="flex items-center justify-between border-b border-line bg-subtle px-4 py-2.5">
          <p className="truncate font-data text-[11px] text-ink-2">octo / funds / us-manufacturing-iii</p>
          <SampleLabel className="shrink-0">Demo environment</SampleLabel>
        </div>

        <div className="border-b border-line px-5 py-5">
          <p className="font-data text-meta uppercase text-accent">Fund</p>
          <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
            <h3 className="text-h3 font-medium">US Manufacturing III</h3>
            <a href="#ibor" className={cn("inline-flex min-h-10 items-center gap-2 bg-ink px-4 text-[13px] font-medium text-white hover:bg-ink-2", focusRing)}>
              View ledger <ArrowRight aria-hidden className="size-3.5" />
            </a>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-6">
            {META.map(([k, v]) => (
              <div key={k}>
                <dt className={label}>{k}</dt>
                <dd className={cn("mt-0.5 text-[13px]", k === "Status" ? "text-ok" : "text-ink")}>{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-col md:flex-row">
          <div
            role="tablist"
            aria-label="Object sections"
            onKeyDown={onKeyDown}
            className="no-scrollbar flex shrink-0 overflow-x-auto border-b border-line md:w-48 md:flex-col md:border-b-0 md:border-r md:py-2"
          >
            {TABS.map((t, i) => (
              <button
                key={t}
                {...tabProps(i)}
                id={`ov-tab-${t}`}
                aria-controls="ov-panel"
                className={cn(
                  "min-h-11 shrink-0 border-b-2 px-4 text-left text-[13px] transition-colors md:border-b-0 md:border-l-2",
                  i === active ? "border-accent text-ink" : "border-transparent text-ink-3 hover:text-ink",
                  focusRing,
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <div id="ov-panel" role="tabpanel" aria-labelledby={`ov-tab-${tab}`} className="min-h-[420px] min-w-0 flex-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: DUR.standard, ease: EASE }}
              >
                {PANELS[tab]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
