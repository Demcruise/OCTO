/**
 * Landing page copy and navigation (PAL-045, PAL-033). Edit wording here
 * without touching layout.
 *
 * Every href resolves to a section on this page or a real route; nothing links
 * to a page that does not exist. Every figure on the page is illustrative and
 * labelled as such (PAL-041).
 */

export type NavLink = { title: string; description?: string; href: string };
export type NavGroup = { label: string; intro?: string; links: NavLink[] };

export const CTA_HREF = "#contact";
export const SIGN_IN_HREF = "/login";

/** Enterprise navigation (PAL-007): five groups, each a multi-column panel. */
export const NAV: NavGroup[] = [
  {
    label: "Platform",
    intro: "One system for private-markets data, context, and decisions.",
    links: [
      { title: "Investment Ontology", description: "Funds, investments, companies, deals, LPs", href: "#ontology" },
      { title: "Investment Book of Record", description: "The governed record behind every number", href: "#ibor" },
      { title: "Intelligence", description: "AI that works on investment context", href: "#ai-context" },
      { title: "Analytics", description: "IRR, TVPI, MOIC, exposure, benchmarks", href: "#analytics" },
      { title: "Workflow", description: "Sourcing to IC to monitoring", href: "#workflow" },
    ],
  },
  {
    label: "Solutions",
    intro: "Where investment teams use OCTO every day.",
    links: [
      { title: "Deal teams", description: "Screening, diligence, IC review", href: "#workflow" },
      { title: "Portfolio monitoring", description: "Object views for every investment", href: "#object-view" },
      { title: "Operations", description: "Alerts, tasks, exceptions, approvals", href: "#control-panel" },
      { title: "Finance and reporting", description: "Numbers you can trace to a document", href: "#lineage" },
    ],
  },
  {
    label: "Technology",
    intro: "How data becomes a defensible decision.",
    links: [
      { title: "Platform architecture", description: "Data, ontology, intelligence, action", href: "#platform" },
      { title: "Data connectivity", description: "CRM, models, documents, market data", href: "#problem" },
      { title: "Object graph", description: "Every investment object, connected", href: "#graph" },
      { title: "AI context", description: "Answers grounded in your record", href: "#ai-context" },
      { title: "Lineage", description: "Metric to source document", href: "#lineage" },
    ],
  },
  {
    label: "Governance",
    intro: "Controls built into the product, not bolted on.",
    links: [
      { title: "Governed AI", description: "Evidence, permission check, human review", href: "#ai" },
      { title: "Access and audit", description: "Permissions, approvals, version history", href: "#governance" },
      { title: "Deployment", description: "Runs where your data belongs", href: "#deployment" },
    ],
  },
  {
    label: "Resources",
    links: [
      { title: "Capability index", description: "Everything OCTO covers", href: "#capabilities" },
      { title: "Use cases", description: "OCTO in investment operations", href: "#use-cases" },
      { title: "Request access", description: "Walk through OCTO on sample data", href: "#contact" },
    ],
  },
];

export const LIFECYCLE = ["Sourcing", "Screening", "Due diligence", "IC review", "Invested", "Monitoring", "Reporting"] as const;

/** Governance capabilities (PAL-025). Each maps to a mechanism shown elsewhere on the page. */
export const GOVERNANCE = [
  { name: "Permission-scoped access", body: "People and AI see only what their fund, deal, and document grants allow.", layer: "Access" },
  { name: "Role-based access", body: "Roles decide who can view, draft, review, and approve.", layer: "Access" },
  { name: "Tenant isolation", body: "Each firm's records are scoped to its own tenant.", layer: "Access" },
  { name: "Approval gates", body: "High-impact actions wait for a named approver.", layer: "Action" },
  { name: "AI governance", body: "Models and prompts are versioned; every draft carries provenance.", layer: "Action" },
  { name: "Source lineage", body: "Every number resolves to its calculation, events, and source document.", layer: "Record" },
  { name: "Version history", body: "Corrections supersede a record; they never overwrite it.", layer: "Record" },
  { name: "Audit trail", body: "Material actions are logged with actor, reason, and time.", layer: "Record" },
] as const;

/** Dense capability index (PAL-027). */
export const CAPABILITY_GROUPS = [
  {
    label: "Platform",
    items: [
      { title: "Investment Ontology", body: "Funds, investments, companies, deals, and LPs as linked objects.", view: "ontology / fund / us-manufacturing-iii", href: "#ontology" },
      { title: "IBOR", body: "Append-only ledger of transactions, valuations, and cash flows.", view: "ibor / events · 30 Sep 2026", href: "#ibor" },
      { title: "Analytics", body: "IRR, TVPI, MOIC, exposure, and benchmarks from the record.", view: "analytics / portfolio · Q3 2026", href: "#analytics" },
      { title: "Intelligence", body: "Questions answered from governed context, with sources attached.", view: "intelligence / ask", href: "#ai-context" },
    ],
  },
  {
    label: "Investment workflow",
    items: [
      { title: "Deal pipeline", body: "Prospects tracked against your thesis from first contact.", view: "workflow / pipeline · 42 prospects", href: "#workflow" },
      { title: "Screening", body: "Configurable criteria run against data room and CRM.", view: "workflow / screening · 3 criteria", href: "#workflow" },
      { title: "Due diligence", body: "Evidence requests tracked against the checklist.", view: "workflow / diligence · 2 of 3 received", href: "#workflow" },
      { title: "IC approval", body: "Memos routed to named committee members.", view: "workflow / ic-review · 2 of 3 approvals", href: "#workflow" },
      { title: "Portfolio monitoring", body: "KPIs, covenants, and valuations per investment.", view: "object / us-manufacturing-iii", href: "#object-view" },
    ],
  },
  {
    label: "Governance",
    items: [
      { title: "Audit", body: "Actor, action, reason, and time for every material change.", view: "audit / valuation-update-0931", href: "#governance" },
      { title: "Permissions", body: "Access scoped by role, fund, deal, and document.", view: "access / growth-fund-ii · deal team", href: "#governance" },
      { title: "Approval", body: "Nothing material leaves without a named approver.", view: "approvals / 2 pending", href: "#ai" },
      { title: "Lineage", body: "Trace a metric to the page it came from.", view: "lineage / gross-irr · 21.84%", href: "#lineage" },
    ],
  },
  {
    label: "Data",
    items: [
      { title: "Source management", body: "Every adapter, its last sync, and whether it is stale.", view: "sources / 6 connected · 1 stale", href: "#problem" },
      { title: "Reconciliation", body: "Breaks between sources flagged and assigned.", view: "exceptions / 3 open", href: "#exceptions" },
      { title: "Data mapping", body: "Names and identifiers resolved to one entity each.", view: "mapping / company:4182 · 3 sources", href: "#platform" },
    ],
  },
] as const;

export const ROLE_OPTIONS = [
  "Investment team",
  "Portfolio operations",
  "Finance / fund accounting",
  "Investor relations",
  "Technology / data",
  "Other",
] as const;

export const FOCUS_OPTIONS = ["Buyout", "Growth equity", "Venture", "Private credit", "Infrastructure", "Multi-strategy"] as const;

/** Dense enterprise directory (PAL-031). Real anchors and routes only. */
export const FOOTER: NavGroup[] = [
  {
    label: "Platform",
    links: [
      { title: "Investment Ontology", href: "#ontology" },
      { title: "IBOR", href: "#ibor" },
      { title: "Analytics", href: "#analytics" },
      { title: "Intelligence", href: "#ai-context" },
    ],
  },
  {
    label: "Workflow",
    links: [
      { title: "Investment lifecycle", href: "#workflow" },
      { title: "Control Panel", href: "#control-panel" },
      { title: "Exceptions", href: "#exceptions" },
    ],
  },
  {
    label: "Technology",
    links: [
      { title: "Architecture", href: "#platform" },
      { title: "Object graph", href: "#graph" },
      { title: "Lineage", href: "#lineage" },
    ],
  },
  {
    label: "Governance",
    links: [
      { title: "Governed AI", href: "#ai" },
      { title: "Access and audit", href: "#governance" },
      { title: "Deployment", href: "#deployment" },
    ],
  },
  {
    label: "Resources",
    links: [
      { title: "Capability index", href: "#capabilities" },
      { title: "Use cases", href: "#use-cases" },
    ],
  },
  {
    label: "Company",
    links: [
      { title: "Request access", href: "#contact" },
      { title: "Sign in", href: "/login" },
    ],
  },
];
