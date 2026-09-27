"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DUR, EASE, Pill, Reveal, SampleLabel, Section, SectionHeader } from "./primitives";

const VERSIONS = [
  { source: "Fund administrator", where: "Quarterly pack · 30 Jun", value: "$14.2M" },
  { source: "Financial data feed", where: "Management accounts · 30 Sep", value: "$14.6M" },
  { source: "Documents", where: "Board deck · page 14", value: "$14.6M" },
  { source: "Spreadsheets", where: "IC_model_v7_final.xlsx", value: "$14.9M" },
  { source: "Inbox", where: "CFO email · 2 Oct", value: "$14.4M" },
  { source: "CRM", where: "Company record", value: "—" },
];

const CONSEQUENCES = ["Duplicated analysis", "Conflicting context", "Slower decisions"];

const SOURCES = ["CRM", "Fund admin", "Financial data", "Market feeds", "Documents", "Spreadsheets"];

function Convergence() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const show = reduce || inView;
  const rowY = (i: number) => 28 + i * 44;
  const target = { x: 300, y: 138 };

  return (
    <svg ref={ref} viewBox="0 0 480 276" className="h-auto w-full" role="img" aria-labelledby="converge-title">
      <title id="converge-title">Six sources converge into one governed OCTO record</title>
      {SOURCES.map((s, i) => {
        const y = rowY(i);
        return (
          <g key={s}>
            <rect x="0.5" y={y - 13} width="116" height="26" rx="4" className="fill-canvas stroke-line-strong" />
            <text x="10" y={y + 4} className="fill-ink-2 font-data text-[11px]">
              {s}
            </text>
            <motion.path
              d={`M117 ${y} C 200 ${y}, 220 ${target.y}, ${target.x} ${target.y}`}
              fill="none"
              className="stroke-accent"
              strokeWidth="1"
              initial={reduce ? false : { pathLength: 0, opacity: 0.2 }}
              animate={show ? { pathLength: 1, opacity: 0.7 } : undefined}
              transition={{ duration: DUR.large, ease: EASE, delay: 0.1 + i * 0.06 }}
            />
          </g>
        );
      })}
      <motion.g
        initial={reduce ? false : { opacity: 0 }}
        animate={show ? { opacity: 1 } : undefined}
        transition={{ duration: DUR.medium, delay: 0.6 }}
      >
        <rect x={target.x} y={target.y - 52} width="179" height="104" rx="6" className="fill-canvas stroke-accent" />
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
          ✓ reconciled · 2 flagged
        </text>
      </motion.g>
    </svg>
  );
}

/** The problem OCTO exists to solve, then the consolidation it performs (PROB-001/002). */
export function Fragmentation() {
  return (
    <Section id="problem" tone="subtle" labelledBy="problem-title">
      <SectionHeader
        id="problem-title"
        index="01"
        eyebrow="The problem"
        title={
"Private markets run on too many versions of the truth."
        }
        lead="CRMs, fund administrators, financial feeds, documents, spreadsheets, internal models, and inboxes each hold a piece of the investment lifecycle. None of them holds the whole record."
      />

      <Reveal className="mt-14 grid overflow-hidden rounded-xl border border-line bg-canvas lg:grid-cols-2">
        <div className="border-b border-line p-5 md:p-8 lg:border-b-0 lg:border-r">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-medium text-ink">Today: one number, four answers</p>
            <SampleLabel>Illustrative</SampleLabel>
          </div>
          <p className="mt-1 text-[13px] text-ink-3">Q3 EBITDA · Atlas Components</p>
          <ul className="mt-5 divide-y divide-line border-y border-line">
            {VERSIONS.map((v) => (
              <li key={v.source} className="grid grid-cols-[1fr_auto] items-center gap-4 py-2.5">
                <div className="min-w-0">
                  <p className="text-sm text-ink">{v.source}</p>
                  <p className="truncate font-data text-[11px] text-ink-3">{v.where}</p>
                </div>
                <p className={cn("font-data text-sm tabular-nums", v.value === "—" ? "text-ink-3" : "text-ink")}>{v.value}</p>
              </li>
            ))}
          </ul>
          <ol className="mt-6 flex flex-wrap items-center gap-2" aria-label="Consequences">
            {CONSEQUENCES.map((c, i) => (
              <li key={c} className="flex items-center gap-2">
                {i > 0 && <ArrowDown aria-hidden className="size-3.5 -rotate-90 text-ink-3" />}
                <Pill tone={i === CONSEQUENCES.length - 1 ? "warn" : "neutral"}>{c}</Pill>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col p-5 md:p-8">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-medium text-ink">With OCTO: one governed record</p>
            <SampleLabel>Illustrative</SampleLabel>
          </div>
          <p className="mt-1 text-[13px] text-ink-3">Sources stay where they are. OCTO reconciles them into a single investment system.</p>
          <div className="mt-6 flex flex-1 items-center">
            <Convergence />
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
