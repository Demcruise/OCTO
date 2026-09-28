/**
 * Landing page copy (ARCH-003 / ARCH-101). Edit wording here without touching layout.
 *
 * Every href must resolve to a section on this page or a real route. Do not add
 * links to pages that do not exist yet (FOOT-100). Every figure shown on the page
 * is illustrative and labelled as such (BP-003, CONTENT-002).
 */

export type NavLink = { title: string; description?: string; href: string };
export type NavGroup = { label: string; links: NavLink[] };

export const CTA_HREF = "#contact";
export const SIGN_IN_HREF = "/login";

export const ANNOUNCEMENT = { label: "Private beta", text: "Onboarding a small number of private-markets firms.", cta: "Request access" };

/**
 * Grouped by mental model (PAL-007). Platform links deep-link into the OCTO Core
 * switcher: the core section selects the layer named in the hash.
 */
export const NAV: NavGroup[] = [
  {
    label: "Platform",
    links: [
      { title: "Investment Ontology", description: "Entities, relationships, events, context", href: "#core-tab-ontology" },
      { title: "IBOR", description: "The governed book of record", href: "#core-tab-ibor" },
      { title: "Intelligence", description: "Source-grounded analysis and questions", href: "#core-tab-intelligence" },
      { title: "Workflow", description: "Exceptions, tasks, and approvals", href: "#core-tab-workflow" },
    ],
  },
  {
    label: "Capabilities",
    links: [
      { title: "Deal sourcing", description: "Screening to IC review", href: "#workflow" },
      { title: "Portfolio", description: "Control panel, fund, and investment views", href: "#product" },
      { title: "Analytics", description: "Metrics you can trace to the source", href: "#lineage" },
      { title: "Reporting", description: "Every capability, one record underneath", href: "#capabilities" },
    ],
  },
  {
    label: "Governance",
    links: [
      { title: "Security", description: "Permission-scoped, controlled deployment", href: "#governance" },
      { title: "Auditability", description: "Every material action is recorded", href: "#audit" },
      { title: "Access", description: "Scope by role, fund, deal, and document", href: "#faq" },
    ],
  },
  {
    label: "Resources",
    links: [
      { title: "Questions", description: "Deployment, IBOR, data sources, and AI", href: "#faq" },
      { title: "Talk to the team", description: "Book a walkthrough on sample data", href: "#contact" },
    ],
  },
];

/* ---------- OCTO Core (CORE-100) ---------- */

export type CoreLayer = {
  id: "ontology" | "ibor" | "intelligence" | "workflow";
  number: string;
  eyebrow: string;
  label: string;
  title: string;
  description: string;
  bullets: string[];
  enables: string;
};

export const CORE_LAYERS: CoreLayer[] = [
  {
    id: "ontology",
    number: "01",
    eyebrow: "Context",
    label: "Investment Ontology",
    title: "Understand every investment in context.",
    description: "The Investment Ontology connects funds, investments, companies, people, documents, and events in one governed model. Every source maps onto it once.",
    bullets: ["Funds, investments, companies, LPs", "People, documents, and events", "Versioned and reviewed like code"],
    enables: "Open a company and see its fund, deal team, financials, and documents together.",
  },
  {
    id: "ibor",
    number: "02",
    eyebrow: "Truth",
    label: "Investment Book of Record",
    title: "One governed record.",
    description: "Keep the investment record current, traceable, and ready for analysis. Positions and cash are derived from an append-only ledger of events.",
    bullets: ["Transactions, valuations, cash flows", "Corrections supersede, never overwrite", "Reconciled against administrators"],
    enables: "Every report reads from the same record, so numbers agree across teams.",
  },
  {
    id: "intelligence",
    number: "03",
    eyebrow: "Reasoning",
    label: "Intelligence",
    title: "Answers from governed context.",
    description: "Analytics, search, and AI-assisted analysis run on the ontology and the book of record, and every answer keeps its sources attached.",
    bullets: ["IRR, TVPI, DPI, look-through exposure", "Questions in plain language", "Evidence cited with every answer"],
    enables: "Investigate a change in performance without rebuilding the model.",
  },
  {
    id: "workflow",
    number: "04",
    eyebrow: "Action",
    label: "Workflow",
    title: "From exception to resolution.",
    description: "Tasks, exceptions, and approvals move through named owners, so analysis turns into a reviewed, recorded action.",
    bullets: ["Exceptions routed to an owner", "Approvals before anything leaves", "Decision record kept with the evidence"],
    enables: "Nothing material leaves the system without a named approver.",
  },
];

/* ---------- Data → decision (FLOW-100/101) ---------- */

export type FlowStage = { id: string; label: string; title: string; description: string; items: string[] };

export const FLOW_STAGES: FlowStage[] = [
  {
    id: "connect",
    label: "Connect",
    title: "Sources enter through governed adapters.",
    description: "CRMs, fund administrators, financial and market-data feeds, and document stores stay where they are. OCTO reads from them.",
    items: ["CRM", "Fund administrator", "Financial feeds", "Market data", "Documents"],
  },
  {
    id: "normalize",
    label: "Normalize",
    title: "Data is mapped to canonical objects.",
    description: "Names, identifiers, and schemas resolve to one entity each, and records are validated before they are accepted.",
    items: ["Entity resolution", "Schema mapping", "Validation"],
  },
  {
    id: "contextualize",
    label: "Contextualize",
    title: "The ontology adds relationships and meaning.",
    description: "A record stops being a row. It becomes a company, in a fund, with a deal team, financials, and documents attached.",
    items: ["Relationships", "Ownership", "Source lineage"],
  },
  {
    id: "analyze",
    label: "Analyze",
    title: "Metrics and questions run on governed context.",
    description: "Performance, exposure, and custom metrics are calculated from the ledger with versioned definitions.",
    items: ["IRR", "TVPI", "MOIC", "DPI", "Look-through exposure"],
  },
  {
    id: "review",
    label: "Review",
    title: "People inspect evidence before anything moves.",
    description: "Exceptions and AI-drafted proposals arrive with their evidence, so reviewers decide on facts, not summaries.",
    items: ["Exceptions", "Evidence", "Proposals"],
  },
  {
    id: "act",
    label: "Act",
    title: "Approved outputs enter a governed workflow.",
    description: "Reports, tasks, and exports leave the system only after approval, and the decision is recorded with its evidence.",
    items: ["Reports", "Tasks", "Approvals", "Exports"],
  },
];

export const LIFECYCLE = [
  "Sourcing",
  "Screening",
  "Due diligence",
  "IC review",
  "Invested",
  "Portfolio monitoring",
  "Exit / reporting",
] as const;

/* ---------- Governance (GOV-100) ---------- */

export const GOVERNANCE = [
  { name: "Permission-scoped", body: "People and AI see only what their role, fund, and deal assignments allow." },
  { name: "Source-grounded", body: "Source context stays attached to every number, answer, and draft." },
  { name: "Append-only", body: "Every change remains traceable. Corrections supersede a record; they never overwrite it." },
  { name: "Human approval", body: "High-impact actions wait for a named approver before they leave the system." },
  { name: "Audit trail", body: "Material actions are written to an audit log that reviewers can replay." },
  { name: "Controlled deployment", body: "Core data runs inside your environment, with no external SaaS dependency for the record." },
] as const;

export const FAQ = [
  {
    q: "Where does OCTO run?",
    a: "On your infrastructure. OCTO deploys as a self-hosted stack — PostgreSQL for the book of record and a graph store for the ontology — so client, position, and LP data stay inside your perimeter.",
  },
  {
    q: "What is the Investment Book of Record?",
    a: "An append-only ledger of transactions, commitments, cash flows, and valuations. Positions and cash are derived from it. A correction supersedes an event with a stated reason instead of overwriting it.",
  },
  {
    q: "Does OCTO replace our fund administrator or data providers?",
    a: "No. It reads from them. Adapters map their feeds onto the ontology and reconciliation flags where sources disagree, so your administrator stays a source while OCTO becomes the record your team works from.",
  },
  {
    q: "What can the AI do on its own?",
    a: "Draft. Answers are built from records the user is permitted to see and cite their sources. Anything with material impact — a report, a memo, a correction — waits for human approval.",
  },
  {
    q: "Can we configure workflows and metrics?",
    a: "Yes. Screening criteria, approval routes, alert rules, and metric definitions are configurable and versioned, so a change to how a number is calculated is itself reviewable.",
  },
] as const;

/* ---------- Capability index (CAP-100/101) ---------- */

export const CAPABILITIES = [
  { title: "Investment data", benefit: "Connect every source to one model.", signal: "Adapters · ontology", href: "#system" },
  { title: "Portfolio analytics", benefit: "Compare funds without rebuilding the model.", signal: "IRR · TVPI · DPI", href: "#product" },
  { title: "Investment monitoring", benefit: "See what changed, and why.", signal: "Company KPIs", href: "#product" },
  { title: "Deal sourcing", benefit: "Track prospects against your thesis.", signal: "Pipeline · CRM", href: "#workflow" },
  { title: "Due diligence", benefit: "Keep evidence requests with the deal.", signal: "Checklists · documents", href: "#workflow" },
  { title: "IC workflow", benefit: "Route memos to named approvers.", signal: "Approvals · decision record", href: "#workflow" },
  { title: "LP reporting", benefit: "Report from the reconciled record.", signal: "IBOR · reports", href: "#lineage" },
  { title: "Exceptions", benefit: "Assign, review, and resolve breaks.", signal: "Reconciliation", href: "#core" },
  { title: "Alerts", benefit: "Know when a threshold is crossed.", signal: "Rules · control panel", href: "#product" },
  { title: "AI-assisted analysis", benefit: "Draft explanations from governed context.", signal: "Citations · review", href: "#ai" },
  { title: "Governance", benefit: "Scope access by role, fund, and deal.", signal: "RBAC · ABAC", href: "#governance" },
  { title: "Audit and lineage", benefit: "Trace a number to its source document.", signal: "Ledger · audit log", href: "#lineage" },
] as const;

/**
 * Capability architecture (PAL-002): seven connected nodes, each owning part of
 * the capability index. Every capability title above appears under exactly one node.
 */
export const ARCHITECTURE = [
  {
    id: "ontology",
    name: "Investment Ontology",
    role: "Context",
    body: "Funds, investments, companies, deals, and LPs as linked objects.",
    capabilities: ["Investment data", "Deal sourcing"],
    signals: [["Entity types", "Fund · Investment · Company · Deal · LP"], ["Relationships", "owns · invests-in · linked-to · reports-on"]],
  },
  {
    id: "ibor",
    name: "Investment Book of Record",
    role: "Truth",
    body: "An append-only ledger that positions, cash, and reports are derived from.",
    capabilities: ["LP reporting", "Exceptions"],
    signals: [["Last reconciled", "30 Sep 2026 · 09:42 UTC"], ["Open breaks", "3 flagged"]],
  },
  {
    id: "intelligence",
    name: "Intelligence",
    role: "Reasoning",
    body: "Questions and AI-assisted analysis over governed context, with sources attached.",
    capabilities: ["AI-assisted analysis", "Investment monitoring"],
    signals: [["Answer mode", "Source-grounded · cited"], ["Draft status", "Human review required"]],
  },
  {
    id: "workflow",
    name: "Workflow",
    role: "Action",
    body: "Diligence, committee review, and approvals routed to named owners.",
    capabilities: ["Due diligence", "IC workflow"],
    signals: [["IC review", "2 of 3 approvals"], ["Evidence requests", "1 outstanding"]],
  },
  {
    id: "analytics",
    name: "Analytics",
    role: "Measurement",
    body: "Performance and exposure calculated from the ledger with versioned definitions.",
    capabilities: ["Portfolio analytics"],
    signals: [["Gross IRR", "Definition v3.2"], ["Look-through", "Definition v1.4"]],
  },
  {
    id: "governance",
    name: "Governance",
    role: "Control",
    body: "Permissions, provenance, and an audit trail on every material action.",
    capabilities: ["Governance", "Audit and lineage"],
    signals: [["Access", "Role · fund · deal · document"], ["Audit", "Append-only log"]],
  },
  {
    id: "control-panel",
    name: "Control Panel",
    role: "Attention",
    body: "Alerts, drafts, tasks, exceptions, and approvals in one queue.",
    capabilities: ["Alerts"],
    signals: [["Open items", "19 across 6 queues"], ["Due this week", "7"]],
  },
] as const;

/* ---------- Contact ---------- */

export const CONSOLIDATE_OPTIONS = [
  "Portfolio data",
  "Deal workflow",
  "Reporting",
  "Data infrastructure",
  "AI-assisted analysis",
] as const;

export const ROLE_OPTIONS = [
  "Investment team",
  "Portfolio operations",
  "Finance / fund accounting",
  "Investor relations",
  "Technology / data",
  "Other",
] as const;

/* ---------- Footer (FOOT-100) ---------- */

export const FOOTER: NavGroup[] = [
  {
    label: "Platform",
    links: [
      { title: "OCTO Core", href: "#core" },
      { title: "System", href: "#system" },
      { title: "Analytics", href: "#product" },
      { title: "Governance", href: "#governance" },
    ],
  },
  {
    label: "Resources",
    links: [
      { title: "Capabilities", href: "#capabilities" },
      { title: "Questions", href: "#faq" },
    ],
  },
  {
    label: "Company",
    links: [
      { title: "Contact", href: "#contact" },
      { title: "Sign in", href: "/login" },
    ],
  },
];
