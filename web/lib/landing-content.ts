/**
 * Landing page copy (ARCH-003). Edit wording here without touching layout.
 *
 * Every href must resolve to a section on this page or a real route. Do not add
 * links to pages that do not exist yet (FOOTER-001).
 */

export type NavLink = { title: string; description?: string; href: string };
export type NavGroup = { label: string; links: NavLink[] };

export const NAV: NavGroup[] = [
  {
    label: "Platform",
    links: [
      { title: "Investment System", description: "How data becomes a defensible decision", href: "#system" },
      { title: "Investment Ontology", description: "One canonical model of your firm", href: "#core" },
      { title: "Investment Book of Record", description: "The governed ledger behind every number", href: "#core" },
      { title: "Analytics", description: "IRR, TVPI, DPI, and look-through exposure", href: "#product" },
      { title: "Workflow", description: "Sourcing to IC to monitoring", href: "#workflow" },
      { title: "AI", description: "Source-grounded, approval-gated assistance", href: "#ai" },
      { title: "Governance", description: "Permissions, audit, and lineage", href: "#governance" },
    ],
  },
  {
    label: "Solutions",
    links: [
      { title: "Deal teams", description: "Screening, diligence, and IC review", href: "#workflow" },
      { title: "Portfolio operations", description: "Monitoring and company performance", href: "#product" },
      { title: "Finance and reporting", description: "Reconciled records and LP reporting", href: "#lineage" },
    ],
  },
  {
    label: "Infrastructure",
    links: [
      { title: "Self-hosted deployment", description: "Core data stays in your environment", href: "#governance" },
      { title: "Lineage and audit", description: "Trace any figure to its source", href: "#lineage" },
      { title: "Fragmented stack", description: "Why private markets need one record", href: "#problem" },
    ],
  },
  {
    label: "Resources",
    links: [
      { title: "FAQ", description: "Deployment, IBOR, data, and AI", href: "#faq" },
      { title: "Request a walkthrough", description: "Talk to the OCTO team", href: "#contact" },
    ],
  },
];

export const CTA_HREF = "#contact";
export const SIGN_IN_HREF = "/login";

export const PRINCIPLES = [
  "One system.",
  "One governed model.",
  "One book of record.",
  "Every number traceable.",
  "AI proposes. Humans approve.",
] as const;

export type FlowStage = { id: string; label: string; title: string; description: string; items: string[] };

export const FLOW_STAGES: FlowStage[] = [
  {
    id: "ingest",
    label: "Ingest",
    title: "Connect the sources you already run",
    description: "Adapters pull from CRMs, fund administrators, financial and market-data feeds, and document stores without replacing them.",
    items: ["CRM", "Documents", "Financial feeds", "Market data", "Internal systems"],
  },
  {
    id: "normalize",
    label: "Normalize",
    title: "Resolve every record to one entity",
    description: "Names, identifiers, and schemas are mapped onto the Investment Ontology and validated before anything is recorded.",
    items: ["Entity resolution", "Schema mapping", "Validation", "Source lineage"],
  },
  {
    id: "record",
    label: "Record",
    title: "Write it once, to the book of record",
    description: "Events land in an append-only ledger. Positions and cash are derived from transactions, never edited directly.",
    items: ["Transactions", "Commitments", "Cash flows", "Valuations", "Positions"],
  },
  {
    id: "analyze",
    label: "Analyze",
    title: "Measure on governed data",
    description: "Performance, exposure, and custom metrics are computed from the ledger with versioned definitions.",
    items: ["IRR", "TVPI", "MOIC", "DPI", "Look-through exposure", "Custom metrics", "AI-assisted analysis"],
  },
  {
    id: "act",
    label: "Act",
    title: "Turn analysis into reviewed action",
    description: "Alerts, tasks, reports, and exports move through approval before anything leaves the system.",
    items: ["Alerts", "Tasks", "Reports", "Approvals", "Exports"],
  },
];

export const LIFECYCLE = [
  "Sourcing",
  "Screening",
  "Due diligence",
  "IC review",
  "Invested",
  "Portfolio monitoring",
  "Reporting",
] as const;

export const GOVERNANCE = [
  { name: "Self-hosted", tag: "Data residency", body: "Core data runs inside your environment. No external SaaS dependency for the ledger or the ontology." },
  { name: "Ontology", tag: "Versioned", body: "The canonical model is maintained like code: reviewed, validated, and semantically versioned." },
  { name: "Lineage", tag: "Traceability", body: "Every reported number resolves to its calculation, ledger events, source system, and document." },
  { name: "Permissions", tag: "RBAC + ABAC", body: "Access is scoped by role and by fund, deal, entity, document, and purpose." },
  { name: "Audit", tag: "Material actions", body: "Governed actions are written to an immutable audit trail that reviewers can replay." },
  { name: "AI governance", tag: "Models · prompts · approvals", body: "Models and prompts are versioned; outputs carry provenance; high-impact actions need human sign-off." },
] as const;

export const FAQ = [
  {
    q: "Where does OCTO run?",
    a: "On your infrastructure. OCTO deploys as a self-hosted stack — PostgreSQL for the book of record and a graph store for the ontology — so client, position, and LP data stay inside your perimeter.",
  },
  {
    q: "What is the Investment Book of Record?",
    a: "An append-only ledger of transactions, commitments, cash flows, and valuations. Positions and cash are derived from it. Corrections supersede an event with a stated rationale instead of overwriting it, so history is never lost.",
  },
  {
    q: "How does OCTO work with existing fund administrators and data providers?",
    a: "It sits alongside them. Ingestion adapters normalize their feeds onto the ontology, and reconciliation flags where sources disagree, so your administrator remains a source while OCTO becomes the record your team works from.",
  },
  {
    q: "How is AI governed?",
    a: "AI answers are grounded in permitted records and cite their sources. Each output records model, version, and request lineage; confidential data is blocked from external APIs; and actions with material impact require human approval.",
  },
  {
    q: "Can firms configure workflows and metrics?",
    a: "Yes. Screening criteria, approval routes, alert rules, and metric definitions are configurable and versioned, so a change to how a number is calculated is itself reviewable.",
  },
] as const;

export const CONSOLIDATE_OPTIONS = [
  "Portfolio data",
  "Deal workflow",
  "Reporting",
  "Data infrastructure",
  "AI / analytics",
] as const;

export const ROLE_OPTIONS = [
  "Investment team",
  "Portfolio operations",
  "Finance / fund accounting",
  "Investor relations",
  "Technology / data",
  "Other",
] as const;

export const FOOTER: NavGroup[] = [
  {
    label: "Platform",
    links: [
      { title: "Investment Ontology", href: "#core" },
      { title: "Book of Record", href: "#core" },
      { title: "Analytics", href: "#product" },
      { title: "Governed AI", href: "#ai" },
    ],
  },
  {
    label: "Solutions",
    links: [
      { title: "Deal teams", href: "#workflow" },
      { title: "Portfolio operations", href: "#product" },
      { title: "Finance and reporting", href: "#lineage" },
    ],
  },
  {
    label: "Infrastructure",
    links: [
      { title: "Self-hosted deployment", href: "#governance" },
      { title: "Lineage and audit", href: "#lineage" },
    ],
  },
  {
    label: "Resources",
    links: [
      { title: "FAQ", href: "#faq" },
      { title: "Request a walkthrough", href: "#contact" },
      { title: "Sign in", href: "/login" },
    ],
  },
];
