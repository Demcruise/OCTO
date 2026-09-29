"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, ChevronRight, ChevronsUpDown, Menu, PanelLeftClose, PanelLeftOpen, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePreferences, type Period } from "@/lib/preferences";
import { useWorkspace } from "@/lib/workspace";
import { date } from "@/lib/format";
import { DEMO_NOW } from "@/lib/demo-data";
import { NAV, breadcrumb, isActive, type NavItem } from "@/components/navigation/nav-config";
import { IconButton, ring, ringInset } from "@/components/ui/button";
import { CountBadge, Kbd } from "@/components/ui/badge";
import { PopoverPanel, Tooltip, useDismissable } from "@/components/ui/overlay";
import { Segmented } from "@/components/ui/controls";
import { CommandPalette } from "./command-palette";
import { HelpMenu, NotificationCenter, StatusMenu, ThemeMenu, UserMenu } from "./topbar-menus";

/**
 * Application shell (SHELL-001): collapsible sidebar (232 / 56px), topbar with
 * breadcrumb, search, date scope, status, notifications, help, theme and user,
 * a mobile drawer, and the global command palette.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed, setSidebarCollapsed } = usePreferences();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setDrawerOpen(false), [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest("input, textarea, select, [contenteditable=true]");
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (!typing && e.key === "/" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setPaletteOpen(true);
      } else if (!typing && e.key === "[" && !e.metaKey && !e.ctrlKey) {
        setSidebarCollapsed(!sidebarCollapsed);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarCollapsed, setSidebarCollapsed]);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-app text-ink">
      <a href="#main" className="sr-only z-[100] rounded-md bg-accent px-3 py-2 text-sm text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Skip to content
      </a>

      <aside
        aria-label="Primary"
        className={cn(
          "hidden shrink-0 flex-col border-r border-line bg-subtle transition-[width] duration-200 motion-reduce:transition-none lg:flex",
          sidebarCollapsed ? "w-14" : "w-[232px]",
        )}
      >
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div aria-hidden className="absolute inset-0 bg-black/30 motion-safe:animate-[fade-in_160ms_ease-out]" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-[272px] flex-col border-r border-line bg-subtle shadow-dialog">
            <div className="absolute right-2 top-3">
              <IconButton label="Close navigation" icon={<X />} size="sm" onClick={() => setDrawerOpen(false)} />
            </div>
            <Sidebar collapsed={false} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenDrawer={() => setDrawerOpen(true)} />
        <main id="main" tabIndex={-1} className="min-h-0 flex-1 overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}

/* ---------- Sidebar ---------- */

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle?: () => void }) {
  const pathname = usePathname();
  const listRef = useRef<HTMLDivElement>(null);

  // Arrow keys move between nav rows (SHELL-001.1 keyboard support).
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Home" && e.key !== "End") return;
    const rows = Array.from(listRef.current?.querySelectorAll<HTMLElement>("[data-nav-row]") ?? []);
    const i = rows.indexOf(document.activeElement as HTMLElement);
    if (i === -1) return;
    e.preventDefault();
    const next = e.key === "Home" ? 0 : e.key === "End" ? rows.length - 1 : (i + (e.key === "ArrowDown" ? 1 : -1) + rows.length) % rows.length;
    rows[next]?.focus();
  }, []);

  return (
    <>
      <div className={cn("flex h-12 shrink-0 items-center gap-2 border-b border-line", collapsed ? "justify-center px-0" : "px-3")}>
        <Link href="/app" aria-label="OCTO Control Center" className={cn("flex items-center gap-2 rounded-sm", ring)}>
          <span aria-hidden className="flex size-6 items-center justify-center rounded-md bg-ink font-data text-[11px] font-medium text-app">
            O
          </span>
          {!collapsed && <span className="text-[13px] font-semibold tracking-[0.12em]">OCTO</span>}
        </Link>
      </div>

      <div className={cn("shrink-0 border-b border-line py-2", collapsed ? "px-2" : "px-2.5")}>
        <WorkspaceSwitcher collapsed={collapsed} />
      </div>

      <nav ref={listRef} onKeyDown={onKeyDown} className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
        {NAV.map((group) => (
          <div key={group.label} className="mb-3 last:mb-0">
            {!collapsed ? (
              <p className="px-2 pb-1 pt-1.5 text-label uppercase text-ink-4">{group.label}</p>
            ) : (
              <div aria-hidden className="mx-2 my-2 h-px bg-line first:hidden" />
            )}
            <ul className="space-y-px">
              {group.items.map((item) => (
                <li key={item.id}>
                  <NavRow item={item} active={isActive(item, pathname)} collapsed={collapsed} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className={cn("shrink-0 border-t border-line py-2", collapsed ? "px-2" : "px-3")}>
        <ApiIndicator collapsed={collapsed} />
        {onToggle && (
          <div className={cn("mt-1.5 flex", collapsed ? "justify-center" : "justify-end")}>
            <IconButton
              size="sm"
              label={collapsed ? "Expand sidebar  [" : "Collapse sidebar  ["}
              icon={collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
              onClick={onToggle}
              aria-expanded={!collapsed}
            />
          </div>
        )}
      </div>
    </>
  );
}

function NavRow({ item, active, collapsed }: { item: NavItem; active: boolean; collapsed: boolean }) {
  const Icon = item.icon;
  const base = cn(
    "relative flex h-8 w-full items-center gap-2.5 rounded-md text-[13px] transition-colors",
    collapsed ? "justify-center px-0" : "px-2",
    ringInset,
  );

  const row = item.planned ? (
    <span data-nav-row tabIndex={0} aria-disabled="true" className={cn(base, "cursor-default text-ink-4")}>
      <Icon aria-hidden className="size-4 shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          <span className="font-data text-[10px] uppercase tracking-[0.06em] text-ink-4">Planned</span>
        </>
      )}
    </span>
  ) : (
    <Link
      data-nav-row
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(base, active ? "bg-surface font-medium text-ink shadow-[0_0_0_1px_var(--color-line)]" : "text-ink-2 hover:bg-hover hover:text-ink")}
    >
      {active && <span aria-hidden className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-accent" />}
      <Icon aria-hidden className={cn("size-4 shrink-0", active ? "text-accent" : "text-ink-3")} />
      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
      {item.badge &&
        (collapsed ? (
          <span aria-hidden className={cn("absolute right-2 top-1.5 size-1.5 rounded-full", item.badge.tone === "danger" ? "bg-danger" : "bg-accent")} />
        ) : (
          <CountBadge tone={item.badge.tone}>{item.badge.count}</CountBadge>
        ))}
      {item.badge && <span className="sr-only">, {item.badge.count} open</span>}
    </Link>
  );

  return collapsed ? <Tooltip className="flex w-full" label={item.planned ? `${item.label} · planned` : item.label}>{row}</Tooltip> : row;
}

function WorkspaceSwitcher({ collapsed }: { collapsed: boolean }) {
  const { workspaces, current, setCurrent, source } = useWorkspace();
  const { open, setOpen, close, rootRef, triggerRef } = useDismissable();
  const initial = current.name.charAt(0).toUpperCase();
  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Workspace: ${current.name}. Switch workspace`}
        onClick={() => setOpen(!open)}
        className={cn("flex h-9 w-full cursor-pointer items-center gap-2 rounded-md text-left hover:bg-hover", collapsed ? "justify-center" : "px-1.5", ring)}
      >
        <span aria-hidden className="flex size-6 shrink-0 items-center justify-center rounded-md border border-line bg-surface text-[11px] font-semibold text-ink-2">
          {initial}
        </span>
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium leading-tight">{current.name}</span>
              <span className="block truncate text-[11px] leading-tight text-ink-3">{current.role}</span>
            </span>
            <ChevronsUpDown aria-hidden className="size-3.5 shrink-0 text-ink-3" />
          </>
        )}
      </button>
      {open && (
        <PopoverPanel align="start" className={cn("w-64 p-1", collapsed && "left-[calc(100%+8px)] top-0")}>
          <p className="px-2 pb-1 pt-1.5 text-label uppercase text-ink-4">Workspaces{source === "demo" && " · demo list"}</p>
          <ul role="listbox" aria-label="Workspaces">
            {workspaces.map((w) => (
              <li key={w.slug} role="option" aria-selected={w.slug === current.slug}>
                <button
                  type="button"
                  onClick={() => {
                    setCurrent(w.slug);
                    close();
                  }}
                  className={cn("flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-hover", ringInset)}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px]">{w.name}</span>
                    <span className="block truncate text-[11px] text-ink-3">{w.role}</span>
                  </span>
                  {w.slug === current.slug && <Check aria-hidden className="size-3.5 text-accent" />}
                </button>
              </li>
            ))}
          </ul>
        </PopoverPanel>
      )}
    </div>
  );
}

function ApiIndicator({ collapsed }: { collapsed: boolean }) {
  const { apiStatus, environment, source } = useWorkspace();
  const dot = apiStatus === "connected" ? "bg-ok" : apiStatus === "offline" ? "bg-warn" : "bg-ink-4 animate-pulse";
  const label = apiStatus === "connected" ? "API connected" : apiStatus === "offline" ? "API offline" : "Checking API";
  const detail = `${environment} · ${source === "api" ? "live tenants" : "demo data"}`;
  const body = (
    <span role="status" className={cn("flex items-center gap-2 text-[12px]", collapsed && "justify-center")}>
      <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", dot)} />
      {collapsed ? (
        <span className="sr-only">
          {label}, {detail}
        </span>
      ) : (
        <span className="min-w-0 truncate">
          <span className="text-ink-2">{label}</span>
          <span className="text-ink-4"> · {detail}</span>
        </span>
      )}
    </span>
  );
  return collapsed ? (
    <Tooltip className="flex w-full" label={`${label} · ${detail}`}>
      <span tabIndex={0} className={cn("flex w-full justify-center rounded-sm py-1", ring)}>
        {body}
      </span>
    </Tooltip>
  ) : (
    body
  );
}

/* ---------- Topbar ---------- */

const PERIODS: { value: Period; label: string }[] = ["QTD", "YTD", "LTM", "ITD"].map((p) => ({ value: p as Period, label: p }));

function Topbar({ onOpenPalette, onOpenDrawer }: { onOpenPalette: () => void; onOpenDrawer: () => void }) {
  const pathname = usePathname();
  const crumbs = breadcrumb(pathname);
  const { period, setPeriod } = usePreferences();
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-line bg-surface px-3 sm:gap-3 sm:px-4">
      <IconButton className="lg:hidden" label="Open navigation" icon={<Menu />} onClick={onOpenDrawer} />

      <nav aria-label="Breadcrumb" className="min-w-0">
        <ol className="flex items-center gap-1 text-[13px]">
          {crumbs.map((c, i) => (
            <li key={`${i}-${c.label}`} className="flex min-w-0 items-center gap-1">
              {i > 0 && <ChevronRight aria-hidden className="size-3.5 shrink-0 text-ink-4" />}
              <span aria-current={i === crumbs.length - 1 ? "page" : undefined} className={cn("truncate", i === crumbs.length - 1 ? "font-medium text-ink" : "hidden text-ink-3 sm:inline")}>
                {c.label}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      <button
        type="button"
        onClick={onOpenPalette}
        aria-label="Search and commands"
        aria-keyshortcuts="Control+K Meta+K"
        className={cn(
          "ml-auto flex h-8 cursor-pointer items-center gap-2 rounded-md border border-line bg-subtle px-2.5 text-[13px] text-ink-3 transition-colors hover:border-line-strong hover:text-ink-2 md:w-64 lg:w-72",
          ring,
        )}
      >
        <Search aria-hidden className="size-3.5 shrink-0" />
        <span className="hidden flex-1 text-left md:inline">Search funds, companies, actions…</span>
        <Kbd className="hidden md:inline-flex">Ctrl K</Kbd>
      </button>

      <div className="hidden items-center gap-2 xl:flex">
        <Segmented size="sm" label="Reporting period" value={period} onChange={setPeriod} items={PERIODS} />
        <span className="whitespace-nowrap text-[12px] text-ink-3">as of {date(DEMO_NOW)}</span>
      </div>

      <div className="flex items-center gap-0.5">
        <span className="hidden sm:contents">
          <StatusMenu />
        </span>
        <NotificationCenter />
        <span className="hidden sm:contents">
          <HelpMenu />
          <ThemeMenu />
        </span>
        <UserMenu />
      </div>
    </header>
  );
}
