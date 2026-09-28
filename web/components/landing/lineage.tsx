"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { EventLog } from "@/components/octo/event-log";
import { DUR, EASE, Reveal, SampleLabel, Section, SectionHeader, focusRing } from "./primitives";

type Node = { level: string; value: string; meta: string; preview: React.ReactNode };

const NODES: Node[] = [
  {
    level: "Metric",
    value: "21.84% Gross IRR",
    meta: "Keller Tooling · Q3 LP report",
    preview: (
      <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-[13px] sm:grid-cols-2">
        {[
          ["Reported in", "Q3 LP report · page 6"],
          ["Scope", "Keller Tooling · US Manufacturing III"],
          ["As of", "30 Sep 2026"],
          ["Definition", "Gross IRR v3.2"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 border-b border-line py-1.5">
            <dt className="text-ink-3">{k}</dt>
            <dd className="text-right text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    ),
  },
  {
    level: "Calculation",
    value: "XIRR(cash flows, NAV)",
    meta: "Definition v3.2 · approved by Finance",
    preview: (
      <pre className="overflow-x-auto rounded-md bg-ink p-3 font-data text-[12px] leading-relaxed text-white/85">
        {`XIRR(
  −32.7  14 Jun 2021   capital call
   −4.1  16 Mar 2022   follow-on
   +6.8  26 Sep 2026   distribution
  +96.4  30 Sep 2026   NAV
) = 21.84%`}
      </pre>
    ),
  },
  {
    level: "IBOR events",
    value: "12 ledger events",
    meta: "Capital calls, distributions, NAV",
    preview: (
      <EventLog
        label="Ledger events behind the metric"
        events={[
          { time: "14 Jun", event: "Capital call · $32.7M", detail: "2021 · initial investment", actor: "system" },
          { time: "16 Mar", event: "Follow-on · $4.1M", detail: "2022 · add-on acquisition", actor: "system" },
          { time: "26 Sep", event: "Distribution · $6.8M", detail: "2026 · dividend recap", actor: "system" },
          { time: "30 Sep", event: "NAV · $96.4M", detail: "2026 · valuation approved", actor: "person", emphasis: true },
        ]}
      />
    ),
  },
  {
    level: "Investment record",
    value: "Keller Tooling · Buyout",
    meta: "US Manufacturing III · since Jun 2021",
    preview: (
      <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-[13px] sm:grid-cols-2">
        {[
          ["Fund", "US Manufacturing III"],
          ["Instrument", "Common equity · 62%"],
          ["Cost", "$36.8M"],
          ["Fair value", "$96.4M"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 border-b border-line py-1.5">
            <dt className="text-ink-3">{k}</dt>
            <dd className="text-right font-data tabular-nums text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    ),
  },
  {
    level: "Source document",
    value: "Q2 valuation report",
    meta: "Fund administrator · page 14",
    preview: (
      <div className="mx-auto max-w-md rounded-sm border border-line-strong bg-canvas p-4 shadow-[0_1px_0_var(--color-line)]">
        <p className="font-data text-[10px] uppercase tracking-[0.08em] text-ink-3">Q2 valuation report · page 14 of 22</p>
        <div aria-hidden className="mt-3 space-y-1.5">
          <div className="h-1.5 w-3/4 rounded-full bg-muted" />
          <div className="h-1.5 w-full rounded-full bg-muted" />
          <div className="h-1.5 w-5/6 rounded-full bg-muted" />
        </div>
        <p className="my-3 rounded-sm bg-accent-soft px-2 py-1.5 font-data text-[12px] text-ink ring-1 ring-accent-line">
          Keller Tooling — fair value $96.4M (Level 3, market approach)
        </p>
        <div aria-hidden className="space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-muted" />
          <div className="h-1.5 w-2/3 rounded-full bg-muted" />
        </div>
        <p className="mt-3 text-[11px] text-ink-3">Received 14 Jul 2026 · checksum verified</p>
      </div>
    ),
  },
];

/**
 * Signature trust section (LINE-100..103). Opening the metric reveals its chain;
 * hovering a step dims the others; selecting a step opens its preview. Horizontal
 * on desktop, a vertical stepped timeline on phones.
 */
export function Lineage() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(NODES.length - 1);
  const [hover, setHover] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const seen = useInView(cardRef, { once: true, margin: "-35% 0px -35% 0px" });

  // Reveal the chain once when the metric reaches mid-viewport; the button still toggles it.
  useEffect(() => {
    if (seen) setOpen(true);
  }, [seen]);

  return (
    <Section id="lineage" tone="subtle" labelledBy="lineage-title">
      <SectionHeader
        id="lineage-title"
        index="05"
        eyebrow="Lineage"
        title="Every number defends itself."
        lead="Trace a portfolio metric from its calculation to the ledger events, the investment record, and the page of the source document."
      />

      <Reveal className="mt-14">
        <div ref={cardRef} className="flex flex-col gap-4 rounded-xl border border-line bg-canvas p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
          <div>
            <p className="text-sm text-ink-3">Keller Tooling · US Manufacturing III</p>
            <p className="mt-1 flex items-baseline gap-3">
              <span className="text-4xl font-semibold tabular-nums tracking-tight">21.84%</span>
              <span className="text-sm font-medium text-ink">Gross IRR</span>
            </p>
            <SampleLabel className="mt-2 block">Last reconciled 30 Sep 2026 · 09:42 UTC</SampleLabel>
          </div>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="lineage-chain"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors",
              open ? "border border-line-strong text-ink hover:bg-subtle" : "bg-accent text-white hover:bg-accent-hover",
              focusRing,
            )}
          >
            {open ? "Hide lineage" : "View lineage"}
            <ChevronDown aria-hidden className={cn("size-4 transition-transform", open && "rotate-180")} />
          </button>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="lineage-chain"
              initial={reduce ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={reduce ? undefined : { opacity: 0, height: 0 }}
              transition={{ duration: DUR.complex, ease: EASE }}
              className="overflow-hidden"
            >
              <ol aria-label="Lineage of 21.84% Gross IRR" className="mt-4 grid grid-cols-1 gap-2 lg:grid-cols-5 lg:gap-0" onMouseLeave={() => setHover(null)}>
                {NODES.map((n, i) => (
                  <motion.li
                    key={n.level}
                    className="relative flex lg:flex-col"
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DUR.standard, ease: EASE, delay: 0.08 + i * 0.12 }}
                  >
                    <button
                      type="button"
                      aria-pressed={i === selected}
                      onClick={() => setSelected(i)}
                      onMouseEnter={() => setHover(i)}
                      onFocus={() => setHover(i)}
                      onBlur={() => setHover(null)}
                      className={cn(
                        "min-h-11 w-full rounded-lg border bg-canvas px-4 py-3 text-left transition-[opacity,border-color,background-color] duration-150 lg:h-full",
                        i === selected ? "border-accent bg-accent-soft" : "border-line hover:border-line-strong",
                        hover !== null && hover !== i && "opacity-55",
                        focusRing,
                      )}
                    >
                      <span className={cn("block font-data text-[10px] uppercase tracking-[0.08em]", i === selected ? "text-accent" : "text-ink-3")}>
                        {String(i + 1).padStart(2, "0")} · {n.level}
                      </span>
                      <span className={cn("mt-1 block text-[15px] font-medium text-ink", n.level === "Calculation" && "font-data text-[13px]")}>{n.value}</span>
                      <span className="mt-0.5 block text-[12px] text-ink-3">{n.meta}</span>
                    </button>
                    {i < NODES.length - 1 && (
                      <span aria-hidden className="hidden w-4 shrink-0 items-center justify-center text-ink-3 lg:absolute lg:-right-2 lg:top-1/2 lg:z-10 lg:flex lg:-translate-y-1/2">
                        <ArrowRight className="size-3.5 rounded-full bg-subtle" />
                      </span>
                    )}
                  </motion.li>
                ))}
              </ol>

              <div aria-live="polite" className="mt-4 rounded-xl border border-line bg-canvas p-5 md:p-6">
                <p className="mb-4 font-data text-meta uppercase text-ink-3">
                  <span className="text-accent">{NODES[selected].level}</span> · preview
                </p>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={selected}
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: DUR.fast }}
                  >
                    {NODES[selected].preview}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Reveal>
    </Section>
  );
}
