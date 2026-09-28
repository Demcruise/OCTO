"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DUR, EASE, Reveal, SampleLabel, Section, SectionHeader, focusRing } from "./primitives";

type Source = { name: string; short: string; where: string; value: string; outcome: "record" | "evidence" | "flagged" | "context"; note: string };

const SOURCES: Source[] = [
  { name: "CRM", short: "CRM", where: "Company record", value: "—", outcome: "context", note: "Links Atlas Components to its fund and deal team." },
  { name: "Fund administrator", short: "Fund admin", where: "Quarterly pack · 30 Jun", value: "$14.2M", outcome: "flagged", note: "Prior-quarter figure, kept for reconciliation." },
  { name: "Financial data", short: "Financial data", where: "Management accounts · 30 Sep", value: "$14.6M", outcome: "record", note: "Accepted as the Q3 figure of record." },
  { name: "Documents", short: "Documents", where: "Board deck · page 14", value: "$14.6M", outcome: "evidence", note: "Attached as supporting evidence for the record." },
  { name: "Spreadsheets", short: "Spreadsheets", where: "IC_model_v7_final.xlsx", value: "$14.9M", outcome: "flagged", note: "$0.3M above the record. Owner asked to reconcile." },
  { name: "Email / operating inputs", short: "Email", where: "CFO email · 2 Oct", value: "$14.4M", outcome: "flagged", note: "Superseded by the management accounts." },
];

const OUTCOME_LABEL = { record: "Record", evidence: "Evidence", flagged: "Flagged", context: "Context" } as const;
const OUTCOME_TONE = { record: "text-ok", evidence: "text-info", flagged: "text-warn", context: "text-ink-3" } as const;

const BEFORE = ["Multiple systems", "Multiple definitions", "Repeated reconciliation", "Context loss"];
const AFTER = ["One ontology", "One IBOR", "One governed workflow", "Traceable context"];

function Convergence({ selected }: { selected: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const show = reduce || inView;
  const rowY = (i: number) => 28 + i * 44;
  const target = { x: 276, y: 138 };

  return (
    <svg ref={ref} viewBox="0 0 480 276" className="h-auto w-full" aria-hidden>
      {SOURCES.map((s, i) => {
        const y = rowY(i);
        const on = i === selected;
        return (
          <g key={s.name}>
            <rect x="0.5" y={y - 13} width="116" height="26" rx="4" className={on ? "fill-accent-soft stroke-accent" : "fill-canvas stroke-line-strong"} />
            <text x="10" y={y + 4} className={cn("font-data text-[11px]", on ? "fill-accent" : "fill-ink-2")}>
              {s.short}
            </text>
            <motion.path
              d={`M117 ${y} C 200 ${y}, 220 ${target.y}, ${target.x} ${target.y}`}
              fill="none"
              className="stroke-accent"
              strokeWidth={on ? 1.75 : 1}
              initial={reduce ? false : { pathLength: 0, opacity: 0.2 }}
              animate={show ? { pathLength: 1, opacity: on ? 1 : 0.3 } : undefined}
              transition={{ duration: DUR.narrative, ease: EASE, delay: 0.1 + i * 0.06 }}
            />
          </g>
        );
      })}
      <motion.g initial={reduce ? false : { opacity: 0 }} animate={show ? { opacity: 1 } : undefined} transition={{ duration: DUR.complex, delay: 0.6 }}>
        <rect x={target.x} y={target.y - 52} width="200" height="104" rx="6" className="fill-canvas stroke-accent" />
        <text x={target.x + 14} y={target.y - 28} className="fill-accent font-data text-[10px] tracking-[0.08em]">
          OCTO · IBOR
        </text>
        <text x={target.x + 14} y={target.y - 8} className="fill-ink-3 text-[11px]">
          Q3 EBITDA · Atlas Components
        </text>
        <text x={target.x + 14} y={target.y + 18} className="fill-ink text-[22px] font-semibold tabular-nums">
          $14.6M
        </text>
        <text x={target.x + 14} y={target.y + 38} className="fill-ok font-data text-[10px]">
          ✓ reconciled · 3 flagged
        </text>
      </motion.g>
    </svg>
  );
}

/**
 * The problem, then the consolidation (PROB-100..103). Selecting a source shows
 * how OCTO treats it — accepted, attached as evidence, flagged, or used as
 * context — which is the mechanism, not decoration (EXP-002).
 */
export function Fragmentation() {
  const [selected, setSelected] = useState(4);
  const src = SOURCES[selected];

  return (
    <Section id="problem" tone="subtle" labelledBy="problem-title">
      <SectionHeader
        id="problem-title"
        index="01"
        eyebrow="The problem"
        title="Private markets run on too many versions of the truth."
        lead="Data lives across CRM, finance systems, documents, spreadsheets, and inboxes. OCTO brings it into one governed investment system — and shows you which version is the record."
      />

      <Reveal className="mt-14 grid grid-cols-1 overflow-hidden rounded-xl border border-line bg-canvas lg:grid-cols-2">
        <div className="border-b border-line p-5 md:p-8 lg:border-b-0 lg:border-r">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-medium text-ink">Before: one number, four answers</p>
            <SampleLabel>Illustrative</SampleLabel>
          </div>
          <p className="mt-1 text-[13px] text-ink-3">Q3 EBITDA · Atlas Components. Select a source.</p>
          <div role="radiogroup" aria-label="Sources" className="mt-5 divide-y divide-line border-y border-line">
            {SOURCES.map((s, i) => (
              <button
                key={s.name}
                type="button"
                role="radio"
                aria-checked={i === selected}
                onClick={() => setSelected(i)}
                className={cn(
                  "grid min-h-12 w-full grid-cols-[3px_1fr_auto] items-center gap-3 py-2 pr-1 text-left transition-colors hover:bg-subtle",
                  i === selected && "bg-accent-soft/60",
                  focusRing,
                )}
              >
                <span aria-hidden className={cn("h-8 w-[3px] rounded-full", i === selected ? "bg-accent" : "bg-transparent")} />
                <span className="min-w-0">
                  <span className="block text-sm text-ink">{s.name}</span>
                  <span className="block truncate font-data text-[11px] text-ink-3">{s.where}</span>
                </span>
                <span className={cn("font-data text-sm tabular-nums", s.value === "—" ? "text-ink-3" : "text-ink")}>{s.value}</span>
              </button>
            ))}
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2" aria-label="Before OCTO">
            {BEFORE.map((b) => (
              <li key={b} className="flex items-center gap-2 text-[13px] text-ink-2">
                <X aria-hidden className="size-3.5 shrink-0 text-danger" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col p-5 md:p-8">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-medium text-ink">With OCTO: one governed record</p>
            <SampleLabel>Illustrative</SampleLabel>
          </div>
          <p className="mt-1 text-[13px] text-ink-3">Sources stay where they are. OCTO reconciles them into one record.</p>
          <div className="mt-6 hidden flex-1 items-center sm:flex">
            <Convergence selected={selected} />
          </div>
          {/* Phones: the record card alone stays legible without the diagram. */}
          <div className="mt-5 rounded-md border border-accent px-4 py-3 sm:hidden">
            <p className="font-data text-[10px] tracking-[0.08em] text-accent">OCTO · IBOR</p>
            <p className="mt-1 text-xs text-ink-3">Q3 EBITDA · Atlas Components</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">$14.6M</p>
            <p className="mt-1 font-data text-[11px] text-ok">✓ reconciled · 3 flagged</p>
          </div>
          <p aria-live="polite" className="mt-4 rounded-md border border-dashed border-line-strong bg-subtle px-3 py-2.5 text-[13px] text-ink-2">
            <span className={cn("mr-2 font-data text-[10px] uppercase tracking-[0.08em]", OUTCOME_TONE[src.outcome])}>{OUTCOME_LABEL[src.outcome]}</span>
            <span className="font-medium text-ink">{src.name}:</span> {src.note}
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2" aria-label="With OCTO">
            {AFTER.map((a) => (
              <li key={a} className="flex items-center gap-2 text-[13px] text-ink">
                <Check aria-hidden className="size-3.5 shrink-0 text-ok" />
                {a}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
