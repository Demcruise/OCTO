"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  Bell,
  Calculator,
  ChartNoAxesCombined,
  CheckCircle,
  FileBarChart,
  FileText,
  GitBranch,
  Sparkles,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { Reveal, Section, SectionHeader } from "./primitives";

type NodeDef = { label: string; icon: LucideIcon };
const INPUTS: NodeDef[] = [
  { label: "CRM", icon: Users },
  { label: "Financial models", icon: Calculator },
  { label: "Documents", icon: FileText },
  { label: "Market data", icon: ChartNoAxesCombined },
  { label: "Portfolio reporting", icon: FileBarChart },
  { label: "Deal pipeline", icon: GitBranch },
];
const OUTPUTS: NodeDef[] = [
  { label: "Analysis", icon: ChartNoAxesCombined },
  { label: "Alerts", icon: Bell },
  { label: "Workflows", icon: Workflow },
  { label: "Reporting", icon: FileBarChart },
  { label: "AI", icon: Sparkles },
  { label: "Decisions", icon: CheckCircle },
];

type Hot = { side: "in" | "out" | "core"; i: number } | null;

const IDLE_LINE = "var(--color-line)";
const ICON_IDLE = "var(--octo-text-color-medium)";
const NODE_STROKE = "var(--color-line)";
const NODE_STROKE_ACTIVE = "var(--color-accent-line)";

/**
 * Inputs → OCTO → outputs on a light surface. Each node carries a Lucide icon;
 * hovering brightens the connected paths and related nodes while unrelated
 * elements dim (V4-05).
 */
function Network() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const reduce = useReducedMotion();
  const show = reduce || inView;
  const [hot, setHot] = useState<Hot>(null);
  const W = 1200;
  const H = 500;
  const BOX_W = 264;
  const BOX_H = 56;
  const y = (i: number) => 38 + i * 82;
  const core = { x: 600, y: 248, w: 216, h: 128 };

  const lineState = (side: "in" | "out", i: number) => {
    if (!hot) return { hot: false, dim: false };
    if (hot.side === "core") return { hot: true, dim: false };
    if (hot.side === side && hot.i === i) return { hot: true, dim: false };
    if (hot.side !== side) return { hot: true, dim: false }; // related side brightens
    return { hot: false, dim: true };
  };
  const boxDim = (side: "in" | "out", i: number) => hot && hot.side === side && hot.i !== i;

  const node = (def: NodeDef, side: "in" | "out", i: number) => {
    const l = lineState(side, i);
    const dim = boxDim(side, i);
    const x = side === "in" ? 0.5 : W - BOX_W - 0.5;
    const active = hot?.side === side && hot.i === i;
    const Icon = def.icon;
    return (
      <g
        key={def.label}
        role="button"
        tabIndex={0}
        aria-label={`${side === "in" ? "Input" : "Output"}: ${def.label}`}
        onMouseEnter={() => setHot({ side, i })}
        onMouseLeave={() => setHot(null)}
        onFocus={() => setHot({ side, i })}
        onBlur={() => setHot(null)}
        className="cursor-default outline-none"
        style={{ opacity: dim ? 0.45 : 1, transition: "opacity 200ms" }}
      >
        <rect
          x={x}
          y={y(i) - BOX_H / 2}
          width={BOX_W}
          height={BOX_H}
          fill="var(--octo-body-color)"
          stroke={active || l.hot ? NODE_STROKE_ACTIVE : NODE_STROKE}
        />
        <Icon x={x + 18} y={y(i) - 9} size={18} strokeWidth={1.5} color={active ? "var(--octo-accent)" : ICON_IDLE} aria-hidden />
        <text x={x + 50} y={y(i) + 5} className="font-data text-[13px]" fill="var(--octo-text-color)">
          {def.label}
        </text>
        <motion.path
          d={
            side === "in"
              ? `M${x + BOX_W} ${y(i)} C 380 ${y(i)}, 400 ${core.y}, ${core.x - core.w / 2} ${core.y}`
              : `M${core.x + core.w / 2} ${core.y} C 820 ${core.y}, ${W - BOX_W - 40} ${y(i)}, ${W - BOX_W - 1} ${y(i)}`
          }
          fill="none"
          stroke={l.hot ? "var(--octo-accent)" : IDLE_LINE}
          strokeWidth={l.hot ? 1.5 : 1}
          initial={reduce ? false : { pathLength: 0 }}
          animate={show ? { pathLength: 1 } : undefined}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: (side === "in" ? 0.05 : 0.55) + i * 0.06 }}
          style={{ opacity: l.dim ? 0.4 : 1, transition: "opacity 200ms" }}
        />
      </g>
    );
  };

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Six input systems connect into OCTO, which feeds six decision outputs">
      {INPUTS.map((d, i) => node(d, "in", i))}
      {OUTPUTS.map((d, i) => node(d, "out", i))}
      <motion.g
        initial={reduce ? false : { opacity: 0 }}
        animate={show ? { opacity: 1 } : undefined}
        transition={{ duration: 0.4, delay: 0.45 }}
        onMouseEnter={() => setHot({ side: "core", i: 0 })}
        onMouseLeave={() => setHot(null)}
        className="cursor-default"
      >
        <rect
          x={core.x - core.w / 2}
          y={core.y - core.h / 2}
          width={core.w}
          height={core.h}
          fill="var(--octo-body-color)"
          stroke="var(--octo-accent)"
          strokeWidth={hot?.side === "core" ? 1.5 : 1}
        />
        <text x={core.x} y={core.y - 8} textAnchor="middle" className="text-[26px] font-normal tracking-[0.2em]" fill="var(--octo-text-color)">
          OCTO
        </text>
        <text x={core.x} y={core.y + 22} textAnchor="middle" className="font-data text-[11px] tracking-[0.1em]" fill="var(--octo-accent)">
          GOVERNED CONTEXT
        </text>
      </motion.g>
      <text x="0" y={H - 4} className="font-data text-[11px] tracking-[0.1em]" fill="var(--octo-text-color-light)">
        INPUTS
      </text>
      <text x={W} y={H - 4} textAnchor="end" className="font-data text-[11px] tracking-[0.1em]" fill="var(--octo-text-color-light)">
        OUTPUTS
      </text>
    </svg>
  );
}

/** 04 — FRAGMENTED TRUTH: the problem statement and the connective map. */
export function FragmentedTruth() {
  return (
    <Section id="problem" tone="muted" labelledBy="problem-title">
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
        <ul className="grid grid-cols-1 gap-px border border-line bg-line">
          {INPUTS.map((d) => (
            <li key={d.label} className="flex items-center gap-3 bg-canvas px-4 py-3 font-data text-[12px] text-ink">
              <d.icon aria-hidden className="size-4 text-ink-2" strokeWidth={1.5} />
              {d.label}
            </li>
          ))}
        </ul>
        <p aria-hidden className="py-3 text-center font-data text-ink-3">
          ↓
        </p>
        <div className="border border-accent bg-canvas px-4 py-5 text-center">
          <p className="text-2xl font-normal tracking-[0.2em] text-ink">OCTO</p>
          <p className="mt-1 font-data text-[11px] tracking-[0.1em] text-accent">GOVERNED CONTEXT</p>
        </div>
        <p aria-hidden className="py-3 text-center font-data text-ink-3">
          ↓
        </p>
        <ul className="grid grid-cols-1 gap-px border border-line bg-line">
          {OUTPUTS.map((d) => (
            <li key={d.label} className="flex items-center gap-3 bg-canvas px-4 py-3 font-data text-[12px] text-ink">
              <d.icon aria-hidden className="size-4 text-ink-2" strokeWidth={1.5} />
              {d.label}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
