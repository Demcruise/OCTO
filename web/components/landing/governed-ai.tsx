"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, FileSearch, Lock, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { DUR, EASE, Pill, Reveal, SampleLabel, Section, SectionHeader, focusRing } from "./primitives";

const DRIVERS = [
  { name: "Revenue", change: "−4.1%", cite: 1, tone: "text-danger" },
  { name: "Cost of goods sold", change: "+6.3%", cite: 2, tone: "text-danger" },
  { name: "Headcount cost", change: "+12.0%", cite: 1, tone: "text-danger" },
];

const SOURCES = ["Management reporting · Q3 pack", "Q2 financial statements", "Fund model v7", "Board minutes · 24 Sep 2026"];

const PRINCIPLES = [
  { icon: FileSearch, title: "Source-grounded", body: "Answers are built from governed records and cite the documents they rely on." },
  { icon: Lock, title: "Permission-scoped", body: "AI only sees what the person asking is allowed to see. Confidential data never reaches external APIs." },
  { icon: UserCheck, title: "Approval-gated", body: "Nothing an AI drafts becomes a report, memo, or message until a named person approves it." },
];

type Review = "pending" | "approved" | "changes";

function AIAnswerPreview() {
  const [review, setReview] = useState<Review>("pending");
  const reduce = useReducedMotion();

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-canvas shadow-[0_24px_48px_-32px_rgb(17_19_24/0.25)]">
      <div className="flex items-center justify-between border-b border-line bg-subtle px-4 py-2.5">
        <p className="text-[13px] font-medium">Ask OCTO · Harbor Logistics</p>
        <SampleLabel>Demo environment</SampleLabel>
      </div>

      <div className="space-y-5 p-5">
        <p className="ml-auto w-fit max-w-[85%] rounded-lg bg-muted px-3.5 py-2 text-sm text-ink">Why did EBITDA decline this quarter?</p>

        <div>
          <p className="text-[15px] leading-relaxed text-ink">
            EBITDA declined <span className="font-semibold tabular-nums">8.2%</span> quarter on quarter, from $11.0M to $10.1M.
            Lower volume and higher input costs account for most of the change.
          </p>

          <table className="mt-4 w-full text-[13px]">
            <caption className="pb-2 text-left font-data text-[10px] uppercase tracking-[0.08em] text-ink-3">Primary drivers</caption>
            <tbody className="divide-y divide-line border-y border-line">
              {DRIVERS.map((d) => (
                <tr key={d.name}>
                  <th scope="row" className="py-2 text-left font-normal text-ink">
                    {d.name}
                  </th>
                  <td className={cn("py-2 text-right font-data tabular-nums", d.tone)}>{d.change}</td>
                  <td className="w-10 py-2 text-right font-data text-[11px] text-accent">[{d.cite}]</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <p className="font-data text-[10px] uppercase tracking-[0.08em] text-ink-3">Sources</p>
          <ol className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {SOURCES.map((s, i) => (
              <li key={s} className="flex items-center gap-2 text-[13px] text-ink-2">
                <Check aria-hidden className="size-3.5 shrink-0 text-ok" />
                <span className="font-data text-[11px] text-accent">[{i + 1}]</span>
                <span className="truncate">{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-line bg-subtle px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <dl className="grid grid-cols-2 gap-x-5 gap-y-1 font-data text-[11px] sm:flex sm:flex-wrap">
          <div className="flex gap-1.5">
            <dt className="text-ink-3">Model</dt>
            <dd className="text-ink-2">Approved model</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="text-ink-3">Version</dt>
            <dd className="text-ink-2">3.2</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="text-ink-3">Citations</dt>
            <dd className="text-ink-2">{SOURCES.length}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="text-ink-3">Review</dt>
            <dd aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={review}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: DUR.fast, ease: EASE }}
                  className="inline-block"
                >
                  {review === "pending" && <Pill tone="warn" dot>Pending</Pill>}
                  {review === "approved" && <Pill tone="ok" dot>Approved by you</Pill>}
                  {review === "changes" && <Pill tone="info" dot>Changes requested</Pill>}
                </motion.span>
              </AnimatePresence>
            </dd>
          </div>
        </dl>
        {review === "pending" ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setReview("changes")}
              className={cn("h-8 rounded-md border border-line-strong bg-canvas px-3 text-[13px] text-ink hover:bg-muted", focusRing)}
            >
              Request changes
            </button>
            <button
              type="button"
              onClick={() => setReview("approved")}
              className={cn("h-8 rounded-md bg-ink px-3 text-[13px] font-medium text-white hover:bg-ink-2", focusRing)}
            >
              Approve for IC memo
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setReview("pending")} className={cn("h-8 rounded-md px-2 text-[13px] text-ink-2 hover:text-ink", focusRing)}>
            Reset demo
          </button>
        )}
      </div>
    </div>
  );
}

/** AI positioned as governed, cited, human-approved assistance (AI-001..003). */
export function GovernedAI() {
  return (
    <Section id="ai" labelledBy="ai-title">
      <SectionHeader
        id="ai-title"
        index="06"
        eyebrow="Governed AI"
        title="AI with a chain of custody."
        lead="OCTO's AI works on the same governed record as everyone else, knows where each answer came from, and never acts on its own authority."
      />

      <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-5">
          <p className="text-h3 font-semibold">
            AI proposes.
            <br />
            <span className="text-accent">Humans approve.</span>
          </p>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {PRINCIPLES.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4 py-5">
                <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-accent" strokeWidth={1.5} />
                <div>
                  <p className="text-[15px] font-medium text-ink">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-2">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal className="lg:col-span-7" delay={0.08}>
          <AIAnswerPreview />
        </Reveal>
      </div>
    </Section>
  );
}
