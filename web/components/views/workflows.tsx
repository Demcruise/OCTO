"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { ago, time } from "@/lib/format";
import { APPROVALS, DEMO_NOW, RECON, SEVERITY_ORDER, TASKS, type Approval, type ReconBreak, type Task } from "@/lib/demo-data";
import { PageBody, PageHeader } from "@/components/layout/page-header";
import { DataTable, type Column } from "@/components/data/data-table";
import { Button } from "@/components/ui/button";
import { EntityChip, StatusBadge, type Tone } from "@/components/ui/badge";
import { Field, Tabs, Textarea } from "@/components/ui/controls";
import { Sheet } from "@/components/ui/overlay";
import { EmptyState, FreshnessBadge, useToast } from "@/components/ui/states";
import { SEVERITY_TONE } from "./control-center";

type Tab = "tasks" | "approvals" | "recon";
const now = new Date(DEMO_NOW);
const TASK_TONE: Record<Task["status"], Tone> = { "To do": "neutral", "In progress": "info", Blocked: "danger" };

const taskColumns: Column<Task>[] = [
  { id: "title", header: "Task", value: (t) => t.title },
  { id: "entity", header: "Entity", value: (t) => t.entity.name, cell: (t) => <EntityChip type={t.entity.type} name={t.entity.name} /> },
  { id: "type", header: "Type", value: (t) => t.type, facet: true },
  {
    id: "priority",
    header: "Priority",
    value: (t) => t.priority,
    sortValue: (t) => SEVERITY_ORDER[t.priority],
    cell: (t) => (
      <StatusBadge tone={SEVERITY_TONE[t.priority]} className="capitalize">
        {t.priority}
      </StatusBadge>
    ),
  },
  { id: "status", header: "Status", value: (t) => t.status, facet: true, cell: (t) => <StatusBadge tone={TASK_TONE[t.status]}>{t.status}</StatusBadge> },
  { id: "due", header: "Due", value: (t) => t.due, align: "right" },
];

const reconColumns: Column<ReconBreak>[] = [
  { id: "id", header: "Break", value: (r) => r.id, cell: (r) => <span className="font-data text-[12px]">{r.id}</span> },
  { id: "entity", header: "Entity", value: (r) => r.entity.name, cell: (r) => <EntityChip type={r.entity.type} name={r.entity.name} /> },
  { id: "field", header: "Field", value: (r) => r.field },
  { id: "source", header: "Source value", value: (r) => r.sourceValue, align: "right" },
  { id: "ibor", header: "IBOR value", value: (r) => r.iborValue, align: "right" },
  { id: "variance", header: "Variance", value: (r) => r.variance, align: "right", cell: (r) => <span className="text-danger">{r.variance}</span> },
  {
    id: "severity",
    header: "Severity",
    value: (r) => r.severity,
    sortValue: (r) => SEVERITY_ORDER[r.severity],
    facet: true,
    cell: (r) => (
      <StatusBadge tone={SEVERITY_TONE[r.severity]} className="capitalize">
        {r.severity}
      </StatusBadge>
    ),
  },
  { id: "age", header: "Age", value: (r) => r.age, align: "right" },
];

/** Workflows (WF-001): my tasks, approvals with required comments, and reconciliation breaks. */
export function WorkflowsView() {
  const params = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const tab = (["tasks", "approvals", "recon"].includes(params.get("tab") ?? "") ? params.get("tab") : "tasks") as Tab;
  const openId = params.get("id");
  const [approvals, setApprovals] = useState(APPROVALS);
  const [breaks, setBreaks] = useState(RECON);

  const go = (t: Tab, id?: string) => router.replace(`/app/workflows?tab=${t}${id ? `&id=${id}` : ""}`, { scroll: false });
  const record = (title: string) => toast({ tone: "ok", title, body: "Recorded in this session only (demo)." });

  return (
    <>
      <PageHeader
        eyebrow="Operate"
        title="Workflows"
        description="Everything waiting on a person: your tasks, pending approvals, and reconciliation breaks."
        meta={<FreshnessBadge state="demo" asOf={`queue as of ${time(DEMO_NOW)}`} />}
      />
      <div className="border-b border-line bg-surface px-4 sm:px-6">
        <Tabs<Tab>
          label="Workflow queues"
          value={tab}
          onChange={(t) => go(t)}
          className="border-b-0"
          items={[
            { value: "tasks", label: "My tasks", count: TASKS.length },
            { value: "approvals", label: "Approvals", count: approvals.length },
            { value: "recon", label: "Reconciliation", count: breaks.length },
          ]}
        />
      </div>
      <PageBody>
        {tab === "tasks" && (
          <DataTable
            label="My tasks"
            data={TASKS}
            columns={taskColumns}
            rowId={(t) => t.id}
            initialSort={[{ id: "priority", desc: false }]}
            exportName="octo-my-tasks"
            empty={{ title: "No tasks assigned to you", body: "Tasks are created from approvals, alerts, and reconciliation breaks." }}
          />
        )}

        {tab === "approvals" &&
          (approvals.length === 0 ? (
            <div className="rounded-lg border border-line bg-surface">
              <EmptyState icon={<ShieldCheck />} title="No approvals waiting" body="Investment memos, LP reports, capital calls, and data overrides that need your sign-off appear here." />
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {approvals.map((a) => (
                <li key={a.id} className="flex flex-col rounded-lg border border-line bg-surface p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-label uppercase text-ink-3">{a.kind}</p>
                      <p className="mt-1 text-[14px] font-medium text-ink">{a.title}</p>
                    </div>
                    <StatusBadge tone={a.due === "Today" ? "warn" : "neutral"}>Due {a.due}</StatusBadge>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-2">{a.summary}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-ink-3">
                    <EntityChip type={a.entity.type} name={a.entity.name} />
                    <span>{a.progress}</span>
                    <span>
                      from {a.requestedBy} · {ago(a.requestedAt, now)}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button size="sm" variant="primary" onClick={() => go("approvals", a.id)}>
                      Review <ArrowRight />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ))}

        {tab === "recon" && (
          <DataTable
            label="Reconciliation breaks"
            data={breaks}
            columns={reconColumns}
            rowId={(r) => r.id}
            onRowOpen={(r) => go("recon", r.id)}
            exportName="octo-recon-breaks"
            staleNotice="Administrator file for OCTO Venture FoF arrived late; its breaks may be incomplete."
            empty={{ title: "Books are reconciled", body: "Breaks appear when a source value disagrees with the IBOR." }}
            renderExpanded={(r) => <p className="text-[12px] text-ink-3">Likely cause: {r.cause}</p>}
          />
        )}
      </PageBody>

      <ApprovalSheet
        approval={tab === "approvals" ? (approvals.find((a) => a.id === openId) ?? null) : null}
        onClose={() => go("approvals")}
        onDecide={(a, decision) => {
          setApprovals((xs) => xs.filter((x) => x.id !== a.id));
          go("approvals");
          record(`${a.id} ${decision}`);
        }}
      />
      <ReconSheet
        item={tab === "recon" ? (breaks.find((b) => b.id === openId) ?? null) : null}
        onClose={() => go("recon")}
        onResolve={(b, how) => {
          setBreaks((xs) => xs.filter((x) => x.id !== b.id));
          go("recon");
          record(`${b.id} resolved · ${how}`);
        }}
      />
    </>
  );
}

type Decision = "approved" | "changes requested" | "rejected";

function ApprovalSheet({ approval, onClose, onDecide }: { approval: Approval | null; onClose: () => void; onDecide: (a: Approval, d: Decision) => void }) {
  const [comment, setComment] = useState("");
  const [tried, setTried] = useState(false);
  if (!approval) return null;
  const needsComment = comment.trim().length < 5;
  const decide = (d: Decision) => {
    // Every decision is explained: the comment is the audit record (WF-001).
    if (needsComment) return setTried(true);
    setComment("");
    setTried(false);
    onDecide(approval, d);
  };
  return (
    <Sheet
      open
      onClose={onClose}
      eyebrow={`${approval.kind} · ${approval.id}`}
      title={approval.title}
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="danger" size="sm" onClick={() => decide("rejected")}>
            Reject
          </Button>
          <Button size="sm" onClick={() => decide("changes requested")}>
            Request changes
          </Button>
          <Button variant="primary" size="sm" onClick={() => decide("approved")}>
            Approve
          </Button>
        </div>
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <EntityChip type={approval.entity.type} name={approval.entity.name} />
        <StatusBadge tone={approval.due === "Today" ? "warn" : "neutral"}>Due {approval.due}</StatusBadge>
        <StatusBadge tone="info">{approval.progress}</StatusBadge>
      </div>
      <p className="mt-4 text-[13px] leading-relaxed text-ink-2">{approval.summary}</p>
      <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4 text-[12px]">
        <div>
          <dt className="text-ink-3">Requested by</dt>
          <dd className="mt-0.5 text-ink-2">{approval.requestedBy}</dd>
        </div>
        <div>
          <dt className="text-ink-3">Requested</dt>
          <dd className="mt-0.5 text-ink-2">{ago(approval.requestedAt, now)}</dd>
        </div>
      </dl>
      <div className="mt-6">
        <Field id="approval-comment" label="Decision comment" required error={tried && needsComment ? "Add a comment of at least 5 characters before deciding." : undefined} hint="Required for every decision; stored with the approval record.">
          <Textarea
            id="approval-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            aria-invalid={tried && needsComment}
            aria-describedby={tried && needsComment ? "approval-comment-error" : "approval-comment-hint"}
          />
        </Field>
      </div>
    </Sheet>
  );
}

const RESOLUTIONS = [
  { id: "mapping", label: "Fix mapping", body: "The source is right but mapped to the wrong IBOR field or instrument." },
  { id: "source", label: "Correct source", body: "The source is wrong; request a corrected file from the provider." },
  { id: "ibor", label: "Accept IBOR", body: "The IBOR is right; record why the source differs." },
] as const;

function ReconSheet({ item, onClose, onResolve }: { item: ReconBreak | null; onClose: () => void; onResolve: (b: ReconBreak, how: string) => void }) {
  const [choice, setChoice] = useState<(typeof RESOLUTIONS)[number]["id"] | null>(null);
  const [note, setNote] = useState("");
  if (!item) return null;
  const ready = choice && note.trim().length >= 5;
  return (
    <Sheet
      open
      onClose={onClose}
      eyebrow={`Reconciliation · ${item.id}`}
      title={item.field}
      footer={
        <div className="flex items-center justify-between gap-3">
          <p className="text-[12px] text-ink-3">Breaks can’t be ignored — each one needs a resolution.</p>
          <Button
            variant="primary"
            size="sm"
            disabled={!ready}
            onClick={() => {
              const how = RESOLUTIONS.find((r) => r.id === choice)!.label;
              setChoice(null);
              setNote("");
              onResolve(item, how);
            }}
          >
            Resolve break
          </Button>
        </div>
      }
    >
      <EntityChip type={item.entity.type} name={item.entity.name} />
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-md border border-line p-3">
          <p className="text-label uppercase text-ink-3">{item.source}</p>
          <p className="mt-1 font-data text-[15px] font-medium text-ink">{item.sourceValue}</p>
        </div>
        <div className="rounded-md border border-line p-3">
          <p className="text-label uppercase text-ink-3">IBOR</p>
          <p className="mt-1 font-data text-[15px] font-medium text-ink">{item.iborValue}</p>
        </div>
      </div>
      <p className="mt-3 text-[13px] text-ink-2">
        Variance <span className="font-data text-danger">{item.variance}</span> · open {item.age} · likely cause: {item.cause}
      </p>

      <fieldset className="mt-6">
        <legend className="text-[12px] font-medium text-ink-2">
          Resolution <span className="text-danger">*</span>
        </legend>
        <div role="radiogroup" className="mt-2 space-y-2">
          {RESOLUTIONS.map((r) => (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={choice === r.id}
              onClick={() => setChoice(r.id)}
              className={cn(
                "flex w-full cursor-pointer flex-col items-start rounded-md border px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                choice === r.id ? "border-accent bg-accent-soft" : "border-line hover:bg-hover",
              )}
            >
              <span className="text-[13px] font-medium text-ink">{r.label}</span>
              <span className="mt-0.5 text-[12px] text-ink-3">{r.body}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-5">
        <Field id="recon-note" label="Note" required hint="Required. Explain the evidence behind the resolution.">
          <Textarea id="recon-note" value={note} onChange={(e) => setNote(e.target.value)} aria-describedby="recon-note-hint" />
        </Field>
      </div>
    </Sheet>
  );
}
