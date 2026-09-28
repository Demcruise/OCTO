"use client";

import { useState } from "react";
import { AlertTriangle, Check, Lock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { EventLog } from "@/components/octo/event-log";
import { Reveal, SampleLabel, Section, SectionHeader, focusRing } from "./primitives";

type Outcome = "pending" | "approved" | "rejected";

const FLOW = [
  { step: "AI proposal", detail: "Add the EBITDA explanation to the Q3 IC memo" },
  { step: "Evidence", detail: "4 cited records · all resolve to a source" },
  { step: "Permission check", detail: "Proposal and sources visible to the Growth Fund II deal team" },
  { step: "Human review", detail: "Deal lead reviews the draft and its evidence" },
  { step: "Approved action", detail: "Memo updated; decision logged with reviewer and reason" },
];

function stepState(i: number, outcome: Outcome) {
  if (i < 3) return "done";
  if (outcome === "pending") return i === 3 ? "current" : "locked";
  if (outcome === "approved") return "done";
  return i === 3 ? "rejected" : "locked";
}

/** Controls around every AI output: proposal → evidence → permission → review → action (PAL-020). */
export function GovernedAI() {
  const [outcome, setOutcome] = useState<Outcome>("pending");

  const controls: [string, string, "ok" | "warn" | "neutral"][] = [
    ["Permission scope", "Growth Fund II deal team", "ok"],
    ["Source grounding", "Every sentence cited", "ok"],
    ["Evidence", "4 records · 0 unresolved", "ok"],
    ["Model status", "Approved model · v3.2", "ok"],
    ["Approval state", outcome === "pending" ? "Pending approval" : outcome === "approved" ? "Approved by deal lead" : "Rejected", outcome === "pending" ? "warn" : outcome === "approved" ? "ok" : "neutral"],
  ];

  return (
    <Section id="ai" labelledBy="ai-title">
      <SectionHeader
        id="ai-title"
        index="11"
        eyebrow="Governed AI"
        title="Intelligence with controls built in."
        lead="AI in OCTO drafts. It never approves. Every proposal passes an evidence check and a permission check, then waits for a named reviewer."
      />

      <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <Reveal className="min-w-0 lg:col-span-7">
          <div className="rounded-sm border border-line-strong bg-canvas">
            <div className="flex items-center justify-between border-b border-line bg-subtle px-4 py-2.5">
              <p className="font-data text-[11px] text-ink-2">octo / approvals / ic-memo-q3</p>
              <SampleLabel>Demo environment</SampleLabel>
            </div>
            <ol aria-label="Governed action" className="p-5">
              {FLOW.map((f, i) => {
                const st = stepState(i, outcome);
                return (
                  <li key={f.step} className="relative grid grid-cols-[28px_1fr] gap-4 pb-5 last:pb-0">
                    {i < FLOW.length - 1 && <span aria-hidden className="absolute bottom-0 left-[13.5px] top-7 w-px bg-line-strong" />}
                    <span
                      className={cn(
                        "relative z-10 flex size-7 items-center justify-center rounded-full border",
                        st === "done" && "border-ok bg-ok text-white",
                        st === "current" && "border-accent bg-accent-soft text-accent",
                        st === "locked" && "border-line-strong bg-canvas text-ink-3",
                        st === "rejected" && "border-danger bg-danger text-white",
                      )}
                    >
                      {st === "done" && <Check aria-hidden className="size-3.5" />}
                      {st === "locked" && <Lock aria-hidden className="size-3" />}
                      {st === "rejected" && <X aria-hidden className="size-3.5" />}
                      {st === "current" && <span aria-hidden className="size-2 rounded-full bg-accent" />}
                      <span className="sr-only">{st}</span>
                    </span>
                    <div className={cn(st === "locked" && "opacity-60")}>
                      <p className="text-[15px] font-medium text-ink">{f.step}</p>
                      <p className="text-[13px] text-ink-3">{f.detail}</p>
                      {st === "current" && (
                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => setOutcome("rejected")}
                            className={cn("min-h-11 border border-line-strong px-4 text-sm text-ink hover:bg-subtle sm:min-h-9", focusRing)}
                          >
                            Reject
                          </button>
                          <button
                            type="button"
                            onClick={() => setOutcome("approved")}
                            className={cn("min-h-11 bg-ink px-4 text-sm font-medium text-white hover:bg-ink-2 sm:min-h-9", focusRing)}
                          >
                            Approve as deal lead
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-3">
              <p aria-live="polite" className="text-[13px] text-ink-2">
                {outcome === "pending" && "Nothing changes until a person decides."}
                {outcome === "approved" && "Approved. The memo update is recorded with its evidence."}
                {outcome === "rejected" && "Rejected. The draft is discarded; its sources stay on record."}
              </p>
              {outcome !== "pending" && (
                <button type="button" onClick={() => setOutcome("pending")} className={cn("min-h-9 px-2 text-[13px] text-ink-3 hover:text-ink", focusRing)}>
                  Reset demo
                </button>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal className="min-w-0 space-y-6 lg:col-span-5" delay={0.06}>
          <dl className="border-t border-line-strong">
            {controls.map(([k, v, tone]) => (
              <div key={k} className="flex items-center justify-between gap-4 border-b border-line-strong py-3">
                <dt className="font-data text-meta uppercase text-ink-3">{k}</dt>
                <dd className={cn("text-right text-[13px]", tone === "ok" ? "text-ok" : tone === "warn" ? "text-warn" : "text-ink-2")}>{v}</dd>
              </div>
            ))}
          </dl>
          <div>
            <p className="font-data text-meta uppercase text-ink-3">Audit trail</p>
            <EventLog
              className="mt-3"
              label="AI audit trail"
              events={[
                { time: "09:42", event: "Draft generated", detail: "Approved model v3.2 · 4 citations", actor: "ai" },
                { time: "09:42", event: "Permission check passed", detail: "Deal team scope", actor: "system" },
                ...(outcome === "approved" ? [{ time: "09:51", event: "Approved", detail: "Deal lead · reason recorded", actor: "person" as const, emphasis: true }] : []),
                ...(outcome === "rejected" ? [{ time: "09:51", event: "Rejected", detail: "Deal lead · draft discarded", actor: "person" as const }] : []),
              ]}
            />
          </div>
          <div className="border border-warn/30 bg-warn/8 p-4">
            <p className="flex items-center gap-2 text-sm font-medium text-ink">
              <AlertTriangle aria-hidden className="size-4 text-warn" /> When evidence is missing
            </p>
            <p className="mt-1 text-[13px] text-ink-2">
              Asked for Harbor Logistics&apos; exit value, OCTO answers “Insufficient evidence” — there is no approved exit model on record — and lists the records it
              did find instead of estimating.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
