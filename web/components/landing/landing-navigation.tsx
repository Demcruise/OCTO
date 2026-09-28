"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CTA_HREF, NAV_LINKS, SIGN_IN_HREF } from "@/lib/landing-content";
import { Container, DUR, EASE, focusRing } from "./primitives";

export function OctoWordmark({ inverse = true }: { inverse?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5 text-[15px] font-semibold tracking-[0.22em]", inverse ? "text-white" : "text-ink")}>
      <svg aria-hidden viewBox="0 0 48 48" className="size-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4.2">
        <ellipse cx="26" cy="26" rx="8.2" ry="7.2" fill="currentColor" stroke="none" />
        <path d="M20 26H4" />
        <path d="M23 21 13 5" />
        <path d="M31 20 41 6" />
        <path d="M22 31 15 44" />
        <path d="M29 32 29 45" />
        <path d="M34 26 41 24.5" />
      </svg>
      OCTO
    </span>
  );
}

type Panel = "search" | "menu" | null;

function LinkList({ links, onClose, query = "" }: { links: typeof NAV_LINKS; onClose: () => void; query?: string }) {
  const q = query.trim().toLowerCase();
  const shown = q ? links.filter((l) => `${l.title} ${l.description ?? ""}`.toLowerCase().includes(q)) : links;
  return (
    <ul className="divide-y divide-line border-y border-line">
      {shown.map((link) => (
        <li key={link.title}>
          <a
            href={link.href}
            onClick={onClose}
            className={cn("group flex min-h-14 items-center justify-between gap-6 py-3", focusRing)}
          >
            <span>
              <span className="block text-lg font-medium tracking-tight text-ink group-hover:text-accent">{link.title}</span>
              {link.description && <span className="mt-0.5 block text-[13px] text-ink-3">{link.description}</span>}
            </span>
            <ArrowUpRight aria-hidden className="size-4 shrink-0 text-ink-3 transition-colors group-hover:text-accent" />
          </a>
        </li>
      ))}
      {shown.length === 0 && <li className="py-6 text-[13px] text-ink-3">No matching pages.</li>}
    </ul>
  );
}

/** Minimal header (PAL-013): wordmark, Request access, search and menu controls. */
export function LandingNavigation() {
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const light = scrolled || panel !== null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openPanel = useCallback((next: Panel) => {
    setPanel((cur) => (cur === next ? null : next));
    setQuery("");
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = panel ? "hidden" : prev;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPanel(null);
    window.addEventListener("keydown", onKey);
    if (panel === "search") inputRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [panel]);

  const iconBtn = cn(
    "grid size-11 place-items-center border transition-colors",
    light ? "border-line text-ink hover:border-line-strong" : "border-white/20 text-white hover:border-white/50",
    light ? focusRing : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-void",
  );

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200",
          light ? "border-line bg-canvas/95 text-ink backdrop-blur-sm" : "border-white/10 bg-void/40 text-white",
        )}
      >
        <Container className="flex h-16 items-center justify-between gap-4 md:h-[86px]">
          <a href="#top" aria-label="OCTO home" className={light ? focusRing : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"}>
            <OctoWordmark inverse={!light} />
          </a>

          <div className="flex items-center gap-2">
            <a
              href={CTA_HREF}
              className={cn(
                "hidden h-11 items-center px-5 text-sm font-medium transition-colors sm:inline-flex",
                light ? "bg-ink text-white hover:bg-ink-2" : "bg-white text-void hover:bg-subtle",
                focusRing,
              )}
            >
              Request access
            </a>
            <button type="button" aria-label="Search" aria-expanded={panel === "search"} onClick={() => openPanel("search")} className={iconBtn}>
              {panel === "search" ? <X aria-hidden className="size-4" /> : <Search aria-hidden className="size-4" />}
            </button>
            <button
              type="button"
              aria-label={panel === "menu" ? "Close menu" : "Open menu"}
              aria-expanded={panel === "menu"}
              onClick={() => openPanel("menu")}
              className={iconBtn}
            >
              {panel === "menu" ? <X aria-hidden className="size-4" /> : <Menu aria-hidden className="size-4" />}
            </button>
          </div>
        </Container>
      </header>

      <AnimatePresence>
        {panel && (
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.standard, ease: EASE }}
            className="fixed inset-0 z-40 overflow-y-auto bg-canvas text-ink"
          >
            <Container className="pt-28 md:pt-36">
              {panel === "search" ? (
                <div className="mx-auto max-w-3xl pb-16">
                  <label htmlFor="nav-search" className="font-data text-meta uppercase text-ink-3">
                    Search OCTO
                  </label>
                  <input
                    ref={inputRef}
                    id="nav-search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Sections, topics, pages"
                    className="mt-4 w-full border-b border-ink bg-transparent py-4 text-3xl font-medium tracking-tight placeholder:text-ink-3 focus:outline-none md:text-4xl"
                  />
                  <div className="mt-8">
                    <LinkList links={NAV_LINKS} onClose={() => setPanel(null)} query={query} />
                  </div>
                </div>
              ) : (
                <div className="mx-auto max-w-3xl pb-16">
                  <p className="font-data text-meta uppercase text-ink-3">Menu</p>
                  <div className="mt-8">
                    <LinkList links={NAV_LINKS} onClose={() => setPanel(null)} />
                  </div>
                  <div className="mt-10 flex gap-3">
                    <a href={CTA_HREF} onClick={() => setPanel(null)} className={cn("inline-flex h-11 items-center bg-ink px-5 text-sm font-medium text-white hover:bg-ink-2", focusRing)}>
                      Request access
                    </a>
                    <a href={SIGN_IN_HREF} className={cn("inline-flex h-11 items-center border border-line-strong px-5 text-sm font-medium hover:border-ink-3", focusRing)}>
                      Sign in
                    </a>
                  </div>
                </div>
              )}
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
