import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Accessibility gate (plan §29, §35): axe on every major route. The
 * dashboard is light-only (DS-002). Serious and critical violations fail.
 */
const ROUTES = [
  "/app",
  "/app/portfolio",
  "/app/funds",
  "/app/funds/fnd-002",
  "/app/investments",
  "/app/companies",
  "/app/companies/cmp-0211",
  "/app/deals",
  "/app/deals/dl-0301",
  "/app/reconciliation",
  "/app/workflows",
  "/app/alerts",
  "/app/analytics",
  "/app/reports",
  "/app/reports/rpt-0231",
  "/app/reports?new=1",
  "/app/workflows?tab=ai",
  "/app/workflows?tab=exceptions",
  "/app/data?tab=lineage",
  "/app/deals?view=calendar",
  "/app/deals?view=timeline",
  "/app/funds/fnd-002?tab=activity",
  "/app/reports/rpt-0212",
  "/app/reports/rpt-0188",
  "/app/portfolio?state=error",
  "/app/data",
  "/app/settings",
];

{
  test.describe("axe · light", () => {
    test.use({ colorScheme: "light" });
    for (const route of ROUTES) {
      test(`${route} has no serious violations`, async ({ page }) => {
        await page.goto(route);
        await expect(page.locator("main h1").first()).toBeVisible();
        await page.waitForTimeout(400); // demo resolvers settle
        const results = await new AxeBuilder({ page }).include(".octo-app").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
        const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
        expect(serious.map((v) => `${v.id}: ${v.nodes.length} × ${v.nodes[0]?.target.join(" ")} — ${v.help}`)).toEqual([]);
      });
    }
  });
}
