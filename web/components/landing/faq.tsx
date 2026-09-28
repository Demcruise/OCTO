"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAQ } from "@/lib/landing-content";
import { DUR, EASE, Eyebrow, Reveal, Section, focusRing } from "./primitives";

function Item({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const id = useId();
  const reduce = useReducedMotion();
  return (
    <li className="border-b border-line">
      <h3>
        <button
          type="button"
          id={`${id}-q`}
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={onToggle}
          className={cn("flex w-full items-center justify-between gap-6 py-5 text-left text-[17px] font-medium text-ink", focusRing)}
        >
          {q}
          <Plus aria-hidden className={cn("size-4 shrink-0 text-ink-3 transition-transform duration-200", open && "rotate-45 text-accent")} />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-a`}
            role="region"
            aria-labelledby={`${id}-q`}
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: DUR.standard, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-ink-2">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/** Five concise questions, placed after product proof and governance (FAQ-001). */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq" tone="subtle" labelledBy="faq-title">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-4">
          <Eyebrow index="09">FAQ</Eyebrow>
          <h2 id="faq-title" className="mt-4 text-h2 font-semibold">
            Straight answers.
          </h2>
          <p className="mt-5 max-w-xs text-base leading-relaxed text-ink-2">
            Deployment, the book of record, data sources, and AI — the questions investment and operations teams ask first.
          </p>
          <a href="#contact" className={cn("mt-6 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-accent hover:text-accent-hover", focusRing)}>
            Ask the team directly
            <ArrowRight aria-hidden className="size-3.5" />
          </a>
        </Reveal>
        <Reveal className="lg:col-span-8" delay={0.06}>
          <ul className="border-t border-line">
            {FAQ.map((f, i) => (
              <Item key={f.q} q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
