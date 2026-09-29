import { cn } from "@/lib/utils";

/**
 * Page header (SHELL-001.4): eyebrow, title, one-line purpose, freshness, and
 * page-level actions. Every page answers "where am I, how current is this,
 * what can I do here" before any content.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3 border-b border-line bg-surface px-4 py-4 sm:px-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow && <p className="text-label uppercase text-ink-3">{eyebrow}</p>}
        <h1 className="mt-0.5 text-page font-semibold tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-[13px] text-ink-3">{description}</p>}
        {meta && <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">{meta}</div>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/** Standard page body padding and max width. */
export function PageBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6", className)}>{children}</div>;
}
