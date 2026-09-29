"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "./button";

/** Open/close state that closes on outside pointer and Escape, returning focus to the trigger. */
export function useDismissable<T extends HTMLElement = HTMLDivElement>() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<T>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback((restore = true) => {
    setOpen(false);
    if (restore) triggerRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return { open, setOpen, close, rootRef, triggerRef };
}

/** Floating panel anchored under its trigger (elevation: popover). */
export function PopoverPanel({ className, align = "end", children, ...props }: React.HTMLAttributes<HTMLDivElement> & { align?: "start" | "end" }) {
  return (
    <div
      className={cn(
        "absolute top-[calc(100%+6px)] z-50 rounded-lg border border-line bg-raised text-ink shadow-popover",
        align === "end" ? "right-0" : "left-0",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Traps Tab inside `ref` while mounted and restores focus to the previously focused element on unmount. */
function useFocusTrap(ref: React.RefObject<HTMLElement | null>, onEscape: () => void) {
  // Keep the latest handler without re-running the trap (which would steal focus on every render).
  const escape = useRef(onEscape);
  escape.current = onEscape;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const el = ref.current;
    el?.querySelector<HTMLElement>("[data-autofocus]")?.focus() ?? el?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        escape.current();
        return;
      }
      if (e.key !== "Tab" || !el) return;
      const items = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus?.({ preventScroll: true });
    };
  }, [ref]);
}

/**
 * Right-hand sheet for object detail, provenance, and review (elevation: dialog).
 * Modal: focus is trapped, Escape and the scrim close it, focus returns to the opener.
 */
export function Sheet({
  open,
  onClose,
  title,
  eyebrow,
  width = "max-w-xl",
  footer,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  eyebrow?: React.ReactNode;
  width?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!open || !mounted) return null;
  return createPortal(
    <SheetBody onClose={onClose} title={title} eyebrow={eyebrow} width={width} footer={footer}>
      {children}
    </SheetBody>,
    document.querySelector(".octo-app") ?? document.body,
  );
}

function SheetBody({ onClose, title, eyebrow, width, footer, children }: Omit<Parameters<typeof Sheet>[0], "open">) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useFocusTrap(ref, onClose);
  return (
    <div className="fixed inset-0 z-[70]">
      <div aria-hidden className="absolute inset-0 bg-black/30 motion-safe:animate-[fade-in_180ms_ease-out]" onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "absolute inset-y-0 right-0 flex w-full flex-col border-l border-line bg-surface text-ink shadow-dialog motion-safe:animate-[slide-in_220ms_cubic-bezier(0.22,1,0.36,1)]",
          width,
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="min-w-0">
            {eyebrow && <p className="text-label uppercase text-ink-3">{eyebrow}</p>}
            <h2 id={titleId} className="mt-0.5 truncate text-[17px] font-semibold tracking-tight">
              {title}
            </h2>
          </div>
          <IconButton label="Close" icon={<X />} onClick={onClose} data-autofocus />
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <footer className="border-t border-line px-5 py-3">{footer}</footer>}
      </div>
    </div>
  );
}

/** Tooltip on hover and focus with a short intent delay (SHELL-001.1 collapsed nav labels). */
export function Tooltip({ label, side = "right", className, children }: { label: string; side?: "right" | "bottom"; className?: string; children: React.ReactElement }) {
  const [show, setShow] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const id = useId();
  const on = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setShow(true), 350);
  };
  const off = () => {
    window.clearTimeout(timer.current);
    setShow(false);
  };
  return (
    <span className={cn("relative inline-flex", className)} onMouseEnter={on} onMouseLeave={off} onFocus={() => setShow(true)} onBlur={off} aria-describedby={show ? id : undefined}>
      {children}
      {show && (
        <span
          id={id}
          role="tooltip"
          className={cn(
            "pointer-events-none absolute z-[80] whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[12px] font-medium text-app shadow-popover",
            side === "right" ? "left-[calc(100%+8px)] top-1/2 -translate-y-1/2" : "left-1/2 top-[calc(100%+6px)] -translate-x-1/2",
          )}
        >
          {label}
        </span>
      )}
    </span>
  );
}
