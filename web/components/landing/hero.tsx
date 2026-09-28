"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { CTA_HREF } from "@/lib/landing-content";
import { ButtonLink, Container, DUR, EASE } from "./primitives";

/* Financial district at night (Unsplash License). Photographic, not a UI mock (HERO-001). */
const HERO_IMAGE = "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df";

const META = "Investment data · Ontology · Intelligence · Workflow";

/**
 * Cinematic hero (HERO-001..007): photographic layer, one headline, two
 * actions, a mono metadata line. Staged entrance per the motion spec —
 * metadata → headline lines → CTAs → slow image drift.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: DUR.narrative, ease: EASE, delay },
  });

  return (
    <section id="top" aria-label="Introduction" className="relative overflow-hidden bg-void text-white">
      <motion.div
        aria-hidden
        className="absolute inset-0"
        initial={reduce ? false : { scale: 1, opacity: 0 }}
        animate={{ scale: 1.03, opacity: 1 }}
        transition={{ opacity: { duration: DUR.complex, delay: 0.15 }, scale: { duration: 3.2, ease: EASE, delay: 0.9 } }}
      >
        <Image
          src={`${HERO_IMAGE}?auto=format&fit=crop&w=2400&q=75`}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      {/* Readability: uniform dim plus a vignette toward the headline corner. */}
      <div aria-hidden className="absolute inset-0 bg-void/55" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-void/40" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-void/70 via-void/20 to-transparent" />

      <Container className="relative flex min-h-[92svh] flex-col justify-end pb-10 pt-36 md:min-h-[100svh] md:pb-14">
        <motion.p {...rise(0.15)} className="font-data text-meta uppercase text-white/70">
          Private markets infrastructure
        </motion.p>
        <h1 className="mt-6 max-w-6xl text-hero font-medium">
          <motion.span {...rise(0.3)} className="block">
            One system
          </motion.span>
          <motion.span {...rise(0.5)} className="block">
            for every investment decision.
          </motion.span>
        </h1>

        <motion.div {...rise(0.75)} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={CTA_HREF} variant="inverse" arrow>
            Request access
          </ButtonLink>
          <ButtonLink href="#stories" variant="ghost-inverse">
            Explore OCTO
          </ButtonLink>
        </motion.div>

        <motion.div
          {...rise(1.1)}
          className="mt-16 flex flex-col gap-2 border-t border-white/15 pt-5 font-data text-[11px] uppercase tracking-[0.12em] text-white/60 md:flex-row md:items-center md:justify-between"
        >
          <p>{META}</p>
          <p>The governed operating layer for private markets</p>
        </motion.div>
      </Container>
    </section>
  );
}
