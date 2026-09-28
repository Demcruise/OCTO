"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Motion tokens (PAL-034): micro 150–250ms, UI 300–500ms, structural 500–900ms, one ease. Seconds, for Motion. */
export const DUR = { fast: 0.16, standard: 0.24, complex: 0.4, narrative: 0.7 } as const;
export const EASE = [0.22, 1, 0.36, 1] as const;

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";

/** Wide editorial container (PAL-006): 1520px max, 16 → 64px gutters. */
export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1520px] px-4 sm:px-5 md:px-10 xl:px-16", className)}>{children}</div>;
}

export type Tone = "canvas" | "subtle" | "muted" | "night" | "void";
export const isDark = (t: Tone) => t === "night" || t === "void";

export function Section({
  id,
  tone = "canvas",
  className,
  children,
  labelledBy,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "border-t py-20 md:py-28",
        tone === "canvas" && "border-line bg-canvas text-ink",
        tone === "subtle" && "border-line bg-subtle text-ink",
        tone === "muted" && "border-line bg-muted text-ink",
        tone === "night" && "border-night-line bg-night text-white",
        tone === "void" && "border-night-line bg-void text-white",
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}

/** Technical section label (PAL-045 · 1): index, rule, name. */
export function Eyebrow({ index, children, inverse }: { index?: string; children: React.ReactNode; inverse?: boolean }) {
  return (
    <p className={cn("flex items-center gap-3 font-data text-meta uppercase", inverse ? "text-fog" : "text-ink-3")}>
      {index && <span className={inverse ? "text-accent-light" : "text-accent"}>{index}</span>}
      {index && <span aria-hidden className={cn("h-px w-8", inverse ? "bg-night-line" : "bg-line-strong")} />}
      <span>{children}</span>
    </p>
  );
}

/** Label → headline → short copy (PAL-045). Asymmetric: headline spans wide, copy sits right. */
export function SectionHeader({
  id,
  index,
  eyebrow,
  title,
  lead,
  inverse,
  className,
}: {
  id: string;
  index?: string;
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  inverse?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={cn("grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-12", className)}>
      <div className="lg:col-span-8">
        <Eyebrow index={index} inverse={inverse}>
          {eyebrow}
        </Eyebrow>
        <h2 id={id} className="mt-6 text-h2 font-normal text-balance">
          {title}
        </h2>
      </div>
      {lead && (
        <p className={cn("text-[17px] leading-relaxed md:text-lg lg:col-span-4", inverse ? "text-fog" : "text-ink-2")}>{lead}</p>
      )}
    </Reveal>
  );
}

/** One-time viewport reveal: fade + 16px rise. Static under reduced motion. */
export function Reveal({
  className,
  children,
  delay = 0,
  as = "div",
}: {
  className?: string;
  children: React.ReactNode;
  delay?: number;
  as?: "div" | "li";
}) {
  const reduce = useReducedMotion();
  const Comp = as === "li" ? motion.li : motion.div;
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: DUR.narrative, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  arrow,
  className,
  children,
}: {
  href: string;
  variant?: "primary" | "secondary" | "inverse" | "ghost-inverse";
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={cn(
        "group inline-flex h-11 items-center justify-center gap-2 rounded-sm px-5 text-sm font-medium transition-colors duration-150",
        focusRing,
        variant === "primary" && "bg-accent text-white hover:bg-accent-hover",
        variant === "secondary" && "border border-line-strong bg-canvas text-ink hover:border-ink-3",
        variant === "inverse" && "bg-white text-void hover:bg-subtle focus-visible:ring-offset-void",
        variant === "ghost-inverse" && "border border-night-line text-white hover:border-white/40 hover:bg-white/5 focus-visible:ring-offset-void",
        className,
      )}
    >
      {children}
      {arrow && <ArrowRight aria-hidden className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" />}
    </a>
  );
}

export type PillTone = "neutral" | "accent" | "ok" | "warn" | "danger" | "info";

const pillTones: Record<PillTone, string> = {
  neutral: "border-line bg-subtle text-ink-2",
  accent: "border-accent-line bg-accent-soft text-accent",
  ok: "border-ok/20 bg-ok/8 text-ok",
  warn: "border-warn/25 bg-warn/8 text-warn",
  danger: "border-danger/20 bg-danger/8 text-danger",
  info: "border-info/20 bg-info/8 text-info",
};

export function Pill({ tone = "neutral", dot, className, children }: { tone?: PillTone; dot?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm border px-1.5 py-0.5 font-data text-[11px] leading-4", pillTones[tone], className)}>
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

/** Marks illustrative figures so they are never read as customer data (PAL-041). */
export function SampleLabel({ children = "Sample data", className, inverse }: { children?: React.ReactNode; className?: string; inverse?: boolean }) {
  return <span className={cn("font-data text-[11px] uppercase tracking-[0.08em]", inverse ? "text-fog" : "text-ink-3", className)}>{children}</span>;
}

/** Roving-focus tab state shared by the interactive sections. */
export function useTabs(count: number, initial = 0) {
  const [active, setActive] = useState(initial);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowRight: active + 1, ArrowDown: active + 1, ArrowLeft: active - 1, ArrowUp: active - 1, Home: 0, End: count - 1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const i = (keys[e.key] + count) % count;
    setActive(i);
    refs.current[i]?.focus();
  };
  const tabProps = (i: number) => ({
    ref: (el: HTMLButtonElement | null) => {
      refs.current[i] = el;
    },
    role: "tab" as const,
    "aria-selected": i === active,
    tabIndex: i === active ? 0 : -1,
    onClick: () => setActive(i),
  });
  return { active, setActive, onKeyDown, tabProps };
}
