import { cn } from "@/lib/utils";

export type TimelineEvent = { id: string; at: string; label: string; title: string; detail?: string; tone?: "neutral" | "accent" | "ok" | "warn" | "danger" | "ai" };

const DOT: Record<NonNullable<TimelineEvent["tone"]>, string> = {
  neutral: "bg-ink-4",
  accent: "bg-accent",
  ok: "bg-ok",
  warn: "bg-warn",
  danger: "bg-danger",
  ai: "bg-ai",
};

/** Vertical event timeline (plan §20 operational family; object activity, deal history). */
export function Timeline({ events, className }: { events: TimelineEvent[]; className?: string }) {
  return (
    <ol className={cn("relative", className)}>
      {events.map((e, i) => (
        <li key={e.id} className="relative flex gap-3 pb-4 last:pb-0">
          {i < events.length - 1 && <span aria-hidden className="absolute bottom-0 left-[5px] top-4 w-px bg-line" />}
          <span aria-hidden className={cn("relative mt-1.5 size-[11px] shrink-0 rounded-full border-2 border-surface", DOT[e.tone ?? "neutral"])} />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[13px] font-medium text-ink">{e.title}</p>
              <time className="shrink-0 text-[11px] text-ink-4" dateTime={e.at}>
                {e.label}
              </time>
            </div>
            {e.detail && <p className="mt-0.5 text-[12px] text-ink-3">{e.detail}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
