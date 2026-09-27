"use client";

import { cn } from "@/lib/utils";
import { GOVERNANCE } from "@/lib/landing-content";
import { Reveal, Section, SectionHeader } from "./primitives";

/** Specification-style enterprise matrix rather than a card grid (GOV-001/002). */
export function Governance() {
  return (
    <Section id="governance" labelledBy="governance-title">
      <SectionHeader
        id="governance-title"
        index="08"
        eyebrow="Governance"
        title="Built for controlled environments."
        lead="OCTO is designed to run where your data already has to live, under the controls your investment committee, auditors, and LPs expect."
      />

      <Reveal className="mt-14">
        <dl className="grid overflow-hidden rounded-xl border border-line md:grid-cols-2">
          {GOVERNANCE.map((g, i) => (
            <div
              key={g.name}
              className={cn("border-line p-6 md:p-8", i > 0 && "border-t", i === 1 && "md:border-t-0", i % 2 === 1 && "md:border-l")}
            >
              <dt className="flex items-baseline justify-between gap-4 font-data text-meta uppercase">
                <span className="text-ink">{g.name}</span>
                <span className="text-right text-accent">{g.tag}</span>
              </dt>
              <dd className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-2">{g.body}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
