"use client";

import { cn } from "@/lib/utils";
import { display, serif } from "./fonts";
import { AnnouncementBar, OctoHeader } from "./octo-header";
import { Hero } from "./hero";
import { FeaturedStories } from "./featured-stories";
import { OctoSystem } from "./octo-system";
import { FragmentedTruth } from "./fragmented-truth";
import { FutureEditorial } from "./future-editorial";
import { FromDataToDecision } from "./from-data-to-decision";
import { FinalCTA } from "./final-cta";
import { Footer } from "./footer";
import { MOTION_GATE_SCRIPT, useMotionGate } from "./motion/anime";
import { landingSections, type LandingSection } from "./sections";

/**
 * The registry is typed by `LandingSection`: adding a component here without
 * adding its key to `landingSections` (or vice versa) fails type-checking, so
 * the page cannot silently grow a ninth primary section (megaplan §00A).
 */
const SECTIONS: Record<LandingSection, React.ComponentType> = {
  hero: Hero,
  featured: FeaturedStories,
  "octo-system": OctoSystem,
  "fragmented-truth": FragmentedTruth,
  future: FutureEditorial,
  "from-data-to-decision": FromDataToDecision,
  cta: FinalCTA,
  footer: Footer,
};

/**
 * OCTO homepage — Ondo-inspired institutional rhythm, light theme only,
 * Anime.js V4 motion, exactly eight primary sections.
 */
export function OctoLanding() {
  useMotionGate();
  const body = landingSections.filter((s) => s !== "footer");
  const FooterSection = SECTIONS.footer;
  return (
    <div id="top" className={cn("landing min-h-dvh bg-octo-bg font-o-display text-octo-ink antialiased [color-scheme:light]", display.variable, serif.variable)}>
      <script dangerouslySetInnerHTML={{ __html: MOTION_GATE_SCRIPT }} />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-octo-ink focus:px-3 focus:py-2 focus:text-sm focus:text-white">
        Skip to content
      </a>
      <AnnouncementBar />
      <OctoHeader />
      <main id="main">
        {body.map((key) => {
          const Component = SECTIONS[key];
          return <Component key={key} />;
        })}
      </main>
      <FooterSection />
    </div>
  );
}
