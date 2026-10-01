/**
 * Landing copy and data (megaplan §03–§14). Original OCTO wording; nothing
 * copied from ondo.finance. Every number is demo data and is labelled
 * "Demo environment" where it renders (§29 content integrity).
 */

export const CTA_HREF = "#cta";
export const EXPLORE_HREF = "#octo-system";
export const SIGN_IN_HREF = "/login";
export const APP_HREF = "/app";

const u = (id: string) => `https://images.unsplash.com/${id}`;

/** Editorial photography (§28): licensed Unsplash images, served through next/image. */
export const PHOTOS = {
  skyline: { src: u("photo-1774112168796-69c896af2730"), alt: "Financial district towers along a river at dusk" },
  towers: { src: u("photo-1486406146926-c627a92ad1ab"), alt: "Glass office towers seen from street level" },
  datacenter: { src: u("photo-1558494949-ef010cbdcc31"), alt: "Server racks with network cabling in a data center" },
  logistics: { src: u("photo-1565793298595-6a879b1d9492"), alt: "Aerial view of freight trucks at a logistics depot" },
  industry: { src: u("photo-1504917595217-d4dc5ebe6122"), alt: "Sparks from a metal grinder in a manufacturing plant" },
  boardroom: { src: u("photo-1431540015161-0bf868a2d407"), alt: "Empty boardroom with an oval table and chairs" },
  windfarm: { src: u("photo-1452179535021-368bb0edc3a8"), alt: "Aerial view of wind turbines across farmland" },
} as const;

export const ANNOUNCEMENT = { text: "See OCTO’s governed workflow in the demo environment.", link: { label: "Explore", href: "#from-data-to-decision" } };

export const NAV = [
  { label: "Platform", href: "#octo-system" },
  { label: "Solutions", href: "#featured" },
  { label: "Technology", href: "#fragmented-truth" },
  { label: "Governance", href: "#institutional" },
  { label: "Resources", href: "#perspective" },
] as const;

/** Search destinations for the header search (§02). */
export const SEARCH_TARGETS = [
  { label: "Investment Ontology", href: "#featured", hint: "Platform" },
  { label: "Investment Book of Record", href: "#featured", hint: "Platform" },
  { label: "Governed Intelligence", href: "#featured", hint: "Platform" },
  { label: "Portfolio Operations", href: "#featured", hint: "Solutions" },
  { label: "IC Workflow", href: "#from-data-to-decision", hint: "Solutions" },
  { label: "System index", href: "#octo-system", hint: "Platform" },
  { label: "Controlled environments", href: "#institutional", hint: "Governance" },
  { label: "Technology and integrations", href: "#fragmented-truth", hint: "Technology" },
  { label: "From data to decision", href: "#from-data-to-decision", hint: "Workflow" },
  { label: "The OCTO Perspective", href: "#perspective", hint: "Resources" },
  { label: "Request access", href: CTA_HREF, hint: "Contact" },
] as const;

export const HERO = {
  eyebrow: "Private markets infrastructure",
  line1: "One System",
  line2: "for Every Investment Decision",
  support: "Investment data, context, intelligence, and workflow in one governed system.",
  primary: "Request access",
  secondary: "Explore OCTO",
};

/** System atlas (§03.2 A + C): the objects behind a decision. */
export const ATLAS = ["Fund", "Company", "Deal", "Document", "Metric", "Decision"] as const;

/** Signal strip (Ondo live-metrics rhythm) — demo values only (§22). */
export const SIGNALS = [
  { label: "NAV under record", count: 1.82, decimals: 2, prefix: "$", suffix: "B" },
  { label: "Net IRR", count: 18.4, decimals: 1, suffix: "%" },
  { label: "TVPI", count: 2.31, decimals: 2, suffix: "x" },
  { label: "Source records linked", count: 1248, decimals: 0 },
] as const;

export type FeaturedStory = {
  id: string;
  label: string;
  line1: string;
  line2: string;
  body: string;
  photo: keyof typeof PHOTOS;
  position: string;
  href: string;
};

/** Featured (§04): five product stories, two-line headlines, one 16:9 frame. */
export const FEATURED: FeaturedStory[] = [
  { id: "ontology", label: "Investment Ontology", line1: "See every investment object", line2: "in one context.", body: "Funds, companies, deals, documents and people are modelled once and linked, so every view starts from the same objects.", photo: "towers", position: "50% 40%", href: "#octo-system" },
  { id: "ibor", label: "Investment Book of Record", line1: "Keep every number", line2: "in one governed record.", body: "Positions and cash derive from a single transaction ledger. Every figure carries its source, its version, and its approval.", photo: "datacenter", position: "50% 50%", href: "#octo-system" },
  { id: "intelligence", label: "Governed Intelligence", line1: "Turn context", line2: "into usable insight.", body: "Analysis runs on the governed record, cites its evidence, and waits for a person before anything is applied.", photo: "logistics", position: "50% 55%", href: "#octo-system" },
  { id: "operations", label: "Portfolio Operations", line1: "See what needs attention", line2: "before it becomes a problem.", body: "Covenants, stale marks and reconciliation breaks surface as work with an owner, not as a report someone has to find.", photo: "industry", position: "50% 45%", href: "#from-data-to-decision" },
  { id: "ic", label: "IC Workflow", line1: "Bring evidence and decisions", line2: "into one workflow.", body: "Screening, diligence, memos and approvals share one record, so the decision and its evidence travel together.", photo: "boardroom", position: "50% 60%", href: "#from-data-to-decision" },
];

export const SLIDE_MS = 8000;

export const SYSTEM = {
  statement: ["OCTO connects", "investment data, context,", "intelligence, and workflow", "in one governed system."],
  index: [
    { name: "Investment Ontology", body: "Model the objects behind every investment decision.", route: "/ontology" },
    { name: "Investment Book of Record", body: "Establish the governed financial record.", route: "/ibor" },
    { name: "Intelligence", body: "Turn investment data into usable insight.", route: "/intelligence" },
    { name: "Workflow", body: "Move analysis into governed action.", route: "/workflow" },
    { name: "Governance", body: "Keep every action accountable.", route: "/governance" },
  ],
};

export const PROOF_TABS = ["Control Panel", "Portfolio", "Investment", "Company", "Workflow"] as const;

/** Institutional grade (§09) — capabilities, not certifications. */
export const INSTITUTIONAL = {
  eyebrow: "Built for controlled environments",
  pillars: [
    { name: "Permission-scoped", body: "People see the funds, companies and documents their role allows — nothing is listed or counted otherwise." },
    { name: "Source-grounded", body: "Every number and every AI answer points back to the record or document it came from." },
    { name: "Auditable", body: "Changes, approvals and overrides are recorded with who, when and why." },
    { name: "Approval-aware", body: "Actions that change the record wait for the approvals your policy requires." },
    { name: "Governed", body: "Definitions, models and prompts are versioned, so a figure can be reproduced later." },
  ],
};

export const FRAGMENTS = {
  line1: "Private markets",
  line2: "run on fragments.",
  list: ["CRM.", "Models.", "Documents.", "Market data.", "Reporting."],
  closing: "OCTO connects them once.",
  inputs: [
    { id: "crm", label: "CRM", icon: "users" },
    { id: "models", label: "Models", icon: "sheet" },
    { id: "documents", label: "Documents", icon: "file" },
    { id: "market", label: "Market data", icon: "chart" },
    { id: "reporting", label: "Reporting", icon: "report" },
    { id: "pipeline", label: "Deal pipeline", icon: "funnel" },
  ],
  outputs: [
    { id: "analysis", label: "Analysis", icon: "analysis" },
    { id: "workflow", label: "Workflow", icon: "workflow" },
    { id: "decision", label: "Decision", icon: "decision" },
  ],
} as const;

export const TECHNOLOGY = {
  line1: "Your data.",
  line2: "One investment system.",
  sources: ["CRM", "Financials", "Documents", "Market data", "Reports"],
  layers: [
    { name: "Investment Ontology", body: "Objects and relationships" },
    { name: "IBOR", body: "Ledger-derived record" },
    { name: "Intelligence", body: "Cited, reviewable analysis" },
    { name: "Workflow", body: "Governed action" },
  ],
};

/** Integration categories (§11): neutral labels, no partner logos. */
export const INTEGRATIONS = ["CRM", "ERP", "Fund Administration", "Documents", "Market Data", "Financial Models", "Identity", "Reporting"];

export const FUTURE = { line1: "There is still more", line2: "to connect.", support: "The record should move with the decision.", cta: "Explore OCTO" };

export type WorkflowState = { id: "screen" | "decide" | "monitor" | "report"; label: string; line: string; body: string };

export const WORKFLOW: WorkflowState[] = [
  { id: "screen", label: "Screen", line: "Find what matters first.", body: "Pipeline, company, sector and source scored against your mandate." },
  { id: "decide", label: "Decide", line: "Bring the evidence together.", body: "Memo, evidence, model and approvals in one record." },
  { id: "monitor", label: "Monitor", line: "See what changed.", body: "Metrics, exceptions and the action each one needs." },
  { id: "report", label: "Report", line: "Trace every number.", body: "From a reported figure back to the document it came from." },
];

export const CTA = {
  primary: { title: "Request access", body: "See OCTO on your own funds, companies and documents." },
  secondary: { title: "Explore OCTO", body: "Walk through the system, from ontology to decision." },
};

export const PERSPECTIVE = {
  title: "The OCTO Perspective",
  links: [
    { label: "The investment record is still fragmented", href: "#fragmented-truth" },
    { label: "AI needs governed context", href: "#institutional" },
    { label: "Private markets need connected workflows", href: "#from-data-to-decision" },
  ],
};

/** Footer (§14). Links point at the section that owns the topic; there are no dead links. */
export const FOOTER = [
  {
    title: "Platform",
    links: [
      { label: "Ontology", href: "#featured" },
      { label: "IBOR", href: "#featured" },
      { label: "Intelligence", href: "#featured" },
      { label: "Workflow", href: "#from-data-to-decision" },
      { label: "Governance", href: "#institutional" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Sourcing", href: "#from-data-to-decision" },
      { label: "Diligence", href: "#from-data-to-decision" },
      { label: "Portfolio", href: "#featured" },
      { label: "IC", href: "#featured" },
      { label: "LP Reporting", href: "#from-data-to-decision" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#octo-system" },
      { label: "Insights", href: "#perspective" },
      { label: "Security", href: "#institutional" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#top" },
      { label: "Contact", href: CTA_HREF },
      { label: "Sign in", href: SIGN_IN_HREF },
    ],
  },
] as const;

/** Legal documents are shared on request during onboarding; listed, not linked. */
export const LEGAL = ["Privacy", "Terms", "Security"] as const;
