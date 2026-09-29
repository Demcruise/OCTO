import type { Metadata } from "next";
import DataTable3 from "@/components/blocks/data-table-3";
import { LegacyView } from "@/components/views/legacy-view";

export const metadata: Metadata = { title: "Investments" };

export default function InvestmentsPage() {
  return (
    <LegacyView eyebrow="Portfolio" title="Investments" description="Positions across funds with cost, value, and multiple." rebuild="Investments move to the shared DataTable with saved views in Phase 4.">
      <DataTable3 />
    </LegacyView>
  );
}
