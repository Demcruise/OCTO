"use client";

import { cn } from "@/lib/utils";
import { GOVERNANCE } from "@/lib/landing-content";
import { EventLog } from "@/components/octo/event-log";
import { ProductFrame } from "@/components/octo/product-frame";
import { Reveal, Section, SectionHeader } from "./primitives";

const LAYERS = [
  { name: "Access", question: "Who may see this?" },
  { name: "Action", question: "Who may change it?" },
  { name: "Record", question: "Can we prove what happened?" },
] as const;

/**
 * Governance as architecture, not shield icons (PAL-025): every request passes
 * access, action, and record controls in order; the audit trail shows it happening.
 */
export function Governance() {
  return (
    <Section id="governance" tone="night" labelledBy="governance-title">
      <SectionHeader
        id="governance-title"
        index="15"
        eyebrow="Governance"
        title="Built for controlled environments."
        lead="Permissions, approvals, and the audit trail are part of the system every request passes through — for people and for AI."
        inverse
      />

      <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-8">
          <div className="border border-night-line">
            <div className="flex items-center justify-between border-b border-night-line px-5 py-3">
              <p className="font-data text-[11px] uppercase tracking-[0.1em] text-fog">Request · person or AI</p>
              <p className="font-data text-[11px] text-accent-light">↓</p>
            </div>
            {LAYERS.map((l, i) => {
              const caps = GOVERNANCE.filter((g) => g.layer === l.name);
              return (
                <div key={l.name} className={cn("grid grid-cols-1 md:grid-cols-12", i > 0 && "border-t border-night-line")}>
                  <div className="border-b border-night-line px-5 py-5 md:col-span-3 md:border-b-0 md:border-r">
                    <p className="font-data text-meta uppercase text-accent-light">
                      {String(i + 1).padStart(2, "0")} · {l.name}
                    </p>
                    <p className="mt-2 text-[15px] text-white">{l.question}</p>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-3 md:col-span-9">
                    {caps.map((c, k) => (
                      <li key={c.name} className={cn("px-5 py-5", k > 0 && "border-t border-night-line sm:border-l sm:border-t-0")}>
                        <p className="text-[15px] font-medium">{c.name}</p>
                        <p className="mt-1 text-[13px] leading-relaxed text-fog">{c.body}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            <div className="flex items-center justify-between border-t border-night-line px-5 py-3">
              <p className="font-data text-[11px] uppercase tracking-[0.1em] text-fog">Committed record · append-only</p>
              <p className="font-data text-[11px] text-ok-light">Verified</p>
            </div>
          </div>
        </Reveal>

        <Reveal className="min-w-0 lg:col-span-4" delay={0.06}>
          <ProductFrame path="audit / valuation-update-0931" meta="Sample data" bodyClassName="p-5 text-ink">
            <p className="text-sm font-medium">Harbor Logistics · Q3 valuation correction</p>
            <p className="mb-4 text-[13px] text-ink-3">Every step recorded with its actor.</p>
            <EventLog
              label="Audit trail"
              events={[
                { time: "10:14", event: "Analyst requested valuation update", detail: "Access: Growth Fund II deal team", actor: "person" },
                { time: "10:16", event: "AI drafted reconciliation", detail: "3 sources cited · draft only", actor: "ai" },
                { time: "10:18", event: "Reviewer approved correction", detail: "Approval gate · reason recorded", actor: "person" },
                { time: "10:19", event: "Record committed", detail: "Supersedes event 4390 · version 2", actor: "system", emphasis: true },
              ]}
            />
          </ProductFrame>
        </Reveal>
      </div>
    </Section>
  );
}
