"use client";

import { cn } from "@/lib/utils";
import { Reveal, Section, SectionHeader } from "./primitives";

const COLUMNS = [
  {
    name: "Data",
    question: "What happened?",
    items: ["Financials", "Transactions", "Documents", "CRM"],
    example: "Harbor Logistics reports Q3 EBITDA of $10.1M, down from $11.0M.",
  },
  {
    name: "Logic",
    question: "How should we interpret it?",
    items: ["Investment rules", "Metrics", "Models", "AI reasoning", "Permissions"],
    example: "Covenant model flags headroom below 15%; AI drafts the driver analysis for the deal team only.",
  },
  {
    name: "Action",
    question: "What should happen next?",
    items: ["Review", "Approve", "Assign", "Update", "Publish"],
    example: "Deal lead reviews the draft; the valuation note is approved and published to the IC pack.",
  },
];

/** Data → logic → action as one decision system (PAL-016). */
export function DecisionArchitecture() {
  return (
    <Section id="decision" tone="night" labelledBy="decision-title">
      <SectionHeader
        id="decision-title"
        index="08"
        eyebrow="Data · Logic · Action"
        title="From what happened to what happens next."
        lead="OCTO keeps the facts, the reasoning applied to them, and the decision that follows in one connected system."
        inverse
      />
      <Reveal className="mt-16 grid grid-cols-1 border border-night-line md:grid-cols-3">
        {COLUMNS.map((c, i) => (
          <div key={c.name} className={cn("flex flex-col", i > 0 && "border-t border-night-line md:border-l md:border-t-0")}>
            <div className="border-b border-night-line px-6 py-5">
              <p className="font-data text-meta uppercase text-accent-light">
                {String(i + 1).padStart(2, "0")} · {c.name}
              </p>
              <h3 className="mt-4 text-h3 font-medium">{c.question}</h3>
            </div>
            <ul className="flex-1 px-6 py-5">
              {c.items.map((it) => (
                <li key={it} className="flex items-center gap-3 py-1.5 font-data text-[13px] text-white/85">
                  <span aria-hidden className="h-px w-3 bg-accent-light" />
                  {it}
                </li>
              ))}
            </ul>
            <p className="border-t border-night-line px-6 py-5 text-sm leading-relaxed text-fog">
              <span className="mr-2 font-data text-[10px] uppercase tracking-[0.1em] text-white/70">Example</span>
              {c.example}
            </p>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
