"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { DUR, EASE, Reveal, Section, SectionHeader } from "./primitives";

const INPUTS = ["CRM", "Financial models", "Documents", "Market data", "Portfolio reporting", "Deal pipeline"];
const OUTPUTS = ["Analysis", "Alerts", "Workflows", "Reporting", "AI", "Decisions"];

/** Inputs → OCTO → outputs, drawn once as the diagram enters view (PAL-011). */
function Network() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const reduce = useReducedMotion();
  const show = reduce || inView;
  const W = 1200;
  const H = 420;
  const y = (i: number) => 45 + i * 66;
  const core = { x: 600, y: 210, w: 200, h: 120 };
  const line = (d: string, i: number, delay: number, strong?: boolean) => (
    <motion.path
      key={d}
      d={d}
      fill="none"
      stroke={strong ? "var(--color-accent-light)" : "rgb(255 255 255 / 0.28)"}
      strokeWidth="1"
      initial={reduce ? false : { pathLength: 0 }}
      animate={show ? { pathLength: 1 } : undefined}
      transition={{ duration: DUR.narrative, ease: EASE, delay: delay + i * 0.06 }}
    />
  );

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Six input systems connect into OCTO, which feeds six decision outputs">
      {INPUTS.map((s, i) => (
        <g key={s}>
          <rect x="0.5" y={y(i) - 18} width="220" height="36" fill="var(--color-void)" stroke="rgb(255 255 255 / 0.22)" />
          <text x="16" y={y(i) + 4} className="font-data text-[13px]" fill="rgb(255 255 255 / 0.85)">
            {s}
          </text>
          {line(`M221 ${y(i)} C 380 ${y(i)}, 400 ${core.y}, ${core.x - core.w / 2} ${core.y}`, i, 0.05)}
        </g>
      ))}
      {OUTPUTS.map((s, i) => (
        <g key={s}>
          <rect x={W - 220.5} y={y(i) - 18} width="220" height="36" fill="var(--color-void)" stroke="rgb(255 255 255 / 0.22)" />
          <text x={W - 204} y={y(i) + 4} className="font-data text-[13px]" fill="rgb(255 255 255 / 0.85)">
            {s}
          </text>
          {line(`M${core.x + core.w / 2} ${core.y} C 800 ${core.y}, 820 ${y(i)}, ${W - 221} ${y(i)}`, i, 0.55, true)}
        </g>
      ))}
      <motion.g initial={reduce ? false : { opacity: 0 }} animate={show ? { opacity: 1 } : undefined} transition={{ duration: DUR.complex, delay: 0.45 }}>
        <rect x={core.x - core.w / 2} y={core.y - core.h / 2} width={core.w} height={core.h} fill="var(--color-night)" stroke="var(--color-accent-light)" />
        <text x={core.x} y={core.y - 8} textAnchor="middle" className="text-[26px] font-semibold tracking-[0.2em]" fill="#fff">
          OCTO
        </text>
        <text x={core.x} y={core.y + 22} textAnchor="middle" className="font-data text-[11px] tracking-[0.1em]" fill="var(--color-accent-light)">
          GOVERNED CONTEXT
        </text>
      </motion.g>
      <text x="0" y={H - 4} className="font-data text-[11px] tracking-[0.1em]" fill="var(--color-fog)">
        INPUTS
      </text>
      <text x={W} y={H - 4} textAnchor="end" className="font-data text-[11px] tracking-[0.1em]" fill="var(--color-fog)">
        OUTPUTS
      </text>
    </svg>
  );
}

export function SourceNetwork() {
  return (
    <Section id="problem" tone="void" labelledBy="problem-title">
      <SectionHeader
        id="problem-title"
        index="02"
        eyebrow="Fragmented truth"
        title="Private markets run across too many versions of the truth."
        lead="CRM, models, documents, market data, and reporting each hold part of the record. OCTO connects them once, so every output starts from the same facts."
        inverse
      />
      <Reveal className="mt-16 hidden md:block">
        <Network />
      </Reveal>
      {/* Phones: the same story as a vertical flow (PAL-035). */}
      <Reveal className="mt-12 md:hidden">
        <ul className="grid grid-cols-2 gap-px border border-night-line bg-night-line">
          {INPUTS.map((s) => (
            <li key={s} className="bg-void px-3 py-2.5 font-data text-[12px] text-white/85">
              {s}
            </li>
          ))}
        </ul>
        <p aria-hidden className="py-3 text-center font-data text-fog">↓</p>
        <div className="border border-accent-light bg-night px-4 py-5 text-center">
          <p className="text-2xl font-semibold tracking-[0.2em]">OCTO</p>
          <p className="mt-1 font-data text-[11px] tracking-[0.1em] text-accent-light">GOVERNED CONTEXT</p>
        </div>
        <p aria-hidden className="py-3 text-center font-data text-fog">↓</p>
        <ul className="grid grid-cols-2 gap-px border border-night-line bg-night-line">
          {OUTPUTS.map((s) => (
            <li key={s} className="bg-void px-3 py-2.5 font-data text-[12px] text-white/85">
              {s}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
