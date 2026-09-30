"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronsUpDown, Keyboard, LogIn, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { ring } from "@/components/ui/button";
import { Monogram } from "@/components/ui/badge";
import { Menu } from "@/components/ui/overlay";

/** Sidebar footer account control (Vestra: user anchored at the bottom of the sidebar). */
export function UserMenu({ collapsed, onShortcuts }: { collapsed: boolean; onShortcuts: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    supabase?.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);
  const name = email ?? "Local session";

  return (
    <Menu
      label="Account"
      align="start"
      side="top"
      className="w-full"
      items={[
        { label: "Settings", icon: <Settings />, onSelect: () => router.push("/app/settings") },
        { label: "Keyboard shortcuts", icon: <Keyboard />, hint: "?", onSelect: onShortcuts },
        "separator",
        email
          ? {
              label: "Sign out",
              icon: <LogOut />,
              onSelect: async () => {
                await supabase?.auth.signOut();
                window.location.assign("/login");
              },
            }
          : { label: "Go to sign-in", icon: <LogIn />, onSelect: () => window.location.assign("/login") },
      ]}
      trigger={({ ref, open, toggle }) => (
        <button
          ref={ref}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={`Account: ${name}`}
          onClick={toggle}
          className={cn("flex h-11 w-full cursor-pointer items-center gap-2.5 rounded-lg border border-line bg-surface text-left transition-colors hover:bg-hover", collapsed ? "justify-center border-transparent bg-transparent" : "px-2", ring)}
        >
          <Monogram name={email ? email.split("@")[0].replace(/[._]/g, " ") : "Local Session"} size="sm" />
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium leading-tight text-ink">{name}</span>
                <span className="block truncate text-[11px] leading-tight text-ink-3">{email ? "Signed in" : "Auth not configured"}</span>
              </span>
              <ChevronsUpDown aria-hidden className="size-3.5 shrink-0 text-ink-3" />
            </>
          )}
        </button>
      )}
    />
  );
}
