"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { CTA_HREF } from "@/lib/landing-content";
import { ButtonLink, DUR, EASE, Eyebrow, Reveal, Section } from "./primitives";

type Node = { id: string; label: string; x: number; y: number; path?: boolean };

const NODES: Node[] = [
  { id: "fund", label: "Fund", x: 200, y: 30, path: true },
  { id: "inv", label: "Investment", x: 110, y: 100, path: true },
  { id: "lp", label: "LP", x: 290, y: 100 },
  { id: "co", label: "Company", x: 110, y: 170, path: true },
  { id: "tx", label: "Transaction", x: 110, y: 240, path: true },
  { id: "an", label: "Analytics", x: 200, y: 310, path: true },
  { id: "dec", label: "Decision", x: 200, y: 380, path: true },
];
const EDGES: [string, string, boolean][] = [
  ["fund", "inv", true],
  ["fund", "lp", false],
  ["inv", "co", true],
  ["co", "tx", true],
  ["tx", "an", true],
  ["lp", "an", false],
  ["an", "dec", true],
];
const at = (id: string) => NODES.find((n) => n.id === id)!;

/** Abstract ontology-to-decision graph; replaces the stock-image cursor trail (CTA-001/002, PERF-003). */
function DecisionGraph() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const show = reduce || inView;

  return (
    <svg ref={ref} viewBox="0 0 400 410" className="mx-auto h-auto w-full max-w-[300px] sm:max-w-[420px]" role="img" aria-label="Fund to decision: the path OCTO keeps connected">
      {EDGES.map(([a, b, onPath], i) => {
        const A = at(a);
        const B = at(b);
        return (
          <motion.line
            key={`${a}-${b}`}
            x1={A.x}
            y1={A.y}
            x2={B.x}
            y2={B.y}
            stroke={onPath ? "var(--color-accent)" : "rgb(255 255 255 / 0.2)"}
            strokeWidth="1"
            initial={reduce ? false : { pathLength: 0 }}
            animate={show ? { pathLength: 1 } : undefined}
            transition={{ duration: DUR.medium, ease: EASE, delay: 0.1 + i * 0.1 }}
          />
        );
      })}
      {NODES.map((n, i) => (
        <motion.g
          key={n.id}
          initial={reduce ? false : { opacity: 0 }}
          animate={show ? { opacity: 1 } : undefined}
          transition={{ duration: DUR.medium, delay: i * 0.08 }}
        >
          <rect
            x={n.x - 52}
            y={n.y - 14}
            width="104"
            height="28"
            rx="4"
            fill="var(--color-ink)"
            stroke={n.id === "dec" ? "var(--color-accent)" : n.path ? "rgb(255 255 255 / 0.35)" : "rgb(255 255 255 / 0.18)"}
          />
          <text x={n.x} y={n.y + 4} textAnchor="middle" className="font-data text-[11px]" fill={n.id === "dec" ? "#b9a6ff" : "rgb(255 255 255 / 0.8)"}>
            {n.label}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

export function Cta() {
  return (
    <Section tone="ink" labelledBy="cta-title" className="overflow-hidden">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <Eyebrow inverse>Request a walkthrough</Eyebrow>
          <h2 id="cta-title" className="mt-4 text-h2 font-semibold text-balance">
            Build your firm&apos;s single source of truth.
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/70">
            See how OCTO can consolidate investment data, workflow, analytics, and reporting.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={CTA_HREF} variant="inverse" arrow>
              Request a walkthrough
            </ButtonLink>
            <ButtonLink href="#core" variant="ghost-inverse">
              Explore the architecture
            </ButtonLink>
          </div>
        </Reveal>
        <div className="lg:col-span-5">
          <DecisionGraph />
        </div>
      </div>
    </Section>
  );
}
