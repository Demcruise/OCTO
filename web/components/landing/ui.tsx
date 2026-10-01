import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * Landing primitives (megaplan §24–27). 12-column grid, 30px gutters,
 * 1440px max width; 4 columns and 20px padding on mobile. Section rhythm
 * 64–80px mobile, 100–120px desktop.
 */

export const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-octo-accent";

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1440px] px-5 md:px-[30px]", className)}>{children}</div>;
}

export function Grid({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("grid grid-cols-4 gap-x-5 md:grid-cols-12 md:gap-x-[30px]", className)}>{children}</div>;
}

/** Primary page section. Only rendered by OctoLanding from the eight-section registry. */
export function Section({ id, label, className, children }: { id: string; label: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} data-landing-section={id} aria-label={label} className={cn("relative py-16 md:py-[100px] xl:py-[120px]", className)}>
      {children}
    </section>
  );
}

/** 10px mono uppercase label (§25). */
export function Eyebrow({ className, children, anim }: { className?: string; children: React.ReactNode; anim?: string }) {
  return (
    <p data-anim={anim} className={cn("font-data text-o-label uppercase text-octo-text-muted", className)}>
      {children}
    </p>
  );
}

/**
 * Two-tone heading (Ondo rhythm): first line ink, second line light grey.
 * Each line is a span so timelines can stagger them.
 */
export function TwoTone({ as: As = "h2", first, second, className, size = "section", anim }: { as?: "h1" | "h2" | "h3"; first: React.ReactNode; second?: React.ReactNode; className?: string; size?: "display" | "section" | "title"; anim?: string }) {
  return (
    <As data-anim={anim} className={cn("font-o-display font-normal text-octo-ink", size === "display" && "text-o-display", size === "section" && "text-o-section", size === "title" && "text-o-title", className)}>
      <span className="block">{first}</span>
      {second && <span className="block text-octo-text-light">{second}</span>}
    </As>
  );
}

/** Editorial reading text in the serif (Ondo's body treatment). */
export function Lead({ className, children, anim }: { className?: string; children: React.ReactNode; anim?: string }) {
  return (
    <p data-anim={anim} className={cn("font-o-serif text-o-lead text-octo-text-muted", className)}>
      {children}
    </p>
  );
}

type Variant = "ink" | "soft" | "line" | "text";

const VARIANT: Record<Variant, string> = {
  ink: "bg-octo-ink text-white hover:bg-black",
  soft: "bg-octo-muted text-octo-ink hover:bg-[#e9e9e9]",
  line: "border border-octo-border bg-white text-octo-ink hover:border-octo-ink",
  text: "px-0 text-octo-ink underline-offset-4 hover:underline",
};

/** Rectangular CTA (§02.2): 8px radius, compact, no pill. */
export function ButtonLink({ href, variant = "ink", arrow, className, children, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; variant?: Variant; arrow?: "right" | "up" }) {
  return (
    <a
      href={href}
      className={cn(
        "group inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-[15px] font-medium tracking-[-0.01em] transition-colors duration-200",
        VARIANT[variant],
        focusRing,
        className,
      )}
      {...rest}
    >
      {children}
      {arrow === "right" && <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />}
      {arrow === "up" && <ArrowUpRight aria-hidden className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />}
    </a>
  );
}

/** Content-integrity marker (§22, §29): anything numeric on the landing is demo data. */
export function DemoTag({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 font-data text-o-label uppercase text-octo-text-muted", className)}>
      <span aria-hidden className="size-1.5 rounded-full bg-octo-notice" />
      Demo environment
    </span>
  );
}

/** Photo credit line for Unsplash imagery. */
export function Credit({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("font-data text-[9px] uppercase tracking-[0.1em] text-white/80", className)}>{children}</span>;
}

/**
 * next/image loader for Unsplash: the browser fetches straight from
 * Unsplash's image CDN (resized, AVIF/WebP via auto=format) instead of
 * proxying through the Next optimizer, which adds a server round-trip.
 */
export function unsplashLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  return `${src}?w=${width}&q=${quality ?? 72}&auto=format&fit=crop`;
}
