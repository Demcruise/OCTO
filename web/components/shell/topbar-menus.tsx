"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Bell, CircleHelp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormat } from "@/lib/use-format";
import { DEMO_NOW, NOTIFICATIONS, type Severity } from "@/lib/demo";
import { IconButton, ring, ringInset } from "@/components/ui/button";
import { Kbd } from "@/components/ui/badge";
import { PopoverPanel, useDismissable } from "@/components/ui/overlay";
import { SHORTCUTS } from "./shortcuts";

const SEV_DOT: Record<Severity, string> = { critical: "bg-danger", high: "bg-warn", medium: "bg-info", low: "bg-ink-4" };
const chrome = "border border-line-strong bg-surface text-ink-2 hover:bg-hover hover:text-ink";

/* ---------- Notification center ---------- */

export function NotificationCenter() {
  const f = useFormat();
  const { open, setOpen, close, rootRef, triggerRef } = useDismissable();
  const [read, setRead] = useState<Set<string>>(() => new Set(NOTIFICATIONS.filter((n) => !n.unread).map((n) => n.id)));
  const unread = NOTIFICATIONS.filter((n) => !read.has(n.id)).length;
  const now = new Date(DEMO_NOW);
  return (
    <div ref={rootRef} className="relative">
      <IconButton
        ref={triggerRef}
        className={chrome}
        label={unread ? `Notifications, ${unread} unread` : "Notifications"}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        icon={
          <span className="relative">
            <Bell />
            {unread > 0 && <span aria-hidden className="absolute -right-1 -top-1 size-2 rounded-full bg-accent ring-2 ring-surface" />}
          </span>
        }
      />
      {open && (
        <PopoverPanel role="dialog" aria-label="Notifications" className="w-[min(22rem,calc(100vw-1.5rem))]">
          <div className="flex items-center justify-between border-b border-line px-3 py-2.5">
            <p className="text-[13px] font-semibold">Notifications</p>
            <button type="button" disabled={!unread} onClick={() => setRead(new Set(NOTIFICATIONS.map((n) => n.id)))} className={cn("cursor-pointer rounded-sm text-[12px] font-medium text-accent hover:underline disabled:cursor-default disabled:text-ink-4 disabled:no-underline", ring)}>
              Mark all read
            </button>
          </div>
          <ul className="max-h-80 overflow-y-auto py-1">
            {NOTIFICATIONS.map((n) => (
              <li key={n.id}>
                <Link href={n.href} onClick={() => (setRead((s) => new Set(s).add(n.id)), close(false))} className={cn("flex gap-2.5 px-3 py-2 hover:bg-hover", ringInset)}>
                  <span aria-hidden className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", SEV_DOT[n.severity])} />
                  <span className="min-w-0 flex-1">
                    <span className={cn("block text-[13px] leading-snug", read.has(n.id) ? "text-ink-2" : "font-medium text-ink")}>{n.title}</span>
                    <span className="mt-0.5 block text-[12px] text-ink-3">
                      <span className="capitalize">{n.severity}</span> · {n.entity} · {f.ago(n.at, now)}
                    </span>
                  </span>
                  {!read.has(n.id) && <span className="sr-only">Unread</span>}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-line px-3 py-2 text-[11px] text-ink-4">
            <span>Demo notifications</span>
            <Link href="/app/settings?tab=notifications" onClick={() => close(false)} className="font-medium text-accent hover:underline">
              Preferences
            </Link>
          </div>
        </PopoverPanel>
      )}
    </div>
  );
}

/* ---------- Help & shortcuts ---------- */

export function HelpButton({ onShortcuts }: { onShortcuts: () => void }) {
  return <IconButton className={chrome} label="Keyboard shortcuts  ?" icon={<CircleHelp />} onClick={onShortcuts} />;
}

export function ShortcutsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      prev?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);
  if (!open || !mounted) return null;
  const groups = ["Global", "Navigation", "Tables"] as const;
  return createPortal(
    <div className="fixed inset-0 z-[85] flex items-center justify-center px-4">
      <div aria-hidden className="absolute inset-0 bg-black/40 motion-safe:animate-[fade-in_140ms_ease-out]" onClick={onClose} />
      <div ref={ref} role="dialog" aria-modal="true" aria-label="Keyboard shortcuts" className="relative max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-line bg-raised p-5 text-ink shadow-dialog motion-safe:animate-[pop-in_160ms_var(--ease-out-soft)]">
        <div className="flex items-center justify-between">
          <h2 className="text-section font-semibold">Keyboard shortcuts</h2>
          <IconButton size="sm" label="Close" icon={<X />} onClick={onClose} />
        </div>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          {groups.map((g) => (
            <section key={g} className={g === "Navigation" ? "sm:row-span-2" : undefined}>
              <h3 className="text-label uppercase text-ink-4">{g}</h3>
              <ul className="mt-2">
                {SHORTCUTS.filter((s) => s.group === g).map((s) => (
                  <li key={s.label} className="flex items-center justify-between gap-3 border-b border-line py-1.5 text-[13px] text-ink-2 last:border-0">
                    {s.label}
                    <span className="flex gap-1">
                      {s.keys.map((k) => (
                        <Kbd key={k}>{k}</Kbd>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>,
    document.querySelector(".octo-app") ?? document.body,
  );
}

/* ---------- Display: density · number format ---------- */
