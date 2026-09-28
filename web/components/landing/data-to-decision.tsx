"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { EventLog } from "@/components/octo/event-log";
import { WORKFLOW_STORIES } from "@/lib/landing-content";
import { Pill, Reveal, SampleLabel, Section, SectionHeader, focusRing } from "./primitives";

const DURATION_MS = 7000;

/* Compact product surfaces — one per workflow step, all inside the fixed
 * viewport so selection never changes the frame (V4-06.7/8). */

function ScreenVisual() {
  const rows = [
    ["Acme Robotics", "Industrial automation", "92", "accent", "Screened"],
    ["Northline Foods", "Distribution", "78", "neutral", "In review"],
    ["Keller Tooling", "Precision manufacturing", "74", "neutral", "Queued"],
    ["Fernhill Packaging", "Materials", "61", "neutral", "Queued"],
  ] as const;
  return (
    <div className="p-5 md:p-8">
      <p className="font-data text-[10px] uppercase tracking-[0.1em] text-ink-3">Pipeline · screened against mandate</p>
      <table className="mt-4 w-full text-left">
        <thead>
          <tr className="border-b border-line font-data text-[10px] uppercase tracking-[0.1em] text-ink-3">
            <th className="py-2 pr-4 font-normal">Company</th>
            <th className="hidden py-2 pr-4 font-normal sm:table-cell">Sector</th>
            <th className="py-2 pr-4 font-normal">Screen score</th>
            <th className="py-2 font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, sector, score, tone, state], i) => (
            <motion.tr
              key={name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="border-b border-line last:border-0"
            >
              <td className="py-3 pr-4 text-[14px] font-medium text-ink">{name}</td>
              <td className="hidden py-3 pr-4 text-[13px] text-ink-3 sm:table-cell">{sector}</td>
              <td className="py-3 pr-4 font-data text-[13px] tabular-nums text-ink">{score}</td>
              <td className="py-3">
                <Pill tone={tone} dot>
                  {state}
                </Pill>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      <p className="mt-5 text-[13px] text-ink-3">Company, market, and document context connected per row.</p>
    </div>
  );
}

function DecideVisual() {
  return (
    <div className="p-5 md:p-8">
      <p className="font-data text-[10px] uppercase tracking-[0.1em] text-ink-3">IC memo · Acme Robotics</p>
      <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink">
        Recommend proceeding to confirmatory diligence. EBITDA bridge verified; customer concentration remains the open question.
      </p>
      <dl className="mt-6 divide-y divide-line border-y border-line">
        {[
          ["Evidence", "3 sources attached"],
          ["Model", "Q3 base case v4"],
          ["Comments", "2 open · diligence"],
          ["Approval", "Pending · deal lead"],
        ].map(([k, v], i) => (
          <motion.div key={k} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.06 }} className="flex items-center justify-between gap-4 py-3">
            <dt className="text-[14px] text-ink">{k}</dt>
            <dd className={cn("font-data text-[12px]", v.startsWith("Pending") ? "text-warn" : "text-ink-3")}>{v}</dd>
          </motion.div>
        ))}
      </dl>
    </div>
  );
}

function MonitorVisual() {
  const bars = [42, 55, 48, 63, 58, 71, 66, 80, 74];
  return (
    <div className="p-5 md:p-8">
      <p className="font-data text-[10px] uppercase tracking-[0.1em] text-ink-3">Portfolio · revenue trend</p>
      <div aria-hidden className="mt-6 flex h-36 items-end gap-2 border-b border-line pb-px">
        {bars.map((h, i) => (
          <motion.span
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            style={{ height: `${h}%`, transformOrigin: "bottom" }}
            className={cn("flex-1", i === bars.length - 1 ? "bg-accent" : "bg-[var(--octo-data-default)]")}
          />
        ))}
      </div>
      <div className="mt-6 divide-y divide-line border-y border-line">
        <div className="flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-[14px] font-medium text-ink">Covenant headroom &lt; 15%</p>
            <p className="truncate text-[12px] text-ink-3">Atlas Components</p>
          </div>
          <Pill tone="warn" dot>
            Exception
          </Pill>
        </div>
        <div className="flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-[14px] font-medium text-ink">Request Q3 management accounts</p>
            <p className="truncate text-[12px] text-ink-3">FN NYC · due 3 Oct</p>
          </div>
          <Pill tone="info" dot>
            Action
          </Pill>
        </div>
      </div>
    </div>
  );
}

function ReportVisual() {
  return (
    <div className="p-5 md:p-8">
      <p className="font-data text-[10px] uppercase tracking-[0.1em] text-ink-3">Q3 LP report · figure check</p>
      <div className="mt-5 flex flex-wrap items-center gap-2 font-data text-[12px] text-ink">
        {["21.84% Gross IRR", "Investment", "IBOR event", "Source", "Document"].map((s, i) => (
          <span key={s} className="flex items-center gap-2">
            <span className={cn("border px-2.5 py-1.5", i === 0 ? "border-accent bg-accent-soft" : "border-line bg-canvas")}>{s}</span>
            {i < 4 && <ArrowRight aria-hidden className="size-3.5 text-ink-3" />}
          </span>
        ))}
      </div>
      <EventLog
        className="mt-6"
        label="Report audit trail"
        events={[
          { time: "14:02", event: "Figure approved", detail: "Gross IRR · deal lead", actor: "person" },
          { time: "13:48", event: "Lineage resolved", detail: "Model v4 → board pack p.14", actor: "system" },
          { time: "13:31", event: "Report drafted", detail: "AI draft · 4 citations", actor: "ai" },
        ]}
      />
    </div>
  );
}

const VISUALS: Record<string, React.ReactNode> = {
  screen: <ScreenVisual />,
  decide: <DecideVisual />,
  monitor: <MonitorVisual />,
  report: <ReportVisual />,
};

/**
 * 06 — FROM DATA TO DECISION: vertical step list + fixed 560px preview
 * viewport with absolutely-positioned state panels (V4-06).
 */
export function DataToDecision() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const indexRef = useRef(0);
  const progressRef = useRef(0);
  const story = WORKFLOW_STORIES[index];

  const go = useCallback((next: number) => {
    indexRef.current = ((next % WORKFLOW_STORIES.length) + WORKFLOW_STORIES.length) % WORKFLOW_STORIES.length;
    progressRef.current = 0;
    setIndex(indexRef.current);
  }, []);

  useEffect(() => {
    if (reduce || paused) return;
    const id = window.setTimeout(() => go(indexRef.current + 1), DURATION_MS);
    return () => window.clearTimeout(id);
  }, [index, paused, reduce, go]);

  return (
    <Section id="decision" labelledBy="decision-title">
      <SectionHeader
        id="decision-title"
        index="05"
        eyebrow="From data to decision"
        title="From data to decision."
        lead="Connect investment data, context, intelligence, and workflow — and move from information to a governed decision."
      />

      <Reveal className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(300px,38%)_minmax(0,1fr)] lg:gap-16" delay={0.05}>
        {/* Step list — always a single vertical sequence (V4-06.3). */}
        <div role="group" aria-label="Workflow steps" className="order-2 divide-y divide-line border-y border-line lg:order-1">
          {WORKFLOW_STORIES.map((s, i) => (
            <button
              key={s.key}
              type="button"
              aria-pressed={index === i}
              onClick={() => go(i)}
              className={cn(
                "block min-h-[112px] w-full border-l-2 py-5 pl-5 text-left transition-colors",
                index === i ? "border-accent" : "border-transparent",
                focusRing,
              )}
            >
              <span className="flex items-baseline gap-3">
                <span className={cn("font-data text-[11px]", index === i ? "text-accent" : "text-ink-3")}>{s.index}</span>
                <span className={cn("font-data text-[12px] uppercase tracking-[0.12em]", index === i ? "text-ink" : "text-ink-3")}>{s.label}</span>
              </span>
              <span className={cn("mt-1.5 block text-[18px] font-normal tracking-tight", index === i ? "text-ink" : "text-ink-2")}>{s.title}</span>
              <span className={cn("mt-1 block text-[13px] leading-relaxed text-ink-3", index !== i && "sr-only")}>{s.support}</span>
            </button>
          ))}
        </div>

        {/* Fixed preview viewport — all four states absolutely positioned. */}
        <div className="order-1 lg:order-2" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="overflow-hidden border border-line bg-muted">
            <div className="flex items-center justify-between border-b border-line bg-canvas px-4 py-2.5">
              <p className="font-data text-[11px] text-ink-2">octo / workflow / {story.key}</p>
              <SampleLabel>Demo environment</SampleLabel>
            </div>
            <div className="relative h-[560px]">
              {WORKFLOW_STORIES.map((s, i) => (
                <motion.div
                  key={s.key}
                  className="absolute inset-0 overflow-hidden"
                  initial={false}
                  animate={{ opacity: index === i ? 1 : 0, y: index === i ? 0 : 8 }}
                  transition={{ duration: reduce ? 0 : 0.45 }}
                  style={{ pointerEvents: index === i ? "auto" : "none" }}
                  aria-hidden={index !== i}
                >
                  {VISUALS[s.key]}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
