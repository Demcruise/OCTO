"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, GitCompareArrows } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormat } from "@/lib/use-format";
import { useRecon } from "@/lib/data/queries";
import { DEMO_NOW, PORTFOLIO_METRICS, SEVERITY_ORDER, hrefFor, type Metric, type ReconBreak, type ReconState } from "@/lib/demo";
import { PageBody, PageHeader } from "@/components/page/page-header";
import { MetricCard, MetricGrid } from "@/components/metric/metric-card";
import { DataTable, type Column } from "@/components/data/data-table";
import { NumericCell } from "@/components/data/cells";
import { EntityChip } from "@/components/ui/badge";
import { ringInset } from "@/components/ui/button";
import { Sheet } from "@/components/ui/overlay";
import { FreshnessBadge, useToast } from "@/components/feedback";
import { AuditTrail, DecisionPanel, SeverityBadge, WorkflowStatus } from "@/components/workflow/workflow";
import { useBreadcrumb } from "@/components/shell/shell-context";

const now = new Date(DEMO_NOW);

const RESOLUTIONS = [
  { id: "mapping", label: "Fix mapping", body: "The source is right but mapped to the wrong IBOR field or instrument." },
  { id: "source", label: "Correct source", body: "The source is wrong; request a corrected file from the provider." },
  { id: "ibor", label: "Accept IBOR", body: "The IBOR is right; record why the source differs." },
  { id: "escalate", label: "Escalate", body: "Needs a controller or the fund administrator to decide." },
] as const;

/**
 * Reconciliation workspace (plan §16): break queue and a detail drawer with
 * source vs IBOR side by side, mapping rule, lineage, source timestamp,
 * previous resolution and related ledger events. Every resolution needs a
 * reason and lands in the audit trail — breaks cannot be ignored.
 */
export function ReconciliationView() {
  const f = useFormat();
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();
  useBreadcrumb(null);
  const q = useRecon();
  const [breaks, setBreaks] = useState<ReconBreak[]>([]);
  const [audit, setAudit] = useState<Record<string, { id: string; actor: string; action: string; at: string; note?: string }[]>>({});
  useEffect(() => {
    if (q.data) setBreaks(q.data);
  }, [q.data]);

  const openId = params.get("id");
  const open = breaks.find((b) => b.id === openId) ?? null;
  const setOpen = (id: string | null) => router.replace(id ? `/app/reconciliation?id=${id}` : "/app/reconciliation", { scroll: false });

  const active = breaks.filter((b) => b.state !== "Resolved");
  const oldest = Math.max(0, ...active.map((b) => b.ageHours));
  const prov = PORTFOLIO_METRICS[0].provenance;
  const kpis: Metric[] = [
    { id: "open", label: "Open breaks", value: active.length, format: "count", comparison: `${active.filter((b) => b.severity === "high" || b.severity === "critical").length} high severity`, provenance: { ...prov, formula: "count(state ≠ Resolved)", inputs: active.map((b) => ({ label: b.id, value: b.field })) } },
    { id: "variance", label: "Absolute variance", value: active.reduce((n, b) => n + b.varianceAbs, 0), format: "money", comparison: "sum of open breaks", provenance: { ...prov, formula: "Σ |source − IBOR|", inputs: active.map((b) => ({ label: b.id, value: b.variance })) } },
    { id: "oldest", label: "Oldest break", value: Math.round(oldest / 24), format: "count", comparison: "days open", upIsGood: false, provenance: { ...prov, formula: "max(age of open breaks)", inputs: [] } },
    { id: "auto", label: "Auto-matched", value: 98.6, format: "pct", delta: 0.4, deltaUnit: "pts", upIsGood: true, comparison: "of 18,420 records today", provenance: { ...prov, formula: "matched ÷ records ingested", inputs: [{ label: "Records", value: "18,420" }, { label: "Matched", value: "18,162" }] } },
  ];

  const cols: Column<ReconBreak>[] = [
    { id: "id", header: "Break", width: 110, hideable: false, value: (b) => b.id, cell: (b) => <span className="font-data text-[12px] font-medium text-ink">{b.id}</span> },
    { id: "entity", header: "Entity", value: (b) => b.entity.name, facet: true, cell: (b) => <EntityChip type={b.entity.type} name={b.entity.name} href={hrefFor(b.entity)} /> },
    { id: "field", header: "Field", value: (b) => b.field },
    { id: "source", header: "Source", value: (b) => b.source, facet: true, groupable: true },
    { id: "sv", header: "Source value", value: (b) => b.sourceValue, align: "right", cell: (b) => <span className="tabular-nums">{b.sourceValue}</span> },
    { id: "iv", header: "IBOR value", value: (b) => b.iborValue, align: "right", cell: (b) => <span className="tabular-nums">{b.iborValue}</span> },
    { id: "variance", header: "Variance", value: (b) => b.variance, sortValue: (b) => b.varianceAbs, align: "right", cell: (b) => <span className={cn("font-medium tabular-nums", b.varianceAbs ? "text-danger" : "text-ink-3")}>{b.variance}</span>, aggregate: (r) => f.money(r.reduce((n, b) => n + b.varianceAbs, 0)) },
    { id: "age", header: "Age", value: (b) => b.ageHours, align: "right", cell: (b) => (b.ageHours < 48 ? `${b.ageHours}h` : `${Math.round(b.ageHours / 24)}d`) },
    { id: "sev", header: "Severity", value: (b) => b.severity, sortValue: (b) => SEVERITY_ORDER[b.severity], facet: true, cell: (b) => <SeverityBadge severity={b.severity} /> },
    { id: "owner", header: "Owner", value: (b) => b.owner, facet: true },
    { id: "state", header: "State", value: (b) => b.state, facet: true, groupable: true, cell: (b) => <WorkflowStatus state={b.state} /> },
  ];

  const resolve = (b: ReconBreak, how: string, note: string) => {
    const state: ReconState = how === "Escalate" ? "Escalated" : "Resolved";
    setBreaks((xs) => xs.map((x) => (x.id === b.id ? { ...x, state } : x)));
    setAudit((a) => ({ ...a, [b.id]: [{ id: `${b.id}-${Date.now()}`, actor: "You", action: `${how.toLowerCase()} (${state.toLowerCase()})`, at: "just now", note }, ...(a[b.id] ?? [])] }));
    toast({ tone: "ok", title: `${b.id} · ${how}`, body: "Recorded in the audit trail for this session (demo)." });
    if (state === "Resolved") setOpen(null);
  };

  return (
    <>
      <PageHeader variant="workflow" eyebrow="Operate" title="Reconciliation" description="Where a source disagrees with the IBOR. Every break gets a resolution and a reason." meta={<FreshnessBadge state="demo" asOf={`matched ${f.time(DEMO_NOW)}`} />} />
      <PageBody className="space-y-4">
        <MetricGrid cols={4}>
          {kpis.map((m) => (
            <MetricCard key={m.id} metric={m} variant="compact" state={q.isLoading ? "loading" : "ready"} />
          ))}
        </MetricGrid>
        <DataTable
          id="recon"
          label="Reconciliation breaks"
          data={breaks}
          status={q.isLoading ? "loading" : "ready"}
          columns={cols}
          rowId={(b) => b.id}
          demo
          totals
          activeRowId={openId}
          onRowOpen={(b) => setOpen(b.id)}
          exportName="octo-recon-breaks"
          staleNotice="Harbour Administration's file for 29 Sep arrived late; its breaks may be incomplete until the next run."
          views={[
            { id: "open", name: "Open queue", state: { facets: { state: ["Open", "Investigating", "Escalated"] }, sort: [{ id: "sev", desc: false }, { id: "age", desc: true }] } },
            { id: "source", name: "By source", state: { groupBy: "source" } },
            { id: "all", name: "All breaks", state: {} },
          ]}
          renderExpanded={(b) => <p className="text-[12px] text-ink-3">Likely cause: {b.cause} · mapping {b.mappingRule}</p>}
          empty={{ title: "Books are reconciled", body: "Breaks appear when a source value disagrees with the IBOR." }}
        />
      </PageBody>

      <Sheet open={!!open} onClose={() => setOpen(null)} eyebrow={open ? `Reconciliation · ${open.id}` : ""} title={open?.field ?? ""} width="max-w-2xl">
        {open && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <SeverityBadge severity={open.severity} />
              <WorkflowStatus state={open.state} />
              <EntityChip type={open.entity.type} name={open.entity.name} href={hrefFor(open.entity)} />
              <span className="text-[12px] text-ink-3">Owner {open.owner}</span>
            </div>

            <section aria-label="Source versus IBOR" className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div className="rounded-xl border border-line p-4">
                <p className="text-[12px] text-ink-3">{open.source}</p>
                <p className="mt-1 text-metric font-semibold tabular-nums text-ink">{open.sourceValue}</p>
                <p className="mt-1 text-[11px] text-ink-4">Received {f.dateTime(open.sourceTimestamp)} UTC</p>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <GitCompareArrows aria-hidden className="size-4 text-ink-4" />
                <span className="text-[12px] font-semibold tabular-nums text-danger">{open.variance}</span>
              </div>
              <div className="rounded-xl border border-line p-4">
                <p className="text-[12px] text-ink-3">IBOR (derived from ledger)</p>
                <p className="mt-1 text-metric font-semibold tabular-nums text-ink">{open.iborValue}</p>
                <p className="mt-1 text-[11px] text-ink-4">As of last ledger post</p>
              </div>
            </section>

            <dl className="grid grid-cols-1 gap-4 text-[13px] sm:grid-cols-2">
              <div>
                <dt className="text-[12px] text-ink-3">Likely cause</dt>
                <dd className="mt-0.5 text-ink-2">{open.cause}</dd>
              </div>
              <div>
                <dt className="text-[12px] text-ink-3">Mapping rule</dt>
                <dd className="mt-0.5 font-data text-[12px] text-ink-2">{open.mappingRule}</dd>
              </div>
              <div>
                <dt className="text-[12px] text-ink-3">Previous resolution</dt>
                <dd className="mt-0.5 text-ink-2">{open.previousResolution ?? "None on record"}</dd>
              </div>
              <div>
                <dt className="text-[12px] text-ink-3">Lineage</dt>
                <dd className="mt-0.5 flex flex-wrap items-center gap-1 text-[12px] text-ink-2">
                  {open.source} <ArrowRight aria-hidden className="size-3 text-ink-4" /> {open.mappingRule.split(" ")[0]} <ArrowRight aria-hidden className="size-3 text-ink-4" /> IBOR ledger
                </dd>
              </div>
            </dl>

            <section aria-label="Related ledger events">
              <h3 className="text-[12px] font-medium text-ink-3">Related ledger events</h3>
              {open.ledgerEvents.length ? (
                <ul className="mt-2 divide-y divide-line rounded-lg border border-line">
                  {open.ledgerEvents.map((e) => (
                    <li key={e.id} className="flex items-center justify-between gap-3 px-3 py-2 text-[12px]">
                      <span className="text-ink-2">
                        <span className="font-data text-ink-3">{e.id}</span> · {e.label}
                      </span>
                      <span className="text-ink-4">{f.ago(e.at, now)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-[12px] text-ink-3">No ledger events linked.</p>
              )}
            </section>

            {open.state !== "Resolved" ? (
              <ResolutionForm key={open.id} item={open} onResolve={resolve} />
            ) : (
              <p className="rounded-lg bg-ok/10 px-3 py-2 text-[12px] text-ink-2">Resolved. Re-opens automatically if the next run disagrees again.</p>
            )}

            <section aria-label="Audit trail">
              <h3 className="mb-2 text-[12px] font-medium text-ink-3">Audit trail</h3>
              <AuditTrail events={[...(audit[open.id] ?? []), { id: `${open.id}-created`, actor: "OCTO recon engine", action: `opened ${open.id} (${open.variance})`, at: f.ago(new Date(now.getTime() - open.ageHours * 3600_000).toISOString(), now) }]} />
            </section>
          </div>
        )}
      </Sheet>
    </>
  );
}

function ResolutionForm({ item, onResolve }: { item: ReconBreak; onResolve: (b: ReconBreak, how: string, note: string) => void }) {
  const [choice, setChoice] = useState<(typeof RESOLUTIONS)[number]["id"] | null>(null);
  const picked = RESOLUTIONS.find((r) => r.id === choice);
  return (
    <section aria-label="Resolve break" className="space-y-4 rounded-xl border border-line p-4">
      <fieldset>
        <legend className="text-[12px] font-medium text-ink-2">
          Resolution <span className="text-danger">*</span>
        </legend>
        <div role="radiogroup" className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {RESOLUTIONS.map((r) => (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={choice === r.id}
              onClick={() => setChoice(r.id)}
              className={cn("flex cursor-pointer flex-col items-start rounded-lg border px-3 py-2.5 text-left transition-colors", choice === r.id ? "border-accent bg-accent-soft" : "border-line hover:bg-hover", ringInset)}
            >
              <span className="text-[13px] font-medium text-ink">{r.label}</span>
              <span className="mt-0.5 text-[12px] text-ink-3">{r.body}</span>
            </button>
          ))}
        </div>
      </fieldset>
      {picked ? (
        <DecisionPanel idPrefix={`rec-${item.id}`} noteLabel="Evidence and reasoning" decisions={[{ id: picked.id, label: picked.id === "escalate" ? "Escalate break" : `Resolve · ${picked.label}`, variant: "primary" }]} onDecide={(_, note) => onResolve(item, picked.label, note)} />
      ) : (
        <p className="text-[12px] text-ink-3">Choose a resolution. Breaks can’t be dismissed without one.</p>
      )}
    </section>
  );
}
