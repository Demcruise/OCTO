"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePreferences, type Period } from "@/lib/preferences";
import { useFormat } from "@/lib/use-format";
import { AS_OF } from "@/lib/demo";
import { IconButton, ring } from "@/components/ui/button";
import { Kbd } from "@/components/ui/badge";
import { Segmented } from "@/components/ui/controls";
import { breadcrumb, type Crumb } from "./nav-config";
import { useShell } from "./shell-context";
import { DisplayMenu, HelpButton, NotificationCenter, StatusMenu } from "./topbar-menus";

const PERIODS: { value: Period; label: string }[] = (["QTD", "YTD", "LTM", "ITD"] as Period[]).map((p) => ({ value: p, label: p }));

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex items-center gap-1.5 text-[13px]">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={`${i}-${c.label}`} className={cn("flex min-w-0 items-center gap-1.5", !last && "max-sm:hidden")}>
              {i > 0 && <ChevronRight aria-hidden className="size-3.5 shrink-0 text-ink-4" />}
              {c.href && !last ? (
                <Link href={c.href} className={cn("truncate rounded-sm font-medium text-ink-3 hover:text-ink", ring)}>
                  {c.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={cn("truncate font-medium", last ? "text-ink" : "text-ink-3")}>
                  {c.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Topbar (plan FE-SHELL-003; Vestra: breadcrumb left, search + compact
 * utilities right, one hairline, very little vertical chrome).
 */
export function Topbar({ onOpenDrawer, onShortcuts }: { onOpenDrawer: () => void; onShortcuts: () => void }) {
  const pathname = usePathname();
  const { crumbs, openCommand } = useShell();
  const { period, setPeriod } = usePreferences();
  const f = useFormat();

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-line bg-app px-3 sm:gap-3 sm:px-6 lg:px-7">
      <IconButton className="lg:hidden" label="Open navigation" icon={<Menu />} onClick={onOpenDrawer} />
      <Breadcrumbs crumbs={crumbs ?? breadcrumb(pathname)} />

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-2 xl:flex">
          <Segmented size="sm" label="Reporting period" value={period} onChange={setPeriod} items={PERIODS} />
          <span className="whitespace-nowrap text-[12px] text-ink-3">as of {f.date(AS_OF)}</span>
        </div>

        <button
          type="button"
          onClick={openCommand}
          aria-label="Search and commands"
          aria-keyshortcuts="Control+K Meta+K /"
          className={cn("flex h-9 cursor-pointer items-center gap-2.5 rounded-lg border border-line-strong bg-subtle px-3 text-[13px] text-ink-4 transition-colors hover:bg-hover hover:text-ink-3 max-md:size-9 max-md:justify-center max-md:px-0 md:w-56", ring)}
        >
          <Search aria-hidden className="size-4 shrink-0 text-ink-3" />
          <span className="hidden flex-1 text-left md:inline">Search…</span>
          <Kbd className="hidden md:inline-flex">/</Kbd>
        </button>

        <div className="flex items-center gap-1.5">
          <span className="hidden sm:contents">
            <StatusMenu />
          </span>
          <NotificationCenter />
          <span className="hidden sm:contents">
            <HelpButton onShortcuts={onShortcuts} />
          </span>
          <DisplayMenu />
        </div>
      </div>
    </header>
  );
}
