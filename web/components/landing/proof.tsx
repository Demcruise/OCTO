"use client";

import { PROOF_CLAIMS, PROOF_MARKERS, PROOF_QUOTE } from "@/lib/landing-content";
import { Eyebrow, Reveal, Section } from "./primitives";

/**
 * Proof (PROOF-001..004): a representative pull-quote, anonymized case-study
 * claims, and capability markers. No fabricated customer names or metrics —
 * everything is labelled representative (PAL-041).
 */
export function Proof() {
  return (
    <Section id="proof" tone="subtle" labelledBy="proof-title">
      <Eyebrow index="17">What investment teams need</Eyebrow>
      <Reveal className="mt-10 max-w-4xl">
        <blockquote id="proof-title" className="text-3xl font-medium leading-snug tracking-tight text-balance md:text-5xl">
          “{PROOF_QUOTE.quote}”
        </blockquote>
        <p className="mt-6 font-data text-meta uppercase text-ink-3">
          {PROOF_QUOTE.attribution} · {PROOF_QUOTE.role}
        </p>
      </Reveal>

      <Reveal className="mt-14 grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-3" delay={0.05}>
        {PROOF_CLAIMS.map((c) => (
          <figure key={c.role} className="bg-canvas p-6 md:p-7">
            <blockquote className="text-[15px] leading-relaxed text-ink-2">“{c.quote}”</blockquote>
            <figcaption className="mt-4 font-data text-[10px] uppercase tracking-[0.1em] text-ink-3">
              Representative · {c.role}
            </figcaption>
          </figure>
        ))}
      </Reveal>

      <Reveal className="mt-14 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-8 md:grid-cols-4" delay={0.1}>
        {PROOF_MARKERS.map(([n, label]) => (
          <div key={n} className="flex items-start gap-3">
            <span className="font-data text-[12px] text-accent">{n}</span>
            <span className="text-[14px] font-medium leading-snug text-ink">{label}</span>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
