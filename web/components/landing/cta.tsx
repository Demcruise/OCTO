"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CTA_HREF } from "@/lib/landing-content";
import { Container, focusRing } from "./primitives";

/**
 * 07 — CTA: two panels, one action each (PAL-007). Light surfaces, hairline
 * borders, short labels.
 */
export function Cta() {
  const panels = [
    { title: "Request access", href: CTA_HREF, primary: true },
    { title: "Explore OCTO", href: "#system", primary: false },
  ];
  return (
    <section id="cta" aria-label="Get started" className="border-t border-line bg-subtle">
      <Container className="py-16 md:py-24">
        <div className="grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-2">
          {panels.map((p) => (
            <a
              key={p.title}
              href={p.href}
              className={cn(
                "group flex items-center justify-between gap-6 bg-canvas px-8 py-12 transition-colors md:px-12 md:py-20",
                "hover:bg-subtle",
                focusRing,
              )}
            >
              <span className="text-3xl font-medium tracking-tight text-ink transition-colors group-hover:text-accent md:text-4xl">
                {p.title}
              </span>
              <span
                aria-hidden
                className={cn(
                  "grid size-12 shrink-0 place-items-center border transition-colors",
                  p.primary ? "border-accent bg-accent text-white group-hover:bg-accent-hover" : "border-line-strong text-ink group-hover:border-accent group-hover:text-accent",
                )}
              >
                <ArrowRight className="size-5 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
