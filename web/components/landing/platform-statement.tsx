"use client";

import { motion, useReducedMotion } from "motion/react";
import { Container, DUR, EASE } from "./primitives";

/**
 * The OCTO System statement (SYS-000): one quiet, enormous claim before the
 * system index. Copy only — no cards, no diagram.
 */
export function PlatformStatement() {
  const reduce = useReducedMotion();
  const reveal = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-15% 0px" },
    transition: { duration: DUR.narrative, ease: EASE, delay },
  });

  return (
    <section id="system" aria-label="The OCTO system" className="bg-void py-28 text-white md:py-40">
      <Container>
        <motion.p {...reveal(0)} className="font-data text-meta uppercase text-fog">
          The OCTO system
        </motion.p>
        <motion.h2 {...reveal(0.08)} className="mt-8 max-w-5xl text-display font-medium text-balance">
          OCTO connects investment data, context, intelligence, and workflow in one governed system.
        </motion.h2>
      </Container>
    </section>
  );
}
