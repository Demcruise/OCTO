"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAQ } from "@/lib/landing-content";
import { DUR, EASE, focusRing } from "./primitives";

function Item({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const id = useId();
  const reduce = useReducedMotion();
  return (
    <li className="border-b border-line">
      <h4>
        <button
          type="button"
          id={`${id}-q`}
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={onToggle}
          className={cn("flex min-h-14 w-full items-center justify-between gap-6 py-4 text-left text-base font-medium text-ink", focusRing)}
        >
          {q}
          <Plus aria-hidden className={cn("size-4 shrink-0 text-ink-3 transition-transform duration-200", open && "rotate-45 text-accent")} />
        </button>
      </h4>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-a`}
            role="region"
            aria-labelledby={`${id}-q`}
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: DUR.standard, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-5 text-[15px] leading-relaxed text-ink-2">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/** Five governance questions as an accordion, rendered inside the governance section (FAQ-001, IA-001). */
export function FaqList() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="border-t border-line">
      {FAQ.map((f, i) => (
        <Item key={f.q} q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
      ))}
    </ul>
  );
}
