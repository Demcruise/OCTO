import { cn } from "@/lib/utils";

/*
 * Lightweight SVG charts (CHART-001). No chart dependency: each chart is a
 * role="img" with a text summary, and ships a visually hidden data table so
 * values are reachable without the graphic.
 */

type Point = { x: string; y: number };

function scale(values: number[], h: number, pad = 2, zero = false) {
  const lo = zero ? Math.min(0, ...values) : Math.min(...values);
  const hi = Math.max(...values);
  const span = hi - lo || 1;
  return (v: number) => h - pad - ((v - lo) / span) * (h - pad * 2);
}

function SrTable({ caption, rows }: { caption: string; rows: [string, string][] }) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k}>
            <th scope="row">{k}</th>
            <td>{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Inline trend; decorative next to a labelled value. */
export function Sparkline({ values, tone = "accent", className }: { values: number[]; tone?: "accent" | "ok" | "danger" | "muted"; className?: string }) {
  const w = 96;
  const h = 28;
  const y = scale(values, h);
  const step = w / (values.length - 1);
  const d = values.map((v, i) => `${i ? "L" : "M"}${(i * step).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const stroke = { accent: "var(--color-accent)", ok: "var(--color-ok)", danger: "var(--color-danger)", muted: "var(--color-ink-4)" }[tone];
  return (
    <svg aria-hidden viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={cn("h-7 w-24 overflow-visible", className)}>
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      <circle cx={w} cy={y(values[values.length - 1])} r="2" fill={stroke} />
    </svg>
  );
}

/** Area over time with gridlines and end label. */
export function AreaChart({ data, label, format, className }: { data: Point[]; label: string; format: (v: number) => string; className?: string }) {
  const w = 560;
  const h = 180;
  const pl = 44;
  const pb = 22;
  const values = data.map((d) => d.y);
  const lo = Math.floor(Math.min(...values) * 0.97);
  const hi = Math.ceil(Math.max(...values) * 1.01);
  const y = (v: number) => 8 + ((hi - v) / (hi - lo)) * (h - pb - 8);
  const x = (i: number) => pl + (i / (data.length - 1)) * (w - pl - 8);
  const line = data.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.y)}`).join(" ");
  const ticks = [lo, lo + (hi - lo) / 2, hi];
  const first = data[0];
  const last = data[data.length - 1];
  const summary = `${label}: ${format(first.y)} in ${first.x} to ${format(last.y)} in ${last.x}.`;
  return (
    <figure className={className}>
      <svg role="img" aria-label={summary} viewBox={`0 0 ${w} ${h}`} className="h-auto w-full">
        <defs>
          <linearGradient id="area-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pl} x2={w - 8} y1={y(t)} y2={y(t)} stroke="var(--color-line)" />
            <text x={pl - 8} y={y(t) + 3.5} textAnchor="end" className="fill-ink-4 font-data text-[10px]">
              {format(t)}
            </text>
          </g>
        ))}
        <path d={`${line} L${x(data.length - 1)},${h - pb} L${pl},${h - pb} Z`} fill="url(#area-fill)" />
        <path d={line} fill="none" stroke="var(--color-accent)" strokeWidth="1.75" strokeLinejoin="round" />
        {data.map((d, i) => (
          <text key={d.x} x={x(i)} y={h - 6} textAnchor={i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"} className="fill-ink-4 font-data text-[10px]">
            {d.x}
          </text>
        ))}
        <circle cx={x(data.length - 1)} cy={y(last.y)} r="3.5" fill="var(--color-surface)" stroke="var(--color-accent)" strokeWidth="2" />
      </svg>
      <SrTable caption={label} rows={data.map((d) => [d.x, format(d.y)])} />
    </figure>
  );
}

/** Paired bars per period (e.g. calls vs distributions) with a legend. */
export function PairedBars({
  data,
  label,
  series,
  format,
  className,
}: {
  data: { x: string; a: number; b: number }[];
  label: string;
  series: [string, string];
  format: (v: number) => string;
  className?: string;
}) {
  const w = 360;
  const h = 160;
  const pb = 22;
  const max = Math.max(...data.flatMap((d) => [d.a, d.b])) * 1.1;
  const band = w / data.length;
  const bw = Math.min(18, band / 3.2);
  const y = (v: number) => (h - pb) * (1 - v / max);
  return (
    <figure className={className}>
      <div className="mb-2 flex gap-4 text-[12px] text-ink-3">
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="size-2 rounded-[2px] bg-accent" />
          {series[0]}
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="size-2 rounded-[2px] bg-ink-4" />
          {series[1]}
        </span>
      </div>
      <svg role="img" aria-label={`${label}, ${data.length} periods`} viewBox={`0 0 ${w} ${h}`} className="h-auto w-full">
        <line x1="0" x2={w} y1={h - pb} y2={h - pb} stroke="var(--color-line-strong)" />
        {data.map((d, i) => {
          const cx = band * i + band / 2;
          return (
            <g key={d.x}>
              <rect x={cx - bw - 1.5} y={y(d.a)} width={bw} height={h - pb - y(d.a)} rx="1.5" fill="var(--color-accent)" />
              <rect x={cx + 1.5} y={y(d.b)} width={bw} height={h - pb - y(d.b)} rx="1.5" fill="var(--color-ink-4)" />
              <text x={cx} y={h - 6} textAnchor="middle" className="fill-ink-4 font-data text-[10px]">
                {d.x}
              </text>
            </g>
          );
        })}
      </svg>
      <SrTable caption={label} rows={data.map((d) => [d.x, `${series[0]} ${format(d.a)}, ${series[1]} ${format(d.b)}`])} />
    </figure>
  );
}

/** Bridge from an opening to a closing total; steps are green up, red down. */
export function Waterfall({
  data,
  label,
  format,
  className,
}: {
  data: { label: string; value: number; kind: "total" | "step" }[];
  label: string;
  format: (v: number) => string;
  className?: string;
}) {
  const w = 560;
  const h = 200;
  const pt = 18;
  const pb = 34;
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
  const lo = Math.min(...bars.filter((b) => b.kind === "step").flatMap((b) => [b.from, b.to])) * 0.97;
  const hi = Math.max(...bars.flatMap((b) => [b.from, b.to])) * 1.005;
  const y = (v: number) => pt + ((hi - Math.max(v, lo)) / (hi - lo)) * (h - pt - pb);
  const band = w / bars.length;
  const bw = Math.min(56, band * 0.56);
  return (
    <figure className={className}>
      <svg role="img" aria-label={`${label}: ${bars.map((b) => `${b.label} ${format(b.value)}`).join(", ")}`} viewBox={`0 0 ${w} ${h}`} className="h-auto w-full">
        <line x1="0" x2={w} y1={h - pb} y2={h - pb} stroke="var(--color-line-strong)" />
        {bars.map((b, i) => {
          const x = band * i + (band - bw) / 2;
          const top = y(Math.max(b.from, b.to));
          const bottom = b.kind === "total" ? h - pb : y(Math.min(b.from, b.to));
          const fill = b.kind === "total" ? "var(--color-ink-3)" : b.value >= 0 ? "var(--color-ok)" : "var(--color-danger)";
          return (
            <g key={b.label}>
              <rect x={x} y={top} width={bw} height={Math.max(1.5, bottom - top)} rx="1.5" fill={fill} opacity={b.kind === "total" ? 0.9 : 0.85} />
              {i < bars.length - 1 && <line x1={x + bw} x2={x + band} y1={y(b.to)} y2={y(b.to)} stroke="var(--color-line-strong)" strokeDasharray="2 2" />}
              <text x={x + bw / 2} y={top - 5} textAnchor="middle" className="fill-ink-2 font-data text-[10px]">
                {b.kind === "step" && b.value > 0 ? "+" : ""}
                {format(b.value)}
              </text>
              <text x={x + bw / 2} y={h - pb + 14} textAnchor="middle" className="fill-ink-3 text-[10px]">
                {b.label}
              </text>
            </g>
          );
        })}
      </svg>
      <SrTable caption={label} rows={bars.map((b) => [b.label, format(b.value)])} />
    </figure>
  );
}
