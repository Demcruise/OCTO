"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormat } from "@/lib/use-format";
import type { AiDraft } from "@/lib/demo";
import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/controls";
import { AiCitation, AiConfidence, VerificationBadge } from "./ai-badge";

export type DraftOutcome = "accepted" | "edited" | "evidence-requested" | "rejected";

/**
 * Governed AI draft (plan §25): title, provenance, summary, evidence and
 * confidence, with Accept / Edit / Request evidence / Reject. Nothing is sent
 * or applied until a person chooses; reject and evidence requests need a note.
 */
export function AiDraftCard({ draft, onResolve, className }: { draft: AiDraft; onResolve: (outcome: DraftOutcome, note?: string) => void; className?: string }) {
  const f = useFormat();
  const [mode, setMode] = useState<"review" | "edit" | "reject" | "evidence">("review");
  const [text, setText] = useState(draft.body);
  const [note, setNote] = useState("");
  const needNote = (mode === "reject" || mode === "evidence") && note.trim().length < 5;

  return (
    <article className={cn("overflow-hidden rounded-xl border border-ai/25 bg-surface", className)} aria-label={`AI draft: ${draft.title}`}>
      <header className="flex flex-wrap items-center gap-2 border-b border-ai/20 bg-ai/5 px-4 py-2.5">
        <Sparkles aria-hidden className="size-3.5 text-ai" />
        <p className="text-[13px] font-semibold text-ink">{draft.title}</p>
        <div className="ml-auto flex items-center gap-2">
          <AiConfidence level={draft.confidence} />
          <VerificationBadge state={draft.verification} />
        </div>
      </header>

      <div className="px-4 py-3">
        {mode === "edit" ? (
          <Field id={`${draft.id}-edit`} label="Edit before accepting" hint="Your edits are attributed to you in the audit trail.">
            <Textarea id={`${draft.id}-edit`} value={text} onChange={(e) => setText(e.target.value)} className="min-h-40" aria-describedby={`${draft.id}-edit-hint`} />
          </Field>
        ) : (
          <p className="text-[13px] leading-relaxed text-ink-2">{text}</p>
        )}
        {(mode === "reject" || mode === "evidence") && (
          <div className="mt-3">
            <Field
              id={`${draft.id}-note`}
              label={mode === "reject" ? "Why is this draft wrong?" : "What evidence is missing?"}
              required
              hint="Required. It is fed back to improve future drafts."
            >
              <Textarea id={`${draft.id}-note`} value={note} onChange={(e) => setNote(e.target.value)} aria-describedby={`${draft.id}-note-hint`} />
            </Field>
          </div>
        )}
      </div>

      <div className="border-t border-line px-4 py-2.5">
        <p className="text-label uppercase text-ink-4">Evidence</p>
        <ol className="mt-1.5 grid gap-1 sm:grid-cols-2">
          {draft.citations.map((c, i) => (
            <AiCitation key={c.label} n={i + 1} label={c.label} locator={c.locator} />
          ))}
        </ol>
        <p className="mt-2 text-[11px] text-ink-4">
          {draft.model} · generated {f.ago(draft.createdAt, new Date("2026-09-30T13:42:00Z"))} · {draft.id}
        </p>
      </div>

      <footer className="flex flex-wrap items-center gap-2 border-t border-line bg-subtle/60 px-4 py-2.5">
        {mode === "review" && (
          <>
            <Button size="sm" variant="primary" onClick={() => onResolve("accepted")}>
              Accept
            </Button>
            <Button size="sm" onClick={() => setMode("edit")}>
              Edit
            </Button>
            <Button size="sm" onClick={() => setMode("evidence")}>
              Request evidence
            </Button>
            <Button size="sm" variant="danger" onClick={() => setMode("reject")}>
              Reject
            </Button>
          </>
        )}
        {mode === "edit" && (
          <>
            <Button size="sm" variant="primary" onClick={() => onResolve("edited", text)}>
              Accept edited draft
            </Button>
            <Button size="sm" variant="ghost" onClick={() => (setText(draft.body), setMode("review"))}>
              Cancel
            </Button>
          </>
        )}
        {(mode === "reject" || mode === "evidence") && (
          <>
            <Button size="sm" variant={mode === "reject" ? "danger" : "primary"} disabled={needNote} onClick={() => onResolve(mode === "reject" ? "rejected" : "evidence-requested", note)}>
              {mode === "reject" ? "Reject draft" : "Send evidence request"}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => (setNote(""), setMode("review"))}>
              Back
            </Button>
          </>
        )}
        <p className="ml-auto text-[11px] text-ink-3">Nothing is sent or applied until a person decides.</p>
      </footer>
    </article>
  );
}
