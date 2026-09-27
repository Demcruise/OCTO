"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal, SampleLabel, Section, SectionHeader } from "./primitives";

type CoreLayerProps = {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  visual: React.ReactNode;
};

/** Reusable numbered layer row (CORE-002). */
export function OCTOCoreLayer({ number, eyebrow, title, description, visual }: CoreLayerProps) {
  return (
    <Reveal as="li" className="grid gap-8 border-t border-line py-10 md:grid-cols-12 md:gap-10 md:py-12">
      <div className="md:col-span-5">
        <p className="font-data text-meta uppercase text-ink-3">
          <span className="text-accent">Layer {number}</span> · {eyebrow}
        </p>
        <h3 className="mt-3 text-h3 font-semibold">{title}</h3>
        <p className="mt-3 max-w-md text-base leading-relaxed text-ink-2">{description}</p>
      </div>
      <div className="md:col-span-7">{visual}</div>
    </Reveal>
  );
}

function Panel({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-lg border border-line bg-canvas", className)}>
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <p className="font-data text-[11px] text-ink-2">{label}</p>
        <SampleLabel />
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

const TREE: { depth: number; label: string; kind: string }[] = [
  { depth: 0, label: "Growth Fund II", kind: "Fund" },
  { depth: 1, label: "Series B · 2023", kind: "Investment" },
  { depth: 2, label: "Atlas Components", kind: "Company" },
  { depth: 3, label: "Management team", kind: "People" },
  { depth: 3, label: "EBITDA, revenue, net debt", kind: "Metrics" },
  { depth: 3, label: "Capital calls, distributions", kind: "Transactions" },
  { depth: 1, label: "Northbridge Pension", kind: "LP" },
];

function OntologyTree() {
  return (
    <Panel label="ontology / growth-fund-ii">
      <ul className="font-data text-[13px]">
        {TREE.map((n, i) => (
          <li key={i} className="flex items-center gap-3 py-1" style={{ paddingLeft: n.depth * 20 }}>
            {n.depth > 0 && <span aria-hidden className="text-line-strong">└─</span>}
            <span className={cn("text-ink", n.depth === 2 && "font-medium text-accent")}>{n.label}</span>
            <span className="ml-auto shrink-0 rounded-sm bg-muted px-1.5 text-[10px] uppercase tracking-[0.06em] text-ink-3">{n.kind}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function IBORLedgerPreview() {
  const checks = ["Reconciled", "Lineage available", "Immutable history"];
  return (
    <Panel label="ibor / capital-call · 30 Sep 2026">
      <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-md border border-line bg-subtle p-3">
          <p className="font-data text-[10px] uppercase tracking-[0.08em] text-ink-3">Source · fund administrator</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">$12.4M</p>
        </div>
        <span aria-hidden className="justify-self-center rotate-90 font-data text-ink-3 sm:rotate-0">→</span>
        <div className="rounded-md border border-accent-line bg-accent-soft p-3">
          <p className="font-data text-[10px] uppercase tracking-[0.08em] text-accent">IBOR · book of record</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">$12.4M</p>
        </div>
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {checks.map((c) => (
          <li key={c} className="flex items-center gap-1.5 text-[13px] text-ink-2">
            <Check aria-hidden className="size-3.5 text-ok" />
            {c}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

const STEPS = [
  { label: "Data", note: "Governed records" },
  { label: "Analysis", note: "Versioned metrics" },
  { label: "AI proposal", note: "Cited, scoped" },
  { label: "Human review", note: "Named reviewer" },
  { label: "Approval", note: "Logged decision" },
  { label: "Action", note: "Report, task, export" },
];

function IntelligenceFlow() {
  return (
    <Panel label="workflow / quarterly-review">
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {STEPS.map((s, i) => {
          const gate = s.label === "Human review" || s.label === "Approval";
          return (
            <li key={s.label} className={cn("rounded-md border p-3", gate ? "border-accent-line bg-accent-soft" : "border-line")}>
              <p className="font-data text-[10px] text-ink-3">{String(i + 1).padStart(2, "0")}</p>
              <p className={cn("mt-1 text-sm font-medium", gate ? "text-accent" : "text-ink")}>{s.label}</p>
              <p className="text-xs text-ink-3">{s.note}</p>
            </li>
          );
        })}
      </ol>
    </Panel>
  );
}

/** Replaces the generic feature grid with OCTO's three layers (CORE-001). */
export function OctoCore() {
  return (
    <Section id="core" labelledBy="core-title">
      <SectionHeader
        id="core-title"
        index="02"
        eyebrow="The OCTO core"
        title={
          <>
            One system.
            <br />
            Three layers.
          </>
        }
        lead="A canonical model of your firm, a governed ledger underneath every number, and the intelligence and workflow that turn that record into decisions."
      />
      <ol className="mt-14 border-b border-line">
        <OCTOCoreLayer
          number="01"
          eyebrow="Investment Ontology"
          title="A shared model of the firm"
          description="A canonical model for funds, investments, companies, people, instruments, LPs, and the relationships between them. Every source maps onto it once."
          visual={<OntologyTree />}
        />
        <OCTOCoreLayer
          number="02"
          eyebrow="Investment Book of Record"
          title="The ledger behind every number"
          description="The IBOR is the governed record of positions, transactions, cash flows, and valuations. Positions are derived from events, and corrections never overwrite history."
          visual={<IBORLedgerPreview />}
        />
        <OCTOCoreLayer
          number="03"
          eyebrow="Intelligence + workflow"
          title="From record to reviewed action"
          description="Analytics and AI operate on governed data, then route proposals through review and approval before anything becomes a report, alert, or export."
          visual={<IntelligenceFlow />}
        />
      </ol>
    </Section>
  );
}
