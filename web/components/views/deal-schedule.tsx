"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, CircleDot, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormat } from "@/lib/use-format";
import { DEMO_NOW, type DealEvent, type DealEventStatus } from "@/lib/demo";
import { Panel, PanelBody, PanelHead } from "@/components/page/panel";
import { Button, IconButton, LinkButton, ringInset } from "@/components/ui/button";
import { StatusBadge, type Tone } from "@/components/ui/badge";
import { Select } from "@/components/ui/controls";

const now = new Date(DEMO_NOW);
const DAY = 86_400_000;

export const EVENT_STATUS: Record<DealEventStatus, { label: string; tone: Tone; icon: React.ReactNode; mark: string }> = {
  done: { label: "Done", tone: "neutral", icon: <CheckCircle2 />, mark: "text-mark-neutral bg-sunken" },
  active: { label: "Active", tone: "info", icon: <CircleDot />, mark: "text-mark-info bg-mark-info/10" },
  blocked: { label: "Blocked", tone: "danger", icon: <AlertTriangle />, mark: "text-mark-danger bg-mark-danger/10" },
  upcoming: { label: "Next", tone: "accent", icon: <Clock3 />, mark: "text-mark-neutral bg-surface ring-1 ring-inset ring-line-strong" },
};

const ymd = (iso: string) => iso.slice(0, 10);
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * Deals calendar (V2 DEAL-001). Month grid with date navigation and a deal
 * filter; every chip answers what, when and for which deal. The agenda beside
 * it adds who owns it and what happens next. Shares DEAL_EVENTS with the
 * timeline, so both always agree.
 */
export function DealCalendar({ events }: { events: DealEvent[] }) {
  const f = useFormat();
  const [month, setMonth] = useState(() => ({ y: now.getUTCFullYear(), m: now.getUTCMonth() + 1 > 11 ? 0 : now.getUTCMonth() + 1 }));
  const [deal, setDeal] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const shown = deal ? events.filter((e) => e.dealId === deal) : events;
  const deals = [...new Map(events.map((e) => [e.dealId, e.deal])).entries()].sort((a, b) => a[1].localeCompare(b[1]));

  const first = Date.UTC(month.y, month.m, 1);
  const lead = (new Date(first).getUTCDay() + 6) % 7; // Monday-first grid
  const days = new Date(Date.UTC(month.y, month.m + 1, 0)).getUTCDate();
  const cells = Array.from({ length: Math.ceil((lead + days) / 7) * 7 }, (_, i) => (i < lead || i >= lead + days ? null : new Date(first + (i - lead) * DAY)));
  const byDay = useMemo(() => {
    const m = new Map<string, DealEvent[]>();
    for (const e of shown) m.set(ymd(e.date), [...(m.get(ymd(e.date)) ?? []), e]);
    return m;
  }, [shown]);
  const today = ymd(DEMO_NOW);
  const agenda = shown.filter((e) => e.status !== "done" && e.date >= new Date(now.getTime() - DAY).toISOString()).slice(0, 8);
  const sel = shown.find((e) => e.id === picked) ?? null;
  const step = (n: number) => setMonth(({ y, m }) => ({ y: m + n < 0 ? y - 1 : m + n > 11 ? y + 1 : y, m: (m + n + 12) % 12 }));

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <Panel className="xl:col-span-8">
        <PanelHead
          title={`${MONTHS[month.m]} ${month.y}`}
          icon={<CalendarDays />}
          description="Meetings, diligence deadlines, IC dates and closes across the pipeline"
          toolbar={
            <>
              <Select aria-label="Filter by deal" value={deal} onChange={(e) => setDeal(e.target.value)} className="w-48 [&_select]:text-[12px]">
                <option value="">All deals</option>
                {deals.map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Select>
              <IconButton size="sm" variant="secondary" label="Previous month" icon={<ChevronLeft />} onClick={() => step(-1)} />
              <IconButton size="sm" variant="secondary" label="Next month" icon={<ChevronRight />} onClick={() => step(1)} />
            </>
          }
        />
        <PanelBody>
          <div className="overflow-x-auto">
            <div role="group" aria-label={`${MONTHS[month.m]} ${month.y} deal calendar`} className="grid min-w-[640px] grid-cols-7 overflow-hidden rounded-md border border-line">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d} aria-hidden className="border-b border-line bg-head px-2 py-1.5 text-[11px] font-medium text-ink-3">
                  {d}
                </div>
              ))}
              {cells.map((d, i) => {
                const key = d ? d.toISOString().slice(0, 10) : `x${i}`;
                const list = d ? byDay.get(key) ?? [] : [];
                return (
                  <div key={key} className={cn("min-h-24 border-b border-r border-line-subtle p-1.5 [&:nth-child(7n)]:border-r-0", !d && "bg-subtle")}>
                    {d && (
                      <>
                        <span className={cn("inline-flex size-6 items-center justify-center rounded-full text-[12px] tabular-nums", key === today ? "bg-accent-fill font-semibold text-white" : "text-ink-3")}>
                          {d.getUTCDate()}
                          <span className="sr-only">
                            {" "}
                            {MONTHS[month.m]}, {list.length} event{list.length === 1 ? "" : "s"}
                            {key === today ? ", today" : ""}
                          </span>
                        </span>
                        <ul className="mt-1 space-y-1">
                          {list.slice(0, 3).map((e) => (
                            <li key={e.id}>
                              <button
                                type="button"
                                onClick={() => setPicked(e.id)}
                                aria-pressed={picked === e.id}
                                title={`${e.title} · ${e.deal}`}
                                className={cn(
                                  "block w-full cursor-pointer rounded-xs border px-1.5 py-0.5 text-left text-[11px] leading-tight",
                                  e.status === "blocked" ? "border-mark-danger/30 bg-mark-danger/8 text-danger" : e.status === "done" ? "border-line bg-subtle text-ink-3" : "border-accent-line bg-accent-soft text-accent-ink",
                                  picked === e.id && "ring-2 ring-focus",
                                  ringInset,
                                )}
                              >
                                <span className="block truncate font-medium">{e.type}</span>
                                <span className="block truncate opacity-90">{e.deal}</span>
                              </button>
                            </li>
                          ))}
                          {list.length > 3 && <li className="px-1 text-[11px] text-ink-4">+{list.length - 3} more</li>}
                        </ul>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <p className="mt-2 text-[11px] text-ink-4">Today is {f.date(DEMO_NOW)}. Blocked items are red; completed items are grey. Demo schedule.</p>
        </PanelBody>
      </Panel>

      <div className="grid content-start gap-4 xl:col-span-4">
        {sel && <EventDetail event={sel} onClose={() => setPicked(null)} />}
        <Panel>
          <PanelHead title="Coming up" description="What happens next, for which deal, and who owns it" />
          <PanelBody flush>
            {agenda.length === 0 ? (
              <p className="px-5 py-6 text-[13px] text-ink-3">Nothing scheduled for this selection.</p>
            ) : (
              <ul className="divide-y divide-line-subtle">
                {agenda.map((e) => (
                  <li key={e.id}>
                    <button type="button" onClick={() => setPicked(e.id)} className={cn("flex w-full cursor-pointer items-start gap-3 px-5 py-3 text-left hover:bg-hover", ringInset)}>
                      <span className="w-12 shrink-0 text-[12px] tabular-nums text-ink-3">{f.date(e.date).replace(/ \d{4}$/, "")}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-medium text-ink">{e.title}</span>
                        <span className="block truncate text-[12px] text-ink-3">
                          {e.deal} · {e.owner}
                        </span>
                      </span>
                      <StatusBadge tone={EVENT_STATUS[e.status].tone}>{EVENT_STATUS[e.status].label}</StatusBadge>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </PanelBody>
        </Panel>
      </div>
    </div>
  );
}

function EventDetail({ event: e, onClose }: { event: DealEvent; onClose: () => void }) {
  const f = useFormat();
  return (
    <Panel aria-live="polite">
      <PanelHead title={e.title} description={`${e.type} · ${f.dateTime(e.date)} UTC`} toolbar={<StatusBadge tone={EVENT_STATUS[e.status].tone}>{EVENT_STATUS[e.status].label}</StatusBadge>} />
      <PanelBody className="space-y-3">
        <dl className="grid grid-cols-2 gap-3 text-[13px]">
          {[
            ["Deal", e.deal],
            ["Owner", e.owner],
            ["Stage", e.stage],
            ["Next", e.next ?? "—"],
          ].map(([k, v]) => (
            <div key={k} className="min-w-0">
              <dt className="text-[12px] text-ink-3">{k}</dt>
              <dd className="mt-0.5 text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="flex gap-2">
          <LinkButton size="sm" variant="primary" href={`/app/deals/${e.dealId.toLowerCase()}?tab=history`}>
            Open deal <ArrowRight />
          </LinkButton>
          <Button size="sm" variant="ghost" onClick={onClose}>
            Clear
          </Button>
        </div>
      </PanelBody>
    </Panel>
  );
}

const SECTIONS: { status: DealEventStatus; title: string; hint: string }[] = [
  { status: "blocked", title: "Blocked", hint: "Needs a decision or missing evidence" },
  { status: "active", title: "Active now", hint: "In progress this week" },
  { status: "upcoming", title: "What happens next", hint: "Scheduled" },
  { status: "done", title: "What happened", hint: "Most recent first" },
];

/**
 * Deal timeline (V2 DEAL-002). Answers what happened, what is active, what is
 * blocked and what happens next — each node shows date, status, owner and the
 * action. Used for the whole pipeline and, filtered, on every deal page.
 */
export function DealTimeline({ events, showDeal = true, limit = 6 }: { events: DealEvent[]; showDeal?: boolean; limit?: number }) {
  const f = useFormat();
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {SECTIONS.map((sec) => {
        const list = events.filter((e) => e.status === sec.status);
        const ordered = sec.status === "done" ? [...list].reverse() : list;
        return (
          <section key={sec.status} aria-label={sec.title}>
            <h3 className="flex items-baseline justify-between gap-2">
              <span className="text-[13px] font-semibold text-ink">
                {sec.title} <span className="font-normal tabular-nums text-ink-4">{list.length}</span>
              </span>
              <span className="text-[11px] text-ink-4">{sec.hint}</span>
            </h3>
            {ordered.length === 0 ? (
              <p className="mt-2 rounded-md border border-dashed border-line-strong px-3 py-3 text-[12px] text-ink-4">Nothing {sec.title.toLowerCase()}.</p>
            ) : (
              <ol className="relative mt-2">
                {ordered.slice(0, limit).map((e, i, arr) => {
                  const s = EVENT_STATUS[e.status];
                  return (
                    <li key={e.id} className="relative flex gap-3 pb-3 last:pb-0">
                      {i < arr.length - 1 && <span aria-hidden className="absolute bottom-0 left-[11px] top-7 w-px bg-line" />}
                      <span aria-hidden className={cn("relative flex size-6 shrink-0 items-center justify-center rounded-full [&>svg]:size-3.5", s.mark)}>
                        {s.icon}
                      </span>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <p className="text-[13px] font-medium leading-snug text-ink">
                          {e.title}
                          {showDeal && (
                            <>
                              {" · "}
                              <Link href={`/app/deals/${e.dealId.toLowerCase()}?tab=history`} className="text-accent-ink underline decoration-accent/40 underline-offset-2 hover:decoration-accent">
                                {e.deal}
                              </Link>
                            </>
                          )}
                        </p>
                        <p className="mt-0.5 flex flex-wrap gap-x-1.5 text-[12px] text-ink-3">
                          <time dateTime={e.date} className="tabular-nums">
                            {f.date(e.date)}
                          </time>
                          <span aria-hidden>·</span>
                          <span>{s.label}</span>
                          <span aria-hidden>·</span>
                          <span>{e.owner}</span>
                        </p>
                        {e.next && e.status !== "done" && <p className="mt-0.5 text-[12px] text-ink-2">Next: {e.next}</p>}
                      </div>
                    </li>
                  );
                })}
                {ordered.length > limit && <li className="pl-9 text-[12px] text-ink-4">+{ordered.length - limit} more</li>}
              </ol>
            )}
          </section>
        );
      })}
    </div>
  );
}
