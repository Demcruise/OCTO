"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { EvidenceList } from "@/components/octo/evidence-list";
import { EventLog } from "@/components/octo/event-log";
import { WORKFLOW_STORIES } from "@/lib/landing-content";
import { Pill, Reveal, SampleLabel, Section, SectionHeader, focusRing } from "./primitives";

const DURATION_MS = 7000;

/* Compact product surfaces — one per workflow story. The UI is the proof. */

function ScreenVisual() {
  const rows = [
    ["Acme Robotics", "Industrial automation", "92", "accent"],
    ["Northline Foods", "Distribution", "78", "neutral"],
    ["Keller Tooling", "Precision manufacturing", "74", "neutral"],
    ["Fernhill Packaging", "Materials", "61", "neutral"],
  ] as const;
  return (
    <div className="p-5">
      <p className="font-data text-[10px] uppercase tracking-[0.1em] text-ink-3">Pipeline · screened against mandate</p>
      <ul className="mt-3 divide-y divide-line border-y border-line">
        {rows.map(([name, sector, score, tone]) => (
          <li key={name} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-[14px] font-medium text-ink">{name}</p>
              <p className="truncate text-[12px] text-ink-3">{sector}</p>
            </div>
            <Pill tone={tone} dot>
              Score {score}
            </Pill>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DecideVisual() {
  return (
    <div className="p-5">
      <p className="font-data text-[10px] uppercase tracking-[0.1em] text-ink-3">IC memo · Acme Robotics</p>
      <p className="mt-3 text-[15px] leading-relaxed text-ink">
        Recommend proceeding to confirmatory diligence. EBITDA bridge verified; customer concentration remains the open question.
      </p>
      <EvidenceList
        className="mt-4 rounded-sm"
        items={[
          { ref: "1", title: "EBITDA bridge FY24–FY26", kind: "Model", excerpt: "Reconciled to management accounts. Delta: +0.4pp margin." },
          { ref: "2", title: "Customer concentration memo", kind: "Finding", excerpt: "Top customer is 31% of revenue; churn risk flagged." },
          { ref: "3", title: "IC approval · pending", kind: "Approval" },
        ]}
      />
    </div>
  );
}

function MonitorVisual() {
  const rows = [
    ["Covenant headroom < 15%", "Atlas Components", "warn", "Open"],
    ["EBITDA −8.2% QoQ", "Harbor Logistics", "warn", "Needs review"],
    ["Q3 accounts overdue", "FN NYC", "info", "Task"],
    ["Valuation variance > 5%", "Growth Fund II", "accent", "In review"],
  ] as const;
  return (
    <div className="p-5">
      <p className="font-data text-[10px] uppercase tracking-[0.1em] text-ink-3">Monitoring · this week</p>
      <ul className="mt-3 divide-y divide-line border-y border-line">
        {rows.map(([text, object, tone, state]) => (
          <li key={text} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-[14px] font-medium text-ink">{text}</p>
              <p className="truncate text-[12px] text-ink-3">{object}</p>
            </div>
            <Pill tone={tone} dot>
              {state}
            </Pill>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReportVisual() {
  return (
    <div className="p-5">
      <p className="font-data text-[10px] uppercase tracking-[0.1em] text-ink-3">Q3 LP report · figure check</p>
      <div className="mt-4 flex flex-wrap items-center gap-2 font-data text-[12px] text-ink">
        {["21.84% Gross IRR", "Investment", "IBOR event", "Source", "Document"].map((s, i) => (
          <span key={s} className="flex items-center gap-2">
            <span className={cn("border px-2.5 py-1.5", i === 0 ? "border-accent bg-accent-soft" : "border-line bg-subtle")}>{s}</span>
            {i < 4 && <ArrowRight aria-hidden className="size-3.5 text-ink-3" />}
          </span>
        ))}
      </div>
      <EventLog
        className="mt-5"
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
 * 06 — FROM DATA TO DECISION: one product visual with a compact four-step
 * selector. Autoplay 7s, pause on hover, manual selection resets the timer.
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
        index="06"
        eyebrow="From data to decision"
        title="From data to decision."
        lead="Connect investment data, context, intelligence, and workflow — and move from information to a governed decision."
      />

      <Reveal
        className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-12"
        delay={0.05}
      >
        {/* Product visual — first on mobile, right on desktop. */}
        <div className="order-1 lg:order-2 lg:col-span-8" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="overflow-hidden border border-line-strong bg-canvas">
            <div className="flex items-center justify-between border-b border-line bg-subtle px-4 py-2.5">
              <p className="font-data text-[11px] text-ink-2">octo / workflow / {story.key}</p>
              <SampleLabel>Demo environment</SampleLabel>
            </div>
            <div className="min-h-[380px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={story.key}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {VISUALS[story.key]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Compact selector — vertical on desktop, horizontal scroll on mobile. */}
        <div className="order-2 lg:order-1 lg:col-span-4">
          <div role="group" aria-label="Workflow steps" className="no-scrollbar -mx-5 flex gap-px overflow-x-auto bg-line px-px lg:mx-0 lg:block lg:divide-y lg:divide-line lg:border-y lg:border-line lg:bg-canvas lg:px-0">
            {WORKFLOW_STORIES.map((s, i) => (
              <button
                key={s.key}
                type="button"
                aria-pressed={index === i}
                onClick={() => go(i)}
                className={cn(
                  "relative min-w-64 flex-1 shrink-0 border border-line bg-canvas px-4 py-4 text-left transition-colors lg:min-w-0 lg:border-0 lg:px-0 lg:py-5",
                  index === i ? "text-ink" : "text-ink-3 hover:text-ink",
                  focusRing,
                )}
              >
                <span aria-hidden className={cn("absolute inset-y-0 left-0 w-0.5 transition-colors", index === i ? "bg-accent" : "bg-transparent")} />
                <span className="flex items-baseline gap-3">
                  <span className={cn("font-data text-[11px]", index === i ? "text-accent" : "text-ink-3")}>{s.index}</span>
                  <span className="font-data text-[12px] uppercase tracking-[0.12em]">{s.label}</span>
                </span>
                <span className={cn("mt-1.5 block text-[16px] font-medium tracking-tight", index === i ? "text-ink" : "text-ink-2")}>{s.title}</span>
                {index === i && <span className="mt-1 block text-[13px] leading-relaxed text-ink-3">{s.support}</span>}
              </button>
            ))}
          </div>
          <p className="mt-4 hidden font-data text-[11px] uppercase tracking-[0.1em] text-ink-3 lg:block">
            {story.label} · {story.support}
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
