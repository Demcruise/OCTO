"use client";

import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SYSTEM_INDEX } from "@/lib/landing-content";
import { Reveal, Section, focusRing } from "./primitives";

/**
 * 03 — OCTO SYSTEM. Centered statement, then the five-part index as a
 * long numberless list (V4-02 / V4-03).
 */
export function OctoSystem() {
  return (
    <Section id="system" labelledBy="system-title">
      {/* Centered statement — no label, no logo, no paragraph (V4-02). */}
      <Reveal className="mx-auto max-w-[1220px] text-center">
        <h2 id="system-title" className="text-statement font-normal text-balance">
          OCTO connects investment data, context, intelligence, and workflow in one governed system.
        </h2>
      </Reveal>

      <Reveal className="mt-20 md:mt-24" delay={0.05}>
        <p className="font-data text-meta uppercase tracking-[0.05em] text-ink-3">The OCTO system</p>
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {SYSTEM_INDEX.map((s) => (
            <li key={s.index}>
              <a href={s.href} className={cn("group flex items-start justify-between gap-6 py-8 md:min-h-[132px] md:py-9", focusRing)}>
                <span className="min-w-0">
                  <span className="block text-[clamp(1.625rem,2.5vw,2.5rem)] font-normal leading-tight tracking-tight text-ink transition-colors group-hover:text-accent">{s.name}</span>
                  <span className="mt-2 block max-w-lg text-lg leading-[1.4] text-ink-2">{s.description}</span>
                </span>
                <span className="mt-2 inline-flex shrink-0 items-center gap-1 font-data text-[12px] text-ink-3 transition-all group-hover:translate-x-1 group-hover:text-accent">
                  /0.{Number(s.index)} <ArrowUpRight aria-hidden className="size-3.5" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
