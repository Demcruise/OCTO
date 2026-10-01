"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Density = "comfortable" | "compact";
export type Locale = "en" | "id";
export type Period = "QTD" | "YTD" | "LTM" | "ITD";

type Prefs = {
  density: Density;
  sidebarCollapsed: boolean;
  period: Period;
  locale: Locale;
};

type PrefsContext = Prefs & {
  setDensity: (d: Density) => void;
  setSidebarCollapsed: (c: boolean) => void;
  setPeriod: (p: Period) => void;
  setLocale: (l: Locale) => void;
};

const DEFAULTS: Prefs = { density: "compact", sidebarCollapsed: false, period: "QTD", locale: "en" };
const KEY = "octo.app.prefs";

/** Row heights per density (parity backlog TABLE-002): compact 56px, comfortable 64px. */
export const ROW_HEIGHT: Record<Density, string> = { comfortable: "h-16", compact: "h-14" };
export const ROW_PX: Record<Density, number> = { comfortable: 64, compact: 56 };

const Ctx = createContext<PrefsContext | null>(null);

function read(): Prefs {
  try {
    const raw = window.localStorage.getItem(KEY);
    const stored = { ...DEFAULTS, ...(raw ? (JSON.parse(raw) as Partial<Prefs>) : {}) };
    if (!(stored.density in ROW_HEIGHT)) stored.density = "compact";
    // Keys from earlier versions (e.g. theme) are ignored: the dashboard is light-only (DS-002).
    return { density: stored.density, sidebarCollapsed: !!stored.sidebarCollapsed, period: stored.period, locale: stored.locale };
  } catch {
    return DEFAULTS;
  }
}

/**
 * Global view preferences, stored per browser. Density lives here — not in
 * per-page toggles — so every table agrees.
 */
export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);

  useEffect(() => setPrefs(read()), []);

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
      setDensity: (density) => update({ density }),
      setSidebarCollapsed: (sidebarCollapsed) => update({ sidebarCollapsed }),
      setPeriod: (period) => update({ period }),
      setLocale: (locale) => update({ locale }),
    }),
    [prefs, update],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePreferences(): PrefsContext {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePreferences must be used inside PreferencesProvider");
  return v;
}
