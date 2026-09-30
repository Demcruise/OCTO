"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type ThemePref = "light" | "dark" | "system";
export type Density = "comfortable" | "compact";
export type Locale = "en" | "id";
export type Period = "QTD" | "YTD" | "LTM" | "ITD";

type Prefs = {
  theme: ThemePref;
  density: Density;
  sidebarCollapsed: boolean;
  period: Period;
  locale: Locale;
};

type PrefsContext = Prefs & {
  resolvedTheme: "light" | "dark";
  setTheme: (t: ThemePref) => void;
  setDensity: (d: Density) => void;
  setSidebarCollapsed: (c: boolean) => void;
  setPeriod: (p: Period) => void;
  setLocale: (l: Locale) => void;
};

const DEFAULTS: Prefs = { theme: "system", density: "compact", sidebarCollapsed: false, period: "QTD", locale: "en" };
const KEY = "octo.app.prefs";

/** Row heights per density (plan §7): compact 44px, comfortable 52px. */
export const ROW_HEIGHT: Record<Density, string> = { comfortable: "h-13", compact: "h-11" };

const Ctx = createContext<PrefsContext | null>(null);

function read(): Prefs {
  try {
    const raw = window.localStorage.getItem(KEY);
    const stored = raw ? { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Prefs>) } : DEFAULTS;
    // "dense" was retired when density became two modes.
    if (!(stored.density in ROW_HEIGHT)) stored.density = "compact";
    return stored;
  } catch {
    return DEFAULTS;
  }
}

/**
 * Global view preferences (SHELL-001, TABLE-001, THEME-001). Stored per browser;
 * density lives here — not in per-page toggles — so every table agrees.
 */
export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    setPrefs(read());
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mq.matches);
    const on = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const update = useCallback((patch: Partial<Prefs>) => {
    setPrefs((p) => {
      const next = { ...p, ...patch };
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* storage blocked — keep the in-memory preference */
      }
      return next;
    });
  }, []);

  const value = useMemo<PrefsContext>(
    () => ({
      ...prefs,
      resolvedTheme: prefs.theme === "system" ? (systemDark ? "dark" : "light") : prefs.theme,
      setTheme: (theme) => update({ theme }),
      setDensity: (density) => update({ density }),
      setSidebarCollapsed: (sidebarCollapsed) => update({ sidebarCollapsed }),
      setPeriod: (period) => update({ period }),
      setLocale: (locale) => update({ locale }),
    }),
    [prefs, systemDark, update],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePreferences(): PrefsContext {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePreferences must be used inside PreferencesProvider");
  return v;
}
