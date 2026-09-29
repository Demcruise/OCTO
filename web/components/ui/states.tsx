"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { AlertTriangle, CheckCircle2, CircleSlash, Info, RotateCw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, IconButton } from "./button";

/* ---------- Skeleton: preserves final geometry (STATE-001) ---------- */

export function Skeleton({ className }: { className?: string }) {
  return <span aria-hidden className={cn("block animate-pulse rounded-sm bg-muted motion-reduce:animate-none", className)} />;
}

/* ---------- Empty / error ---------- */

/** Explains what is missing, why it matters, and what creates the first item. */
export function EmptyState({ icon, title, body, action, className }: { icon?: React.ReactNode; title: string; body: string; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-12 text-center", className)}>
      <span className="flex size-9 items-center justify-center rounded-lg border border-line bg-subtle text-ink-3 [&_svg]:size-4">{icon ?? <CircleSlash />}</span>
      <p className="mt-3 text-sm font-medium text-ink">{title}</p>
      <p className="mt-1 max-w-sm text-[13px] text-ink-3">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/** What failed, scope, retry, reference id (STATE-001). */
export function ErrorState({ title, scope, reference, onRetry }: { title: string; scope: string; reference?: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <span className="flex size-9 items-center justify-center rounded-lg border border-danger/30 bg-danger/10 text-danger">
        <AlertTriangle aria-hidden className="size-4" />
      </span>
      <p className="mt-3 text-sm font-medium text-ink">{title}</p>
      <p className="mt-1 max-w-sm text-[13px] text-ink-3">{scope}</p>
      {reference && <p className="mt-1 font-data text-[11px] text-ink-3">Reference {reference}</p>}
      {onRetry && (
        <Button className="mt-4" size="sm" onClick={onRetry}>
          <RotateCw /> Retry
        </Button>
      )}
    </div>
  );
}

/* ---------- Freshness (FRESHNESS-001) ---------- */

export type Freshness = "live" | "recent" | "stale" | "delayed" | "failed" | "demo";

const FRESH: Record<Freshness, { label: string; dot: string }> = {
  live: { label: "Live", dot: "bg-ok" },
  recent: { label: "Updated recently", dot: "bg-ok" },
  stale: { label: "Stale", dot: "bg-warn" },
  delayed: { label: "Delayed", dot: "bg-warn" },
  failed: { label: "Refresh failed", dot: "bg-danger" },
  demo: { label: "Demo data", dot: "bg-info" },
};

/** One freshness vocabulary everywhere; never hides stale data (STATE-001). */
export function FreshnessBadge({ state, asOf, className }: { state: Freshness; asOf?: string; className?: string }) {
  const f = FRESH[state];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[12px] text-ink-3", className)}>
      <span aria-hidden className={cn("size-1.5 rounded-full", f.dot)} />
      <span className="font-medium text-ink-2">{f.label}</span>
      {asOf && <span>· {asOf}</span>}
    </span>
  );
}

/* ---------- Toast ---------- */

type ToastItem = { id: number; title: string; body?: string; tone: "ok" | "info" | "danger" };
const ToastCtx = createContext<(t: Omit<ToastItem, "id">) => void>(() => undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const push = useCallback((t: Omit<ToastItem, "id">) => {
    const id = Date.now() + Math.random();
    setItems((xs) => [...xs, { ...t, id }]);
    window.setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 5000);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[90] flex w-80 flex-col gap-2">
        {items.map((t) => (
          <div key={t.id} role="status" className="pointer-events-auto flex items-start gap-3 rounded-lg border border-line bg-raised p-3 text-ink shadow-popover">
            {t.tone === "ok" && <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-ok" />}
            {t.tone === "info" && <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-info" />}
            {t.tone === "danger" && <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0 text-danger" />}
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium">{t.title}</p>
              {t.body && <p className="mt-0.5 text-[12px] text-ink-3">{t.body}</p>}
            </div>
            <IconButton size="sm" label="Dismiss" icon={<X />} onClick={() => setItems((xs) => xs.filter((x) => x.id !== t.id))} />
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
