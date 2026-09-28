"use client";

import { HeroQuery } from "./hero-query";
import { Reveal, Section, SectionHeader } from "./primitives";

const SEQUENCE = ["Select a question", "Query is scoped", "Context loads", "Answer appears", "Evidence is cited", "A person takes the next step"];

/** Live product interaction directly after the hero (PAL-009, PAL-046 · 03). */
export function AskOcto() {
  return (
    <Section id="ask" labelledBy="ask-title">
      <SectionHeader
        id="ask-title"
        index="01"
        eyebrow="Ask OCTO"
        title="Ask across your investment book."
        lead="Every answer arrives with its context, its sources, and a next step that a person approves."
      />
      <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <ol className="border-t border-line">
            {SEQUENCE.map((s, i) => (
              <li key={s} className="flex items-baseline gap-4 border-b border-line py-3.5">
                <span className="font-data text-meta text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[15px] text-ink">{s}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm leading-relaxed text-ink-3">
            The demo answers from a fixed, illustrative portfolio. In OCTO, the same question runs against your ontology, book of record, and documents —
            only the ones you are permitted to see.
          </p>
        </Reveal>
        <Reveal className="min-w-0 lg:col-span-8" delay={0.06}>
          <HeroQuery />
        </Reveal>
      </div>
    </Section>
  );
}
