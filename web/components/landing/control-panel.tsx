"use client";

import { useState } from "react";
import { BarChart3, Briefcase, Building2, GitBranch, Gauge, Layers, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { Pill, type PillTone, Reveal, SampleLabel, Section, SectionHeader, focusRing } from "./primitives";

const RAIL = [
  { label: "Overview", icon: LayoutGrid },
  { label: "Funds", icon: Layers },
  { label: "Investments", icon: Briefcase },
  { label: "Companies", icon: Building2 },
  { label: "Analytics", icon: BarChart3 },
  { label: "Workflow", icon: GitBranch },
  { label: "Control Panel", icon: Gauge },
];

type Row = { text: string; object: string; tone: PillTone; state: string; mine: boolean };
type Module = { title: string; rows: Row[] };

const MODULES: Module[] = [
  {
    title: "Alerts",
    rows: [
      { text: "Covenant headroom < 15%", object: "Atlas Components", tone: "warn", state: "Open", mine: true },
      { text: "Valuation variance > 5%", object: "Growth Fund II", tone: "accent", state: "In review", mine: false },
      { text: "Market comps stale · 3 days", object: "US Manufacturing III", tone: "warn", state: "Open", mine: true },
    ],
  },
  {
    title: "Drafts",
    rows: [
      { text: "Q3 variance explanation", object: "Harbor Logistics", tone: "accent", state: "Drafted by AI", mine: true },
      { text: "Q3 LP report", object: "Growth Fund II", tone: "accent", state: "Drafted by AI", mine: false },
    ],
  },
  {
    title: "Tasks",
    rows: [
      { text: "Request Q3 management accounts", object: "FN NYC", tone: "info", state: "Due 3 Oct", mine: true },
      { text: "Chase EBITDA bridge", object: "Acme Robotics", tone: "info", state: "Due 4 Oct", mine: false },
      { text: "Refresh market comps", object: "US Manufacturing III", tone: "danger", state: "Overdue", mine: true },
    ],
  },
  {
    title: "Exceptions",
    rows: [
      { text: "FX rate mismatch", object: "Harbor Logistics", tone: "warn", state: "Assigned", mine: true },
      { text: "Diligence evidence gap", object: "Acme Robotics", tone: "warn", state: "Open", mine: false },
    ],
  },
  {
    title: "Approvals",
    rows: [
      { text: "Q3 valuation sign-off", object: "US Manufacturing III", tone: "warn", state: "2 of 3", mine: true },
      { text: "IC decision · Series C", object: "Acme Robotics", tone: "warn", state: "2 of 3", mine: false },
    ],
  },
  {
    title: "Recent intelligence",
    rows: [
      { text: "EBITDA −8.2% explained", object: "Harbor Logistics", tone: "neutral", state: "4 sources", mine: true },
      { text: "Peer refinancing announced", object: "Keller Tooling", tone: "neutral", state: "Signal", mine: false },
      { text: "Fund ranking by gross IRR", object: "Portfolio", tone: "neutral", state: "3 sources", mine: false },
    ],
  },
];

/** Daily operational workspace (PAL-022). */
export function ControlPanel() {
  const [mine, setMine] = useState(false);
  const total = MODULES.reduce((n, m) => n + m.rows.filter((r) => !mine || r.mine).length, 0);

  return (
    <Section id="control-panel" labelledBy="cp-title">
      <SectionHeader
        id="cp-title"
        index="12"
        eyebrow="Control Panel"
        title="A system designed around action."
        lead="Alerts, drafts, tasks, exceptions, approvals, and new intelligence arrive in one queue — each linked to the object it concerns."
      />

      <Reveal className="mt-16 overflow-hidden rounded-sm border border-line-strong bg-canvas">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-subtle px-4 py-2.5">
          <p className="font-data text-[11px] text-ink-2">octo / control-panel · Mon 30 Sep 2026</p>
          <div className="flex items-center gap-3">
            <SampleLabel>Demo environment</SampleLabel>
            <div role="radiogroup" aria-label="Scope" className="flex border border-line-strong">
              {[
                ["Team", false],
                ["Assigned to me", true],
              ].map(([l, v]) => (
                <button
                  key={String(l)}
                  type="button"
                  role="radio"
                  aria-checked={mine === v}
                  onClick={() => setMine(v as boolean)}
                  className={cn("min-h-8 px-2.5 text-[12px]", mine === v ? "bg-ink text-white" : "bg-canvas text-ink-2", focusRing)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex">
          <nav aria-label="Product navigation (preview)" className="hidden w-48 shrink-0 border-r border-line py-2 lg:block">
            <ul>
              {RAIL.map(({ label, icon: Icon }) => (
                <li
                  key={label}
                  aria-current={label === "Control Panel" ? "page" : undefined}
                  className={cn("flex items-center gap-2.5 border-l-2 px-4 py-2 text-[13px]", label === "Control Panel" ? "border-accent bg-accent-soft text-ink" : "border-transparent text-ink-3")}
                >
                  <Icon aria-hidden className="size-3.5" />
                  {label}
                </li>
              ))}
            </ul>
          </nav>
          <div className="min-w-0 flex-1">
            <p aria-live="polite" className="border-b border-line px-4 py-3 text-[13px] text-ink-2">
              <span className="font-medium text-ink">{total} open items</span> {mine ? "assigned to you" : "across your team"}
            </p>
            <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-2 xl:grid-cols-3">
              {MODULES.map((m) => {
                const rows = m.rows.filter((r) => !mine || r.mine);
                return (
                  <section key={m.title} aria-label={m.title} className="bg-canvas p-4">
                    <div className="flex items-baseline justify-between">
                      <p className="font-data text-[10px] uppercase tracking-[0.1em] text-ink-3">{m.title}</p>
                      <p className="font-data text-sm tabular-nums text-ink">{rows.length}</p>
                    </div>
                    <ul className="mt-2 divide-y divide-line">
                      {rows.map((r) => (
                        <li key={r.text} className="flex items-center justify-between gap-3 py-2">
                          <div className="min-w-0">
                            <p className="truncate text-[13px] text-ink">{r.text}</p>
                            <p className="truncate text-[11px] text-ink-3">{r.object}</p>
                          </div>
                          <Pill tone={r.tone} dot>
                            {r.state}
                          </Pill>
                        </li>
                      ))}
                      {rows.length === 0 && <li className="py-2 text-[12px] text-ink-3">Nothing assigned to you.</li>}
                    </ul>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
