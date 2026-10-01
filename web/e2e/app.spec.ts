import { expect, test, type Page } from "@playwright/test";

/*
 * Primary workflows (plan §35): navigation, search, object drill-down,
 * filter persistence, table interactions, approval flow, density, KPI
 * drawer, NAV range, AI trace, report flow with publish gate, responsive shell.
 * The dashboard is light-only (DS-002).
 */

async function ready(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator("main h1").first()).toBeVisible();
}

test("sidebar navigation reaches every primary page", async ({ page }) => {
  await ready(page, "/app");
  const nav = page.getByRole("navigation", { name: "Primary" });
  for (const [label, heading] of [
    ["Portfolio", "Portfolio"],
    ["Funds", "Funds"],
    ["Investments", "Investments"],
    ["Companies", "Companies"],
    ["Deals", "Deals"],
    ["Workflows", "Workflows"],
    ["Reconciliation", "Reconciliation"],
    ["Alerts", "Alerts"],
    ["Analytics", "Analytics"],
    ["Reports", "Reports"],
    ["Data & Sources", "Data & Sources"],
    ["Settings", "Settings"],
  ]) {
    await nav.getByRole("link", { name: new RegExp(`^${label.replace("&", "\\&")}`) }).click();
    await expect(page.locator("main h1").first()).toHaveText(heading);
    await expect(nav.getByRole("link", { name: new RegExp(`^${label.replace("&", "\\&")}`) })).toHaveAttribute("aria-current", "page");
  }
});

test("command menu finds a company and opens it", async ({ page }) => {
  await ready(page, "/app");
  await page.keyboard.press("Control+k");
  const box = page.getByRole("combobox");
  await expect(box).toBeFocused();
  await box.fill("helios");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/app\/companies\/cmp-0211/);
  await expect(page.locator("main h1").first()).toHaveText("Helios Data Centers");
});

test("drill-down fund → company keeps the fund in the breadcrumb", async ({ page }) => {
  await ready(page, "/app/funds/fnd-002?tab=holdings");
  await page.getByRole("link", { name: "Helios Data Centers" }).first().click();
  await expect(page).toHaveURL(/cmp-0211\?fund=fnd-002/);
  const crumbs = page.getByRole("navigation", { name: "Breadcrumb" });
  await expect(crumbs.getByRole("link", { name: "Flagship II" })).toBeVisible();
  await crumbs.getByRole("link", { name: "Flagship II" }).click();
  await expect(page).toHaveURL(/\/app\/funds\/fnd-002/);
});

test("company dossier exposes all ten tabs", async ({ page }) => {
  await ready(page, "/app/companies/cmp-0211");
  const tabs = page.getByRole("tablist", { name: "Company sections" }).getByRole("tab");
  await expect(tabs).toHaveCount(10);
  await tabs.filter({ hasText: "Lineage" }).click();
  await expect(page).toHaveURL(/tab=lineage/);
  await expect(page.getByText("Fair value lineage")).toBeVisible();
});

test("faceted filter shows a removable chip and a shared view restores it", async ({ page }) => {
  await ready(page, "/app/investments");
  // The toolbar facet comes before the column header of the same name.
  await page.getByRole("button", { name: "Fund", exact: true }).first().click();
  await page.getByRole("dialog", { name: "Filter by Fund" }).getByRole("checkbox", { name: "Opportunities I" }).click();
  await page.keyboard.press("Escape");
  const chip = page.getByRole("button", { name: "Remove Fund filter Opportunities I" });
  await expect(chip).toBeVisible();
  await expect(page.getByText(/4 of 20/).first()).toBeVisible();

  // Shareable view: the encoded state in the URL reproduces the filter.
  const view = { query: "", sort: [], facets: { fund: ["Opportunities I"] }, hidden: [], order: [], pinned: ["company"], groupBy: null };
  const encoded = Buffer.from(JSON.stringify(view)).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  await ready(page, `/app/investments?investments=${encoded}`);
  await expect(page.getByRole("button", { name: "Remove Fund filter Opportunities I" })).toBeVisible();
});

test("table sort, selection and bulk actions", async ({ page }) => {
  await ready(page, "/app/alerts");
  const table = page.getByRole("table", { name: "Alerts" });
  await table.getByRole("button", { name: /^Triggered/ }).click();
  await expect(table.getByRole("columnheader", { name: /Triggered/ })).toHaveAttribute("aria-sort", "ascending");
  await table.getByRole("checkbox", { name: "Select ALR-1841" }).click();
  const bulk = page.getByRole("region", { name: "Bulk actions" });
  await expect(bulk).toContainText("1 selected");
  await bulk.getByRole("button", { name: "Acknowledge" }).click();
  await expect(page.getByRole("status").filter({ hasText: "acknowledged" })).toBeVisible();
});

test("approval requires a comment before deciding", async ({ page }) => {
  await ready(page, "/app/workflows?tab=approvals&id=APR-0412");
  const sheet = page.getByRole("dialog");
  await sheet.getByRole("button", { name: "Approve" }).click();
  await expect(sheet.getByText(/Add at least 5 characters/)).toBeVisible();
  await sheet.getByLabel(/Decision comment/).fill("Leverage mitigated by the committed equity cure.");
  await sheet.getByRole("button", { name: "Approve" }).click();
  await expect(page.getByRole("status").filter({ hasText: "APR-0412" })).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("reconciliation break cannot be resolved without a reason", async ({ page }) => {
  await ready(page, "/app/reconciliation?id=REC-2207");
  const sheet = page.getByRole("dialog");
  await sheet.getByRole("radio", { name: /Accept IBOR/ }).click();
  await sheet.getByRole("button", { name: /Resolve · Accept IBOR/ }).click();
  await expect(sheet.getByText(/Add at least 5 characters/)).toBeVisible();
  await sheet.getByLabel(/Evidence and reasoning/).fill("FX settlement booked on 30 Sep; timing only.");
  await sheet.getByRole("button", { name: /Resolve · Accept IBOR/ }).click();
  await expect(page.getByRole("status").filter({ hasText: "REC-2207" })).toBeVisible();
});

test("density preference applies globally and the app stays light", async ({ page }) => {
  await ready(page, "/app/settings?tab=appearance");
  await expect(page.getByRole("radio", { name: "Dark" })).toHaveCount(0);
  await page.getByRole("radio", { name: "Comfortable" }).first().click();
  await ready(page, "/app/companies");
  await expect(page.locator("tbody tr[data-row-id]").first()).toHaveClass(/h-16/);
  await expect(page.locator(".octo-app")).not.toHaveClass(/\bdark\b/);
});

test("KPI card opens the metric drawer, which hands over to lineage", async ({ page }) => {
  await ready(page, "/app");
  await page.getByRole("button", { name: /^Total NAV: .* Open metric details$/ }).click();
  const drawer = page.getByRole("dialog");
  await expect(drawer).toContainText("Definition");
  await expect(drawer).toContainText("Drivers");
  await expect(drawer).toContainText("Σ fund NAV");
  await drawer.getByRole("button", { name: "View lineage" }).click();
  await expect(page.getByRole("dialog")).toContainText("NAV definition v2.1");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("NAV chart range switches series and keeps the reconciled endpoint", async ({ page }) => {
  await ready(page, "/app");
  const chart = page.getByRole("region", { name: "Portfolio NAV" });
  await expect(chart).toContainText("$812.4M");
  await chart.getByRole("button", { name: "Range: Quarterly" }).click();
  await page.getByRole("menuitem", { name: "Daily" }).click();
  await expect(chart.getByRole("button", { name: "Range: Daily" })).toBeVisible();
  await expect(chart).toContainText("$812.4M");
  await expect(chart).toContainText("30 Sep 2026");
});

test("AI draft trace shows inputs, evidence and checks", async ({ page }) => {
  await ready(page, "/app/workflows?tab=ai");
  const card = page.getByRole("article", { name: /AI draft: Q3 variance explanation/ });
  await expect(card.getByRole("list", { name: "Evidence" })).toContainText("Q3 management accounts");
  await card.getByRole("button", { name: "View trace" }).click();
  const trace = page.getByRole("dialog");
  await expect(trace.getByRole("tab", { name: /Inputs/ })).toHaveAttribute("aria-selected", "true");
  await trace.getByRole("tab", { name: /Checks/ }).click();
  await expect(trace).toContainText("Figures reconcile to IBOR");
  await expect(trace).toContainText("Model reasoning is not shown");
});

test("report flow blocks publishing until issues are resolved", async ({ page }) => {
  await ready(page, "/app/reports?new=1");
  const next = page.getByRole("button", { name: "Continue" });
  await next.click(); // template
  await next.click(); // period
  await next.click(); // scope
  await next.click(); // source metrics
  await page.getByRole("button", { name: "Generate draft" }).click();
  await expect(page.getByText("Draft generated")).toBeVisible();
  await next.click(); // generate → review
  await next.click(); // review → issues
  await expect(next).toBeDisabled();
  while (await page.getByRole("button", { name: "Mark resolved" }).count()) await page.getByRole("button", { name: "Mark resolved" }).first().click();
  await expect(page.getByText("All issues resolved")).toBeVisible();
  await next.click(); // issues → approve
  await page.getByLabel(/Approval comment/).fill("Numbers tie to IBOR; disclosures complete.");
  await page.getByRole("button", { name: "Approve report" }).click();
  await next.click(); // approve → publish
  await page.getByRole("button", { name: "Publish", exact: true }).click();
  await expect(page.getByText("Published", { exact: true }).first()).toBeVisible();
});

test("report generation failure offers recovery", async ({ page }) => {
  await ready(page, "/app/reports?new=1");
  const next = page.getByRole("button", { name: "Continue" });
  for (let i = 0; i < 4; i++) await next.click();
  await page.getByRole("switch", { name: /Simulate a generation failure/ }).click();
  await page.getByRole("button", { name: "Generate draft" }).click();
  await expect(page.getByText("We couldn't generate the draft.")).toBeVisible();
  await expect(page.getByRole("link", { name: "View last successful draft" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open source issues" })).toBeVisible();
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByText("Draft generated")).toBeVisible();
});

test("mobile drawer navigation @mobile", async ({ page }) => {
  await ready(page, "/app");
  await page.getByRole("button", { name: "Open navigation" }).click();
  const drawer = page.getByRole("dialog", { name: "Navigation" });
  await drawer.getByRole("link", { name: /^Deals/ }).click();
  await expect(page.locator("main h1").first()).toHaveText("Deals");
  const overflow = await page.evaluate(() => document.querySelector("#main")!.scrollWidth - document.querySelector("#main")!.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
