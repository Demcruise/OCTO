"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { FLOW_STAGES } from "@/lib/landing-content";
import { DUR, EASE, Pill, type PillTone, Reveal, SampleLabel, Section, SectionHeader, focusRing, useTabs } from "./primitives";

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
  ingest: (
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
      <div className="flex items-center justify-between rounded-md border border-accent-line bg-accent-soft px-3 py-2.5">
        <span className="text-sm font-medium text-ink">Atlas Components</span>
        <span className="font-data text-[11px] text-accent">company:4182 · 3 sources</span>
      </div>
    </div>
  ),
  record: (
    <Rows
      head={["Date", "Event", "Entity", "Amount"]}
      align={["l", "l", "l", "r"]}
      rows={[
        ["30 Sep", "Valuation", "Atlas Components", "$142.5M"],
        ["18 Sep", "Capital call", "Growth Fund II", "$4.2M"],
        ["02 Sep", "Distribution", "US Manufacturing III", "($6.8M)"],
        ["14 Aug", "Commitment", "Northbridge Pension", "$25.0M"],
      ]}
    />
  ),
  analyze: (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-4">
      {[
        ["Net IRR", "18.4%"],
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
  act: (
    <Rows
      head={["Item", "Type", "State"]}
      align={["l", "l", "r"]}
      rows={[
        ["Covenant headroom < 15%", "Alert", status("warn", "Open")],
        ["Q3 LP report · Growth Fund II", "Report", status("accent", "In review")],
        ["Request Q3 management accounts", "Task", status("info", "Assigned")],
        ["Valuation memo · Atlas", "Approval", status("ok", "Approved")],
      ]}
    />
  ),
};

/** Five-stage data-to-decision flow with accessible tabs (FLOW-001/002). */
export function SystemFlow() {
  const { active, onKeyDown, tabProps } = useTabs(FLOW_STAGES.length);
  const reduce = useReducedMotion();
  const stage = FLOW_STAGES[active];

  return (
    <Section id="system" tone="subtle" labelledBy="system-title">
      <SectionHeader
        id="system-title"
        index="03"
        eyebrow="The investment system"
        title={
          <>
            From fragmented data
            <br className="hidden md:block" /> to a defensible decision.
          </>
        }
        lead="Five stages, one record. Each stage hands the next a cleaner, better-governed version of the same facts."
      />

      <Reveal className="mt-14">
        <div role="tablist" aria-label="System stages" onKeyDown={onKeyDown} className="no-scrollbar -mx-4 flex overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-5 sm:px-0">
          {FLOW_STAGES.map((s, i) => (
            <button
              key={s.id}
              {...tabProps(i)}
              id={`flow-tab-${s.id}`}
              aria-controls="flow-panel"
              className={cn("group min-w-[132px] flex-1 pr-3 pt-0 text-left sm:min-w-0", focusRing)}
            >
              <span className={cn("block h-0.5 transition-colors duration-300", i <= active ? "bg-accent" : "bg-line-strong")} />
              <span className={cn("mt-3 block font-data text-meta", i === active ? "text-accent" : "text-ink-3")}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={cn("mt-1 block pb-3 text-sm font-medium uppercase tracking-[0.06em]", i === active ? "text-ink" : "text-ink-3 group-hover:text-ink-2")}>
                {s.label}
              </span>
            </button>
          ))}
        </div>

        <div
          id="flow-panel"
          role="tabpanel"
          aria-labelledby={`flow-tab-${stage.id}`}
          className="mt-6 overflow-hidden rounded-xl border border-line bg-canvas"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={stage.id}
              initial={reduce ? false : { opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: -12 }}
              transition={{ duration: DUR.standard, ease: EASE }}
              className="grid grid-cols-1 lg:grid-cols-12"
            >
              <div className="min-w-0 border-b border-line p-6 md:p-8 lg:col-span-5 lg:border-b-0 lg:border-r">
                <h3 className="text-xl font-semibold tracking-tight">{stage.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{stage.description}</p>
                <ul className="mt-6 flex flex-wrap gap-1.5">
                  {stage.items.map((it) => (
                    <li key={it}>
                      <Pill>{it}</Pill>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="min-w-0 p-6 md:p-8 lg:col-span-7">
                <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-data text-[11px] text-ink-2">stage / {stage.id}</p>
                  <SampleLabel>As of {AS_OF}</SampleLabel>
                </div>
                {VISUALS[stage.id]}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </Section>
  );
}
