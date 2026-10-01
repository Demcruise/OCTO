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
  // V3 FILTER-001: one Filters control opens a drawer with every field.
  await page.getByRole("button", { name: "Filters", exact: true }).click();
  const drawer = page.getByRole("dialog", { name: "Filter investments" });
  await drawer.getByRole("button", { name: /^Opportunities I/ }).click();
  await drawer.getByRole("button", { name: "Apply" }).click();
  await expect(page.getByRole("button", { name: /^Filters 1 active/ })).toBeVisible();
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
  await table.getByRole("button", { name: /^Date/ }).click();
  await expect(table.getByRole("columnheader", { name: /Date/ })).toHaveAttribute("aria-sort", "ascending");
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

test("density preference applies globally and Light is the default theme", async ({ page }) => {
  await ready(page, "/app/settings?tab=appearance");
  await expect(page.locator(".octo-app")).not.toHaveClass(/\bdark\b/);
  await page.getByRole("radio", { name: "Comfortable" }).first().click();
  await ready(page, "/app/companies");
  await expect(page.locator("tbody tr[data-row-id]").first()).toHaveClass(/h-16/);
});

test("theme switcher replaces help: Light / Dark / System persists", async ({ page }) => {
  await ready(page, "/app");
  const header = page.locator("header").filter({ has: page.getByRole("button", { name: "Search and commands" }) });
  await expect(header.getByRole("button", { name: /Keyboard shortcuts/ })).toHaveCount(0);
  await header.getByRole("button", { name: "Theme" }).click();
  const menu = page.getByRole("menu", { name: "Theme" });
  await expect(menu.getByRole("menuitemradio", { name: /Light/ })).toHaveAttribute("aria-checked", "true");
  await menu.getByRole("menuitemradio", { name: /Dark/ }).click();
  await expect(page.locator(".octo-app")).toHaveClass(/\bdark\b/);
  expect(await page.evaluate(() => localStorage.getItem("octo-theme"))).toBe("dark");
  await page.reload();
  await expect(page.locator(".octo-app")).toHaveClass(/\bdark\b/);
  await header.getByRole("button", { name: "Theme" }).click();
  await page.getByRole("menuitemradio", { name: /System/ }).click();
  expect(await page.evaluate(() => localStorage.getItem("octo-theme"))).toBe("system");
  await expect(page.locator(".octo-app")).not.toHaveClass(/\bdark\b/); // the test browser prefers light
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

test("top bar keeps only search, notifications and theme", async ({ page }) => {
  await ready(page, "/app");
  const header = page.locator("header").filter({ has: page.getByRole("button", { name: "Search and commands" }) });
  await expect(header.getByRole("radiogroup", { name: "Reporting period" })).toHaveCount(0);
  await expect(header.getByRole("button", { name: /System status/ })).toHaveCount(0);
  await expect(header.getByRole("button", { name: "Search and commands" })).toBeVisible();
  await expect(header.getByRole("button", { name: /^Notifications/ })).toBeVisible();
  await expect(header.getByRole("button", { name: "Theme" })).toBeVisible();
});

test("V3: KPI grids read 3 + 3 and the queue and NAV fill their frames", async ({ page }) => {
  await ready(page, "/app");
  const grid = page.getByRole("button", { name: /^Total NAV: / }).locator("xpath=..");
  expect((await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns)).split(" ").length).toBe(3);
  const heights = await page.evaluate(() => {
    const h = (t: string) => [...document.querySelectorAll("h2")].find((x) => x.textContent?.includes(t))!.closest("section")!;
    const pq = h("Priority queue");
    const nav = document.querySelector('[aria-label="Portfolio NAV"]')!;
    const act = h("Recent activity");
    return { pq: pq.getBoundingClientRect().height, right: (pq.nextElementSibling as HTMLElement).getBoundingClientRect().height, nav: nav.getBoundingClientRect().height, act: act.getBoundingClientRect().height };
  });
  expect(Math.abs(heights.pq - heights.right)).toBeLessThan(2);
  expect(Math.abs(heights.nav - heights.act)).toBeLessThan(2);
  await ready(page, "/app/portfolio");
  const pgrid = page.getByRole("button", { name: /^Total NAV: / }).locator("xpath=..");
  expect((await pgrid.evaluate((el) => getComputedStyle(el).gridTemplateColumns)).split(" ").length).toBe(3);
});

test("vintage comparison lists years chronologically", async ({ page }) => {
  await ready(page, "/app/funds");
  const chart = page.getByRole("region", { name: "Vintage comparison" });
  const years = await chart.locator("table.sr-only tbody tr th, table.sr-only tbody tr td:first-child").allTextContents();
  const nums = years.map(Number).filter((n) => !Number.isNaN(n));
  expect(nums.length).toBeGreaterThan(2);
  expect([...nums].sort((a, b) => a - b)).toEqual(nums);
});

test("filters persist when returning from a detail page", async ({ page }) => {
  await ready(page, "/app/companies");
  await page.getByRole("button", { name: /^Filters/ }).click();
  const drawer = page.getByRole("dialog", { name: "Filter companies" });
  await drawer.getByRole("button", { name: /^Renewables/ }).click();
  await drawer.getByRole("button", { name: "Apply" }).click();
  await expect(page.getByRole("button", { name: "Remove Sector filter Renewables" })).toBeVisible();
  await page.getByRole("table", { name: "Companies" }).getByRole("link").first().click();
  await expect(page).toHaveURL(/\/app\/companies\/cmp-/);
  await page.goBack();
  await expect(page.getByRole("button", { name: "Remove Sector filter Renewables" })).toBeVisible();
});

test("deals share one filter state across board, timeline and calendar", async ({ page }) => {
  await ready(page, "/app/deals");
  await page.getByRole("button", { name: "Filters", exact: true }).click();
  const drawer = page.getByRole("dialog", { name: "Filter deals" });
  await drawer.getByRole("button", { name: /^R\. Tan/ }).click();
  await drawer.getByRole("button", { name: "Apply" }).click();
  await expect(page.getByText(/4 of 12 deals/)).toBeVisible();
  await page.getByRole("tab", { name: /Timeline/ }).click();
  await expect(page.getByText(/4 of 12 deals/)).toBeVisible();
  await expect(page.getByRole("region", { name: "Blocked" })).not.toContainText("Aruna Payments");
  await page.getByRole("tab", { name: /Calendar/ }).click();
  await expect(page.getByRole("button", { name: /^Filters 1 active/ })).toBeVisible();
});

test("lineage explorer: landing state, node drawer, open source and come back", async ({ page }) => {
  await ready(page, "/app/data?tab=lineage");
  await expect(page.getByText("Highlighted path:")).toBeVisible();
  for (const t of ["Recently changed mappings", "Lineage exceptions", "Popular metrics"]) await expect(page.getByRole("heading", { name: t })).toBeVisible();
  await page.getByRole("button", { name: /MAP-090 accruals/ }).first().click();
  await expect(page).toHaveURL(/chain=fund-nav-accruals/);
  const drawer = page.getByRole("dialog");
  await expect(drawer).toContainText("Source field");
  await expect(drawer).toContainText("accruals.mgmt_fee");
  await drawer.getByRole("button", { name: "Back to lineage" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByText(/lineage exception/)).toBeVisible();
  await page.getByRole("button", { name: "Inspect source" }).click();
  await expect(page.getByRole("dialog")).toContainText("Rows processed");
  await page.getByRole("dialog").getByRole("link", { name: "Open source" }).click();
  await expect(page).toHaveURL(/source=SRC-ADM2/);
  await page.getByRole("dialog").getByRole("link", { name: /Back to lineage/ }).click();
  await expect(page).toHaveURL(/tab=lineage&chain=fund-nav-accruals/);
  await expect(page.getByText(/lineage exception/)).toBeVisible();
});

test("KPI cards carry no mini charts and use explicit trend semantics", async ({ page }) => {
  await ready(page, "/app");
  const dry = page.getByRole("button", { name: /^Dry powder: .* Open metric details$/ });
  await expect(dry.locator("svg[role=img]")).toHaveCount(0);
  await expect(dry).toContainText("(unfavourable)");
  await expect(page.getByRole("button", { name: /^Invested capital: .* Open metric details$/ })).toContainText("(favourable)");
  await dry.click();
  await expect(page.getByRole("dialog")).toContainText("Capacity left");
});

test("expanded NAV chart shows full history and returns focus", async ({ page }) => {
  await ready(page, "/app");
  const expand = page.getByRole("button", { name: "Expand Portfolio NAV" });
  await expand.click();
  const dialog = page.getByRole("dialog", { name: /Portfolio NAV/ });
  await expect(dialog).toContainText("full history");
  await expect(dialog.getByRole("img", { name: /full history/ })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(expand).toBeFocused();
});

test("fund page shows trajectory, balanced bridge and chronological activity", async ({ page }) => {
  await ready(page, "/app/funds/fnd-002");
  await expect(page.getByRole("region", { name: "NAV trajectory" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Q3 value bridge" })).toContainText("= closing");
  await page.getByRole("tab", { name: "Activity" }).click();
  await expect(page.getByRole("region", { name: "Today" })).toContainText("Q3 NAV struck");
  await expect(page.getByRole("region", { name: "Earlier" })).toBeVisible();
});

test("deals calendar and timeline share one schedule", async ({ page }) => {
  await ready(page, "/app/deals?view=calendar");
  await expect(page.getByRole("group", { name: /October 2026 deal calendar/ })).toBeVisible();
  await page.getByRole("button", { name: "Previous month" }).click();
  await expect(page.getByRole("group", { name: /September 2026 deal calendar/ })).toBeVisible();
  const coming = page.locator("section").filter({ has: page.getByRole("heading", { name: "Coming up" }) });
  await coming.getByRole("button").first().click();
  await expect(page.getByRole("link", { name: /Open deal/ })).toBeVisible();
  await ready(page, "/app/deals?view=timeline");
  await expect(page.getByRole("region", { name: "Blocked" })).toContainText("Diligence blocked");
  await expect(page.getByRole("region", { name: "What happens next" })).toBeVisible();
});

test("risk vs return filters and opens an entity drawer", async ({ page }) => {
  await ready(page, "/app/analytics");
  const chart = page.getByRole("region", { name: "Risk vs return" });
  await chart.getByRole("combobox", { name: "Fund" }).selectOption("Flagship II");
  await expect(chart).toContainText("8 of 20 positions");
  const plot = chart.getByRole("img", { name: /Risk vs return by position/ });
  await plot.focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  const drawer = page.getByRole("dialog");
  await expect(drawer).toContainText("Return (gross IRR)");
  await expect(drawer.getByRole("link", { name: /Open company/ })).toBeVisible();
});

test("report rows open real detail; publish is gated on approval", async ({ page }) => {
  await ready(page, "/app/reports?status=pending-approval");
  await page.getByRole("link", { name: "Q3 2026 LP report · Flagship II" }).click();
  await expect(page.locator("main h1").first()).toHaveText("Q3 2026 LP report · Flagship II");
  for (const t of ["Executive summary", "Performance", "Attribution", "Exceptions", "Lineage and sources", "Notes", "Approval history"]) await expect(page.getByText(t, { exact: true }).first()).toBeVisible();
  const publish = page.getByRole("button", { name: "Publish", exact: true });
  await expect(publish).toBeDisabled();
  await page.getByRole("button", { name: "Review", exact: true }).click();
  await page.getByRole("button", { name: /Refresh binding/ }).click();
  await page.getByLabel(/Approval comment/).fill("Ties to IBOR; disclosures complete.");
  await page.getByRole("button", { name: "Approve", exact: true }).last().click();
  await expect(publish).toBeEnabled();
  await publish.click();
  await expect(page.getByText("Published").first()).toBeVisible();
});

test("templates, scheduled and unknown reports never render blank", async ({ page }) => {
  await ready(page, "/app/reports/rpt-0188");
  await expect(page.getByText("This is a template")).toBeVisible();
  await ready(page, "/app/reports/rpt-0219");
  await expect(page.getByText(/Scheduled · Monthly/)).toBeVisible();
  await page.goto("/app/reports/rpt-9999");
  await expect(page.getByText("This report isn’t available")).toBeVisible();
});

test("every page body supports designed states", async ({ page }) => {
  await ready(page, "/app/portfolio?state=error");
  await expect(page.getByText("We couldn’t load this page.")).toBeVisible();
  await page.getByRole("button", { name: "Retry" }).click();
  await expect(page).not.toHaveURL(/state=/);
  for (const [state, text] of [["empty", "Nothing to show for this workspace yet"], ["permission", "You don’t have access to this page"], ["stale", "Showing data from the last successful refresh"], ["partial", "Some data didn’t load"]]) {
    await ready(page, `/app/funds?state=${state}`);
    await expect(page.getByText(text)).toBeVisible();
  }
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
