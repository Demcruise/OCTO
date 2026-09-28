"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, CircleDashed, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { LIFECYCLE } from "@/lib/landing-content";
import { DUR, EASE, Pill, type PillTone, Reveal, SampleLabel, Section, SectionHeader, focusRing, useTabs } from "./primitives";

type Ev = [string, "ok" | "missing" | "open"];
type Stage = { object: string; status: { tone: PillTone; text: string }; owner: string; date: string; evidence: Ev[]; task: string; next: string };

/** One entry per LIFECYCLE stage (PAL-021): status, owner, evidence, task, next action. */
const STAGES: Stage[] = [
  {
    object: "Acme Robotics · prospect",
    status: { tone: "ok", text: "Sourced" },
    owner: "Deal team",
    date: "12 Aug 2026",
    evidence: [["Thesis match · industrial automation", "ok"], ["Advisor introduction", "ok"]],
    task: "Log first call notes",
    next: "Run screening",
  },
  {
    object: "Acme Robotics · prospect",
    status: { tone: "ok", text: "Passed" },
    owner: "Analyst",
    date: "19 Aug 2026",
    evidence: [["Revenue > $50M · $64.0M LTM", "ok"], ["Growth > 15% · 22%", "ok"], ["EBITDA margin · missing", "missing"]],
    task: "Request EBITDA margin from management",
    next: "Open due diligence",
  },
  {
    object: "Acme Robotics · prospect",
    status: { tone: "info", text: "2 of 3 received" },
    owner: "Deal lead",
    date: "04 Sep 2026",
    evidence: [["Quality of earnings report", "ok"], ["Customer concentration analysis", "ok"], ["EBITDA bridge FY24–FY26", "open"]],
    task: "Chase EBITDA bridge",
    next: "Draft IC memo",
  },
  {
    object: "Acme Robotics · Series C",
    status: { tone: "warn", text: "Pending approval" },
    owner: "Investment committee",
    date: "29 Sep 2026",
    evidence: [["Recommendation · proceed, $45.0M", "ok"], ["Evidence pack · 14 documents", "ok"], ["Open exception · EBITDA bridge", "missing"], ["Approvals · 2 of 3", "open"]],
    task: "Final committee vote",
    next: "Review recommendation",
  },
  {
    object: "Keller Tooling · Buyout",
    status: { tone: "ok", text: "Booked" },
    owner: "Fund accounting",
    date: "14 Jun 2021",
    evidence: [["Capital call posted to IBOR", "ok"], ["Investment record linked to IC decision", "ok"]],
    task: "Set monitoring KPIs",
    next: "Open investment",
  },
  {
    object: "Atlas Components",
    status: { tone: "warn", text: "Needs review" },
    owner: "Portfolio operations",
    date: "30 Sep 2026",
    evidence: [["Q3 KPI pack received", "ok"], ["Covenant headroom 12% · below 15%", "missing"]],
    task: "Review covenant exception",
    next: "Assign to deal lead",
  },
  {
    object: "Growth Fund II · Q3 LP report",
    status: { tone: "accent", text: "Drafted by AI" },
    owner: "Investor relations",
    date: "10 Oct 2026",
    evidence: [["Figures from reconciled IBOR", "ok"], ["Valuation approved 30 Sep", "ok"], ["Reviewer sign-off", "open"]],
    task: "Review LP report",
    next: "Publish after approval",
  },
];

const ICON = {
  ok: <Check aria-hidden className="size-4 text-ok" />,
  missing: <HelpCircle aria-hidden className="size-4 text-warn" />,
  open: <CircleDashed aria-hidden className="size-4 text-ink-3" />,
};
const SR = { ok: "complete", missing: "needs input", open: "pending" } as const;

/** Workflow rail: select a stage, the product surface on the right changes (PAL-021). */
export function InvestmentWorkflow() {
  const { active, onKeyDown, tabProps } = useTabs(LIFECYCLE.length, 3);
  const reduce = useReducedMotion();
  const s = STAGES[active];
  const label = "font-data text-[10px] uppercase tracking-[0.1em] text-ink-3";

  return (
    <Section id="workflow" tone="subtle" labelledBy="workflow-title">
      <SectionHeader
        id="workflow-title"
        index="11"
        eyebrow="Workflow"
        title="From data to decision."
        lead="Every stage of the investment lifecycle has an owner, its evidence, an open task, and a next action — in the same system that holds the numbers."
      />

      <Reveal className="mt-16 grid grid-cols-1 border border-line-strong bg-canvas lg:grid-cols-12">
        <div role="tablist" aria-label="Lifecycle stages" onKeyDown={onKeyDown} className="no-scrollbar flex overflow-x-auto border-b border-line lg:col-span-4 lg:flex-col lg:border-b-0 lg:border-r">
          {LIFECYCLE.map((stage, i) => (
            <button
              key={stage}
              {...tabProps(i)}
              id={`wf-tab-${i}`}
              aria-controls="wf-panel"
              className={cn(
                "flex min-h-12 shrink-0 items-center gap-4 border-b-2 px-5 text-left transition-colors lg:border-b lg:border-l-2 lg:border-b-line",
                i === active ? "border-accent bg-accent-soft/60 lg:border-l-accent" : "border-transparent hover:bg-subtle lg:border-l-transparent",
                focusRing,
              )}
            >
              <span className={cn("font-data text-meta", i === active ? "text-accent" : "text-ink-3")}>{String(i + 1).padStart(2, "0")}</span>
              <span className={cn("whitespace-nowrap text-[15px]", i === active ? "font-medium text-ink" : "text-ink-2")}>{stage}</span>
              <span className="ml-auto hidden font-data text-[10px] text-ink-3 lg:inline">{STAGES[i].date}</span>
            </button>
          ))}
        </div>

        <div id="wf-panel" role="tabpanel" aria-labelledby={`wf-tab-${active}`} className="min-w-0 lg:col-span-8">
          <div className="flex items-center justify-between border-b border-line bg-subtle px-5 py-2.5">
            <p className="truncate font-data text-[11px] text-ink-2">octo / workflow / {LIFECYCLE[active].toLowerCase().replace(" ", "-")}</p>
            <SampleLabel className="shrink-0">Demo environment</SampleLabel>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={reduce ? false : { opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: DUR.standard, ease: EASE }}
              className="p-5 md:p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className={label}>{LIFECYCLE[active]}</p>
                  <h3 className="mt-1 text-2xl font-medium tracking-tight">{s.object}</h3>
                </div>
                <Pill tone={s.status.tone} dot>
                  {s.status.text}
                </Pill>
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-px bg-line sm:grid-cols-3">
                {(
                  [
                    ["Owner", s.owner],
                    ["Updated", s.date],
                    ["Open task", s.task],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k} className={cn("bg-canvas py-2 pr-3", k === "Open task" && "col-span-2 sm:col-span-1")}>
                    <dt className={label}>{k}</dt>
                    <dd className="mt-0.5 text-[13px] text-ink">{v}</dd>
                  </div>
                ))}
              </dl>

              <p className={cn(label, "mt-6")}>Evidence</p>
              <ul className="mt-2 divide-y divide-line border-y border-line">
                {s.evidence.map(([e, st]) => (
                  <li key={e} className="flex items-center gap-3 py-2.5 text-[13px] text-ink">
                    {ICON[st]}
                    <span className="flex-1">{e}</span>
                    <span className="sr-only">{SR[st]}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[13px] text-ink-3">Next action is assigned to {s.owner.toLowerCase()}.</p>
                <a href="#control-panel" className={cn("inline-flex min-h-10 items-center gap-2 bg-ink px-4 text-[13px] font-medium text-white hover:bg-ink-2", focusRing)}>
                  {s.next} <ArrowRight aria-hidden className="size-3.5" />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </Section>
  );
}
