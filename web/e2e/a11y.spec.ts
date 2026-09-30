import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Accessibility gate (plan §29, §35): axe on every major route, light and
 * dark. Serious and critical violations fail the run.
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
  "/app/data",
  "/app/settings",
];

for (const scheme of ["light", "dark"] as const) {
  test.describe(`axe · ${scheme}`, () => {
    test.use({ colorScheme: scheme });
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
