import { AlertTriangle, CheckCircle2, Clock3, OctagonAlert } from "lucide-react";
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

export type ActivityItem = { id: string; at: string; label: string; title: string; state: "complete" | "pending" | "attention" | "critical"; href?: string };

const ACTIVITY_STATE = {
  complete: { icon: <CheckCircle2 />, mark: "text-mark-info bg-mark-info/10", text: "text-info", label: "Complete" },
  pending: { icon: <Clock3 />, mark: "text-mark-neutral bg-sunken", text: "text-ink-3", label: "Pending" },
  attention: { icon: <AlertTriangle />, mark: "text-mark-warn bg-mark-warn/10", text: "text-warn", label: "Needs attention" },
  critical: { icon: <OctagonAlert />, mark: "text-mark-danger bg-mark-danger/10", text: "text-danger", label: "Critical" },
} as const;

/**
 * Activity timeline (ACT-001). Each event carries a state with its own icon,
 * colour and text label (complete blue, pending grey, attention amber,
 * critical red) so state never depends on colour alone.
 */
export function ActivityTimeline({ items, className }: { items: ActivityItem[]; className?: string }) {
  return (
    <ol className={cn("relative", className)}>
      {items.map((e, i) => {
        const s = ACTIVITY_STATE[e.state];
        return (
          <li key={e.id} className="relative flex gap-3 pb-4 last:pb-0">
            {i < items.length - 1 && <span aria-hidden className="absolute bottom-0 left-[11px] top-7 w-px bg-line" />}
            <span aria-hidden className={cn("relative flex size-6 shrink-0 items-center justify-center rounded-full [&>svg]:size-3.5", s.mark)}>
              {s.icon}
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-[13px] font-medium leading-snug text-ink">{e.title}</p>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[12px]">
                <span className={cn("font-medium", s.text)}>{s.label}</span>
                <span aria-hidden className="text-ink-4">·</span>
                <time className="text-ink-3" dateTime={e.at}>
                  {e.label}
                </time>
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
