/**
 * Landing page copy and navigation. Edit wording here without touching layout.
 *
 * Every href resolves to one of the eight homepage sections or a real route;
 * nothing links to a page that does not exist. Every figure on the page is
 * illustrative and labelled as such.
 */

export type NavLink = { title: string; description?: string; href: string };

export const CTA_HREF = "/login";
export const SIGN_IN_HREF = "/login";

/** Flat link list for the menu overlay and the search overlay. */
export const NAV_LINKS: NavLink[] = [
  { title: "Featured", description: "What the system does", href: "#stories" },
  { title: "The OCTO System", description: "Ontology · record · intelligence · workflow · governance", href: "#system" },
  { title: "Fragmented truth", description: "Why OCTO exists", href: "#problem" },
  { title: "The future", description: "There is still more to connect", href: "#future" },
  { title: "From data to decision", description: "Screen · decide · monitor · report", href: "#decision" },
  { title: "Request access", description: "See OCTO on your portfolio questions", href: CTA_HREF },
  { title: "Sign in", href: SIGN_IN_HREF },
];

/* ── 02 FEATURED — five snack bars with timed progress (8s each). ── */

export type Story = { id: string; eyebrow: string; title: string; image: string; alt: string; href: string };

export const STORIES: Story[] = [
  {
    id: "ontology",
    eyebrow: "Investment Ontology",
    title: "See every fund, company, deal, person, and relationship in one context.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
    alt: "Aerial view of city lights and connected infrastructure at night",
    href: "#system",
  },
  {
    id: "ibor",
    eyebrow: "Investment Book of Record",
    title: "Every number has a governed history.",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570",
    alt: "Rows of archived volumes on library shelves",
    href: "#system",
  },
  {
    id: "intelligence",
    eyebrow: "Governed Intelligence",
    title: "AI can propose. Your team remains in control.",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
    alt: "Dark boardroom table with documents and low light",
    href: "#system",
  },
  {
    id: "portfolio",
    eyebrow: "Portfolio Operations",
    title: "See what needs attention before it becomes a problem.",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c",
    alt: "Racking aisles inside a large logistics warehouse",
    href: "#system",
  },
  {
    id: "ic",
    eyebrow: "IC Workflow",
    title: "Bring evidence, models, and decisions into one workflow.",
    image: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e",
    alt: "Glass facade of an institutional building seen from below",
    href: "#system",
  },
];

/* ── 03 OCTO SYSTEM — the five parts as a long list, /0.x links. ── */

export type ProductSystem = { index: string; name: string; description: string; href: string };

export const SYSTEM_INDEX: ProductSystem[] = [
  {
    index: "01",
    name: "Investment Ontology",
    description: "Model the objects and relationships behind every investment decision.",
    href: "#system-graph",
  },
  {
    index: "02",
    name: "Investment Book of Record",
    description: "Establish the governed financial record.",
    href: "#system-record",
  },
  {
    index: "03",
    name: "Intelligence",
    description: "Turn investment data into usable insight.",
    href: "#system-control",
  },
  {
    index: "04",
    name: "Workflow",
    description: "Move analysis into governed action.",
    href: "#decision",
  },
  {
    index: "05",
    name: "Governance",
    description: "Control permissions, approvals, lineage, and auditability.",
    href: "#system-record",
  },
];

/* ── 06 FROM DATA TO DECISION — four workflow stories. ── */

export type WorkflowStory = { index: string; key: string; label: string; title: string; support: string };

export const WORKFLOW_STORIES: WorkflowStory[] = [
  { index: "01", key: "screen", label: "Screen", title: "Find what matters first.", support: "Connect company, market, and document context." },
  { index: "02", key: "decide", label: "Decide", title: "Bring the evidence together.", support: "Keep models, findings, and approvals in context." },
  { index: "03", key: "monitor", label: "Monitor", title: "See what changed.", support: "Track performance, exceptions, and action." },
  { index: "04", key: "report", label: "Report", title: "Trace every number.", support: "Move from the governed record to the final output." },
];

/** Compact institutional footer. Real anchors and routes only. */
export const FOOTER: { label: string; links: NavLink[] }[] = [
  {
    label: "Platform",
    links: [
      { title: "Investment Ontology", href: "#system" },
      { title: "Book of Record", href: "#system-record" },
      { title: "Control Panel", href: "#system-control" },
    ],
  },
  {
    label: "Solutions",
    links: [
      { title: "From data to decision", href: "#decision" },
      { title: "Featured stories", href: "#stories" },
      { title: "Fragmented truth", href: "#problem" },
    ],
  },
  {
    label: "Resources",
    links: [
      { title: "The OCTO System", href: "#system" },
      { title: "The future", href: "#future" },
      { title: "Request access", href: CTA_HREF },
    ],
  },
  {
    label: "Company",
    links: [
      { title: "Sign in", href: SIGN_IN_HREF },
      { title: "Request access", href: CTA_HREF },
    ],
  },
];
