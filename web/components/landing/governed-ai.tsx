"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AlertTriangle, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApprovalState } from "@/components/octo/approval-state";
import { EvidenceList, type Evidence } from "@/components/octo/evidence-list";
import { DUR, EASE, Pill, Reveal, SampleLabel, Section, SectionHeader, focusRing } from "./primitives";

const QUESTIONS = ["Why did EBITDA decline this quarter?", "What will Harbor Logistics be worth at exit?"] as const;

const DRIVERS = [
  { name: "Revenue", change: "−4.1%", cite: 1 },
  { name: "Cost of goods sold", change: "+6.3%", cite: 2 },
  { name: "Headcount cost", change: "+12.0%", cite: 5 },
];

const EVIDENCE: Evidence[] = [
  { ref: "1", title: "Income statement · Q3 2026", kind: "Financials", excerpt: "Revenue $55.6M (Q2: $58.0M). Management accounts, reviewed 12 Oct." },
  { ref: "2", title: "Board report · 24 Sep 2026", kind: "Document", excerpt: "p.14 — “Freight input costs rose 6% as fuel contracts reset in July.”" },
  { ref: "3", title: "IBOR event · Q3 valuation", kind: "Ledger", excerpt: "Fair value marked down 4.8% on 30 Sep 2026 · approved by valuation committee." },
  { ref: "4", title: "Portfolio record · Harbor Logistics", kind: "Ontology", excerpt: "Growth Fund II · Buyout · entered Nov 2021 · deal team of 3." },
  { ref: "5", title: "Operating update · hiring plan", kind: "Document", excerpt: "42 hires in Q3 against a plan of 30 — depot expansion brought forward." },
];

const PARTIAL: Evidence[] = [
  { ref: "1", title: "IBOR event · Q3 valuation", kind: "Ledger" },
  { ref: "2", title: "Board report · 24 Sep 2026", kind: "Document" },
];

const CHAIN = [
  { title: "Context", body: "Answers start from the ontology and the book of record, not from the open web." },
  { title: "Evidence", body: "Every statement cites the record or page it came from." },
  { title: "Permissions", body: "AI sees only what the person asking may see. Confidential data never reaches external APIs." },
  { title: "Draft", body: "Output is labelled as a draft until a person accepts it." },
  { title: "Human approval", body: "A named reviewer approves anything that becomes a memo, report, or correction." },
];

type Review = "pending" | "reviewed" | "rejected";

function Answer() {
  const [review, setReview] = useState<Review>("pending");
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-1.5">
        <Pill tone="accent">Drafted by AI</Pill>
        {review === "pending" && <Pill tone="warn">Human review required</Pill>}
        {review === "reviewed" && <Pill tone="ok">Reviewed by you</Pill>}
        {review === "rejected" && <Pill tone="danger">Rejected</Pill>}
      </div>

      <section aria-label="Answer">
        <p className="text-[15px] leading-relaxed text-ink">
          Harbor Logistics EBITDA declined <span className="font-semibold tabular-nums">8.2%</span> quarter on quarter, from $11.0M to $10.1M. Lower volume
          and higher input costs explain most of the change.
        </p>
      </section>

      <table className="w-full text-[13px]">
        <caption className="pb-2 text-left font-data text-[10px] uppercase tracking-[0.08em] text-ink-3">Drivers</caption>
        <tbody className="divide-y divide-line border-y border-line">
          {DRIVERS.map((d) => (
            <tr key={d.name}>
              <th scope="row" className="py-2 text-left font-normal text-ink">
                {d.name}
              </th>
              <td className="py-2 text-right font-data tabular-nums text-danger">{d.change}</td>
              <td className="w-10 py-2 text-right font-data text-[11px] text-accent">[{d.cite}]</td>
            </tr>
          ))}
        </tbody>
      </table>

      <section aria-label="Sources">
        <p className="mb-2 font-data text-[10px] uppercase tracking-[0.08em] text-ink-3">Sources · select to inspect</p>
        <EvidenceList items={EVIDENCE} />
      </section>

      <dl className="grid grid-cols-1 gap-x-6 gap-y-1.5 text-[12px] sm:grid-cols-2">
        {[
          ["Context", "Ontology · IBOR · financials · documents"],
          ["Permission scope", "Growth Fund II deal team"],
          ["Model", "Approved model · v3.2"],
          ["Generated", "30 Sep 2026 · 09:42 UTC"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3 border-b border-line py-1">
            <dt className="text-ink-3">{k}</dt>
            <dd className="text-right text-ink-2">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="rounded-lg border border-line bg-subtle p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-ink">
            <span className="text-ink-3">Proposed action · </span>Add this explanation to the Q3 IC memo
          </p>
          <ApprovalState reached={review === "reviewed" ? "reviewer" : "evidence"} />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p aria-live="polite" className="text-[13px] text-ink-2">
            {review === "pending" && "Nothing is added until a person reviews it."}
            {review === "reviewed" && "Reviewed. Waiting for the deal lead to approve."}
            {review === "rejected" && "Draft discarded. Sources stay on the record."}
          </p>
          {review === "pending" ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setReview("rejected")}
                className={cn("min-h-11 rounded-md border border-line-strong bg-canvas px-4 text-sm text-ink hover:bg-muted sm:min-h-9", focusRing)}
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => setReview("reviewed")}
                className={cn("min-h-11 rounded-md bg-ink px-4 text-sm font-medium text-white hover:bg-ink-2 sm:min-h-9", focusRing)}
              >
                Review
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setReview("pending")} className={cn("min-h-11 rounded-md px-2 text-sm text-ink-2 hover:text-ink sm:min-h-9", focusRing)}>
              Reset demo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function InsufficientEvidence() {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-warn/30 bg-warn/8 p-4">
        <p className="flex items-center gap-2 text-[15px] font-semibold text-ink">
          <AlertTriangle aria-hidden className="size-4 text-warn" />
          Insufficient evidence
        </p>
        <p className="mt-1 text-sm text-ink-2">OCTO could not establish a complete evidence chain for this answer.</p>
      </div>
      <ul className="space-y-2 text-[13px]" aria-label="Evidence check">
        <li className="flex items-center gap-2 text-ink">
          <Check aria-hidden className="size-3.5 text-ok" /> Current valuation on record
        </li>
        <li className="flex items-center gap-2 text-ink">
          <Check aria-hidden className="size-3.5 text-ok" /> Board report with trading update
        </li>
        <li className="flex items-center gap-2 text-ink">
          <X aria-hidden className="size-3.5 text-danger" /> No approved exit model in the record
        </li>
        <li className="flex items-center gap-2 text-ink">
          <X aria-hidden className="size-3.5 text-danger" /> No buyer indications on file
        </li>
      </ul>
      <p className="text-[13px] text-ink-3">OCTO does not estimate a figure it cannot source. It shows you what exists instead.</p>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="ai-partial-records"
        onClick={() => setOpen((v) => !v)}
        className={cn("min-h-11 rounded-md border border-line-strong bg-canvas px-4 text-sm font-medium text-ink hover:bg-subtle sm:min-h-9", focusRing)}
      >
        {open ? "Hide source records" : "Open source records"}
      </button>
      {open && (
        <div id="ai-partial-records">
          <EvidenceList items={PARTIAL} />
        </div>
      )}
    </div>
  );
}

/** AI as a governed layer: answer, drivers, sources, scope, provenance, approval, and an honest failure (AI-100..104). */
export function GovernedAI() {
  const reduce = useReducedMotion();
  const [q, setQ] = useState(0);

  return (
    <Section id="ai" labelledBy="ai-title">
      <SectionHeader
        id="ai-title"
        index="06"
        eyebrow="Governed AI"
        title="AI with a chain of custody."
        lead="OCTO answers from governed context, keeps source evidence attached, and leaves high-impact actions to human approval."
      />

      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-5">
          <p className="text-h3 font-semibold">
            AI proposes.
            <br />
            <span className="text-accent">Humans approve.</span>
          </p>
          <ol className="mt-8 divide-y divide-line border-y border-line">
            {CHAIN.map((c, i) => (
              <li key={c.title} className="grid grid-cols-[28px_1fr] gap-3 py-4">
                <span className="font-data text-meta text-accent">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="text-[15px] font-medium text-ink">{c.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-ink-2">{c.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal className="min-w-0 lg:col-span-7" delay={0.08}>
          <div className="overflow-hidden rounded-xl border border-line bg-canvas shadow-[0_20px_40px_-32px_rgb(17_19_24/0.22)]">
            <div className="flex items-center justify-between border-b border-line bg-subtle px-4 py-2.5">
              <p className="text-[13px] font-medium">OCTO Intelligence · Harbor Logistics</p>
              <SampleLabel>Demo environment</SampleLabel>
            </div>
            <div className="border-b border-line p-4">
              <div role="radiogroup" aria-label="Question" className="flex flex-col gap-1.5 sm:flex-row">
                {QUESTIONS.map((text, i) => (
                  <button
                    key={text}
                    type="button"
                    role="radio"
                    aria-checked={q === i}
                    onClick={() => setQ(i)}
                    className={cn(
                      "min-h-11 flex-1 rounded-md border px-3 py-2 text-left text-[13px] transition-colors sm:min-h-9",
                      q === i ? "border-accent bg-accent-soft text-ink" : "border-line text-ink-2 hover:border-line-strong hover:text-ink",
                      focusRing,
                    )}
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-5" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={q}
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: DUR.standard, ease: EASE }}
                >
                  {q === 0 ? <Answer /> : <InsufficientEvidence />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
