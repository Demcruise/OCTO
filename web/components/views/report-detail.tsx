"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowDown, ArrowUp, CheckCircle2, Eye, GripVertical, Link2, Plus, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormat } from "@/lib/use-format";
import { useReports } from "@/lib/data/queries";
import { DEMO_NOW, FUNDS, fundById, type Report } from "@/lib/demo";
import { PageBody, PageHeader } from "@/components/page/page-header";
import { Panel, PanelBody, PanelHead } from "@/components/page/panel";
import { Button, IconButton, ringInset } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Segmented } from "@/components/ui/controls";
import { FreshnessBadge, InlineAlert, MetricSkeleton, useToast } from "@/components/feedback";
import { VerificationBadge } from "@/components/ai/ai-badge";
import { DecisionPanel, WorkflowStepper } from "@/components/workflow/workflow";
import { useBreadcrumb } from "@/components/shell/shell-context";
import { REPORT_TONE } from "./reports";

const now = new Date(DEMO_NOW);

/**
 * Report detail and builder (plan §26): split view — structure on the left,
 * content on the right — with metadata, data bindings, citations, preview,
 * version history, validation and approval.
 */
export function ReportDetail({ id }: { id: string }) {
  const f = useFormat();
  const toast = useToast();
  const q = useReports();
  const found = q.data?.find((r) => r.id.toLowerCase() === id.toLowerCase());
  const [report, setReport] = useState<Report | null>(null);
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  useEffect(() => void (found && setReport(found)), [found]);

  useBreadcrumb(found ? [{ label: "Insight" }, { label: "Reports", href: "/app/reports" }, { label: found.name }] : null, found ? { type: "Report", name: found.name, href: `/app/reports/${found.id.toLowerCase()}` } : undefined);

  if (q.isSuccess && !found) notFound();
  if (!report) return <PageBody><MetricSkeleton /></PageBody>;

  const sections = report.sections;
  const issues = sections.filter((s) => !s.valid);
  const sec = sections[active];
  const fund = report.fund ? fundById(report.fund) : undefined;
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= sections.length) return;
    const next = [...sections];
    [next[i], next[j]] = [next[j], next[i]];
    setReport({ ...report, sections: next });
    setActive(j);
  };
  const steps = [
    { label: "Draft", state: (report.status === "Draft" ? "current" : "done") as "done" | "current" | "todo" },
    { label: "Review", state: (report.status === "Pending approval" ? "current" : report.status === "Published" ? "done" : "todo") as "done" | "current" | "todo" },
    { label: "Publish", state: (report.status === "Published" ? "done" : "todo") as "done" | "current" | "todo" },
  ];

  return (
    <>
      <PageHeader
        variant="builder"
        eyebrow={`${report.type} · ${report.version}`}
        title={report.name}
        meta={
          <>
            <StatusBadge tone={REPORT_TONE[report.status]}>{report.status}</StatusBadge>
            <FreshnessBadge state="demo" asOf={`updated ${f.ago(report.updatedAt, now)}`} />
            {issues.length > 0 ? <span className="inline-flex items-center gap-1 text-[12px] text-warn"><AlertTriangle aria-hidden className="size-3.5" /> {issues.length} validation issue{issues.length > 1 ? "s" : ""}</span> : <span className="inline-flex items-center gap-1 text-[12px] text-ok"><CheckCircle2 aria-hidden className="size-3.5" /> Valid</span>}
          </>
        }
        actions={
          <>
            <Segmented label="Mode" value={mode} onChange={setMode} items={[{ value: "edit", label: "Edit" }, { value: "preview", label: "Preview" }]} />
            {report.status === "Draft" && (
              <Button variant="primary" disabled={issues.length > 0} onClick={() => (setReport({ ...report, status: "Pending approval" }), toast({ tone: "ok", title: "Sent for approval", body: "The CFO is notified (demo)." }))}>
                Send for approval
              </Button>
            )}
          </>
        }
      />
      <PageBody className="space-y-4">
        {issues.length > 0 && <InlineAlert tone="warn" title="Fix validation issues before sending for approval">{issues.map((s) => s.title).join(", ")} — a binding has no approved data for the reporting date.</InlineAlert>}

        {sections.length === 0 ? (
          <Panel>
            <PanelBody className="py-10 text-center text-[13px] text-ink-3">
              This {report.status === "Scheduled" ? "scheduled report" : "item"} has no editable sections here. {report.schedule && `Runs ${report.schedule}.`}
            </PanelBody>
          </Panel>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* Structure */}
            <Panel className="lg:col-span-3" as="div">
              <PanelHead title="Structure" toolbar={<IconButton size="sm" label="Add section" icon={<Plus />} onClick={() => (setReport({ ...report, sections: [...sections, { id: `s${sections.length + 1}`, title: "New section", binding: "Narrative", citations: 0, valid: true }] }), setActive(sections.length))} />} />
              <nav aria-label="Report sections" className="px-2 pb-3">
                <ol className="space-y-0.5">
                  {sections.map((s, i) => (
                    <li key={s.id} className="group flex items-center gap-1">
                      <GripVertical aria-hidden className="size-3.5 shrink-0 text-ink-4" />
                      <button
                        type="button"
                        aria-current={i === active ? "true" : undefined}
                        onClick={() => setActive(i)}
                        className={cn("flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px]", i === active ? "bg-accent-soft font-medium text-accent-ink" : "text-ink-2 hover:bg-hover", ringInset)}
                      >
                        <span className="w-4 shrink-0 text-[11px] tabular-nums text-ink-4">{i + 1}</span>
                        <span className="truncate">{s.title}</span>
                        {!s.valid && <AlertTriangle aria-label="Validation issue" className="ml-auto size-3.5 shrink-0 text-warn" />}
                      </button>
                      <IconButton size="xs" label={`Move ${s.title} up`} icon={<ArrowUp />} disabled={i === 0} onClick={() => move(i, -1)} className="opacity-0 group-focus-within:opacity-100 group-hover:opacity-100" />
                      <IconButton size="xs" label={`Move ${s.title} down`} icon={<ArrowDown />} disabled={i === sections.length - 1} onClick={() => move(i, 1)} className="opacity-0 group-focus-within:opacity-100 group-hover:opacity-100" />
                    </li>
                  ))}
                </ol>
              </nav>
            </Panel>

            {/* Content */}
            <Panel className="lg:col-span-6">
              <PanelHead title={`${active + 1}. ${sec.title}`} toolbar={sec.binding === "Narrative" ? <VerificationBadge state="human-reviewed" /> : <VerificationBadge state="source-derived" />} divider />
              <PanelBody className="space-y-4">
                {mode === "edit" && (
                  <div className="flex flex-wrap items-center gap-2 text-[12px]">
                    <span className="inline-flex items-center gap-1 rounded-md border border-line bg-subtle px-2 py-1 font-data text-ink-2">
                      <Link2 aria-hidden className="size-3" /> {sec.binding}
                    </span>
                    <span className="inline-flex items-center gap-1 text-ink-3">
                      <Quote aria-hidden className="size-3" /> {sec.citations} citations
                    </span>
                  </div>
                )}
                {!sec.valid && <InlineAlert tone="warn">The binding returned no approved values for {f.date("2026-09-30T00:00:00Z")}. Approve the pending valuation memos, then refresh.</InlineAlert>}
                <SectionPreview title={sec.title} binding={sec.binding} fundName={fund?.name} />
                {mode === "preview" && <p className="flex items-center gap-1.5 text-[11px] text-ink-4"><Eye aria-hidden className="size-3" /> Preview as LPs will see it</p>}
              </PanelBody>
            </Panel>

            {/* Metadata, versions, approval */}
            <div className="grid grid-cols-1 content-start gap-4 lg:col-span-3">
              <Panel>
                <PanelHead title="Details" />
                <PanelBody className="space-y-2 pt-1 text-[12px]">
                  {[
                    ["Owner", report.owner],
                    ["Fund", fund?.name ?? "—"],
                    ["Reporting date", f.date("2026-09-30T00:00:00Z")],
                    ["Data source", "IBOR · reconciled"],
                    ["Schedule", report.schedule ?? "One-off"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3">
                      <span className="text-ink-3">{k}</span>
                      <span className="truncate text-right font-medium text-ink">{v}</span>
                    </div>
                  ))}
                </PanelBody>
              </Panel>
              <Panel>
                <PanelHead title="Approval" />
                <PanelBody className="space-y-3">
                  <WorkflowStepper steps={steps} />
                  {report.status === "Pending approval" && (
                    <DecisionPanel
                      idPrefix={`rep-${report.id}`}
                      decisions={[{ id: "changes", label: "Request changes" }, { id: "approve", label: "Approve & publish", variant: "primary" }]}
                      onDecide={(d) => {
                        setReport({ ...report, status: d.id === "approve" ? "Published" : "Draft", history: [{ version: report.version, by: "You", at: DEMO_NOW, note: d.label }, ...report.history] });
                        toast({ tone: "ok", title: d.id === "approve" ? "Published" : "Returned to draft", body: "Recorded in this session only (demo)." });
                      }}
                    />
                  )}
                </PanelBody>
              </Panel>
              <Panel>
                <PanelHead title="Version history" />
                <PanelBody className="pt-1">
                  {report.history.length === 0 ? (
                    <p className="text-[12px] text-ink-3">No versions recorded.</p>
                  ) : (
                    <ol className="space-y-2.5">
                      {report.history.map((h, i) => (
                        <li key={`${h.version}-${i}`} className="text-[12px]">
                          <p className="font-medium text-ink">
                            {h.version} · {h.by}
                          </p>
                          <p className="text-ink-3">{h.note}</p>
                          <p className="text-ink-4">{f.ago(h.at, now)}</p>
                        </li>
                      ))}
                    </ol>
                  )}
                </PanelBody>
              </Panel>
            </div>
          </div>
        )}
      </PageBody>
    </>
  );
}

function SectionPreview({ title, binding, fundName }: { title: string; binding: string; fundName?: string }) {
  const f = useFormat();
  if (binding.startsWith("metric:")) {
    const fund = FUNDS.find((x) => x.name === fundName) ?? FUNDS[0];
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["NAV", f.money(fund.nav)],
          ["TVPI", f.multiple((fund.distributions + fund.nav) / fund.called)],
          ["DPI", f.multiple(fund.distributions / fund.called)],
          ["Net IRR", f.pct(fund.netIrr)],
        ].map(([k, v], i) => (
          <div key={k} className="rounded-lg border border-line p-3">
            <p className="text-[12px] text-ink-3">
              {k}
              <sup className="ml-0.5 text-[9px] text-accent">[{i + 1}]</sup>
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
