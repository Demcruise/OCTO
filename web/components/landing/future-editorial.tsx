"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Eyebrow, Reveal, Section, focusRing } from "./primitives";

/* Industrial infrastructure (Unsplash License). */
const IMAGE = "https://images.unsplash.com/photo-1504307651254-35680f356dfd";

/**
 * 05 — THE FUTURE / EDITORIAL STORY: the strategic pause. Image left, one large
 * statement right. No features, no cards, no proof (PAL-005).
 */
export function FutureEditorial() {
  return (
    <Section id="future" labelledBy="future-title" className="py-0 md:py-0">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <Reveal className="relative min-h-[320px] lg:min-h-[560px]">
          <Image
            src={`${IMAGE}?auto=format&fit=crop&w=1600&q=72`}
            alt="Steel framework of an industrial facility under construction"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </Reveal>
        <div className="flex flex-col justify-center py-16 lg:py-32 lg:pl-4">
          <Reveal delay={0.05}>
            <Eyebrow index="05">The future</Eyebrow>
            <h2 id="future-title" className="mt-8 text-display font-normal text-balance">
              There is still more to connect.
            </h2>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-ink-2">
              Investment teams should not have to reconstruct context every time they make a decision.
            </p>
            <a href="#system" className={cn("mt-10 inline-flex min-h-11 items-center gap-2 font-data text-[12px] uppercase tracking-[0.12em] text-ink hover:text-accent", focusRing)}>
              Explore OCTO <ArrowRight aria-hidden className="size-4" />
            </a>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
