"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, CalendarDays, GanttChart, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormat } from "@/lib/use-format";
import { useDeals } from "@/lib/data/queries";
import { DEAL_STAGES, DEMO_NOW, buildDealEvents, fundById, type Deal, type DealStage } from "@/lib/demo";
import { PageBody, PageHeader } from "@/components/page/page-header";
import { Panel, PanelBody, PanelHead } from "@/components/page/panel";
import { Funnel } from "@/components/chart/funnel";
import { DataTable, type Column } from "@/components/data/data-table";
import { EntityCell, NumericCell, StatusCell } from "@/components/data/cells";
import { IconButton, ring } from "@/components/ui/button";
import { CountBadge, Monogram, StatusBadge, type Tone } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/controls";
import { Menu } from "@/components/ui/overlay";
import { FreshnessBadge, Skeleton, useToast } from "@/components/feedback";
import { useBreadcrumb } from "@/components/shell/shell-context";
import { DealCalendar, DealTimeline } from "./deal-schedule";

type View = "board" | "table" | "timeline" | "calendar";
export const EVIDENCE_TONE: Record<Deal["evidence"], Tone> = { Complete: "ok", Partial: "warn", Missing: "danger" };
const STAGE_TONE: Record<DealStage, string> = {
  Sourced: "bg-ink-4",
  Screening: "bg-chart-6",
  "Due Diligence": "bg-chart-3",
  "IC Review": "bg-chart-5",
  Approved: "bg-chart-1",
  Invested: "bg-chart-2",
  Passed: "bg-ink-4/50",
};
const now = new Date(DEMO_NOW);

export function ScoreMeter({ score }: { score: number }) {
  const tone = score >= 75 ? "bg-ok" : score >= 60 ? "bg-warn" : "bg-danger";
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium tabular-nums text-ink-2" title="Screening score (0–100)">
      <span aria-hidden className="h-1.5 w-10 overflow-hidden rounded-full bg-muted">
        <span className={cn("block h-full rounded-full", tone)} style={{ width: `${score}%` }} />
      </span>
      {score}
    </span>
  );
}

/**
 * Deal pipeline (plan §15): Board, Table and Timeline views over seven
 * stages, stage funnel with conversion, and actionable deal cards. Stage moves
 * go through an accessible menu, not drag-only.
 */
export function DealsView() {
  const f = useFormat();
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();
  useBreadcrumb(null);
  const q = useDeals();
  const [deals, setDeals] = useState<Deal[]>([]);
  useEffect(() => {
    if (q.data) setDeals(q.data);
  }, [q.data]);
  const view = (["board", "table", "timeline", "calendar"].includes(params.get("view") ?? "") ? params.get("view") : "board") as View;
  const setView = (v: View) => router.replace(`/app/deals${v === "board" ? "" : `?view=${v}`}`, { scroll: false });

  const move = (d: Deal, stage: DealStage) => {
    setDeals((xs) => xs.map((x) => (x.id === d.id ? { ...x, stage } : x)));
    toast({ tone: "ok", title: `${d.company} → ${stage}`, body: "Stage change recorded in this session (demo)." });
  };

  const events = useMemo(() => buildDealEvents(deals), [deals]);
  const open = deals.filter((d) => d.stage !== "Passed" && d.stage !== "Invested");
  const funnel = DEAL_STAGES.filter((s) => s !== "Passed").map((s, i, arr) => {
    const reached = deals.filter((d) => arr.indexOf(d.stage as (typeof arr)[number]) >= i || (d.stage === "Passed" && i <= 1));
    return { label: s, count: reached.length, value: reached.reduce((n, d) => n + d.size, 0) };
  });

  const cols: Column<Deal>[] = [
    { id: "company", header: "Company", width: 240, hideable: false, value: (d) => d.company, cell: (d) => <EntityCell name={d.company} sub={`${d.sector} · ${d.geography}`} href={`/app/deals/${d.id.toLowerCase()}`} /> },
    { id: "stage", header: "Stage", value: (d) => d.stage, sortValue: (d) => DEAL_STAGES.indexOf(d.stage), facet: true, groupable: true, cell: (d) => <span className="inline-flex items-center gap-1.5 text-ink-2"><span aria-hidden className={cn("size-2 rounded-full", STAGE_TONE[d.stage])} />{d.stage}</span> },
    { id: "size", header: "Ticket", value: (d) => d.size, align: "right", cell: (d) => <NumericCell value={d.size} />, aggregate: (r) => f.money(r.reduce((n, d) => n + d.size, 0)) },
    { id: "owner", header: "Owner", value: (d) => d.owner, facet: true, groupable: true },
    { id: "fund", header: "Fund", value: (d) => fundById(d.fundId)!.short, facet: true },
    { id: "age", header: "Age", value: (d) => d.ageDays, align: "right", cell: (d) => `${d.ageDays}d` },
    { id: "score", header: "Score", value: (d) => d.score, align: "right", cell: (d) => <ScoreMeter score={d.score} /> },
    { id: "evidence", header: "Evidence", value: (d) => d.evidence, facet: true, cell: (d) => <StatusCell tone={EVIDENCE_TONE[d.evidence]}>{d.evidence}</StatusCell> },
    { id: "risks", header: "Risk flags", value: (d) => d.risks.join(", ") || "—" },
    { id: "next", header: "Next action", value: (d) => d.nextAction },
    { id: "activity", header: "Latest activity", value: (d) => d.lastActivity.at, cell: (d) => <span className="text-[12px]">{d.lastActivity.title} <span className="text-ink-4">· {f.ago(d.lastActivity.at, now)}</span></span>, defaultHidden: true },
  ];

  return (
    <>
      <PageHeader
        variant="list"
        eyebrow="Invest"
        title="Deals"
        description="Pipeline from sourcing to investment committee."
        meta={
          <>
            <FreshnessBadge state="demo" />
            <span className="text-[12px] text-ink-3">
              {open.length} active · {f.money(open.reduce((n, d) => n + d.size, 0))} in play
            </span>
          </>
        }
        tabs={
          <Tabs<View>
            label="Pipeline view"
            value={view}
            onChange={setView}
            className="border-b-0"
            items={[
              { value: "board", label: "Board" },
              { value: "table", label: "Table", count: deals.length },
              { value: "timeline", label: "Timeline" },
              { value: "calendar", label: "Calendar", count: events.filter((e) => e.status !== "done").length },
            ]}
          />
        }
      />
      <PageBody className="space-y-4">
        {view === "board" && (
          <div className="grid grid-cols-1 gap-4 2xl:grid-cols-12">
            <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-2 2xl:col-span-9" role="list" aria-label="Pipeline stages">
              {DEAL_STAGES.map((stage) => {
                const items = deals.filter((d) => d.stage === stage);
                return (
                  <section key={stage} role="listitem" aria-label={`${stage}, ${items.length} deals`} className="flex w-[272px] shrink-0 flex-col rounded-lg border border-line bg-subtle">
                    <header className="flex items-center justify-between px-3 py-2.5">
                      <span className="flex items-center gap-2 text-[13px] font-semibold text-ink">
                        <span aria-hidden className={cn("size-2 rounded-full", STAGE_TONE[stage])} />
                        {stage}
                      </span>
                      <CountBadge>{items.length}</CountBadge>
                    </header>
                    <ul className="flex flex-1 flex-col gap-2 px-2 pb-2">
                      {q.isLoading && [0, 1].map((i) => <li key={i}><Skeleton className="h-28 w-full rounded-lg" /></li>)}
                      {items.map((d) => (
                        <li key={d.id}>
                          <DealCard deal={d} onMove={(s) => move(d, s)} />
                        </li>
                      ))}
                      {!q.isLoading && items.length === 0 && <li className="rounded-lg border border-dashed border-line-strong px-3 py-6 text-center text-[12px] text-ink-4">No deals</li>}
                    </ul>
                  </section>
                );
              })}
            </div>
            <Panel className="2xl:col-span-3">
              <PanelHead title="Stage funnel" description="Deals reaching each stage · conversion from previous" />
              <PanelBody>
                <Funnel stages={funnel} format={(v) => f.money(v)} label="Deal funnel" />
              </PanelBody>
            </Panel>
          </div>
        )}

        {view === "table" && (
          <DataTable
            id="deals"
            label="Deals"
            data={deals}
            status={q.isLoading ? "loading" : "ready"}
            columns={cols}
            rowId={(d) => d.id}
            demo
            totals
            onRowOpen={(d) => router.push(`/app/deals/${d.id.toLowerCase()}`)}
            exportName="octo-deals"
            views={[
              { id: "active", name: "Active pipeline", state: { facets: { stage: ["Sourced", "Screening", "Due Diligence", "IC Review", "Approved"] }, sort: [{ id: "stage", desc: true }] } },
              { id: "owner", name: "By owner", state: { groupBy: "owner" } },
              { id: "evidence", name: "Evidence gaps", state: { facets: { evidence: ["Partial", "Missing"] } } },
            ]}
            rowActions={(d) => DEAL_STAGES.filter((s) => s !== d.stage).map((s) => ({ label: `Move to ${s}`, onSelect: () => move(d, s) }))}
            empty={{ title: "No deals", body: "Deals arrive from the CRM or can be created from a prospect." }}
          />
        )}

        {view === "timeline" && (
          <Panel>
            <PanelHead title="Pipeline timeline" description="What happened, what is active, what is blocked and what happens next — across every deal" icon={<GanttChart />} />
            <PanelBody>
              <DealTimeline events={events} />
            </PanelBody>
          </Panel>
        )}

        {view === "calendar" && <DealCalendar events={events} />}
      </PageBody>
    </>
  );
}

function DealCard({ deal: d, onMove }: { deal: Deal; onMove: (s: DealStage) => void }) {
  const f = useFormat();
  return (
    <article className="group rounded-lg border border-line bg-surface p-3 transition-colors hover:border-line-strong">
      <div className="flex items-start gap-2">
        <Monogram name={d.company} size="sm" />
        <div className="min-w-0 flex-1">
          <Link href={`/app/deals/${d.id.toLowerCase()}`} className={cn("block truncate rounded-sm text-[13px] font-semibold text-ink hover:text-accent", ring)}>
            {d.company}
          </Link>
          <p className="truncate text-[11px] text-ink-3">
            {d.sector} · {d.geography}
          </p>
        </div>
        <Menu
          label={`Move ${d.company}`}
          items={DEAL_STAGES.filter((s) => s !== d.stage).map((s) => ({ label: `Move to ${s}`, icon: <ArrowRight />, onSelect: () => onMove(s) }))}
          trigger={({ ref, open, toggle }) => <IconButton ref={ref} size="xs" label={`Actions for ${d.company}`} aria-haspopup="menu" aria-expanded={open} icon={<MoreHorizontal />} onClick={toggle} />}
        />
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <span className="text-[15px] font-semibold tabular-nums text-ink">{f.money(d.size)}</span>
        <ScoreMeter score={d.score} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <StatusBadge tone={EVIDENCE_TONE[d.evidence]}>Evidence {d.evidence.toLowerCase()}</StatusBadge>
        {d.risks.map((r) => (
          <StatusBadge key={r} tone="warn" dot={false}>
            {r}
          </StatusBadge>
        ))}
      </div>
      <p className="mt-2 line-clamp-1 text-[12px] text-ink-2">
        <span className="text-ink-4">Next:</span> {d.nextAction}
      </p>
      <p className="mt-1 flex items-center justify-between text-[11px] text-ink-4">
        <span>
          {d.owner} · {d.ageDays}d
        </span>
        <span className="inline-flex items-center gap-1">
          <CalendarDays aria-hidden className="size-3" />
          {f.ago(d.lastActivity.at, now)}
        </span>
      </p>
    </article>
  );
}

