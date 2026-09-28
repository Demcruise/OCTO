"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal, Section, SectionHeader } from "./primitives";

type NodeId = "fund" | "investment" | "company" | "lp" | "person" | "document" | "metric" | "event" | "approval";
type GNode = { id: NodeId; label: string; name: string; x: number; y: number; meta: [string, string][]; next: string };

/* Coordinates in a 1000 × 520 space shared by the SVG edges and the HTML node buttons. */
const NODES: GNode[] = [
  { id: "fund", label: "Fund", name: "US Manufacturing III", x: 120, y: 120, meta: [["Vintage", "2019"], ["Gross IRR", "21.8%"], ["Companies", "12"]], next: "Review Q3 valuation" },
  { id: "lp", label: "LP", name: "Northbridge Pension", x: 120, y: 400, meta: [["Commitment", "$25.0M"], ["Called", "68%"]], next: "Send Q3 capital statement" },
  { id: "investment", label: "Investment", name: "Keller Tooling · Buyout", x: 380, y: 130, meta: [["Entry", "Jun 2021"], ["Fair value", "$96.4M"], ["TVPI", "2.80x"]], next: "View investment" },
  { id: "person", label: "Person", name: "Deal lead · M. Ortiz", x: 380, y: 400, meta: [["Role", "Deal lead"], ["Open tasks", "4"]], next: "Assign review" },
  { id: "company", label: "Company", name: "Keller Tooling", x: 700, y: 60, meta: [["Revenue LTM", "$148.0M"], ["EBITDA margin", "21.4%"]], next: "Open company view" },
  { id: "document", label: "Document", name: "Q2 valuation report", x: 700, y: 190, meta: [["Page", "14 of 22"], ["Received", "14 Jul 2026"]], next: "Trace source" },
  { id: "metric", label: "Metric", name: "Gross IRR · 21.84%", x: 700, y: 320, meta: [["Definition", "v3.2"], ["Reconciled", "30 Sep 2026"]], next: "View lineage" },
  { id: "approval", label: "Approval", name: "Q3 valuation sign-off", x: 700, y: 460, meta: [["Approvers", "2 of 3"], ["Due", "3 Oct 2026"]], next: "Review approval" },
  { id: "event", label: "Event", name: "Distribution · $6.8M", x: 900, y: 260, meta: [["Date", "26 Sep 2026"], ["Source", "Fund administrator"]], next: "Open ledger event" },
];

const EDGES: [NodeId, NodeId, string][] = [
  ["fund", "investment", "owns"],
  ["lp", "fund", "invested in"],
  ["person", "fund", "manages"],
  ["person", "investment", "manages"],
  ["investment", "company", "linked to"],
  ["investment", "document", "documented by"],
  ["fund", "metric", "measured by"],
  ["investment", "approval", "subject to"],
  ["metric", "event", "derived from"],
  ["document", "metric", "supports"],
];

const pos = (id: NodeId) => NODES.find((n) => n.id === id)!;
const neighbours = (id: NodeId) => new Set(EDGES.flatMap(([a, b]) => (a === id ? [b] : b === id ? [a] : [])));

/**
 * Relationship graph (PAL-013, PAL-018): focus a node to highlight its edges and
 * neighbours, isolate it, and inspect it. Phones get a focused object list instead.
 */
export function ObjectGraph() {
  const [focus, setFocus] = useState<NodeId>("investment");
  const [hover, setHover] = useState<NodeId | null>(null);
  const [isolate, setIsolate] = useState(false);
  const active = hover ?? focus;
  const near = neighbours(active);
  const node = pos(focus);
  const visible = (id: NodeId) => !isolate || id === active || near.has(id);

  return (
    <Section id="graph" tone="void" labelledBy="graph-title">
      <SectionHeader
        id="graph-title"
        index="05"
        eyebrow="Object graph"
        title="Objects and relationships, not disconnected tables."
        lead="Select any object to see what it connects to, what it is measured by, and what is waiting on it."
        inverse
      />

      <Reveal className="mt-16 grid grid-cols-1 border border-night-line lg:grid-cols-12">
        <div className="relative hidden border-night-line lg:col-span-8 lg:block lg:border-r" onMouseLeave={() => setHover(null)}>
          <div className="flex items-center justify-between border-b border-night-line px-4 py-2.5">
            <p className="font-data text-[11px] text-fog">ontology / graph · {NODES.length} objects · {EDGES.length} relationships</p>
            <label className="flex cursor-pointer items-center gap-2 font-data text-[11px] uppercase tracking-[0.08em] text-fog">
              <input type="checkbox" checked={isolate} onChange={(e) => setIsolate(e.target.checked)} className="accent-[var(--color-accent-light)]" />
              Isolate
            </label>
          </div>
          <div className="p-6">
          <div className="relative aspect-[1000/520]">
            <svg viewBox="0 0 1000 520" className="absolute inset-0 h-full w-full" aria-hidden>
              {EDGES.map(([a, b, verb]) => {
                const A = pos(a);
                const B = pos(b);
                const lit = a === active || b === active;
                if (!visible(a) || !visible(b)) return null;
                return (
                  <g key={a + b}>
                    <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={lit ? "var(--color-accent-light)" : "rgb(255 255 255 / 0.16)"} strokeWidth={lit ? 1.5 : 1} />
                    {lit && (
                      <text x={(A.x + B.x) / 2} y={(A.y + B.y) / 2 - 6} textAnchor="middle" className="font-data text-[11px]" fill="var(--color-accent-light)" stroke="var(--color-void)" strokeWidth={4} paintOrder="stroke">
                        {verb}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
            {NODES.map((n) => (
              <button
                key={n.id}
                type="button"
                aria-pressed={n.id === focus}
                onClick={() => setFocus(n.id)}
                onMouseEnter={() => setHover(n.id)}
                onFocus={() => setHover(n.id)}
                onBlur={() => setHover(null)}
                style={{ left: `${n.x / 10}%`, top: `${(n.y / 520) * 100}%` }}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 border bg-void px-3 py-1.5 text-left transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light",
                  n.id === focus ? "border-accent-light" : n.id === active || near.has(n.id) ? "border-white/40" : "border-night-line",
                  !visible(n.id) && "pointer-events-none opacity-0",
                  visible(n.id) && n.id !== active && !near.has(n.id) && "opacity-40",
                )}
              >
                <span className="block font-data text-[10px] uppercase tracking-[0.1em] text-accent-light">{n.label}</span>
                <span className="block whitespace-nowrap text-[13px] text-white">{n.name}</span>
              </button>
            ))}
          </div>
          </div>
        </div>

        {/* Phones and tablets: pick an object, see its relationships (PAL-035 · graph → focused object view). */}
        <div className="border-b border-night-line p-4 lg:hidden">
          <div role="radiogroup" aria-label="Object" className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4">
            {NODES.map((n) => (
              <button
                key={n.id}
                type="button"
                role="radio"
                aria-checked={n.id === focus}
                onClick={() => setFocus(n.id)}
                className={cn("min-h-11 shrink-0 border px-3 font-data text-[12px]", n.id === focus ? "border-accent-light text-white" : "border-night-line text-fog")}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>

        <aside aria-live="polite" className="p-5 lg:col-span-4">
          <p className="font-data text-meta uppercase text-accent-light">{node.label}</p>
          <p className="mt-2 text-2xl font-medium tracking-tight">{node.name}</p>
          <dl className="mt-5 divide-y divide-night-line border-y border-night-line">
            {node.meta.map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 text-[13px]">
                <dt className="text-fog">{k}</dt>
                <dd className="font-data tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 font-data text-[10px] uppercase tracking-[0.1em] text-fog">Relationships</p>
          <ul className="mt-2 space-y-1.5">
            {EDGES.filter(([a, b]) => a === focus || b === focus).map(([a, b, verb]) => (
              <li key={a + b} className="text-[13px] text-white/85">
                {a === focus ? (
                  <>
                    <span className="font-data text-accent-light">{verb}</span> → {pos(b).name}
                  </>
                ) : (
                  <>
                    {pos(a).name} → <span className="font-data text-accent-light">{verb}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
          <a
            href="#object-view"
            className="mt-8 inline-flex min-h-11 items-center gap-2 bg-white px-4 text-sm font-medium text-void hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-offset-2 focus-visible:ring-offset-void"
          >
            {node.next}
            <ArrowRight aria-hidden className="size-4" />
          </a>
        </aside>
      </Reveal>
    </Section>
  );
}
