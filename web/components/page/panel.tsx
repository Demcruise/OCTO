import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/feedback";

/*
 * Panel family (plan §2.4). One card geometry for every page: white surface on
 * white canvas, 1px hairline, radius 12px, no shadow, 16px padding, header
 * aligned to the card edge. Pages never invent their own card styles.
 */

export function Panel({ className, children, as: As = "section", ...props }: React.HTMLAttributes<HTMLElement> & { as?: "section" | "div" | "article" }) {
  return (
    <As className={cn("flex min-w-0 flex-col rounded-xl border border-line bg-surface", className)} {...props}>
      {children}
    </As>
  );
}

export function PanelHeader({ className, children, divider = false }: { className?: string; children: React.ReactNode; divider?: boolean }) {
  return <header className={cn("flex min-h-12 items-center justify-between gap-3 px-4 pt-3.5", divider ? "border-b border-line pb-3" : "pb-1", className)}>{children}</header>;
}

export function PanelTitle({ icon, children, className }: { icon?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("flex min-w-0 items-center gap-2 text-section font-semibold text-ink [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-ink-3", className)}>
      {icon}
      <span className="truncate">{children}</span>
    </h2>
  );
}

export function PanelDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-[12px] text-ink-3", className)}>{children}</p>;
}

export function PanelToolbar({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex shrink-0 items-center gap-1.5", className)}>{children}</div>;
}

export function PanelBody({ className, children, flush }: { className?: string; children: React.ReactNode; flush?: boolean }) {
  return <div className={cn("min-h-0 flex-1", flush ? "" : "p-4 pt-3", className)}>{children}</div>;
}

export function PanelFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return <footer className={cn("flex items-center justify-between gap-3 border-t border-line px-4 py-2.5 text-[12px] text-ink-3", className)}>{children}</footer>;
}

export function PanelEmpty(props: React.ComponentProps<typeof EmptyState>) {
  return <EmptyState {...props} className={cn("py-10", props.className)} />;
}

/** Title + optional description + toolbar, the common header layout. */
export function PanelHead({ title, icon, description, toolbar, divider }: { title: string; icon?: React.ReactNode; description?: React.ReactNode; toolbar?: React.ReactNode; divider?: boolean }) {
  return (
    <PanelHeader divider={divider}>
      <div className="min-w-0">
        <PanelTitle icon={icon}>{title}</PanelTitle>
        {description && <PanelDescription className="mt-0.5">{description}</PanelDescription>}
      </div>
      {toolbar && <PanelToolbar>{toolbar}</PanelToolbar>}
    </PanelHeader>
  );
}
