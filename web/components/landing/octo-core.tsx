"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { CORE_LAYERS, type CoreLayer } from "@/lib/landing-content";
import { ProductFrame } from "@/components/octo/product-frame";
import { EventLog } from "@/components/octo/event-log";
import { EvidenceList } from "@/components/octo/evidence-list";
import { DUR, EASE, Reveal, Section, SectionHeader, focusRing, useTabs } from "./primitives";

/* ---------- Layer visuals (CORE-102..105) ---------- */

type TreeNode = { label: string; kind: string; focus?: boolean; children?: TreeNode[] };

const TREE: TreeNode = {
  label: "Growth Fund II",
  kind: "Fund",
  children: [
    {
      label: "Series B · 2023",
      kind: "Investment",
      children: [
        {
          label: "Atlas Components",
          kind: "Company",
          focus: true,
          children: [
            { label: "Q3 2026 management accounts", kind: "Financials" },
            { label: "Board pack · 24 Sep 2026", kind: "Documents" },
          ],
        },
      ],
    },
    { label: "Northbridge Pension", kind: "LP" },
  ],
};

function TreeRow({ node, child }: { node: TreeNode; child?: boolean }) {
  return (
    <li className={cn("relative", child && "pl-5 last:after:absolute last:after:-left-px last:after:bottom-0 last:after:top-[16px] last:after:w-px last:after:bg-canvas")}>
      {child && <span aria-hidden className="absolute left-0 top-[15px] h-px w-3.5 bg-line-strong" />}
      <div className="flex items-center gap-3 py-1">
        <span className={cn("min-w-0 truncate", node.focus ? "font-medium text-accent" : "text-ink")}>{node.label}</span>
        <span className="ml-auto shrink-0 rounded-sm bg-muted px-1.5 text-[10px] uppercase tracking-[0.06em] text-ink-3">{node.kind}</span>
      </div>
      {node.children && (
        <ul className="ml-[7px] border-l border-line-strong">
          {node.children.map((c) => (
            <TreeRow key={c.label} node={c} child />
          ))}
        </ul>
      )}
    </li>
  );
}

const EXCEPTION_STEPS = [
  { label: "Detected", at: "09:12", who: "Reconciliation" },
  { label: "Assigned", at: "09:20", who: "Fund accounting" },
  { label: "Reviewed", at: "10:05", who: "Finance lead" },
  { label: "Resolved", at: "—", who: "Awaiting approval" },
];

const VISUALS: Record<CoreLayer["id"], React.ReactNode> = {
  ontology: (
    <ProductFrame path="ontology / growth-fund-ii" bodyClassName="p-4">
      <ul className="font-data text-[13px]">
        <TreeRow node={TREE} />
      </ul>
    </ProductFrame>
  ),
  ibor: (
    <ProductFrame path="ibor / events · 30 Sep 2026" bodyClassName="p-4">
      <EventLog
        label="Book of record events"
        events={[
          { time: "09:41", event: "Revenue updated", detail: "Atlas Components · management accounts", actor: "system" },
          { time: "09:44", event: "FX adjustment posted", detail: "Harbor Logistics · EUR/USD 1.0712", actor: "person" },
          { time: "10:02", event: "Valuation approved", detail: "Growth Fund II · Q3 fair value", actor: "person", emphasis: true },
          { time: "10:07", event: "IRR recalculated", detail: "Growth Fund II · 18.2% gross", actor: "system" },
        ]}
      />
    </ProductFrame>
  ),
  intelligence: (
    <ProductFrame path="intelligence / ask" bodyClassName="space-y-3 p-4">
      <div className="flex items-center gap-2 rounded-md border border-line-strong px-3 py-2 text-sm text-ink">
        <Search aria-hidden className="size-3.5 shrink-0 text-ink-3" />
        Why is Growth Fund II IRR down this quarter?
      </div>
      <p className="text-sm text-ink">
        Gross IRR fell from <span className="font-data tabular-nums">19.0%</span> to <span className="font-data tabular-nums">18.2%</span>, mainly from the
        Harbor Logistics markdown.
      </p>
      <EvidenceList
        items={[
          { ref: "1", title: "Q3 valuation · Harbor Logistics", kind: "IBOR event" },
          { ref: "2", title: "Board pack · 24 Sep 2026, p.14", kind: "Document" },
          { ref: "3", title: "Cash flows 2021–2026", kind: "Ledger" },
        ]}
      />
    </ProductFrame>
  ),
  workflow: (
    <ProductFrame path="workflow / exception-2291" bodyClassName="p-4">
      <p className="text-sm font-medium text-ink">FX rate mismatch · Harbor Logistics</p>
      <p className="text-[13px] text-ink-3">Administrator and record differ by $0.18M.</p>
      <ol className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Exception status">
        {EXCEPTION_STEPS.map((s, i) => {
          const done = i < 3;
          return (
            <li
              key={s.label}
              className={cn("rounded-md border p-2.5", i === 2 ? "border-accent-line bg-accent-soft" : done ? "border-line" : "border-dashed border-line-strong")}
            >
              <p className={cn("flex items-center gap-1 text-[13px] font-medium", done ? "text-ink" : "text-ink-3")}>
                {done && <Check aria-hidden className="size-3 text-ok" />}
                {s.label}
              </p>
              <p className="mt-0.5 font-data text-[10px] text-ink-3">
                {s.at} · {s.who}
              </p>
            </li>
          );
        })}
      </ol>
    </ProductFrame>
  ),
};

/** OCTO Core: four layers with a switcher (PENDLE-002, CORE-100/101). */
export function OctoCore() {
  const { active, onKeyDown, tabProps } = useTabs(CORE_LAYERS.length);
  const reduce = useReducedMotion();
  const layer = CORE_LAYERS[active];

  return (
    <Section id="core" labelledBy="core-title">
      <SectionHeader
        id="core-title"
        index="02"
        eyebrow="The OCTO core"
        title="One system. Four layers."
        lead="Context, truth, reasoning, and action. Each layer reads from the one below it, so an answer, a report, or an approval always rests on the same record."
      />

      <Reveal className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        <div
          role="tablist"
          aria-label="OCTO layers"
          onKeyDown={onKeyDown}
          className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:col-span-3 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0"
        >
          {CORE_LAYERS.map((l, i) => (
            <button
              key={l.id}
              {...tabProps(i)}
              id={`core-tab-${l.id}`}
              aria-controls="core-panel"
              className={cn(
                "group relative min-h-11 shrink-0 rounded-md border px-3 py-2.5 text-left transition-colors lg:rounded-none lg:border-0 lg:border-l-2 lg:px-5 lg:py-5",
                i === active ? "border-accent bg-accent-soft lg:bg-transparent" : "border-line hover:bg-subtle",
                focusRing,
              )}
            >
              <span className={cn("block font-data text-meta uppercase", i === active ? "text-accent" : "text-ink-3")}>
                {l.number} · {l.eyebrow}
              </span>
              <span className={cn("mt-1 block whitespace-nowrap text-[15px] font-medium lg:text-base", i === active ? "text-ink" : "text-ink-2 group-hover:text-ink")}>
                {l.label}
              </span>
            </button>
          ))}
        </div>

        <div id="core-panel" role="tabpanel" aria-labelledby={`core-tab-${layer.id}`} className="min-w-0 lg:col-span-9">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={layer.id}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: DUR.standard, ease: EASE }}
              className="grid grid-cols-1 gap-8 md:grid-cols-12"
            >
              <div className="md:col-span-5">
                <h3 className="text-2xl font-semibold tracking-tight">{layer.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{layer.description}</p>
                <ul className="mt-5 space-y-2">
                  {layer.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-ink">
                      <Check aria-hidden className="mt-0.5 size-3.5 shrink-0 text-accent" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="min-w-0 md:col-span-7">
                {VISUALS[layer.id]}
                <p className="mt-4 border-l-2 border-accent pl-3 text-sm text-ink-2">
                  <span className="font-data text-[10px] uppercase tracking-[0.08em] text-ink-3">What this enables · </span>
                  {layer.enables}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </Section>
  );
}
