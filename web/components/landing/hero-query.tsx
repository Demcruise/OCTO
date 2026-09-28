"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight, FileText, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { DUR, EASE, SampleLabel, focusRing } from "./primitives";

type Tone = "ok" | "warn" | "danger" | "accent" | "info" | "neutral";
type Preset = { q: string; answer: string; rows: [string, string, Tone][]; context: string[]; sources: [string, string][]; action: string; actionHref: string };

/** PAL-009 suggested questions. Deterministic demo data; no network call. */
const PRESETS: Preset[] = [
  {
    q: "Which investments need attention?",
    answer: "3 investments need a decision this week.",
    rows: [
      ["Atlas Components · covenant headroom 12%", "Exception", "warn"],
      ["Harbor Logistics · EBITDA −8.2% QoQ", "Needs review", "warn"],
      ["FN NYC · Q3 accounts overdue", "Task", "info"],
    ],
    context: ["Investment Ontology", "IBOR", "Alert rules", "Permissions"],
    sources: [
      ["Covenant model v4", "Model"],
      ["Q3 management accounts", "Financials"],
      ["Reporting calendar", "IBOR"],
    ],
    action: "Open Control Panel",
    actionHref: "#control-panel",
  },
  {
    q: "Why did EBITDA fall?",
    answer: "EBITDA declined 8.2% this quarter.",
    rows: [
      ["Revenue", "−4.1%", "danger"],
      ["COGS", "+6.3%", "danger"],
      ["Hiring", "+12.0%", "danger"],
    ],
    context: ["Investment Ontology", "IBOR", "Documents", "Permissions"],
    sources: [
      ["Financial model · Harbor Logistics", "Model"],
      ["IBOR · Q3 valuation event", "IBOR"],
      ["Board pack · 24 Sep 2026 · p.14", "Document"],
    ],
    action: "Review investment",
    actionHref: "#object-view",
  },
  {
    q: "Which fund has the highest IRR?",
    answer: "US Manufacturing III leads the portfolio on gross IRR.",
    rows: [
      ["US Manufacturing III", "21.8% · 2.70x", "ok"],
      ["Growth Fund II", "18.2% · 2.30x", "neutral"],
      ["Growth Fund I", "16.9% · 2.10x", "neutral"],
    ],
    context: ["Investment Ontology", "IBOR", "Metric definitions"],
    sources: [
      ["Fund cash flows 2016–2026", "IBOR"],
      ["Gross IRR definition v3.2", "Metric"],
      ["Q3 valuation report", "Document"],
    ],
    action: "Trace source",
    actionHref: "#lineage",
  },
  {
    q: "Show unresolved diligence items.",
    answer: "2 diligence items are open on Acme Robotics.",
    rows: [
      ["EBITDA bridge FY24–FY26", "Outstanding", "warn"],
      ["EBITDA margin (screening)", "Missing", "warn"],
      ["Quality of earnings report", "Received", "ok"],
    ],
    context: ["Deal record", "Checklist", "Documents", "Permissions"],
    sources: [
      ["Diligence checklist · Acme Robotics", "Workflow"],
      ["Data room index · 29 Sep 2026", "Document"],
      ["Screening criteria v2", "Rule"],
    ],
    action: "Review recommendation",
    actionHref: "#workflow",
  },
];

const TONE: Record<Tone, string> = { ok: "text-ok", warn: "text-warn", danger: "text-danger", accent: "text-accent", info: "text-info", neutral: "text-ink-2" };

/**
 * Ask OCTO (PAL-009): select → query → context → answer → evidence → action.
 * Runs once when the panel enters view; reduced motion shows the final state.
 */
export function HeroQuery() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const [selected, setSelected] = useState<number | null>(null);
  const [phase, setPhase] = useState(0);
  const touched = useRef(false);
  const timers = useRef<number[]>([]);

  const run = (i: number) => {
    timers.current.forEach(window.clearTimeout);
    setSelected(i);
    if (reduce) return setPhase(5);
    setPhase(1);
    timers.current = [300, 700, 1050, 1350].map((t, k) => window.setTimeout(() => setPhase(k + 2), t));
  };

  useEffect(() => {
    if (!inView || touched.current) return;
    const id = window.setTimeout(() => !touched.current && run(1), 500);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const p = selected === null ? null : PRESETS[selected];
  const reveal = { initial: reduce ? false : { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: DUR.standard, ease: EASE } } as const;
  const label = "font-data text-[10px] uppercase tracking-[0.1em] text-ink-3";

  return (
    <div ref={ref} className="overflow-hidden rounded-sm border border-line-strong bg-canvas">
      <div className="flex items-center justify-between border-b border-line bg-subtle px-4 py-2.5">
        <p className="font-data text-[11px] text-ink-2">octo / intelligence / ask</p>
        <SampleLabel>Demo environment</SampleLabel>
      </div>

      <div className="border-b border-line p-4">
        <div className="flex min-h-12 items-center gap-2.5 border border-line-strong px-3 py-2">
          <Search aria-hidden className="size-4 shrink-0 text-ink-3" />
          <p className={cn("text-[15px]", p ? "text-ink" : "text-ink-3")}>{p ? p.q : "Ask across your investment book..."}</p>
        </div>
        <div role="group" aria-label="Suggested questions" className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {PRESETS.map((x, i) => (
            <button
              key={x.q}
              type="button"
              aria-pressed={selected === i}
              onClick={() => {
                touched.current = true;
                run(i);
              }}
              className={cn(
                "min-h-10 border px-3 py-2 text-left text-[13px] transition-colors",
                selected === i ? "border-accent bg-accent-soft text-ink" : "border-line text-ink-2 hover:border-line-strong hover:text-ink",
                focusRing,
              )}
            >
              {x.q}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[340px] p-4" aria-live="polite">
        {!p && <p className="pt-10 text-center text-[13px] text-ink-3">Select a question. OCTO shows its context and evidence before the answer.</p>}
        <AnimatePresence mode="wait">
          {p && (
            <motion.div key={selected} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: DUR.fast }} className="space-y-4">
              {phase >= 2 && (
                <motion.div {...reveal}>
                  <p className={label}>Context</p>
                  <ul className="mt-1.5 flex flex-wrap gap-1.5">
                    {p.context.map((c) => (
                      <li key={c} className="flex items-center gap-1.5 border border-line bg-subtle px-1.5 py-0.5 font-data text-[11px] text-ink-2">
                        <span aria-hidden className="size-1.5 rounded-full bg-ok" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
              {phase >= 3 && (
                <motion.div {...reveal}>
                  <p className={label}>Answer</p>
                  <p className="mt-1 text-[15px] font-medium text-ink">{p.answer}</p>
                  <ul className="mt-2 divide-y divide-line border-y border-line">
                    {p.rows.map(([k, v, tone]) => (
                      <li key={k} className="flex items-center justify-between gap-4 py-1.5 text-[13px]">
                        <span className="min-w-0 truncate text-ink-2">{k}</span>
                        <span className={cn("shrink-0 font-data tabular-nums", TONE[tone])}>{v}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
              {phase >= 4 && (
                <motion.div {...reveal}>
                  <p className={label}>Sources</p>
                  <ol className="mt-1.5 space-y-1">
                    {p.sources.map(([s, kind], i) => (
                      <li key={s} className="flex items-center gap-2 text-[13px]">
                        <span className="font-data text-[11px] text-accent">[{i + 1}]</span>
                        <FileText aria-hidden className="size-3.5 text-ink-3" />
                        <span className="min-w-0 flex-1 truncate text-ink">{s}</span>
                        <span className="font-data text-[10px] uppercase tracking-[0.06em] text-ink-3">{kind}</span>
                      </li>
                    ))}
                  </ol>
                </motion.div>
              )}
              {phase >= 5 && (
                <motion.div {...reveal} className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
                  <p className="font-data text-[11px] text-warn">Drafted by AI · human approval required</p>
                  <a href={p.actionHref} className={cn("inline-flex min-h-10 items-center gap-2 bg-ink px-3.5 text-[13px] font-medium text-white hover:bg-ink-2", focusRing)}>
                    {p.action}
                    <ArrowRight aria-hidden className="size-3.5" />
                  </a>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
