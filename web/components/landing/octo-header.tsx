"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ANNOUNCEMENT, CTA_HREF, NAV, SEARCH_TARGETS, SIGN_IN_HREF } from "./content";
import { focusRing } from "./ui";

export function OctoMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={cn("size-6", className)}>
      <rect x="1.5" y="1.5" width="21" height="21" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
    </svg>
  );
}

/** Thin announcement strip above the header (Ondo pattern, original copy). */
export function AnnouncementBar() {
  return (
    <div data-anim="nav" className="border-b border-octo-hairline bg-octo-surface">
      <p className="mx-auto flex max-w-[1440px] items-center justify-center gap-3 px-5 py-2 text-center text-[13px] text-octo-text-muted md:px-[30px]">
        <span>{ANNOUNCEMENT.text}</span>
        <a href={ANNOUNCEMENT.link.href} className={cn("inline-flex shrink-0 items-center gap-1 font-medium text-octo-ink hover:underline", focusRing)}>
          {ANNOUNCEMENT.link.label} <ArrowRight aria-hidden className="size-3.5" />
        </a>
      </p>
    </div>
  );
}

/**
 * Header (megaplan §02): white surface, thin border, compact height, concise
 * navigation, search, rectangular Request access, and a menu on small screens.
 */
export function OctoHeader() {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        setSearch(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearch((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header data-anim="nav" className={cn("sticky top-0 z-50 border-b bg-white/95 backdrop-blur transition-colors duration-200", scrolled ? "border-octo-border" : "border-octo-hairline")}>
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-6 px-5 md:px-[30px]">
        <a href="#top" aria-label="OCTO home" className={cn("flex items-center gap-2 rounded-sm text-octo-ink", focusRing)}>
          <OctoMark />
          <span className="font-o-display text-[17px] font-medium tracking-[0.14em]">OCTO</span>
        </a>

        <nav aria-label="Primary" className="mx-auto hidden lg:block">
          <ul className="flex items-center gap-8">
            {NAV.map((n) => (
              <li key={n.label}>
                <a href={n.href} className={cn("rounded-sm text-[14px] text-octo-text-muted transition-colors hover:text-octo-ink", focusRing)}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <button type="button" aria-label="Search OCTO" aria-expanded={search} aria-keyshortcuts="Control+K Meta+K" onClick={() => setSearch((v) => !v)} className={cn("flex size-10 cursor-pointer items-center justify-center rounded-md text-octo-ink hover:bg-octo-muted", focusRing)}>
            <Search aria-hidden className="size-[18px]" />
          </button>
          <a href={SIGN_IN_HREF} className={cn("hidden h-10 items-center rounded-md px-3 text-[14px] text-octo-text-muted hover:text-octo-ink md:flex", focusRing)}>
            Sign in
          </a>
          <a href={CTA_HREF} className={cn("flex h-10 items-center whitespace-nowrap rounded-md bg-octo-ink px-3 text-[13px] font-medium text-white transition-colors hover:bg-black sm:px-4 sm:text-[14px]", focusRing)}>
            Request access
          </a>
          <button type="button" aria-label={menu ? "Close menu" : "Open menu"} aria-expanded={menu} aria-controls="octo-menu" onClick={() => setMenu((v) => !v)} className={cn("flex size-10 cursor-pointer items-center justify-center rounded-md text-octo-ink hover:bg-octo-muted lg:hidden", focusRing)}>
            {menu ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>
      </div>

      {menu && (
        <nav id="octo-menu" aria-label="Menu" className="border-t border-octo-hairline bg-white lg:hidden">
          <ul className="mx-auto max-w-[1440px] px-5 py-3">
            {NAV.map((n) => (
              <li key={n.label}>
                <a href={n.href} onClick={() => setMenu(false)} className={cn("flex min-h-12 items-center justify-between border-b border-octo-hairline font-o-display text-[22px] text-octo-ink", focusRing)}>
                  {n.label} <ArrowRight aria-hidden className="size-4 text-octo-text-light" />
                </a>
              </li>
            ))}
            <li>
              <a href={SIGN_IN_HREF} className={cn("flex min-h-12 items-center text-[15px] text-octo-text-muted", focusRing)}>
                Sign in
              </a>
            </li>
          </ul>
        </nav>
      )}

      {search && <SearchPanel onClose={() => setSearch(false)} />}
    </header>
  );
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    input.current?.focus();
    return () => prev?.focus?.({ preventScroll: true });
  }, []);
  const hits = SEARCH_TARGETS.filter((t) => `${t.label} ${t.hint}`.toLowerCase().includes(q.trim().toLowerCase()));
  const go = (href: string) => {
    onClose();
    window.location.hash = href.replace(/^#/, "");
  };
  return (
    <div className="absolute inset-x-0 top-full border-b border-octo-border bg-white shadow-[0_12px_32px_rgb(30_33_36/0.08)]">
      <div role="dialog" aria-label="Search OCTO" className="mx-auto max-w-[760px] px-5 py-5">
        <div className="flex items-center gap-3 border-b border-octo-border pb-3">
          <Search aria-hidden className="size-5 text-octo-text-light" />
          <input
            ref={input}
            role="combobox"
            aria-expanded="true"
            aria-controls="octo-search-list"
            aria-activedescendant={hits[active] ? `octo-search-${active}` : undefined}
            value={q}
            onChange={(e) => (setQ(e.target.value), setActive(0))}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") (e.preventDefault(), setActive((a) => Math.min(hits.length - 1, a + 1)));
              if (e.key === "ArrowUp") (e.preventDefault(), setActive((a) => Math.max(0, a - 1)));
              if (e.key === "Enter" && hits[active]) (e.preventDefault(), go(hits[active].href));
            }}
            placeholder="Search the platform"
            className="flex-1 bg-transparent font-o-display text-[22px] text-octo-ink placeholder:text-octo-text-light focus:outline-none"
          />
          <button type="button" onClick={onClose} aria-label="Close search" className={cn("flex size-9 cursor-pointer items-center justify-center rounded-md hover:bg-octo-muted", focusRing)}>
            <X aria-hidden className="size-4" />
          </button>
        </div>
        <ul id="octo-search-list" role="listbox" className="mt-2 max-h-72 overflow-y-auto">
          {hits.map((t, i) => (
            <li key={t.label} id={`octo-search-${i}`} role="option" aria-selected={i === active} onMouseMove={() => setActive(i)} onClick={() => go(t.href)} className={cn("flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-[15px]", i === active ? "bg-octo-muted text-octo-ink" : "text-octo-text-muted")}>
              {t.label}
              <span className="font-data text-o-label uppercase text-octo-text-light">{t.hint}</span>
            </li>
          ))}
          {hits.length === 0 && <li className="px-3 py-6 text-center text-[14px] text-octo-text-muted">No matches for “{q}”.</li>}
        </ul>
      </div>
    </div>
  );
}
