import { expect, test, type Page } from "@playwright/test";

/*
 * Primary workflows (plan §35): navigation, search, object drill-down,
 * filter persistence, table interactions, approval flow, theme, density,
 * responsive shell.
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

test("theme and density preferences apply globally", async ({ page }) => {
  await ready(page, "/app/settings?tab=appearance");
  await page.getByRole("radio", { name: "Dark" }).first().click();
  await expect(page.locator(".octo-app")).toHaveClass(/\bdark\b/);
  await page.getByRole("radio", { name: "Comfortable" }).click();
  await ready(page, "/app/companies");
  await expect(page.locator("tbody tr[data-row-id]").first()).toHaveClass(/h-13/);
  await expect(page.locator(".octo-app")).toHaveClass(/\bdark\b/);
});

test("lineage drawer explains a KPI", async ({ page }) => {
  await ready(page, "/app");
  await page.getByRole("button", { name: "View lineage for Total NAV" }).click();
  const drawer = page.getByRole("dialog");
  await expect(drawer).toContainText("Σ fund NAV");
  await expect(drawer).toContainText("NAV definition v2.1");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
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
