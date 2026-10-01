/**
 * The OCTO homepage has exactly eight primary sections (megaplan §00A).
 *
 * `OctoLanding` renders from this tuple and a `Record<LandingSection, …>`
 * registry, so a ninth section cannot be added without changing the type —
 * and the unit test and E2E test both assert the count. New content becomes
 * a module inside one of these sections, never Section 09.
 */
export const landingSections = ["hero", "featured", "octo-system", "fragmented-truth", "future", "from-data-to-decision", "cta", "footer"] as const;

export type LandingSection = (typeof landingSections)[number];

export const MAX_LANDING_SECTIONS = 8;

/** Which modules live inside which section — documentation that doubles as a test fixture. */
export const sectionModules: Record<LandingSection, string[]> = {
  hero: ["Announcement", "Header", "Hero statement", "System atlas", "Signal strip (demo metrics)"],
  featured: ["Investment Ontology", "Investment Book of Record", "Governed Intelligence", "Portfolio Operations", "IC Workflow"],
  "octo-system": ["System statement", "System index", "Embedded product proof", "Institutional grade"],
  "fragmented-truth": ["Fragments", "Network graph", "Technology story", "Integration categories"],
  future: ["Editorial image", "Vision statement"],
  "from-data-to-decision": ["Screen", "Decide", "Monitor", "Report"],
  cta: ["Request access", "Explore OCTO"],
  footer: ["The OCTO Perspective", "Navigation", "Legal"],
};
