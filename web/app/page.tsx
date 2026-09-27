import { LandingNavigation } from "@/components/landing/landing-navigation";
import { Hero } from "@/components/landing/hero";
import { Fragmentation } from "@/components/landing/fragmentation";
import { OctoCore } from "@/components/landing/octo-core";
import { SystemFlow } from "@/components/landing/system-flow";
import Faq2 from "@/components/blocks/faq-2";
import Cta2 from "@/components/blocks/cta-2";
import Contact10 from "@/components/blocks/contact-10";
import Footer12 from "@/components/blocks/footer-12";

/**
 * OCTO landing page
 *
 * Composed with the React Bits Landing Builder.
 *
 * The wrapper below sets `--rb-section-min-h: 0px`, which lets content
 * sections take their natural height instead of each filling the viewport.
 * Remove it and every section reverts to full-screen, which is the correct
 * behaviour when a block is used on its own.
 */
export default function Page() {
  return (
    <main
      className="landing w-full font-landing"
      style={{ "--rb-section-min-h": "0px" } as React.CSSProperties}
    >
      <LandingNavigation />
      <Hero />
      <Fragmentation />
      <OctoCore />
      <SystemFlow />
      <div id="faq">
        <Faq2 />
      </div>
      <Cta2 />
      <div id="contact">
        <Contact10 />
      </div>
      <Footer12 />
    </main>
  );
}
