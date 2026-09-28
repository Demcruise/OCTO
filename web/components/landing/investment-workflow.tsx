"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, CircleDashed, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { LIFECYCLE } from "@/lib/landing-content";
import { DUR, EASE, Pill, type PillTone, Reveal, SampleLabel, Section, SectionHeader, focusRing, useTabs } from "./primitives";

type Item = { label: string; detail: string; state: "ok" | "missing" | "open" };
type Step = { status: { tone: PillTone; text: string }; date: string; summary: string; items: Item[] };

/** One entry per LIFECYCLE stage. Stages after IC review describe what the record will hold (WF-100/101). */
const STEPS: Step[] = [
  {
    status: { tone: "ok", text: "Sourced" },
    date: "12 Aug 2026",
    summary: "Inbound from an advisor and matched to the industrial automation thesis.",
    items: [
      { label: "Thesis match", detail: "Industrial automation", state: "ok" },
      { label: "Deal owner", detail: "Assigned to the deal team", state: "ok" },
    ],
  },
  {
    status: { tone: "ok", text: "Passed" },
    date: "19 Aug 2026",
    summary: "Screening criteria run against the data room and the CRM record.",
    items: [
      { label: "Revenue > $50M", detail: "$64.0M LTM", state: "ok" },
      { label: "Growth > 15%", detail: "22% year on year", state: "ok" },
      { label: "EBITDA margin", detail: "Missing — requested from management", state: "missing" },
    ],
  },
  {
    status: { tone: "info", text: "2 of 3 received" },
    date: "04 Sep 2026",
    summary: "Evidence requests are tracked against the diligence checklist.",
    items: [
      { label: "Quality of earnings report", detail: "Received 21 Sep", state: "ok" },
      { label: "Customer concentration analysis", detail: "Received 24 Sep", state: "ok" },
      { label: "EBITDA bridge FY24–FY26", detail: "Outstanding", state: "open" },
    ],
  },
  {
    status: { tone: "warn", text: "Awaiting approval" },
    date: "29 Sep 2026",
    summary: "The IC memo was drafted with AI assistance, edited by the deal lead, and routed to the committee.",
    items: [
      { label: "Recommendation", detail: "Proceed · $45.0M Series C", state: "ok" },
      { label: "Evidence pack", detail: "14 documents · 3 models", state: "ok" },
      { label: "Open exceptions", detail: "1 · EBITDA bridge outstanding", state: "missing" },
      { label: "Approvals", detail: "2 of 3 committee members", state: "open" },
      { label: "Decision record", detail: "Created on final approval", state: "open" },
    ],
  },
  {
    status: { tone: "neutral", text: "Upcoming" },
    date: "On approval",
    summary: "The investment is booked to the ledger and inherits the deal record, so nothing is re-keyed.",
    items: [
      { label: "Capital call", detail: "Posted to the book of record", state: "open" },
      { label: "Investment record", detail: "Linked to fund, company, and IC decision", state: "open" },
    ],
  },
  {
    status: { tone: "neutral", text: "Upcoming" },
    date: "Quarterly",
    summary: "Company KPIs, covenants, and valuations are tracked against the thesis that justified the deal.",
    items: [
      { label: "KPI pack", detail: "Revenue, EBITDA, cash, headcount", state: "open" },
      { label: "Alerts", detail: "Covenant and variance thresholds", state: "open" },
    ],
  },
  {
    status: { tone: "neutral", text: "Upcoming" },
    date: "On exit",
    summary: "Realized value and LP reporting draw on the same ledger that recorded the entry.",
    items: [
      { label: "Realization", detail: "Proceeds and final IRR from the ledger", state: "open" },
      { label: "LP report", detail: "Approved before release", state: "open" },
    ],
  },
];

const CURRENT = 3;

const ICON = {
  ok: <Check aria-hidden className="size-4 text-ok" />,
  missing: <HelpCircle aria-hidden className="size-4 text-warn" />,
  open: <CircleDashed aria-hidden className="size-4 text-ink-3" />,
};
const STATE_TEXT = { ok: "Complete", missing: "Needs input", open: "Pending" } as const;

/** Investment lifecycle: selecting a stage updates the product preview (WF-100..102). */
export function InvestmentWorkflow() {
  const { active, onKeyDown, tabProps } = useTabs(LIFECYCLE.length, CURRENT);
  const reduce = useReducedMotion();
  const step = STEPS[active];
  const stripRef = useRef<HTMLDivElement>(null);

  // Keep the selected stage visible when the stepper scrolls horizontally on phones.
  useEffect(() => {
    const strip = stripRef.current;
    const tab = strip?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (strip && tab && strip.scrollWidth > strip.clientWidth) strip.scrollTo({ left: tab.offsetLeft - 16 });
  }, [active]);

  return (
    <Section id="workflow" tone="subtle" labelledBy="workflow-title">
      <SectionHeader
        id="workflow-title"
        index="07"
        eyebrow="Workflow"
        title="Run the investment lifecycle from one system."
        lead="Move from sourcing to screening, diligence, IC review, and portfolio action without breaking context. The evidence behind a decision never has to be rebuilt."
      />

      <Reveal className="mt-14 overflow-hidden rounded-xl border border-line bg-canvas">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-5 py-4 md:px-8">
          <p className="text-[15px] font-semibold">
            Acme Robotics <span className="font-normal text-ink-3">· prospect</span>
          </p>
          <SampleLabel>Illustrative prospect</SampleLabel>
        </div>

        <div ref={stripRef} role="tablist" aria-label="Lifecycle stages" onKeyDown={onKeyDown} className="no-scrollbar relative flex overflow-x-auto border-b border-line px-2 md:px-5">
          {LIFECYCLE.map((stage, i) => (
            <button
              key={stage}
              {...tabProps(i)}
              id={`wf-tab-${i}`}
              aria-controls="wf-panel"
              className={cn("relative flex min-w-[124px] flex-1 flex-col items-start gap-1 px-3 py-4 text-left hover:bg-subtle", focusRing)}
            >
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full border font-data text-[10px]",
                  i < CURRENT && "border-ok bg-ok text-white",
                  i === CURRENT && "border-accent bg-accent-soft text-accent",
                  i > CURRENT && "border-line-strong text-ink-3",
                )}
              >
                {i < CURRENT ? <Check aria-hidden className="size-3" /> : i + 1}
              </span>
              {i < LIFECYCLE.length - 1 && <span aria-hidden className={cn("absolute left-[40px] right-1 top-[25px] h-px", i < CURRENT ? "bg-ok/40" : "bg-line")} />}
              <span className={cn("text-[13px]", i === active ? "font-medium text-ink" : i > CURRENT ? "text-ink-3" : "text-ink-2")}>{stage}</span>
              <span className="font-data text-[10px] text-ink-3">{STEPS[i].date}</span>
              {i === active && <span aria-hidden className="absolute inset-x-3 bottom-0 h-0.5 bg-accent" />}
            </button>
          ))}
        </div>

        <div id="wf-panel" role="tabpanel" aria-labelledby={`wf-tab-${active}`} className="p-5 md:p-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: DUR.standard, ease: EASE }}
              className="grid grid-cols-1 gap-8 md:grid-cols-12"
            >
              <div className="md:col-span-5">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-semibold tracking-tight">{LIFECYCLE[active]}</h3>
                  <Pill tone={step.status.tone} dot>
                    {step.status.text}
                  </Pill>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{step.summary}</p>
              </div>
              <ul className="divide-y divide-line self-start rounded-lg border border-line md:col-span-7">
                {step.items.map((e) => (
                  <li key={e.label} className="flex items-start gap-3 px-4 py-3">
                    <span className="mt-0.5">{ICON[e.state]}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink">{e.label}</p>
                      <p className="text-[13px] text-ink-3">{e.detail}</p>
                    </div>
                    <span className="sr-only">{STATE_TEXT[e.state]}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </Section>
  );
}
