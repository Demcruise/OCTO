"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Pill, type PillTone, Reveal, SampleLabel, Section, SectionHeader } from "./primitives";

type LedgerEvent = {
  id: string;
  date: string;
  type: string;
  source: string;
  value: string;
  status: { tone: PillTone; text: string };
  editor: string;
  detail: { source: string; document: string; object: string; audit: string; impact: string };
};

const EVENTS: LedgerEvent[] = [
  {
    id: "4471",
    date: "30 Sep 2026",
    type: "Valuation",
    source: "Valuation committee",
    value: "$96.4M",
    status: { tone: "ok", text: "Approved" },
    editor: "Finance lead",
    detail: {
      source: "Valuation committee · Q3 sign-off",
      document: "Q3 valuation memo · page 3",
      object: "Keller Tooling · Buyout",
      audit: "Approved 30 Sep 10:18 · 2 of 3 approvers",
      impact: "US Manufacturing III gross IRR 21.62% → 21.84%",
    },
  },
  {
    id: "4468",
    date: "26 Sep 2026",
    type: "Distribution",
    source: "Fund administrator",
    value: "$6.8M",
    status: { tone: "ok", text: "Reconciled" },
    editor: "System",
    detail: {
      source: "Fund administrator · capital account feed",
      document: "Distribution notice · 26 Sep 2026",
      object: "US Manufacturing III → Keller Tooling",
      audit: "Matched to bank statement 27 Sep 08:02",
      impact: "DPI 0.67x → 0.68x",
    },
  },
  {
    id: "4466",
    date: "24 Sep 2026",
    type: "FX adjustment",
    source: "Fund accounting",
    value: "($0.18M)",
    status: { tone: "warn", text: "Needs review" },
    editor: "Analyst",
    detail: {
      source: "EUR/USD 1.0712 · month-end rate",
      document: "FX policy v2 · section 4",
      object: "Harbor Logistics · Buyout",
      audit: "Posted 24 Sep 09:44 · awaiting reviewer",
      impact: "Growth Fund II NAV −0.03% pending approval",
    },
  },
  {
    id: "4459",
    date: "18 Sep 2026",
    type: "Capital call",
    source: "Fund administrator",
    value: "$4.2M",
    status: { tone: "ok", text: "Reconciled" },
    editor: "System",
    detail: {
      source: "Fund administrator · call notice",
      document: "Capital call notice #14",
      object: "Growth Fund II → Atlas Components",
      audit: "Matched 19 Sep 07:55",
      impact: "Called 67.4% → 68.0%",
    },
  },
  {
    id: "4452",
    date: "12 Sep 2026",
    type: "Correction",
    source: "Fund accounting",
    value: "$0.06M",
    status: { tone: "info", text: "Supersedes 4390" },
    editor: "Finance lead",
    detail: {
      source: "Administrator restatement",
      document: "Restatement letter · 11 Sep 2026",
      object: "FN NYC · Growth equity",
      audit: "Reason recorded · original event 4390 retained",
      impact: "No change to reported IRR at one decimal",
    },
  },
];

/** Investment Book of Record: event ledger with a trace panel (PAL-015). */
export function IborShowcase() {
  const [sel, setSel] = useState(0);
  const ev = EVENTS[sel];

  return (
    <Section id="ibor" tone="subtle" labelledBy="ibor-title">
      <SectionHeader
        id="ibor-title"
        index="07"
        eyebrow="Investment Book of Record"
        title="Every number should have a history."
        lead="Transactions, valuations, and corrections land in an append-only ledger. Select an event to see where it came from and what it changed."
      />

      <Reveal className="mt-16 grid grid-cols-1 overflow-hidden rounded-sm border border-line-strong bg-canvas lg:grid-cols-12">
        <div className="min-w-0 border-b border-line lg:col-span-8 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between border-b border-line bg-subtle px-4 py-2.5">
            <p className="font-data text-[11px] text-ink-2">ibor / events · append-only</p>
            <SampleLabel>Demo environment</SampleLabel>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-[13px]">
              <caption className="sr-only">Ledger events. Select a row to trace it.</caption>
              <thead className="border-b border-line">
                <tr>
                  {["Date", "Event", "Source", "Value", "Status", "Editor", "Trace"].map((h, i) => (
                    <th key={h} scope="col" className={cn("px-4 py-2 font-data text-[10px] font-normal uppercase tracking-[0.1em] text-ink-3", i === 3 && "text-right")}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {EVENTS.map((e, i) => (
                  <tr key={e.id} className={cn(i === sel && "bg-accent-soft")}>
                    <td className="whitespace-nowrap px-4 py-2.5 font-data text-[12px] text-ink-2">{e.date}</td>
                    <td className="px-4 py-2.5 font-medium text-ink">{e.type}</td>
                    <td className="px-4 py-2.5 text-ink-2">{e.source}</td>
                    <td className="px-4 py-2.5 text-right font-data tabular-nums text-ink">{e.value}</td>
                    <td className="px-4 py-2.5">
                      <Pill tone={e.status.tone} dot>
                        {e.status.text}
                      </Pill>
                    </td>
                    <td className="px-4 py-2.5 text-ink-2">{e.editor}</td>
                    <td className="px-4 py-1.5">
                      <button
                        type="button"
                        aria-pressed={i === sel}
                        aria-label={`Trace event ${e.id}, ${e.type} ${e.date}`}
                        onClick={() => setSel(i)}
                        className="min-h-9 font-data text-[12px] text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        #{e.id}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside aria-live="polite" className="p-5 lg:col-span-4">
          <p className="font-data text-meta uppercase text-accent">Trace · event #{ev.id}</p>
          <p className="mt-2 text-xl font-medium tracking-tight">
            {ev.type} · <span className="font-data tabular-nums">{ev.value}</span>
          </p>
          <dl className="mt-5 divide-y divide-line border-y border-line">
            {(
              [
                ["Source", ev.detail.source],
                ["Document", ev.detail.document],
                ["Object", ev.detail.object],
                ["Audit event", ev.detail.audit],
                ["Calculation impact", ev.detail.impact],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="py-2.5">
                <dt className="font-data text-[10px] uppercase tracking-[0.1em] text-ink-3">{k}</dt>
                <dd className={cn("mt-0.5 text-[13px]", k === "Calculation impact" ? "font-data text-ink" : "text-ink")}>{v}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </Reveal>
    </Section>
  );
}
