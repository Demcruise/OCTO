"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Motion tokens (MOTION-001). Seconds, for Motion. */
export const DUR = { fast: 0.16, standard: 0.24, medium: 0.4, large: 0.65, reveal: 0.8 } as const;
export const EASE = [0.22, 1, 0.36, 1] as const;
export const STAGGER = 0.06;

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("mx-auto w-full max-w-[1320px] px-4 sm:px-5 md:px-8 xl:px-12", className)}>
      {children}
    </div>
  );
}

type Tone = "canvas" | "subtle" | "ink";

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
        tone === "ink" && "border-ink bg-ink text-white",
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}

export function Eyebrow({ index, children, inverse }: { index?: string; children: React.ReactNode; inverse?: boolean }) {
  return (
    <p className={cn("font-data text-meta uppercase", inverse ? "text-white/60" : "text-ink-3")}>
      {index && <span className="text-accent">{index}</span>}
      {index && <span aria-hidden> — </span>}
      {children}
    </p>
  );
}

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
    <Reveal className={cn("grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12", className)}>
      <div className="lg:col-span-7">
        <Eyebrow index={index} inverse={inverse}>
          {eyebrow}
        </Eyebrow>
        <h2 id={id} className="mt-4 text-h2 font-semibold text-balance">
          {title}
        </h2>
      </div>
      {lead && (
        <p className={cn("text-base leading-relaxed md:text-lg lg:col-span-5", inverse ? "text-white/70" : "text-ink-2")}>
          {lead}
        </p>
      )}
    </Reveal>
  );
}

/** One-time viewport reveal: fade + 16px rise (MOTION-002). Static under reduced motion. */
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
      transition={{ duration: DUR.large, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER } },
};

export function useStaggerChild(): Variants {
  const reduce = useReducedMotion();
  return {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: DUR.medium, ease: EASE } },
  };
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
        "group inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-medium transition-colors duration-150",
        focusRing,
        variant === "primary" && "bg-accent text-white hover:bg-accent-hover",
        variant === "secondary" && "border border-line-strong bg-canvas text-ink hover:border-ink-3 hover:bg-subtle",
        variant === "inverse" && "bg-white text-ink hover:bg-muted focus-visible:ring-offset-ink",
        variant === "ghost-inverse" &&
          "border border-white/25 text-white hover:border-white/50 hover:bg-white/5 focus-visible:ring-offset-ink",
        className,
      )}
    >
      {children}
      {arrow && (
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none"
        />
      )}
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
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm border px-1.5 py-0.5 font-data text-[11px] leading-4",
        pillTones[tone],
        className,
      )}
    >
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

/** Marks illustrative figures so they are never read as customer data (CONTENT-002). */
export function SampleLabel({ children = "Sample data", className }: { children?: React.ReactNode; className?: string }) {
  return (
    <span className={cn("font-data text-[11px] uppercase tracking-[0.08em] text-ink-3", className)}>{children}</span>
  );
}

/** Roving-focus tab state shared by the interactive sections (A11Y-001). */
export function useTabs(count: number) {
  const [active, setActive] = useState(0);
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
