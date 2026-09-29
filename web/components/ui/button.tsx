"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/** Shared focus treatment for every interactive control (A11Y-001). */
export const ring = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
export const ringInset = "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover disabled:bg-accent/50",
  secondary: "border border-line-strong bg-surface text-ink hover:bg-hover disabled:text-ink-4",
  ghost: "text-ink-2 hover:bg-hover hover:text-ink disabled:text-ink-4",
  danger: "border border-danger/30 bg-surface text-danger hover:bg-danger/8 disabled:opacity-50",
};

/* Control heights: 28 / 32 / 36px (VESTRA-001 control sizing). */
const SIZE: Record<Size, string> = { sm: "h-7 px-2.5 text-[12px] gap-1.5", md: "h-8 px-3 text-[13px] gap-2", lg: "h-9 px-3.5 text-sm gap-2" };
const ICON_SIZE: Record<Size, string> = { sm: "size-7", md: "size-8", lg: "size-9" };

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", className, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors duration-150 disabled:cursor-not-allowed [&_svg]:size-3.5 [&_svg]:shrink-0",
        VARIANT[variant],
        SIZE[size],
        ring,
        className,
      )}
      {...props}
    />
  );
});

/** Icon-only control. `label` is required and becomes the accessible name. */
export const IconButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, "children"> & { label: string; icon: React.ReactNode }>(function IconButton(
  { label, icon, variant = "ghost", size = "md", className, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors duration-150 disabled:cursor-not-allowed [&_svg]:size-4",
        VARIANT[variant],
        ICON_SIZE[size],
        ring,
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  );
});

export function ButtonGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex items-center gap-2", className)}>{children}</div>;
}
