"use client";

import { forwardRef, useRef } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ring, ringInset } from "./button";

/* ---------- Tabs (roving focus, arrow keys) ---------- */

export function Tabs<T extends string>({
  value,
  onChange,
  items,
  label,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  items: { value: T; label: string; count?: number }[];
  label: string;
  className?: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const i = items.findIndex((t) => t.value === value);
  const onKeyDown = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: items.length - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const n = (map[e.key] + items.length) % items.length;
    onChange(items[n].value);
    refs.current[n]?.focus();
  };
  return (
    <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className={cn("no-scrollbar flex h-10 items-stretch gap-4 overflow-x-auto overflow-y-hidden border-b border-line", className)}>
      {items.map((t, k) => (
        <button
          key={t.value}
          ref={(el) => {
            refs.current[k] = el;
          }}
          role="tab"
          type="button"
          aria-selected={t.value === value}
          tabIndex={t.value === value ? 0 : -1}
          onClick={() => onChange(t.value)}
          className={cn(
            "-mb-px flex shrink-0 cursor-pointer items-center gap-1.5 border-b-2 text-[13px] transition-colors",
            t.value === value ? "border-accent font-medium text-ink" : "border-transparent text-ink-3 hover:text-ink",
            ringInset,
          )}
        >
          {t.label}
          {t.count !== undefined && <span className="font-data text-[11px] tabular-nums text-ink-3">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

/* ---------- Segmented control (radiogroup) ---------- */

export function Segmented<T extends string>({
  value,
  onChange,
  items,
  label,
  size = "md",
}: {
  value: T;
  onChange: (v: T) => void;
  items: { value: T; label: string }[];
  label: string;
  size?: "sm" | "md";
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-md border border-line bg-subtle p-0.5">
      {items.map((t) => (
        <button
          key={t.value}
          type="button"
          role="radio"
          aria-checked={t.value === value}
          onClick={() => onChange(t.value)}
          className={cn(
            "cursor-pointer rounded-[3px] px-2.5 font-medium transition-colors",
            size === "sm" ? "h-6 text-[11px]" : "h-7 text-[12px]",
            t.value === value ? "bg-surface text-ink shadow-[0_0_0_1px_var(--color-line)]" : "text-ink-3 hover:text-ink",
            ring,
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- Inputs ---------- */

const field =
  "h-8 w-full rounded-md border border-line-strong bg-surface px-2.5 text-[13px] text-ink placeholder:text-ink-4 transition-colors hover:border-ink-4 focus:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25 disabled:cursor-not-allowed disabled:text-ink-4";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn(field, className)} {...props} />;
});

export const SearchInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function SearchInput({ className, ...props }, ref) {
  return (
    <div className={cn("relative", className)}>
      <Search aria-hidden className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-3" />
      <input ref={ref} type="search" className={cn(field, "pl-8")} {...props} />
    </div>
  );
});

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={cn("relative", className)}>
      <select className={cn(field, "cursor-pointer appearance-none pr-7")} {...props}>
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-ink-3" />
    </div>
  );
}

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn(field, "h-auto min-h-20 resize-y py-2", className)} {...props} />;
});

export function Checkbox({ checked, indeterminate, onChange, label, className }: { checked: boolean; indeterminate?: boolean; onChange: (v: boolean) => void; label: string; className?: string }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-[3px] border transition-colors",
        checked || indeterminate ? "border-accent bg-accent text-white" : "border-line-strong bg-surface hover:border-ink-4",
        ring,
        className,
      )}
    >
      {checked && !indeterminate && <Check aria-hidden className="size-3" strokeWidth={3} />}
      {indeterminate && <span aria-hidden className="h-0.5 w-2 bg-white" />}
    </button>
  );
}

/** Label + control + hint/error. Errors are linked with aria-describedby. */
export function Field({ id, label, hint, error, required, children }: { id: string; label: string; hint?: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-[12px] font-medium text-ink-2">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-[12px] text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1 text-[12px] text-ink-3">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
