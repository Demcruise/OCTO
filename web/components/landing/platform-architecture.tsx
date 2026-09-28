"use client";

import { cn } from "@/lib/utils";
import { Reveal, Section, SectionHeader } from "./primitives";

const LAYERS = [
  { name: "Data", question: "Sources", items: ["Financials", "CRM", "Documents", "Transactions", "Market data"] },
  { name: "Ontology", question: "Objects", items: ["Fund", "Investment", "Company", "Deal", "LP", "Person", "Metric", "Document", "Event"] },
  { name: "Intelligence", question: "Reasoning", items: ["Analytics", "Models", "AI", "Alerts", "Recommendations"] },
  { name: "Action", question: "Decisions", items: ["Review", "Approve", "Assign", "Update", "Report", "Escalate"] },
];

/**
 * Four-column architecture with connecting rules and a visible grid (PAL-012).
 * Collapses to a vertical flow on phones.
 */
export function PlatformArchitecture() {
  return (
    <Section id="platform" labelledBy="platform-title">
      <SectionHeader
        id="platform-title"
        index="03"
        eyebrow="Platform architecture"
        title="A common system for the investment lifecycle."
        lead="Data becomes objects. Objects feed analysis. Analysis becomes an action a person approves. Each layer reads from the one before it."
      />

      <Reveal className="mt-16">
        <div className="grid grid-cols-1 border border-line-strong md:grid-cols-4">
          {LAYERS.map((l, i) => (
            <div key={l.name} className={cn("relative flex flex-col", i > 0 && "border-t border-line-strong md:border-l md:border-t-0")}>
              <div className="flex items-baseline justify-between border-b border-line-strong bg-subtle px-5 py-4">
                <p className="font-data text-meta uppercase text-accent">{String(i + 1).padStart(2, "0")}</p>
                <p className="font-data text-meta uppercase text-ink-3">
                  {l.question}
                  {i < LAYERS.length - 1 && <span aria-hidden className="ml-2 text-accent">→</span>}
                </p>
              </div>
              <div className="flex-1 px-5 pb-6 pt-5">
                <h3 className="text-h3 font-medium">{l.name}</h3>
                <ul className="mt-6 divide-y divide-line border-y border-line">
                  {l.items.map((it) => (
                    <li key={it} className="flex items-center justify-between py-2 font-data text-[13px] text-ink-2">
                      {it}
                      <span aria-hidden className="h-px w-4 bg-line-strong" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 border-x border-b border-line-strong md:grid-cols-4">
          <p className="px-5 py-3 font-data text-[11px] uppercase tracking-[0.1em] text-ink-3 md:col-span-4">
            Governance spans every layer — permissions, lineage, approvals, audit
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
