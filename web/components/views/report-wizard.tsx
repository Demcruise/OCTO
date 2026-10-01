"use client";

import { useState } from "react";
import { AlertTriangle, Ban, Check, CheckCircle2, Circle, CircleDot, Download, FileText, Loader2, RotateCw, Send, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormat } from "@/lib/use-format";
import { AS_OF, FUNDS, fundDpi, fundTvpi, type Report } from "@/lib/demo";
import { Panel, PanelBody, PanelHead } from "@/components/page/panel";
import { Button, LinkButton, ringInset } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Checkbox, Field, Switch, Textarea } from "@/components/ui/controls";
import { InlineAlert, useToast } from "@/components/feedback";

export type StepState = "current" | "complete" | "pending" | "error" | "blocked";

const STEP_META: Record<StepState, { icon: React.ReactNode; cls: string; label: string }> = {
  complete: { icon: <CheckCircle2 />, cls: "text-mark-ok", label: "Complete" },
  current: { icon: <CircleDot />, cls: "text-mark-info", label: "Current" },
  pending: { icon: <Circle />, cls: "text-mark-neutral", label: "Pending" },
  error: { icon: <XCircle />, cls: "text-mark-danger", label: "Error" },
  blocked: { icon: <Ban />, cls: "text-mark-warn", label: "Blocked" },
};

const STEPS = ["Choose report", "Period", "Scope", "Source metrics", "Generate", "Review draft", "Resolve issues", "Approve", "Publish"] as const;
const PERIODS = ["Q3 2026", "Q2 2026", "H1 2026", "FY 2025"];

type Issue = { id: string; title: string; detail: string; href: string; resolved: boolean };

const INITIAL_ISSUES: Omit<Issue, "resolved">[] = [
  { id: "ISS-1", title: "Valuation notes cite a superseded memo", detail: "Section “Valuation notes” binds to Helios memo v1; v2 was approved 12h ago.", href: "/app/reports/rpt-0224" },
  { id: "ISS-2", title: "Two open reconciliation breaks", detail: "Cash variance on Flagship II must be disclosed or resolved before publishing.", href: "/app/reconciliation" },
  { id: "ISS-3", title: "Stale mark on Solus Energy Partners", detail: "No approved valuation in 45 days; the report would show the Q2 mark.", href: "/app/companies/cmp-0215" },
];

/**
 * Report flow (REP-001): choose report → period → scope → review source metrics
 * → generate → review draft → resolve issues → approve → publish/export. Every
 * step shows Current / Complete / Pending / Error / Blocked; publishing is gated
 * on zero open issues; generation failure offers Try again, View last successful
 * draft and Open source issues.
 */
export function ReportWizard({ templates, onCancel, onDone }: { templates: Report[]; onCancel: () => void; onDone: (r: { name: string; template: Report; published: boolean }) => void }) {
  const f = useFormat();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [picked, setTemplate] = useState<string | null>(null);
  const [period, setPeriod] = useState(PERIODS[0]);
  const [scope, setScope] = useState<string[]>(["FND-002"]);
  const [gen, setGen] = useState<"idle" | "running" | "done" | "failed">("idle");
  const [simulateFail, setSimulateFail] = useState(false);
  const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES.map((i) => ({ ...i, resolved: false })));
  const [comment, setComment] = useState("");
  const [approved, setApproved] = useState(false);
  const [published, setPublished] = useState(false);

  const t = templates.find((x) => x.id === picked) ?? templates[0];
  const template = t?.id;
  const open = issues.filter((i) => !i.resolved).length;
  const name = `${period} ${t?.type ?? "report"} · ${scope.map((id) => FUNDS.find((x) => x.id === id)!.short).join(", ") || "no funds"}`;

  const stateOf = (i: number): StepState => {
    if (i === 4 && gen === "failed") return "error";
    if (i === 8 && open > 0) return "blocked";
    if (i === 8 && published) return "complete";
    if (i === step) return "current";
    return i < step ? "complete" : "pending";
  };

  const canNext = [!!t, !!period, scope.length > 0, true, gen === "done", true, open === 0, approved, false][step];
  const runGenerate = (fail = simulateFail) => {
    setGen("running");
    window.setTimeout(() => setGen(fail ? "failed" : "done"), 1100);
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
      <Panel as="div" className="h-fit">
        <PanelHead title="New report" description={`Step ${step + 1} of ${STEPS.length}`} />
        <ol className="px-3 pb-3" aria-label="Report steps">
          {STEPS.map((label, i) => {
            const s = stateOf(i);
            const m = STEP_META[s];
            const reachable = i <= step;
            return (
              <li key={label}>
                <button
                  type="button"
                  disabled={!reachable}
                  aria-current={i === step ? "step" : undefined}
                  onClick={() => setStep(i)}
                  className={cn("flex w-full items-center gap-2.5 rounded-sm px-2 py-1.5 text-left disabled:cursor-default", reachable && "cursor-pointer hover:bg-hover", i === step && "bg-accent-soft", ringInset)}
                >
                  <span aria-hidden className={cn("[&>svg]:size-4", m.cls)}>
                    {m.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block text-[13px]", i === step ? "font-semibold text-ink" : "text-ink-2")}>{label}</span>
                    <span className="block text-[11px] text-ink-3">{m.label}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </Panel>

      <Panel>
        <PanelHead title={STEPS[step]} description={name} toolbar={<StatusBadge tone="info">Demo data</StatusBadge>} divider />
        <PanelBody className="space-y-4 pt-4">
          {step === 0 && (
            <fieldset>
              <legend className="mb-2 text-[13px] text-ink-2">Start from a template. Every number is bound to IBOR data and cited.</legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {templates.map((x) => (
                  <label key={x.id} className={cn("flex cursor-pointer items-start gap-3 rounded-md border p-3", template === x.id ? "border-accent bg-accent-soft" : "border-line hover:bg-hover")}>
                    <input type="radio" name="template" value={x.id} checked={template === x.id} onChange={() => setTemplate(x.id)} className="mt-0.5 accent-[var(--color-accent)]" />
                    <span>
                      <span className="block text-[13px] font-medium text-ink">{x.name}</span>
                      <span className="block text-[12px] text-ink-3">
                        {x.type} · {x.sections.length || "no"} sections · {x.version}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {step === 1 && (
            <fieldset>
              <legend className="mb-2 text-[13px] text-ink-2">Reporting period. Data is taken as of each period end.</legend>
              <div className="flex flex-wrap gap-2">
                {PERIODS.map((p) => (
                  <label key={p} className={cn("flex h-8 cursor-pointer items-center gap-2 rounded-sm border px-3 text-[13px]", period === p ? "border-accent/60 bg-accent-soft font-semibold text-accent-ink" : "border-line text-ink-2 hover:bg-hover")}>
                    <input type="radio" name="period" className="sr-only" checked={period === p} onChange={() => setPeriod(p)} />
                    {period === p && <Check aria-hidden className="size-3.5" />}
                    {p}
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset>
              <legend className="mb-2 text-[13px] text-ink-2">Which funds does this report cover?</legend>
              <ul className="divide-y divide-line-subtle rounded-md border border-line">
                {FUNDS.map((x) => (
                  <li key={x.id} className="flex items-center gap-3 px-3 py-2.5 text-[13px]">
                    <Checkbox label={`Include ${x.name}`} checked={scope.includes(x.id)} onChange={(v) => setScope((s) => (v ? [...s, x.id] : s.filter((y) => y !== x.id)))} />
                    <span className="flex-1 text-ink">{x.name}</span>
                    <span className="tabular-nums text-ink-3">{f.money(x.nav)} NAV</span>
                  </li>
                ))}
              </ul>
              {scope.length === 0 && <p className="mt-2 text-[12px] text-danger">Select at least one fund.</p>}
            </fieldset>
          )}

          {step === 3 && (
            <>
              <p className="text-[13px] text-ink-2">These are the source values the report will bind to, as of {f.date(AS_OF)}.</p>
              <div className="overflow-x-auto rounded-md border border-line">
                <table className="w-full min-w-[560px] text-[13px]">
                  <thead className="bg-head text-[12px] text-ink-3">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Fund</th>
                      <th className="px-3 py-2 text-right font-medium">NAV</th>
                      <th className="px-3 py-2 text-right font-medium">TVPI</th>
                      <th className="px-3 py-2 text-right font-medium">DPI</th>
                      <th className="px-3 py-2 text-right font-medium">Net IRR</th>
                      <th className="px-3 py-2 text-left font-medium">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FUNDS.filter((x) => scope.includes(x.id)).map((x) => (
                      <tr key={x.id} className="border-t border-line-subtle">
                        <td className="px-3 py-2.5 font-medium text-ink">{x.short}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums">{f.money(x.nav)}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums">{f.multiple(fundTvpi(x))}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums">{f.multiple(fundDpi(x))}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums">{f.pct(x.netIrr)}</td>
                        <td className="px-3 py-2.5">
                          <StatusBadge tone={x.id === "FND-002" ? "warn" : "ok"}>{x.id === "FND-002" ? "2 open breaks" : "Reconciled"}</StatusBadge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              {gen === "idle" && <p className="text-[13px] text-ink-2">Generate a draft from the selected template, period and scope. Nothing is sent until it is approved.</p>}
              {gen === "running" && (
                <p role="status" className="flex items-center gap-2 text-[13px] text-ink-2">
                  <Loader2 aria-hidden className="size-4 animate-spin text-accent motion-reduce:animate-none" /> Generating draft from IBOR data…
                </p>
              )}
              {gen === "done" && <InlineAlert tone="ok" title="Draft generated">{(t?.sections.length || 6)} sections bound to IBOR data as of {f.date(AS_OF)}.</InlineAlert>}
              {gen === "failed" && (
                <InlineAlert tone="danger" title="We couldn't generate the draft.">
                  The administrator file for Flagship II has not arrived, so cash could not be reconciled. Nothing was saved.
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" variant="primary" onClick={() => (setSimulateFail(false), runGenerate(false))}>
                      <RotateCw /> Try again
                    </Button>
                    <LinkButton size="sm" href="/app/reports/rpt-0231">
                      View last successful draft
                    </LinkButton>
                    <LinkButton size="sm" href="/app/data?tab=health">
                      Open source issues
                    </LinkButton>
                  </div>
                </InlineAlert>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" disabled={gen === "running"} onClick={() => runGenerate()}>
                  {gen === "done" ? "Regenerate" : "Generate draft"}
                </Button>
                <label className="flex items-center gap-2 text-[12px] text-ink-3">
                  <Switch checked={simulateFail} onChange={setSimulateFail} label="Simulate a generation failure (demo)" /> Simulate a failure (demo)
                </label>
              </div>
            </>
          )}

          {step === 5 && (
            <ul className="divide-y divide-line-subtle rounded-md border border-line">
              {(t?.sections.length ? t.sections : [{ id: "s1", title: "Summary", binding: "Narrative", citations: 0, valid: true }]).map((sec) => (
                <li key={sec.id} className="flex items-center gap-3 px-3 py-2.5 text-[13px]">
                  <FileText aria-hidden className="size-4 shrink-0 text-ink-4" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-ink">{sec.title}</span>
                    <span className="block truncate font-data text-[11px] text-ink-3">{sec.binding}</span>
                  </span>
                  <span className="text-[12px] tabular-nums text-ink-3">{sec.citations} citations</span>
                  {sec.valid ? <StatusBadge tone="ok">Valid</StatusBadge> : <StatusBadge tone="warn">Needs review</StatusBadge>}
                </li>
              ))}
            </ul>
          )}

          {step === 6 && (
            <>
              <p className="text-[13px] text-ink-2">{open === 0 ? "All issues resolved. The report can move to approval." : `${open} of ${issues.length} issues must be resolved before approval and publishing.`}</p>
              <ul className="divide-y divide-line-subtle rounded-md border border-line">
                {issues.map((i) => (
                  <li key={i.id} className="flex flex-wrap items-start gap-3 px-3 py-3 text-[13px]">
                    <span aria-hidden className={cn("mt-px [&>svg]:size-4", i.resolved ? "text-mark-ok" : "text-mark-warn")}>{i.resolved ? <CheckCircle2 /> : <AlertTriangle />}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium text-ink">{i.title}</span>
                      <span className="block text-[12px] text-ink-3">{i.detail}</span>
                    </span>
                    {i.resolved ? (
                      <StatusBadge tone="ok">Resolved</StatusBadge>
                    ) : (
                      <span className="flex gap-2">
                        <LinkButton size="sm" variant="ghost" href={i.href}>
                          Open source
                        </LinkButton>
                        <Button size="sm" onClick={() => setIssues((xs) => xs.map((x) => (x.id === i.id ? { ...x, resolved: true } : x)))}>
                          Mark resolved
                        </Button>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}

          {step === 7 && (
            <>
              {approved ? (
                <InlineAlert tone="ok" title="Approved">Approved by you with comment: “{comment.trim()}”.</InlineAlert>
              ) : (
                <>
                  <Field id="rep-approve" label="Approval comment" required hint="Required. Stored with the report version in the audit trail.">
                    <Textarea id="rep-approve" value={comment} onChange={(e) => setComment(e.target.value)} aria-describedby="rep-approve-hint" />
                  </Field>
                  <Button variant="primary" disabled={comment.trim().length < 5} onClick={() => setApproved(true)}>
                    Approve report
                  </Button>
                </>
              )}
            </>
          )}

          {step === 8 && (
            <>
              {open > 0 ? (
                <InlineAlert tone="warn" title="Publishing is blocked">
                  {open} open issue{open > 1 ? "s" : ""} must be resolved first.{" "}
                  <button type="button" className="cursor-pointer font-medium text-accent-ink underline underline-offset-2" onClick={() => setStep(6)}>
                    Resolve issues
                  </button>
                </InlineAlert>
              ) : published ? (
                <InlineAlert tone="ok" title="Published">The report is published to the LP portal (demo — nothing left this session).</InlineAlert>
              ) : (
                <p className="text-[13px] text-ink-2">0 open issues · approved. Publish to the LP portal or export a copy.</p>
              )}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="primary"
                  disabled={open > 0 || !approved || published}
                  aria-describedby="publish-gate"
                  onClick={() => {
                    setPublished(true);
                    if (t) onDone({ name, template: t, published: true });
                  }}
                >
                  <Send /> Publish
                </Button>
                <Button disabled={gen !== "done"} onClick={() => toast({ tone: "ok", title: "Export prepared", body: `${name}.pdf (demo — no file is created).` })}>
                  <Download /> Export PDF
                </Button>
              </div>
              <p id="publish-gate" className="text-[12px] text-ink-3">
                Publish requires 0 open issues and an approval. {open > 0 ? `${open} open.` : approved ? "Ready." : "Waiting for approval."}
              </p>
            </>
          )}
        </PanelBody>
        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-line-subtle px-5 py-3">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <div className="flex gap-2">
            {step > 0 && <Button onClick={() => setStep(step - 1)}>Back</Button>}
            {step < STEPS.length - 1 && (
              <Button variant="primary" disabled={!canNext} onClick={() => setStep(step + 1)}>
                Continue
              </Button>
            )}
          </div>
        </footer>
      </Panel>
    </div>
  );
}
