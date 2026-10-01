"use client";

import AuthGate from "@/components/auth-gate";
import { cn } from "@/lib/utils";
import { PreferencesProvider, usePreferences } from "@/lib/preferences";
import { WorkspaceProvider } from "@/lib/workspace";
import { QueryProvider } from "@/lib/data/queries";
import { ToastProvider } from "@/components/feedback";
import { AppShell } from "./app-shell";
import { ShellProvider } from "./shell-context";

/**
 * Root of every /app route: preferences → theme scope → query client →
 * workspace → toasts → shell context → session gate → shell. The `dark` class
 * only ever sits on `.octo-app`, so the landing page is never affected.
 */
export function AppFrame({ children }: { children: React.ReactNode }) {
  return (
    <PreferencesProvider>
      <Themed>
        <QueryProvider>
          <WorkspaceProvider>
            <ToastProvider>
              <ShellProvider>
                <AuthGate>
                  <AppShell>{children}</AppShell>
                </AuthGate>
              </ShellProvider>
            </ToastProvider>
          </WorkspaceProvider>
        </QueryProvider>
      </Themed>
    </PreferencesProvider>
  );
}

function Themed({ children }: { children: React.ReactNode }) {
  const { locale, resolvedTheme } = usePreferences();
  // V3 THEME-003: Light by default; Dark/System resolve to the full dark token mapping.
  return (
    <div lang={locale === "id" ? "id" : "en"} data-theme={resolvedTheme} className={cn("octo-app min-h-dvh bg-app font-landing text-ink antialiased [font-feature-settings:'cv11','ss01']", resolvedTheme === "dark" && "dark")} style={{ colorScheme: resolvedTheme }}>
      {children}
    </div>
  );
}
