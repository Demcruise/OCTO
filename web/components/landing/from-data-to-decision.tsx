"use client";

import { useEffect, useRef, useState } from "react";
import { Check, FileText, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { WORKFLOW } from "./content";
import { prefersReducedMotion, useAnimeScope } from "./motion/anime";
import { revealOnView, revealTimeline, workflowTransition } from "./motion/timelines";
import { Container, DemoTag, Eyebrow, Section, TwoTone, focusRing } from "./ui";

/**
 * 06 FROM DATA TO DECISION (megaplan §08, §20): an indexed selector of four
 * workflow states and a fixed-height preview. Every state is absolutely
 * positioned inside the same frame, so switching never reflows the page.
 */
export function FromDataToDecision() {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const prev = useRef(0);

  useAnimeScope(root, ({ reduced }) => {
    const el = root.current!;
    return revealOnView(el, reduced, () => {
      revealTimeline(el, reduced);
      if (frame.current) workflowTransition(frame.current, 0, 0, reduced);
    }, el, "[data-anim='reveal']");
  });

  useEffect(() => {
    if (frame.current && prev.current !== active) workflowTransition(frame.current, prev.current, active, prefersReducedMotion());
    prev.current = active;
  }, [active]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const map: Record<string, number> = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: WORKFLOW.length - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const n = (map[e.key] + WORKFLOW.length) % WORKFLOW.length;
    setActive(n);
    document.getElementById(`wf-tab-${n}`)?.focus();
  };

  return (
    <Section id="from-data-to-decision" label="From data to decision" className="bg-octo-surface">
      <div ref={root}>
        <Container>
          <div className="grid grid-cols-4 gap-x-5 md:grid-cols-12 md:gap-x-[30px]">
            <div className="col-span-4 md:col-span-7">
              <Eyebrow anim="reveal">From data to decision</Eyebrow>
              <div data-anim="reveal">
                <TwoTone first="One record," second="from first look to final report." className="mt-4" />
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-4 gap-x-5 gap-y-6 md:mt-14 md:grid-cols-12 md:gap-x-[30px]">
            {/* Selector: list first on mobile, preview second (§31). */}
            <div data-anim="reveal" role="tablist" aria-label="Workflow states" aria-orientation="vertical" className="col-span-4 grid grid-cols-2 gap-2 md:col-span-12 md:grid-cols-4 lg:col-span-4 lg:flex lg:flex-col lg:gap-0">
              {WORKFLOW.map((w, i) => (
                <button
                  key={w.id}
                  id={`wf-tab-${i}`}
                  role="tab"
                  type="button"
                  aria-selected={i === active}
                  aria-controls="wf-preview"
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={cn(
                    "group relative cursor-pointer rounded-lg border px-4 py-3 text-left transition-colors lg:rounded-none lg:border-x-0 lg:border-b-0 lg:border-t lg:px-0 lg:py-6",
                    i === active ? "border-octo-ink bg-white lg:border-octo-ink lg:bg-transparent" : "border-octo-border bg-transparent hover:border-octo-ink/40",
                    focusRing,
                  )}
                >
                  <span className="flex items-baseline gap-3">
                    <span className={cn("font-data text-o-label", i === active ? "text-octo-accent" : "text-octo-text-light")}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={cn("font-data text-[12px] uppercase tracking-[0.16em]", i === active ? "text-octo-ink" : "text-octo-text-muted")}>{w.label}</span>
                  </span>
                  <span className={cn("mt-2 block font-o-display text-[20px] leading-tight tracking-[-0.02em] lg:text-[26px]", i === active ? "text-octo-ink" : "text-octo-text-light group-hover:text-octo-ink")}>{w.line}</span>
                  {/* Always rendered so the list keeps its height when the state changes. */}
                  <span className={cn("mt-2 hidden font-o-serif text-[15px] transition-colors lg:block", i === active ? "text-octo-text-muted" : "text-octo-text-light")}>{w.body}</span>
                </button>
              ))}
            </div>

            {/* Fixed preview viewport */}
            <div data-anim="reveal" className="col-span-4 md:col-span-12 lg:col-span-8">
              <div className="overflow-hidden rounded-2xl border border-octo-border bg-white">
                <div className="flex items-center justify-between border-b border-octo-hairline px-5 py-3">
                  <span className="font-data text-o-label uppercase text-octo-text-muted">
                    {String(active + 1).padStart(2, "0")} · {WORKFLOW[active].label}
                  </span>
                  <DemoTag />
                </div>
                <div id="wf-preview" ref={frame} role="tabpanel" aria-labelledby={`wf-tab-${active}`} className="relative h-[440px] md:h-[480px]">
                  {WORKFLOW.map((w, i) => (
                    <div key={w.id} data-wf-panel aria-hidden={i !== active} className={cn("absolute inset-0 p-5 md:p-8", i !== active && "pointer-events-none")} style={{ opacity: i === 0 ? 1 : 0 }}>
                      {w.id === "screen" && <Screen />}
                      {w.id === "decide" && <Decide />}
                      {w.id === "monitor" && <Monitor />}
                      {w.id === "report" && <Report />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Section>
  );
}

/* ---------- States (original OCTO UI, demo data) ---------- */

function Screen() {
  const rows = [
    ["Bayu Wind", "Renewables", "Advisor", 77],
    ["Mitra Diagnostics", "Healthcare", "Proprietary", 74],
    ["Arus Grid Storage", "Renewables", "CRM", 79],
    ["Cerah EdTech", "Education", "Data room", 66],
    ["Orchid Hotels", "Hospitality", "Inbound", 58],
  ] as const;
  return (
    <div className="flex h-full flex-col gap-4">
      <div data-anim-item className="flex flex-wrap items-center gap-2 text-[13px]">
        <span className="rounded-md bg-octo-muted px-2.5 py-1 text-octo-ink">142 sourced</span>
        <span className="text-octo-text-light">→</span>
        <span className="rounded-md bg-octo-muted px-2.5 py-1 text-octo-ink">38 in mandate</span>
        <span className="text-octo-text-light">→</span>
        <span className="rounded-md bg-octo-ink px-2.5 py-1 text-white">5 to review</span>
      </div>
      <div data-anim-item className="flex-1 overflow-hidden rounded-lg border border-octo-hairline">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-octo-surface font-data text-o-label uppercase text-octo-text-muted">
            <tr>
              <th className="px-3 py-2.5 font-normal">Company</th>
              <th className="hidden px-3 py-2.5 font-normal sm:table-cell">Sector</th>
              <th className="hidden px-3 py-2.5 font-normal sm:table-cell">Source</th>
              <th className="px-3 py-2.5 text-right font-normal">Score</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([c, s, src, score]) => (
              <tr key={c} className="border-t border-octo-hairline">
                <td className="px-3 py-2.5 text-octo-ink">{c}</td>
                <td className="hidden px-3 py-2.5 text-octo-text-muted sm:table-cell">{s}</td>
                <td className="hidden px-3 py-2.5 text-octo-text-muted sm:table-cell">{src}</td>
                <td className="px-3 py-2.5">
                  <span className="flex items-center justify-end gap-2">
                    <span className="h-1.5 w-16 overflow-hidden rounded-full bg-octo-muted">
                      <span className="block h-full rounded-full" style={{ width: `${score}%`, background: score >= 75 ? "var(--color-octo-data-green)" : score >= 60 ? "var(--color-octo-data-amber)" : "var(--color-octo-data-red)" }} />
                    </span>
                    <span className="w-6 text-right tabular-nums text-octo-ink">{score}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Decide() {
  return (
    <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-5">
      <div data-anim-item className="flex flex-col rounded-lg border border-octo-hairline p-4 sm:col-span-3">
        <p className="font-data text-o-label uppercase text-octo-text-muted">Investment memo · v4</p>
        <p className="mt-2 font-o-display text-[22px] leading-tight tracking-[-0.02em] text-octo-ink">Kirana Consumer add-on</p>
        <p className="mt-2 font-o-serif text-[15px] leading-snug text-octo-text-muted">Bolt-on of 140 outlets at 7.2× EBITDA; synergies from a shared distribution centre.</p>
        <dl className="mt-auto grid grid-cols-3 gap-3 border-t border-octo-hairline pt-3 text-[12px]">
          {[
            ["EV / EBITDA", "7.2×"],
            ["Target IRR", "24%"],
            ["MOIC", "2.4×"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-octo-text-muted">{k}</dt>
              <dd className="mt-0.5 font-o-display text-[20px] text-octo-ink tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="flex flex-col gap-4 sm:col-span-2">
        <div data-anim-item className="rounded-lg border border-octo-hairline p-4">
          <p className="font-data text-o-label uppercase text-octo-text-muted">Evidence</p>
          <ul className="mt-2 space-y-1.5 text-[13px] text-octo-ink">
            {["QoE report", "Financial model v6", "Data room · 212 files"].map((e) => (
              <li key={e} className="flex items-center gap-2">
                <FileText aria-hidden className="size-3.5 text-octo-text-muted" />
                {e}
              </li>
            ))}
          </ul>
        </div>
        <div data-anim-item className="flex-1 rounded-lg border border-octo-hairline p-4">
          <p className="font-data text-o-label uppercase text-octo-text-muted">Approval</p>
          <ol className="mt-2 space-y-2 text-[13px]">
            {[
              ["Deal team", true],
              ["Risk", true],
              ["IC chair", false],
            ].map(([t, done]) => (
              <li key={String(t)} className="flex items-center gap-2">
                <span className={cn("flex size-4 items-center justify-center rounded-full border", done ? "border-octo-data-green bg-octo-data-green text-white" : "border-octo-accent")}>{done && <Check aria-hidden className="size-2.5" strokeWidth={3} />}</span>
                <span className={done ? "text-octo-text-muted" : "text-octo-ink"}>{String(t)}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function Monitor() {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "NAV", count: 1.82, decimals: 2, prefix: "$", suffix: "B" },
          { label: "Net IRR", count: 18.4, decimals: 1, prefix: "", suffix: "%" },
          { label: "TVPI", count: 2.31, decimals: 2, prefix: "", suffix: "x" },
        ].map((m) => (
          <div key={m.label} data-anim-item className="rounded-lg border border-octo-hairline p-3.5">
            <p className="text-[12px] text-octo-text-muted">{m.label}</p>
            <p data-count={m.count} data-decimals={m.decimals} data-prefix={m.prefix} data-suffix={m.suffix} className="mt-1 font-o-display text-[24px] leading-none tracking-[-0.02em] text-octo-ink tabular-nums md:text-[30px]">
              {m.prefix}
              {m.count.toFixed(m.decimals)}
              {m.suffix}
            </p>
          </div>
        ))}
      </div>
      <div data-anim-item className="rounded-lg border border-octo-hairline p-3.5">
        <p className="text-[12px] text-octo-text-muted">NAV, last 8 quarters</p>
        <svg viewBox="0 0 400 90" preserveAspectRatio="none" aria-hidden className="mt-2 h-20 w-full">
          <path data-wf-path d="M0 74 L57 70 L114 64 L171 60 L228 50 L285 44 L342 36 L400 22" fill="none" stroke="var(--color-octo-data-blue)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <div data-anim-item className="flex-1 rounded-lg border border-octo-hairline p-3.5">
        <p className="text-[12px] text-octo-text-muted">Exceptions</p>
        <ul className="mt-2 space-y-2 text-[13px]">
          {[
            ["Covenant · DSCR 1.14× vs 1.20×", "Assign owner", "var(--color-octo-data-red)"],
            ["Valuation stale · 45 days", "Request mark", "var(--color-octo-data-amber)"],
          ].map(([t, a, c]) => (
            <li key={t} className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2 text-octo-ink">
                <span aria-hidden className="size-1.5 shrink-0 rounded-full" style={{ background: c }} />
                <span className="truncate">{t}</span>
              </span>
              <span className="shrink-0 rounded-md border border-octo-border px-2.5 py-1 text-[12px] text-octo-ink">{a}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Report() {
  const chain = [
    { k: "Investment", v: "Helios Data Centers · Fund II" },
    { k: "IBOR event", v: "LED-88412 · valuation, 30 Sep" },
    { k: "Source", v: "Fund administrator file · 29 Sep" },
    { k: "Document", v: "Q3 valuation memo, p. 4" },
  ];
  return (
    <div className="flex h-full flex-col">
      <div data-anim-item>
        <p className="font-data text-o-label uppercase text-octo-text-muted">Reported figure</p>
        <p className="mt-2 font-o-display text-[52px] leading-none tracking-[-0.035em] text-octo-ink tabular-nums md:text-[64px]">21.84%</p>
        <p className="mt-1 font-o-serif text-[16px] text-octo-text-muted">Gross IRR · Q3 LP report</p>
      </div>
      <ol className="relative mt-6 flex-1 space-y-3 pl-7">
        <svg aria-hidden className="absolute left-2 top-2 h-[calc(100%-16px)] w-2" viewBox="0 0 8 100" preserveAspectRatio="none">
          <path data-wf-path d="M4 0 L4 100" stroke="var(--color-octo-accent)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" fill="none" />
        </svg>
        {chain.map((c) => (
          <li key={c.k} data-anim-item className="relative">
            <span aria-hidden className="absolute -left-[23px] top-3 size-2.5 rounded-full border-2 border-white bg-octo-accent ring-1 ring-octo-accent" />
            <div className="flex items-center justify-between gap-3 rounded-lg border border-octo-hairline bg-white px-3.5 py-2.5">
              <span className="font-data text-o-label uppercase text-octo-text-muted">{c.k}</span>
              <span className="truncate text-[13px] text-octo-ink">{c.v}</span>
            </div>
          </li>
        ))}
      </ol>
      <p data-anim-item className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-octo-text-muted">
        <Link2 aria-hidden className="size-3.5" /> Every figure resolves to its source document.
      </p>
    </div>
  );
}
