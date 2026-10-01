"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useFormat } from "@/lib/use-format";
import { useQueryClient } from "@tanstack/react-query";
import { keys, useReports } from "@/lib/data/queries";
import { DEMO_NOW, fundById, type Report, type ReportStatus } from "@/lib/demo";
import { PageBody, PageHeader } from "@/components/page/page-header";
import { DataTable, type Column } from "@/components/data/data-table";
import { EntityCell, StatusCell } from "@/components/data/cells";
import { Button } from "@/components/ui/button";
import { type Tone } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/controls";
import { FreshnessBadge, useToast } from "@/components/feedback";
import { useBreadcrumb } from "@/components/shell/shell-context";
import { ReportWizard } from "./report-wizard";

const STATUSES: ReportStatus[] = ["Draft", "Template", "Scheduled", "Pending approval", "Published", "Archived"];
export const REPORT_TONE: Record<ReportStatus, Tone> = { Draft: "neutral", Template: "info", Scheduled: "accent", "Pending approval": "warn", Published: "ok", Archived: "neutral" };
const now = new Date(DEMO_NOW);

/** Report centre (plan §26): drafts, templates, scheduled, pending approval, published, archived. */
export function ReportsView() {
  const f = useFormat();
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();
  useBreadcrumb(null);
  const q = useReports();
  const qc = useQueryClient();
  const reports = q.data ?? [];
  const status = (STATUSES.find((s) => s.toLowerCase().replace(" ", "-") === params.get("status")) ?? "Draft") as ReportStatus;
  const creating = params.get("new") === "1";

  const cols: Column<Report>[] = [
    { id: "name", header: "Report", width: 320, hideable: false, value: (r) => r.name, cell: (r) => <EntityCell name={r.name} sub={`${r.type} · ${r.version}`} href={`/app/reports/${r.id.toLowerCase()}`} /> },
    { id: "type", header: "Type", value: (r) => r.type, facet: true },
    { id: "fund", header: "Fund", value: (r) => (r.fund ? fundById(r.fund)!.short : "—"), facet: true },
    { id: "owner", header: "Owner", value: (r) => r.owner, facet: true },
    { id: "status", header: "Status", value: (r) => r.status, cell: (r) => <StatusCell tone={REPORT_TONE[r.status]}>{r.status}</StatusCell> },
    { id: "sections", header: "Sections", value: (r) => r.sections.length, align: "right" },
    { id: "issues", header: "Validation", value: (r) => r.sections.filter((s) => !s.valid).length, align: "right", cell: (r) => { const n = r.sections.filter((s) => !s.valid).length; return n ? <span className="font-medium text-warn">{n} issue{n > 1 ? "s" : ""}</span> : <span className="text-ink-4">OK</span>; } },
    { id: "schedule", header: "Schedule", value: (r) => r.schedule ?? "—", defaultHidden: true },
    { id: "updated", header: "Updated", value: (r) => r.updatedAt, align: "right", cell: (r) => f.ago(r.updatedAt, now) },
  ];

  const setStatus = (s: ReportStatus) => router.replace(`/app/reports?status=${s.toLowerCase().replace(" ", "-")}`, { scroll: false });

  return (
    <>
      <PageHeader
        variant="list"
        eyebrow="Insight"
        title="Reports"
        description="LP reports, IC memos, board packs and valuation memos — bound to IBOR data and cited."
        meta={<FreshnessBadge state="demo" />}
        actions={
          <Button variant="primary" onClick={() => router.replace("/app/reports?new=1", { scroll: false })}>
            <Plus /> New report
          </Button>
        }
        tabs={creating ? undefined : <Tabs<ReportStatus> label="Report status" value={status} onChange={setStatus} variant="pill" className="pb-3" items={STATUSES.map((s) => ({ value: s, label: s, count: reports.filter((r) => r.status === s).length }))} />}
      />
      <PageBody>
        {creating ? (
          <ReportWizard
            templates={reports.filter((r) => r.status === "Template")}
            onCancel={() => router.replace("/app/reports", { scroll: false })}
            onDone={({ name, template }) => {
              const r: Report = { ...template, id: `RPT-${240 + reports.length}`, name, status: "Published", version: "v1", owner: "You", updatedAt: DEMO_NOW, history: [{ version: "v1", by: "You", at: DEMO_NOW, note: `Published from ${template.name}` }] };
              // Write through the query cache so the new report's detail route resolves too (V2 REPORT-002).
              qc.setQueryData<Report[]>(keys.reports(), (xs) => [r, ...(xs ?? [])]);
              toast({ tone: "ok", title: "Report published", body: `${r.name} (demo — lives in this session).` });
            }}
          />
        ) : (
        <DataTable
          key={status}
          id={`reports-${status}`}
          label={`${status} reports`}
          data={reports.filter((r) => r.status === status)}
          status={q.isLoading ? "loading" : "ready"}
          columns={cols}
          rowId={(r) => r.id}
          demo
          onRowOpen={(r) => router.push(`/app/reports/${r.id.toLowerCase()}`)}
          initial={{ sort: [{ id: "updated", desc: true }] }}
          empty={{ title: `No ${status.toLowerCase()} reports`, body: status === "Draft" ? "Start a report from a template; sections bind to live IBOR data." : "Reports move here as they progress through review." }}
        />
        )}
      </PageBody>
    </>
  );
}
