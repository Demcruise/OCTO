"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, CircleDashed, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { LIFECYCLE } from "@/lib/landing-content";
import { DUR, EASE, Pill, type PillTone, Reveal, SampleLabel, Section, SectionHeader, focusRing, useTabs } from "./primitives";

type Evidence = { label: string; detail: string; state: "ok" | "missing" | "open" };
type Step = { stage: string; status: { tone: PillTone; text: string }; date: string; summary: string; evidence: Evidence[] };

/** Only stages the example prospect has reached are interactive. */
const PROSPECT: Step[] = [
  {
    stage: "Sourcing",
    status: { tone: "ok", text: "Sourced" },
    date: "12 Aug 2026",
    summary: "Inbound from an advisor and matched to the industrial automation thesis.",
    evidence: [
      { label: "Thesis match", detail: "Industrial automation", state: "ok" },
      { label: "Deal owner", detail: "Assigned to deal team", state: "ok" },
    ],
  },
  {
    stage: "Screening",
    status: { tone: "ok", text: "Passed" },
    date: "19 Aug 2026",
    summary: "Configured screening criteria run against the data room and CRM record.",
    evidence: [
      { label: "Revenue > $50M", detail: "$64M LTM", state: "ok" },
      { label: "Growth > 15%", detail: "22% YoY", state: "ok" },
      { label: "EBITDA margin", detail: "Missing — requested from management", state: "missing" },
    ],
  },
  {
    stage: "Due diligence",
    status: { tone: "info", text: "2 of 3 received" },
    date: "04 Sep 2026",
    summary: "Evidence requests tracked against the diligence checklist.",
    evidence: [
      { label: "Quality of earnings report", detail: "Received 21 Sep", state: "ok" },
      { label: "Customer concentration analysis", detail: "Received 24 Sep", state: "ok" },
      { label: "EBITDA bridge FY24–FY26", detail: "Outstanding", state: "open" },
    ],
  },
  {
    stage: "IC review",
    status: { tone: "warn", text: "Awaiting approval" },
    date: "29 Sep 2026",
    summary: "IC memo v4 drafted with AI assistance, edited by the deal lead, and routed for approval.",
    evidence: [
      { label: "IC memo v4", detail: "Reviewed by deal lead", state: "ok" },
      { label: "Approvals", detail: "2 of 3 committee members", state: "open" },
    ],
  },
];

const ICON = {
  ok: <Check aria-hidden className="size-4 text-ok" />,
  missing: <HelpCircle aria-hidden className="size-4 text-warn" />,
  open: <CircleDashed aria-hidden className="size-4 text-ink-3" />,
};

/** Investment lifecycle with an interactive prospect example (WF-001/002). */
export function InvestmentWorkflow() {
  const current = PROSPECT.length - 1;
  const { active, onKeyDown, tabProps } = useTabs(PROSPECT.length, current);
  const reduce = useReducedMotion();
  const step = PROSPECT[active];
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
        title={
"Run the investment lifecycle from one system."
        }
        lead="Sourcing, screening, diligence, committee review, and monitoring share one record, so the evidence behind a decision never has to be rebuilt."
      />

      <Reveal className="mt-14 overflow-hidden rounded-xl border border-line bg-canvas">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-5 py-4 md:px-8">
          <p className="text-[15px] font-semibold">
            Acme Robotics <span className="font-normal text-ink-3">· prospect</span>
          </p>
          <SampleLabel>Illustrative prospect</SampleLabel>
        </div>

        <div ref={stripRef} role="tablist" aria-label="Lifecycle stages" onKeyDown={onKeyDown} className="no-scrollbar relative flex overflow-x-auto border-b border-line px-2 md:px-5">
          {LIFECYCLE.map((stage, i) => {
            const reached = i < PROSPECT.length;
            const connector = (k: number) =>
              k < LIFECYCLE.length - 1 && (
                <span aria-hidden className={cn("absolute left-[40px] right-1 top-[25px] h-px", k < current ? "bg-ok/40" : "bg-line")} />
              );
            const cls = "relative flex min-w-[124px] flex-1 flex-col items-start gap-1 px-3 py-4 text-left";
            const marker = (
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full border font-data text-[10px]",
                  i < current && "border-ok bg-ok text-white",
                  i === current && "border-accent bg-accent-soft text-accent",
                  i > current && "border-line-strong text-ink-3",
                )}
              >
                {i < current ? <Check aria-hidden className="size-3" /> : i + 1}
              </span>
            );
            if (!reached)
              return (
                <div key={stage} className={cls} aria-hidden>
                  {marker}
                  {connector(i)}
                  <span className="text-[13px] text-ink-3">{stage}</span>
                  <span className="font-data text-[10px] text-ink-3">Upcoming</span>
                </div>
              );
            return (
              <button key={stage} {...tabProps(i)} id={`wf-tab-${i}`} aria-controls="wf-panel" className={cn(cls, "hover:bg-subtle", focusRing)}>
                {marker}
                {connector(i)}
                <span className={cn("text-[13px]", i === active ? "font-medium text-ink" : "text-ink-2")}>{stage}</span>
                <span className="font-data text-[10px] text-ink-3">{PROSPECT[i].date}</span>
                {i === active && <span aria-hidden className="absolute inset-x-3 bottom-0 h-0.5 bg-accent" />}
              </button>
            );
          })}
        </div>

        <div id="wf-panel" role="tabpanel" aria-labelledby={`wf-tab-${active}`} className="p-5 md:p-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step.stage}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: DUR.standard, ease: EASE }}
              className="grid grid-cols-1 gap-8 md:grid-cols-12"
            >
              <div className="md:col-span-5">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold tracking-tight">{step.stage}</h3>
                  <Pill tone={step.status.tone} dot>
                    {step.status.text}
                  </Pill>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{step.summary}</p>
              </div>
              <ul className="divide-y divide-line self-start rounded-lg border border-line md:col-span-7">
                {step.evidence.map((e) => (
                  <li key={e.label} className="flex items-start gap-3 px-4 py-3">
                    <span className="mt-0.5">{ICON[e.state]}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">{e.label}</p>
                      <p className="text-[13px] text-ink-3">{e.detail}</p>
                    </div>
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
