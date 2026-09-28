import { LandingNavigation } from "./landing-navigation";
import { Hero } from "./hero";
import { AskOcto } from "./ask-octo";
import { SourceNetwork } from "./source-network";
import { PlatformArchitecture } from "./platform-architecture";
import { OntologySection } from "./ontology-section";
import { ObjectGraph } from "./object-graph";
import { InvestmentObjectView } from "./investment-object-view";
import { IborShowcase } from "./ibor-showcase";
import { DecisionArchitecture } from "./decision-architecture";
import { AnalyticsShowcase } from "./analytics-showcase";
import { AiContext } from "./ai-context";
import { GovernedAI } from "./governed-ai";
import { InvestmentWorkflow } from "./investment-workflow";
import { ControlPanel } from "./control-panel";
import { ExceptionQueue } from "./exception-queue";
import { Lineage } from "./lineage";
import { Governance } from "./governance";
import { Deployment } from "./deployment";
import { CapabilityIndex } from "./capability-index";
import { Editorial } from "./editorial";
import { Cta } from "./cta";
import { Contact } from "./contact";
import { Footer } from "./footer";

/**
 * OCTO landing page (PAL-046, PAL-050).
 *
 * Rhythm: editorial statement → system visualization → product interface →
 * architecture → proof → workflow → governance → conversion. Dark sections carry
 * system diagrams; light sections carry product surfaces.
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
        <AskOcto />
        <SourceNetwork />
        <PlatformArchitecture />
        <OntologySection />
        <ObjectGraph />
        <InvestmentObjectView />
        <IborShowcase />
        <DecisionArchitecture />
        <AnalyticsShowcase />
        <AiContext />
        <GovernedAI />
        <InvestmentWorkflow />
        <ControlPanel />
        <ExceptionQueue />
        <Lineage />
        <Governance />
        <Deployment />
        <CapabilityIndex />
        <Editorial />
        <Cta />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
