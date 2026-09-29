import { cn } from "@/lib/utils";

export type Tone = "neutral" | "accent" | "ok" | "warn" | "danger" | "info";

const TONE: Record<Tone, string> = {
  neutral: "border-line bg-subtle text-ink-2",
  accent: "border-accent-line bg-accent-soft text-accent",
  ok: "border-ok/25 bg-ok/10 text-ok",
  warn: "border-warn/30 bg-warn/10 text-warn",
  danger: "border-danger/25 bg-danger/10 text-danger",
  info: "border-info/25 bg-info/10 text-info",
};

/** Status text never relies on colour alone: the label is always present (A11Y-001). */
export function StatusBadge({ tone = "neutral", dot = true, className, children }: { tone?: Tone; dot?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex h-5 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-sm border px-1.5 text-[11px] font-medium leading-none", TONE[tone], className)}>
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

/** Count badge — reserved for actionable counts (SHELL-001.1). */
export function CountBadge({ children, tone = "neutral", className }: { children: React.ReactNode; tone?: "neutral" | "accent" | "danger"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-sm px-1 font-data text-[10px] tabular-nums leading-none",
        tone === "neutral" && "bg-muted text-ink-2",
        tone === "accent" && "bg-accent text-white",
        tone === "danger" && "bg-danger text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A typed reference to an ontology object: type label + name (COMP-001 EntityChip). */
export function EntityChip({ type, name, href, className }: { type: string; name: string; href?: string; className?: string }) {
  const body = (
    <>
      <span className="font-data text-[10px] uppercase tracking-[0.06em] text-ink-3">{type}</span>
      <span className="truncate text-ink">{name}</span>
    </>
  );
  const cls = cn("inline-flex h-5 max-w-full items-center gap-1.5 rounded-sm border border-line bg-surface px-1.5 text-[12px]", className);
  return href ? (
    <a href={href} className={cn(cls, "hover:border-line-strong focus-visible:outline-2 focus-visible:outline-accent")}>
      {body}
    </a>
  ) : (
    <span className={cls}>{body}</span>
  );
}

export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return <kbd className={cn("inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-sm border border-line bg-subtle px-1 font-data text-[10px] text-ink-3", className)}>{children}</kbd>;
}
