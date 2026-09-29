"use client";

import AuthGate from "@/components/auth-gate";
import { cn } from "@/lib/utils";
import { PreferencesProvider, usePreferences } from "@/lib/preferences";
import { WorkspaceProvider } from "@/lib/workspace";
import { ToastProvider } from "@/components/ui/states";
import { AppShell } from "./app-shell";

/**
 * Root of every /app route: preferences, workspace, and toast providers, the
 * themed `.octo-app` scope (the `dark` class switches app tokens only — the
 * landing page never sees it), the session gate, and the shell.
 */
export function AppFrame({ children }: { children: React.ReactNode }) {
  return (
    <PreferencesProvider>
      <Themed>
        <WorkspaceProvider>
          <ToastProvider>
            <AuthGate>
              <AppShell>{children}</AppShell>
            </AuthGate>
          </ToastProvider>
        </WorkspaceProvider>
      </Themed>
    </PreferencesProvider>
  );
}

function Themed({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = usePreferences();
  return (
    <div className={cn("octo-app min-h-dvh bg-app font-landing text-ink antialiased", resolvedTheme === "dark" && "dark")} style={{ colorScheme: resolvedTheme }}>
      {children}
    </div>
  );
}
