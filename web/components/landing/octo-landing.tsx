import { LandingNavigation } from "./landing-navigation";
import { Hero } from "./hero";
import { FeaturedStories } from "./featured-stories";
import { OctoSystem } from "./octo-system";
import { FragmentedTruth } from "./fragmented-truth";
import { FutureEditorial } from "./future-editorial";
import { DataToDecision } from "./data-to-decision";
import { Cta } from "./cta";
import { Footer } from "./footer";

/**
 * OCTO landing page — exactly eight sections per the light-theme master
 * backlog:
 *
 * 01 Hero · 02 Featured · 03 OCTO System · 04 Fragmented Truth ·
 * 05 The Future · 06 From Data to Decision · 07 CTA · 08 Footer.
 *
 * Light theme throughout; the only dark pixels live inside photography.
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
        <OctoSystem />
        <FragmentedTruth />
        <FutureEditorial />
        <DataToDecision />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
