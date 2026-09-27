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
import { Faq } from "@/components/landing/faq";
import { Cta } from "@/components/landing/cta";
import { Contact } from "@/components/landing/contact";
import { Footer } from "@/components/landing/footer";

/**
 * OCTO landing page.
 *
 * Narrative order: problem → system → product → trust → AI → workflow →
 * governance → action. Each section answers the question the previous one
 * raises; copy lives in lib/landing-content.ts.
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
        <Faq />
        <Cta />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
