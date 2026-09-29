import { History } from "lucide-react";
import { PageBody, PageHeader } from "@/components/layout/page-header";
import { FreshnessBadge } from "@/components/ui/states";

/**
 * Wraps a pre-enterprise block inside the new shell until its page is rebuilt
 * on the shared table and card components. The banner says so plainly.
 */
export function LegacyView({ eyebrow, title, description, rebuild, children }: { eyebrow: string; title: string; description: string; rebuild: string; children: React.ReactNode }) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} meta={<FreshnessBadge state="demo" />} />
      <PageBody className="space-y-3">
        <p className="flex items-start gap-2 rounded-md border border-line bg-subtle px-3 py-2 text-[12px] text-ink-2">
          <History aria-hidden className="mt-px size-3.5 shrink-0 text-ink-3" />
          Legacy view. {rebuild}
        </p>
        <div className="overflow-hidden rounded-lg border border-line">{children}</div>
      </PageBody>
    </>
  );
}
