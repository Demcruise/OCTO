"use client";

import Link from "next/link";
import { GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormat } from "@/lib/use-format";
import type { Metric } from "@/lib/demo";
import { ring } from "@/components/ui/button";
import { Sparkline } from "@/components/chart/sparkline";
import { MetricSkeleton } from "@/components/feedback";
import { Delta } from "./delta";

export type MetricState = "ready" | "loading" | "stale" | "error" | "no-data";

export function useMetricValue() {
  const f = useFormat();
  return (m: Pick<Metric, "value" | "format">) =>
    m.format === "money" ? f.money(m.value) : m.format === "pct" ? f.pct(m.value) : m.format === "multiple" ? f.multiple(m.value) : f.num(m.value);
}

/**
 * KPI card (plan §2.5, Vestra anatomy): small icon + label, sparkline top
 * right, large tabular value, delta pill + comparison, and a lineage
 * affordance. Supports compact / standard / emphasized and every data state.
 */
export function MetricCard({
  metric,
  icon,
  variant = "standard",
  state = "ready",
  asOf,
  onLineage,
  className,
}: {
  metric: Metric;
  icon?: React.ReactNode;
  variant?: "compact" | "standard" | "emphasized";
  state?: MetricState;
  asOf?: string;
  onLineage?: (m: Metric) => void;
  className?: string;
}) {
  const fmt = useMetricValue();
  if (state === "loading") return <MetricSkeleton />;

  const value = state === "no-data" || state === "error" ? "—" : fmt(metric);
  const good = metric.delta === undefined || metric.upIsGood === undefined ? undefined : (metric.delta > 0) === metric.upIsGood;
  const valueCls = cn(
    "font-semibold tabular-nums text-ink",
    variant === "emphasized" ? "text-kpi-xl" : variant === "compact" ? "text-metric" : "text-kpi",
    state === "stale" && "text-ink-2",
  );

  return (
    <div
      className={cn(
        "group flex min-w-0 flex-col justify-between rounded-xl border border-line bg-surface p-4 transition-colors duration-150",
        variant === "compact" ? "min-h-[108px] gap-3" : "min-h-[132px] gap-4",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {icon && <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-line bg-subtle text-ink-2 [&_svg]:size-3.5">{icon}</span>}
          <p className="truncate text-[12px] font-medium tracking-[-0.01em] text-ink">{metric.label}</p>
        </div>
        {metric.spark && state === "ready" && variant !== "compact" && (
          <Sparkline values={metric.spark} tone={good === undefined ? "muted" : good ? "gain" : "loss"} className="-mt-0.5 h-7 w-20" />
        )}
      </div>

      <div className="min-w-0">
        {metric.href && state !== "error" ? (
          <Link href={metric.href} className={cn("rounded-sm hover:text-accent", valueCls, ring)}>
            {value}
          </Link>
        ) : (
          <p className={valueCls}>{value}</p>
        )}

        <div className="mt-2 flex min-h-5 flex-wrap items-center gap-x-2 gap-y-1">
          {state === "error" ? (
            <span className="text-[12px] text-danger">Couldn’t calculate</span>
          ) : state === "no-data" ? (
            <span className="text-[12px] text-ink-3">No data for this period</span>
          ) : (
            <>
              {metric.delta !== undefined && <Delta value={metric.delta} unit={metric.deltaUnit} upIsGood={metric.upIsGood} pill />}
              <span className="text-[12px] font-medium text-ink-3">{metric.comparison}</span>
              {state === "stale" && (
                <span className="inline-flex items-center gap-1 text-[12px] text-warn">
                  <span aria-hidden className="size-1.5 rounded-full bg-warn" />
                  Stale
                </span>
              )}
            </>
          )}
          {onLineage && state !== "no-data" && (
            <button
              type="button"
              onClick={() => onLineage(metric)}
              className={cn("ml-auto inline-flex cursor-pointer items-center gap-1 rounded-sm text-[11px] font-medium text-ink-4 transition-colors hover:text-accent", ring)}
              aria-label={`View lineage for ${metric.label}`}
            >
              <GitBranch aria-hidden className="size-3" />
              Lineage
            </button>
          )}
        </div>
        {asOf && <p className="sr-only">As of {asOf}</p>}
      </div>
    </div>
  );
}

/** Responsive KPI grid: 1 → 2 → 3/4/6 columns (plan §28). */
export function MetricGrid({ children, cols = 4, className }: { children: React.ReactNode; cols?: 3 | 4 | 6; className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3 min-[480px]:grid-cols-2",
        cols === 3 && "lg:grid-cols-3",
        cols === 4 && "lg:grid-cols-4",
        cols === 6 && "lg:grid-cols-3 2xl:grid-cols-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
