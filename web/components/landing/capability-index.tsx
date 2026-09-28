"use client";

import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CAPABILITIES } from "@/lib/landing-content";
import { Reveal, Section, SectionHeader, focusRing } from "./primitives";

/** Compact index of what OCTO covers, instead of a feature-card grid (CAP-100/101). */
export function CapabilityIndex() {
  return (
    <Section id="capabilities" tone="subtle" labelledBy="capabilities-title">
      <SectionHeader
        id="capabilities-title"
        index="09"
        eyebrow="Capabilities"
        title="One record under every capability."
        lead="Twelve capabilities across the investment lifecycle. Each one reads from the same ontology and book of record."
      />

      <Reveal className="mt-12">
        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((c) => (
            <li key={c.title} className="bg-canvas">
              <a href={c.href} className={cn("group flex h-full min-h-11 items-start gap-4 px-5 py-5 transition-colors hover:bg-subtle", focusRing)}>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium text-ink">{c.title}</p>
                  <p className="mt-1 text-sm text-ink-2">{c.benefit}</p>
                  <p className="mt-2 font-data text-[11px] text-ink-3">{c.signal}</p>
                </div>
                <ArrowUpRight aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-3 transition-colors group-hover:text-accent" />
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
