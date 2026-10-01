"use client";

import { useRef } from "react";
import Image from "next/image";
import { EXPLORE_HREF, FUTURE, PHOTOS } from "./content";
import { useAnimeScope } from "./motion/anime";
import { revealOnView, revealTimeline } from "./motion/timelines";
import { ButtonLink, Container, Credit, Eyebrow, Lead, Section, TwoTone, unsplashLoader } from "./ui";

/** 05 THE FUTURE (megaplan §07): a quiet editorial beat — one image, one idea, one link. */
export function FutureEditorial() {
  const root = useRef<HTMLDivElement>(null);
  useAnimeScope(root, ({ reduced }) => {
    const el = root.current!;
    return revealOnView(el, reduced, () => revealTimeline(el, reduced), el, "[data-anim='reveal']");
  });
  return (
    <Section id="future" label="The future">
      <div ref={root}>
        <Container>
          <div className="grid grid-cols-4 gap-x-5 gap-y-6 md:grid-cols-12 md:gap-x-[30px]">
            <div className="col-span-4 md:col-span-7">
              <Eyebrow anim="reveal">What comes next</Eyebrow>
              <div data-anim="reveal">
                <TwoTone first={FUTURE.line1} second={FUTURE.line2} className="mt-4" />
              </div>
            </div>
            <div className="col-span-4 flex flex-col items-start gap-6 md:col-span-4 md:col-start-9 md:self-end">
              <Lead anim="reveal">{FUTURE.support}</Lead>
              <div data-anim="reveal">
                <ButtonLink href={EXPLORE_HREF} variant="line" arrow="right">
                  {FUTURE.cta}
                </ButtonLink>
              </div>
            </div>
          </div>
          <figure data-anim="reveal" className="relative mt-12 aspect-[4/3] overflow-hidden rounded-2xl bg-octo-muted md:mt-16 md:aspect-[21/9]">
            <Image loader={unsplashLoader} src={PHOTOS.windfarm.src} alt={PHOTOS.windfarm.alt} fill sizes="(min-width: 1440px) 1380px, 100vw" className="object-cover object-[50%_55%]" />
            <figcaption className="absolute bottom-3 right-4">
              <Credit>Photo · Unsplash</Credit>
            </figcaption>
          </figure>
        </Container>
      </div>
    </Section>
  );
}
