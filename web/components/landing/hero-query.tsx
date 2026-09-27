"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, FileCheck2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { DUR, EASE, Pill, SampleLabel, focusRing } from "./primitives";

const DEFAULT_QUERY = "Which portfolio companies are driving EBITDA change this quarter?";

const RESULTS = [
  { name: "US Manufacturing III", driver: "Pricing actions", delta: 18.4 },
  { name: "FN NYC", driver: "Volume recovery", delta: 11.2 },
  { name: "Atlas Components", driver: "Cost program", delta: 7.8 },
];
const MAX_DELTA = RESULTS[0].delta;

function ResultRow({ name, driver, delta, index }: (typeof RESULTS)[number] & { index: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DUR.medium, ease: EASE, delay: 0.12 + index * 0.07 }}
      className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 py-3"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink">{name}</p>
        <p className="text-xs text-ink-3">{driver}</p>
      </div>
      <p className="font-data text-sm tabular-nums text-ok">+{delta.toFixed(1)}%</p>
      <div className="col-span-2 h-1 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={reduce ? false : { width: 0 }}
          animate={{ width: `${(delta / MAX_DELTA) * 100}%` }}
          transition={{ duration: DUR.large, ease: EASE, delay: 0.2 + index * 0.07 }}
        />
      </div>
    </motion.li>
  );
}

/** Deterministic product demo of a natural-language query (HERO-002). No network call. */
export function HeroQuery() {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [asked, setAsked] = useState(DEFAULT_QUERY);
  const [run, setRun] = useState(0);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setAsked(query.trim());
    setRun((n) => n + 1);
  };

  const custom = asked !== DEFAULT_QUERY;

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-canvas shadow-[0_24px_48px_-32px_rgb(17_19_24/0.25)]">
      <div className="flex items-center justify-between border-b border-line bg-subtle px-4 py-2.5">
        <p className="text-[13px] font-medium text-ink">Ask OCTO</p>
        <SampleLabel>Demo environment</SampleLabel>
      </div>

      <form onSubmit={onSubmit} className="p-4">
        <label htmlFor="hero-query" className="sr-only">
          Ask a question about the sample portfolio
        </label>
        <div className="flex items-start gap-2 rounded-lg border border-line-strong bg-canvas p-1.5 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/15">
          <textarea
            id="hero-query"
            rows={2}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
            className="min-w-0 flex-1 resize-none bg-transparent px-2 py-1.5 text-[15px] leading-snug text-ink placeholder:text-ink-3 focus:outline-none"
            placeholder="Ask about the sample portfolio…"
          />
          <button
            type="submit"
            aria-label="Run query"
            className={cn("flex size-9 shrink-0 items-center justify-center rounded-md bg-ink text-white transition-colors hover:bg-ink-2", focusRing)}
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </form>

      <div className="border-t border-line px-4 pb-4 pt-3" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div key={run} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: DUR.fast }}>
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-medium text-ink">3 companies identified</p>
              <p className="font-data text-[11px] text-ink-3">Q3 vs Q2 · as of 30 Sep 2026</p>
            </div>
            {custom && (
              <p className="mt-1 text-xs text-ink-3">The demo returns the same illustrative answer for any question.</p>
            )}
            <ol className="mt-1 divide-y divide-line">
              {RESULTS.map((r, i) => (
                <ResultRow key={r.name} {...r} index={i} />
              ))}
            </ol>
          </motion.div>
        </AnimatePresence>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Pill tone="accent">
            <FileCheck2 aria-hidden className="size-3" />
            Source-grounded · 6 records
          </Pill>
          <Pill>
            <Lock aria-hidden className="size-3" />
            Permission-scoped
          </Pill>
        </div>
      </div>
    </div>
  );
}
