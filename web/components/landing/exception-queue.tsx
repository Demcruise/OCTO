"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Reveal, SampleLabel, Section, SectionHeader, focusRing } from "./primitives";

type Severity = "High" | "Medium" | "Low";
type Exception = { severity: Severity; kind: string; object: string; reason: string; source: string; owner: string; next: string };

const ITEMS: Exception[] = [
  { severity: "High", kind: "Reconciliation", object: "Harbor Logistics", reason: "Administrator and record differ by $0.18M", source: "Fund administrator · FX feed", owner: "Fund accounting", next: "Review FX adjustment" },
  { severity: "High", kind: "Approval pending", object: "Acme Robotics", reason: "IC decision waiting on 1 of 3 approvers", source: "IC workflow", owner: "Investment committee", next: "Chase approver" },
  { severity: "Medium", kind: "Evidence gap", object: "Acme Robotics", reason: "EBITDA bridge FY24–FY26 not received", source: "Diligence checklist", owner: "Deal lead", next: "Request document" },
  { severity: "Medium", kind: "Metric anomaly", object: "Atlas Components", reason: "Covenant headroom fell from 19% to 12%", source: "Covenant model v4", owner: "Portfolio operations", next: "Assign review" },
  { severity: "Low", kind: "Stale source", object: "US Manufacturing III", reason: "Market comps not refreshed in 3 days", source: "Market data adapter", owner: "Analyst", next: "Refresh source" },
];

const SEV = { High: "bg-danger", Medium: "bg-warn", Low: "bg-ink-3" } as const;

/** Exceptions needing attention, each with severity, object, reason, source, owner, next action (PAL-023). */
export function ExceptionQueue() {
  const [filter, setFilter] = useState<"All" | Severity>("All");
  const rows = ITEMS.filter((i) => filter === "All" || i.severity === filter);

  return (
    <Section id="exceptions" tone="subtle" labelledBy="exceptions-title">
      <SectionHeader
        id="exceptions-title"
        index="13"
        eyebrow="Exceptions"
        title="See what needs attention."
        lead="Breaks, gaps, anomalies, and stale sources surface with the evidence and an owner — before they reach a report."
      />
      <Reveal className="mt-16 overflow-hidden rounded-sm border border-line-strong bg-canvas">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-subtle px-4 py-2.5">
          <div role="radiogroup" aria-label="Severity" className="flex gap-1">
            {(["All", "High", "Medium", "Low"] as const).map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={filter === s}
                onClick={() => setFilter(s)}
                className={cn("min-h-8 border px-2.5 text-[12px]", filter === s ? "border-ink bg-ink text-white" : "border-line-strong bg-canvas text-ink-2", focusRing)}
              >
                {s}
              </button>
            ))}
          </div>
          <SampleLabel>Demo environment</SampleLabel>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-[13px]">
            <caption className="sr-only">Open exceptions</caption>
            <thead className="border-b border-line">
              <tr>
                {["Severity", "Object", "Reason", "Source", "Owner", "Next action"].map((h) => (
                  <th key={h} scope="col" className="px-4 py-2 font-data text-[10px] font-normal uppercase tracking-[0.1em] text-ink-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line" aria-live="polite">
              {rows.map((r) => (
                <tr key={r.kind + r.object}>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="flex items-center gap-2 font-data text-[12px] text-ink">
                      <span aria-hidden className={cn("size-2", SEV[r.severity])} />
                      {r.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{r.object}</p>
                    <p className="font-data text-[10px] uppercase tracking-[0.08em] text-ink-3">{r.kind}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-2">{r.reason}</td>
                  <td className="px-4 py-3 font-data text-[12px] text-ink-3">{r.source}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink-2">{r.owner}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <a href="#control-panel" className={cn("text-[13px] font-medium text-accent hover:underline", focusRing)}>
                      {r.next}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </Section>
  );
}
