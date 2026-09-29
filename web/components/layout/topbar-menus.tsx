"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, Bell, CircleHelp, LogOut, Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { ago } from "@/lib/format";
import { DEMO_NOW, NOTIFICATIONS, type Severity } from "@/lib/demo-data";
import { usePreferences, type Density, type ThemePref } from "@/lib/preferences";
import { useWorkspace } from "@/lib/workspace";
import { Button, IconButton, ring, ringInset } from "@/components/ui/button";
import { Kbd } from "@/components/ui/badge";
import { PopoverPanel, useDismissable } from "@/components/ui/overlay";
import { Segmented } from "@/components/ui/controls";

const SEV_DOT: Record<Severity, string> = { critical: "bg-danger", high: "bg-warn", medium: "bg-info", low: "bg-ink-4" };

function MenuHeading({ children }: { children: React.ReactNode }) {
  return <p className="px-3 pb-1.5 pt-2.5 text-label uppercase text-ink-4">{children}</p>;
}

/* ---------- System status ---------- */

export function StatusMenu() {
  const { apiStatus, environment, source } = useWorkspace();
  const { open, setOpen, rootRef, triggerRef } = useDismissable();
  const ok = apiStatus === "connected";
  const rows = [
    { label: "OCTO API", value: apiStatus === "checking" ? "Checking" : ok ? "Connected" : "Unreachable", tone: apiStatus === "checking" ? "bg-ink-4" : ok ? "bg-ok" : "bg-warn" },
    { label: "Environment", value: environment, tone: "bg-info" },
    { label: "Workspace data", value: source === "api" ? "Live tenants" : "Demo list", tone: source === "api" ? "bg-ok" : "bg-info" },
    { label: "KPIs, queues, alerts", value: "Demo data", tone: "bg-info" },
  ];
  return (
    <div ref={rootRef} className="relative">
      <IconButton
        ref={triggerRef}
        label={ok ? "System status: API connected" : "System status: API offline"}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        icon={
          <span className="relative">
            <Activity />
            <span aria-hidden className={cn("absolute -right-0.5 -top-0.5 size-1.5 rounded-full ring-2 ring-surface", ok ? "bg-ok" : "bg-warn")} />
          </span>
        }
      />
      {open && (
        <PopoverPanel role="dialog" aria-label="System status" className="w-72 pb-2">
          <MenuHeading>System status</MenuHeading>
          <dl className="px-3">
            {rows.map((r) => (
              <div key={r.label} className="flex items-center justify-between gap-3 border-t border-line py-2 text-[13px] first:border-t-0">
                <dt className="text-ink-3">{r.label}</dt>
                <dd className="flex items-center gap-1.5 text-ink">
                  <span aria-hidden className={cn("size-1.5 rounded-full", r.tone)} />
                  {r.value}
                </dd>
              </div>
            ))}
          </dl>
          {!ok && apiStatus !== "checking" && (
            <p className="mx-3 mt-1 rounded-md bg-warn/10 px-2.5 py-2 text-[12px] text-ink-2">Start the API on :8080 to load real tenants. Everything else stays labelled as demo data.</p>
          )}
        </PopoverPanel>
      )}
    </div>
  );
}

/* ---------- Notification center ---------- */

export function NotificationCenter() {
  const { open, setOpen, close, rootRef, triggerRef } = useDismissable();
  const [read, setRead] = useState<Set<string>>(() => new Set(NOTIFICATIONS.filter((n) => !n.unread).map((n) => n.id)));
  const unread = NOTIFICATIONS.filter((n) => !read.has(n.id)).length;
  const now = new Date(DEMO_NOW);
  return (
    <div ref={rootRef} className="relative">
      <IconButton
        ref={triggerRef}
        label={unread ? `Notifications, ${unread} unread` : "Notifications"}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        icon={
          <span className="relative">
            <Bell />
            {unread > 0 && (
              <span aria-hidden className="absolute -right-1.5 -top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-danger px-0.5 font-data text-[9px] leading-none text-white ring-2 ring-surface">
                {unread}
              </span>
            )}
          </span>
        }
      />
      {open && (
        <PopoverPanel role="dialog" aria-label="Notifications" className="w-[min(22rem,calc(100vw-1.5rem))]">
          <div className="flex items-center justify-between border-b border-line px-3 py-2">
            <p className="text-[13px] font-medium">Notifications</p>
            <button
              type="button"
              disabled={!unread}
              onClick={() => setRead(new Set(NOTIFICATIONS.map((n) => n.id)))}
              className={cn("cursor-pointer rounded-sm text-[12px] text-accent hover:underline disabled:cursor-default disabled:text-ink-4 disabled:no-underline", ring)}
            >
              Mark all read
            </button>
          </div>
          <ul className="max-h-80 overflow-y-auto py-1">
            {NOTIFICATIONS.map((n) => (
              <li key={n.id}>
                <Link
                  href={n.href}
                  onClick={() => {
                    setRead((s) => new Set(s).add(n.id));
                    close(false);
                  }}
                  className={cn("flex gap-2.5 px-3 py-2 hover:bg-hover", ringInset)}
                >
                  <span aria-hidden className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", SEV_DOT[n.severity])} />
                  <span className="min-w-0 flex-1">
                    <span className={cn("block text-[13px] leading-snug", read.has(n.id) ? "text-ink-2" : "font-medium text-ink")}>{n.title}</span>
                    <span className="mt-0.5 block text-[12px] text-ink-3">
                      <span className="capitalize">{n.severity}</span> · {n.entity} · {ago(n.at, now)}
                    </span>
                  </span>
                  {!read.has(n.id) && <span className="sr-only">Unread</span>}
                </Link>
              </li>
            ))}
          </ul>
          <p className="border-t border-line px-3 py-2 text-[11px] text-ink-4">Demo notifications · alert rules ship with the API</p>
        </PopoverPanel>
      )}
    </div>
  );
}

/* ---------- Help & shortcuts ---------- */

const SHORTCUTS: [string, string[]][] = [
  ["Search and commands", ["Ctrl", "K"]],
  ["Search (when not typing)", ["/"]],
  ["Collapse sidebar", ["["]],
  ["Move in navigation and tables", ["↑", "↓"]],
  ["Close sheet or menu", ["Esc"]],
];

export function HelpMenu() {
  const { open, setOpen, rootRef, triggerRef } = useDismissable();
  return (
    <div ref={rootRef} className="relative">
      <IconButton ref={triggerRef} label="Help and keyboard shortcuts" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(!open)} icon={<CircleHelp />} />
      {open && (
        <PopoverPanel role="dialog" aria-label="Keyboard shortcuts" className="w-72 pb-2">
          <MenuHeading>Keyboard shortcuts</MenuHeading>
          <ul className="px-3">
            {SHORTCUTS.map(([label, keys]) => (
              <li key={label} className="flex items-center justify-between gap-3 py-1.5 text-[13px] text-ink-2">
                {label}
                <span className="flex gap-1">
                  {keys.map((k) => (
                    <Kbd key={k}>{k}</Kbd>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </PopoverPanel>
      )}
    </div>
  );
}

/* ---------- Theme & density ---------- */

const THEMES: { value: ThemePref; label: string; icon: React.ReactNode }[] = [
  { value: "light", label: "Light", icon: <Sun /> },
  { value: "dark", label: "Dark", icon: <Moon /> },
  { value: "system", label: "System", icon: <Monitor /> },
];

export function ThemeMenu() {
  const { theme, setTheme, resolvedTheme, density, setDensity } = usePreferences();
  const { open, setOpen, rootRef, triggerRef } = useDismissable();
  return (
    <div ref={rootRef} className="relative">
      <IconButton
        ref={triggerRef}
        label="Appearance"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        icon={resolvedTheme === "dark" ? <Moon /> : <Sun />}
      />
      {open && (
        <PopoverPanel role="dialog" aria-label="Appearance" className="w-64 pb-3">
          <MenuHeading>Theme</MenuHeading>
          <div role="radiogroup" aria-label="Theme" className="grid grid-cols-3 gap-1.5 px-3">
            {THEMES.map((t) => (
              <button
                key={t.value}
                type="button"
                role="radio"
                aria-checked={theme === t.value}
                onClick={() => setTheme(t.value)}
                className={cn(
                  "flex h-14 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border text-[12px] [&_svg]:size-4",
                  theme === t.value ? "border-accent bg-accent-soft text-ink" : "border-line text-ink-3 hover:bg-hover hover:text-ink",
                  ring,
                )}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
          <MenuHeading>Density</MenuHeading>
          <div className="px-3">
            <Segmented<Density>
              size="sm"
              label="Table density"
              value={density}
              onChange={setDensity}
              items={[
                { value: "comfortable", label: "Comfortable" },
                { value: "compact", label: "Compact" },
                { value: "dense", label: "Dense" },
              ]}
            />
          </div>
        </PopoverPanel>
      )}
    </div>
  );
}

/* ---------- User ---------- */

export function UserMenu() {
  const [email, setEmail] = useState<string | null>(null);
  const { open, setOpen, rootRef, triggerRef } = useDismissable();

  useEffect(() => {
    supabase?.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  const name = email ?? "Local session";
  const signOut = async () => {
    await supabase?.auth.signOut();
    window.location.assign("/login");
  };

  return (
    <div ref={rootRef} className="relative ml-1">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account: ${name}`}
        onClick={() => setOpen(!open)}
        className={cn("flex size-7 cursor-pointer items-center justify-center rounded-full bg-ink text-[11px] font-semibold uppercase text-app", ring)}
      >
        {email ? email.charAt(0) : "L"}
      </button>
      {open && (
        <PopoverPanel role="menu" className="w-64 p-1">
          <div className="px-2 py-2">
            <p className="truncate text-[13px] font-medium">{name}</p>
            <p className="mt-0.5 text-[12px] text-ink-3">{email ? "Signed in with Supabase" : "Auth not configured — access is local only"}</p>
          </div>
          <div className="my-1 h-px bg-line" />
          {email ? (
            <button type="button" role="menuitem" onClick={signOut} className={cn("flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] text-ink-2 hover:bg-hover hover:text-ink", ringInset)}>
              <LogOut aria-hidden className="size-3.5" /> Sign out
            </button>
          ) : (
            <Button role="menuitem" variant="ghost" size="sm" className="w-full justify-start" onClick={() => window.location.assign("/login")}>
              <LogOut /> Go to sign-in
            </Button>
          )}
        </PopoverPanel>
      )}
    </div>
  );
}
