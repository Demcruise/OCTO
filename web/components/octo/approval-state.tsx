import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type ApprovalStep = "draft" | "evidence" | "reviewer" | "action";

const STEPS: { id: ApprovalStep; label: string }[] = [
  { id: "draft", label: "Draft" },
  { id: "evidence", label: "Evidence" },
  { id: "reviewer", label: "Reviewer" },
  { id: "action", label: "Action" },
];

/**
 * The four gates every AI-drafted, action-like output passes (AGENT-004).
 * `reached` is the last gate completed; later gates render as pending, so the
 * visitor sees that nothing executes before a person approves it.
 */
export function ApprovalState({ reached, className }: { reached: ApprovalStep; className?: string }) {
  const at = STEPS.findIndex((s) => s.id === reached);
  return (
    <ol aria-label="Approval path" className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {STEPS.map((s, i) => {
        const done = i <= at;
        return (
          <li key={s.id} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden className={cn("h-px w-3 sm:w-5", done ? "bg-ok/50" : "bg-line-strong")} />}
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 font-data text-[10px] uppercase tracking-[0.06em]",
                done ? "border-ok/25 bg-ok/8 text-ok" : "border-line bg-canvas text-ink-3",
              )}
            >
              {done && <Check aria-hidden className="size-2.5" />}
              {s.label}
              <span className="sr-only">{done ? " complete" : " pending"}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
