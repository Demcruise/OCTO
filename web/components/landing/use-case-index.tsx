"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { USE_CASES, type UseCase } from "@/lib/landing-content";
import { Reveal, Section, SectionHeader, focusRing } from "./primitives";

/**
 * Use-case index (PAL-028): a list of roles, not a card grid. Hover or focus
 * reveals the problem → workflow → surface; the detail is printed inline on
 * small screens so nothing is hover-only.
 */
export function UseCaseIndex() {
  const [active, setActive] = useState<UseCase>(USE_CASES[0]);

  return (
    <Section id="use-cases" labelledBy="use-cases-title">
      <SectionHeader
        id="use-cases-title"
        index="19"
        eyebrow="Use-case index"
        title="Where each team works."
        lead="The same governed record, surfaced differently for every role in the firm."
      />

      <Reveal className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <ul className="divide-y divide-line border-y border-line lg:col-span-7">
          {USE_CASES.map((u) => (
            <li key={u.role}>
              <a
                href={u.href}
                onMouseEnter={() => setActive(u)}
                onFocus={() => setActive(u)}
                className={cn("group flex min-h-14 items-center justify-between gap-6 py-4", focusRing)}
              >
                <span className="min-w-0">
                  <span className={cn("block text-lg font-medium tracking-tight transition-colors md:text-xl", active.role === u.role ? "text-accent" : "text-ink group-hover:text-accent")}>
                    {u.role}
                  </span>
                  <span className="mt-1 block text-[13px] leading-relaxed text-ink-3 lg:hidden">
                    {u.problem} → {u.surface}
                  </span>
                </span>
                <ArrowUpRight aria-hidden className="size-4 shrink-0 text-ink-3 transition-colors group-hover:text-accent" />
              </a>
            </li>
          ))}
        </ul>

        <aside aria-live="polite" className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-28 border border-line-strong">
            <div className="border-b border-line bg-subtle px-5 py-2.5">
              <p className="font-data text-[11px] text-ink-2">octo / use case</p>
            </div>
            <dl className="space-y-5 p-6">
              <div>
                <dt className="font-data text-meta uppercase text-ink-3">Problem</dt>
                <dd className="mt-1.5 text-[15px] leading-relaxed text-ink">{active.problem}</dd>
              </div>
              <div>
                <dt className="font-data text-meta uppercase text-ink-3">Workflow</dt>
                <dd className="mt-1.5 text-[15px] leading-relaxed text-ink">{active.workflow}</dd>
              </div>
              <div>
                <dt className="font-data text-meta uppercase text-ink-3">Product surface</dt>
                <dd className="mt-1.5 text-[15px] leading-relaxed text-ink">{active.surface}</dd>
              </div>
              <a href={active.href} className={cn("inline-flex min-h-10 items-center gap-2 bg-ink px-4 text-[13px] font-medium text-white hover:bg-ink-2", focusRing)}>
                Open {active.role} <ArrowUpRight aria-hidden className="size-3.5" />
              </a>
            </dl>
          </div>
        </aside>
      </Reveal>
    </Section>
  );
}
