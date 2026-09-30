"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormat } from "@/lib/use-format";

/**
 * Signed change. Colour follows whether the move is *good*, not its sign
 * (a falling cost is green). The arrow shows direction; text says good/bad for
 * screen readers so colour is never the only signal (plan §29).
 */
export function Delta({ value, unit = "%", upIsGood, pill, className, digits }: { value: number; unit?: "%" | "pts" | "×" | "$" | ""; upIsGood?: boolean; pill?: boolean; className?: string; digits?: number }) {
  const f = useFormat();
  const dir = value > 0 ? "up" : value < 0 ? "down" : "flat";
  const good = upIsGood === undefined || dir === "flat" ? undefined : (dir === "up") === upIsGood;
  const Arrow = dir === "up" ? ArrowUpRight : dir === "down" ? ArrowDownRight : Minus;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 whitespace-nowrap text-[12px] font-medium tabular-nums",
        good === true && "text-ok",
        good === false && "text-danger",
        good === undefined && "text-ink-3",
        pill && "h-5 rounded-xs px-1.5",
        pill && good === true && "bg-ok/10",
        pill && good === false && "bg-danger/10",
        pill && good === undefined && "bg-muted",
        className,
      )}
    >
      <Arrow aria-hidden className="size-3.5" />
      {f.delta(value, unit, digits)}
      {good !== undefined && <span className="sr-only">{good ? " (favourable)" : " (unfavourable)"}</span>}
    </span>
  );
}
