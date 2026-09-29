"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ago, date, time } from "@/lib/format";
import { ALERTS, DEMO_NOW, SEVERITY_ORDER, type Alert, type AlertStatus } from "@/lib/demo-data";
import { PageBody, PageHeader } from "@/components/layout/page-header";
import { DataTable, type Column } from "@/components/data/data-table";
import { Button } from "@/components/ui/button";
import { EntityChip, StatusBadge, type Tone } from "@/components/ui/badge";
import { Field, Textarea } from "@/components/ui/controls";
import { Sheet } from "@/components/ui/overlay";
import { FreshnessBadge, useToast } from "@/components/ui/states";
import { SEVERITY_TONE } from "./control-center";

const now = new Date(DEMO_NOW);
const STATUS_TONE: Record<AlertStatus, Tone> = { Open: "danger", Acknowledged: "warn", Resolved: "ok" };

const columns: Column<Alert>[] = [
  { id: "title", header: "Alert", value: (a) => a.title },
  {
    id: "severity",
    header: "Severity",
    value: (a) => a.severity,
    sortValue: (a) => SEVERITY_ORDER[a.severity],
    facet: true,
    cell: (a) => (
      <StatusBadge tone={SEVERITY_TONE[a.severity]} className="capitalize">
        {a.severity}
      </StatusBadge>
    ),
  },
  { id: "status", header: "Status", value: (a) => a.status, facet: true, cell: (a) => <StatusBadge tone={STATUS_TONE[a.status]}>{a.status}</StatusBadge> },
  { id: "entity", header: "Entity", value: (a) => a.entity.name, cell: (a) => <EntityChip type={a.entity.type} name={a.entity.name} /> },
  { id: "rule", header: "Rule", value: (a) => a.rule, defaultHidden: true },
  { id: "observed", header: "Observed", value: (a) => a.observed, align: "right" },
  { id: "owner", header: "Owner", value: (a) => a.owner, facet: true, defaultHidden: true },
  { id: "triggered", header: "Triggered", value: (a) => a.triggeredAt, align: "right", cell: (a) => ago(a.triggeredAt, now) },
];

/** Alerts (ALERT-001): triage table with a detail sheet; resolving needs a note. */
export function AlertsView() {
  const params = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const [alerts, setAlerts] = useState(() => [...ALERTS].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]));
  const openId = params.get("id");
  const current = alerts.find((a) => a.id === openId) ?? null;

  const setOpen = (id: string | null) => router.replace(id ? `/app/alerts?id=${id}` : "/app/alerts", { scroll: false });
  const update = (ids: string[], status: AlertStatus, owner?: string) => {
    setAlerts((xs) => xs.map((a) => (ids.includes(a.id) ? { ...a, status, owner: owner ?? a.owner } : a)));
    toast({ tone: "ok", title: `${ids.length} alert${ids.length > 1 ? "s" : ""} ${status.toLowerCase()}`, body: "Recorded in this session only (demo)." });
  };

  const open = alerts.filter((a) => a.status === "Open").length;

  return (
    <>
      <PageHeader
        eyebrow="Operate"
        title="Alerts"
        description="Rule and signal breaches across funds, companies, and data sources."
        meta={
          <>
            <FreshnessBadge state="demo" asOf={`evaluated ${time(DEMO_NOW)}`} />
            <span className="text-[12px] text-ink-3">
              {open} open · {alerts.filter((a) => a.severity === "critical" && a.status !== "Resolved").length} critical
            </span>
          </>
        }
      />
      <PageBody>
        <DataTable
          label="Alerts"
          data={alerts}
          columns={columns}
          rowId={(a) => a.id}
          selectable
          exportName="octo-alerts"
          searchPlaceholder="Search alerts, entities, rules…"
          onRowOpen={(a) => setOpen(a.id)}
          empty={{ title: "No alerts", body: "Alerts appear here when a rule or news match fires for something in your portfolio." }}
          bulkActions={(rows, clear) => (
            <>
              <Button size="sm" onClick={() => (update(rows.map((r) => r.id), "Acknowledged"), clear())}>
                Acknowledge
              </Button>
              <Button size="sm" onClick={() => (update(rows.map((r) => r.id), "Acknowledged", "You"), clear())}>
                Assign to me
              </Button>
            </>
          )}
          renderExpanded={(a) => (
            <p className="text-[12px] text-ink-3">
              Rule {a.rule} · observed <span className="font-data text-ink">{a.observed}</span> against threshold <span className="font-data text-ink">{a.threshold}</span> · source {a.source}
            </p>
          )}
        />
      </PageBody>
      <AlertSheet alert={current} onClose={() => setOpen(null)} onUpdate={(s, owner) => current && update([current.id], s, owner)} />
    </>
  );
}

function AlertSheet({ alert, onClose, onUpdate }: { alert: Alert | null; onClose: () => void; onUpdate: (s: AlertStatus, owner?: string) => void }) {
  const [resolving, setResolving] = useState(false);
  const [note, setNote] = useState("");
  if (!alert) return null;
  const close = () => {
    setResolving(false);
    setNote("");
    onClose();
  };
  return (
    <Sheet
      open
      onClose={close}
      eyebrow={alert.id}
      title={alert.title}
      footer={
        alert.status === "Resolved" ? (
          <p className="text-[12px] text-ink-3">Resolved alerts are read-only. Reopen from the rule if it fires again.</p>
        ) : resolving ? (
          <div className="flex justify-end gap-2">
            <Button size="sm" onClick={() => setResolving(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" disabled={note.trim().length < 5} onClick={() => (onUpdate("Resolved"), close())}>
              Resolve alert
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap justify-end gap-2">
            {alert.status === "Open" && (
              <Button size="sm" onClick={() => onUpdate("Acknowledged")}>
                Acknowledge
              </Button>
            )}
            {alert.owner !== "You" && (
              <Button size="sm" onClick={() => onUpdate(alert.status, "You")}>
                Assign to me
              </Button>
            )}
            <Button variant="primary" size="sm" onClick={() => setResolving(true)}>
              Resolve…
            </Button>
          </div>
        )
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge tone={SEVERITY_TONE[alert.severity]} className="capitalize">
          {alert.severity}
        </StatusBadge>
        <StatusBadge tone={STATUS_TONE[alert.status]}>{alert.status}</StatusBadge>
        <EntityChip type={alert.entity.type} name={alert.entity.name} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-md border border-line p-3">
          <p className="text-label uppercase text-ink-3">Observed</p>
          <p className="mt-1 font-data text-metric font-medium text-danger">{alert.observed}</p>
        </div>
        <div className="rounded-md border border-line p-3">
          <p className="text-label uppercase text-ink-3">Threshold</p>
          <p className="mt-1 font-data text-metric font-medium text-ink">{alert.threshold}</p>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-4 text-[13px]">
        <div>
          <dt className="text-label uppercase text-ink-3">Rule</dt>
          <dd className="mt-1 text-ink-2">{alert.rule}</dd>
        </div>
        <div>
          <dt className="text-label uppercase text-ink-3">Source</dt>
          <dd className="mt-1 text-ink-2">{alert.source}</dd>
        </div>
        <div>
          <dt className="text-label uppercase text-ink-3">Owner</dt>
          <dd className="mt-1 text-ink-2">{alert.owner}</dd>
        </div>
        <div>
          <dt className="text-label uppercase text-ink-3">Triggered</dt>
          <dd className="mt-1 text-ink-2">
            {date(alert.triggeredAt)} · {time(alert.triggeredAt)}
          </dd>
        </div>
      </dl>

      {resolving && (
        <div className="mt-6">
          <Field id="resolve-note" label="Resolution note" hint="Required. Explain what was done; it is kept in the audit trail." required>
            <Textarea id="resolve-note" value={note} onChange={(e) => setNote(e.target.value)} aria-describedby="resolve-note-hint" />
          </Field>
        </div>
      )}
    </Sheet>
  );
}
