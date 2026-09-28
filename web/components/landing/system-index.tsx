"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SYSTEM_INDEX, type SystemKind } from "@/lib/landing-content";
import { Container, Eyebrow, Reveal, focusRing } from "./primitives";

/* Small product previews, one per system (SYS-002). Abstract mocks, not stock imagery. */
const PREVIEW: Record<SystemKind, React.ReactNode> = {
  ontology: (
    <svg viewBox="0 0 260 180" className="h-full w-full" aria-hidden>
      <g stroke="rgb(255 255 255 / 0.28)" fill="none">
        <line x1="60" y1="40" x2="130" y2="90" />
        <line x1="200" y1="36" x2="130" y2="90" />
        <line x1="130" y1="90" x2="70" y2="150" />
        <line x1="130" y1="90" x2="196" y2="146" />
        <line x1="60" y1="40" x2="200" y2="36" strokeDasharray="3 4" />
      </g>
      {[
        [60, 40, "Fund"],
        [200, 36, "LP"],
        [130, 90, "Company"],
        [70, 150, "Deal"],
        [196, 146, "Investment"],
      ].map(([x, y, l]) => (
        <g key={l as string}>
          <rect x={(x as number) - 30} y={(y as number) - 11} width="60" height="22" fill="var(--color-night)" stroke="var(--color-accent)" />
          <text x={x as number} y={(y as number) + 4} textAnchor="middle" className="font-data text-[9px]" fill="#fff">
            {l}
          </text>
        </g>
      ))}
    </svg>
  ),
  ibor: (
    <div aria-hidden className="flex h-full flex-col justify-center gap-px bg-night-line/60 p-4">
      {[
        ["TXN-0481", "Capital call", "+$4.2M"],
        ["VAL-0092", "Valuation", "2.70x"],
        ["COR-0017", "Correction", "supersedes"],
        ["TXN-0490", "Distribution", "−$1.8M"],
      ].map(([id, kind, v]) => (
        <div key={id} className="flex items-center justify-between bg-night px-3 py-2.5 font-data text-[10px]">
          <span className="text-fog">{id}</span>
          <span className="text-white/80">{kind}</span>
          <span className="text-accent-light">{v}</span>
        </div>
      ))}
    </div>
  ),
  intelligence: (
    <div aria-hidden className="flex h-full flex-col justify-center gap-3 p-5">
      <div className="border border-night-line bg-night p-3">
        <p className="font-data text-[9px] uppercase tracking-[0.1em] text-fog">Query</p>
        <p className="mt-1 text-[12px] text-white/85">Why did EBITDA fall?</p>
      </div>
      <div className="border-l-2 border-accent bg-night p-3">
        <p className="font-data text-[9px] uppercase tracking-[0.1em] text-fog">Answer · sources attached</p>
        <p className="mt-1 text-[12px] text-white/85">−8.2% QoQ · revenue −4.1%, COGS +6.3%</p>
        <p className="mt-1.5 font-data text-[9px] text-warn">Drafted by AI · human approval required</p>
      </div>
    </div>
  ),
  workflow: (
    <div aria-hidden className="flex h-full flex-col justify-center gap-2 p-5">
      {["Sourcing", "Diligence", "IC review", "Monitoring"].map((s, i) => (
        <div key={s} className="flex items-center gap-3">
          <span className="font-data text-[10px] text-accent-light">{String(i + 1).padStart(2, "0")}</span>
          <span className="text-[12px] text-white/85">{s}</span>
          <span className={cn("h-px flex-1", i === 2 ? "bg-accent" : "bg-night-line")} />
          <span className="font-data text-[9px] uppercase text-fog">{i === 2 ? "in review" : i < 2 ? "done" : "queued"}</span>
        </div>
      ))}
    </div>
  ),
  governance: (
    <div aria-hidden className="flex h-full flex-col justify-center gap-px bg-night-line/60 p-4">
      {[
        ["Permission scoped", "role · fund · deal"],
        ["Draft approved", "M. Chen · 14:02"],
        ["Metric traced", "model → source doc"],
        ["Access logged", "audit trail"],
      ].map(([a, b]) => (
        <div key={a} className="flex items-center justify-between bg-night px-3 py-2.5">
          <span className="text-[11px] text-white/85">{a}</span>
          <span className="font-data text-[9px] uppercase tracking-[0.08em] text-fog">{b}</span>
        </div>
      ))}
    </div>
  ),
};

/**
 * System index (SYS-001..005): the five parts of the OCTO system as a numbered
 * list — no card grid. Hover/focus reveals the description and a preview;
 * on touch the description is always visible.
 */
export function SystemIndex() {
  const [active, setActive] = useState<SystemKind>("ontology");

  return (
    <section aria-label="System index" className="border-t border-night-line bg-void py-20 text-white md:py-28">
      <Container>
        <Eyebrow inverse index="03">
          System index
        </Eyebrow>
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-7">
            <ul className="divide-y divide-night-line border-y border-night-line">
              {SYSTEM_INDEX.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    onMouseEnter={() => setActive(s.id)}
                    onFocus={() => setActive(s.id)}
                    className={cn("group grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-6 md:grid-cols-[4.5rem_1fr_auto] md:py-7", focusRing)}
                  >
                    <span className={cn("font-data text-[13px] transition-colors", active === s.id ? "text-accent-light" : "text-fog")}>{s.index}</span>
                    <span className="min-w-0">
                      <span className="block text-xl font-medium tracking-tight transition-colors group-hover:text-white md:text-2xl">{s.name}</span>
                      <span
                        className={cn(
                          "block max-w-md text-[14px] leading-relaxed text-white/60 transition-all duration-300 md:text-[15px]",
                          "lg:grid lg:grid-rows-[0fr] lg:opacity-0 lg:transition-[grid-template-rows,opacity]",
                          active === s.id && "lg:grid-rows-[1fr] lg:opacity-100 lg:[&>span]:pt-2",
                        )}
                      >
                        <span className="block overflow-hidden lg:min-h-0">{s.description}</span>
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden
                      className={cn("size-5 -translate-x-1 self-center text-accent-light opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100", active === s.id && "translate-x-0 opacity-100")}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28 aspect-[13/9] overflow-hidden border border-night-line bg-night">
              {SYSTEM_INDEX.map((s) => (
                <motion.div
                  key={s.id}
                  className="absolute inset-0"
                  initial={false}
                  animate={{ opacity: active === s.id ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                  aria-hidden={active !== s.id}
                >
                  {PREVIEW[s.id]}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
