"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Info, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ago, date } from "@/lib/format";
import { ACTIVITY, BRIDGE, CASH_FLOWS, DEMO_NOW, EXPOSURE_CHANGES, INTELLIGENCE, KPIS, NAV_SERIES, SEVERITY_ORDER, WORK, type Kpi, type WorkItem, type WorkKind } from "@/lib/demo-data";
import { useWorkspace } from "@/lib/workspace";
import { PageBody, PageHeader } from "@/components/layout/page-header";
import { AiProposalCard, Card, MetricCard, ProvenanceSheet } from "@/components/data/cards";
import { AreaChart, PairedBars, Waterfall } from "@/components/data/charts";
import { Button, ringInset } from "@/components/ui/button";
import { EntityChip, StatusBadge, type Tone } from "@/components/ui/badge";
import { Tabs, Textarea } from "@/components/ui/controls";
import { Sheet } from "@/components/ui/overlay";
import { EmptyState, FreshnessBadge, useToast } from "@/components/ui/states";

export const SEVERITY_TONE: Record<WorkItem["severity"], Tone> = { critical: "danger", high: "warn", medium: "info", low: "neutral" };
const KIND_LABEL: Record<WorkKind, string> = { alert: "Alert", approval: "Approval", recon: "Recon break", stale: "Stale data", "ai-draft": "AI draft", evidence: "Evidence" };

type QueueFilter = "all" | "approval" | "recon" | "alert" | "ai-draft";

const now = new Date(DEMO_NOW);
const money1 = (v: number) => `${v < 0 ? "−" : ""}$${Math.abs(v).toFixed(1)}M`;

/**
 * Control Center (CC-001): what changed, what needs a decision, and what the
 * portfolio did this period — every number traceable to its calculation.
 */
export function ControlCenter() {
  const { current } = useWorkspace();
  const router = useRouter();
  const toast = useToast();
  const [explain, setExplain] = useState<Kpi | null>(null);
  const [filter, setFilter] = useState<QueueFilter>("all");
  const [done, setDone] = useState<Set<string>>(new Set());
  const [proposal, setProposal] = useState<WorkItem | null>(null);

  const open = WORK.filter((w) => !done.has(w.id)).sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
  const queue = filter === "all" ? open : open.filter((w) => w.kind === filter);
  const count = (k: WorkKind) => open.filter((w) => w.kind === k).length;

  const act = (w: WorkItem) => {
    if (w.kind === "ai-draft") return setProposal(w);
    if (w.kind === "approval") return router.push(`/app/workflows?tab=approvals&id=${w.id}`);
    if (w.kind === "recon") return router.push(`/app/workflows?tab=recon&id=${w.id}`);
    if (w.kind === "alert") return router.push(`/app/alerts?id=${w.id}`);
    toast({ tone: "info", title: `${w.action} — not sent`, body: "Demo workspace: requests are recorded once the workflow API ships." });
  };

  return (
    <>
      <PageHeader
        eyebrow={current.name}
        title="Control Center"
        description="What changed, what needs a decision, and how the portfolio moved this quarter."
        meta={
          <>
            <FreshnessBadge state="demo" asOf={`as of ${date(DEMO_NOW)}`} />
            <span className="text-[12px] text-ink-3">{open.length} open items · {count("approval")} approvals waiting on you</span>
          </>
        }
        actions={
          <>
            <Button size="sm" onClick={() => router.push("/app/alerts")}>
              View alerts
            </Button>
            <Button variant="primary" size="sm" onClick={() => router.push("/app/workflows")}>
              Open workflows <ArrowRight />
            </Button>
          </>
        }
      />

      <PageBody className="space-y-5">
        <p className="flex items-start gap-2 rounded-md border border-info/25 bg-info/8 px-3 py-2 text-[12px] text-ink-2">
          <Info aria-hidden className="mt-px size-3.5 shrink-0 text-info" />
          Portfolio metrics, queues, and feeds below are illustrative demo data. Workspaces load from the OCTO API when it is reachable.
        </p>

        {/* KPI row */}
        {/* Performance on the first row, operational load on the second. */}
        <section aria-label="Key metrics" className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-12">
          {KPIS.map((k, i) => (
            <div key={k.id} className={cn("grid", i < 4 ? "md:col-span-3" : "md:col-span-4", i === KPIS.length - 1 && "min-[420px]:max-md:col-span-2")}>
              <MetricCard kpi={k} onExplain={setExplain} />
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          {/* Priority action queue */}
          <Card
            title="Needs attention"
            meta="Sorted by severity, then age"
            className="xl:col-span-2"
            bodyClassName="p-0"
            actions={
              <Link href="/app/workflows" className={cn("rounded-sm text-[12px] text-accent hover:underline", ringInset)}>
                All work
              </Link>
            }
          >
            <Tabs<QueueFilter>
              label="Filter queue"
              value={filter}
              onChange={setFilter}
              className="px-4"
              items={[
                { value: "all", label: "All", count: open.length },
                { value: "approval", label: "Approvals", count: count("approval") },
                { value: "recon", label: "Recon", count: count("recon") },
                { value: "alert", label: "Alerts", count: count("alert") },
                { value: "ai-draft", label: "AI drafts", count: count("ai-draft") },
              ]}
            />
            {queue.length === 0 ? (
              <EmptyState title="Nothing waiting here" body="New items appear as alerts fire, breaks are detected, or approvals are requested." />
            ) : (
              <ul className="divide-y divide-line">
                {queue.map((w) => (
                  <li key={w.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
                    <div className="flex w-28 shrink-0 items-center gap-2">
                      <StatusBadge tone={SEVERITY_TONE[w.severity]} className="capitalize">
                        {w.severity}
                      </StatusBadge>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 text-[13px] font-medium text-ink">
                        <span className="truncate">{w.title}</span>
                        {w.kind === "ai-draft" && <Sparkles aria-label="AI generated" className="size-3.5 shrink-0 text-accent" />}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-ink-3">
                        <EntityChip type={w.entity.type} name={w.entity.name} />
                        <span>{KIND_LABEL[w.kind]}</span>
                        <span>{w.owner}</span>
                        <span>{w.due ? <span className={cn(w.due === "Today" && "font-medium text-warn")}>Due {w.due}</span> : ago(w.createdAt, now)}</span>
                        <span className="font-data text-[11px] text-ink-4">{w.id}</span>
                      </div>
                    </div>
                    <Button size="sm" variant={w.severity === "critical" ? "primary" : "secondary"} onClick={() => act(w)} className="self-start sm:self-auto">
                      {w.action}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Intelligence feed */}
          <Card title="Intelligence" meta="Signals matched to your portfolio" bodyClassName="p-0">
            <ul className="divide-y divide-line">
              {INTELLIGENCE.map((n) => (
                <li key={n.id} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="font-data uppercase tracking-[0.06em] text-accent">{n.kind}</span>
                    <span className="text-ink-4">{ago(n.at, now)}</span>
                  </div>
                  <p className="mt-1 text-[13px] font-medium leading-snug text-ink">{n.title}</p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-ink-3">{n.body}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Portfolio movement */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <Card title="Portfolio NAV" meta="Quarter-end, $M" className="xl:col-span-2">
            <AreaChart data={NAV_SERIES.map((d) => ({ x: d.q, y: d.nav }))} label="Portfolio NAV by quarter" format={(v) => `$${Math.round(v)}M`} />
          </Card>
          <Card title="Capital flows" meta="Calls vs distributions, $M">
            <PairedBars data={CASH_FLOWS.map((d) => ({ x: d.q, a: d.calls, b: d.dists }))} series={["Capital calls", "Distributions"]} label="Capital calls and distributions by quarter" format={money1} />
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <Card title="Q3 NAV bridge" meta="Opening to closing NAV, $M · axis starts above zero" className="xl:col-span-2">
            <Waterfall data={BRIDGE} label="Q3 NAV bridge" format={money1} />
          </Card>
          <div className="grid grid-cols-1 gap-5">
            <Card title="Exposure change" meta="Sector weight, change vs Q2" bodyClassName="p-0">
              <table className="w-full text-[13px]">
                <caption className="sr-only">Sector exposure and change versus prior quarter</caption>
                <tbody className="divide-y divide-line">
                  {EXPOSURE_CHANGES.map((e) => (
                    <tr key={e.sector}>
                      <th scope="row" className="px-4 py-2 text-left font-normal text-ink-2">
                        {e.sector}
                      </th>
                      <td className="px-2 py-2 text-right font-data tabular-nums text-ink">{e.weight.toFixed(1)}%</td>
                      <td className={cn("px-4 py-2 text-right font-data tabular-nums", e.change >= 0 ? "text-ok" : "text-danger")}>
                        {e.change >= 0 ? "+" : "−"}
                        {Math.abs(e.change).toFixed(1)} pp
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <Card title="Recent activity" bodyClassName="p-0">
              <ol className="divide-y divide-line">
                {ACTIVITY.map((a) => (
                  <li key={a.id} className="flex items-baseline justify-between gap-3 px-4 py-2 text-[12px]">
                    <span className="min-w-0 text-ink-3">
                      <span className="font-medium text-ink">{a.actor}</span> {a.verb} <span className="text-ink-2">{a.object}</span>
                    </span>
                    <span className="shrink-0 text-ink-4">{ago(a.at, now)}</span>
                  </li>
                ))}
              </ol>
            </Card>
          </div>
        </div>
      </PageBody>

      <ProvenanceSheet kpi={explain} onClose={() => setExplain(null)} />
      <ProposalSheet
        item={proposal}
        onClose={() => setProposal(null)}
        onResolved={(id, outcome) => {
          setDone((d) => new Set(d).add(id));
          setProposal(null);
          toast({ tone: outcome === "rejected" ? "info" : "ok", title: outcome === "rejected" ? "Draft rejected" : "Draft approved", body: "Recorded in this session only (demo)." });
        }}
      />
    </>
  );
}

const DRAFT = `Meridian Health EBITDA fell 6.1% quarter on quarter to $14.2M, driven by a one-off $1.1M ward refurbishment expensed in August and a 2.4-point rise in nurse agency costs. Revenue grew 3.8% on higher outpatient volumes. Management expects agency costs to normalise by Q1 2027 as 42 permanent hires start.`;

function ProposalSheet({ item, onClose, onResolved }: { item: WorkItem | null; onClose: () => void; onResolved: (id: string, outcome: "approved" | "rejected") => void }) {
  const [mode, setMode] = useState<"review" | "edit" | "reject">("review");
  const [text, setText] = useState(DRAFT);
  const [reason, setReason] = useState("");
  const reset = useMemo(
    () => () => {
      setMode("review");
      setText(DRAFT);
      setReason("");
    },
    [],
  );
  if (!item) return null;
  const close = () => {
    reset();
    onClose();
  };
  return (
    <Sheet
      open
      onClose={close}
      eyebrow={`${item.entity.type} · ${item.entity.name}`}
      title={item.title}
      footer={
        mode === "edit" ? (
          <div className="flex justify-end gap-2">
            <Button size="sm" onClick={() => setMode("review")}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={() => (reset(), onResolved(item.id, "approved"))}>
              Approve edited draft
            </Button>
          </div>
        ) : mode === "reject" ? (
          <div className="flex justify-end gap-2">
            <Button size="sm" onClick={() => setMode("review")}>
              Back
            </Button>
            <Button variant="danger" size="sm" disabled={reason.trim().length < 5} onClick={() => (reset(), onResolved(item.id, "rejected"))}>
              Reject draft
            </Button>
          </div>
        ) : null
      }
    >
      {mode === "review" && (
        <AiProposalCard
          title="Variance explanation"
          confidence="Medium"
          sources={["Q3 management accounts", "Aug board pack p.14", "Payroll extract Sep", "IBOR valuation Q3"]}
          onApprove={() => (reset(), onResolved(item.id, "approved"))}
          onEdit={() => setMode("edit")}
          onReject={() => setMode("reject")}
        >
          <p>{text}</p>
        </AiProposalCard>
      )}
      {mode === "edit" && (
        <div>
          <label htmlFor="draft-edit" className="text-[12px] font-medium text-ink-2">
            Edit draft before approving
          </label>
          <Textarea id="draft-edit" value={text} onChange={(e) => setText(e.target.value)} className="mt-1.5 min-h-48" />
          <p className="mt-1.5 text-[12px] text-ink-3">Edits are attributed to you in the audit trail.</p>
        </div>
      )}
      {mode === "reject" && (
        <div>
          <label htmlFor="reject-reason" className="text-[12px] font-medium text-ink-2">
            Why is this draft wrong? <span className="text-danger">*</span>
          </label>
          <Textarea id="reject-reason" value={reason} onChange={(e) => setReason(e.target.value)} className="mt-1.5" placeholder="e.g. refurbishment was capitalised, not expensed" aria-describedby="reject-hint" />
          <p id="reject-hint" className="mt-1.5 text-[12px] text-ink-3">
            Required. The reason is fed back to improve future drafts.
          </p>
        </div>
      )}
      <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-4 text-[12px]">
        <div>
          <dt className="text-ink-3">Generated</dt>
          <dd className="mt-0.5 text-ink-2">{ago(item.createdAt, now)} · model v2.1</dd>
        </div>
        <div>
          <dt className="text-ink-3">Reference</dt>
          <dd className="mt-0.5 font-data text-ink-2">{item.id}</dd>
        </div>
      </dl>
    </Sheet>
  );
}
