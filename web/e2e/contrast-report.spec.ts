import AxeBuilder from "@axe-core/playwright";
import { test } from "@playwright/test";

// Diagnostic only — prints contrast failures grouped by colour pair. Skipped unless AXE_REPORT=1.
test.skip(!process.env.AXE_REPORT, "diagnostic");

for (const scheme of ["light", "dark"] as const) {
  test(`contrast report ${scheme}`, async ({ page }) => {
    test.setTimeout(240_000);
    await page.emulateMedia({ colorScheme: scheme });
    const pairs = new Map<string, { n: number; sample: string }>();
    for (const r of ["/app", "/app/portfolio", "/app/companies/cmp-0211", "/app/deals", "/app/settings", "/app/reports/rpt-0231", "/app/investments"]) {
      await page.goto(r);
      await page.waitForTimeout(800);
      const res = await new AxeBuilder({ page }).include(".octo-app").withRules(["color-contrast"]).analyze();
      for (const v of res.violations)
        for (const n of v.nodes) {
          const d = (n.any[0]?.data ?? {}) as { fgColor?: string; bgColor?: string; contrastRatio?: number; fontSize?: string };
          const k = `${d.fgColor} on ${d.bgColor} (${d.contrastRatio}) ${d.fontSize}`;
          const e = pairs.get(k) ?? { n: 0, sample: n.html.slice(0, 120) };
          e.n++;
          pairs.set(k, e);
        }
    }
    console.log(`\n=== ${scheme} ===`);
    for (const [k, v] of [...pairs].sort((a, b) => b[1].n - a[1].n)) console.log(`${v.n}× ${k} :: ${v.sample}`);
  });
}
