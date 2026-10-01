"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FOOTER, LEGAL, PERSPECTIVE } from "./content";
import { OctoMark } from "./octo-header";
import { useAnimeScope } from "./motion/anime";
import { revealOnView, revealTimeline } from "./motion/timelines";
import { Container, Eyebrow, focusRing } from "./ui";

/**
 * 08 FOOTER (megaplan §12, §14): The OCTO Perspective as short editorial
 * links, then navigation and legal. Perspective lives here — not as a
 * ninth section.
 */
export function Footer() {
  const root = useRef<HTMLDivElement>(null);
  useAnimeScope(root, ({ reduced }) => {
    const el = root.current!;
    return revealOnView(el, reduced, () => revealTimeline(el, reduced), el, "[data-anim='reveal']");
  });

  return (
    <footer id="footer" data-landing-section="footer" aria-label="Footer" className="border-t border-octo-border bg-octo-surface pb-10 pt-16 md:pt-[100px]">
      <div ref={root}>
        <Container>
          <div id="perspective" className="grid grid-cols-4 gap-x-5 gap-y-6 md:grid-cols-12 md:gap-x-[30px]">
            <div className="col-span-4">
              <Eyebrow anim="reveal">{PERSPECTIVE.title}</Eyebrow>
            </div>
            <ul className="col-span-4 md:col-span-8">
              {PERSPECTIVE.links.map((l) => (
                <li key={l.label} data-anim="reveal">
                  <a href={l.href} className={cn("group flex items-center justify-between gap-4 border-t border-octo-border py-5 font-o-serif text-[22px] leading-snug text-octo-ink transition-colors hover:text-octo-accent-ink md:text-[28px]", focusRing)}>
                    {l.label}
                    <ArrowRight aria-hidden className="size-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-x-5 gap-y-10 border-t border-octo-border pt-12 md:mt-24 md:grid-cols-12 md:gap-x-[30px]">
            <div data-anim="reveal" className="col-span-2 md:col-span-4">
              <a href="#top" className={cn("inline-flex items-center gap-2 rounded-sm text-octo-ink", focusRing)} aria-label="OCTO home">
                <OctoMark />
                <span className="font-o-display text-[17px] font-medium tracking-[0.14em]">OCTO</span>
              </a>
              <p className="mt-4 max-w-xs font-o-serif text-[16px] text-octo-text-muted">Private markets infrastructure. One governed system for every investment decision.</p>
            </div>
            {FOOTER.map((col) => (
              <nav key={col.title} data-anim="reveal" aria-label={col.title} className="md:col-span-2">
                <p className="font-data text-o-label uppercase text-octo-text-muted">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className={cn("rounded-sm text-[15px] text-octo-ink hover:underline", focusRing)}>
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="mt-14 flex flex-col gap-3 border-t border-octo-border pt-6 text-[13px] text-octo-text-muted md:flex-row md:items-center md:justify-between">
            <p>© 2026 OCTO. Figures on this page are demo data.</p>
            <ul className="flex gap-5" aria-label="Legal">
              {LEGAL.map((l) => (
                <li key={l} title="Shared on request during onboarding">
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>
    </footer>
  );
}
