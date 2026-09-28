import { cn } from "@/lib/utils";

export type LogEvent = { time: string; event: string; detail?: string; actor?: "ai" | "person" | "system"; emphasis?: boolean };

const ACTOR_LABEL = { ai: "AI", person: "Person", system: "System" } as const;

/**
 * Time-ordered event list used for the IBOR ledger and the audit trail
 * (CORE-103, GOV-101). Rendered as an ordered list so the sequence is announced.
 */
export function EventLog({ events, label, className }: { events: LogEvent[]; label: string; className?: string }) {
  return (
    <ol aria-label={label} className={cn("relative", className)}>
      {events.map((e, i) => (
        <li key={`${e.time}-${i}`} className="relative grid grid-cols-[52px_14px_1fr] items-start gap-x-3 pb-4 last:pb-0">
          <time className="pt-0.5 font-data text-[12px] tabular-nums text-ink-3">{e.time}</time>
          <span aria-hidden className="relative flex h-full justify-center">
            <span className={cn("relative z-10 mt-1.5 size-2 rounded-full", e.emphasis ? "bg-accent" : "border border-line-strong bg-canvas")} />
            {i < events.length - 1 && <span className="absolute bottom-[-4px] top-4 w-px bg-line" />}
          </span>
          <div className="min-w-0">
            <p className={cn("text-sm", e.emphasis ? "font-medium text-ink" : "text-ink")}>
              {e.event}
              {e.actor && <span className="ml-2 font-data text-[10px] uppercase tracking-[0.08em] text-ink-3">{ACTOR_LABEL[e.actor]}</span>}
            </p>
            {e.detail && <p className="mt-0.5 truncate text-[13px] text-ink-3">{e.detail}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
