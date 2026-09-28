"use client";

import { FOOTER } from "@/lib/landing-content";
import { Container, focusRing } from "./primitives";
import { OctoWordmark } from "./landing-navigation";

/** Footer with only real destinations and consistent OCTO branding (FOOTER-001/002). */
export function Footer() {
  return (
    <footer className="border-t border-line bg-canvas text-ink">
      <Container className="py-14 md:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <OctoWordmark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-2">The operating system for private markets.</p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {FOOTER.map((group) => (
              <div key={group.label}>
                <p className="font-data text-meta uppercase text-ink-3">{group.label}</p>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.title}>
                      <a href={link.href} className={`rounded-sm text-sm text-ink-2 hover:text-ink ${focusRing}`}>
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-line pt-6 font-data text-[12px] text-ink-3 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} OCTO</p>
          <p>One database. One system. One process.</p>
        </div>
      </Container>
    </footer>
  );
}
