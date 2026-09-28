"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { CTA_HREF } from "@/lib/landing-content";
import { ButtonLink, DUR, EASE, Eyebrow, Reveal, Section } from "./primitives";

const INPUTS = ["Funds", "Investments", "Companies", "Documents", "Market data", "Workflows"];

/** Simplified OCTO system diagram converging into a single record (CTA-102). Decorative; the copy carries the message. */
function SingleRecord() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const show = reduce || inView;
  const y = (i: number) => 30 + i * 46;
  const target = { x: 300, y: 145 };

  return (
    <svg ref={ref} viewBox="0 0 420 290" className="mx-auto h-auto w-full max-w-[420px]" aria-hidden>
      {INPUTS.map((label, i) => (
        <g key={label}>
          <rect x="0.5" y={y(i) - 13} width="108" height="26" fill="var(--color-night)" stroke="rgb(255 255 255 / 0.22)" />
          <text x="12" y={y(i) + 4} className="font-data text-[11px]" fill="rgb(255 255 255 / 0.78)">
            {label}
          </text>
          <motion.path
            d={`M109 ${y(i)} C 190 ${y(i)}, 210 ${target.y}, ${target.x - 60} ${target.y}`}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1"
            initial={reduce ? false : { pathLength: 0, opacity: 0.3 }}
            animate={show ? { pathLength: 1, opacity: 0.85 } : undefined}
            transition={{ duration: DUR.narrative, ease: EASE, delay: 0.1 + i * 0.06 }}
          />
        </g>
      ))}
      <motion.g initial={reduce ? false : { opacity: 0 }} animate={show ? { opacity: 1 } : undefined} transition={{ duration: DUR.complex, delay: 0.55 }}>
        <rect x={target.x - 60} y={target.y - 34} width="178" height="68" fill="var(--color-night)" stroke="var(--color-accent)" />
        <text x={target.x - 46} y={target.y - 10} className="font-data text-[10px] tracking-[0.08em]" fill="#b9a6ff">
          OCTO
        </text>
        <text x={target.x - 46} y={target.y + 12} className="text-[15px] font-semibold" fill="#ffffff">
          One governed record
        </text>
      </motion.g>
    </svg>
  );
}

/** Closing statement and the next action (CTA-100..102). */
export function Cta() {
  return (
    <Section tone="void" labelledBy="cta-title" className="overflow-hidden">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <Eyebrow inverse index="20">Request access</Eyebrow>
          <h2 id="cta-title" className="mt-6 text-h2 font-medium text-balance">
            Build a governed operating system for private markets.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-fog">Bring investment data, context, intelligence, and workflows into one system.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={CTA_HREF} variant="inverse" arrow>
              Request access
            </ButtonLink>
            <ButtonLink href={CTA_HREF} variant="ghost-inverse">
              Talk to the team
            </ButtonLink>
          </div>
        </Reveal>
        <div className="hidden sm:block lg:col-span-5">
          <SingleRecord />
        </div>
      </div>
    </Section>
  );
}
