"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProductFrame } from "./product-frame";

type Rel = { verb: "owns" | "invests-in" | "linked-to" | "reports-on" | "requires-action"; target: string; kind: string };
type Obj = { type: string; name: string; subtitle: string; relationships: Rel[]; events: [string, string, string][]; context: string[] };

/** Entities, relationships, events, and context for one example per entity type (PAL-003, PAL-005). */
const OBJECTS: Obj[] = [
  {
    type: "Fund",
    name: "US Manufacturing III",
    subtitle: "Buyout · vintage 2019",
    relationships: [
      { verb: "owns", target: "Keller Tooling", kind: "Investment" },
      { verb: "linked-to", target: "Northbridge Pension", kind: "LP" },
      { verb: "reports-on", target: "Q3 LP report", kind: "Document" },
      { verb: "requires-action", target: "Q3 valuation sign-off", kind: "Approval" },
    ],
    events: [
      ["24 Sep", "Valuation", "Q3 fair values proposed"],
      ["26 Sep", "Transaction", "Distribution · $6.8M"],
      ["30 Sep", "Approval", "Valuation committee sign-off"],
    ],
    context: ["Financials", "Documents", "Permissions"],
  },
  {
    type: "Investment",
    name: "Keller Tooling · Buyout",
    subtitle: "US Manufacturing III · since Jun 2021",
    relationships: [
      { verb: "invests-in", target: "Keller Tooling", kind: "Company" },
      { verb: "linked-to", target: "US Manufacturing III", kind: "Fund" },
      { verb: "reports-on", target: "Q2 valuation report", kind: "Document" },
    ],
    events: [
      ["14 Jun", "Transaction", "Capital call · $32.7M (2021)"],
      ["26 Sep", "Transaction", "Distribution · $6.8M"],
      ["30 Sep", "Valuation", "NAV $96.4M approved"],
    ],
    context: ["Financials", "Documents"],
  },
  {
    type: "Company",
    name: "Atlas Components",
    subtitle: "Industrial components · Growth Fund II",
    relationships: [
      { verb: "linked-to", target: "Growth Fund II", kind: "Fund" },
      { verb: "reports-on", target: "Q3 management accounts", kind: "Financials" },
      { verb: "requires-action", target: "Covenant headroom 12%", kind: "Exception" },
    ],
    events: [
      ["09:41", "Update", "Revenue updated from management accounts"],
      ["10:05", "Review", "Covenant headroom flagged to deal team"],
    ],
    context: ["Financials", "Documents", "Market signals"],
  },
  {
    type: "Deal",
    name: "Acme Robotics",
    subtitle: "Prospect · Series C",
    relationships: [
      { verb: "linked-to", target: "Industrial automation thesis", kind: "Thesis" },
      { verb: "reports-on", target: "IC memo v4", kind: "Document" },
      { verb: "requires-action", target: "IC approval · 2 of 3", kind: "Approval" },
    ],
    events: [
      ["24 Sep", "Review", "Customer concentration analysis received"],
      ["29 Sep", "Approval", "Routed to investment committee"],
    ],
    context: ["Documents", "Permissions"],
  },
  {
    type: "LP",
    name: "Northbridge Pension",
    subtitle: "Limited partner · Growth Fund II",
    relationships: [
      { verb: "invests-in", target: "Growth Fund II", kind: "Fund" },
      { verb: "reports-on", target: "Q3 capital account statement", kind: "Document" },
    ],
    events: [
      ["14 Aug", "Transaction", "Commitment · $25.0M"],
      ["18 Sep", "Transaction", "Capital call notice issued"],
    ],
    context: ["Documents", "Permissions"],
  },
];

export function OntologyExplorer() {
  const [i, setI] = useState(0);
  const obj = OBJECTS[i];

  return (
    <ProductFrame path={`ontology / ${obj.type.toLowerCase()}`} bodyClassName="p-4">
      <div role="radiogroup" aria-label="Entity type" className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1">
        {OBJECTS.map((o, k) => (
          <button
            key={o.type}
            type="button"
            role="radio"
            aria-checked={k === i}
            onClick={() => setI(k)}
            className={cn(
              "min-h-9 shrink-0 rounded-md border px-2.5 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              k === i ? "border-accent bg-accent-soft text-accent" : "border-line text-ink-2 hover:text-ink",
            )}
          >
            {o.type}
          </button>
        ))}
      </div>

      <div aria-live="polite" className="mt-4">
        <p className="font-data text-[10px] uppercase tracking-[0.08em] text-accent">{obj.type}</p>
        <p className="text-[15px] font-semibold text-ink">{obj.name}</p>
        <p className="text-[12px] text-ink-3">{obj.subtitle}</p>

        <div className="mt-4 grid grid-cols-1 gap-4">
          <section aria-label="Relationships">
            <p className="font-data text-[10px] uppercase tracking-[0.08em] text-ink-3">Relationships</p>
            <ul className="mt-1.5 space-y-1.5">
              {obj.relationships.map((r) => (
                <li key={r.verb + r.target} className="flex items-baseline gap-2 text-[13px]">
                  <span className={cn("shrink-0 font-data text-[11px]", r.verb === "requires-action" ? "text-warn" : "text-accent")}>{r.verb}</span>
                  <span className="min-w-0 truncate text-ink">{r.target}</span>
                  <span className="ml-auto shrink-0 text-[10px] uppercase tracking-[0.06em] text-ink-3">{r.kind}</span>
                </li>
              ))}
            </ul>
          </section>
          <section aria-label="Events">
            <p className="font-data text-[10px] uppercase tracking-[0.08em] text-ink-3">Events</p>
            <ul className="mt-1.5 space-y-1.5">
              {obj.events.map(([when, type, text]) => (
                <li key={when + text} className="grid grid-cols-[46px_1fr] gap-2 text-[13px]">
                  <span className="font-data text-[11px] tabular-nums text-ink-3">{when}</span>
                  <span className="min-w-0 text-ink">
                    <span className="font-medium">{type}</span> <span className="text-ink-2">· {text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-line pt-3">
          <span className="font-data text-[10px] uppercase tracking-[0.08em] text-ink-3">Context</span>
          {obj.context.map((c) => (
            <span key={c} className="rounded-sm border border-line bg-subtle px-1.5 font-data text-[11px] text-ink-2">
              {c}
            </span>
          ))}
        </div>
      </div>
    </ProductFrame>
  );
}
