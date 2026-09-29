import type { Metadata } from "next";
import Dashboard4 from "@/components/blocks/dashboard-4";
import { LegacyView } from "@/components/views/legacy-view";

export const metadata: Metadata = { title: "Portfolio" };

export default function PortfolioPage() {
  return (
    <LegacyView eyebrow="Portfolio" title="Portfolio" description="Fund-level NAV, performance, and holdings." rebuild="The portfolio workspace moves to the shared metric cards and tables in Phase 4.">
      <Dashboard4 />
    </LegacyView>
  );
}
