"use client";

import { useState } from "react";
import { ChartTooltip, niceTicks, SrTable, useSize } from "./core";

/**
 * Value bridge (plan §20 financial family): totals in neutral, increases in
 * gain, decreases in loss, with connector lines. The axis starts above zero
 * and says so, because a bridge is about the steps.
 */
export function WaterfallChart({ data, label, format }: { data: { label: string; value: number; kind: "total" | "step" }[]; label: string; format: (v: number) => string }) {
  const [ref, { w, h }] = useSize<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  let run = 0;
  const bars = data.map((d) => {
    if (d.kind === "total") {
      run = d.value;
      return { ...d, from: 0, to: d.value };
    }
    const from = run;
    run += d.value;
    return { ...d, from, to: run };
  });
  const stepVals = bars.filter((b) => b.kind === "step").flatMap((b) => [b.from, b.to]);
  const ticks = niceTicks(Math.min(...stepVals) * 0.985, Math.max(...bars.map((b) => Math.max(b.from, b.to))) * 1.005, 4);
  const lo = ticks[0];
  const hi = ticks[ticks.length - 1];
  const pl = 48;
  const pt = 18;
  const pb = 34;
  const Y = (v: number) => pt + ((hi - Math.max(v, lo)) / (hi - lo)) * (h - pt - pb);
  const band = (w - pl) / bars.length;
  const bw = Math.min(56, band * 0.56);

  return (
    <div ref={ref} className="relative h-full w-full">
      {w > 0 && h > 0 && (
        <svg width={w} height={h} role="img" aria-label={`${label}: ${bars.map((b) => `${b.label} ${format(b.value)}`).join(", ")}`} onPointerLeave={() => setHover(null)} className="block">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pl} x2={w} y1={Y(t)} y2={Y(t)} stroke="var(--color-chart-grid)" />
              <text x={pl - 8} y={Y(t) + 3.5} textAnchor="end" className="fill-ink-4 text-[11px] tabular-nums">
                {format(t)}
              </text>
            </g>
          ))}
          {bars.map((b, i) => {
            const x = pl + band * i + (band - bw) / 2;
            const top = Y(Math.max(b.from, b.to));
            const bottom = b.kind === "total" ? h - pb : Y(Math.min(b.from, b.to));
            const fill = b.kind === "total" ? "var(--color-ink-3)" : b.value >= 0 ? "var(--color-gain)" : "var(--color-loss)";
            return (
              <g key={b.label} onPointerEnter={() => setHover(i)} opacity={hover !== null && hover !== i ? 0.5 : 1}>
                <rect x={pl + band * i} y={pt} width={band} height={h - pt - pb} fill="transparent" />
                <rect x={x} y={top} width={bw} height={Math.max(1.5, bottom - top)} rx="3" fill={fill} />
                {i < bars.length - 1 && <line x1={x + bw} x2={x + band} y1={Y(b.to)} y2={Y(b.to)} stroke="var(--color-line-strong)" strokeDasharray="2 2" />}
                <text x={x + bw / 2} y={top - 5} textAnchor="middle" className="fill-ink-2 text-[11px] font-medium tabular-nums">
                  {b.kind === "step" && b.value > 0 ? "+" : ""}
                  {format(b.value)}
                </text>
                <text x={x + bw / 2} y={h - pb + 15} textAnchor="middle" className="fill-ink-3 text-[11px]">
                  {b.label}
                </text>
              </g>
            );
          })}
        </svg>
      )}
      {hover !== null && w > 0 && (
        <ChartTooltip
          x={pl + band * hover + band / 2}
          y={Y(Math.max(bars[hover].from, bars[hover].to))}
          width={w}
          title={bars[hover].label}
          rows={[
            { label: bars[hover].kind === "total" ? "Total" : "Change", value: format(bars[hover].value) },
            ...(bars[hover].kind === "step" ? [{ label: "Running total", value: format(bars[hover].to) }] : []),
          ]}
        />
      )}
      <SrTable caption={label} head={["Step", "Value", "Running total"]} rows={bars.map((b) => [b.label, format(b.value), format(b.to)])} />
    </div>
  );
}
