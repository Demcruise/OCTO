"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight, Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { EvidenceList, type Evidence } from "@/components/octo/evidence-list";
import { DUR, EASE, Reveal, SampleLabel, Section, SectionHeader, focusRing } from "./primitives";

const STAGES = ["Question", "Context", "Evidence", "Answer", "Action"];

const CONTEXT = [
  ["Investment Ontology", "Harbor Logistics → Growth Fund II · 3-person deal team"],
  ["IBOR", "12 ledger events · Q2–Q3 2026"],
  ["Documents", "5 of 7 related documents"],
  ["Permissions", "Scoped to the Growth Fund II deal team"],
] as const;

const EVIDENCE: Evidence[] = [
  { ref: "1", title: "Income statement · Q3 2026", kind: "Financials", excerpt: "Revenue $55.6M (Q2: $58.0M). Management accounts, reviewed 12 Oct." },
  { ref: "2", title: "Board report · 24 Sep 2026", kind: "Document", excerpt: "p.14 — “Freight input costs rose 6% as fuel contracts reset in July.”" },
  { ref: "3", title: "IBOR event · Q3 valuation", kind: "IBOR", excerpt: "Fair value marked down 4.8% on 30 Sep 2026 · approved by valuation committee." },
  { ref: "4", title: "Operating update · hiring plan", kind: "Document", excerpt: "42 hires in Q3 against a plan of 30 — depot expansion brought forward." },
];

/**
 * AI inside the product (PAL-019): context rows load before the answer, then
 * evidence and a next action. Plays once in view; reduced motion shows all.
 */
export function AiContext() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-160px" });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) return setStep(STAGES.length);
    const ids = [1, 2, 3, 4, 5].map((s, i) => window.setTimeout(() => setStep(s), 250 + i * 420));
    return () => ids.forEach(window.clearTimeout);
  }, [inView, reduce]);

  const show = (s: number) => step >= s;
  const enter = { initial: reduce ? false : { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: DUR.standard, ease: EASE } } as const;
  const label = "font-data text-[10px] uppercase tracking-[0.1em] text-ink-3";

  return (
    <Section id="ai-context" tone="subtle" labelledBy="aicontext-title">
      <SectionHeader
        id="aicontext-title"
        index="09"
        eyebrow="Intelligence"
        title="AI that works inside the investment system."
        lead="Before OCTO answers, it assembles the objects, ledger events, documents, and permissions the question depends on — and shows you which ones it used."
      />

      <Reveal className="mt-16">
        <ol aria-label="Sequence" className="grid grid-cols-5 border border-b-0 border-line-strong bg-canvas">
          {STAGES.map((s, i) => (
            <li key={s} className={cn("border-l border-line-strong px-3 py-3 first:border-l-0 sm:px-4", show(i + 1) ? "text-ink" : "text-ink-3")}>
              <span className={cn("block h-0.5 w-full transition-colors duration-300", show(i + 1) ? "bg-accent" : "bg-line")} />
              <span className="mt-2 block font-data text-[10px] uppercase tracking-[0.1em]">{String(i + 1).padStart(2, "0")}</span>
              <span className="block truncate text-[13px] font-medium">{s}</span>
            </li>
          ))}
        </ol>

        <div ref={ref} className="grid grid-cols-1 border border-line-strong bg-canvas lg:grid-cols-12">
          <div className="min-w-0 border-b border-line p-5 lg:col-span-5 lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between">
              <p className={label}>Question</p>
              <SampleLabel>Demo environment</SampleLabel>
            </div>
            <div className="mt-2 flex min-h-12 items-center gap-2.5 border border-line-strong px-3 py-2 text-[15px] text-ink">
              <Search aria-hidden className="size-4 shrink-0 text-ink-3" />
              Why did EBITDA decline this quarter?
            </div>
            <p className={cn(label, "mt-6")}>Context assembled</p>
            <ul className="mt-2 divide-y divide-line border-y border-line">
              {CONTEXT.map(([k, v], i) => (
                <li key={k} className="grid grid-cols-[18px_1fr] gap-3 py-2.5">
                  <span aria-hidden className={cn("mt-0.5 flex size-4 items-center justify-center rounded-full border", show(2) ? "border-ok bg-ok text-white" : "border-line-strong")}>
                    {show(2) && <Check className="size-2.5" />}
                  </span>
                  <div className={cn("transition-opacity duration-300", show(2) ? "opacity-100" : "opacity-40")} style={{ transitionDelay: `${i * 80}ms` }}>
                    <p className="text-[13px] font-medium text-ink">{k}</p>
                    <p className="text-[12px] text-ink-3">{v}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 space-y-5 p-5 lg:col-span-7" aria-live="polite">
            {show(3) && (
              <motion.section {...enter} aria-label="Evidence">
                <p className={label}>Evidence · select to inspect</p>
                <EvidenceList items={EVIDENCE} className="mt-2" />
              </motion.section>
            )}
            {show(4) && (
              <motion.section {...enter} aria-label="Answer">
                <p className={label}>Answer</p>
                <p className="mt-1 text-[15px] leading-relaxed text-ink">
                  Harbor Logistics EBITDA declined <span className="font-medium tabular-nums">8.2%</span> quarter on quarter, from $11.0M to $10.1M: revenue fell 4.1%{" "}
                  <span className="font-data text-[11px] text-accent">[1]</span>, input costs rose <span className="font-data text-[11px] text-accent">[2]</span>, and
                  headcount grew faster than plan <span className="font-data text-[11px] text-accent">[4]</span>.
                </p>
              </motion.section>
            )}
            {show(5) && (
              <motion.div {...enter} className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                <p className="font-data text-[11px] text-warn">Drafted by AI · human approval required</p>
                <a href="#ai" className={cn("inline-flex min-h-10 items-center gap-2 bg-ink px-4 text-[13px] font-medium text-white hover:bg-ink-2", focusRing)}>
                  Review recommendation <ArrowRight aria-hidden className="size-3.5" />
                </a>
              </motion.div>
            )}
            {!show(3) && <p className="pt-10 text-center text-[13px] text-ink-3">Assembling context…</p>}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
