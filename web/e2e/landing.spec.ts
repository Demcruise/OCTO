import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/*
 * Landing QA gate (megaplan §00A, §33, §36): eight sections, motion and
 * reduced-motion behaviour, stable workflow previews, no overflow, a11y.
 */

async function open(page: Page) {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("One System");
}

test("renders exactly eight primary sections", async ({ page }) => {
  await open(page);
  const ids = await page.locator("[data-landing-section]").evaluateAll((els) => els.map((e) => e.getAttribute("data-landing-section")));
  expect(ids).toEqual(["hero", "featured", "octo-system", "fragmented-truth", "future", "from-data-to-decision", "cta", "footer"]);
});

test("hero timeline reveals every element", async ({ page }) => {
  await open(page);
  await expect
    .poll(async () => page.locator("#hero [data-anim]").evaluateAll((els) => els.every((e) => Number(getComputedStyle(e).opacity) > 0.99)), { timeout: 8000 })
    .toBe(true);
  await expect(page.getByText("Demo environment").first()).toBeVisible();
});

test("featured stories autoplay, and manual selection switches immediately", async ({ page }) => {
  await open(page);
  await page.locator("#featured").scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  const tabs = page.getByRole("tablist", { name: "Featured capabilities" }).getByRole("tab");
  await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true", { timeout: 11_000 });
  await tabs.nth(4).click();
  await expect(tabs.nth(4)).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("into one workflow.")).toBeVisible();
});

test("workflow states swap inside a fixed-height preview", async ({ page }) => {
  await open(page);
  const preview = page.locator("#wf-preview");
  await preview.scrollIntoViewIfNeeded();
  const before = await preview.boundingBox();
  const sectionBefore = await page.locator("#from-data-to-decision").boundingBox();
  await page.getByRole("tab", { name: /Report/ }).click();
  await expect(page.getByText("21.84%")).toBeVisible();
  await expect.poll(() => preview.locator("[data-wf-panel]").evaluateAll((els) => els.map((e) => Math.round(Number(getComputedStyle(e).opacity))))).toEqual([0, 0, 0, 1]);
  // Sub-pixel layout can differ by <0.01px between frames; compare to the nearest pixel.
  expect((await preview.boundingBox())?.height).toBeCloseTo(before?.height ?? 0, 0);
  expect((await page.locator("#from-data-to-decision").boundingBox())?.height).toBeCloseTo(sectionBefore?.height ?? 0, 0);
});

test("fragmented truth network has icon-bearing nodes around OCTO", async ({ page }) => {
  await open(page);
  const net = page.locator("[data-network]");
  await net.scrollIntoViewIfNeeded();
  await expect(net.locator("[data-net='input']")).toHaveCount(6);
  await expect(net.locator("[data-net='output']")).toHaveCount(3);
  expect(await net.locator("[data-net='input'] svg, [data-net='output'] svg").count()).toBe(9);
  await expect(net.getByText("Governed context")).toBeVisible();
});

test("header search jumps to a section", async ({ page }) => {
  await open(page);
  await page.getByRole("button", { name: "Search OCTO" }).click();
  await page.getByRole("combobox").fill("perspective");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#perspective$/);
});

test("request access validates the email", async ({ page }) => {
  await open(page);
  await page.locator("#cta").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Request", exact: true }).click();
  await expect(page.getByText("Enter a work email address.")).toBeVisible();
  await page.getByLabel("Work email").fill("analyst@fund.example");
  await page.getByRole("button", { name: "Request", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Request recorded" })).toBeVisible();
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("shows final states and disables autoplay", async ({ page }) => {
    await open(page);
    expect(await page.locator("#hero [data-anim]").evaluateAll((els) => els.every((e) => getComputedStyle(e).opacity === "1"))).toBe(true);
    await page.locator("#featured").scrollIntoViewIfNeeded();
    await page.waitForTimeout(9000);
    await expect(page.getByRole("tablist", { name: "Featured capabilities" }).getByRole("tab").nth(0)).toHaveAttribute("aria-selected", "true");
  });
});

test("no horizontal overflow and no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await open(page);
  for (const id of ["featured", "octo-system", "fragmented-truth", "future", "from-data-to-decision", "cta", "footer"]) await page.locator(`#${id}`).scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  expect(errors).toEqual([]);
});

test("landing has no serious accessibility violations", async ({ page }) => {
  await open(page);
  await page.waitForTimeout(2500);
  for (const id of ["featured", "octo-system", "fragmented-truth", "future", "from-data-to-decision", "cta", "footer"]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(1500);
  const r = await new AxeBuilder({ page }).include(".landing").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const serious = r.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(serious.map((v) => `${v.id}: ${v.nodes.length} × ${v.nodes[0]?.target.join(" ")} — ${v.help}`)).toEqual([]);
});

test("mobile layout stacks without overflow @mobile", async ({ page }) => {
  await open(page);
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("navigation", { name: "Menu" })).toBeVisible();
  for (const id of ["featured", "octo-system", "fragmented-truth", "from-data-to-decision", "cta"]) await page.locator(`#${id}`).scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
});
