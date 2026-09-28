"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { GOVERNANCE } from "@/lib/landing-content";
import { EventLog } from "@/components/octo/event-log";
import { ProductFrame } from "@/components/octo/product-frame";
import { FaqList } from "./faq";
import { Reveal, Section, SectionHeader, focusRing } from "./primitives";

/**
 * Governance as mechanisms, not badges (GOV-100..102, PENDLE-003): six controls,
 * one audit trail showing them in action, and the questions a security review asks.
 */
export function Governance() {
  return (
    <Section id="governance" labelledBy="governance-title">
      <SectionHeader
        id="governance-title"
        index="08"
        eyebrow="Governance"
        title="Built for controlled environments."
        lead="Permission-scoped by default. Every change remains traceable. High-impact actions require approval."
      />

      <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-7">
          <dl className="grid grid-cols-1 overflow-hidden rounded-xl border border-line sm:grid-cols-2">
            {GOVERNANCE.map((g, i) => (
              <div key={g.name} className={cn("border-line p-5 md:p-6", i > 0 && "border-t", i === 1 && "sm:border-t-0", i % 2 === 1 && "sm:border-l")}>
                <dt className="font-data text-meta uppercase text-ink">{g.name}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-2">{g.body}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className="min-w-0 lg:col-span-5" delay={0.06}>
          <div id="audit" className="scroll-mt-28">
            <ProductFrame path="audit / valuation-update-0931" meta="Sample data" bodyClassName="p-5">
              <p className="text-sm font-medium text-ink">Harbor Logistics · Q3 valuation correction</p>
              <p className="mb-4 text-[13px] text-ink-3">Every step recorded with its actor.</p>
              <EventLog
                label="Audit trail"
                events={[
                  { time: "10:14", event: "Analyst requested valuation update", detail: "Fund accounting", actor: "person" },
                  { time: "10:16", event: "AI drafted reconciliation", detail: "3 sources cited · draft", actor: "ai" },
                  { time: "10:18", event: "Reviewer approved correction", detail: "Finance lead · reason recorded", actor: "person" },
                  { time: "10:19", event: "Record committed", detail: "Supersedes event 4471 · append-only", actor: "system", emphasis: true },
                ]}
              />
            </ProductFrame>
          </div>
        </Reveal>
      </div>

      <div id="faq" className="mt-16 grid scroll-mt-28 grid-cols-1 gap-8 border-t border-line pt-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-4">
          <h3 className="text-h3 font-semibold">Questions from a security review.</h3>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-ink-2">Deployment, the book of record, data sources, and AI.</p>
          <a href="#contact" className={cn("mt-5 inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-medium text-accent hover:text-accent-hover", focusRing)}>
            Talk to the team
            <ArrowRight aria-hidden className="size-3.5" />
          </a>
        </Reveal>
        <Reveal className="lg:col-span-8" delay={0.06}>
          <FaqList />
        </Reveal>
      </div>
    </Section>
  );
}
