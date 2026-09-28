"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { EventLog } from "@/components/octo/event-log";
import { SYSTEM_INDEX } from "@/lib/landing-content";
import { Pill, Reveal, SampleLabel, Section, focusRing } from "./primitives";

/* ── Control Panel module: the only product dashboard on the page. ── */

const PANEL_MODULES = [
  {
    title: "Alerts",
    rows: [
      ["Covenant headroom < 15%", "Atlas Components", "warn"],
      ["Market comps stale · 3 days", "US Manufacturing III", "warn"],
    ],
  },
  {
    title: "Approvals",
    rows: [
      ["Q3 valuation sign-off", "US Manufacturing III", "warn"],
      ["IC decision · Series C", "Acme Robotics", "neutral"],
    ],
  },
  {
    title: "Portfolio health",
    rows: [
      ["Gross IRR · US Mfg III", "21.8%", "ok"],
      ["DPI · Growth Fund II", "1.42x", "neutral"],
      ["Exceptions open", "15", "warn"],
    ],
  },
] as const;

function ControlPanelModule() {
  return (
    <div className="overflow-hidden border border-line-strong bg-canvas">
      <div className="flex items-center justify-between border-b border-line bg-subtle px-4 py-2.5">
        <p className="font-data text-[11px] text-ink-2">octo / control-panel</p>
        <SampleLabel>Demo environment</SampleLabel>
      </div>
      <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-3">
        {PANEL_MODULES.map((m) => (
          <section key={m.title} aria-label={m.title} className="bg-canvas p-5">
            <div className="flex items-baseline justify-between">
              <p className="font-data text-[10px] uppercase tracking-[0.1em] text-ink-3">{m.title}</p>
              <p className="font-data text-sm tabular-nums text-ink">{m.rows.length}</p>
            </div>
            <ul className="mt-3 divide-y divide-line">
              {m.rows.map(([text, meta, tone]) => (
                <li key={text} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="min-w-0 truncate text-[13px] text-ink">{text}</span>
                  <Pill tone={tone} dot>
                    {meta}
                  </Pill>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-px border-t border-line bg-line md:grid-cols-[1fr_2fr]">
        <div className="bg-canvas p-5">
          <p className="font-data text-[10px] uppercase tracking-[0.1em] text-ink-3">Open items</p>
          <p className="mt-2 text-4xl font-medium tracking-tight text-ink">23</p>
          <p className="mt-1 text-[13px] text-ink-3">Across your team · 8 assigned to you</p>
        </div>
        <div className="bg-canvas p-5">
          <p className="font-data text-[10px] uppercase tracking-[0.1em] text-ink-3">Recent activity</p>
          <EventLog
            className="mt-3"
            label="Recent activity"
            events={[
              { time: "14:02", event: "Q3 valuation approved", detail: "US Manufacturing III", actor: "person" },
              { time: "11:30", event: "Variance note drafted", detail: "Harbor Logistics · 4 sources", actor: "ai" },
              { time: "09:15", event: "Ingestion completed", detail: "Market data · 2,140 records", actor: "system" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Lineage module: metric → record → source → document. ── */

const CHAIN = [
  { k: "21.84%", label: "Gross IRR", detail: "Metric shown on the Q3 LP report." },
  { k: "Investment", label: "US Manufacturing III", detail: "Position held since 2019 · 12 portfolio companies." },
  { k: "IBOR event", label: "Q3 valuation", detail: "Approved 14:02 · supersedes v3 estimate." },
  { k: "Source", label: "Valuation model v4", detail: "Fund cash flows 2019–2026." },
  { k: "Document", label: "Q3 board pack", detail: "Page 14 · uploaded 26 Sep." },
];

function LineageModule() {
  const [active, setActive] = useState(0);
  return (
    <div className="flex h-full flex-col border border-line-strong bg-canvas">
      <div className="border-b border-line bg-subtle px-4 py-2.5">
        <p className="font-data text-[11px] text-ink-2">octo / lineage</p>
      </div>
      <div className="flex flex-1 flex-col justify-center p-5">
        <ol className="space-y-0" aria-label="Metric lineage">
          {CHAIN.map((n, i) => (
            <li key={n.k}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className={cn(
                  "flex w-full items-center gap-3 border px-3 py-2.5 text-left transition-colors",
                  active === i ? "border-accent bg-accent-soft" : "border-line bg-canvas hover:border-line-strong",
                  focusRing,
                )}
              >
                <span className={cn("font-data text-[10px] text-ink-3", active === i && "text-accent")}>{String(i + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-ink">{n.k}</span>
                  <span className="block truncate font-data text-[10px] uppercase tracking-[0.08em] text-ink-3">{n.label}</span>
                </span>
              </button>
              {i < CHAIN.length - 1 && <span aria-hidden className="ml-6 block h-3 w-px bg-line-strong" />}
            </li>
          ))}
        </ol>
        <p aria-live="polite" className="mt-4 border-t border-line pt-3 text-[13px] text-ink-2">
          {CHAIN[active].detail}
        </p>
      </div>
    </div>
  );
}

/* ── Object graph module: Fund → Company → Deal / Investment → Document. ── */

const GRAPH_NODES = [
  { id: "fund", label: "Fund", x: 130, y: 20 },
  { id: "company", label: "Company", x: 130, y: 84 },
  { id: "deal", label: "Deal", x: 60, y: 148 },
  { id: "investment", label: "Investment", x: 200, y: 148 },
  { id: "document", label: "Document", x: 130, y: 212 },
] as const;
const GRAPH_EDGES: [string, string][] = [
  ["fund", "company"],
  ["company", "deal"],
  ["company", "investment"],
  ["deal", "document"],
  ["investment", "document"],
];

function ObjectGraphModule() {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<string | null>(null);
  const pos = (id: string) => GRAPH_NODES.find((n) => n.id === id)!;
  return (
    <div className="flex h-full flex-col border border-line-strong bg-canvas">
      <div className="border-b border-line bg-subtle px-4 py-2.5">
        <p className="font-data text-[11px] text-ink-2">octo / ontology</p>
      </div>
      <svg viewBox="0 0 260 240" className="w-full flex-1" role="img" aria-label="Ontology: a fund connects to a company, which connects to a deal and an investment, both linking to a document">
        {GRAPH_EDGES.map(([a, b]) => {
          const hot = hover === a || hover === b;
          const A = pos(a);
          const B = pos(b);
          return (
            <motion.line
              key={`${a}-${b}`}
              x1={A.x}
              y1={A.y + 11}
              x2={B.x}
              y2={B.y - 11}
              stroke={hot ? "var(--color-accent)" : "var(--color-line-strong)"}
              strokeWidth="1"
              initial={reduce ? false : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          );
        })}
        {GRAPH_NODES.map((n) => (
          <g key={n.id} onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)} className="cursor-default">
            <rect x={n.x - 42} y={n.y - 11} width="84" height="22" fill="var(--color-canvas)" stroke={hover === n.id ? "var(--color-accent)" : "var(--color-line-strong)"} />
            <text x={n.x} y={n.y + 4} textAnchor="middle" className="font-data text-[9px] uppercase tracking-[0.08em]" fill="var(--color-ink-2)">
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/**
 * 03 — OCTO SYSTEM. Centered statement, the five-part index as a long list,
 * then the product modules: Control Panel, lineage, and the object graph.
 */
export function OctoSystem() {
  return (
    <Section id="system" labelledBy="system-title">
      {/* Centered statement — no label, no logo, no paragraph (V4-02). */}
      <Reveal className="mx-auto max-w-[1220px] text-center">
        <h2 id="system-title" className="text-statement font-normal text-balance">
          OCTO connects investment data, context, intelligence, and workflow in one governed system.
        </h2>
      </Reveal>

      <Reveal className="mt-20 md:mt-24" delay={0.05}>
        <p className="font-data text-meta uppercase tracking-[0.05em] text-ink-3">The OCTO system</p>
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {SYSTEM_INDEX.map((s) => (
            <li key={s.index}>
              <a href={s.href} className={cn("group flex items-start justify-between gap-6 py-8 md:min-h-[132px] md:py-9", focusRing)}>
                <span className="min-w-0">
                  <span className="block text-[clamp(1.625rem,2.5vw,2.5rem)] font-normal leading-tight tracking-tight text-ink transition-colors group-hover:text-accent">{s.name}</span>
                  <span className="mt-2 block max-w-lg text-lg leading-[1.4] text-ink-2">{s.description}</span>
                </span>
                <span className="mt-2 inline-flex shrink-0 items-center gap-1 font-data text-[12px] text-ink-3 transition-all group-hover:translate-x-1 group-hover:text-accent">
                  /0.{Number(s.index)} <ArrowUpRight aria-hidden className="size-3.5" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-16 md:mt-20" delay={0.05}>
        <div id="system-control">
          <ControlPanelModule />
        </div>
      </Reveal>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div id="system-record" className="lg:col-span-7">
          <Reveal className="h-full">
            <LineageModule />
          </Reveal>
        </div>
        <div id="system-graph" className="lg:col-span-5">
          <Reveal className="h-full" delay={0.05}>
            <ObjectGraphModule />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
