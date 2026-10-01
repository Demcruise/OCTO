"use client";

import { useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ATLAS, CTA_HREF, EXPLORE_HREF, HERO, PHOTOS, SIGNALS } from "./content";
import { useAnimeScope, onceVisible } from "./motion/anime";
import { countUp, heroTimeline } from "./motion/timelines";
import { ButtonLink, Container, Credit, DemoTag, Eyebrow, Lead, Section, TwoTone, unsplashLoader } from "./ui";

/* Atlas geometry in % of the frame; the SVG uses the same 0–100 space. */
const CENTER = { x: 50, y: 50 };
const NODES: Record<(typeof ATLAS)[number], { x: number; y: number }> = {
  Fund: { x: 17, y: 24 },
  Company: { x: 11, y: 58 },
  Deal: { x: 27, y: 84 },
  Document: { x: 73, y: 84 },
  Metric: { x: 89, y: 58 },
  Decision: { x: 83, y: 24 },
};

const curve = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const mx = (a.x + b.x) / 2;
  return `M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
};

/**
 * 01 HERO (megaplan §03, §17): concise institutional statement, editorial
 * skyline with an OCTO system-atlas layer (direction C), and a demo signal
 * strip. The Anime.js timeline runs nav → eyebrow → headline → support →
 * CTA → visual → atlas → signals.
 */
export function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useAnimeScope(root, ({ reduced }) => {
    const el = root.current!;
    heroTimeline(el, reduced);
    const counters = Array.from(el.querySelectorAll<HTMLElement>("[data-count]"));
    const strip = el.querySelector("[data-signal-strip]");
    if (strip) return onceVisible(strip, () => countUp(counters, reduced), { threshold: 0.4 });
  });

  return (
    <Section id="hero" label="Introduction" className="pb-12 pt-12 md:pb-[80px] md:pt-[88px] xl:pb-[100px] xl:pt-[100px]">
      <div ref={root}>
        <Container>
          <Eyebrow anim="eyebrow">{HERO.eyebrow}</Eyebrow>
          <TwoTone as="h1" size="display" anim="headline" first={HERO.line1} second={HERO.line2} className="mt-5 max-w-[14ch] md:max-w-none" />
          <div className="mt-8 grid grid-cols-4 items-end gap-x-5 gap-y-6 md:grid-cols-12 md:gap-x-[30px]">
            <Lead anim="support" className="col-span-4 max-w-[34ch] md:col-span-6">
              {HERO.support}
            </Lead>
            <div data-anim="cta" className="col-span-4 flex flex-wrap gap-3 md:col-span-6 md:justify-end">
              <ButtonLink href={CTA_HREF} arrow="right">
                {HERO.primary}
              </ButtonLink>
              <ButtonLink href={EXPLORE_HREF} variant="soft">
                {HERO.secondary}
              </ButtonLink>
            </div>
          </div>

          <figure data-anim="visual" className="relative mt-12 aspect-[4/5] overflow-hidden rounded-2xl bg-octo-muted sm:aspect-[16/10] md:mt-16 lg:aspect-[21/9]">
            <Image loader={unsplashLoader} src={PHOTOS.skyline.src} alt={PHOTOS.skyline.alt} fill priority sizes="(min-width: 1440px) 1380px, 100vw" className="object-cover object-[50%_60%]" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#0f1a2a]/35 via-[#0f1a2a]/15 to-[#0f1a2a]/55" />

            {/* System atlas: the objects behind a decision, bound to one governed context. */}
            <div className="absolute inset-0" role="img" aria-label={`OCTO system atlas: ${ATLAS.join(", ")} connected through one governed context`}>
              <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
                {ATLAS.map((n) => (
                  <path key={n} data-atlas-path d={curve(NODES[n], CENTER)} fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="1.25" vectorEffect="non-scaling-stroke" strokeDasharray="0" />
                ))}
              </svg>
              {ATLAS.map((n) => (
                <span
                  key={n}
                  data-anim="atlas-node"
                  style={{ left: `${NODES[n].x}%`, top: `${NODES[n].y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-md border border-white/60 bg-white/90 px-2.5 py-1.5 font-data text-[10px] uppercase tracking-[0.12em] text-octo-ink shadow-[0_6px_18px_rgb(15_26_42/0.18)] backdrop-blur md:px-3.5 md:py-2 md:text-[11px]"
                >
                  {n}
                </span>
              ))}
              <span
                data-anim="atlas-node"
                style={{ left: `${CENTER.x}%`, top: `${CENTER.y}%` }}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-lg bg-octo-ink px-4 py-2.5 text-center text-white shadow-[0_12px_32px_rgb(15_26_42/0.35)] md:px-6 md:py-3.5"
              >
                <span className="font-o-display text-[18px] tracking-[0.18em] md:text-[22px]">OCTO</span>
                <span className="mt-0.5 font-data text-[9px] uppercase tracking-[0.16em] text-white/70 md:text-[10px]">Governed context</span>
              </span>
            </div>
            <figcaption className="absolute bottom-3 right-4">
              <Credit>Photo · Unsplash</Credit>
            </figcaption>
          </figure>

          {/* Signal strip: Ondo's live-metrics rhythm, with demo values only. */}
          <div data-signal-strip className="mt-10 border-t border-octo-border pt-6 md:mt-14">
            <DemoTag />
            <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4 md:gap-x-[30px]">
              {SIGNALS.map((s) => (
                <div key={s.label} data-anim="signal" className={cn("border-l border-octo-hairline pl-4 md:pl-5")}>
                  <dt className="font-o-serif text-[15px] text-octo-text-muted md:text-[16px]">{s.label}</dt>
                  <dd
                    data-count={s.count}
                    data-decimals={s.decimals}
                    data-prefix={"prefix" in s ? s.prefix : ""}
                    data-suffix={"suffix" in s ? s.suffix : ""}
                    className="mt-2 font-o-display text-[40px] leading-none tracking-[-0.03em] text-octo-ink tabular-nums md:text-[56px]"
                  >
                    {"prefix" in s ? s.prefix : ""}
                    {s.decimals ? s.count.toFixed(s.decimals) : s.count}
                    {"suffix" in s ? s.suffix : ""}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </div>
    </Section>
  );
}
