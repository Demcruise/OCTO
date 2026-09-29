"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";

export type Workspace = { slug: string; name: string; role: string };
export type ApiStatus = "checking" | "connected" | "offline";

type WorkspaceContext = {
  workspaces: Workspace[];
  current: Workspace;
  setCurrent: (slug: string) => void;
  /** Whether the tenant list came from the API or the demo fallback. */
  source: "api" | "demo";
  apiStatus: ApiStatus;
  environment: "Local" | "Staging" | "Production";
};

/** Shown only when the API cannot be reached; always labelled as demo data in the UI. */
const DEMO: Workspace[] = [
  { slug: "flagship-ii", name: "OCTO Flagship Fund II", role: "All vehicles" },
  { slug: "opportunities-i", name: "OCTO Opportunities I", role: "Co-invest" },
  { slug: "antero-spv", name: "Antero SPV", role: "Single deal" },
];

const Ctx = createContext<WorkspaceContext | null>(null);

function detectEnvironment(): WorkspaceContext["environment"] {
  if (typeof window === "undefined") return "Local";
  const h = window.location.hostname;
  if (h === "localhost" || h === "127.0.0.1" || h.endsWith(".localhost")) return "Local";
  if (h.includes("staging")) return "Staging";
  return "Production";
}

/**
 * Workspace (tenant) context for the shell. Tenants come from
 * `GET /api/v1/me/access`; when the API is unreachable the shell keeps working
 * on a clearly labelled demo list instead of rendering an empty switcher.
 */
export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(DEMO);
  const [slug, setSlug] = useState(DEMO[0].slug);
  const [source, setSource] = useState<"api" | "demo">("demo");
  const [apiStatus, setApiStatus] = useState<ApiStatus>("checking");
  const [environment, setEnvironment] = useState<WorkspaceContext["environment"]>("Local");

  useEffect(() => {
    setEnvironment(detectEnvironment());
    let cancelled = false;
    apiFetch("/api/v1/me/access", { signal: AbortSignal.timeout(5000) })
      .then(async (res) => {
        if (cancelled) return;
        // Any HTTP answer means the API is reachable, even a 401 without a session.
        setApiStatus(res.status < 500 ? "connected" : "offline");
        if (!res.ok) return;
        const body = (await res.json()) as { tenants?: { slug: string; role: string }[] };
        if (!body.tenants?.length) return;
        const list = body.tenants.map((t) => ({ slug: t.slug, name: t.slug, role: t.role }));
        setWorkspaces(list);
        setSlug(list[0].slug);
        setSource("api");
      })
      .catch(() => !cancelled && setApiStatus("offline"));
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<WorkspaceContext>(
    () => ({
      workspaces,
      current: workspaces.find((w) => w.slug === slug) ?? workspaces[0],
      setCurrent: setSlug,
      source,
      apiStatus,
      environment,
    }),
    [workspaces, slug, source, apiStatus, environment],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWorkspace(): WorkspaceContext {
  const v = useContext(Ctx);
  if (!v) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return v;
}
