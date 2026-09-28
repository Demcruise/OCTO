import { LandingNavigation } from "./landing-navigation";
import { Hero } from "./hero";
import { FeaturedStories } from "./featured-stories";
import { PlatformStatement } from "./platform-statement";
import { SourceNetwork } from "./source-network";
import { SystemIndex } from "./system-index";
import { OntologySection } from "./ontology-section";
import { ObjectGraph } from "./object-graph";
import { InvestmentObjectView } from "./investment-object-view";
import { IborShowcase } from "./ibor-showcase";
import { Lineage } from "./lineage";
import { AiContext } from "./ai-context";
import { GovernedAI } from "./governed-ai";
import { InvestmentWorkflow } from "./investment-workflow";
import { ControlPanel } from "./control-panel";
import { ExceptionQueue } from "./exception-queue";
import { AnalyticsShowcase } from "./analytics-showcase";
import { Governance } from "./governance";
import { Deployment } from "./deployment";
import { LargeTransition } from "./large-transition";
import { Proof } from "./proof";
import { Editorial } from "./editorial";
import { UseCaseIndex } from "./use-case-index";
import { Cta } from "./cta";
import { Contact } from "./contact";
import { Footer } from "./footer";

/**
 * OCTO landing page — editorial sequence per the megaplan (PAL-002):
 *
 * nav → cinematic hero → topic strip / featured story → the OCTO system
 * statement → system index → product stories (ontology → record → lineage →
 * intelligence → workflow → control → analytics → governance) → large
 * transition → proof → case studies → use-case index → CTA → footer.
 *
 * Dark sections carry system diagrams and statements; light sections carry
 * product surfaces.
 */
export function OctoLanding() {
  return (
    <div className="landing bg-canvas font-landing text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-void"
      >
        Skip to content
      </a>
      <LandingNavigation />
      <main id="main">
        <Hero />
        <FeaturedStories />
        <PlatformStatement />
        <SystemIndex />
        <SourceNetwork />
        <OntologySection />
        <ObjectGraph />
        <InvestmentObjectView />
        <IborShowcase />
        <Lineage />
        <AiContext />
        <GovernedAI />
        <InvestmentWorkflow />
        <ControlPanel />
        <ExceptionQueue />
        <AnalyticsShowcase />
        <Governance />
        <Deployment />
        <LargeTransition />
        <Proof />
        <Editorial />
        <UseCaseIndex />
        <Cta />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
