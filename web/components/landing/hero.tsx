"use client";

import { motion, useReducedMotion } from "motion/react";
import { BarChart3, Briefcase, Building2, GitBranch, Gauge, Layers, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { CTA_HREF } from "@/lib/landing-content";
import { ButtonLink, Container, DUR, EASE, Eyebrow } from "./primitives";

const RAIL = [
  { label: "Overview", icon: LayoutGrid },
  { label: "Funds", icon: Layers },
  { label: "Investments", icon: Briefcase },
  { label: "Companies", icon: Building2 },
  { label: "Analytics", icon: BarChart3 },
  { label: "Workflow", icon: GitBranch },
  { label: "Control Panel", icon: Gauge, active: true },
];

const OBJECTS = [
  { name: "US Manufacturing III", type: "Fund", value: "21.8% IRR", state: "Current" },
  { name: "Keller Tooling", type: "Investment", value: "2.80x", state: "Current" },
  { name: "Atlas Components", type: "Company", value: "Covenant 12%", state: "Needs review", warn: true },
  { name: "Acme Robotics", type: "Deal", value: "IC 2 of 3", state: "Pending approval", warn: true },
];

const QUEUE = [
  { item: "Q3 variance explanation", tag: "Drafted by AI" },
  { item: "FX rate mismatch · Harbor Logistics", tag: "Exception" },
  { item: "Q3 LP report · Growth Fund II", tag: "Approval" },
];

const STATUS = [
  ["Investment Ontology", "Connected"],
  ["IBOR", "Current"],
  ["Data lineage", "Verified"],
  ["AI governance", "Enabled"],
] as const;

/** Dark product environment: control panel, objects, metrics, workflow (PAL-008). */
function HeroEnvironment() {
  return (
    <div className="overflow-hidden rounded-sm border border-night-line bg-night text-white">
      <div className="flex items-center justify-between border-b border-night-line px-4 py-2.5">
        <p className="font-data text-[11px] text-fog">octo / control-panel</p>
        <p className="font-data text-[10px] uppercase tracking-[0.1em] text-fog">Demo environment</p>
      </div>
      <div className="flex">
        <nav aria-label="Product navigation (preview)" className="hidden w-44 shrink-0 border-r border-night-line py-3 sm:block">
          <ul>
            {RAIL.map(({ label, icon: Icon, active }) => (
              <li
                key={label}
                aria-current={active ? "page" : undefined}
                className={cn("flex items-center gap-2.5 border-l-2 px-3.5 py-1.5 text-[12px]", active ? "border-accent-light bg-white/5 text-white" : "border-transparent text-fog")}
              >
                <Icon aria-hidden className="size-3.5" />
                {label}
              </li>
            ))}
          </ul>
        </nav>
        <div className="min-w-0 flex-1">
          <dl className="grid grid-cols-2 border-b border-night-line md:grid-cols-4">
            {[
              ["Invested", "$1.82B"],
              ["Gross IRR", "18.4%"],
              ["TVPI", "2.31x"],
              ["Open items", "15"],
            ].map(([k, v], i) => (
              <div key={k} className={cn("px-4 py-3", i > 0 && "md:border-l md:border-night-line", i % 2 === 1 && "border-l border-night-line")}>
                <dt className="font-data text-[10px] uppercase tracking-[0.08em] text-fog">{k}</dt>
                <dd className="mt-1 text-xl font-medium tabular-nums tracking-tight">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="grid grid-cols-1 md:grid-cols-5">
            <div className="border-b border-night-line md:col-span-3 md:border-b-0 md:border-r">
              <p className="px-4 pt-3 font-data text-[10px] uppercase tracking-[0.08em] text-fog">Objects</p>
              <ul className="mt-1 divide-y divide-night-line">
                {OBJECTS.map((o) => (
                  <li key={o.name} className="grid grid-cols-[1fr_auto] items-center gap-x-3 px-4 py-2">
                    <span className="min-w-0 truncate text-[13px]">{o.name}</span>
                    <span className="font-data text-[12px] tabular-nums text-white/80">{o.value}</span>
                    <span className="font-data text-[10px] uppercase tracking-[0.06em] text-fog">{o.type}</span>
                    <span className={cn("font-data text-[10px]", o.warn ? "text-warn-light" : "text-ok-light")}>{o.state}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-2">
              <p className="px-4 pt-3 font-data text-[10px] uppercase tracking-[0.08em] text-fog">Workflow</p>
              <ul className="mt-1 divide-y divide-night-line">
                {QUEUE.map((q) => (
                  <li key={q.item} className="px-4 py-2">
                    <p className="truncate text-[13px]">{q.item}</p>
                    <p className="font-data text-[10px] text-accent-light">{q.tag}</p>
                  </li>
                ))}
              </ul>
              <svg aria-hidden viewBox="0 0 200 48" preserveAspectRatio="none" className="mx-4 mb-3 mt-2 h-10 w-[calc(100%-2rem)]">
                <polyline points="0,40 28,36 57,33 85,30 114,24 142,20 171,14 200,8" fill="none" stroke="var(--color-accent-light)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Hero + system status strip (PAL-008, PAL-010). */
export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: DUR.narrative, ease: EASE, delay },
  });

  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden bg-void text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-night-line) 1px, transparent 1px), linear-gradient(to bottom, var(--color-night-line) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
      />
      <Container className="relative pb-16 pt-16 md:pb-24 md:pt-24">
        <motion.div {...rise(0)}>
          <Eyebrow inverse>Private markets infrastructure</Eyebrow>
        </motion.div>
        <motion.h1 id="hero-title" {...rise(0.06)} className="mt-8 max-w-[14ch] text-display font-medium lg:max-w-none">
          One system.
          <br className="hidden lg:block" /> Every investment decision.
        </motion.h1>
        <div className="mt-12 grid grid-cols-1 gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4 lg:self-end">
            <motion.p {...rise(0.14)} className="max-w-md text-lg leading-relaxed text-fog">
              OCTO connects investment data, context, intelligence, and governed workflows into one operational system for private markets.
            </motion.p>
            <motion.div {...rise(0.22)} className="mt-10 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <ButtonLink href={CTA_HREF} variant="inverse" arrow>
                Request access
              </ButtonLink>
              <ButtonLink href="#platform" variant="ghost-inverse">
                Explore the platform
              </ButtonLink>
            </motion.div>
          </div>
          <motion.div
            className="min-w-0 lg:col-span-8"
            initial={reduce ? false : { opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: DUR.narrative, ease: EASE, delay: 0.12 }}
          >
            <HeroEnvironment />
          </motion.div>
        </div>
      </Container>

      <div className="relative border-t border-night-line">
        <Container>
          <dl aria-label="System status (demo environment)" className="grid grid-cols-2 lg:grid-cols-4">
            {STATUS.map(([k, v], i) => (
              <div key={k} className={cn("flex items-center justify-between gap-3 py-4 pr-4", i % 2 === 1 && "border-l border-night-line pl-4", i >= 2 && "border-t border-night-line lg:border-t-0", i === 2 && "lg:border-l lg:pl-4")}>
                <dt className="font-data text-[11px] uppercase tracking-[0.1em] text-fog">{k}</dt>
                <dd className="flex items-center gap-2 font-data text-[11px] uppercase tracking-[0.1em] text-white">
                  <span aria-hidden className="size-1.5 rounded-full bg-ok-light" />
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </div>
    </section>
  );
}
