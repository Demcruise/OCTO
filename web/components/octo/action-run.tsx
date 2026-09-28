import { Check, Lock, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type RunOutcome = "pending" | "reviewed" | "rejected";

const STEPS = [
  { label: "Signal detected", phase: "analysis" },
  { label: "Evidence assembled", phase: "analysis" },
  { label: "AI drafts recommendation", phase: "analysis" },
  { label: "Human reviews", phase: "action" },
  { label: "Approval or rejection", phase: "action" },
  { label: "Workflow updated", phase: "action" },
] as const;

type State = "done" | "current" | "locked" | "rejected" | "skipped";

function stateFor(i: number, outcome: RunOutcome): State {
  if (i < 3) return "done";
  if (outcome === "pending") return i === 3 ? "current" : "locked";
  if (outcome === "reviewed") return i === 3 ? "done" : i === 4 ? "current" : "locked";
  return i === 3 ? "done" : i === 4 ? "rejected" : "skipped";
}

const NOTE: Record<State, string> = {
  done: "Complete",
  current: "Waiting for a person",
  locked: "Locked until approved",
  rejected: "Rejected",
  skipped: "No change made",
};

/**
 * Signal → evidence → draft → review → approval → workflow (PAL-006). Analysis
 * steps and action steps are styled differently, and action steps stay locked
 * until a person acts, so nothing reads as an autonomous transaction.
 */
export function ActionRun({ outcome, approver }: { outcome: RunOutcome; approver: string }) {
  return (
    <ol aria-label="Governed action" className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
      {STEPS.map((s, i) => {
        const st = stateFor(i, outcome);
        const action = s.phase === "action";
        return (
          <li
            key={s.label}
            className={cn(
              "flex items-center gap-2.5 rounded-md border px-2.5 py-2",
              st === "current" && "border-accent bg-accent-soft",
              st === "rejected" && "border-danger/30 bg-danger/8",
              (st === "done" || st === "locked" || st === "skipped") && (action ? "border-dashed border-line-strong" : "border-line"),
            )}
          >
            <span
              aria-hidden
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full border",
                st === "done" && "border-ok bg-ok text-white",
                st === "current" && "border-accent text-accent",
                st === "rejected" && "border-danger bg-danger text-white",
                (st === "locked" || st === "skipped") && "border-line-strong text-ink-3",
              )}
            >
              {st === "done" && <Check className="size-3" />}
              {st === "rejected" && <X className="size-3" />}
              {st === "locked" && <Lock className="size-2.5" />}
              {st === "current" && <span className="size-1.5 rounded-full bg-accent" />}
            </span>
            <div className="min-w-0">
              <p className={cn("text-[13px]", st === "locked" || st === "skipped" ? "text-ink-3" : "text-ink")}>{s.label}</p>
              <p className="font-data text-[10px] uppercase tracking-[0.06em] text-ink-3">
                {action ? "Action" : "Analysis"} · {st === "current" && i >= 3 ? `${NOTE[st]} · ${i === 4 ? approver : "you"}` : NOTE[st]}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
