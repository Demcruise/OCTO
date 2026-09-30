import Link from "next/link";
import { cn } from "@/lib/utils";

export type Tone = "neutral" | "accent" | "ok" | "warn" | "danger" | "info" | "ai";

const TONE: Record<Tone, string> = {
  neutral: "border-line bg-muted text-ink-2",
  accent: "border-accent-line bg-accent-soft text-accent-ink",
  ok: "border-ok/20 bg-ok/10 text-ok",
  warn: "border-warn/25 bg-warn/10 text-warn",
  danger: "border-danger/20 bg-danger/10 text-danger",
  info: "border-info/20 bg-info/10 text-info",
  ai: "border-ai/25 bg-ai/10 text-ai",
};

/** Status text never relies on colour alone: the label is always present (plan §29). */
export function StatusBadge({ tone = "neutral", dot = true, className, children }: { tone?: Tone; dot?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex h-5 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xs border px-1.5 text-[11px] font-medium leading-none", TONE[tone], className)}>
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

/** Uppercase category tag (Vestra news tag, sized up for legibility). */
export function Tag({ tone = "neutral", className, children }: { tone?: Tone; className?: string; children: React.ReactNode }) {
  return <span className={cn("inline-flex h-4.5 items-center rounded-xs px-1.5 text-[10px] font-semibold uppercase tracking-[0.06em]", TONE[tone], "border-0", className)}>{children}</span>;
}

/** Count badge — reserved for actionable counts. */
export function CountBadge({ children, tone = "neutral", className }: { children: React.ReactNode; tone?: "neutral" | "accent" | "danger"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-xs px-1 text-[10px] font-semibold tabular-nums leading-none",
        tone === "neutral" && "bg-muted text-ink-2",
        tone === "accent" && "bg-accent-fill text-white",
        tone === "danger" && "bg-danger/12 text-danger",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A typed reference to an ontology object: type label + name. Links drill down (plan §23). */
export function EntityChip({ type, name, href, className }: { type: string; name: string; href?: string; className?: string }) {
  const body = (
    <>
      <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-ink-4">{type}</span>
      <span className="truncate text-ink">{name}</span>
    </>
  );
  const cls = cn("inline-flex h-5 max-w-full items-center gap-1.5 rounded-xs border border-line bg-surface px-1.5 text-[12px]", className);
  return href ? (
    <Link href={href} className={cn(cls, "hover:border-accent-line hover:text-accent focus-visible:outline-2 focus-visible:outline-accent")}>
      {body}
    </Link>
  ) : (
    <span className={cls}>{body}</span>
  );
}

export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return <kbd className={cn("inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-xs border border-line bg-subtle px-1 font-data text-[10px] text-ink-3", className)}>{children}</kbd>;
}

/** Square monogram used where a logo would sit (entity cells, object headers). */
export function Monogram({ name, size = "md", className }: { name: string; size?: "sm" | "md" | "lg"; className?: string }) {
  const initials = name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const hue = [...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7);
  return (
    <span
      aria-hidden
      style={{ backgroundColor: `hsl(${hue} 70% 94%)`, color: `hsl(${hue} 60% 24%)` }}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md font-semibold",
        size === "sm" && "size-6 text-[10px]",
        size === "md" && "size-8 text-[11px]",
        size === "lg" && "size-12 rounded-lg text-[15px]",
        className,
      )}
    >
      {initials}
    </span>
  );
}
