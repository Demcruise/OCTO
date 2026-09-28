"use client";

import { motion, useReducedMotion } from "motion/react";
import { Container, DUR, EASE } from "./primitives";

/**
 * Large transition (TRANS-001..003): a single future-facing line at display
 * scale — the pacing break between the product stories and the proof block.
 */
export function LargeTransition() {
  const reduce = useReducedMotion();
  return (
    <section aria-label="Vision" className="border-y border-night-line bg-void py-36 text-white md:py-56">
      <Container>
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ duration: DUR.standard, ease: EASE }}
          className="font-data text-meta uppercase text-fog"
        >
          The future of private markets
        </motion.p>
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ duration: DUR.narrative, ease: EASE, delay: 0.08 }}
          className="mt-10 max-w-6xl text-hero font-medium text-balance"
        >
          There is still so much left to connect.
        </motion.h2>
      </Container>
    </section>
  );
}
