"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormat } from "@/lib/use-format";
import type { Metric } from "@/lib/demo";
import { ring } from "@/components/ui/button";
import { MetricSkeleton } from "@/components/feedback";
import { TrendBadge } from "./delta";

export type MetricState = "ready" | "loading" | "stale" | "error" | "no-data";

export function useMetricValue() {
  const f = useFormat();
  return (m: Pick<Metric, "value" | "format">) =>
    m.format === "money" ? f.money(m.value) : m.format === "pct" ? f.pct(m.value) : m.format === "multiple" ? f.multiple(m.value) : f.num(m.value);
}

/**
 * KPI card (V2 CC-001): icon + label + arrow, large tabular value, trend
 * badge + comparison. No mini charts — the trend lives in the KPI drawer. With `onOpen` the whole card is
 * one button (hover tint, stronger border, arrow) that opens the KPI drawer —
 * there is no separate Lineage link in the footer any more.
 */
export function MetricCard({
  metric,
  icon,
  variant = "standard",
  state = "ready",
  asOf,
  onOpen,
  className,
}: {
  metric: Metric;
  icon?: React.ReactNode;
  variant?: "compact" | "standard" | "emphasized";
  state?: MetricState;
  asOf?: string;
  onOpen?: (m: Metric) => void;
  className?: string;
}) {
  const fmt = useMetricValue();
  if (state === "loading") return <MetricSkeleton />;

  const value = state === "no-data" || state === "error" ? "—" : fmt(metric);
  const valueCls = cn(
    "font-semibold tabular-nums text-ink",
    variant === "emphasized" ? "text-kpi-xl" : variant === "compact" ? "text-metric" : "text-kpi",
    state === "stale" && "text-ink-2",
  );

  const clickable = !!onOpen && state !== "no-data";
  const Root = clickable ? "button" : "div";
  return (
    <Root
      {...(clickable ? { type: "button" as const, onClick: () => onOpen(metric), "aria-label": `${metric.label}: ${value}. Open metric details` } : {})}
      className={cn(
        "group relative flex min-w-0 flex-col justify-between rounded-lg border border-line bg-surface p-4 text-left transition-colors duration-150 sm:p-5",
        variant === "compact" ? "min-h-[108px] gap-3" : "min-h-[136px] gap-4",
        clickable && "cursor-pointer hover:border-line-strong hover:bg-subtle",
        clickable && ring,
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {icon && <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-line bg-subtle text-ink-2 [&_svg]:size-3.5">{icon}</span>}
          <span className="line-clamp-2 text-[13px] font-medium leading-snug tracking-[-0.01em] text-ink">{metric.label}</span>
        </div>
        {clickable && <ArrowUpRight aria-hidden className="size-4 shrink-0 text-ink-4 transition-colors group-hover:text-accent-ink" />}
      </div>

      <div className="min-w-0">
        {metric.href && state !== "error" && !clickable ? (
          <Link href={metric.href} className={cn("rounded-sm hover:text-accent", valueCls, ring)}>
            {value}
          </Link>
        ) : (
          <span className={cn("block", valueCls)}>{value}</span>
        )}

        <div className="mt-2 flex min-h-5 flex-wrap items-center gap-x-2 gap-y-1">
          {state === "error" ? (
            <span className="text-[12px] text-danger">Couldn’t calculate</span>
          ) : state === "no-data" ? (
            <span className="text-[12px] text-ink-3">No data for this period</span>
          ) : (
            <>
              {metric.delta !== undefined && <TrendBadge value={metric.delta} unit={metric.deltaUnit} upIsGood={metric.upIsGood} trend={metric.trend} />}
              <span className="text-[12px] font-medium text-ink-3">{metric.comparison}</span>
              {state === "stale" && (
                <span className="inline-flex items-center gap-1 text-[12px] text-warn">
                  <span aria-hidden className="size-1.5 rounded-full bg-warn" />
                  Stale
                </span>
              )}
            </>
          )}
        </div>
        {asOf && <span className="sr-only">As of {asOf}</span>}
      </div>
    </Root>
  );
}

/** Responsive KPI grid (KPI-003): 6 cols desktop → 3×2 tablet → 2×3 mobile. */
export function MetricGrid({ children, cols = 4, className }: { children: React.ReactNode; cols?: 3 | 4 | 6; className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3",
        cols === 3 && "lg:grid-cols-3",
        cols === 4 && "lg:grid-cols-4",
        cols === 6 && "md:grid-cols-3 xl:grid-cols-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** V2 shared-primitive name for the KPI card. */
export { MetricCard as KpiCard };
