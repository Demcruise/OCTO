"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowRight, BarChart3, FileText, Filter, GitBranch, Lightbulb, Scale, Sheet, Users, Workflow, FileBarChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { FRAGMENTS, INTEGRATIONS, TECHNOLOGY } from "./content";
import { useAnimeScope, onceVisible } from "./motion/anime";
import { prepareNetwork, revealOnView, revealTimeline } from "./motion/timelines";
import { Container, Eyebrow, Lead, Section, TwoTone } from "./ui";

const ICONS: Record<string, React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
  users: Users,
  sheet: Sheet,
  file: FileText,
  chart: BarChart3,
  report: FileBarChart,
  funnel: Filter,
  analysis: Lightbulb,
  workflow: Workflow,
  decision: Scale,
};

/* Network geometry in % of the canvas; the SVG shares the 0–100 space. */
const CORE = { x: 50, y: 50 };
const IN_X = 13;
const OUT_X = 87;
const inY = (i: number, n: number) => 10 + (80 * i) / (n - 1);
const outY = (i: number, n: number) => 25 + (50 * i) / (n - 1);
const path = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const mx = (a.x + b.x) / 2;
  return `M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
};

/**
 * 04 FRAGMENTED TRUTH (megaplan §06, §10, §11, §19): the problem statement,
 * an icon-bearing network where six sources converge on OCTO's governed
 * context and fan out to analysis, workflow and decision, plus the technology
 * story and neutral integration categories as modules.
 */
export function FragmentedTruth() {
  const root = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState<string | null>(null);

  useAnimeScope(root, ({ reduced }) => {
    const el = root.current!;
    const net = el.querySelector<HTMLElement>("[data-network]");
    const play = net ? prepareNetwork(net, reduced) : () => undefined;
    const offNet = net ? onceVisible(net, play, { threshold: 0.3 }) : () => undefined;
    const groups = Array.from(el.querySelectorAll<HTMLElement>("[data-reveal-group]"));
    const offs = groups.map((g) => revealOnView(g, reduced, () => revealTimeline(g, reduced), g, "[data-anim='reveal']"));
    return () => {
      offNet();
      offs.forEach((o) => o());
    };
  });

  const n = FRAGMENTS.inputs.length;
  const m = FRAGMENTS.outputs.length;
  const lit = (id: string) => focus === null || focus === id || focus === "core";

  return (
    <Section id="fragmented-truth" label="Fragmented truth" className="bg-octo-surface">
      <div ref={root}>
        <Container>
          <div data-reveal-group className="grid grid-cols-4 gap-x-5 gap-y-8 md:grid-cols-12 md:gap-x-[30px]">
            <div className="col-span-4 md:col-span-6">
              <Eyebrow anim="reveal">The problem</Eyebrow>
              <div data-anim="reveal">
                <TwoTone first={FRAGMENTS.line1} second={FRAGMENTS.line2} className="mt-4" />
              </div>
            </div>
            <div className="col-span-4 md:col-span-5 md:col-start-8 md:self-end">
              <ul className="font-o-serif text-o-lead text-octo-text-muted">
                {FRAGMENTS.list.map((f) => (
                  <li key={f} data-anim="reveal">
                    {f}
                  </li>
                ))}
              </ul>
              <p data-anim="reveal" className="mt-4 font-o-display text-[24px] tracking-[-0.02em] text-octo-ink">
                {FRAGMENTS.closing}
              </p>
            </div>
          </div>

          {/* Network (desktop / tablet) */}
          <div data-network className="relative mt-14 hidden aspect-[16/8] rounded-2xl border border-octo-border bg-white md:mt-20 md:block" role="img" aria-label={`${FRAGMENTS.inputs.map((i) => i.label).join(", ")} connect into OCTO governed context, which feeds ${FRAGMENTS.outputs.map((o) => o.label).join(", ")}`}>
            <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
              {FRAGMENTS.inputs.map((node, i) => (
                <path key={node.id} data-net-path="in" d={path({ x: IN_X + 7, y: inY(i, n) }, { x: CORE.x - 8, y: CORE.y })} fill="none" stroke={focus === node.id ? "var(--color-octo-accent)" : "var(--color-octo-ink)"} strokeOpacity={lit(node.id) ? (focus === node.id ? 1 : 0.35) : 0.08} strokeWidth={focus === node.id ? 2 : 1.25} vectorEffect="non-scaling-stroke" className="transition-[stroke-opacity,stroke] duration-200" />
              ))}
              {FRAGMENTS.outputs.map((node, i) => (
                <path key={node.id} data-net-path="out" d={path({ x: CORE.x + 8, y: CORE.y }, { x: OUT_X - 7, y: outY(i, m) })} fill="none" stroke={focus && focus !== node.id && focus !== "core" && FRAGMENTS.outputs.some((o) => o.id === focus) ? "var(--color-octo-ink)" : "var(--color-octo-accent)"} strokeOpacity={focus && FRAGMENTS.outputs.some((o) => o.id === focus) && focus !== node.id ? 0.1 : 0.75} strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="transition-[stroke-opacity] duration-200" />
              ))}
            </svg>

            {FRAGMENTS.inputs.map((node, i) => (
              <NetNode key={node.id} kind="input" label={node.label} icon={node.icon} x={IN_X} y={inY(i, n)} dim={!lit(node.id)} active={focus === node.id} onFocus={() => setFocus(node.id)} onBlur={() => setFocus(null)} />
            ))}

            <div data-net="core" style={{ left: `${CORE.x}%`, top: `${CORE.y}%` }} className="absolute -translate-x-1/2 -translate-y-1/2" onMouseEnter={() => setFocus("core")} onMouseLeave={() => setFocus(null)}>
              <span data-net="pulse" aria-hidden className="absolute inset-0 rounded-xl border border-octo-accent" />
              <span data-net="pulse" aria-hidden className="absolute inset-0 rounded-xl border border-octo-accent" />
              <div className="relative flex flex-col items-center rounded-xl bg-octo-ink px-7 py-4 text-center text-white shadow-[0_16px_40px_rgb(30_33_36/0.22)]">
                <GitBranch aria-hidden className="size-4 text-white/60" />
                <span className="mt-1.5 font-o-display text-[26px] tracking-[0.18em]">OCTO</span>
                <span className="font-data text-o-label uppercase text-white/70">Governed context</span>
              </div>
            </div>

            {FRAGMENTS.outputs.map((node, i) => (
              <NetNode key={node.id} kind="output" label={node.label} icon={node.icon} x={OUT_X} y={outY(i, m)} dim={focus !== null && focus !== "core" && FRAGMENTS.outputs.some((o) => o.id === focus) && focus !== node.id} active={focus === node.id} onFocus={() => setFocus(node.id)} onBlur={() => setFocus(null)} />
            ))}
          </div>

          {/* Network (mobile): the same story as a vertical flow */}
          <div data-reveal-group className="mt-12 md:hidden">
            <ul className="grid grid-cols-2 gap-2">
              {FRAGMENTS.inputs.map((node) => (
                <li key={node.id} data-anim="reveal">
                  <NodeBody label={node.label} icon={node.icon} />
                </li>
              ))}
            </ul>
            <ArrowDown aria-hidden className="mx-auto my-3 size-5 text-octo-text-light" />
            <div data-anim="reveal" className="rounded-xl bg-octo-ink px-5 py-4 text-center text-white">
              <p className="font-o-display text-[24px] tracking-[0.18em]">OCTO</p>
              <p className="font-data text-o-label uppercase text-white/70">Governed context</p>
            </div>
            <ArrowDown aria-hidden className="mx-auto my-3 size-5 text-octo-text-light" />
            <ul className="grid grid-cols-3 gap-2">
              {FRAGMENTS.outputs.map((node) => (
                <li key={node.id} data-anim="reveal">
                  <NodeBody label={node.label} icon={node.icon} />
                </li>
              ))}
            </ul>
          </div>

          {/* Technology story */}
          <div data-reveal-group className="mt-20 md:mt-32">
            <div className="grid grid-cols-4 gap-x-5 md:grid-cols-12 md:gap-x-[30px]">
              <div className="col-span-4 md:col-span-6">
                <Eyebrow anim="reveal">Technology</Eyebrow>
                <div data-anim="reveal">
                  <TwoTone first={TECHNOLOGY.line1} second={TECHNOLOGY.line2} className="mt-4" />
                </div>
              </div>
              <Lead anim="reveal" className="col-span-4 mt-6 self-end md:col-span-5 md:col-start-8 md:mt-0">
                Sources stay where they are. OCTO models them once, derives the record, and every layer above reads from it.
              </Lead>
            </div>
            <ol className="mt-10 grid grid-cols-1 gap-3 md:mt-14 lg:grid-cols-5">
              <li data-anim="reveal" className="rounded-xl border border-octo-border bg-white p-5">
                <p className="font-data text-o-label uppercase text-octo-text-light">Your sources</p>
                <ul className="mt-3 flex flex-wrap gap-1.5 lg:flex-col">
                  {TECHNOLOGY.sources.map((s) => (
                    <li key={s} className="rounded-md bg-octo-muted px-2.5 py-1 text-[13px] text-octo-ink">
                      {s}
                    </li>
                  ))}
                </ul>
              </li>
              {TECHNOLOGY.layers.map((l, i) => (
                <li key={l.name} data-anim="reveal" className="relative flex flex-col rounded-xl border border-octo-border bg-white p-5">
                  <ArrowRight aria-hidden className="absolute -left-3 top-1/2 hidden size-4 -translate-y-1/2 rounded-full bg-octo-surface text-octo-text-light lg:block" />
                  <span className="font-data text-o-label text-octo-text-light">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-6 font-o-display text-[22px] tracking-[-0.02em] text-octo-ink lg:mt-auto">{l.name}</span>
                  <span className="mt-1 font-o-serif text-[15px] text-octo-text-muted">{l.body}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Integration categories */}
          <div data-reveal-group className="mt-14 border-t border-octo-border pt-8 md:mt-20">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="md:max-w-sm">
                <Eyebrow anim="reveal">Connects to</Eyebrow>
                <p data-anim="reveal" className="mt-3 text-[13px] text-octo-text-muted">
                  Representative categories. Specific connectors are confirmed during onboarding.
                </p>
              </div>
              <ul className="flex flex-wrap gap-2 md:max-w-[760px] md:justify-end">
                {INTEGRATIONS.map((c) => (
                  <li key={c} data-anim="reveal" className="rounded-md border border-octo-border bg-white px-3.5 py-2 text-[14px] text-octo-ink">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </div>
    </Section>
  );
}

function NodeBody({ label, icon }: { label: string; icon: string }) {
  const Icon = ICONS[icon] ?? FileText;
  return (
    <span className="flex items-center gap-2.5 rounded-lg border border-octo-border bg-white px-3 py-2.5 text-[14px] text-octo-ink">
      <Icon aria-hidden className="size-4 shrink-0 text-octo-text-muted" />
      {label}
    </span>
  );
}

function NetNode({ kind, label, icon, x, y, dim, active, onFocus, onBlur }: { kind: "input" | "output"; label: string; icon: string; x: number; y: number; dim: boolean; active: boolean; onFocus: () => void; onBlur: () => void }) {
  const Icon = ICONS[icon] ?? FileText;
  return (
    <span
      data-net={kind}
      tabIndex={0}
      onMouseEnter={onFocus}
      onMouseLeave={onBlur}
      onFocus={onFocus}
      onBlur={onBlur}
      style={{ left: `${x}%`, top: `${y}%` }}
      className={cn(
        "absolute flex w-[13%] min-w-[128px] -translate-x-1/2 -translate-y-1/2 cursor-default items-center gap-2.5 rounded-lg border bg-white px-3 py-2.5 text-[14px] text-octo-ink transition-[border-color,opacity,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-octo-accent",
        active ? "border-octo-accent shadow-[0_8px_24px_rgb(109_69_255/0.16)]" : "border-octo-border",
        // Dimming uses the children: the node's own opacity belongs to the entrance animation.
        dim && "border-octo-hairline [&>*]:opacity-35",
      )}
    >
      <Icon aria-hidden className={cn("size-4 shrink-0", active ? "text-octo-accent" : "text-octo-text-muted")} />
      <span className="truncate">{label}</span>
    </span>
  );
}
