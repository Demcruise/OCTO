"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { STORIES } from "@/lib/landing-content";
import { Container, DUR, EASE, Eyebrow, focusRing } from "./primitives";

const DURATION_MS = 8000;

/**
 * Featured stories (PAL-006..009): five snack bars, each with an 8-second
 * progress fill. Advance only at 100%; manual selection resets the timer;
 * hover pauses; hidden tabs pause; reduced motion disables autoplay.
 */
export function FeaturedStories() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const indexRef = useRef(0);
  const progressRef = useRef(0);
  const barsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const touchX = useRef<number | null>(null);
  const story = STORIES[index];

  const paintBars = useCallback(() => {
    barsRef.current.forEach((el, i) => {
      if (el) el.style.transform = `scaleX(${i === indexRef.current ? progressRef.current : 0})`;
    });
  }, []);

  const go = useCallback((next: number) => {
    indexRef.current = ((next % STORIES.length) + STORIES.length) % STORIES.length;
    progressRef.current = 0;
    setIndex(indexRef.current);
    paintBars();
  }, [paintBars]);

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 60); // clamp so a hidden tab doesn't jump
      last = now;
      if (!paused) {
        progressRef.current += dt / DURATION_MS;
        if (progressRef.current >= 1) {
          go(indexRef.current + 1);
        } else {
          paintBars();
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, reduce, go, paintBars]);

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 48) go(indexRef.current + (dx < 0 ? 1 : -1));
  };

  return (
    <section
      id="stories"
      aria-label="Featured"
      className="border-t border-line bg-canvas py-20 text-ink md:py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Container>
        <Eyebrow index="02">Featured</Eyebrow>

        {/* Five snack bars; each owns its progress indicator. */}
        <div role="group" aria-label="Featured topics" className="no-scrollbar -mx-5 mt-10 flex gap-px overflow-x-auto border-y border-line bg-line px-px md:mx-0 md:px-0">
          {STORIES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={index === i}
              onClick={() => go(i)}
              className={cn(
                "relative min-w-56 flex-1 shrink-0 bg-canvas px-4 pb-4 pt-3.5 text-left transition-colors",
                index === i ? "text-ink" : "text-ink-3 hover:bg-subtle hover:text-ink",
                focusRing,
              )}
            >
              <span className="block font-data text-[10px] uppercase tracking-[0.12em]">{`0${i + 1}`}</span>
              <span className="mt-1 block truncate text-[13px] font-medium">{s.eyebrow}</span>
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-line-strong/40">
                <span
                  ref={(el) => {
                    barsRef.current[i] = el;
                  }}
                  className="block h-full w-full origin-left bg-accent"
                  style={{ transform: `scaleX(${index === i ? (reduce ? 1 : 0) : 0})` }}
                />
              </span>
            </button>
          ))}
        </div>

        <div
          role="group"
          aria-label={`Story ${index + 1} of ${STORIES.length}: ${story.eyebrow}`}
          className="relative mt-6 aspect-[4/5] overflow-hidden border border-line sm:aspect-[16/10] lg:aspect-[21/10] lg:max-h-[76vh]"
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX;
          }}
          onTouchEnd={onTouchEnd}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={story.id}
              className="absolute inset-0"
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
              transition={{ duration: DUR.complex, ease: EASE }}
            >
              <motion.div className="absolute inset-0" initial={reduce ? false : { scale: 1 }} animate={{ scale: 1.03 }} transition={{ duration: 6, ease: "linear" }}>
                <Image
                  src={`${story.image}?auto=format&fit=crop&w=2200&q=72`}
                  alt={story.alt}
                  fill
                  sizes="(min-width: 1024px) 88vw, 100vw"
                  className="object-cover"
                  priority={story.id === "ontology"}
                />
              </motion.div>
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-void/60 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Light overlay card — page chrome stays light. */}
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-10">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={story.id}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DUR.standard, ease: EASE, delay: reduce ? 0 : 0.1 }}
                className="max-w-xl border border-line bg-canvas/95 p-6 md:p-9 lg:w-[46%]"
              >
                <p className="font-data text-meta uppercase text-accent">{story.eyebrow}</p>
                <h2 className="mt-4 text-2xl font-medium leading-snug tracking-tight text-ink md:text-3xl">{story.title}</h2>
                <a href={story.href} className={cn("mt-6 inline-flex min-h-10 items-center gap-2 font-data text-[12px] uppercase tracking-[0.1em] text-ink hover:text-accent", focusRing)}>
                  Learn more
                  <ArrowRight aria-hidden className="size-3.5" />
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-3">
          <p className="mr-auto font-data text-[11px] tabular-nums text-ink-3" aria-live="polite">
            {String(index + 1).padStart(2, "0")} / {String(STORIES.length).padStart(2, "0")}
          </p>
          <button
            type="button"
            aria-label="Previous story"
            onClick={() => go(index - 1)}
            className={cn("grid size-11 place-items-center border border-line text-ink-2 transition-colors hover:border-line-strong hover:text-ink", focusRing)}
          >
            <ArrowLeft aria-hidden className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next story"
            onClick={() => go(index + 1)}
            className={cn("grid size-11 place-items-center border border-line text-ink-2 transition-colors hover:border-line-strong hover:text-ink", focusRing)}
          >
            <ArrowRight aria-hidden className="size-4" />
          </button>
        </div>
      </Container>
    </section>
  );
}
