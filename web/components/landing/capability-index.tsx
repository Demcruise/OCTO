"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ARCHITECTURE, CAPABILITIES } from "@/lib/landing-content";
import { DUR, EASE, Reveal, SampleLabel, Section, SectionHeader, focusRing, useTabs } from "./primitives";

/**
 * Capability architecture instead of a feature grid (PAL-002, CAP-100/101).
 * Seven connected nodes; the active node shows its capabilities and a product signal.
 */
export function CapabilityIndex() {
  const { active, onKeyDown, tabProps } = useTabs(ARCHITECTURE.length);
  const reduce = useReducedMotion();
  const node = ARCHITECTURE[active];
  const caps = CAPABILITIES.filter((c) => (node.capabilities as readonly string[]).includes(c.title));

  return (
    <Section id="capabilities" tone="subtle" labelledBy="capabilities-title">
      <SectionHeader
        id="capabilities-title"
        index="09"
        eyebrow="Capabilities"
        title="One record under every capability."
        lead="Seven parts of one architecture. Select one to see what it covers and the signal it puts in front of your team."
      />

      <Reveal className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
        <div role="tablist" aria-label="OCTO architecture" onKeyDown={onKeyDown} className="relative lg:col-span-5">
          <span aria-hidden className="absolute bottom-6 left-[19px] top-6 w-px bg-line-strong" />
          {ARCHITECTURE.map((n, i) => (
            <button
              key={n.id}
              {...tabProps(i)}
              id={`arch-tab-${n.id}`}
              aria-controls="arch-panel"
              className={cn("relative flex min-h-12 w-full items-center gap-4 rounded-md py-2 pl-1 pr-3 text-left transition-colors hover:bg-canvas", focusRing)}
            >
              <span
                className={cn(
                  "relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border font-data text-[11px]",
                  i === active ? "border-accent bg-accent text-white" : "border-line-strong bg-subtle text-ink-3",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className={cn("block text-[15px] font-medium", i === active ? "text-ink" : "text-ink-2")}>{n.name}</span>
                <span className="block font-data text-[10px] uppercase tracking-[0.08em] text-ink-3">{n.role}</span>
              </span>
            </button>
          ))}
        </div>

        <div id="arch-panel" role="tabpanel" aria-labelledby={`arch-tab-${node.id}`} className="min-w-0 lg:col-span-7">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={node.id}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: DUR.standard, ease: EASE }}
              className="overflow-hidden rounded-xl border border-line bg-canvas"
            >
              <div className="border-b border-line p-5 md:p-6">
                <p className="font-data text-meta uppercase text-accent">
                  {String(active + 1).padStart(2, "0")} · {node.role}
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">{node.name}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{node.body}</p>
              </div>
              <ul className="divide-y divide-line">
                {caps.map((c) => (
                  <li key={c.title}>
                    <a href={c.href} className={cn("group flex min-h-11 items-start gap-4 px-5 py-4 hover:bg-subtle md:px-6", focusRing)}>
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-medium text-ink">{c.title}</p>
                        <p className="mt-0.5 text-sm text-ink-2">{c.benefit}</p>
                      </div>
                      <span className="hidden shrink-0 font-data text-[11px] text-ink-3 sm:inline">{c.signal}</span>
                      <ArrowUpRight aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-3 group-hover:text-accent" />
                    </a>
                  </li>
                ))}
              </ul>
              <div className="border-t border-line bg-subtle px-5 py-4 md:px-6">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-data text-[10px] uppercase tracking-[0.08em] text-ink-3">Product signal</p>
                  <SampleLabel />
                </div>
                <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {node.signals.map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs text-ink-3">{k}</dt>
                      <dd className="font-data text-[12px] text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </Section>
  );
}
