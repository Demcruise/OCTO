import { Suspense } from "react";
import type { Metadata } from "next";
import { dealById } from "@/lib/demo";
import { DealDetail } from "@/components/views/deal-detail";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: dealById(id)?.company ?? "Deal" };
}

export default async function DealPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense>
      <DealDetail id={id} />
    </Suspense>
  );
}
