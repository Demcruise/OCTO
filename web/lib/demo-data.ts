/**
 * Demo dataset for surfaces whose API does not exist yet.
 *
 * Everything here is illustrative and every screen that reads it shows a
 * "Demo data" freshness badge — the app must never present these values as
 * live (see TANTIRA/OCTO#314). Numbers reconcile: fund NAVs sum to portfolio
 * NAV, bridge steps sum from opening to closing NAV.
 */

export const DEMO_NOW = "2026-09-30T13:42:00Z";
const at = (hoursAgo: number) => new Date(new Date(DEMO_NOW).getTime() - hoursAgo * 3600_000).toISOString();

export type Severity = "critical" | "high" | "medium" | "low";

/* ---------- Funds & KPIs ---------- */

export const FUNDS = [
  { id: "FND-002", name: "OCTO Flagship Fund II", vintage: 2023, strategy: "Buyout", status: "Investing", nav: 486.2e6, tvpi: 1.71, irr: 19.4 },
  { id: "FND-001", name: "OCTO Flagship Fund I", vintage: 2019, strategy: "Buyout", status: "Harvesting", nav: 184.7e6, tvpi: 1.58, irr: 17.1 },
  { id: "FND-003", name: "OCTO Opportunities I", vintage: 2024, strategy: "Growth / credit", status: "Investing", nav: 96.4e6, tvpi: 1.32, irr: 14.8 },
  { id: "FND-004", name: "Antero Co-Invest SPV", vintage: 2025, strategy: "Single deal", status: "Watch", nav: 31.5e6, tvpi: 1.12, irr: 9.6 },
  { id: "FND-005", name: "OCTO Venture FoF", vintage: 2022, strategy: "Fund of funds", status: "Exiting", nav: 13.6e6, tvpi: 0.94, irr: -2.1 },
] as const;

export type Kpi = {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "flat";
  good: boolean;
  spark: number[];
  href?: string;
  provenance: { formula: string; inputs: string[]; source: string; calculatedAt: string; version: string };
};

export const KPIS: Kpi[] = [
  {
    id: "nav",
    label: "Portfolio NAV",
    value: "$812.4M",
    delta: "+3.2%",
    trend: "up",
    good: true,
    spark: [742, 751, 760, 772, 779, 790, 801, 812],
    href: "/app/portfolio",
    provenance: {
      formula: "Σ fund NAV (5 funds) as of Sep 30, 2026",
      inputs: ["Flagship II $486.2M", "Flagship I $184.7M", "Opportunities I $96.4M", "Antero SPV $31.5M", "Venture FoF $13.6M"],
      source: "IBOR · position ledger + Q3 valuations",
      calculatedAt: at(0.3),
      version: "NAV definition v2.1",
    },
  },
  {
    id: "irr",
    label: "Net IRR",
    value: "18.2%",
    delta: "−0.4 pp",
    trend: "down",
    good: false,
    spark: [19.1, 19.0, 18.9, 18.8, 18.7, 18.6, 18.6, 18.2],
    provenance: {
      formula: "XIRR(net LP cash flows, closing NAV)",
      inputs: ["214 cash flows 2019–2026", "Closing NAV $812.4M"],
      source: "IBOR · cash-flow ledger",
      calculatedAt: at(0.3),
      version: "Net IRR v3.2",
    },
  },
  {
    id: "tvpi",
    label: "TVPI",
    value: "1.64×",
    delta: "+0.05×",
    trend: "up",
    good: true,
    spark: [1.52, 1.54, 1.56, 1.58, 1.59, 1.61, 1.62, 1.64],
    provenance: {
      formula: "(Distributions + NAV) / Paid-in",
      inputs: ["Distributions $245.0M", "NAV $812.4M", "Paid-in $644.8M"],
      source: "IBOR",
      calculatedAt: at(0.3),
      version: "TVPI v2.0",
    },
  },
  {
    id: "dpi",
    label: "DPI",
    value: "0.38×",
    delta: "+0.02×",
    trend: "up",
    good: true,
    spark: [0.29, 0.31, 0.32, 0.33, 0.35, 0.36, 0.36, 0.38],
    provenance: { formula: "Distributions / Paid-in", inputs: ["Distributions $245.0M", "Paid-in $644.8M"], source: "IBOR", calculatedAt: at(0.3), version: "DPI v2.0" },
  },
  {
    id: "deployed",
    label: "Capital deployed",
    value: "$644.8M",
    delta: "+$42.0M",
    trend: "up",
    good: true,
    spark: [522, 536, 553, 567, 585, 602, 603, 645],
    provenance: { formula: "Σ capital calls paid", inputs: ["96 capital calls across 5 funds"], source: "IBOR · capital-call events", calculatedAt: at(0.3), version: "Paid-in v1.4" },
  },
  {
    id: "exceptions",
    label: "Open exceptions",
    value: "7",
    delta: "+2 this week",
    trend: "up",
    good: false,
    spark: [3, 4, 4, 5, 5, 6, 5, 7],
    href: "/app/workflows?tab=recon",
    provenance: { formula: "Count of open recon breaks + stale valuations", inputs: ["4 recon breaks", "3 stale valuations"], source: "Reconciliation queue", calculatedAt: at(0.1), version: "—" },
  },
  {
    id: "approvals",
    label: "Pending approvals",
    value: "4",
    delta: "2 due today",
    trend: "flat",
    good: false,
    spark: [2, 3, 3, 4, 2, 3, 5, 4],
    href: "/app/workflows?tab=approvals",
    provenance: { formula: "Count of artifacts awaiting a decision", inputs: ["2 IC items", "1 LP report", "1 data override"], source: "Approval queue", calculatedAt: at(0.1), version: "—" },
  },
];

/* ---------- Work items (action queue, workflows) ---------- */

export type WorkKind = "alert" | "approval" | "recon" | "stale" | "ai-draft" | "evidence";

export type WorkItem = {
  id: string;
  kind: WorkKind;
  title: string;
  entity: { type: string; name: string };
  severity: Severity;
  owner: string;
  createdAt: string;
  due?: string;
  action: string;
  detail: string;
};

export const WORK: WorkItem[] = [
  { id: "ALR-1841", kind: "alert", title: "Covenant breach · DSCR below 1.20×", entity: { type: "Company", name: "Helios Data Centers" }, severity: "critical", owner: "R. Tan", createdAt: at(2), action: "Review", detail: "DSCR 1.14× vs covenant 1.20× (rule #18 v4)." },
  { id: "APR-0412", kind: "approval", title: "IC memo · Kirana Consumer add-on", entity: { type: "Deal", name: "Kirana Consumer" }, severity: "high", owner: "You", createdAt: at(20), due: "Today", action: "Approve", detail: "2 of 3 committee approvals recorded." },
  { id: "REC-2207", kind: "recon", title: "Cash break · USD operating account", entity: { type: "Fund", name: "OCTO Flagship Fund II" }, severity: "high", owner: "Fund accounting", createdAt: at(4), action: "Resolve", detail: "Administrator $2,418,200 vs IBOR $2,398,200 · variance $20,000." },
  { id: "VAL-0093", kind: "stale", title: "Valuation stale · 45 days", entity: { type: "Investment", name: "Solus Energy Partners" }, severity: "medium", owner: "Valuation team", createdAt: at(6), action: "Request mark", detail: "Last approved mark Aug 16, 2026 (rule #7)." },
  { id: "AID-0310", kind: "ai-draft", title: "Draft · Q3 variance explanation", entity: { type: "Company", name: "Meridian Health" }, severity: "medium", owner: "You", createdAt: at(9), action: "Review draft", detail: "EBITDA −6.1% QoQ explained from 4 sources." },
  { id: "EVD-0127", kind: "evidence", title: "Evidence request · EBITDA bridge FY24–FY26", entity: { type: "Deal", name: "Aruna Payments" }, severity: "medium", owner: "Deal team", createdAt: at(30), due: "Oct 3", action: "Request evidence", detail: "Required before IC review; data room folder 4.2 empty." },
  { id: "REC-2204", kind: "recon", title: "Position qty mismatch · 12,400 sh", entity: { type: "Investment", name: "PT Barito Renewables" }, severity: "medium", owner: "Fund accounting", createdAt: at(26), action: "Resolve", detail: "Administrator 1,212,400 sh vs IBOR 1,200,000 sh." },
  { id: "APR-0409", kind: "approval", title: "LP report · Q3 pack Flagship II", entity: { type: "Fund", name: "OCTO Flagship Fund II" }, severity: "medium", owner: "Investor relations", createdAt: at(48), due: "Oct 2", action: "Approve", detail: "Generated from reconciled IBOR as of Sep 30." },
  { id: "APR-0407", kind: "approval", title: "Data override · FX rate IDR/USD", entity: { type: "Source", name: "Market data feed" }, severity: "low", owner: "Data ops", createdAt: at(52), action: "Approve", detail: "Manual rate 16,215 vs feed 16,280 for Sep 30 close." },
  { id: "REC-2199", kind: "recon", title: "Missing trade confirm · follow-on", entity: { type: "Investment", name: "Aruna Payments" }, severity: "low", owner: "Fund accounting", createdAt: at(70), action: "Resolve", detail: "Capital call booked in IBOR; no administrator confirm yet." },
];

export const SEVERITY_ORDER: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };

/* ---------- Portfolio movement ---------- */

export const NAV_SERIES = [
  { q: "Q4 24", nav: 698 },
  { q: "Q1 25", nav: 716 },
  { q: "Q2 25", nav: 731 },
  { q: "Q3 25", nav: 742 },
  { q: "Q4 25", nav: 760 },
  { q: "Q1 26", nav: 779 },
  { q: "Q2 26", nav: 787 },
  { q: "Q3 26", nav: 812.4 },
];

/** Q3 value-creation bridge, $M. 787.0 + 42.0 − 31.8 + 17.4 − 2.2 = 812.4 */
export const BRIDGE = [
  { label: "Opening NAV", value: 787.0, kind: "total" as const },
  { label: "Capital calls", value: 42.0, kind: "step" as const },
  { label: "Distributions", value: -31.8, kind: "step" as const },
  { label: "Valuation change", value: 17.4, kind: "step" as const },
  { label: "FX", value: -2.2, kind: "step" as const },
  { label: "Closing NAV", value: 812.4, kind: "total" as const },
];

export const CASH_FLOWS = [
  { q: "Q4 25", calls: 38, dists: 21 },
  { q: "Q1 26", calls: 44, dists: 18 },
  { q: "Q2 26", calls: 29, dists: 26 },
  { q: "Q3 26", calls: 42, dists: 31.8 },
];

export const EXPOSURE_CHANGES = [
  { sector: "Digital infrastructure", weight: 24.1, change: 1.8 },
  { sector: "Renewables", weight: 19.6, change: 0.9 },
  { sector: "Consumer", weight: 16.2, change: -1.4 },
  { sector: "Healthcare", weight: 14.8, change: 0.3 },
  { sector: "Fintech", weight: 12.9, change: -0.7 },
];

/* ---------- Intelligence ---------- */

export const INTELLIGENCE = [
  { id: "INT-1", kind: "News match", title: "Meridian Health · regulatory filing detected", body: "Ministry of Health tender notice names Meridian as preferred bidder.", at: at(18), entity: "Meridian Health" },
  { id: "INT-2", kind: "AI observation", title: "Helios DSCR trending below covenant for 3 months", body: "Interest cost up 22% after July refinancing; revenue flat.", at: at(3), entity: "Helios Data Centers" },
  { id: "INT-3", kind: "Risk change", title: "Renewables exposure up 0.9 pp", body: "Driven by Barito follow-on; still inside the 25% sector limit.", at: at(12), entity: "Portfolio" },
  { id: "INT-4", kind: "Model output", title: "Q3 NAV model v2.1 completed", body: "5 funds · 38 positions · 0 validation errors.", at: at(0.3), entity: "Portfolio" },
];

/* ---------- Notifications ---------- */

export const NOTIFICATIONS = [
  { id: "N-1", severity: "critical" as Severity, title: "Covenant breach — Helios Data Centers", entity: "Helios Data Centers", at: at(2), href: "/app/alerts?id=ALR-1841", unread: true },
  { id: "N-2", severity: "high" as Severity, title: "IC memo awaiting your approval", entity: "Kirana Consumer", at: at(20), href: "/app/workflows?tab=approvals", unread: true },
  { id: "N-3", severity: "medium" as Severity, title: "AI draft ready for review", entity: "Meridian Health", at: at(9), href: "/app", unread: true },
  { id: "N-4", severity: "low" as Severity, title: "Q3 NAV model completed", entity: "Portfolio", at: at(0.3), href: "/app", unread: false },
];

/* ---------- Search index ---------- */

export const ENTITIES = [
  ...FUNDS.map((f) => ({ type: "Fund", name: f.name, id: f.id, context: `${f.strategy} · ${f.vintage}`, status: f.status, href: "/app/portfolio" })),
  { type: "Company", name: "Helios Data Centers", id: "CMP-0211", context: "Flagship Fund II · Digital infrastructure", status: "Covenant breach", href: "/app/alerts?id=ALR-1841" },
  { type: "Company", name: "Meridian Health", id: "CMP-0187", context: "Flagship Fund I · Healthcare", status: "Current", href: "/app" },
  { type: "Investment", name: "Solus Energy Partners", id: "INV-0344", context: "Opportunities I · Renewables", status: "Stale valuation", href: "/app/investments" },
  { type: "Investment", name: "PT Barito Renewables", id: "INV-0339", context: "Flagship Fund II · Renewables", status: "Recon break", href: "/app/workflows?tab=recon" },
  { type: "Prospect", name: "Kirana Consumer", id: "PRS-0098", context: "IC review · add-on", status: "Pending approval", href: "/app/deals" },
  { type: "Prospect", name: "Aruna Payments", id: "PRS-0102", context: "Due diligence", status: "Evidence requested", href: "/app/deals" },
  { type: "Report", name: "Q3 LP pack · Flagship II", id: "RPT-0231", context: "LP report", status: "Awaiting approval", href: "/app/workflows?tab=approvals" },
];

/* ---------- Recent activity (audit-style) ---------- */

export const ACTIVITY = [
  { id: "ACT-1", actor: "Q3 NAV model", verb: "completed run for", object: "5 funds", at: at(0.3) },
  { id: "ACT-2", actor: "M. Sari", verb: "approved IC memo for", object: "Barito follow-on", at: at(5) },
  { id: "ACT-3", actor: "Fund accounting", verb: "resolved cash break on", object: "Flagship Fund I", at: at(7) },
  { id: "ACT-4", actor: "OCTO", verb: "ingested administrator file for", object: "Flagship Fund II", at: at(11) },
  { id: "ACT-5", actor: "R. Tan", verb: "raised covenant alert on", object: "Helios Data Centers", at: at(26) },
];

/* ---------- Alerts ---------- */

export type AlertStatus = "Open" | "Acknowledged" | "Resolved";

export type Alert = {
  id: string;
  title: string;
  severity: Severity;
  status: AlertStatus;
  entity: { type: string; name: string };
  rule: string;
  owner: string;
  triggeredAt: string;
  observed: string;
  threshold: string;
  source: string;
};

export const ALERTS: Alert[] = [
  { id: "ALR-1841", title: "Covenant breach · DSCR below 1.20×", severity: "critical", status: "Open", entity: { type: "Company", name: "Helios Data Centers" }, rule: "#18 Debt service cover v4", owner: "R. Tan", triggeredAt: at(2), observed: "1.14×", threshold: "≥ 1.20×", source: "Q3 compliance certificate" },
  { id: "ALR-1838", title: "Leverage above 5.5× net debt / EBITDA", severity: "high", status: "Open", entity: { type: "Company", name: "Kirana Consumer" }, rule: "#12 Leverage ceiling v2", owner: "Deal team", triggeredAt: at(9), observed: "5.8×", threshold: "≤ 5.5×", source: "Management accounts Aug" },
  { id: "ALR-1835", title: "Valuation stale · 45 days", severity: "medium", status: "Acknowledged", entity: { type: "Investment", name: "Solus Energy Partners" }, rule: "#7 Mark freshness v1", owner: "Valuation team", triggeredAt: at(6), observed: "45 days", threshold: "≤ 30 days", source: "IBOR valuation log" },
  { id: "ALR-1829", title: "Sector concentration near limit", severity: "medium", status: "Open", entity: { type: "Fund", name: "OCTO Flagship Fund II" }, rule: "#3 Sector limit 25% v3", owner: "Risk", triggeredAt: at(12), observed: "24.1%", threshold: "≤ 25.0% (warn at 24%)", source: "Look-through exposure" },
  { id: "ALR-1826", title: "Revenue miss vs budget > 10%", severity: "high", status: "Acknowledged", entity: { type: "Company", name: "Meridian Health" }, rule: "#21 Budget variance v1", owner: "Portfolio ops", triggeredAt: at(20), observed: "−11.4%", threshold: "≥ −10%", source: "Q3 management accounts" },
  { id: "ALR-1822", title: "FX exposure unhedged above policy", severity: "low", status: "Open", entity: { type: "Fund", name: "OCTO Opportunities I" }, rule: "#9 FX hedge ratio v2", owner: "Treasury", triggeredAt: at(30), observed: "38% unhedged", threshold: "≤ 35%", source: "Treasury positions" },
  { id: "ALR-1817", title: "Missing Q3 administrator file", severity: "high", status: "Resolved", entity: { type: "Fund", name: "OCTO Venture FoF" }, rule: "#30 Source completeness v1", owner: "Data ops", triggeredAt: at(52), observed: "File not received", threshold: "By T+5", source: "Ingestion monitor" },
  { id: "ALR-1809", title: "Key person departure reported", severity: "medium", status: "Resolved", entity: { type: "Company", name: "Aruna Payments" }, rule: "News match · leadership", owner: "Deal team", triggeredAt: at(96), observed: "CFO resignation", threshold: "Any C-level change", source: "News feed" },
];

/* ---------- Workflows ---------- */

export type Task = { id: string; title: string; entity: { type: string; name: string }; type: string; priority: Severity; due: string; status: "To do" | "In progress" | "Blocked"; assignee: string };

export const TASKS: Task[] = [
  { id: "TSK-3120", title: "Review IC memo — Kirana add-on", entity: { type: "Deal", name: "Kirana Consumer" }, type: "Approval", priority: "high", due: "Sep 30", status: "To do", assignee: "You" },
  { id: "TSK-3118", title: "Review AI variance draft", entity: { type: "Company", name: "Meridian Health" }, type: "Review", priority: "medium", due: "Oct 1", status: "To do", assignee: "You" },
  { id: "TSK-3114", title: "Sign off Q3 NAV for Flagship II", entity: { type: "Fund", name: "OCTO Flagship Fund II" }, type: "Sign-off", priority: "high", due: "Oct 2", status: "In progress", assignee: "You" },
  { id: "TSK-3109", title: "Collect EBITDA bridge evidence", entity: { type: "Deal", name: "Aruna Payments" }, type: "Evidence", priority: "medium", due: "Oct 3", status: "Blocked", assignee: "You" },
  { id: "TSK-3101", title: "Update Helios lender call notes", entity: { type: "Company", name: "Helios Data Centers" }, type: "Follow-up", priority: "critical", due: "Sep 30", status: "In progress", assignee: "You" },
  { id: "TSK-3096", title: "Confirm Barito share count with admin", entity: { type: "Investment", name: "PT Barito Renewables" }, type: "Recon", priority: "medium", due: "Oct 4", status: "To do", assignee: "You" },
];

export type Approval = { id: string; title: string; entity: { type: string; name: string }; kind: string; requestedBy: string; requestedAt: string; due: string; progress: string; summary: string };

export const APPROVALS: Approval[] = [
  { id: "APR-0412", title: "IC memo · Kirana Consumer add-on", entity: { type: "Deal", name: "Kirana Consumer" }, kind: "Investment committee", requestedBy: "A. Wijaya", requestedAt: at(20), due: "Today", progress: "2 of 3 approvals", summary: "$18.0M add-on at 7.2× EBITDA; funded from Flagship II reserves. Leverage alert ALR-1838 open." },
  { id: "APR-0409", title: "LP report · Q3 pack Flagship II", entity: { type: "Fund", name: "OCTO Flagship Fund II" }, kind: "LP report", requestedBy: "Investor relations", requestedAt: at(48), due: "Oct 2", progress: "0 of 1 approvals", summary: "Generated from reconciled IBOR as of Sep 30. 2 open recon breaks disclosed in notes." },
  { id: "APR-0407", title: "Data override · FX rate IDR/USD", entity: { type: "Source", name: "Market data feed" }, kind: "Data override", requestedBy: "Data ops", requestedAt: at(52), due: "Oct 1", progress: "0 of 1 approvals", summary: "Manual rate 16,215 vs feed 16,280 for Sep 30 close; feed published a stale print." },
  { id: "APR-0401", title: "Capital call · Opportunities I #14", entity: { type: "Fund", name: "OCTO Opportunities I" }, kind: "Capital call", requestedBy: "Fund accounting", requestedAt: at(70), due: "Oct 5", progress: "1 of 2 approvals", summary: "$12.5M call for Solus follow-on and fees; notices drafted for 38 LPs." },
];

export type ReconBreak = { id: string; entity: { type: string; name: string }; field: string; source: string; sourceValue: string; iborValue: string; variance: string; age: string; severity: Severity; cause: string };

export const RECON: ReconBreak[] = [
  { id: "REC-2207", entity: { type: "Fund", name: "OCTO Flagship Fund II" }, field: "Cash · USD operating", source: "Administrator", sourceValue: "$2,418,200", iborValue: "$2,398,200", variance: "$20,000", age: "4h", severity: "high", cause: "Unbooked FX settlement on Sep 29" },
  { id: "REC-2204", entity: { type: "Investment", name: "PT Barito Renewables" }, field: "Position quantity", source: "Administrator", sourceValue: "1,212,400 sh", iborValue: "1,200,000 sh", variance: "12,400 sh", age: "1d", severity: "medium", cause: "Stock dividend not yet processed in IBOR" },
  { id: "REC-2199", entity: { type: "Investment", name: "Aruna Payments" }, field: "Trade confirm", source: "Custodian", sourceValue: "—", iborValue: "$4,000,000 call", variance: "Missing", age: "3d", severity: "low", cause: "Confirm not received from custodian" },
  { id: "REC-2196", entity: { type: "Fund", name: "OCTO Flagship Fund I" }, field: "Management fee accrual", source: "Administrator", sourceValue: "$1,184,000", iborValue: "$1,176,500", variance: "$7,500", age: "5d", severity: "medium", cause: "Day-count basis differs (ACT/360 vs ACT/365)" },
];
