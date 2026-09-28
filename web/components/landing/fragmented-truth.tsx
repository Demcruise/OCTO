"use client";

import { useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { DUR, EASE, Reveal, Section, SectionHeader } from "./primitives";

const INPUTS = ["CRM", "Financial models", "Documents", "Market data", "Portfolio reporting", "Deal pipeline"];
const OUTPUTS = ["Analysis", "Alerts", "Workflows", "Reporting", "AI", "Decisions"];

type Hot = { side: "in" | "out" | "core"; i: number } | null;

/**
 * Inputs → OCTO → outputs on a light surface (PAL-011, light theme per the
 * 8-section master backlog). Hovering a node brightens its paths and dims
 * unrelated elements; the core brightens every connection.
 */
function Network() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const reduce = useReducedMotion();
  const show = reduce || inView;
  const [hot, setHot] = useState<Hot>(null);
  const W = 1200;
  const H = 420;
  const y = (i: number) => 45 + i * 66;
  const core = { x: 600, y: 210, w: 200, h: 120 };

  const lineState = (side: "in" | "out", i: number) => {
    if (!hot) return { stroke: "var(--color-line-strong)", dim: false };
    if (hot.side === "core") return { stroke: "var(--color-accent)", dim: false };
    if (hot.side === side && hot.i === i) return { stroke: "var(--color-accent)", dim: false };
    if (hot.side === "in" && side === "out") return { stroke: "var(--color-accent)", dim: false }; // related outputs brighten
    if (hot.side === "out" && side === "in") return { stroke: "var(--color-accent)", dim: false };
    return { stroke: "var(--color-line-strong)", dim: true };
  };
  const boxState = (side: "in" | "out", i: number) => {
    if (!hot) return "rest";
    if (hot.side === "core" || (hot.side === side && hot.i === i)) return "hot";
    if (hot.side !== side) return "hot"; // related side stays bright
    return "dim";
  };

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label="Six input systems connect into OCTO, which feeds six decision outputs"
    >
      {INPUTS.map((s, i) => {
        const l = lineState("in", i);
        const box = boxState("in", i);
        return (
          <g
            key={s}
            onMouseEnter={() => setHot({ side: "in", i })}
            onMouseLeave={() => setHot(null)}
            className="cursor-default"
            style={{ opacity: box === "dim" ? 0.35 : 1, transition: "opacity 200ms" }}
          >
            <rect
              x="0.5"
              y={y(i) - 18}
              width="220"
              height="36"
              fill="var(--color-canvas)"
              stroke={box === "hot" ? "var(--color-accent)" : "var(--color-line-strong)"}
            />
            <text x="16" y={y(i) + 4} className="font-data text-[13px]" fill="var(--color-ink)">
              {s}
            </text>
            <motion.path
              d={`M221 ${y(i)} C 380 ${y(i)}, 400 ${core.y}, ${core.x - core.w / 2} ${core.y}`}
              fill="none"
              stroke={l.stroke}
              strokeWidth={l.dim ? 1 : 1.5}
              initial={reduce ? false : { pathLength: 0 }}
              animate={show ? { pathLength: 1 } : undefined}
              transition={{ duration: DUR.narrative, ease: EASE, delay: 0.05 + i * 0.06 }}
              style={{ opacity: l.dim ? 0.35 : 1, transition: "opacity 200ms" }}
            />
          </g>
        );
      })}
      {OUTPUTS.map((s, i) => {
        const l = lineState("out", i);
        const box = boxState("out", i);
        return (
          <g
            key={s}
            onMouseEnter={() => setHot({ side: "out", i })}
            onMouseLeave={() => setHot(null)}
            className="cursor-default"
            style={{ opacity: box === "dim" ? 0.35 : 1, transition: "opacity 200ms" }}
          >
            <rect
              x={W - 220.5}
              y={y(i) - 18}
              width="220"
              height="36"
              fill="var(--color-canvas)"
              stroke={box === "hot" ? "var(--color-accent)" : "var(--color-line-strong)"}
            />
            <text x={W - 204} y={y(i) + 4} className="font-data text-[13px]" fill="var(--color-ink)">
              {s}
            </text>
            <motion.path
              d={`M${core.x + core.w / 2} ${core.y} C 800 ${core.y}, 820 ${y(i)}, ${W - 221} ${y(i)}`}
              fill="none"
              stroke={l.stroke}
              strokeWidth={l.dim ? 1 : 1.5}
              initial={reduce ? false : { pathLength: 0 }}
              animate={show ? { pathLength: 1 } : undefined}
              transition={{ duration: DUR.narrative, ease: EASE, delay: 0.55 + i * 0.06 }}
              style={{ opacity: l.dim ? 0.35 : 1, transition: "opacity 200ms" }}
            />
          </g>
        );
      })}
      <motion.g
        initial={reduce ? false : { opacity: 0 }}
        animate={show ? { opacity: 1 } : undefined}
        transition={{ duration: DUR.complex, delay: 0.45 }}
        onMouseEnter={() => setHot({ side: "core", i: 0 })}
        onMouseLeave={() => setHot(null)}
        className="cursor-default"
      >
        <rect
          x={core.x - core.w / 2}
          y={core.y - core.h / 2}
          width={core.w}
          height={core.h}
          fill="var(--color-canvas)"
          stroke="var(--color-accent)"
          strokeWidth={hot?.side === "core" ? 1.5 : 1}
        />
        <text x={core.x} y={core.y - 8} textAnchor="middle" className="text-[26px] font-semibold tracking-[0.2em]" fill="var(--color-ink)">
          OCTO
        </text>
        <text x={core.x} y={core.y + 22} textAnchor="middle" className="font-data text-[11px] tracking-[0.1em]" fill="var(--color-accent)">
          GOVERNED CONTEXT
        </text>
      </motion.g>
      <text x="0" y={H - 4} className="font-data text-[11px] tracking-[0.1em]" fill="var(--color-ink-3)">
        INPUTS
      </text>
      <text x={W} y={H - 4} textAnchor="end" className="font-data text-[11px] tracking-[0.1em]" fill="var(--color-ink-3)">
        OUTPUTS
      </text>
    </svg>
  );
}

/** 04 — FRAGMENTED TRUTH: the problem statement and the connective diagram. */
export function FragmentedTruth() {
  return (
    <Section id="problem" tone="subtle" labelledBy="problem-title">
      <SectionHeader
        id="problem-title"
        index="04"
        eyebrow="Fragmented truth"
        title="Private markets still run on fragmented information."
        lead="CRM, models, documents, market data, and reporting each hold part of the record. OCTO connects them once, so every output starts from the same facts."
      />
      <Reveal className="mt-16 hidden md:block">
        <Network />
      </Reveal>
      {/* Phones: the same story as a vertical flow. */}
      <Reveal className="mt-12 md:hidden">
        <ul className="grid grid-cols-2 gap-px border border-line bg-line">
          {INPUTS.map((s) => (
            <li key={s} className="bg-canvas px-3 py-2.5 font-data text-[12px] text-ink">
              {s}
            </li>
          ))}
        </ul>
        <p aria-hidden className="py-3 text-center font-data text-ink-3">
          ↓
        </p>
        <div className="border border-accent bg-canvas px-4 py-5 text-center">
          <p className="text-2xl font-semibold tracking-[0.2em] text-ink">OCTO</p>
          <p className="mt-1 font-data text-[11px] tracking-[0.1em] text-accent">GOVERNED CONTEXT</p>
        </div>
        <p aria-hidden className="py-3 text-center font-data text-ink-3">
          ↓
        </p>
        <ul className="grid grid-cols-2 gap-px border border-line bg-line">
          {OUTPUTS.map((s) => (
            <li key={s} className="bg-canvas px-3 py-2.5 font-data text-[12px] text-ink">
              {s}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
