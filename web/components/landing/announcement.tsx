"use client";

import { ArrowRight } from "lucide-react";
import { ANNOUNCEMENT, CTA_HREF } from "@/lib/landing-content";
import { Container, focusRing } from "./primitives";

/** Status line above the navigation (MASTER-001 · 00). States availability, nothing more. */
export function Announcement() {
  return (
    <div className="border-b border-line bg-subtle text-ink">
      <Container className="flex min-h-10 flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 text-[13px]">
        <span className="font-data text-[11px] uppercase tracking-[0.08em] text-accent">{ANNOUNCEMENT.label}</span>
        <span className="hidden text-ink-2 sm:inline">{ANNOUNCEMENT.text}</span>
        <a href={CTA_HREF} className={`inline-flex items-center gap-1 rounded-sm font-medium text-ink hover:text-accent ${focusRing}`}>
          {ANNOUNCEMENT.cta}
          <ArrowRight aria-hidden className="size-3.5" />
        </a>
      </Container>
    </div>
  );
}
