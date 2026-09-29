"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Minus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { date, time } from "@/lib/format";
import type { Kpi } from "@/lib/demo-data";
import { Button, ring } from "@/components/ui/button";
import { Sheet } from "@/components/ui/overlay";
import { StatusBadge } from "@/components/ui/badge";
import { Sparkline } from "./charts";

/** Surface card with optional header row (COMP-001). */
export function Card({ title, meta, actions, className, bodyClassName, children }: { title?: string; meta?: React.ReactNode; actions?: React.ReactNode; className?: string; bodyClassName?: string; children: React.ReactNode }) {
  return (
    <section className={cn("flex min-w-0 flex-col rounded-lg border border-line bg-surface", className)} aria-label={title}>
      {(title || actions) && (
        <header className="flex min-h-11 items-center justify-between gap-3 border-b border-line px-4 py-2">
          <div className="min-w-0">
            {title && <h2 className="truncate text-[13px] font-semibold text-ink">{title}</h2>}
            {meta && <div className="text-[12px] text-ink-3">{meta}</div>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
        </header>
      )}
      <div className={cn("min-h-0 flex-1 p-4", bodyClassName)}>{children}</div>
    </section>
  );
}

/**
 * KPI card (COMP-001 MetricCard): label, value, signed delta whose colour
 * follows whether the move is good, a trend, and a path to its calculation.
 */
export function MetricCard({ kpi, onExplain }: { kpi: Kpi; onExplain: (k: Kpi) => void }) {
  const Arrow = kpi.trend === "up" ? ArrowUpRight : kpi.trend === "down" ? ArrowDownRight : Minus;
  const tone = kpi.trend === "flat" ? "text-ink-3" : kpi.good ? "text-ok" : "text-danger";
  return (
    <div className="group flex min-w-0 flex-col justify-between gap-3 rounded-lg border border-line bg-surface p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-label uppercase text-ink-3">{kpi.label}</p>
        <Sparkline values={kpi.spark} tone={kpi.trend === "flat" ? "muted" : kpi.good ? "ok" : "danger"} className="-mt-1 h-6 w-16" />
      </div>
      <div>
        {kpi.href ? (
          <Link href={kpi.href} className={cn("rounded-sm font-data text-metric font-medium tabular-nums text-ink hover:text-accent", ring)}>
            {kpi.value}
          </Link>
        ) : (
          <p className="font-data text-metric font-medium tabular-nums text-ink">{kpi.value}</p>
        )}
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className={cn("inline-flex items-center gap-0.5 text-[12px] font-medium", tone)}>
            <Arrow aria-hidden className="size-3.5" />
            {kpi.delta}
            <span className="sr-only">{kpi.good ? "(favourable)" : kpi.trend === "flat" ? "" : "(unfavourable)"}</span>
          </span>
          <button
            type="button"
            onClick={() => onExplain(kpi)}
            className={cn("cursor-pointer rounded-sm text-[12px] text-ink-3 underline decoration-line-strong underline-offset-2 hover:text-accent hover:decoration-accent", ring)}
          >
            View calculation
          </button>
        </div>
      </div>
    </div>
  );
}

/** Provenance for any number: formula, inputs, source, time, and version (PROV-001). */
export function ProvenanceSheet({ kpi, onClose }: { kpi: Kpi | null; onClose: () => void }) {
  if (!kpi) return null;
  const p = kpi.provenance;
  return (
    <Sheet open onClose={onClose} eyebrow="Provenance" title={`${kpi.label} · ${kpi.value}`} width="max-w-lg">
      <StatusBadge tone="info">Demo data — illustrative calculation</StatusBadge>
      <dl className="mt-5 space-y-5 text-[13px]">
        <div>
          <dt className="text-label uppercase text-ink-3">Formula</dt>
          <dd className="mt-1.5 rounded-md border border-line bg-subtle px-3 py-2 font-data text-[12px] text-ink">{p.formula}</dd>
        </div>
        <div>
          <dt className="text-label uppercase text-ink-3">Inputs</dt>
          <dd className="mt-1.5">
            <ul className="divide-y divide-line rounded-md border border-line">
              {p.inputs.map((i) => (
                <li key={i} className="px-3 py-2 text-ink-2">
                  {i}
                </li>
              ))}
            </ul>
          </dd>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-label uppercase text-ink-3">Source</dt>
            <dd className="mt-1 text-ink-2">{p.source}</dd>
          </div>
          <div>
            <dt className="text-label uppercase text-ink-3">Calculated</dt>
            <dd className="mt-1 text-ink-2">
              {date(p.calculatedAt)} · {time(p.calculatedAt)}
            </dd>
          </div>
          <div>
            <dt className="text-label uppercase text-ink-3">Definition</dt>
            <dd className="mt-1 text-ink-2">{p.version}</dd>
          </div>
          <div>
            <dt className="text-label uppercase text-ink-3">Change</dt>
            <dd className="mt-1 text-ink-2">{kpi.delta} vs prior period</dd>
          </div>
        </div>
      </dl>
    </Sheet>
  );
}

/** AI output is always a proposal: labelled, sourced, and never applied without a person (AI-001). */
export function AiProposalCard({
  title,
  confidence,
  sources,
  children,
  onApprove,
  onEdit,
  onReject,
}: {
  title: string;
  confidence: "High" | "Medium" | "Low";
  sources: string[];
  children: React.ReactNode;
  onApprove: () => void;
  onEdit: () => void;
  onReject: () => void;
}) {
  return (
    <div className="rounded-lg border border-accent-line bg-accent-soft/40">
      <div className="flex items-center gap-2 border-b border-accent-line px-4 py-2.5">
        <Sparkles aria-hidden className="size-3.5 text-accent" />
        <p className="text-[13px] font-medium text-ink">{title}</p>
        <StatusBadge tone="accent" className="ml-auto">
          AI proposal · {confidence} confidence
        </StatusBadge>
      </div>
      <div className="space-y-3 px-4 py-3 text-[13px] leading-relaxed text-ink-2">{children}</div>
      <div className="border-t border-accent-line px-4 py-2.5">
        <p className="text-label uppercase text-ink-3">Sources</p>
        <ul className="mt-1.5 flex flex-wrap gap-1.5">
          {sources.map((s) => (
            <li key={s} className="rounded-sm border border-line bg-surface px-1.5 py-0.5 text-[11px] text-ink-2">
              {s}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-accent-line px-4 py-3">
        <Button variant="primary" size="sm" onClick={onApprove}>
          Approve
        </Button>
        <Button size="sm" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="danger" size="sm" onClick={onReject}>
          Reject
        </Button>
        <p className="ml-auto text-[11px] text-ink-3">Nothing is sent until a person approves.</p>
      </div>
    </div>
  );
}
