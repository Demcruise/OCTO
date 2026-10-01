"use client";

import Link from "next/link";
import { ArrowRight, GitBranch } from "lucide-react";
import { useFormat } from "@/lib/use-format";
import { usePreferences } from "@/lib/preferences";
import { AS_OF, QUARTERS, type Metric } from "@/lib/demo";
import { Sheet } from "@/components/ui/overlay";
import { Button, LinkButton } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { TrendChart } from "@/components/chart/line-chart";
import { useMetricValue } from "./metric-card";
import { Delta } from "./delta";

/** Plain-language definitions; the formula itself comes from the metric's provenance. */
const DEFINITION: Record<string, string> = {
  nav: "Fair value of every position plus fund cash, at the latest quarter-end valuation.",
  irr: "Annualised return to LPs after fees and carry, from dated cash flows and closing NAV.",
  tvpi: "Total value — distributions plus remaining NAV — for every dollar LPs have paid in.",
  dpi: "Cash actually returned to LPs for every dollar paid in.",
  invested: "Cost basis of every active position across all funds.",
  dry: "Commitments not yet called, available for new and follow-on investments.",
  committed: "Capital LPs have committed to the fund.",
  called: "Capital called from LPs and paid in.",
  dist: "Cash distributed to LPs to date.",
};

const RELATED: Record<string, { label: string; href: string }[]> = {
  nav: [
    { label: "Review valuation exceptions", href: "/app/workflows?tab=exceptions" },
    { label: "Open NAV reconciliation", href: "/app/reconciliation" },
  ],
  irr: [{ label: "Compare fund performance", href: "/app/funds" }],
  tvpi: [{ label: "Compare fund performance", href: "/app/funds" }],
  dpi: [{ label: "See distributions by fund", href: "/app/funds" }],
  invested: [{ label: "Open investments", href: "/app/investments" }],
  dry: [{ label: "Review pipeline", href: "/app/deals" }],
};

/**
 * KPI metric drawer (KPI-002). Opened by clicking a whole KPI card: value and
 * change, plain-language definition, period, trend, drivers, source/lineage
 * summary and related actions. "View lineage" hands over to the full lineage
 * drawer; the card itself no longer carries a Lineage link.
 */
export function KpiMetricDrawer({ metric, onClose, onLineage, primary = { label: "View portfolio", href: "/app/portfolio" } }: { metric: Metric | null; onClose: () => void; onLineage?: (m: Metric) => void; primary?: { label: string; href: string } }) {
  const f = useFormat();
  const fmt = useMetricValue();
  const { period } = usePreferences();
  if (!metric) return null;
  const m = metric;
  const p = m.provenance;
  const x = m.spark ? QUARTERS.slice(-m.spark.length) : [];
  const valueOf = (v: number) => fmt({ value: m.format === "money" ? v * 1e6 : v, format: m.format });

  return (
    <Sheet
      open
      onClose={onClose}
      eyebrow="Metric"
      title={m.label}
      footer={
        <div className="flex flex-wrap items-center justify-end gap-2">
          {onLineage && (
            <Button onClick={() => onLineage(m)}>
              <GitBranch /> View lineage
            </Button>
          )}
          <LinkButton href={m.href ?? primary.href} variant="primary" onClick={onClose}>
            {m.href ? `Open ${m.label}` : primary.label} <ArrowRight />
          </LinkButton>
        </div>
      }
    >
      <div className="space-y-6">
        <section aria-label="Current value">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="text-kpi-xl font-semibold tabular-nums text-ink">{fmt(m)}</p>
            {m.delta !== undefined && <Delta value={m.delta} unit={m.deltaUnit} upIsGood={m.upIsGood} pill />}
            <span className="text-[12px] text-ink-3">{m.comparison}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <StatusBadge tone="info">Demo data</StatusBadge>
            <StatusBadge tone="neutral" dot={false}>
              {period} · as of {f.date(AS_OF)}
            </StatusBadge>
          </div>
        </section>

        <Section title="Definition">
          <p className="text-[13px] text-ink-2">{DEFINITION[m.id] ?? p.transformation}</p>
          <code className="mt-2 block rounded-sm border border-line bg-subtle px-3 py-2 font-data text-[12px] text-ink">{p.formula}</code>
        </Section>

        {m.spark && (
          <Section title="Trend" hint={`Last ${m.spark.length} quarters`}>
            <div className="h-40">
              <TrendChart x={x} series={[{ id: m.id, label: m.label, values: m.spark }]} format={valueOf} label={`${m.label}, last ${m.spark.length} quarters`} />
            </div>
          </Section>
        )}

        <Section title="Drivers">
          <ul className="divide-y divide-line-subtle rounded-md border border-line">
            {p.inputs.map((i) => (
              <li key={i.label} className="flex min-h-10 items-center justify-between gap-3 px-3 py-2 text-[13px]">
                {i.href ? (
                  <Link href={i.href} onClick={onClose} className="inline-flex min-w-0 items-center gap-1 text-ink-2 hover:text-accent-ink">
                    <span className="truncate">{i.label}</span> <ArrowRight aria-hidden className="size-3 shrink-0" />
                  </Link>
                ) : (
                  <span className="min-w-0 truncate text-ink-2">{i.label}</span>
                )}
                <span className="shrink-0 font-medium tabular-nums text-ink">{i.value}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Source and lineage">
          <dl className="grid grid-cols-2 gap-3 text-[13px]">
            {[
              ["System", p.sourceSystem],
              ["Document", p.sourceDocument ?? "—"],
              ["As of", `${f.dateTime(p.asOf)} UTC`],
              ["Definition", p.version],
            ].map(([k, v]) => (
              <div key={k} className="min-w-0">
                <dt className="text-[12px] text-ink-3">{k}</dt>
                <dd className="mt-0.5 break-words text-ink-2">{v}</dd>
              </div>
            ))}
          </dl>
        </Section>

        {RELATED[m.id] && (
          <Section title="Related actions">
            <ul className="space-y-1">
              {RELATED[m.id].map((r) => (
                <li key={r.href + r.label}>
                  <Link href={r.href} onClick={onClose} className="flex h-9 items-center justify-between rounded-sm px-2 text-[13px] text-ink-2 hover:bg-hover hover:text-ink">
                    {r.label} <ArrowRight aria-hidden className="size-3.5 text-ink-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </Sheet>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section aria-label={title}>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <h3 className="text-[13px] font-semibold text-ink">{title}</h3>
        {hint && <span className="text-[11px] text-ink-4">{hint}</span>}
      </div>
      {children}
    </section>
  );
}
