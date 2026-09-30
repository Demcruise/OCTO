import { Suspense } from "react";
import type { Metadata } from "next";
import { DealsView } from "@/components/views/deals";

export const metadata: Metadata = { title: "Deals" };

export default function DealsPage() {
  return (
    <Suspense>
      <DealsView />
    </Suspense>
  );
}
