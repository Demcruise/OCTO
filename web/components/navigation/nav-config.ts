import {
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  Database,
  FileText,
  Gauge,
  Layers,
  LineChart,
  ListChecks,
  PieChart,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  /** Actionable count shown as a badge (SHELL-001.1: counts only for work). */
  badge?: { count: number; tone: "accent" | "danger" };
  /** Not built yet — rendered as a disabled "Planned" row, never a dead link. */
  planned?: boolean;
  /** Extra path prefixes that should mark this item active. */
  match?: string[];
};

export type NavGroup = { label: string; items: NavItem[] };

/** Information architecture from the enterprise backlog (IA-001). */
export const NAV: NavGroup[] = [
  {
    label: "Operate",
    items: [
      { id: "control", label: "Control Center", href: "/app", icon: Gauge },
      { id: "workflows", label: "Workflows", href: "/app/workflows", icon: ListChecks, badge: { count: 4, tone: "accent" } },
      { id: "alerts", label: "Alerts", href: "/app/alerts", icon: Bell, badge: { count: 3, tone: "danger" } },
    ],
  },
  {
    label: "Portfolio",
    items: [
      { id: "portfolio", label: "Portfolio", href: "/app/portfolio", icon: PieChart },
      { id: "funds", label: "Funds", href: "/app/funds", icon: Layers, planned: true },
      { id: "companies", label: "Companies", href: "/app/companies", icon: Building2, planned: true },
      { id: "investments", label: "Investments", href: "/app/investments", icon: Briefcase },
      { id: "deals", label: "Deals", href: "/app/deals", icon: BookOpen },
    ],
  },
  {
    label: "Insight",
    items: [
      { id: "analytics", label: "Analytics", href: "/app/analytics", icon: LineChart, planned: true },
      { id: "reports", label: "Reports", href: "/app/reports", icon: FileText, planned: true },
      { id: "data", label: "Data & Sources", href: "/app/data", icon: Database, planned: true },
    ],
  },
  {
    label: "System",
    items: [{ id: "admin", label: "Administration", href: "/admin", icon: Settings }],
  },
];

export const NAV_ITEMS = NAV.flatMap((g) => g.items);

export function isActive(item: NavItem, pathname: string): boolean {
  if (item.href === "/app") return pathname === "/app";
  return [item.href, ...(item.match ?? [])].some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** Breadcrumb trail derived from the pathname (SHELL-001.2). */
export function breadcrumb(pathname: string): { label: string; href?: string }[] {
  const item = NAV_ITEMS.find((i) => i.href !== "/app" && isActive(i, pathname));
  if (!item) return [{ label: "Control Center" }];
  const group = NAV.find((g) => g.items.includes(item));
  // A group named like its item ("Portfolio › Portfolio") adds nothing.
  return group && group.label !== item.label ? [{ label: group.label }, { label: item.label }] : [{ label: item.label }];
}
