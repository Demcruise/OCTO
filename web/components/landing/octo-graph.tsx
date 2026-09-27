"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const NODES = [
  { type: "Fund", example: "Growth Fund II" },
  { type: "Investment", example: "Series B · 2023" },
  { type: "Portfolio company", example: "Atlas Components" },
  { type: "Transaction", example: "Capital call · $4.2M" },
  { type: "Metric", example: "EBITDA · Q3" },
  { type: "Report", example: "LP quarterly report" },
];
const EDGES = ["invests via", "in", "records", "moves", "feeds"];

/**
 * Ontology path from fund to report (HERO-003). The active node walks the path
 * while visible; reduced motion shows the full path statically.
 */
export function OctoGraph() {
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { margin: "-40px" });
  const reduce = useReducedMotion();
  const [active, setActive] = useState(NODES.length - 1);

  useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % NODES.length), 1600);
    return () => window.clearInterval(id);
  }, [inView, reduce]);

  const at = reduce ? NODES.length - 1 : active;

  return (
    <ol
      ref={ref}
      aria-label="Investment Ontology: fund to report"
      className="-mx-4 flex snap-x items-center overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0"
    >
      {NODES.map((node, i) => (
        <Fragment key={node.type}>
          {i > 0 && (
            <li aria-hidden className="relative flex min-w-12 flex-1 flex-col items-center">
              <span className="mb-1 whitespace-nowrap font-data text-[10px] text-ink-3">{EDGES[i - 1]}</span>
              <span className={cn("h-px w-full transition-colors duration-300", i <= at ? "bg-accent" : "bg-line-strong")} />
            </li>
          )}
          <li
            className={cn(
              "shrink-0 snap-start rounded-md border bg-canvas px-3 py-2 transition-colors duration-300",
              i === at ? "border-accent bg-accent-soft" : i < at ? "border-accent-line" : "border-line",
            )}
          >
            <p className={cn("font-data text-[10px] uppercase tracking-[0.08em]", i <= at ? "text-accent" : "text-ink-3")}>{node.type}</p>
            <p className="mt-0.5 whitespace-nowrap text-[13px] text-ink">{node.example}</p>
          </li>
        </Fragment>
      ))}
    </ol>
  );
}
