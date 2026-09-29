import type { Metadata } from "next";
import Kanban1 from "@/components/blocks/kanban-1";
import { LegacyView } from "@/components/views/legacy-view";

export const metadata: Metadata = { title: "Deals" };

export default function DealsPage() {
  return (
    <LegacyView eyebrow="Portfolio" title="Deals" description="Pipeline from sourcing to investment committee." rebuild="The deal pipeline is rebuilt on the prospects API with screening and IC stages in Phase 5.">
      <Kanban1 />
    </LegacyView>
  );
}
