/**
 * Formatting standards (FORMAT-001). One place decides how money, ratios,
 * multiples, and dates read across the app.
 */

const compact = (v: number, digits = 1) => {
  const abs = Math.abs(v);
  if (abs >= 1e9) return `${(v / 1e9).toFixed(digits)}B`;
  if (abs >= 1e6) return `${(v / 1e6).toFixed(digits)}M`;
  if (abs >= 1e3) return `${(v / 1e3).toFixed(digits)}K`;
  return v.toFixed(0);
};

/** $486.2M — summaries, KPIs, cards. Negative values in parentheses. */
export function money(v: number, digits = 1): string {
  const s = `$${compact(Math.abs(v), digits)}`;
  return v < 0 ? `(${s})` : s;
}

/** $486,213,400 — tables and detail views that need full precision. */
export function moneyFull(v: number): string {
  const s = `$${Math.abs(v).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  return v < 0 ? `(${s})` : s;
}

/** 18.2% */
export function pct(v: number, digits = 1): string {
  return `${v.toFixed(digits)}%`;
}

/** +0.4 pp / −1.2% — deltas carry an explicit sign and a real minus. */
export function delta(v: number, unit: "%" | "pp" | "×" | "$" = "%", digits = 1): string {
  const sign = v > 0 ? "+" : v < 0 ? "−" : "±";
  const abs = Math.abs(v);
  if (unit === "$") return `${sign}${money(abs)}`;
  if (unit === "×") return `${sign}${abs.toFixed(2)}×`;
  return `${sign}${abs.toFixed(digits)}${unit === "pp" ? " pp" : "%"}`;
}

/** 1.64× */
export function multiple(v: number): string {
  return `${v.toFixed(2)}×`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Sep 29, 2026 — absolute, for anything where ambiguity matters. */
export function date(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/** 13:42 UTC */
export function time(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")} UTC`;
}

/** 2h ago — relative to `now`, for activity streams. */
export function ago(iso: string, now: Date = new Date()): string {
  const s = Math.max(0, Math.round((now.getTime() - new Date(iso).getTime()) / 1000));
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)}d ago`;
  return date(iso);
}
