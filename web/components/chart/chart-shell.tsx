"use client";

import { useEffect, useState } from "react";
import { Download, GitBranch, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/button";
import { EmptyState, ErrorState, PermissionState, Skeleton } from "@/components/feedback";

export type ChartState = "ready" | "loading" | "empty" | "error" | "stale" | "permission";

export type ChartExport = { filename: string; head: string[]; rows: (string | number)[][] };

function downloadCsv({ filename, head, rows }: ChartExport) {
  const esc = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [head.map(esc).join(","), ...rows.map((r) => r.map(esc).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  Object.assign(document.createElement("a"), { href: url, download: `${filename}.csv` }).click();
  URL.revokeObjectURL(url);
}

/**
 * Analytical chart contract (plan §19): title, context, headline, controls,
 * legend, freshness, source/lineage footer, export, fullscreen, and designed
 * loading / empty / error / stale / permission states.
 */
export function ChartShell({
  title,
  subtitle,
  icon,
  headline,
  toolbar,
  legend,
  freshness,
  source,
  onLineage,
  state = "ready",
  emptyText = "No data for the selected period.",
  onRetry,
  exportData,
  height = 260,
  className,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  headline?: React.ReactNode;
  toolbar?: React.ReactNode;
  legend?: React.ReactNode;
  freshness?: React.ReactNode;
  source?: string;
  onLineage?: () => void;
  state?: ChartState;
  emptyText?: string;
  onRetry?: () => void;
  exportData?: ChartExport;
  height?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const [full, setFull] = useState(false);
  useEffect(() => {
    if (!full) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFull(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [full]);

  const body =
    state === "loading" ? (
      <div role="status" aria-busy="true" className="flex h-full flex-col justify-end gap-2" style={{ height }}>
        <span className="sr-only">Loading {title}…</span>
        <div className="flex h-full items-end gap-2">
          {[0.45, 0.6, 0.5, 0.75, 0.65, 0.85, 0.7, 0.9].map((h, i) => (
            <span key={i} aria-hidden style={{ height: `${h * 100}%` }} className="block flex-1 animate-pulse rounded-sm bg-muted motion-reduce:animate-none" />
          ))}
        </div>
      </div>
    ) : state === "empty" ? (
      <EmptyState title="Nothing to chart" body={emptyText} className="py-6" />
    ) : state === "error" ? (
      <ErrorState title={`Couldn’t load ${title.toLowerCase()}`} scope="The rest of the page still works." onRetry={onRetry} className="py-6" />
    ) : state === "permission" ? (
      <PermissionState scope="this chart" className="py-6" />
    ) : (
      <div style={{ height: full ? "calc(100% - 8px)" : height }} className={cn(state === "stale" && "opacity-80")}>
        {children}
      </div>
    );

  return (
    <>
      {full && <div aria-hidden className="fixed inset-0 z-[74] bg-black/40" onClick={() => setFull(false)} />}
      <section
        aria-label={title}
        role={full ? "dialog" : undefined}
        aria-modal={full || undefined}
        className={cn(
          "flex min-w-0 flex-col rounded-xl border border-line bg-surface",
          full && "fixed inset-3 z-[75] shadow-dialog sm:inset-8",
          className,
        )}
      >
        <header className="flex flex-wrap items-start justify-between gap-3 px-4 pt-3.5">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-[14px] font-semibold text-ink [&>svg]:size-4 [&>svg]:text-ink-3">
              {icon}
              {title}
            </h2>
            {subtitle && <p className="mt-0.5 text-[12px] text-ink-3">{subtitle}</p>}
            {headline && <div className="mt-2">{headline}</div>}
          </div>
          <div className="flex items-center gap-1">
            {toolbar}
            {exportData && state === "ready" && <IconButton size="sm" label={`Export ${title} as CSV`} icon={<Download />} onClick={() => downloadCsv(exportData)} />}
            <IconButton size="sm" label={full ? "Exit full screen" : "Full screen"} icon={full ? <Minimize2 /> : <Maximize2 />} onClick={() => setFull(!full)} />
          </div>
        </header>
        {legend && <div className="px-4 pt-2">{legend}</div>}
        <div className={cn("min-h-0 px-4 pb-3 pt-3", full && "flex-1")}>{body}</div>
        {(freshness || source || onLineage) && (
          <footer className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line px-4 py-2 text-[11px] text-ink-3">
            {freshness}
            {source && <span>Source: {source}</span>}
            {state === "stale" && <span className="font-medium text-warn">Stale — past refresh target</span>}
            {onLineage && (
              <button type="button" onClick={onLineage} className="ml-auto inline-flex cursor-pointer items-center gap-1 rounded-sm font-medium hover:text-accent focus-visible:outline-2 focus-visible:outline-accent">
                <GitBranch aria-hidden className="size-3" /> Lineage
              </button>
            )}
          </footer>
        )}
      </section>
    </>
  );
}
