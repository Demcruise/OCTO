"use client";

import { notFound, useRouter, useSearchParams } from "next/navigation";
import { Check, FileText, Minus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormat } from "@/lib/use-format";
import { useDeal } from "@/lib/data/queries";
import { DEAL_STAGES, DEMO_NOW, REPORTS, at, dealEvents, fundById } from "@/lib/demo";
import { PageBody } from "@/components/page/page-header";
import { Panel, PanelBody, PanelHead } from "@/components/page/panel";
import { ObjectHeader, ObjectMetadata } from "@/components/object/object";
import { ChartShell } from "@/components/chart/chart-shell";
import { BarChart, RankingBars } from "@/components/chart/bar-chart";
import { Legend } from "@/components/chart/core";
import { Button, LinkButton } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/controls";
import { FreshnessBadge, InlineAlert, MetricSkeleton, PermissionState, useToast } from "@/components/feedback";
import { VerificationBadge } from "@/components/ai/ai-badge";
import { WorkflowStepper } from "@/components/workflow/workflow";
import { useBreadcrumb } from "@/components/shell/shell-context";
import { DealTimeline } from "./deal-schedule";
import { EVIDENCE_TONE, ScoreMeter } from "./deals";

const TABS = ["summary", "screening", "ddq", "documents", "valuation", "risks", "ic", "history"] as const;
type Tab = (typeof TABS)[number];
const LABEL: Record<Tab, string> = { summary: "Summary", screening: "Screening", ddq: "DDQ", documents: "Documents", valuation: "Valuation & returns", risks: "Risks", ic: "IC report", history: "Timeline" };
const now = new Date(DEMO_NOW);

/**
 * Deal detail (plan §15): summary, thesis, screening, DDQ, documents,
 * valuation and returns, risks, IC report, and decision history, with the
 * stage stepper always visible.
 */
export function DealDetail({ id }: { id: string }) {
  const f = useFormat();
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();
  const q = useDeal(id);
  const d = q.data;
  const tab = (TABS.includes(params.get("tab") as Tab) ? params.get("tab") : "summary") as Tab;

  useBreadcrumb(d ? [{ label: "Invest" }, { label: "Deals", href: "/app/deals" }, { label: d.company }] : null, d ? { type: "Deal", name: d.company, href: `/app/deals/${d.id.toLowerCase()}` } : undefined);

  if (q.isSuccess && !d) notFound();
  if (!d) return <PageBody><MetricSkeleton /></PageBody>;

  const stages = DEAL_STAGES.filter((s) => s !== "Passed");
  const idx = stages.indexOf(d.stage as (typeof stages)[number]);
  const steps = stages.map((s, i) => ({ label: s, state: (d.stage === "Passed" ? (i <= 1 ? "done" : "todo") : i < idx ? "done" : i === idx ? "current" : "todo") as "done" | "current" | "todo" }));
  const setTab = (t: Tab) => router.replace(`/app/deals/${d.id.toLowerCase()}${t === "summary" ? "" : `?tab=${t}`}`, { scroll: false });

  const screening = [
    { label: "Market attractiveness", value: Math.min(100, d.score + 6) },
    { label: "Business quality", value: Math.min(100, d.score + 2) },
    { label: "Management", value: d.risks.includes("Key person") ? 52 : Math.min(100, d.score + 4) },
    { label: "Financial profile", value: d.risks.includes("Leverage") ? 58 : d.score - 3 },
    { label: "ESG", value: d.risks.includes("ESG") ? 22 : 74 },
    { label: "Deal dynamics", value: d.score - 8 },
  ];
  const ddq = [
    { section: "Commercial", done: 14, total: 14 },
    { section: "Financial & QoE", done: d.evidence === "Complete" ? 22 : d.evidence === "Partial" ? 15 : 4, total: 22 },
    { section: "Legal", done: d.evidence === "Missing" ? 2 : 11, total: 12 },
    { section: "Tax", done: d.evidence === "Complete" ? 8 : 5, total: 8 },
    { section: "ESG & compliance", done: d.risks.includes("ESG") ? 3 : 9, total: 10 },
    { section: "Technology & cyber", done: d.evidence === "Complete" ? 6 : 2, total: 6 },
  ];
  const scenarios = [
    { label: "Downside", irr: Math.round(d.targetIrr * 0.45), moic: Math.round(d.targetMoic * 0.62 * 100) / 100 },
    { label: "Base", irr: d.targetIrr, moic: d.targetMoic },
    { label: "Upside", irr: Math.round(d.targetIrr * 1.35), moic: Math.round(d.targetMoic * 1.3 * 100) / 100 },
  ];
  const ic = REPORTS.find((r) => r.type === "IC memo" && d.company.startsWith("Kirana"));

  return (
    <>
      <ObjectHeader
        type="Deal"
        name={d.company}
        status={<StatusBadge tone={d.stage === "Passed" ? "neutral" : d.stage === "Invested" ? "ok" : "accent"}>{d.stage}</StatusBadge>}
        classification={[d.sector, d.geography, fundById(d.fundId)!.short]}
        facts={[
          { label: "Ticket", value: f.money(d.size) },
          { label: "Enterprise value", value: f.money(d.ev) },
          { label: "Owner", value: d.owner },
          { label: "Score", value: <ScoreMeter score={d.score} /> },
          { label: "Evidence", value: <StatusBadge tone={EVIDENCE_TONE[d.evidence]}>{d.evidence}</StatusBadge> },
        ]}
        freshness={<FreshnessBadge state="demo" asOf={`updated ${f.ago(d.lastActivity.at, now)}`} />}
        permission="Deal team only"
        actions={
          <>
            <Button onClick={() => toast({ tone: "info", title: "Evidence requested", body: `${d.nextAction} · sent to the deal team (demo).` })}>Request evidence</Button>
            <Button variant="primary" onClick={() => toast({ tone: "ok", title: "Next action recorded", body: d.nextAction })}>
              {d.nextAction === "—" ? "Archive" : d.nextAction}
            </Button>
          </>
        }
        tabs={<Tabs<Tab> label="Deal sections" value={tab} onChange={setTab} className="border-b-0" items={TABS.map((t) => ({ value: t, label: LABEL[t] }))} />}
      />
      <PageBody className="space-y-4">
        <Panel>
          <PanelBody className="py-3">
            <WorkflowStepper steps={steps} />
          </PanelBody>
        </Panel>

        {tab === "summary" && (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <Panel className="xl:col-span-8">
              <PanelHead title="Investment thesis" />
              <PanelBody className="space-y-4">
                <p className="text-[14px] leading-relaxed text-ink-2">{d.thesis}</p>
                <ObjectMetadata columns={3} items={[{ label: "Target IRR", value: f.pct(d.targetIrr, 0) }, { label: "Target MOIC", value: f.multiple(d.targetMoic) }, { label: "EV / EBITDA", value: d.evEbitda ? f.multiple(d.evEbitda) : "n/m (pre-profit)" }, { label: "Fund", value: fundById(d.fundId)!.name }, { label: "Days in pipeline", value: d.ageDays }, { label: "Latest activity", value: `${d.lastActivity.title} · ${f.ago(d.lastActivity.at, now)}` }]} />
              </PanelBody>
            </Panel>
            <Panel className="xl:col-span-4">
              <PanelHead title="Next action" />
              <PanelBody className="space-y-3">
                <p className="text-[14px] font-medium text-ink">{d.nextAction}</p>
                {d.evidence !== "Complete" && <InlineAlert tone="warn">Evidence is {d.evidence.toLowerCase()}. IC review needs the DDQ complete.</InlineAlert>}
                {d.risks.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {d.risks.map((r) => (
                      <StatusBadge key={r} tone="warn">{r}</StatusBadge>
                    ))}
                  </div>
                )}
              </PanelBody>
            </Panel>
          </div>
        )}

        {tab === "screening" && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Panel>
              <PanelHead title="Screening score" description={`Overall ${d.score} / 100 · screening model v3`} />
              <PanelBody>
                <RankingBars label="Screening criteria" format={(v) => `${v}`} max={100} items={screening.map((s) => ({ label: s.label, value: s.value, color: s.value >= 70 ? "var(--color-gain)" : s.value >= 50 ? "var(--color-chart-3)" : "var(--color-loss)" }))} />
              </PanelBody>
            </Panel>
            <Panel>
              <PanelHead title="Screening notes" toolbar={<VerificationBadge state="ai-suggested" />} />
              <PanelBody className="space-y-2 text-[13px] leading-relaxed text-ink-2">
                <p>The business screens above the fund hurdle on market and quality. {d.risks.length ? `Flags: ${d.risks.join(", ").toLowerCase()}.` : "No blocking flags."}</p>
                <p className="text-[12px] text-ink-3">AI-assisted screening summary — a person must review before it is used in the IC memo.</p>
              </PanelBody>
            </Panel>
          </div>
        )}

        {tab === "ddq" && (
          <Panel>
            <PanelHead title="Due-diligence questionnaire" description={`${ddq.reduce((n, s) => n + s.done, 0)} of ${ddq.reduce((n, s) => n + s.total, 0)} answered`} />
            <PanelBody>
              <ul className="divide-y divide-line">
                {ddq.map((s) => {
                  const pct = s.done / s.total;
                  return (
                    <li key={s.section} className="grid grid-cols-[1fr_8rem_4rem] items-center gap-3 py-2.5 text-[13px]">
                      <span className="flex items-center gap-2 font-medium text-ink">
                        {pct === 1 ? <Check aria-hidden className="size-3.5 text-ok" /> : pct < 0.5 ? <X aria-hidden className="size-3.5 text-danger" /> : <Minus aria-hidden className="size-3.5 text-warn" />}
                        {s.section}
                      </span>
                      <span className="h-1.5 overflow-hidden rounded-full bg-muted" role="img" aria-label={`${Math.round(pct * 100)}% complete`}>
                        <span className={cn("block h-full rounded-full", pct === 1 ? "bg-ok" : pct < 0.5 ? "bg-danger" : "bg-warn")} style={{ width: `${pct * 100}%` }} />
                      </span>
                      <span className="text-right tabular-nums text-ink-3">
                        {s.done}/{s.total}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </PanelBody>
          </Panel>
        )}

        {tab === "documents" && (
          <Panel>
            <PanelHead title="Data room" />
            <PanelBody className="space-y-2">
              {["Information memorandum", "Management presentation", "Financial model v6", "QoE report (draft)", "Legal DD red-flag report"].map((n, i) => (
                <div key={n} className="flex items-center gap-2.5 rounded-lg border border-line px-3 py-2 text-[13px]">
                  <FileText aria-hidden className="size-4 text-ink-3" />
                  <span className="flex-1 font-medium text-ink">{n}</span>
                  <span className="text-[12px] text-ink-4">{f.date(at(24 * (i * 6 + 2)))}</span>
                </div>
              ))}
              <PermissionState compact className="px-3 py-1" />
            </PanelBody>
          </Panel>
        )}

        {tab === "valuation" && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <Panel className="lg:col-span-4">
              <PanelHead title="Valuation" />
              <PanelBody>
                <ObjectMetadata columns={1} items={[{ label: "Enterprise value", value: f.money(d.ev) }, { label: "EV / EBITDA", value: d.evEbitda ? f.multiple(d.evEbitda) : "n/m" }, { label: "Equity ticket", value: f.money(d.size) }, { label: "Implied ownership", value: f.pct((d.size / d.ev) * 100, 0) }, { label: "Method", value: d.evEbitda ? "Trading comps + DCF" : "Revenue multiple + DCF" }]} />
              </PanelBody>
            </Panel>
            <ChartShell className="lg:col-span-8" title="Return scenarios" subtitle="Gross IRR by scenario, %" legend={<Legend items={[{ label: "IRR", color: "var(--color-chart-1)" }]} />} height={220} exportData={{ filename: `${d.id}-scenarios`, head: ["Scenario", "IRR %", "MOIC"], rows: scenarios.map((s) => [s.label, s.irr, s.moic]) }}>
              <BarChart x={scenarios.map((s) => `${s.label} · ${f.multiple(s.moic)}`)} series={[{ id: "irr", label: "IRR", values: scenarios.map((s) => s.irr) }]} format={(v) => f.pct(v, 0)} label="Return scenarios" />
            </ChartShell>
          </div>
        )}

        {tab === "risks" && (
          <Panel>
            <PanelHead title="Risk register" />
            <PanelBody>
              {d.risks.length === 0 ? (
                <p className="text-[13px] text-ink-3">No risks raised.</p>
              ) : (
                <ul className="space-y-2">
                  {d.risks.map((r) => (
                    <li key={r} className="flex items-center gap-3 rounded-lg border border-line px-3 py-2.5 text-[13px]">
                      <StatusBadge tone="warn">{r}</StatusBadge>
                      <span className="flex-1 text-ink-2">Mitigation owner: {d.owner}. Review at IC.</span>
                    </li>
                  ))}
                </ul>
              )}
            </PanelBody>
          </Panel>
        )}

        {tab === "ic" && (
          <Panel>
            <PanelHead title="IC report" />
            <PanelBody className="space-y-3 text-[13px]">
              {ic ? (
                <>
                  <p className="text-ink-2">
                    <span className="font-medium text-ink">{ic.name}</span> · {ic.version} · {ic.status}
                  </p>
                  <LinkButton href={`/app/reports/${ic.id.toLowerCase()}`} variant="primary" size="sm">
                    Open IC memo
                  </LinkButton>
                </>
              ) : (
                <>
                  <p className="text-ink-3">No IC memo yet. Drafting is available once the DDQ is complete.</p>
                  <LinkButton href={`/app/reports?new=1&deal=${d.id}`} size="sm" aria-disabled={d.evidence !== "Complete"}>
                    Draft IC memo
                  </LinkButton>
                </>
              )}
            </PanelBody>
          </Panel>
        )}

        {tab === "history" && (
          <Panel>
            <PanelHead title="Timeline and decisions" description="Same events as the pipeline calendar: what happened, what is active, what is blocked and what happens next" />
            <PanelBody>
              <DealTimeline events={dealEvents(d.id)} showDeal={false} />
              <div className="mt-4 flex flex-wrap gap-2">
                <LinkButton size="sm" href="/app/deals?view=calendar">
                  Open pipeline calendar
                </LinkButton>
                <LinkButton size="sm" variant="ghost" href="/app/deals">
                  Back to pipeline
                </LinkButton>
              </div>
            </PanelBody>
          </Panel>
        )}
      </PageBody>
    </>
  );
}
