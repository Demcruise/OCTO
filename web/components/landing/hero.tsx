"use client";

import { motion, useReducedMotion } from "motion/react";
import { CTA_HREF } from "@/lib/landing-content";
import { ButtonLink, Container, DUR, EASE, Eyebrow } from "./primitives";
import { HeroQuery } from "./hero-query";
import { OctoGraph } from "./octo-graph";

/** First viewport: what OCTO is, who it is for, why it matters, what to do (HERO-001, COPY-002). */
export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: DUR.narrative, ease: EASE, delay },
  });

  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden bg-canvas text-ink">
      {/* Faint ledger grid — structure, not decoration. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_80%)] opacity-45"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-line) 1px, transparent 1px), linear-gradient(to bottom, var(--color-line) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />
      <Container className="relative pb-14 pt-14 md:pb-20 md:pt-20 lg:pt-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <motion.div {...rise(0)}>
              <Eyebrow>Private markets infrastructure</Eyebrow>
            </motion.div>
            <motion.h1 id="hero-title" {...rise(0.06)} className="mt-5 text-display font-semibold text-balance">
              One system.
              <br />
              Every investment decision.
            </motion.h1>
            <motion.p {...rise(0.14)} className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2">
              OCTO connects investment data, ontology, IBOR, intelligence, and governed workflows into one operating system
              for private-markets teams.
            </motion.p>
            <motion.div {...rise(0.22)} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={CTA_HREF} arrow>
                Request access
              </ButtonLink>
              <ButtonLink href="#core" variant="secondary">
                Explore OCTO
              </ButtonLink>
            </motion.div>
            <motion.p {...rise(0.3)} className="mt-8 font-data text-[13px] text-ink-3">
              One database. One system. One process.
            </motion.p>
          </div>

          <motion.div
            className="lg:col-span-6 lg:pl-6"
            initial={reduce ? false : { opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: DUR.narrative, ease: EASE, delay: 0.1 }}
          >
            <HeroQuery />
          </motion.div>
        </div>

        <motion.div
          className="mt-14 hidden border-t border-line pt-6 sm:block md:mt-20"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DUR.narrative, ease: EASE, delay: 0.4 }}
        >
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-medium text-ink">Investment Ontology</p>
            <p className="text-[13px] text-ink-3">Every record connects, from the fund to the report your LPs read.</p>
          </div>
          <OctoGraph />
        </motion.div>
      </Container>
    </section>
  );
}
