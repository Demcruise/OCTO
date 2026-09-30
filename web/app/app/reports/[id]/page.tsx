import type { Metadata } from "next";
import { REPORTS } from "@/lib/demo";
import { ReportDetail } from "@/components/views/report-detail";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: REPORTS.find((r) => r.id.toLowerCase() === id.toLowerCase())?.name ?? "Report" };
}

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReportDetail id={id} />;
}
