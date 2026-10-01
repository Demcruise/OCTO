"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_HREF, INSTITUTIONAL, PROOF_TABS, SYSTEM } from "./content";
import { prefersReducedMotion, useAnimeScope } from "./motion/anime";
import { revealOnView, revealTimeline, workflowTransition } from "./motion/timelines";
import { ButtonLink, Container, DemoTag, Eyebrow, Section, TwoTone, focusRing } from "./ui";

const ROUTE_TARGET: Record<string, string> = { "/ontology": "#featured", "/ibor": "#featured", "/intelligence": "#featured", "/workflow": "#from-data-to-decision", "/governance": "#institutional" };

/**
 * 03 OCTO SYSTEM (megaplan §05, §09): the centred system statement, the
 * full-width system index, one compact embedded product proof, and the
 * institutional-grade module. Modules, not sections.
 */
export function OctoSystem() {
  const root = useRef<HTMLDivElement>(null);
  useAnimeScope(root, ({ reduced }) => {
    const el = root.current!;
    const groups = Array.from(el.querySelectorAll<HTMLElement>("[data-reveal-group]"));
    const offs = groups.map((g) => revealOnView(g, reduced, () => revealTimeline(g, reduced), g, "[data-anim='reveal']"));
    return () => offs.forEach((o) => o());
  });

  return (
    <Section id="octo-system" label="The OCTO system">
      <div ref={root}>
        <Container>
          {/* System statement */}
          <div data-reveal-group className="mx-auto max-w-[1100px] text-center">
            <Eyebrow anim="reveal">The OCTO system</Eyebrow>
            <h2 className="mt-6 font-o-display text-o-section text-octo-ink">
              {SYSTEM.statement.map((l, i) => (
                <span key={l} data-anim="reveal" className={cn("block", (i === 1 || i === 2) && "text-octo-text-light")}>
                  {l}
                </span>
              ))}
            </h2>
          </div>

          {/* System index */}
          <ol data-reveal-group aria-label="System index" className="mt-16 border-b border-octo-border md:mt-24">
            {SYSTEM.index.map((s) => (
              <li key={s.name} data-anim="reveal">
                <a href={ROUTE_TARGET[s.route]} className={cn("group grid grid-cols-4 items-baseline gap-x-5 gap-y-2 border-t border-octo-border py-6 transition-colors hover:bg-octo-surface md:grid-cols-12 md:gap-x-[30px] md:py-8", focusRing)}>
                  <span className="col-span-4 font-o-display text-o-title text-octo-ink md:col-span-5">{s.name}</span>
                  <span className="col-span-3 font-o-serif text-[17px] text-octo-text-muted md:col-span-5 md:text-[19px]">{s.body}</span>
                  <span className="col-span-1 flex items-center justify-end gap-2 font-data text-o-label uppercase text-octo-text-light md:col-span-2">
                    <span className="hidden sm:inline">{s.route}</span>
                    <ArrowRight aria-hidden className="size-4 text-octo-ink transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </a>
              </li>
            ))}
          </ol>

          {/* Embedded product proof */}
          <div data-reveal-group className="mt-16 md:mt-24">
            <ProductProof />
          </div>

          {/* Institutional grade */}
          <div id="institutional" data-reveal-group className="mt-20 md:mt-32">
            <div className="grid grid-cols-4 gap-x-5 md:grid-cols-12 md:gap-x-[30px]">
              <div className="col-span-4 md:col-span-6">
                <Eyebrow anim="reveal">{INSTITUTIONAL.eyebrow}</Eyebrow>
                <div data-anim="reveal">
                  <TwoTone first="Controls are part" second="of the record." className="mt-4" />
                </div>
              </div>
              <p data-anim="reveal" className="col-span-4 mt-6 self-end font-o-serif text-o-lead text-octo-text-muted md:col-span-5 md:col-start-8 md:mt-0">
                OCTO is designed for teams whose numbers are audited, whose decisions are reviewed, and whose data is confidential.
              </p>
            </div>
            <ol className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 md:mt-14">
              {INSTITUTIONAL.pillars.map((p, i) => (
                <li key={p.name} data-anim="reveal" className="flex min-h-[220px] flex-col rounded-xl border border-octo-border bg-white p-5 transition-colors hover:border-octo-ink">
                  <span className="font-data text-o-label text-octo-text-light">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-auto font-o-display text-[22px] tracking-[-0.02em] text-octo-ink">{p.name}</span>
                  <span className="mt-2 font-o-serif text-[15px] leading-snug text-octo-text-muted">{p.body}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-[12px] text-octo-text-light">Capabilities of the product design, not third-party certifications.</p>
          </div>
        </Container>
      </div>
    </Section>
  );
}

function ProductProof() {
  const [tab, setTab] = useState(0);
  const prev = useRef(0);
  const frame = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (frame.current && prev.current !== tab) workflowTransition(frame.current, prev.current, tab, prefersReducedMotion());
    prev.current = tab;
  }, [tab]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const map: Record<string, number> = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: PROOF_TABS.length - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const n = (map[e.key] + PROOF_TABS.length) % PROOF_TABS.length;
    setTab(n);
    document.getElementById(`proof-tab-${n}`)?.focus();
  };

  return (
    <div className="grid grid-cols-4 gap-x-5 gap-y-8 md:grid-cols-12 md:gap-x-[30px]">
      <div className="col-span-4 md:col-span-4">
        <Eyebrow anim="reveal">Inside OCTO</Eyebrow>
        <h3 data-anim="reveal" className="mt-4 font-o-display text-o-title text-octo-ink">
          <span className="block">The same record,</span>
          <span className="block text-octo-text-light">every working view.</span>
        </h3>
        <p data-anim="reveal" className="mt-4 font-o-serif text-[17px] leading-relaxed text-octo-text-muted">
          Control panel, portfolio, investment, company and workflow all read from one governed record.
        </p>
        <div data-anim="reveal" className="mt-6">
          <ButtonLink href={APP_HREF} variant="line" arrow="up">
            Open the demo app
          </ButtonLink>
        </div>
      </div>
      <div data-anim="reveal" className="col-span-4 md:col-span-8">
        <div role="tablist" aria-label="Product views" className="no-scrollbar flex gap-1 overflow-x-auto rounded-lg bg-octo-muted p-1">
          {PROOF_TABS.map((t, i) => (
            <button
              key={t}
              id={`proof-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={i === tab}
              aria-controls="proof-frame"
              tabIndex={i === tab ? 0 : -1}
              onClick={() => setTab(i)}
              onKeyDown={(e) => onKey(e, i)}
              className={cn("h-9 shrink-0 cursor-pointer rounded-md px-3.5 text-[14px] transition-colors", i === tab ? "bg-white text-octo-ink shadow-[0_1px_2px_rgb(30_33_36/0.12)]" : "text-octo-text-muted hover:text-octo-ink", focusRing)}
            >
              {t}
            </button>
          ))}
        </div>
        <div id="proof-frame" role="tabpanel" aria-labelledby={`proof-tab-${tab}`} className="mt-3 overflow-hidden rounded-xl border border-octo-border bg-white">
          <div className="flex items-center gap-2 border-b border-octo-hairline bg-octo-surface px-4 py-2.5">
            <span aria-hidden className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="size-2.5 rounded-full bg-octo-border" />
              ))}
            </span>
            <span className="ml-2 truncate font-data text-[11px] text-octo-text-muted">octo / {PROOF_TABS[tab].toLowerCase().replace(" ", "-")}</span>
            <DemoTag className="ml-auto hidden sm:inline-flex" />
          </div>
          <div ref={frame} className="relative h-[380px] md:h-[420px]">
            {PROOF_TABS.map((t, i) => (
              <div key={t} data-wf-panel aria-hidden={i !== tab} className={cn("absolute inset-0 p-5 md:p-7", i !== tab && "pointer-events-none")} style={{ opacity: i === 0 ? 1 : 0 }}>
                <ProofView i={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, delta, good = true }: { label: string; value: string; delta?: string; good?: boolean }) {
  return (
    <div data-anim-item className="rounded-lg border border-octo-hairline p-3.5">
      <p className="text-[12px] text-octo-text-muted">{label}</p>
      <p className="mt-1.5 font-o-display text-[26px] leading-none tracking-[-0.02em] text-octo-ink tabular-nums">{value}</p>
      {delta && <p className={cn("mt-1.5 text-[12px] font-medium", good ? "text-[#1d7a2a]" : "text-[#b42318]")}>{delta}</p>}
    </div>
  );
}

function ProofView({ i }: { i: number }) {
  if (i === 0)
    return (
      <div className="flex h-full flex-col gap-4">
        <div className="grid grid-cols-3 gap-3">
          <Kpi label="Total NAV" value="$812.4M" delta="+3.2% vs Q2" />
          <Kpi label="Net IRR" value="18.2%" delta="−0.4 pts" good={false} />
          <Kpi label="TVPI" value="1.64×" delta="+0.05×" />
        </div>
        <div data-anim-item className="flex-1 rounded-lg border border-octo-hairline p-3.5">
          <p className="text-[12px] font-medium text-octo-ink">Priority queue</p>
          <ul className="mt-2 divide-y divide-octo-hairline text-[13px]">
            {[
              ["Covenant breach · DSCR 1.14×", "Critical", "#d13913"],
              ["IC memo · Kirana add-on", "Due today", "#d1980b"],
              ["Cash break · $20,000", "High", "#d1980b"],
              ["Draft · Q3 variance", "AI draft", "#6d45ff"],
            ].map(([t, s, c]) => (
              <li key={t} className="flex items-center justify-between gap-3 py-2">
                <span className="truncate text-octo-ink">{t}</span>
                <span className="inline-flex shrink-0 items-center gap-1.5 text-[12px] text-octo-text-muted">
                  <span aria-hidden className="size-1.5 rounded-full" style={{ background: c }} />
                  {s}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  if (i === 1)
    return (
      <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2">
        <div data-anim-item className="rounded-lg border border-octo-hairline p-3.5">
          <p className="text-[12px] font-medium text-octo-ink">Allocation by sector</p>
          <ul className="mt-3 space-y-2.5">
            {[
              ["Digital infrastructure", 24.1, "#147eb3"],
              ["Renewables", 19.6, "#29a634"],
              ["Consumer", 16.2, "#d1980b"],
              ["Healthcare", 14.8, "#634dbf"],
              ["Industrials", 12.9, "#00a396"],
            ].map(([k, v, c]) => (
              <li key={String(k)} className="text-[12px]">
                <div className="flex justify-between">
                  <span className="text-octo-text-muted">{k}</span>
                  <span className="tabular-nums text-octo-ink">{Number(v).toFixed(1)}%</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-octo-muted">
                  <div className="h-full rounded-full" style={{ width: `${Number(v) * 3.4}%`, background: String(c) }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div data-anim-item className="rounded-lg border border-octo-hairline p-3.5">
          <p className="text-[12px] font-medium text-octo-ink">Top movers · QTD</p>
          <ul className="mt-3 space-y-2 text-[13px]">
            {[
              ["Garuda Fibre", "+9.1%", true],
              ["Arcadia Software", "+7.7%", true],
              ["Serayu Renewables", "+6.8%", true],
              ["Sinar Agritech", "−6.2%", false],
              ["Helios Data Centers", "−4.1%", false],
            ].map(([k, v, up]) => (
              <li key={String(k)} className="flex justify-between">
                <span className="text-octo-ink">{k}</span>
                <span className={cn("tabular-nums font-medium", up ? "text-[#1d7a2a]" : "text-[#b42318]")}>{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  if (i === 2)
    return (
      <div className="flex h-full flex-col gap-4">
        <div data-anim-item className="flex items-baseline justify-between">
          <p className="font-o-display text-[22px] text-octo-ink">Helios Data Centers · Fund II</p>
          <span className="rounded-md bg-[#fdeceb] px-2 py-0.5 text-[12px] text-[#b42318]">At risk</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Kpi label="Fair value" value="$78.0M" />
          <Kpi label="MOIC" value="1.35×" />
          <Kpi label="IRR" value="21.4%" />
        </div>
        <div data-anim-item className="flex-1 rounded-lg border border-octo-hairline p-3.5">
          <p className="text-[12px] text-octo-text-muted">Fair value, last 8 quarters</p>
          <svg viewBox="0 0 300 80" preserveAspectRatio="none" className="mt-2 h-24 w-full" aria-hidden>
            <path d="M0 62 L43 58 L86 54 L129 47 L172 43 L215 36 L258 30 L300 38" fill="none" stroke="#147eb3" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <path d="M0 62 L43 58 L86 54 L129 47 L172 43 L215 36 L258 30 L300 38 L300 80 L0 80 Z" fill="#147eb3" opacity="0.08" />
          </svg>
        </div>
      </div>
    );
  if (i === 3)
    return (
      <div className="flex h-full flex-col gap-4">
        <div data-anim-item>
          <p className="font-o-display text-[22px] text-octo-ink">Meridian Health</p>
          <p className="text-[13px] text-octo-text-muted">Healthcare · Hospitals · Vietnam</p>
        </div>
        <div data-anim-item className="no-scrollbar flex gap-4 overflow-x-auto border-b border-octo-hairline text-[13px]">
          {["Overview", "Financials", "Valuation", "Risks", "Documents", "Lineage"].map((t, k) => (
            <span key={t} className={cn("shrink-0 pb-2", k === 1 ? "border-b-2 border-octo-ink text-octo-ink" : "text-octo-text-muted")}>
              {t}
            </span>
          ))}
        </div>
        <div data-anim-item className="flex flex-1 items-end gap-2 rounded-lg border border-octo-hairline p-3.5">
          {[38, 41, 43, 44, 46, 45, 47, 45.5].map((v, k) => (
            <div key={k} className="flex flex-1 flex-col items-center gap-1">
              <div className="w-full rounded-t-sm bg-octo-data-blue/80" style={{ height: `${v * 2.4}px` }} />
              <span className="font-data text-[9px] text-octo-text-light">Q{(k % 4) + 1}</span>
            </div>
          ))}
        </div>
      </div>
    );
  return (
    <div className="flex h-full flex-col gap-4">
      <div data-anim-item>
        <p className="font-data text-o-label uppercase text-octo-text-muted">Investment committee · APR-0412</p>
        <p className="mt-1 font-o-display text-[22px] text-octo-ink">IC memo · Kirana Consumer add-on</p>
      </div>
      <ol data-anim-item className="flex flex-wrap items-center gap-3 text-[13px]">
        {[
          ["Deal team", true],
          ["Risk", true],
          ["IC chair", false],
        ].map(([t, done], k) => (
          <li key={String(t)} className="flex items-center gap-2">
            <span className={cn("flex size-5 items-center justify-center rounded-full border text-[10px]", done ? "border-octo-data-green bg-octo-data-green text-white" : "border-octo-accent text-octo-accent")}>{done ? <Check aria-hidden className="size-3" strokeWidth={3} /> : k + 1}</span>
            <span className={done ? "text-octo-text-muted" : "font-medium text-octo-ink"}>{String(t)}</span>
            {k < 2 && <span aria-hidden className="h-px w-6 bg-octo-border" />}
          </li>
        ))}
      </ol>
      <div data-anim-item className="flex-1 rounded-lg border border-octo-hairline p-3.5 text-[13px] text-octo-text-muted">
        <p className="text-octo-ink">$18.0M add-on at 7.2× EBITDA, funded from Fund II reserves.</p>
        <p className="mt-2">Evidence: QoE report · model v6 · leverage alert ALR-1838</p>
        <div className="mt-4 flex gap-2">
          <span className="rounded-md bg-octo-ink px-3 py-1.5 text-[12px] text-white">Approve</span>
          <span className="rounded-md border border-octo-border px-3 py-1.5 text-[12px] text-octo-ink">Request changes</span>
        </div>
        <p className="mt-3 inline-flex items-center gap-1 text-[12px] text-octo-text-light">
          Every decision needs a comment <ArrowUpRight aria-hidden className="size-3" />
        </p>
      </div>
    </div>
  );
}
