import { Announcement } from "@/components/landing/announcement";
import { LandingNavigation } from "@/components/landing/landing-navigation";
import { Hero } from "@/components/landing/hero";
import { Fragmentation } from "@/components/landing/fragmentation";
import { OctoCore } from "@/components/landing/octo-core";
import { SystemFlow } from "@/components/landing/system-flow";
import { ProductShowcase } from "@/components/landing/product-showcase";
import { Lineage } from "@/components/landing/lineage";
import { GovernedAI } from "@/components/landing/governed-ai";
import { InvestmentWorkflow } from "@/components/landing/investment-workflow";
import { Governance } from "@/components/landing/governance";
import { CapabilityIndex } from "@/components/landing/capability-index";
import { Cta } from "@/components/landing/cta";
import { Contact } from "@/components/landing/contact";
import { Footer } from "@/components/landing/footer";

/**
 * OCTO landing page (MASTER-001).
 *
 * Concept → system → product → evidence → governance → conversion. Each
 * section answers the question the previous one raises; copy lives in
 * lib/landing-content.ts and shared product surfaces in components/octo/.
 */
export default function Page() {
  return (
    <div className="landing bg-canvas font-landing text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-ink focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <Announcement />
      <LandingNavigation />
      <main id="main">
        <Hero />
        <Fragmentation />
        <OctoCore />
        <SystemFlow />
        <ProductShowcase />
        <Lineage />
        <GovernedAI />
        <InvestmentWorkflow />
        <Governance />
        <CapabilityIndex />
        <Cta />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
