"use client";

import { useState } from "react";
import { ChartTooltip, niceTicks, SERIES, SrTable, useSize } from "./core";

type Point = { id: string; label: string; x: number; y: number; r?: number; group: string };

/**
 * Relationship chart (plan §20): bubble scatter with optional quadrant
 * reference lines — e.g. IRR vs MOIC sized by fair value.
 */
export function ScatterChart({ points, xLabel, yLabel, formatX, formatY, formatR, label, refX, refY, onSelect }: { points: Point[]; xLabel: string; yLabel: string; formatX: (v: number) => string; formatY: (v: number) => string; formatR?: (v: number) => string; label: string; refX?: number; refY?: number; onSelect?: (p: Point) => void }) {
  const [ref, { w, h }] = useSize<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const pl = 44;
  const pb = 34;
  const pt = 10;
  const pr = 12;
  const xt = niceTicks(Math.min(...points.map((p) => p.x), refX ?? Infinity), Math.max(...points.map((p) => p.x), refX ?? -Infinity), 5);
  const yt = niceTicks(Math.min(...points.map((p) => p.y), refY ?? Infinity), Math.max(...points.map((p) => p.y), refY ?? -Infinity), 4);
  const X = (v: number) => pl + ((v - xt[0]) / (xt[xt.length - 1] - xt[0] || 1)) * (w - pl - pr);
  const Y = (v: number) => pt + ((yt[yt.length - 1] - v) / (yt[yt.length - 1] - yt[0] || 1)) * (h - pt - pb);
  const rMax = Math.max(...points.map((p) => p.r ?? 1));
  const R = (p: Point) => (p.r ? 4 + Math.sqrt(p.r / rMax) * 12 : 5);
  const groups = [...new Set(points.map((p) => p.group))];

  return (
    <div ref={ref} className="relative h-full w-full">
      {w > 0 && h > 0 && (
        <svg width={w} height={h} role="img" aria-label={`${label}: ${points.length} points`} onPointerLeave={() => setHover(null)} className="block">
          {yt.map((t) => (
            <g key={`y${t}`}>
              <line x1={pl} x2={w - pr} y1={Y(t)} y2={Y(t)} stroke="var(--color-chart-grid)" />
              <text x={pl - 8} y={Y(t) + 3.5} textAnchor="end" className="fill-ink-4 text-[11px] tabular-nums">
                {formatY(t)}
              </text>
            </g>
          ))}
          {xt.map((t) => (
            <text key={`x${t}`} x={X(t)} y={h - pb + 16} textAnchor="middle" className="fill-ink-4 text-[11px] tabular-nums">
              {formatX(t)}
            </text>
          ))}
          <text x={w - pr} y={h - 4} textAnchor="end" className="fill-ink-3 text-[11px]">
            {xLabel} →
          </text>
          <text x={pl} y={pt - 1} className="fill-ink-3 text-[11px]">
            ↑ {yLabel}
          </text>
          {refX !== undefined && <line x1={X(refX)} x2={X(refX)} y1={pt} y2={h - pb} stroke="var(--color-line-strong)" strokeDasharray="4 3" />}
          {refY !== undefined && <line x1={pl} x2={w - pr} y1={Y(refY)} y2={Y(refY)} stroke="var(--color-line-strong)" strokeDasharray="4 3" />}
          {points.map((p, i) => (
            <circle
              key={p.id}
              cx={X(p.x)}
              cy={Y(p.y)}
              r={R(p)}
              fill={SERIES[groups.indexOf(p.group) % SERIES.length]}
              fillOpacity={hover === null || hover === i ? 0.75 : 0.2}
              stroke="var(--color-surface)"
              strokeWidth="1.5"
              onPointerEnter={() => setHover(i)}
              onClick={() => onSelect?.(p)}
              className={onSelect ? "cursor-pointer" : undefined}
            />
          ))}
        </svg>
      )}
      {hover !== null && w > 0 && (
        <ChartTooltip
          x={X(points[hover].x)}
          y={Y(points[hover].y)}
          width={w}
          title={points[hover].label}
          rows={[
            { label: xLabel, value: formatX(points[hover].x) },
            { label: yLabel, value: formatY(points[hover].y) },
            ...(points[hover].r && formatR ? [{ label: "Size", value: formatR(points[hover].r!) }] : []),
            { label: "Group", value: points[hover].group },
          ]}
        />
      )}
      <SrTable caption={label} head={["Item", xLabel, yLabel, "Group"]} rows={points.map((p) => [p.label, formatX(p.x), formatY(p.y), p.group])} />
    </div>
  );
}
