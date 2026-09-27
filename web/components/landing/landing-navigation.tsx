"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CTA_HREF, NAV, SIGN_IN_HREF, type NavGroup } from "@/lib/landing-content";
import { Container, DUR, EASE, focusRing } from "./primitives";

export function OctoWordmark({ inverse }: { inverse?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2 text-[15px] font-semibold tracking-[0.18em]", inverse ? "text-white" : "text-ink")}>
      <svg aria-hidden viewBox="0 0 20 20" className="size-5">
        <circle cx="10" cy="10" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="10" r="2.5" className="fill-accent" />
      </svg>
      OCTO
    </span>
  );
}

function DesktopMenu({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => {
        if (!wrapRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          wrapRef.current?.querySelector("button")?.focus();
        }
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-9 items-center gap-1 rounded-md px-3 text-sm text-ink-2 transition-colors hover:text-ink",
          open && "text-ink",
          focusRing,
        )}
      >
        {group.label}
        <ChevronDown aria-hidden className={cn("size-3.5 transition-transform duration-150", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            initial={reduce ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4, transition: { duration: DUR.fast } }}
            transition={{ duration: DUR.standard, ease: EASE }}
            className="absolute left-0 top-full z-50 pt-2"
          >
            <ul className="w-[340px] rounded-lg border border-line bg-canvas p-1.5 shadow-[0_8px_24px_-12px_rgb(17_19_24/0.18)]">
              {group.links.map((link) => (
                <li key={link.title}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn("block rounded-md px-3 py-2.5 transition-colors hover:bg-subtle", focusRing)}
                  >
                    <span className="block text-sm font-medium text-ink">{link.title}</span>
                    {link.description && <span className="mt-0.5 block text-[13px] text-ink-3">{link.description}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      id="mobile-menu"
      ref={panelRef}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DUR.standard }}
      className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-line bg-canvas lg:hidden"
    >
      <Container className="flex min-h-full flex-col py-6">
        <nav aria-label="Mobile" className="flex-1 space-y-7">
          {NAV.map((group) => (
            <div key={group.label}>
              <p className="font-data text-meta uppercase text-ink-3">{group.label}</p>
              <ul className="mt-2 divide-y divide-line border-y border-line">
                {group.links.map((link) => (
                  <li key={link.title}>
                    <a href={link.href} onClick={onClose} className={cn("block py-3 text-[15px] text-ink", focusRing)}>
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="sticky bottom-0 mt-8 grid grid-cols-2 gap-3 bg-canvas pb-2 pt-4">
          <a href={SIGN_IN_HREF} className={cn("flex h-11 items-center justify-center rounded-md border border-line-strong text-sm font-medium text-ink", focusRing)}>
            Sign in
          </a>
          <a href={CTA_HREF} onClick={onClose} className={cn("flex h-11 items-center justify-center rounded-md bg-accent text-sm font-medium text-white", focusRing)}>
            Request access
          </a>
        </div>
      </Container>
    </motion.div>
  );
}

/** Sticky institutional navigation (NAV-001/002/003). */
export function LandingNavigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || mobileOpen;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-200",
        solid
          ? "border-line bg-canvas shadow-[0_1px_2px_rgb(17_19_24/0.04)]"
          : "border-transparent bg-canvas",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-6">
        <a href="#top" aria-label="OCTO home" className={cn("rounded-sm", focusRing)}>
          <OctoWordmark />
        </a>

        <nav aria-label="Primary" className="hidden flex-1 items-center gap-1 lg:flex">
          {NAV.map((group) => (
            <DesktopMenu key={group.label} group={group} />
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a href={SIGN_IN_HREF} className={cn("flex h-9 items-center rounded-md px-3 text-sm text-ink-2 hover:text-ink", focusRing)}>
            Sign in
          </a>
          <a
            href={CTA_HREF}
            className={cn("flex h-9 items-center rounded-md bg-accent px-4 text-sm font-medium text-white transition-colors hover:bg-accent-hover", focusRing)}
          >
            Request access
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <a href={CTA_HREF} className={cn("flex h-9 items-center rounded-md bg-accent px-3 text-sm font-medium text-white", focusRing, mobileOpen && "invisible")}>
            Request access
          </a>
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
            className={cn("flex size-9 items-center justify-center rounded-md border border-line text-ink", focusRing)}
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </Container>
      <AnimatePresence>{mobileOpen && <MobileMenu onClose={closeMobile} />}</AnimatePresence>
    </header>
  );
}
