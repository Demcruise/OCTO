"use client";

import { cn } from "@/lib/utils";
import { FOOTER } from "@/lib/landing-content";
import { Container, focusRing } from "./primitives";
import { OctoWordmark } from "./landing-navigation";

/**
 * 08 — FOOTER: compact, light, no newsletter block (PAL-008). Legal items are
 * listed as text until real policy pages exist — no dead links.
 */
export function Footer() {
  return (
    <footer className="border-t border-line bg-canvas text-ink">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <OctoWordmark inverse={false} />
            <p className="mt-4 max-w-[16rem] text-[13px] leading-relaxed text-ink-3">Private-markets investment infrastructure.</p>
          </div>
          {FOOTER.map((group) => (
            <nav key={group.label} aria-label={`Footer — ${group.label}`}>
              <p className="font-data text-meta uppercase text-ink-3">{group.label}</p>
              <ul className="mt-4 space-y-1">
                {group.links.map((link) => (
                  <li key={link.title}>
                    <a href={link.href} className={cn("inline-flex min-h-8 items-center text-[13px] text-ink-2 hover:text-ink", focusRing)}>
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-data text-[11px] uppercase tracking-[0.1em] text-ink-3">© {new Date().getFullYear()} OCTO</p>
          {/* Privacy, Terms, and Security pages do not exist yet — text only, no dead links. */}
          <ul className="flex gap-6 font-data text-[11px] uppercase tracking-[0.1em] text-ink-3">
            <li>Privacy</li>
            <li>Terms</li>
            <li>Security</li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
