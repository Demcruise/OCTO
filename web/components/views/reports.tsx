"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useFormat } from "@/lib/use-format";
import { useReports } from "@/lib/data/queries";
import { DEMO_NOW, fundById, type Report, type ReportStatus } from "@/lib/demo";
import { PageBody, PageHeader } from "@/components/page/page-header";
import { DataTable, type Column } from "@/components/data/data-table";
import { EntityCell, StatusCell } from "@/components/data/cells";
import { Button } from "@/components/ui/button";
import { type Tone } from "@/components/ui/badge";
import { Field, Input, Select, Tabs } from "@/components/ui/controls";
import { ConfirmDialog } from "@/components/ui/overlay";
import { FreshnessBadge, useToast } from "@/components/feedback";
import { useBreadcrumb } from "@/components/shell/shell-context";

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
  const [reports, setReports] = useState<Report[]>([]);
  useEffect(() => void (q.data && setReports(q.data)), [q.data]);
  const status = (STATUSES.find((s) => s.toLowerCase().replace(" ", "-") === params.get("status")) ?? "Draft") as ReportStatus;
  const creating = params.get("new") === "1";
  const [name, setName] = useState("");
  const [template, setTemplate] = useState("RPT-0188");

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
        tabs={<Tabs<ReportStatus> label="Report status" value={status} onChange={setStatus} className="border-b-0" items={STATUSES.map((s) => ({ value: s, label: s, count: reports.filter((r) => r.status === s).length }))} />}
      />
      <PageBody>
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
      </PageBody>
      <ConfirmDialog
        open={creating}
        title="New report"
        body="Start from a template. Every number is bound to IBOR data and cited."
        confirmLabel="Create draft"
        onCancel={() => router.replace("/app/reports", { scroll: false })}
        onConfirm={() => {
          const t = reports.find((r) => r.id === template)!;
          const r: Report = { ...t, id: `RPT-${240 + reports.length}`, name: name.trim() || `Untitled ${t.type}`, status: "Draft", version: "v1", owner: "You", updatedAt: DEMO_NOW, history: [{ version: "v1", by: "You", at: DEMO_NOW, note: `Created from ${t.name}` }] };
          setReports((xs) => [r, ...xs]);
          setName("");
          router.replace("/app/reports?status=draft", { scroll: false });
          toast({ tone: "ok", title: "Draft created", body: `${r.name} (demo — lives in this session).` });
        }}
      >
        <div className="mt-4 space-y-3">
          <Field id="rep-name" label="Name">
            <Input id="rep-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Q3 2026 LP report · Flagship II" data-autofocus />
          </Field>
          <Field id="rep-template" label="Template">
            <Select id="rep-template" value={template} onChange={(e) => setTemplate(e.target.value)}>
              {reports.filter((r) => r.status === "Template").map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </ConfirmDialog>
    </>
  );
}
