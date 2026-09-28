"use client";

import { OntologyExplorer } from "@/components/octo/ontology-explorer";
import { Reveal, Section, SectionHeader } from "./primitives";

const MODEL = [
  ["Entities", "Fund · Investment · Company · Deal · LP"],
  ["Relationships", "owns · invests-in · linked-to · reports-on · requires-action"],
  ["Events", "Valuation · Transaction · Review · Approval · Update"],
  ["Context", "Financials · Documents · Market signals · Permissions"],
] as const;

/** Investment Ontology as a system primitive: objects, relationships, events, context (PAL-013 intro). */
export function OntologySection() {
  return (
    <Section id="ontology" tone="subtle" labelledBy="ontology-title">
      <SectionHeader
        id="ontology-title"
        index="04"
        eyebrow="Investment Ontology"
        title="Built around the objects your investment team already manages."
        lead="The Investment Ontology models your firm as connected objects. A fund, a company, and the document behind its valuation are one step apart."
      />
      <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <dl className="border-t border-line-strong">
            {MODEL.map(([k, v]) => (
              <div key={k} className="grid grid-cols-1 gap-1 border-b border-line-strong py-5 sm:grid-cols-[140px_1fr] sm:gap-6">
                <dt className="font-data text-meta uppercase text-accent">{k}</dt>
                <dd className="text-[15px] leading-relaxed text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal className="min-w-0 lg:col-span-7" delay={0.06}>
          <OntologyExplorer />
        </Reveal>
      </div>
    </Section>
  );
}
