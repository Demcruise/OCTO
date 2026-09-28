"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApprovalState } from "@/components/octo/approval-state";
import { DUR, EASE, SampleLabel, focusRing } from "./primitives";

type Tone = "ok" | "warn" | "danger" | "accent" | "info" | "neutral";
type ContextKey = "Investment Ontology" | "IBOR" | "Financials" | "Documents" | "Permissions";
type Preset = { q: string; answer: string; rows: [string, string, Tone][]; context: Record<ContextKey, string> };

const CONTEXT_KEYS: ContextKey[] = ["Investment Ontology", "IBOR", "Financials", "Documents", "Permissions"];

const PRESETS: Preset[] = [
  {
    q: "Why did EBITDA fall?",
    answer: "Harbor Logistics EBITDA fell 8.2% quarter on quarter.",
    rows: [
      ["Revenue", "−4.1%", "danger"],
      ["Cost of goods sold", "+6.3%", "danger"],
      ["Headcount cost", "+12.0%", "danger"],
    ],
    context: {
      "Investment Ontology": "Harbor Logistics → Growth Fund II → deal team",
      IBOR: "12 ledger events, Q2–Q3 2026",
      Financials: "Management accounts, Q3 2026",
      Documents: "Board pack, 24 Sep 2026 · page 14",
      Permissions: "Scoped to the Growth Fund II deal team",
    },
  },
  {
    q: "Which fund is performing best?",
    answer: "US Manufacturing III leads the portfolio on gross IRR.",
    rows: [
      ["US Manufacturing III", "21.8% · 2.70x", "ok"],
      ["Growth Fund II", "18.2% · 2.30x", "neutral"],
      ["Growth Fund I", "16.9% · 2.10x", "neutral"],
    ],
    context: {
      "Investment Ontology": "4 funds · 38 portfolio companies",
      IBOR: "Cash flows and NAV as of 30 Sep 2026",
      Financials: "Quarterly valuations, Q3 2026",
      Documents: "Capital account statements",
      Permissions: "Portfolio-level view for the investment committee",
    },
  },
  {
    q: "What needs my attention?",
    answer: "7 items need a decision this week. 3 are exceptions.",
    rows: [
      ["Covenant headroom < 15% · Atlas Components", "Exception", "warn"],
      ["Valuation variance > 5% · Growth Fund II", "Review", "accent"],
      ["Q3 accounts missing · FN NYC", "Task", "info"],
    ],
    context: {
      "Investment Ontology": "Items linked to 3 companies and 2 funds",
      IBOR: "Variance measured against the administrator record",
      Financials: "Covenant model v4, lender report",
      Documents: "Valuation memo draft · Q3",
      Permissions: "Items assigned to you or your team",
    },
  },
  {
    q: "Which investments have unresolved exceptions?",
    answer: "3 investments have open exceptions.",
    rows: [
      ["Atlas Components", "Covenant headroom", "warn"],
      ["FN NYC", "Missing Q3 accounts", "warn"],
      ["Harbor Logistics", "FX rate mismatch", "warn"],
    ],
    context: {
      "Investment Ontology": "Exceptions attached to investment records",
      IBOR: "FX adjustment pending approval · Harbor Logistics",
      Financials: "Q3 reporting calendar",
      Documents: "Lender report, 30 Sep 2026",
      Permissions: "Exceptions you are allowed to see",
    },
  },
];

const TONE: Record<Tone, string> = {
  ok: "text-ok",
  warn: "text-warn",
  danger: "text-danger",
  accent: "text-accent",
  info: "text-info",
  neutral: "text-ink-2",
};

const KPIS = [
  ["Coverage", "4 funds"],
  ["Gross IRR", "18.4%"],
  ["Needs attention", "7 items"],
] as const;

/**
 * Hero product demo (HERO-102, AGENT-002/003/004). A preset question walks the
 * panel through query → context → answer → governance. Deterministic; no network.
 * Reduced motion shows the final state immediately with the same content.
 */
export function HeroQuery() {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<number | null>(null);
  const [phase, setPhase] = useState(0);
  const [drawer, setDrawer] = useState<ContextKey | null>(null);
  const touched = useRef(false);
  const timers = useRef<number[]>([]);

  const run = (i: number) => {
    timers.current.forEach(window.clearTimeout);
    setSelected(i);
    setDrawer(null);
    if (reduce) return setPhase(4);
    setPhase(1);
    timers.current = [250, 600, 950].map((t, k) => window.setTimeout(() => setPhase(k + 2), t));
  };

  // State A → B once on load, so the first viewport shows the mechanism. Never repeats.
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (!touched.current) run(0);
    }, 900);
    const pending = timers.current;
    return () => {
      window.clearTimeout(id);
      pending.forEach(window.clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const preset = selected === null ? null : PRESETS[selected];
  const reveal = {
    initial: reduce ? false : { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: DUR.standard, ease: EASE },
  } as const;

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-canvas shadow-[0_20px_40px_-32px_rgb(17_19_24/0.22)]">
      <div className="flex items-center justify-between border-b border-line bg-subtle px-4 py-2.5">
        <p className="text-[13px] font-medium text-ink">OCTO Intelligence</p>
        <SampleLabel>Demo environment</SampleLabel>
      </div>

      <dl className="grid grid-cols-3 divide-x divide-line border-b border-line">
        {KPIS.map(([k, v]) => (
          <div key={k} className="min-w-0 px-3 py-2.5 sm:px-4">
            <dt className="truncate text-[11px] text-ink-3">{k}</dt>
            <dd className="mt-0.5 truncate text-sm font-semibold tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="p-4">
        <div className="flex min-h-12 items-center gap-2.5 rounded-lg border border-line-strong bg-canvas px-3 py-2">
          <Search aria-hidden className="size-4 shrink-0 text-ink-3" />
          <p className={cn("text-[15px] leading-snug", preset ? "text-ink" : "text-ink-3")}>{preset ? preset.q : "Ask across your investment system"}</p>
        </div>
        <div role="group" aria-label="Example questions" className="mt-3 flex flex-wrap gap-1.5">
          {PRESETS.map((p, i) => (
            <button
              key={p.q}
              type="button"
              aria-pressed={selected === i}
              onClick={() => {
                touched.current = true;
                run(i);
              }}
              className={cn(
                "min-h-9 rounded-md border px-2.5 py-1.5 text-left text-[13px] transition-colors",
                selected === i ? "border-accent bg-accent-soft text-accent" : "border-line bg-canvas text-ink-2 hover:border-line-strong hover:text-ink",
                focusRing,
              )}
            >
              {p.q}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[252px] border-t border-line px-4 pb-4 pt-3" aria-live="polite">
        {!preset && <p className="pt-8 text-center text-[13px] text-ink-3">Choose a question to see how OCTO answers from governed context.</p>}
        <AnimatePresence mode="wait">
          {preset && (
            <motion.div key={selected} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: DUR.fast }}>
              {phase >= 2 && (
                <motion.div {...reveal}>
                  <p className="font-data text-[10px] uppercase tracking-[0.08em] text-ink-3">Context</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {CONTEXT_KEYS.map((k) => (
                      <button
                        key={k}
                        type="button"
                        aria-expanded={drawer === k}
                        aria-controls="hero-context-drawer"
                        onClick={() => setDrawer(drawer === k ? null : k)}
                        className={cn(
                          "min-h-7 rounded-sm border px-1.5 font-data text-[11px] transition-colors",
                          drawer === k ? "border-accent bg-accent-soft text-accent" : "border-line bg-subtle text-ink-2 hover:text-ink",
                          focusRing,
                        )}
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                  {drawer && (
                    <p id="hero-context-drawer" className="mt-2 rounded-md border border-dashed border-line-strong bg-subtle px-2.5 py-1.5 text-[12px] text-ink-2">
                      <span className="font-medium text-ink">{drawer}:</span> {preset.context[drawer]}
                    </p>
                  )}
                </motion.div>
              )}
              {phase >= 3 && (
                <motion.div {...reveal} className="mt-3">
                  <p className="text-sm font-medium text-ink">{preset.answer}</p>
                  <ul className="mt-1.5 divide-y divide-line border-y border-line">
                    {preset.rows.map(([label, value, tone]) => (
                      <li key={label} className="flex items-center justify-between gap-4 py-1.5 text-[13px]">
                        <span className="min-w-0 truncate text-ink-2">{label}</span>
                        <span className={cn("shrink-0 font-data tabular-nums", TONE[tone])}>{value}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
              {phase >= 4 && (
                <motion.div {...reveal} className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <ApprovalState reached="evidence" />
                  <p className="font-data text-[11px] text-warn">Draft · human review required</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
