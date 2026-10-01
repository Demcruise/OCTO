"use client";

import { useId, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_HREF, CTA } from "./content";
import { useAnimeScope } from "./motion/anime";
import { revealOnView, revealTimeline } from "./motion/timelines";
import { Container, Section, focusRing } from "./ui";

/**
 * 07 CTA (megaplan §13): two large light panels — Request access (with an
 * inline form) and Explore OCTO (the live demo app).
 */
export function FinalCTA() {
  const root = useRef<HTMLDivElement>(null);
  useAnimeScope(root, ({ reduced }) => {
    const el = root.current!;
    return revealOnView(el, reduced, () => revealTimeline(el, reduced), el, "[data-anim='reveal']");
  });

  return (
    <Section id="cta" label="Get started">
      <div ref={root}>
        <Container>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-[30px]">
            <RequestAccess />
            <a data-anim="reveal" href={APP_HREF} className={cn("group flex min-h-[360px] flex-col rounded-2xl border border-octo-border bg-white p-7 transition-colors hover:border-octo-ink md:min-h-[440px] md:p-10", focusRing)}>
              <p className="font-data text-o-label uppercase text-octo-text-muted">Demo environment</p>
              <h2 className="mt-auto flex items-end gap-3 font-o-display text-o-section text-octo-ink">
                {CTA.secondary.title}
                <ArrowUpRight aria-hidden className="mb-2 size-8 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 md:size-10" />
              </h2>
              <p className="mt-4 max-w-md font-o-serif text-o-lead text-octo-text-muted">{CTA.secondary.body}</p>
            </a>
          </div>
        </Container>
      </div>
    </Section>
  );
}

function RequestAccess() {
  const id = useId();
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [firm, setFirm] = useState("");
  const [tried, setTried] = useState(false);
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

  return (
    <div data-anim="reveal" className="flex min-h-[360px] flex-col rounded-2xl bg-octo-muted p-7 md:min-h-[440px] md:p-10">
      <p className="font-data text-o-label uppercase text-octo-text-muted">For investment teams</p>
      <h2 className="mt-auto flex items-end gap-3 font-o-display text-o-section text-octo-ink">
        {CTA.primary.title}
        <ArrowRight aria-hidden className="mb-2 size-8 shrink-0 md:size-10" />
      </h2>
      <p className="mt-4 max-w-md font-o-serif text-o-lead text-octo-text-muted">{CTA.primary.body}</p>

      {sent ? (
        <p role="status" className="mt-6 flex items-center gap-2 text-[15px] text-octo-ink">
          <Check aria-hidden className="size-4 text-octo-data-green" /> Request recorded in this preview. Nothing leaves your browser yet.
        </p>
      ) : (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (!valid) return setTried(true);
            setSent(true);
          }}
          className="mt-6 flex flex-col gap-2 sm:flex-row"
        >
          <label htmlFor={`${id}-email`} className="sr-only">
            Work email
          </label>
          <input
            id={`${id}-email`}
            type="email"
            autoComplete="email"
            placeholder="Work email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={tried && !valid}
            aria-describedby={tried && !valid ? `${id}-err` : undefined}
            className="h-12 min-w-0 flex-1 rounded-md border border-octo-border bg-white px-4 text-[15px] text-octo-ink placeholder:text-octo-text-light focus:border-octo-ink focus:outline-none"
          />
          <label htmlFor={`${id}-firm`} className="sr-only">
            Firm
          </label>
          <input
            id={`${id}-firm`}
            autoComplete="organization"
            placeholder="Firm"
            value={firm}
            onChange={(e) => setFirm(e.target.value)}
            className="h-12 min-w-0 rounded-md border border-octo-border bg-white px-4 text-[15px] text-octo-ink placeholder:text-octo-text-light focus:border-octo-ink focus:outline-none sm:w-40"
          />
          <button type="submit" className={cn("h-12 shrink-0 cursor-pointer rounded-md bg-octo-ink px-5 text-[15px] font-medium text-white transition-colors hover:bg-black", focusRing)}>
            Request
          </button>
        </form>
      )}
      {tried && !valid && !sent && (
        <p id={`${id}-err`} className="mt-2 text-[13px] text-[#b42318]">
          Enter a work email address.
        </p>
      )}
    </div>
  );
}
