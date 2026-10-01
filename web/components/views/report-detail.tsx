"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowDown, ArrowRight, ArrowUp, CheckCircle2, Download, Eye, FileText, GripVertical, Link2, Lock, Pencil, Plus, Quote, RotateCw, Send, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormat } from "@/lib/use-format";
import { useReports } from "@/lib/data/queries";
import { BRIDGE, DEMO_NOW, EXCEPTIONS, FUNDS, NAV_SERIES, PORTFOLIO, RECON, fundBridge, fundById, fundDpi, fundNavSeries, fundTvpi, type Fund, type Report } from "@/lib/demo";
import { PageBody, PageHeader } from "@/components/page/page-header";
import { Panel, PanelBody, PanelHead } from "@/components/page/panel";
import { Button, IconButton, LinkButton, ringInset } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Segmented, Tabs } from "@/components/ui/controls";
import { EmptyState, FreshnessBadge, InlineAlert, MetricSkeleton, useToast } from "@/components/feedback";
import { VerificationBadge } from "@/components/ai/ai-badge";
import { DecisionPanel, SeverityBadge, WorkflowStepper } from "@/components/workflow/workflow";
import { NavChart } from "@/components/chart/nav-chart";
import { ChartShell } from "@/components/chart/chart-shell";
import { WaterfallChart } from "@/components/chart/waterfall-chart";
import { Legend } from "@/components/chart/core";
import { ActivityTimeline } from "@/components/chart/timeline";
import { useBreadcrumb } from "@/components/shell/shell-context";
import { REPORT_TONE } from "./reports";

const now = new Date(DEMO_NOW);
type Tab = "report" | "builder" | "review" | "history" | "access";
const TABS: Tab[] = ["report", "builder", "review", "history", "access"];

const periodOf = (r: Report) => r.name.match(/Q[1-4] \d{4}/)?.[0] ?? (r.status === "Template" ? "Set per report" : "Q3 2026");
const fmtM = (v: number) => `${v < 0 ? "−" : ""}$${Math.abs(v).toFixed(1)}M`;

/**
 * Report detail (V2 REPORT-001…006). Every report — draft, pending, published,
 * scheduled, template or archived — opens to real content: a facts strip
 * (period, scope, owner, status, updated, freshness), the actions Edit /
 * Review / Approve / Publish / Export with visible gating, and tabs for the
 * LP-style reader, the builder, review and approval, history, and access.
 */
export function ReportDetail({ id }: { id: string }) {
  const f = useFormat();
  const toast = useToast();
  const router = useRouter();
  const params = useSearchParams();
  const q = useReports();
  const found = q.data?.find((r) => r.id.toLowerCase() === id.toLowerCase());
  const [report, setReport] = useState<Report | null>(null);
  const [approved, setApproved] = useState(false);
  useEffect(() => void (found && setReport(found)), [found]);
  const tab = (TABS.includes(params.get("tab") as Tab) ? params.get("tab") : "report") as Tab;
  const setTab = (t: Tab) => router.replace(`/app/reports/${id.toLowerCase()}${t === "report" ? "" : `?tab=${t}`}`, { scroll: false });

  useBreadcrumb(found ? [{ label: "Insight" }, { label: "Reports", href: "/app/reports" }, { label: found.name }] : null, found ? { type: "Report", name: found.name, href: `/app/reports/${found.id.toLowerCase()}` } : undefined);

  if (q.isSuccess && !found)
    return (
      <PageBody>
        <Panel>
          <EmptyState icon={<FileText />} title="This report isn’t available" body={`No report with the id ${id.toUpperCase()} exists in this workspace, or it was created in another session. Reports created in the demo live only in the browser session that made them.`} action={<LinkButton href="/app/reports">Back to reports</LinkButton>} />
        </Panel>
      </PageBody>
    );
  if (!report) return <PageBody><MetricSkeleton /></PageBody>;

  const issues = report.sections.filter((s) => !s.valid);
  const fund = report.fund ? fundById(report.fund) : undefined;
  const readOnly = report.status === "Published" || report.status === "Archived";
  const isTemplate = report.status === "Template";
  const canApprove = report.status === "Pending approval" && issues.length === 0 && !approved;
  const canPublish = approved && issues.length === 0 && report.status === "Pending approval";
  const stamp = (note: string) => [{ version: report.version, by: "You", at: DEMO_NOW, note }, ...report.history];

  const publishReason = report.status === "Published" ? "Already published." : issues.length > 0 ? `${issues.length} validation issue${issues.length > 1 ? "s" : ""} open.` : !approved ? "Needs an approval first." : "Ready to publish.";

  return (
    <>
      <PageHeader
        variant="list"
        eyebrow={`${report.type} · ${report.version} · ${report.id}`}
        title={report.name}
        meta={
          <>
            <StatusBadge tone={approved && report.status === "Pending approval" ? "ok" : REPORT_TONE[report.status]}>{approved && report.status === "Pending approval" ? "Approved · ready to publish" : report.status}</StatusBadge>
            {issues.length > 0 ? (
              <span className="inline-flex items-center gap-1 text-[12px] text-warn">
                <AlertTriangle aria-hidden className="size-3.5" /> {issues.length} validation issue{issues.length > 1 ? "s" : ""}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[12px] text-ok">
                <CheckCircle2 aria-hidden className="size-3.5" /> Valid
              </span>
            )}
            <FreshnessBadge state="demo" asOf={`updated ${f.ago(report.updatedAt, now)}`} />
          </>
        }
        actions={
          <>
            <Button disabled={readOnly || isTemplate} title={readOnly ? "Published and archived reports are read-only" : undefined} onClick={() => setTab("builder")}>
              <Pencil /> Edit
            </Button>
            <Button onClick={() => setTab("review")}>
              <Eye /> Review
            </Button>
            <Button disabled={!canApprove} title={canApprove ? undefined : report.status !== "Pending approval" ? "Only reports pending approval can be approved" : issues.length ? "Resolve validation issues first" : "Already approved"} onClick={() => setTab("review")}>
              <ShieldCheck /> Approve
            </Button>
            <Button
              variant="primary"
              disabled={!canPublish}
              title={publishReason}
              onClick={() => {
                setReport({ ...report, status: "Published", history: stamp("Published to LP portal") });
                toast({ tone: "ok", title: "Report published", body: "Published in this session only (demo)." });
              }}
            >
              <Send /> Publish
            </Button>
            <Button disabled={isTemplate} onClick={() => toast({ tone: "ok", title: "Export prepared", body: `${report.name}.pdf (demo — no file is created).` })}>
              <Download /> Export
            </Button>
          </>
        }
        tabs={
          <Tabs<Tab>
            label="Report sections"
            variant="pill"
            className="pb-3"
            value={tab}
            onChange={setTab}
            items={[
              { value: "report", label: "Report" },
              { value: "builder", label: "Builder", count: report.sections.length },
              { value: "review", label: "Review & approval", count: issues.length || undefined },
              { value: "history", label: "History", count: report.history.length },
              { value: "access", label: "Access" },
            ]}
          />
        }
      />

      <PageBody className="space-y-6">
        <Facts report={report} fund={fund} />

        {report.status === "Archived" && <InlineAlert tone="restricted" title="Archived · read-only">Kept for the audit trail. Figures are frozen at publication and are not refreshed.</InlineAlert>}
        {report.status === "Scheduled" && (
          <InlineAlert tone="info" title={`Scheduled · ${report.schedule}`} action={<Button size="sm" onClick={() => toast({ tone: "ok", title: "Run queued", body: `${report.name} will regenerate now (demo).` })}><RotateCw /> Run now</Button>}>
            The content below is the last run. The next run regenerates from IBOR and goes to the risk committee distribution list.
          </InlineAlert>
        )}

        {tab === "report" &&
          (isTemplate ? (
            <Panel>
              <EmptyState
                icon={<FileText />}
                title="This is a template"
                body={`${report.sections.length || "No"} sections, each bound to IBOR data. Create a report from it to choose a period and scope, then generate, review and publish.`}
                action={<LinkButton variant="primary" href="/app/reports?new=1">Use this template <ArrowRight /></LinkButton>}
              />
            </Panel>
          ) : (
            <ReportReview report={report} fund={fund} />
          ))}

        {tab === "builder" && <Builder report={report} setReport={setReport} readOnly={readOnly} />}

        {tab === "review" && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <Panel className="lg:col-span-7">
              <PanelHead title="Validation" description="Every binding must return approved values for the reporting date." />
              <PanelBody>
                {report.sections.length === 0 ? (
                  <p className="text-[13px] text-ink-3">No bound sections to validate — this item is generated whole from its source.</p>
                ) : (
                  <ul className="divide-y divide-line-subtle rounded-md border border-line">
                    {report.sections.map((s) => (
                      <li key={s.id} className="flex flex-wrap items-center gap-3 px-3 py-2.5 text-[13px]">
                        <span aria-hidden className={cn("[&>svg]:size-4", s.valid ? "text-mark-ok" : "text-mark-warn")}>{s.valid ? <CheckCircle2 /> : <AlertTriangle />}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium text-ink">{s.title}</span>
                          <span className="block truncate font-data text-[11px] text-ink-3">{s.binding}</span>
                        </span>
                        {s.valid ? (
                          <StatusBadge tone="ok">Valid</StatusBadge>
                        ) : (
                          <Button
                            size="sm"
                            disabled={readOnly}
                            onClick={() => {
                              setReport({ ...report, sections: report.sections.map((x) => (x.id === s.id ? { ...x, valid: true } : x)) });
                              toast({ tone: "ok", title: `${s.title} refreshed`, body: "Binding now returns approved values (demo)." });
                            }}
                          >
                            <RotateCw /> Refresh binding
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </PanelBody>
            </Panel>
            <Panel className="lg:col-span-5">
              <PanelHead title="Approval" />
              <PanelBody className="space-y-3">
                <WorkflowStepper
                  steps={[
                    { label: "Draft", state: report.status === "Draft" ? "current" : "done" },
                    { label: "Review", state: report.status === "Pending approval" && !approved ? "current" : report.status === "Published" || approved ? "done" : "todo" },
                    { label: "Approve", state: approved || report.status === "Published" ? "done" : "todo" },
                    { label: "Publish", state: report.status === "Published" ? "done" : approved ? "current" : "todo" },
                  ]}
                />
                {report.status === "Draft" && (
                  <>
                    <p className="text-[13px] text-ink-2">{issues.length ? "Resolve the validation issues, then send the report for approval." : "Validation passed. Send the report to the approver."}</p>
                    <Button variant="primary" disabled={issues.length > 0} onClick={() => (setReport({ ...report, status: "Pending approval", history: stamp("Sent for approval") }), toast({ tone: "ok", title: "Sent for approval", body: "The CFO is notified (demo)." }))}>
                      Send for approval
                    </Button>
                  </>
                )}
                {report.status === "Pending approval" && !approved && (
                  issues.length > 0 ? (
                    <InlineAlert tone="warn">Approval is blocked until {issues.length} validation issue{issues.length > 1 ? "s are" : " is"} resolved.</InlineAlert>
                  ) : (
                    <DecisionPanel
                      idPrefix={`rep-${report.id}`}
                      noteLabel="Approval comment"
                      decisions={[{ id: "changes", label: "Request changes" }, { id: "approve", label: "Approve", variant: "primary" }]}
                      onDecide={(d) => {
                        if (d.id === "approve") {
                          setApproved(true);
                          setReport({ ...report, history: stamp("Approved") });
                        } else setReport({ ...report, status: "Draft", history: stamp("Changes requested") });
                        toast({ tone: "ok", title: d.id === "approve" ? "Approved — ready to publish" : "Returned to draft", body: "Recorded in this session only (demo)." });
                      }}
                    />
                  )
                )}
                {approved && report.status === "Pending approval" && <InlineAlert tone="ok" title="Approved">Publish from the header when you are ready. Export is available at any time.</InlineAlert>}
                {report.status === "Published" && <p className="text-[13px] text-ink-2">Published. The LP portal shows this version; later changes create a new version.</p>}
                {(report.status === "Template" || report.status === "Scheduled" || report.status === "Archived") && <p className="text-[13px] text-ink-3">{report.status} items are not approved here.</p>}
              </PanelBody>
            </Panel>
          </div>
        )}

        {tab === "history" && (
          <Panel>
            <PanelHead title="Versions and approvals" description="Every change, approval and publication, newest first" />
            <PanelBody>
              {report.history.length === 0 ? (
                <p className="text-[13px] text-ink-3">No versions recorded yet. The first generation creates v1.</p>
              ) : (
                <ActivityTimeline
                  now={now}
                  items={report.history.map((h, i) => ({ id: `${h.version}-${i}`, at: h.at, label: f.ago(h.at, now), title: `${h.version} · ${h.note}`, actor: h.by, source: "Reports", state: i === 0 ? "complete" : "historical" }))}
                />
              )}
            </PanelBody>
          </Panel>
        )}

        {tab === "access" && (
          <Panel>
            <PanelHead title="Access" description="Who can see and act on this report" icon={<Lock />} />
            <PanelBody>
              <ul className="divide-y divide-line-subtle rounded-md border border-line text-[13px]">
                {[
                  ["Partners", "Approve, publish, export"],
                  ["CFO office", "Approve, export"],
                  ["Investor relations", "Edit, send for approval, export"],
                  ["Fund accounting", "View, comment"],
                  ["Limited partners", report.status === "Published" ? "View published version in the LP portal" : "No access until published"],
                ].map(([who, what]) => (
                  <li key={who} className="flex items-center justify-between gap-3 px-3 py-2.5">
                    <span className="font-medium text-ink">{who}</span>
                    <span className="text-right text-ink-3">{what}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[12px] text-ink-4">Roles come from workspace settings. Demo permissions.</p>
            </PanelBody>
          </Panel>
        )}
      </PageBody>
    </>
  );
}

function Facts({ report, fund }: { report: Report; fund?: Fund }) {
  const f = useFormat();
  const items = [
    ["Period", periodOf(report)],
    ["Scope", fund?.name ?? "Portfolio · all funds"],
    ["Owner", report.owner],
    ["Status", report.status],
    ["Last updated", f.ago(report.updatedAt, now)],
    ["Data freshness", report.status === "Archived" || report.status === "Published" ? "Frozen at publication" : "IBOR reconciled · 30 Sep 2026"],
  ];
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3 xl:grid-cols-6">
      {items.map(([k, v]) => (
        <div key={k} className="min-w-0 bg-surface px-4 py-3">
          <dt className="text-[12px] text-ink-3">{k}</dt>
          <dd className="mt-0.5 truncate text-[13px] font-medium text-ink" title={v}>
            {v}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * ReportReview (V2 REPORT-004/005): the institutional reader — executive
 * summary, key metrics with citations, performance, attribution, exceptions,
 * lineage, notes and approval history — compact and evidence-led.
 */
export function ReportReview({ report, fund }: { report: Report; fund?: Fund }) {
  const f = useFormat();
  const nav = fund ? fund.nav : PORTFOLIO.nav;
  const tvpi = fund ? fundTvpi(fund) : PORTFOLIO.tvpi;
  const dpi = fund ? fundDpi(fund) : PORTFOLIO.dpi;
  const irr = fund ? fund.netIrr : PORTFOLIO.netIrr;
  const points = fund ? fundNavSeries(fund).map((p, i, arr) => ({ q: p.q, nav: p.nav, benchmark: Math.round(arr[0].nav * Math.pow(1.021, i) * 10) / 10 })) : NAV_SERIES;
  const bridge = fund ? fundBridge(fund) : BRIDGE;
  const exceptions = [
    ...RECON.filter((r) => r.state !== "Resolved" && (!fund || r.entity.id === fund.id)).map((r) => ({ id: r.id, title: `${r.field} · ${r.variance}`, entity: r.entity.name, severity: r.severity, kind: "Recon break" })),
    ...EXCEPTIONS.filter(() => !fund || fund.id === "FND-002").slice(0, 3).map((e) => ({ id: e.id, title: e.title, entity: e.entity.name, severity: e.severity, kind: e.kind })),
  ];
  const summary =
    report.type === "LP quarterly"
      ? `${fund?.name ?? "The portfolio"} closed ${periodOf(report)} at ${f.money(nav)} NAV, ${f.multiple(tvpi)} TVPI and ${f.multiple(dpi)} DPI. Value creation came from operating improvements in digital infrastructure and renewables; consumer margins were under pressure. ${exceptions.length} open item${exceptions.length === 1 ? " is" : "s are"} disclosed below.`
      : report.type === "IC memo"
        ? "The deal team recommends approval of the add-on at 7.2× EBITDA, funded from Flagship II reserves, with leverage held below the 5.5× policy ceiling after the equity cure."
        : report.type === "Valuation memo"
          ? "The Q3 mark reflects a DCF update (WACC 11.4%) cross-checked against trading comparables; the covenant breach is reflected in a higher discount rate rather than a cash-flow haircut."
          : report.type === "Board pack"
            ? `${report.name.split("·").pop()?.trim() ?? "The company"} delivered Q3 revenue in line with budget and held EBITDA margin. The board is asked to note the refinancing timetable and approve the FY27 capex envelope.`
            : report.type === "Risk report"
            ? "Risk is within appetite overall. One covenant breach and one leverage alert are open; sector concentration in consumer is 0.6 pts from its warning threshold."
            : `${report.name}: summary prepared by ${report.owner} from IBOR data as of 30 Sep 2026.`;

  return (
    <div className="space-y-4">
      <Panel>
        <PanelHead title="Executive summary" />
        <PanelBody>
          <p className="max-w-3xl text-[14px] leading-relaxed text-ink-2">{summary}</p>
        </PanelBody>
      </Panel>

      <section aria-label="Key metrics" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["NAV", f.money(nav)],
          ["TVPI", f.multiple(tvpi)],
          ["DPI", f.multiple(dpi)],
          ["Net IRR", f.pct(irr)],
        ].map(([k, v], i) => (
          <div key={k} className="rounded-lg border border-line bg-surface px-4 py-3">
            <p className="text-[12px] text-ink-3">
              {k}
              <sup className="ml-0.5 text-[10px] text-accent-ink">[{i + 1}]</sup>
            </p>
            <p className="mt-1 text-kpi font-semibold tabular-nums text-ink">{v}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <NavChart className="xl:col-span-7" title="Performance" points={points} benchmark={!fund} height={360} />
        <ChartShell
          className="xl:col-span-5"
          title="Attribution"
          subtitle="Opening + calls − distributions ± valuation ± FX = closing"
          legend={<Legend items={[{ label: "Opening / closing", color: "var(--color-mark-neutral)" }, { label: "Increase", color: "var(--color-gain)" }, { label: "Decrease", color: "var(--color-loss)" }]} />}
          height={360}
          expandable={false}
        >
          <WaterfallChart data={bridge} label={`${report.name} attribution`} format={fmtM} axisFormat={(v) => `$${Math.round(v)}M`} />
        </ChartShell>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Panel className="xl:col-span-7">
          <PanelHead title="Exceptions" description="Open items disclosed in this report" />
          <PanelBody flush>
            {exceptions.length === 0 ? (
              <p className="px-5 pb-5 text-[13px] text-ink-3">No open exceptions in scope.</p>
            ) : (
              <ul className="divide-y divide-line-subtle">
                {exceptions.map((e) => (
                  <li key={e.id} className="flex flex-wrap items-center gap-3 px-5 py-2.5 text-[13px]">
                    <SeverityBadge severity={e.severity} />
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium text-ink">{e.title}</span>
                      <span className="block text-[12px] text-ink-3">
                        {e.kind} · {e.entity}
                      </span>
                    </span>
                    <span className="font-data text-[11px] text-ink-4">{e.id}</span>
                  </li>
                ))}
              </ul>
            )}
          </PanelBody>
        </Panel>
        <Panel className="xl:col-span-5">
          <PanelHead title="Lineage and sources" />
          <PanelBody className="space-y-3 text-[13px]">
            <ol className="space-y-1.5">
              {[
                ["1", "NAV", "Apex Fund Services → MAP-114 cash → Transaction ledger → Fund NAV v2.1"],
                ["2", "TVPI", "Distributions + NAV ÷ paid-in · TVPI v2.0"],
                ["3", "DPI", "Distributions ÷ paid-in · DPI v2.0"],
                ["4", "Net IRR", "XIRR of LP cash flows and closing NAV · IRR v3.2"],
              ].map(([n, k, v]) => (
                <li key={n} className="flex gap-2">
                  <span className="mt-px flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[10px] font-semibold text-accent-ink">{n}</span>
                  <span>
                    <span className="font-medium text-ink">{k}</span> <span className="text-ink-3">· {v}</span>
                  </span>
                </li>
              ))}
            </ol>
            <Link href="/app/data?tab=lineage" className="inline-flex items-center gap-1 text-[12px] font-medium text-accent-ink hover:underline">
              Open full lineage <ArrowRight aria-hidden className="size-3" />
            </Link>
          </PanelBody>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Panel className="xl:col-span-7">
          <PanelHead title="Notes" />
          <PanelBody className="space-y-2 text-[13px] leading-relaxed text-ink-2">
            <p>Valuations follow the IPEV guidelines (policy v4). Level 3 marks were approved by the valuation committee on 28 Sep 2026.</p>
            <p>Figures are in USD; IDR, PHP and VND positions are translated at the WM/Reuters 4pm fix on the reporting date.</p>
            <p className="text-[12px] text-ink-4">Demo content. Not investment advice.</p>
          </PanelBody>
        </Panel>
        <Panel className="xl:col-span-5">
          <PanelHead title="Approval history" />
          <PanelBody>
            {report.history.length === 0 ? (
              <p className="text-[13px] text-ink-3">Not yet reviewed.</p>
            ) : (
              <ActivityTimeline items={report.history.slice(0, 4).map((h, i) => ({ id: `${h.version}-${i}`, at: h.at, label: f.ago(h.at, now), title: `${h.version} · ${h.note}`, actor: h.by, state: i === 0 ? "complete" : "historical" }))} />
            )}
          </PanelBody>
        </Panel>
      </div>
    </div>
  );
}

/** Builder (REPORT builder route): structure on the left, bound content on the right. */
function Builder({ report, setReport, readOnly }: { report: Report; setReport: (r: Report) => void; readOnly: boolean }) {
  const f = useFormat();
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<"edit" | "preview">(readOnly ? "preview" : "edit");
  const sections = report.sections;
  if (sections.length === 0)
    return (
      <Panel>
        <EmptyState
          icon={<FileText />}
          title="No editable sections"
          body={report.status === "Scheduled" ? `This report is generated whole on its schedule (${report.schedule}). Edit the template to change its structure.` : "This item was published as a single document. Start a new report from a template to build sections."}
          action={<LinkButton href="/app/reports?new=1">Start from a template</LinkButton>}
        />
      </Panel>
    );
  const sec = sections[Math.min(active, sections.length - 1)];
  const fund = report.fund ? fundById(report.fund) : undefined;
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= sections.length) return;
    const next = [...sections];
    [next[i], next[j]] = [next[j], next[i]];
    setReport({ ...report, sections: next });
    setActive(j);
  };
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <Panel className="lg:col-span-4 xl:col-span-3" as="div">
        <PanelHead title="Structure" toolbar={!readOnly && <IconButton size="sm" label="Add section" icon={<Plus />} onClick={() => (setReport({ ...report, sections: [...sections, { id: `s${sections.length + 1}`, title: "New section", binding: "Narrative", citations: 0, valid: true }] }), setActive(sections.length))} />} />
        <nav aria-label="Report sections" className="px-2 pb-3">
          <ol className="space-y-0.5">
            {sections.map((s, i) => (
              <li key={s.id} className="group flex items-center gap-1">
                <GripVertical aria-hidden className="size-3.5 shrink-0 text-ink-4" />
                <button
                  type="button"
                  aria-current={s === sec ? "true" : undefined}
                  onClick={() => setActive(i)}
                  className={cn("flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-left text-[13px]", s === sec ? "bg-accent-soft font-medium text-accent-ink" : "text-ink-2 hover:bg-hover", ringInset)}
                >
                  <span className="w-4 shrink-0 text-[11px] tabular-nums text-ink-4">{i + 1}</span>
                  <span className="truncate">{s.title}</span>
                  {!s.valid && <AlertTriangle aria-label="Validation issue" className="ml-auto size-3.5 shrink-0 text-warn" />}
                </button>
                {!readOnly && (
                  <>
                    <IconButton size="xs" label={`Move ${s.title} up`} icon={<ArrowUp />} disabled={i === 0} onClick={() => move(i, -1)} className="opacity-0 group-focus-within:opacity-100 group-hover:opacity-100" />
                    <IconButton size="xs" label={`Move ${s.title} down`} icon={<ArrowDown />} disabled={i === sections.length - 1} onClick={() => move(i, 1)} className="opacity-0 group-focus-within:opacity-100 group-hover:opacity-100" />
                  </>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </Panel>
      <Panel className="lg:col-span-8 xl:col-span-9">
        <PanelHead
          title={`${sections.indexOf(sec) + 1}. ${sec.title}`}
          toolbar={
            <>
              {sec.binding === "Narrative" ? <VerificationBadge state="human-reviewed" /> : <VerificationBadge state="source-derived" />}
              <Segmented size="sm" label="Mode" value={mode} onChange={setMode} items={[{ value: "edit", label: readOnly ? "Bindings" : "Edit" }, { value: "preview", label: "Preview" }]} />
            </>
          }
          divider
        />
        <PanelBody className="space-y-4">
          {mode === "edit" && (
            <div className="flex flex-wrap items-center gap-2 text-[12px]">
              <span className="inline-flex items-center gap-1 rounded-sm border border-line bg-subtle px-2 py-1 font-data text-ink-2">
                <Link2 aria-hidden className="size-3" /> {sec.binding}
              </span>
              <span className="inline-flex items-center gap-1 text-ink-3">
                <Quote aria-hidden className="size-3" /> {sec.citations} citations
              </span>
            </div>
          )}
          {!sec.valid && <InlineAlert tone="warn">The binding returned no approved values for {f.date("2026-09-30T00:00:00Z")}. Refresh it from Review & approval once the valuation memos are approved.</InlineAlert>}
          <SectionPreview title={sec.title} binding={sec.binding} fund={fund} />
          {mode === "preview" && (
            <p className="flex items-center gap-1.5 text-[11px] text-ink-4">
              <Eye aria-hidden className="size-3" /> Preview as LPs will see it
            </p>
          )}
        </PanelBody>
      </Panel>
    </div>
  );
}

function SectionPreview({ title, binding, fund: scoped }: { title: string; binding: string; fund?: Fund }) {
  const f = useFormat();
  if (binding.startsWith("metric:")) {
    const fund = scoped ?? FUNDS[0];
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["NAV", f.money(fund.nav)],
          ["TVPI", f.multiple(fundTvpi(fund))],
          ["DPI", f.multiple(fundDpi(fund))],
          ["Net IRR", f.pct(fund.netIrr)],
        ].map(([k, v], i) => (
          <div key={k} className="rounded-lg border border-line p-3">
            <p className="text-[12px] text-ink-3">
              {k}
              <sup className="ml-0.5 text-[9px] text-accent-ink">[{i + 1}]</sup>
            </p>
            <p className="mt-1 text-metric font-semibold tabular-nums text-ink">{v}</p>
          </div>
        ))}
      </div>
    );
  }
  if (binding.startsWith("table:")) {
    return (
      <div className="rounded-lg border border-line p-3 text-[12px] text-ink-3">
        Table bound to <span className="font-data text-ink-2">{binding}</span> renders here with full-precision values and a citation per row.
      </div>
    );
  }
  return (
    <div className="space-y-2 text-[13px] leading-relaxed text-ink-2">
      <p>
        {title === "Letter from the GP"
          ? "Dear Limited Partners, the portfolio returned 3.2% in the quarter, led by digital infrastructure and renewables, while consumer holdings faced margin pressure."
          : `${title}: narrative drafted by the deal team and reviewed before publication.`}
      </p>
      <p className="text-[12px] text-ink-4">Narrative section · human-written</p>
    </div>
  );
}
