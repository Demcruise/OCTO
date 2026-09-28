"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CTA_HREF, NAV, SIGN_IN_HREF, type NavGroup } from "@/lib/landing-content";
import { Container, DUR, EASE } from "./primitives";

const darkRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-offset-2 focus-visible:ring-offset-void";

export function OctoWordmark({ inverse = true }: { inverse?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5 text-[15px] font-semibold tracking-[0.22em]", inverse ? "text-white" : "text-ink")}>
      <svg aria-hidden viewBox="0 0 20 20" className="size-5">
        <rect x="1" y="1" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <rect x="7.5" y="7.5" width="5" height="5" className="fill-accent" />
      </svg>
      OCTO
    </span>
  );
}

function DesktopMenu({ group, open, onOpen, onClose }: { group: NavGroup; open: boolean; onOpen: () => void; onClose: () => void }) {
  const panelId = useId();
  const reduce = useReducedMotion();
  const btn = useRef<HTMLButtonElement>(null);

  return (
    <div
      onMouseEnter={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          onClose();
          btn.current?.focus();
        }
      }}
    >
      <button
        ref={btn}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => (open ? onClose() : onOpen())}
        className={cn("flex h-20 items-center gap-1 px-3 text-sm transition-colors", open ? "text-white" : "text-fog hover:text-white", darkRing)}
      >
        {group.label}
        <ChevronDown aria-hidden className={cn("size-3.5 transition-transform duration-150", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: DUR.fast } }}
            transition={{ duration: DUR.standard, ease: EASE }}
            className="absolute inset-x-0 top-full z-50 border-y border-night-line bg-night"
          >
            <Container className="grid grid-cols-12 gap-10 py-10">
              <div className="col-span-3">
                <p className="font-data text-meta uppercase text-accent-light">{group.label}</p>
                {group.intro && <p className="mt-3 text-xl leading-snug text-white">{group.intro}</p>}
              </div>
              <ul className="col-span-9 grid grid-cols-3 gap-x-8 border-l border-night-line pl-10">
                {group.links.map((link) => (
                  <li key={link.title}>
                    <a href={link.href} onClick={onClose} className={cn("group block border-b border-night-line py-4", darkRing)}>
                      <span className="flex items-center justify-between text-[15px] text-white">
                        {link.title}
                        <ArrowUpRight aria-hidden className="size-3.5 text-fog transition-colors group-hover:text-accent-light" />
                      </span>
                      {link.description && <span className="mt-1 block text-[13px] text-fog">{link.description}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileMenu({ onClose, top }: { onClose: () => void; top: number }) {
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
      style={{ top }}
      className="fixed inset-x-0 bottom-0 z-40 overflow-y-auto border-t border-night-line bg-void text-white lg:hidden"
    >
      <Container className="flex min-h-full flex-col py-6">
        <nav aria-label="Mobile" className="flex-1 space-y-8">
          {NAV.map((group) => (
            <div key={group.label}>
              <p className="font-data text-meta uppercase text-accent-light">{group.label}</p>
              <ul className="mt-2 divide-y divide-night-line border-y border-night-line">
                {group.links.map((link) => (
                  <li key={link.title}>
                    <a href={link.href} onClick={onClose} className={cn("flex min-h-12 items-center justify-between py-2 text-[15px]", darkRing)}>
                      {link.title}
                      <ArrowUpRight aria-hidden className="size-3.5 text-fog" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="sticky bottom-0 mt-8 grid grid-cols-2 gap-3 bg-void pb-2 pt-4">
          <a href={SIGN_IN_HREF} className={cn("flex h-11 items-center justify-center rounded-sm border border-night-line text-sm font-medium", darkRing)}>
            Sign in
          </a>
          <a href={CTA_HREF} onClick={onClose} className={cn("flex h-11 items-center justify-center rounded-sm bg-accent text-sm font-medium", darkRing)}>
            Request access
          </a>
        </div>
      </Container>
    </motion.div>
  );
}

/** Compact dark enterprise navigation with multi-column panels (PAL-007). */
export function LandingNavigation() {
  const [scrolled, setScrolled] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(80);
  const headerRef = useRef<HTMLElement>(null);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMobile = () => {
    setMenuTop(headerRef.current?.getBoundingClientRect().bottom ?? 80);
    setMobileOpen((v) => !v);
  };

  return (
    <header
      ref={headerRef}
      onMouseLeave={() => setOpenGroup(null)}
      onBlur={(e) => {
        if (!headerRef.current?.contains(e.relatedTarget as Node)) setOpenGroup(null);
      }}
      className={cn("sticky top-0 z-50 border-b bg-void text-white transition-colors duration-200", scrolled || openGroup || mobileOpen ? "border-night-line" : "border-transparent")}
    >
      <Container className="flex h-20 items-center justify-between gap-6">
        <a href="#top" aria-label="OCTO home" className={darkRing}>
          <OctoWordmark />
        </a>

        <nav aria-label="Primary" className="hidden flex-1 items-center justify-center lg:flex">
          {NAV.map((group) => (
            <DesktopMenu
              key={group.label}
              group={group}
              open={openGroup === group.label}
              onOpen={() => setOpenGroup(group.label)}
              onClose={() => setOpenGroup(null)}
            />
          ))}
        </nav>

        <div className="hidden items-center gap-1 lg:flex">
          <a href={SIGN_IN_HREF} className={cn("flex h-9 items-center px-3 text-sm text-fog hover:text-white", darkRing)}>
            Sign in
          </a>
          <a href={CTA_HREF} className={cn("flex h-9 items-center rounded-sm bg-white px-4 text-sm font-medium text-void transition-colors hover:bg-subtle", darkRing)}>
            Request access
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <a href={CTA_HREF} className={cn("flex h-11 items-center rounded-sm bg-white px-3.5 text-sm font-medium text-void", darkRing, mobileOpen && "invisible")}>
            Request access
          </a>
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={toggleMobile}
            className={cn("flex size-11 items-center justify-center rounded-sm border border-night-line", darkRing)}
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </Container>
      <AnimatePresence>{mobileOpen && <MobileMenu onClose={closeMobile} top={menuTop} />}</AnimatePresence>
    </header>
  );
}
