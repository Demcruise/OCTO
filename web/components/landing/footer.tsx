"use client";

import { ArrowRight } from "lucide-react";
import { CTA_HREF, FOOTER, SIGN_IN_HREF } from "@/lib/landing-content";
import { Container } from "./primitives";
import { OctoWordmark } from "./landing-navigation";

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-offset-2 focus-visible:ring-offset-void";

/** Dense near-black enterprise directory (PAL-031). Real anchors and routes only. */
export function Footer() {
  return (
    <footer className="border-t border-night-line bg-void text-white">
      <Container className="py-14 md:py-20">
        <div className="flex flex-col justify-between gap-8 border-b border-night-line pb-12 md:flex-row md:items-end">
          <div>
            <OctoWordmark />
            <p className="mt-5 max-w-sm text-2xl font-medium leading-snug tracking-tight">Private-markets investment infrastructure.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href={CTA_HREF} className={`inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-white px-5 text-sm font-medium text-void hover:bg-subtle ${ring}`}>
              Request access <ArrowRight aria-hidden className="size-4" />
            </a>
            <a href={SIGN_IN_HREF} className={`inline-flex h-11 items-center justify-center rounded-sm border border-night-line px-5 text-sm font-medium hover:border-white/40 ${ring}`}>
              Sign in
            </a>
          </div>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-10 pt-12 sm:grid-cols-3 lg:grid-cols-6">
          {FOOTER.map((group) => (
            <div key={group.label}>
              <p className="font-data text-meta uppercase text-fog">{group.label}</p>
              <ul className="mt-4 space-y-1">
                {group.links.map((link) => (
                  <li key={link.title}>
                    <a href={link.href} className={`inline-flex min-h-8 items-center text-[13px] text-white/80 hover:text-white ${ring}`}>
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="mt-14 flex flex-col gap-2 border-t border-night-line pt-6 font-data text-[11px] uppercase tracking-[0.1em] text-fog sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} OCTO</p>
          <p>One database · One system · One process</p>
        </div>
      </Container>
    </footer>
  );
}
