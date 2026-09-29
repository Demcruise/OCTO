"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ArrowRight, Box, CornerDownLeft, Moon, PanelLeft, Search, Sparkles, Sun, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { ENTITIES } from "@/lib/demo-data";
import { usePreferences } from "@/lib/preferences";
import { useWorkspace } from "@/lib/workspace";
import { NAV_ITEMS } from "@/components/navigation/nav-config";
import { Kbd } from "@/components/ui/badge";

type Command = {
  id: string;
  group: "Go to" | "Records" | "Actions" | "Workspaces" | "Ask OCTO";
  label: string;
  hint?: string;
  icon: React.ReactNode;
  disabled?: boolean;
  keywords?: string;
  run?: () => void;
};

const GROUP_ORDER: Command["group"][] = ["Go to", "Records", "Actions", "Workspaces", "Ask OCTO"];

/**
 * Global command palette (SHELL-001.3): navigation, records, actions, and
 * workspace switching behind one combobox. Ask OCTO is shown as planned
 * rather than faked.
 */
export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!open || !mounted) return null;
  return createPortal(<Palette onClose={onClose} />, document.querySelector(".octo-app") ?? document.body);
}

function Palette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { resolvedTheme, setTheme, sidebarCollapsed, setSidebarCollapsed } = usePreferences();
  const { workspaces, current, setCurrent } = useWorkspace();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const previous = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previous.current = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    return () => previous.current?.focus?.({ preventScroll: true });
  }, []);

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => router.push(href);
    return [
      ...NAV_ITEMS.map((n) => ({
        id: `nav-${n.id}`,
        group: "Go to" as const,
        label: n.label,
        hint: n.planned ? "Planned" : undefined,
        icon: <n.icon />,
        disabled: n.planned,
        run: n.planned ? undefined : go(n.href),
      })),
      ...ENTITIES.map((e) => ({
        id: `ent-${e.id}`,
        group: "Records" as const,
        label: e.name,
        hint: `${e.type} · ${e.context}`,
        keywords: `${e.type} ${e.id} ${e.status}`,
        icon: <Box />,
        run: go(e.href),
      })),
      {
        id: "act-theme",
        group: "Actions",
        label: resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme",
        keywords: "theme appearance mode",
        icon: resolvedTheme === "dark" ? <Sun /> : <Moon />,
        run: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
      },
      {
        id: "act-sidebar",
        group: "Actions",
        label: sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar",
        icon: <PanelLeft />,
        run: () => setSidebarCollapsed(!sidebarCollapsed),
      },
      { id: "act-approvals", group: "Actions", label: "Review pending approvals", icon: <ArrowRight />, run: go("/app/workflows?tab=approvals") },
      { id: "act-recon", group: "Actions", label: "Resolve reconciliation breaks", icon: <ArrowRight />, run: go("/app/workflows?tab=recon") },
      ...workspaces.map((w) => ({
        id: `ws-${w.slug}`,
        group: "Workspaces" as const,
        label: `Switch to ${w.name}`,
        hint: w.slug === current.slug ? "Current" : w.role,
        icon: <Users />,
        disabled: w.slug === current.slug,
        run: () => setCurrent(w.slug),
      })),
      { id: "ask", group: "Ask OCTO", label: "Ask OCTO a question about your portfolio", hint: "Planned", icon: <Sparkles />, disabled: true },
    ];
  }, [router, resolvedTheme, setTheme, sidebarCollapsed, setSidebarCollapsed, workspaces, current.slug, setCurrent]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const hits = q ? commands.filter((c) => `${c.label} ${c.hint ?? ""} ${c.keywords ?? ""} ${c.group}`.toLowerCase().includes(q)) : commands;
    // Without a query, keep the record list short so actions stay in view.
    return GROUP_ORDER.flatMap((g) => hits.filter((c) => c.group === g).slice(0, !q && g === "Records" ? 5 : undefined));
  }, [commands, query]);

  useEffect(() => setActive(results.findIndex((c) => !c.disabled)), [query]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const run = (c?: Command) => {
    if (!c || c.disabled || !c.run) return;
    onClose();
    c.run();
  };

  const move = (dir: 1 | -1) => {
    if (!results.some((c) => !c.disabled)) return;
    let i = active;
    do i = (i + dir + results.length) % results.length;
    while (results[i].disabled);
    setActive(i);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "Tab") {
      e.preventDefault();
    }
  };

  let lastGroup = "";
  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center px-3 pt-[12vh]">
      <div aria-hidden className="absolute inset-0 bg-black/30 motion-safe:animate-[fade-in_140ms_ease-out]" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search and commands"
        className="relative flex max-h-[min(32rem,76vh)] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-line bg-raised text-ink shadow-dialog motion-safe:animate-[pop-in_160ms_cubic-bezier(0.22,1,0.36,1)]"
      >
        <div className="flex items-center gap-2.5 border-b border-line px-4">
          <Search aria-hidden className="size-4 shrink-0 text-ink-3" />
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={active >= 0 ? `palette-${results[active]?.id}` : undefined}
            aria-autocomplete="list"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search funds, companies, deals, actions…"
            className="h-12 flex-1 bg-transparent text-[14px] text-ink placeholder:text-ink-4 focus:outline-none"
          />
          <Kbd>Esc</Kbd>
        </div>

        <ul id="palette-list" ref={listRef} role="listbox" aria-label="Results" className="min-h-0 flex-1 overflow-y-auto p-1.5">
          {results.length === 0 && (
            <li className="px-3 py-8 text-center text-[13px] text-ink-3">
              No results for “{query}”. Try a fund, company, or page name.
            </li>
          )}
          {results.map((c, i) => {
            const heading = c.group !== lastGroup ? c.group : null;
            lastGroup = c.group;
            return (
              <li key={c.id} role="presentation">
                {heading && <p className="px-2.5 pb-1 pt-2.5 text-label uppercase text-ink-4">{heading}</p>}
                <div
                  id={`palette-${c.id}`}
                  data-index={i}
                  role="option"
                  aria-selected={i === active}
                  aria-disabled={c.disabled || undefined}
                  onMouseMove={() => !c.disabled && setActive(i)}
                  onClick={() => run(c)}
                  className={cn(
                    "flex h-9 items-center gap-2.5 rounded-md px-2.5 text-[13px] [&_svg]:size-4 [&_svg]:shrink-0",
                    c.disabled ? "cursor-default text-ink-4" : "cursor-pointer text-ink-2",
                    i === active && "bg-hover text-ink",
                  )}
                >
                  <span className={cn(i === active ? "text-accent" : "text-ink-3", c.disabled && "text-ink-4")}>{c.icon}</span>
                  <span className="min-w-0 flex-1 truncate">{c.label}</span>
                  {c.hint && <span className="max-w-[45%] truncate text-[12px] text-ink-4">{c.hint}</span>}
                  {i === active && <CornerDownLeft aria-hidden className="text-ink-3" />}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4 border-t border-line px-4 py-2 text-[11px] text-ink-4">
          <span className="flex items-center gap-1">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd> move
          </span>
          <span className="flex items-center gap-1">
            <Kbd>↵</Kbd> open
          </span>
          <span className="ml-auto">Records are demo data</span>
        </div>
      </div>
    </div>
  );
}
