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

/** Enterprise navigation (NAV-003): five groups, each a multi-column panel. */
export const NAV: NavGroup[] = [
  {
    label: "Platform",
    intro: "One system for private-markets data, context, and decisions.",
    links: [
      { title: "Investment Ontology", description: "Funds, investments, companies, deals, LPs", href: "#ontology" },
      { title: "Investment Book of Record", description: "The governed record behind every number", href: "#ibor" },
      { title: "Intelligence", description: "AI that works on investment context", href: "#ai-context" },
      { title: "Workflow", description: "Sourcing to IC to monitoring", href: "#workflow" },
      { title: "Analytics", description: "IRR, TVPI, MOIC, exposure, benchmarks", href: "#analytics" },
    ],
  },
  {
    label: "Solutions",
    intro: "Where investment teams use OCTO every day.",
    links: [
      { title: "Deal sourcing", description: "Prospects screened against your thesis", href: "#workflow" },
      { title: "Due diligence", description: "Evidence tracked to the checklist", href: "#workflow" },
      { title: "Portfolio monitoring", description: "Object views for every investment", href: "#object-view" },
      { title: "IC workflows", description: "Evidence, models, and approvals", href: "#workflow" },
      { title: "LP reporting", description: "Figures traced to the governed source", href: "#lineage" },
    ],
  },
  {
    label: "Technology",
    intro: "How data becomes a defensible decision.",
    links: [
      { title: "Data foundation", description: "CRM, models, documents, market data", href: "#problem" },
      { title: "Ontology", description: "Every investment object, connected", href: "#graph" },
      { title: "Intelligence", description: "Answers grounded in your record", href: "#ai-context" },
      { title: "Integrations", description: "Adapters read; nothing writes back", href: "#problem" },
      { title: "Security", description: "Runs where your data belongs", href: "#deployment" },
    ],
  },
  {
    label: "Governance",
    intro: "Controls built into the product, not bolted on.",
    links: [
      { title: "Permissions", description: "Scoped by role, fund, and deal", href: "#governance" },
      { title: "Audit trail", description: "Actor, reason, and time on record", href: "#governance" },
      { title: "Lineage", description: "Metric to source document", href: "#lineage" },
      { title: "Approvals", description: "Nothing material leaves unreviewed", href: "#ai" },
      { title: "Self-hosted", description: "Inside infrastructure you control", href: "#deployment" },
    ],
  },
  {
    label: "Resources",
    links: [
      { title: "Product overview", description: "The OCTO system", href: "#system" },
      { title: "Stories", description: "What the system does", href: "#stories" },
      { title: "Use cases", description: "By team and role", href: "#use-cases" },
      { title: "Contact", description: "Walk through OCTO on sample data", href: "#contact" },
    ],
  },
];

export const LIFECYCLE = ["Sourcing", "Screening", "Due diligence", "IC review", "Invested", "Monitoring", "Reporting"] as const;

/* ── Featured stories (STORY-002) — the topic strip selects a story. ── */

export type Story = { id: string; eyebrow: string; title: string; description: string; image: string; alt: string; href: string };

export const STORIES: Story[] = [
  {
    id: "ontology",
    eyebrow: "Investment Ontology",
    title: "Connect every fund, company, deal, document, and relationship to one operational context.",
    description: "The Investment Ontology models your firm as connected objects — not disconnected tables.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
    alt: "Aerial view of city lights and connected infrastructure at night",
    href: "#ontology",
  },
  {
    id: "ibor",
    eyebrow: "Investment Book of Record",
    title: "Every number has a source. Every change has a record.",
    description: "An append-only ledger of transactions, valuations, and corrections — reconciled and governed.",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570",
    alt: "Rows of archived volumes on library shelves",
    href: "#ibor",
  },
  {
    id: "intelligence",
    eyebrow: "Governed Intelligence",
    title: "AI can propose. Your team remains in control.",
    description: "Answers arrive with context, sources, and a named approver before anything is committed.",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
    alt: "Dark boardroom table with documents and low light",
    href: "#ai",
  },
  {
    id: "portfolio",
    eyebrow: "Portfolio Operations",
    title: "Move from monitoring data to acting on exceptions.",
    description: "Alerts, gaps, and stale sources surface with an owner and a next action.",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c",
    alt: "Racking aisles inside a large logistics warehouse",
    href: "#control-panel",
  },
  {
    id: "ic",
    eyebrow: "IC Workflow",
    title: "Bring evidence, models, and decisions into one workflow.",
    description: "From sourcing to committee sign-off, every stage carries its evidence and its owner.",
    image: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e",
    alt: "Glass facade of an institutional building seen from below",
    href: "#workflow",
  },
];

/* ── System index (SYS-001): the OCTO system as a list, not a card grid. ── */

export type SystemKind = "ontology" | "ibor" | "intelligence" | "workflow" | "governance";
export type ProductSystem = { id: SystemKind; index: string; name: string; description: string; href: string };

export const SYSTEM_INDEX: ProductSystem[] = [
  {
    id: "ontology",
    index: "01",
    name: "Investment Ontology",
    description: "Model the funds, companies, deals, people, and relationships behind every decision.",
    href: "#ontology",
  },
  {
    id: "ibor",
    index: "02",
    name: "Investment Book of Record",
    description: "Establish the governed financial record for private markets.",
    href: "#ibor",
  },
  {
    id: "intelligence",
    index: "03",
    name: "Intelligence",
    description: "Analyze performance, risk, exposure, and opportunity.",
    href: "#ai-context",
  },
  {
    id: "workflow",
    index: "04",
    name: "Workflow",
    description: "Turn analysis into governed action.",
    href: "#workflow",
  },
  {
    id: "governance",
    index: "05",
    name: "Governance",
    description: "Keep permissions, lineage, approvals, and auditability intact.",
    href: "#governance",
  },
];

/* ── Governance capabilities (PAL-025). Each maps to a mechanism shown on the page. ── */

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

/* ── Proof (PAL-025/027): representative claims — no fabricated customers. ── */

export const PROOF_QUOTE = {
  quote: "Before OCTO, our teams were reconciling five systems just to prepare for IC.",
  attribution: "Representative example",
  role: "Investment operations",
};

export const PROOF_CLAIMS = [
  { quote: "Portfolio review went from a spreadsheet exercise to one operating view.", role: "Portfolio monitoring" },
  { quote: "The LP report figure traces back to the page it came from.", role: "Investor relations" },
  { quote: "The AI draft showed its evidence before anyone approved it.", role: "Deal team" },
] as const;

export const PROOF_MARKERS = [
  ["01", "Governed investment record"],
  ["02", "Ontology-backed intelligence"],
  ["03", "Approval-aware workflows"],
  ["04", "Full metric lineage"],
] as const;

/* ── Use-case index (PAL-028): role → problem → workflow → product surface. ── */

export type UseCase = { role: string; problem: string; workflow: string; surface: string; href: string };

export const USE_CASES: UseCase[] = [
  {
    role: "Investment teams",
    problem: "Deal context scattered across CRM, inboxes, and data rooms.",
    workflow: "Sourcing → screening → diligence → IC review",
    surface: "Object views and the IC memo",
    href: "#workflow",
  },
  {
    role: "Portfolio teams",
    problem: "Weekly reviews rebuilt by hand from stale exports.",
    workflow: "Monitoring KPIs → covenant and valuation exceptions",
    surface: "Control Panel and exception queue",
    href: "#control-panel",
  },
  {
    role: "Investment operations",
    problem: "The same record reconciled across five systems.",
    workflow: "Ingestion → reconciliation → approval",
    surface: "Exceptions and the IBOR ledger",
    href: "#exceptions",
  },
  {
    role: "Investor relations",
    problem: "Reported figures that are hard to defend.",
    workflow: "Report drafting → lineage check → sign-off",
    surface: "LP reporting with metric lineage",
    href: "#lineage",
  },
  {
    role: "CFO / finance",
    problem: "Numbers without a traceable history.",
    workflow: "Ledger events → valuations → approved record",
    surface: "Investment Book of Record",
    href: "#ibor",
  },
  {
    role: "Risk & compliance",
    problem: "Access and AI decisions without an audit trail.",
    workflow: "Permissions → approval gates → audit log",
    surface: "Governance and audit trail",
    href: "#governance",
  },
];

export const ROLE_OPTIONS = [
  "Investment team",
  "Portfolio operations",
  "Finance / fund accounting",
  "Investor relations",
  "Technology / data",
  "Other",
] as const;

export const FOCUS_OPTIONS = ["Buyout", "Growth equity", "Venture", "Private credit", "Infrastructure", "Multi-strategy"] as const;

/** Dense enterprise directory (FOOT-001/002). Real anchors and routes only. */
export const FOOTER: NavGroup[] = [
  {
    label: "Platform",
    links: [
      { title: "Investment Ontology", href: "#ontology" },
      { title: "IBOR", href: "#ibor" },
      { title: "Intelligence", href: "#ai-context" },
      { title: "Workflow", href: "#workflow" },
      { title: "Governance", href: "#governance" },
    ],
  },
  {
    label: "Solutions",
    links: [
      { title: "Sourcing", href: "#workflow" },
      { title: "Diligence", href: "#workflow" },
      { title: "Portfolio", href: "#object-view" },
      { title: "IC", href: "#workflow" },
      { title: "LP Reporting", href: "#lineage" },
    ],
  },
  {
    label: "Resources",
    links: [
      { title: "Product overview", href: "#system" },
      { title: "Stories", href: "#stories" },
      { title: "Use cases", href: "#use-cases" },
      { title: "Contact", href: "#contact" },
    ],
  },
  {
    label: "Company",
    links: [
      { title: "Security", href: "#deployment" },
      { title: "Sign in", href: "/login" },
      { title: "Request access", href: "#contact" },
    ],
  },
];
