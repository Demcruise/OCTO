"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CAPABILITY_GROUPS } from "@/lib/landing-content";
import { Reveal, Section, SectionHeader, focusRing } from "./primitives";

type Item = (typeof CAPABILITY_GROUPS)[number]["items"][number];

/**
 * Dense capability index (PAL-027). Hover or focus an item to preview it; the
 * description is also printed inline on small screens, so nothing is hover-only.
 */
export function CapabilityIndex() {
  const first = CAPABILITY_GROUPS[0].items[0] as Item;
  const [active, setActive] = useState<Item>(first);

  return (
    <Section id="capabilities" labelledBy="capabilities-title">
      <SectionHeader
        id="capabilities-title"
        index="18"
        eyebrow="Capability index"
        title="What OCTO covers."
        lead="Sixteen capabilities across platform, workflow, governance, and data. One record underneath all of them."
      />

      <Reveal className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:col-span-8 xl:grid-cols-4">
          {CAPABILITY_GROUPS.map((g) => (
            <div key={g.label}>
              <p className="border-b border-ink pb-2 font-data text-meta uppercase text-ink">{g.label}</p>
              <ul>
                {g.items.map((it) => (
                  <li key={it.title} className="border-b border-line">
                    <a
                      href={it.href}
                      onMouseEnter={() => setActive(it as Item)}
                      onFocus={() => setActive(it as Item)}
                      className={cn("group flex min-h-11 items-start justify-between gap-3 py-2.5", focusRing)}
                    >
                      <span>
                        <span className={cn("block text-[15px] transition-colors", active.title === it.title ? "text-accent" : "text-ink group-hover:text-accent")}>{it.title}</span>
                        <span className="mt-0.5 block text-[12px] leading-relaxed text-ink-3 lg:hidden">{it.body}</span>
                      </span>
                      <ArrowUpRight aria-hidden className="mt-1 size-3.5 shrink-0 text-ink-3 group-hover:text-accent" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <aside aria-live="polite" className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-24 border border-line-strong">
            <div className="flex items-center gap-2 border-b border-line bg-subtle px-4 py-2.5">
              <span aria-hidden className="flex gap-1">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="size-1.5 rounded-full bg-line-strong" />
                ))}
              </span>
              <p className="truncate font-data text-[11px] text-ink-2">octo / {active.view}</p>
            </div>
            <div className="p-5">
              <p className="font-data text-meta uppercase text-accent">Preview</p>
              <p className="mt-2 text-2xl font-medium tracking-tight">{active.title}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{active.body}</p>
              <div aria-hidden className="mt-5 space-y-2 border-t border-line pt-4">
                {[88, 72, 94, 60].map((w, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="h-2 bg-muted" style={{ width: `${w}%` }} />
                    <span className="font-data text-[10px] text-ink-3">{["Current", "Verified", "Source available", "Updated 12 min ago"][i]}</span>
                  </div>
                ))}
              </div>
              <a href={active.href} className={cn("mt-6 inline-flex min-h-10 items-center gap-2 bg-ink px-4 text-[13px] font-medium text-white hover:bg-ink-2", focusRing)}>
                Open {active.title} <ArrowUpRight aria-hidden className="size-3.5" />
              </a>
            </div>
          </div>
        </aside>
      </Reveal>
    </Section>
  );
}
