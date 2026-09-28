"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { FLOW_STAGES } from "@/lib/landing-content";
import { ApprovalState } from "@/components/octo/approval-state";
import { Pill, type PillTone, Reveal, SampleLabel, Section, SectionHeader, focusRing } from "./primitives";

const AS_OF = "30 Sep 2026 · 09:42 UTC";

function Rows({ head, rows, align }: { head: string[]; rows: React.ReactNode[][]; align?: ("l" | "r")[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[300px] text-left text-[13px]">
        <thead>
          <tr className="border-b border-line">
            {head.map((h, i) => (
              <th key={h} scope="col" className={cn("pb-2 font-data text-[10px] font-normal uppercase tracking-[0.08em] text-ink-3", align?.[i] === "r" && "text-right")}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} className={cn("py-2.5 pr-3 text-ink", align?.[j] === "r" && "pr-0 text-right font-data tabular-nums")}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const status = (tone: PillTone, text: string) => (
  <Pill tone={tone} dot>
    {text}
  </Pill>
);

const VISUALS: Record<string, React.ReactNode> = {
  connect: (
    <Rows
      head={["Source", "Records", "Status"]}
      align={["l", "r", "r"]}
      rows={[
        ["CRM", "1,284", status("ok", "Synced")],
        ["Fund administrator", "3,912", status("ok", "Synced")],
        ["Financial data feed", "642", status("ok", "Synced")],
        ["Document store", "418", status("info", "Classifying")],
        ["Market data", "12,006", status("ok", "Synced")],
      ]}
    />
  ),
  normalize: (
    <div className="space-y-4">
      <ul className="space-y-1.5 font-data text-[12px] text-ink-2">
        {["ATLAS COMPONENTS LTD (fund admin)", "Atlas Cmpnts. (CRM)", "Atlas Components Holdings (board deck)"].map((s) => (
          <li key={s} className="rounded-sm border border-dashed border-line-strong px-2.5 py-1.5">
            {s}
          </li>
        ))}
      </ul>
      <p aria-hidden className="text-center font-data text-ink-3">↓ entity resolution</p>
      <div className="flex items-center justify-between gap-3 rounded-md border border-accent-line bg-accent-soft px-3 py-2.5">
        <span className="text-sm font-medium text-ink">Atlas Components</span>
        <span className="font-data text-[11px] text-accent">company:4182 · 3 sources</span>
      </div>
    </div>
  ),
  contextualize: (
    <div>
      <p className="text-sm font-medium text-ink">Atlas Components</p>
      <dl className="mt-3 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2">
        {[
          ["Fund", "Growth Fund II"],
          ["Investment", "Series B · 2023"],
          ["Deal team", "3 people"],
          ["Financials", "Q3 2026 accounts"],
          ["Documents", "14 linked"],
          ["Open exceptions", "1"],
        ].map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-3 bg-canvas px-3 py-2">
            <dt className="font-data text-[10px] uppercase tracking-[0.08em] text-ink-3">{k}</dt>
            <dd className="text-[13px] text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  ),
  analyze: (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-4">
      {[
        ["Gross IRR", "18.4%"],
        ["TVPI", "2.31x"],
        ["MOIC", "2.05x"],
        ["DPI", "0.84x"],
      ].map(([k, v]) => (
        <div key={k} className="bg-canvas p-3">
          <dt className="font-data text-[10px] uppercase tracking-[0.08em] text-ink-3">{k}</dt>
          <dd className="mt-1 text-xl font-semibold tabular-nums">{v}</dd>
        </div>
      ))}
    </dl>
  ),
  review: (
    <div className="rounded-md border border-line p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-ink">Valuation variance 5.8% vs administrator</p>
        {status("warn", "Needs review")}
      </div>
      <p className="mt-1 text-[13px] text-ink-3">Proposal: accept the administrator value · drafted by AI · 2 documents attached</p>
      <ApprovalState reached="evidence" className="mt-3" />
    </div>
  ),
  act: (
    <Rows
      head={["Item", "Type", "State"]}
      align={["l", "l", "r"]}
      rows={[
        ["Q3 LP report · Growth Fund II", "Report", status("accent", "In review")],
        ["Request Q3 management accounts", "Task", status("info", "Assigned")],
        ["Valuation memo · Atlas", "Approval", status("ok", "Approved")],
        ["Portfolio export · Q3", "Export", status("neutral", "Queued")],
      ]}
    />
  ),
};

/**
 * Data → decision in six stages (FLOW-100..102). Desktop: a sticky stage rail
 * tracks whichever panel is in view. Phones: the same panels as stacked cards,
 * with no sticky element to fight the scroll.
 */
export function SystemFlow() {
  const [active, setActive] = useState(0);
  const panels = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    panels.current.forEach((p) => p && io.observe(p));
    return () => io.disconnect();
  }, []);

  const go = (i: number) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    panels.current[i]?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  };

  return (
    <Section id="system" tone="subtle" labelledBy="system-title">
      <SectionHeader
        id="system-title"
        index="03"
        eyebrow="Data to decision"
        title="From fragmented data to a defensible decision."
        lead="Six stages, one record. Each stage hands the next a cleaner, better-governed version of the same facts."
      />

      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <nav aria-label="Stages" className="hidden lg:col-span-4 lg:block">
          <ol className="sticky top-28 border-l border-line">
            {FLOW_STAGES.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  aria-current={i === active ? "step" : undefined}
                  onClick={() => go(i)}
                  className={cn(
                    "-ml-px flex min-h-11 w-full items-center gap-4 border-l-2 py-3 pl-5 text-left transition-colors",
                    i === active ? "border-accent" : "border-transparent hover:border-line-strong",
                    focusRing,
                  )}
                >
                  <span className={cn("font-data text-meta", i === active ? "text-accent" : "text-ink-3")}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={cn("text-sm font-medium uppercase tracking-[0.06em]", i === active ? "text-ink" : "text-ink-3")}>{s.label}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <ol className="space-y-5 lg:col-span-8">
          {FLOW_STAGES.map((s, i) => (
            <li
              key={s.id}
              ref={(el) => {
                panels.current[i] = el;
              }}
              data-index={i}
              className={cn("scroll-mt-28 rounded-xl border bg-canvas transition-colors duration-300", i === active ? "border-accent-line" : "border-line")}
            >
              <Reveal className="grid grid-cols-1 md:grid-cols-12">
                <div className="min-w-0 border-b border-line p-5 md:col-span-5 md:border-b-0 md:border-r md:p-6">
                  <p className="font-data text-meta uppercase text-accent">
                    {String(i + 1).padStart(2, "0")} · {s.label}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">{s.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {s.items.map((it) => (
                      <li key={it}>
                        <Pill>{it}</Pill>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="min-w-0 p-5 md:col-span-7 md:p-6">
                  <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-data text-[11px] text-ink-2">stage / {s.id}</p>
                    <SampleLabel>As of {AS_OF}</SampleLabel>
                  </div>
                  {VISUALS[s.id]}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
