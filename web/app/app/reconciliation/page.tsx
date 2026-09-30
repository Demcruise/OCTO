import { Suspense } from "react";
import type { Metadata } from "next";
import { ReconciliationView } from "@/components/views/reconciliation";

export const metadata: Metadata = { title: "Reconciliation" };

export default function ReconciliationPage() {
  return (
    <Suspense>
      <ReconciliationView />
    </Suspense>
  );
}
