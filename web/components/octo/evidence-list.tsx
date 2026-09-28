"use client";

import { useId, useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export type Evidence = { ref: string; title: string; kind: string; excerpt?: string };

/**
 * Cited evidence with optional expandable excerpts (AI-102). Each reference is a
 * disclosure button, so the drawer works by keyboard and without animation.
 */
export function EvidenceList({ items, className }: { items: Evidence[]; className?: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const base = useId();

  return (
    <ul className={cn("divide-y divide-line rounded-lg border border-line", className)}>
      {items.map((ev) => {
        const isOpen = open === ev.ref;
        const panel = `${base}-${ev.ref}`;
        return (
          <li key={ev.ref}>
            <button
              type="button"
              aria-expanded={ev.excerpt ? isOpen : undefined}
              aria-controls={ev.excerpt ? panel : undefined}
              disabled={!ev.excerpt}
              onClick={() => setOpen(isOpen ? null : ev.ref)}
              className="flex min-h-11 w-full items-center gap-3 px-3 py-2 text-left hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent disabled:hover:bg-transparent"
            >
              <span className="font-data text-[11px] text-accent">[{ev.ref}]</span>
              <FileText aria-hidden className="size-3.5 shrink-0 text-ink-3" />
              <span className="min-w-0 flex-1 truncate text-[13px] text-ink">{ev.title}</span>
              <span className="hidden shrink-0 font-data text-[10px] uppercase tracking-[0.06em] text-ink-3 sm:inline">{ev.kind}</span>
              {ev.excerpt && <ChevronDown aria-hidden className={cn("size-3.5 shrink-0 text-ink-3 transition-transform", isOpen && "rotate-180")} />}
            </button>
            {ev.excerpt && isOpen && (
              <p id={panel} className="border-t border-dashed border-line bg-subtle px-3 py-2.5 font-data text-[12px] leading-relaxed text-ink-2">
                {ev.excerpt}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
