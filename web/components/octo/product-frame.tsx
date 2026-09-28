import { cn } from "@/lib/utils";

/**
 * Window chrome for every OCTO product surface on the landing page, so previews
 * read as one coherent application (PROD-100, RB-003).
 */
export function ProductFrame({
  path,
  meta = "Sample data",
  className,
  bodyClassName,
  children,
}: {
  path: string;
  meta?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-line bg-canvas shadow-[0_20px_40px_-32px_rgb(17_19_24/0.22)]", className)}>
      <div className="flex items-center gap-3 border-b border-line bg-subtle px-4 py-2.5">
        <span aria-hidden className="flex gap-1.5">
          {[0, 1, 2].map((d) => (
            <span key={d} className="size-2 rounded-full bg-line-strong" />
          ))}
        </span>
        <p className="min-w-0 flex-1 truncate font-data text-[11px] text-ink-2">{path}</p>
        <p className="shrink-0 font-data text-[11px] uppercase tracking-[0.08em] text-ink-3">{meta}</p>
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
