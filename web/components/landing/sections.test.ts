import { describe, expect, it } from "vitest";
import { MAX_LANDING_SECTIONS, landingSections, sectionModules } from "./sections";

describe("landing section limit (megaplan §00A)", () => {
  it("has at most eight primary sections, and exactly the approved eight", () => {
    expect(landingSections.length).toBeLessThanOrEqual(MAX_LANDING_SECTIONS);
    expect([...landingSections]).toEqual(["hero", "featured", "octo-system", "fragmented-truth", "future", "from-data-to-decision", "cta", "footer"]);
  });

  it("places every merged topic inside an approved section", () => {
    expect(Object.keys(sectionModules).sort()).toEqual([...landingSections].sort());
    const modules = Object.values(sectionModules).flat();
    for (const topic of ["Investment Ontology", "Institutional grade", "Technology story", "Integration categories", "The OCTO Perspective", "Embedded product proof"]) {
      expect(modules).toContain(topic);
    }
  });
});
