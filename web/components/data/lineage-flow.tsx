"use client";

import { Fragment, useState } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ringInset } from "@/components/ui/button";

const NODE_H = 48;
const GAP = 8;
const HEAD = 64;

/**
 * Lineage flow (LIN-001). Equal-width layer columns with equal-height nodes;
 * one highlighted path (default: the first node of every layer, e.g. Apex Fund
 * Services → MAP-114 cash → Transaction ledger → Fund NAV v2.1) joined by
 * connectors. Picking any node re-routes the path through that layer.
 */
export function LineageFlow({ layers, label, initialPath }: { layers: { layer: string; about?: string; nodes: string[] }[]; label: string; initialPath?: number[] }) {
  const [path, setPath] = useState<number[]>(initialPath ?? layers.map(() => 0));
  const y = (i: number) => HEAD + i * (NODE_H + GAP) + NODE_H / 2;
  const rows = Math.max(...layers.map((l) => l.nodes.length));
  const height = HEAD + rows * NODE_H + (rows - 1) * GAP;
  const names = layers.map((l, li) => l.nodes[path[li]]);

  return (
    <figure aria-label={label}>
      <figcaption className="mb-4 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px]">
        <span className="mr-1 text-ink-3">Highlighted path:</span>
        {names.map((n, i) => (
          <Fragment key={n}>
            <span className="font-medium text-ink">{n}</span>
            {i < names.length - 1 && <ArrowRight aria-hidden className="size-3.5 text-ink-4" />}
          </Fragment>
        ))}
      </figcaption>

      <div>
        <div className="hidden md:grid" style={{ gridTemplateColumns: layers.map(() => "minmax(0,1fr)").join(" 40px "), height }}>
          {layers.map((l, li) => (
            <Fragment key={l.layer}>
              <Column layer={l} li={li} selected={path[li]} onPick={(ni) => setPath((p) => p.map((v, k) => (k === li ? ni : v)))} />
              {li < layers.length - 1 && (
                <svg aria-hidden width="40" height={height} className="overflow-visible">
                  <path
                    d={`M0 ${y(path[li])} C 20 ${y(path[li])}, 20 ${y(path[li + 1])}, 40 ${y(path[li + 1])}`}
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="1.75"
                  />
                  <circle cx="38" cy={y(path[li + 1])} r="2.5" fill="var(--color-accent)" />
                </svg>
              )}
            </Fragment>
          ))}
        </div>

        {/* Mobile: stacked layers, arrows between. */}
        <div className="space-y-2 md:hidden">
          {layers.map((l, li) => (
            <Fragment key={l.layer}>
              <Column layer={l} li={li} selected={path[li]} onPick={(ni) => setPath((p) => p.map((v, k) => (k === li ? ni : v)))} />
              {li < layers.length - 1 && <ArrowDown aria-hidden className="mx-auto size-4 text-accent" />}
            </Fragment>
          ))}
        </div>
      </div>
      <p className="mt-4 text-[12px] text-ink-3">Select any node to trace a different path. Each step is versioned and auditable.</p>
    </figure>
  );
}

function Column({ layer, li, selected, onPick }: { layer: { layer: string; about?: string; nodes: string[] }; li: number; selected: number; onPick: (i: number) => void }) {
  return (
    <div className="min-w-0">
      <div className="overflow-hidden" style={{ height: HEAD - 8, marginBottom: 8 }}>
        <p className="text-label uppercase text-ink-4">
          {li + 1}. {layer.layer}
        </p>
        {layer.about && <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-ink-3">{layer.about}</p>}
      </div>
      <ul className="flex flex-col" style={{ gap: GAP }} aria-label={layer.layer}>
        {layer.nodes.map((n, ni) => {
          const on = ni === selected;
          return (
            <li key={n}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => onPick(ni)}
                style={{ height: NODE_H }}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-2 rounded-md border px-3 text-left text-[13px] font-medium transition-colors",
                  on ? "border-accent bg-accent-soft text-accent-ink" : "border-line bg-surface text-ink-2 hover:border-line-strong hover:bg-hover",
                  ringInset,
                )}
              >
                <span aria-hidden className={cn("size-2 shrink-0 rounded-full", on ? "bg-accent" : "bg-line-strong")} />
                <span className="min-w-0 truncate" title={n}>
                  {n}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
