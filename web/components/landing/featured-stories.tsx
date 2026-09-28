"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { STORIES } from "@/lib/landing-content";
import { Container, DUR, EASE, Eyebrow, focusRing } from "./primitives";

/**
 * Topic strip + featured story (PAL-006..009): the strip selects the story,
 * the story is one large photograph with a black overlay card — never a grid
 * of marketing cards. Swipe left/right on touch screens; arrows otherwise.
 */
export function FeaturedStories() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const touchX = useRef<number | null>(null);
  const story = STORIES[index];

  const go = useCallback((next: number) => {
    setDir(next > index ? 1 : -1);
    setIndex(((next % STORIES.length) + STORIES.length) % STORIES.length);
  }, [index]);

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 48) go(index + (dx < 0 ? 1 : -1));
  };

  return (
    <section id="stories" aria-label="Featured stories" className="bg-void pt-20 text-white md:pt-28">
      <Container>
        <Eyebrow inverse index="01">
          Featured
        </Eyebrow>
        <div role="group" aria-label="Topics" className="no-scrollbar -mx-5 mt-8 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
          {STORIES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={index === i}
              onClick={() => go(i)}
              className={cn(
                "shrink-0 whitespace-nowrap border px-4 py-2.5 font-data text-[11px] uppercase tracking-[0.1em] transition-colors",
                index === i ? "border-white bg-white text-void" : "border-night-line text-white/65 hover:border-white/40 hover:text-white",
                focusRing,
              )}
            >
              {s.eyebrow}
            </button>
          ))}
        </div>
      </Container>

      <Container className="mt-8 md:mt-10">
        <div
          role="group"
          aria-label={`Story ${index + 1} of ${STORIES.length}: ${story.eyebrow}`}
          className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/10] lg:aspect-[21/10] lg:max-h-[78vh]"
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX;
          }}
          onTouchEnd={onTouchEnd}
        >
          <AnimatePresence initial={false} custom={dir}>
            <motion.div
              key={story.id}
              className="absolute inset-0"
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 48 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -32 }}
              transition={{ duration: DUR.complex, ease: EASE }}
            >
              <motion.div
                className="absolute inset-0"
                initial={reduce ? false : { scale: 1 }}
                animate={{ scale: 1.03 }}
                transition={{ duration: 6, ease: "linear" }}
              >
                <Image
                  src={`${story.image}?auto=format&fit=crop&w=2200&q=72`}
                  alt={story.alt}
                  fill
                  sizes="(min-width: 1024px) 88vw, 100vw"
                  className="object-cover"
                  priority={index === 0}
                />
              </motion.div>
              <div aria-hidden className="absolute inset-0 bg-void/35" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-void/20" />
            </motion.div>
          </AnimatePresence>

          {/* Overlay card: black, square, 35–50% width (STORY-003). */}
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-10">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={story.id}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DUR.standard, ease: EASE, delay: reduce ? 0 : 0.1 }}
                className="max-w-xl bg-void/85 p-6 backdrop-blur-none md:p-9 lg:w-[46%]"
              >
                <p className="font-data text-meta uppercase text-accent-light">{story.eyebrow}</p>
                <h2 className="mt-4 text-2xl font-medium leading-snug tracking-tight md:text-3xl">{story.title}</h2>
                <p className="mt-4 text-[15px] leading-relaxed text-white/70">{story.description}</p>
                <a
                  href={story.href}
                  className={cn("mt-6 inline-flex min-h-10 items-center gap-2 font-data text-[12px] uppercase tracking-[0.1em] text-white hover:text-accent-light", focusRing)}
                >
                  Explore
                  <ArrowRight aria-hidden className="size-3.5" />
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-6">
          <div className="flex gap-1.5" aria-hidden>
            {STORIES.map((s, i) => (
              <button
                key={s.id}
                tabIndex={-1}
                onClick={() => go(i)}
                className={cn("h-0.5 w-10 transition-colors", i === index ? "bg-white" : "bg-white/25 hover:bg-white/50")}
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <p className="font-data text-[11px] tabular-nums text-white/55" aria-live="polite">
              {String(index + 1).padStart(2, "0")} / {String(STORIES.length).padStart(2, "0")}
            </p>
            <button
              type="button"
              aria-label="Previous story"
              onClick={() => go(index - 1)}
              className={cn("grid size-11 place-items-center border border-night-line text-white/80 transition-colors hover:border-white/50 hover:text-white", focusRing)}
            >
              <ArrowLeft aria-hidden className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next story"
              onClick={() => go(index + 1)}
              className={cn("grid size-11 place-items-center border border-night-line text-white/80 transition-colors hover:border-white/50 hover:text-white", focusRing)}
            >
              <ArrowRight aria-hidden className="size-4" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
