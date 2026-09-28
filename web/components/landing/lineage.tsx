"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { DUR, EASE, Reveal, SampleLabel, Section, SectionHeader, focusRing } from "./primitives";

type Hop = { level: string; value: string; meta: string };
type Trace = { id: string; label: string; scope: string; value: string; hops: Hop[] };

const TRACES: Trace[] = [
  {
    id: "irr",
    label: "Gross IRR",
    scope: "US Manufacturing III",
    value: "21.4%",
    hops: [
      { level: "Calculation", value: "XIRR(cash flows, NAV)", meta: "Metric definition v3.2 · approved by Finance" },
      { level: "IBOR events", value: "12 transactions", meta: "Capital calls, distributions, and NAV · 2019–2026" },
      { level: "Source", value: "Fund administrator", meta: "Quarterly capital account statement" },
      { level: "Document", value: "Q2 valuation report", meta: "Page 14 · received 14 Jul 2026" },
    ],
  },
  {
    id: "tvpi",
    label: "TVPI",
    scope: "Total portfolio",
    value: "2.31x",
    hops: [
      { level: "Calculation", value: "(Distributions + NAV) / Paid-in", meta: "Metric definition v2.0 · approved by Finance" },
      { level: "IBOR events", value: "38 transactions", meta: "$412M paid-in · $196M distributed" },
      { level: "Source", value: "Valuation committee", meta: "Q3 fair-value sign-off" },
      { level: "Document", value: "Q3 NAV statement", meta: "Page 3 · signed off 30 Sep 2026" },
    ],
  },
];

function LineageTrace({ trace }: { trace: Trace }) {
  const reduce = useReducedMotion();
  const hops: Hop[] = [{ level: "Reported figure", value: `${trace.label} · ${trace.value}`, meta: `${trace.scope} · Q3 LP report` }, ...trace.hops];
  const step = 0.2;

  return (
    <motion.ol
      className="relative"
      aria-label={`Lineage of ${trace.label}, ${trace.scope}`}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {hops.map((hop, i) => (
        <motion.li
          key={hop.level}
          className="relative grid grid-cols-[28px_1fr] gap-4 pb-5 last:pb-0"
          variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: DUR.medium, ease: EASE, delay: 0.1 + i * step } } }}
        >
          {i < hops.length - 1 && (
            <motion.span
              aria-hidden
              className="absolute left-[13.5px] top-8 h-[calc(100%-24px)] w-px origin-top bg-accent-line"
              variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { duration: DUR.medium, ease: EASE, delay: 0.25 + i * step } } }}
            />
          )}
          <span
            className={cn(
              "relative z-10 mt-2 flex size-7 items-center justify-center rounded-full border font-data text-[10px]",
              i === 0 ? "border-accent bg-accent text-white" : "border-accent-line bg-canvas text-accent",
            )}
          >
            {i === 0 ? <span className="size-1.5 rounded-full bg-white" /> : i}
          </span>
          <div className={cn("rounded-lg border bg-canvas px-4 py-3", i === 0 ? "border-accent-line" : "border-line")}>
            <p className="font-data text-[10px] uppercase tracking-[0.08em] text-ink-3">{hop.level}</p>
            <p className={cn("mt-1 text-[15px] font-medium text-ink", hop.level === "Calculation" && "font-data text-sm")}>{hop.value}</p>
            <p className="mt-0.5 text-[13px] text-ink-3">{hop.meta}</p>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  );
}

/** Signature trust section: any figure resolves to its evidence (TRUST-001/002). */
export function Lineage() {
  const [selected, setSelected] = useState(0);
  const [run, setRun] = useState(0);
  const trace = TRACES[selected];

  return (
    <Section id="lineage" tone="subtle" labelledBy="lineage-title">
      <SectionHeader
        id="lineage-title"
        index="05"
        eyebrow="Lineage"
        title={
          <>
            Every number
            <br />
            defends itself.
          </>
        }
        lead="Trace a metric from the report back to its calculation, ledger events, source system, and the page of the underlying document."
      />

      <Reveal className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <fieldset>
            <legend className="font-data text-meta uppercase text-ink-3">Select a reported figure</legend>
            <div className="mt-3 space-y-2">
              {TRACES.map((t, i) => (
                <label
                  key={t.id}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-4 rounded-lg border bg-canvas px-4 py-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent",
                    i === selected ? "border-accent" : "border-line hover:border-line-strong",
                  )}
                >
                  <input
                    type="radio"
                    name="lineage-metric"
                    className="sr-only"
                    checked={i === selected}
                    onChange={() => {
                      setSelected(i);
                      setRun((n) => n + 1);
                    }}
                  />
                  <span>
                    <span className="block text-sm text-ink-3">{t.scope}</span>
                    <span className="block text-sm font-medium text-ink">{t.label}</span>
                  </span>
                  <span className={cn("text-3xl font-semibold tabular-nums tracking-tight", i === selected ? "text-accent" : "text-ink")}>
                    {t.value}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <SampleLabel>Last reconciled 30 Sep 2026 · 09:42 UTC</SampleLabel>
            <button
              type="button"
              onClick={() => setRun((n) => n + 1)}
              className={cn("-mx-2 inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1 text-[13px] text-ink-2 hover:text-ink", focusRing)}
            >
              <RotateCcw aria-hidden className="size-3.5" />
              Replay trace
            </button>
          </div>
        </div>

        <div className="lg:col-span-7" aria-live="polite">
          <LineageTrace key={`${trace.id}-${run}`} trace={trace} />
        </div>
      </Reveal>
    </Section>
  );
}
