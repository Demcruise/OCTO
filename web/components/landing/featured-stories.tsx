"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { createTimer, type Timer } from "animejs";
import { cn } from "@/lib/utils";
import { FEATURED, PHOTOS, SLIDE_MS } from "./content";
import { prefersReducedMotion, useAnimeScope } from "./motion/anime";
import { featuredTransition, revealOnView, revealTimeline } from "./motion/timelines";
import { Container, Credit, Eyebrow, Section, TwoTone, focusRing, unsplashLoader } from "./ui";

/**
 * 02 FEATURED (megaplan §04, §18): five product stories in one fixed 16:9
 * frame. One Anime.js timer drives progress 0 → 100% over 8s and advances;
 * it pauses on hover, keyboard focus, hidden tab and while off-screen.
 * Manual selection switches immediately and resets the clock. Reduced motion
 * disables autoplay.
 */
export function FeaturedStories() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const prev = useRef(0);
  const timer = useRef<Timer | null>(null);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const holds = useRef({ hover: false, focus: false, hidden: false, offscreen: true });
  const [reduced, setReduced] = useState(false);
  const activeRef = useRef(0);

  const sync = useCallback(() => {
    const t = timer.current;
    if (!t) return;
    const h = holds.current;
    if (h.hover || h.focus || h.hidden || h.offscreen) t.pause();
    else t.resume();
  }, []);

  // Entrance reveal for the section header and list.
  useAnimeScope(root, ({ reduced: r }) => {
    setReduced(r);
    const el = root.current!;
    return revealOnView(el, r, () => revealTimeline(el, r), el, "[data-anim='reveal']");
  });

  // The single clock.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const t = createTimer({
      duration: SLIDE_MS,
      autoplay: false,
      onUpdate: (self) => {
        const bar = bars.current[activeRef.current];
        if (bar) bar.style.transform = `scaleX(${self.progress})`;
      },
      onComplete: () => setActive((a) => (a + 1) % FEATURED.length),
    });
    timer.current = t;
    const onVis = () => {
      holds.current.hidden = document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVis);
    const io = new IntersectionObserver(([e]) => {
      holds.current.offscreen = !e.isIntersecting;
      sync();
    }, { threshold: 0.25 });
    if (root.current) io.observe(root.current);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
      t.revert();
      timer.current = null;
    };
  }, [sync]);

  useEffect(() => {
    activeRef.current = active;
    bars.current.forEach((b) => b && (b.style.transform = "scaleX(0)"));
    if (root.current) featuredTransition(root.current, prev.current, active, prefersReducedMotion());
    prev.current = active;
    const t = timer.current;
    if (t) {
      t.restart();
      sync();
    }
  }, [active, sync]);

  const select = (i: number) => setActive(i);
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const map: Record<string, number> = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: FEATURED.length - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const n = (map[e.key] + FEATURED.length) % FEATURED.length;
    select(n);
    document.getElementById(`featured-tab-${n}`)?.focus();
  };

  return (
    <Section id="featured" label="Featured" className="bg-octo-surface">
      <div
        ref={root}
        onMouseEnter={() => ((holds.current.hover = true), sync())}
        onMouseLeave={() => ((holds.current.hover = false), sync())}
        onFocusCapture={(e) => {
          // Keyboard focus pauses; a mouse click on a tab should not.
          if ((e.target as HTMLElement).matches(":focus-visible")) {
            holds.current.focus = true;
            sync();
          }
        }}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            holds.current.focus = false;
            sync();
          }
        }}
      >
        <Container>
          <div className="grid grid-cols-4 gap-x-5 md:grid-cols-12 md:gap-x-[30px]">
            <div className="col-span-4 md:col-span-7">
              <Eyebrow anim="reveal">Featured</Eyebrow>
              <div data-anim="reveal">
                <TwoTone first="Five capabilities." second="One investment record." className="mt-4" />
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-4 gap-x-5 gap-y-8 md:mt-14 md:grid-cols-12 md:gap-x-[30px]">
            {/* Selector */}
            <div data-anim="reveal" role="tablist" aria-label="Featured capabilities" aria-orientation="vertical" className="no-scrollbar -mx-5 col-span-4 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-col md:gap-0 md:overflow-visible md:px-0 lg:col-span-4 md:col-span-12">
              {FEATURED.map((f, i) => (
                <button
                  key={f.id}
                  id={`featured-tab-${i}`}
                  role="tab"
                  type="button"
                  aria-selected={i === active}
                  aria-controls="featured-panel"
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={cn(
                    "group relative shrink-0 cursor-pointer text-left transition-colors md:border-t md:border-octo-border md:py-5",
                    "rounded-md border border-octo-border px-4 py-3 md:rounded-none md:border-x-0 md:border-b-0 md:px-0",
                    i === active ? "bg-white md:bg-transparent" : "bg-transparent",
                    focusRing,
                  )}
                >
                  <span className="flex items-baseline gap-4">
                    <span className={cn("font-data text-o-label uppercase", i === active ? "text-octo-accent" : "text-octo-text-light")}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={cn("whitespace-nowrap font-o-display text-[18px] tracking-[-0.01em] md:text-[22px]", i === active ? "text-octo-ink" : "text-octo-text-light group-hover:text-octo-ink")}>{f.label}</span>
                  </span>
                  {!reduced && (
                    <span aria-hidden className="absolute inset-x-0 -bottom-px h-0.5 overflow-hidden rounded-full bg-transparent md:-top-px md:bottom-auto">
                      <span ref={(el) => void (bars.current[i] = el)} className={cn("block h-full origin-left bg-octo-ink", i === active ? "opacity-100" : "opacity-0")} style={{ transform: "scaleX(0)" }} />
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Frame + story */}
            <div id="featured-panel" role="tabpanel" aria-labelledby={`featured-tab-${active}`} className="col-span-4 md:col-span-12 lg:col-span-8">
              <div data-anim="reveal" className="relative aspect-video w-full overflow-hidden rounded-2xl bg-octo-muted">
                {FEATURED.map((f, i) => (
                  <div key={f.id} data-slide-media aria-hidden={i !== active} className="absolute inset-0" style={{ opacity: i === 0 ? 1 : 0 }}>
                    <Image loader={unsplashLoader} src={PHOTOS[f.photo].src} alt={i === active ? PHOTOS[f.photo].alt : ""} fill sizes="(min-width: 1024px) 900px, 100vw" className="object-cover" style={{ objectPosition: f.position }} />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#101722]/55 via-[#101722]/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 w-[min(82%,360px)] md:bottom-7 md:left-7">
                      <SlideUI id={f.id} />
                    </div>
                  </div>
                ))}
                <span className="absolute bottom-3 right-4">
                  <Credit>Photo · Unsplash</Credit>
                </span>
              </div>

              {/* All stories share one grid cell, so switching never shifts layout. */}
              <div className="mt-7 grid">
                {FEATURED.map((f, i) => (
                  <div key={f.id} data-slide-text={i} aria-hidden={i !== active} className={cn("[grid-area:1/1] grid grid-cols-1 gap-4 md:grid-cols-8 md:gap-[30px]", i === active ? "visible" : "invisible")}>
                    <h3 data-anim-text className="font-o-display text-o-title text-octo-ink md:col-span-5">
                      <span className="block">{f.line1}</span>
                      <span className="block text-octo-text-light">{f.line2}</span>
                    </h3>
                    <div data-anim-text className="md:col-span-3">
                      <p className="font-o-serif text-[17px] leading-relaxed text-octo-text-muted">{f.body}</p>
                      <a href={f.href} tabIndex={i === active ? 0 : -1} className={cn("mt-4 inline-flex items-center gap-1.5 text-[15px] font-medium text-octo-ink hover:underline", focusRing)}>
                        Explore {f.label} <ArrowRight aria-hidden className="size-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Section>
  );
}

/* ---------- Original OCTO UI composited on each slide (demo data) ---------- */

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/60 bg-white/92 p-3.5 text-octo-ink shadow-[0_16px_40px_rgb(16_23_34/0.28)] backdrop-blur-md md:p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="font-data text-o-label uppercase text-octo-text-muted">{title}</p>
        <span className="font-data text-[9px] uppercase tracking-[0.12em] text-octo-notice">Demo</span>
      </div>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}

function SlideUI({ id }: { id: string }) {
  switch (id) {
    case "ontology":
      return (
        <Card title="Object graph">
          <svg viewBox="0 0 300 96" className="h-auto w-full" role="img" aria-label="Fund linked to company, deal and document">
            {[
              [60, 48, 150, 22],
              [60, 48, 150, 74],
              [150, 22, 250, 22],
              [150, 74, 250, 74],
            ].map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1e2124" strokeOpacity="0.35" />
            ))}
            {[
              [60, 48, "Fund II", true],
              [150, 22, "Helios", false],
              [150, 74, "Kirana", false],
              [250, 22, "Deal", false],
              [250, 74, "Memo", false],
            ].map(([x, y, t, core]) => (
              <g key={String(t)}>
                <rect x={Number(x) - 34} y={Number(y) - 11} width="68" height="22" rx="5" fill={core ? "#1e2124" : "#fff"} stroke="#1e2124" strokeOpacity={core ? 1 : 0.25} />
                <text x={Number(x)} y={Number(y) + 4} textAnchor="middle" fontSize="10" fill={core ? "#fff" : "#1e2124"} fontFamily="var(--font-plex-mono)">
                  {String(t)}
                </text>
              </g>
            ))}
          </svg>
        </Card>
      );
    case "ibor":
      return (
        <Card title="Transaction ledger">
          <ul className="space-y-1.5 text-[12px]">
            {[
              ["Capital call", "+$42.0M"],
              ["Valuation", "+$17.4M"],
              ["Distribution", "−$31.8M"],
            ].map(([k, v]) => (
              <li key={k} className="flex justify-between border-b border-octo-hairline pb-1.5 last:border-0 last:pb-0">
                <span className="text-octo-text-muted">{k}</span>
                <span className="font-medium tabular-nums">{v}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-octo-text-muted">Positions derive from the ledger.</p>
        </Card>
      );
    case "intelligence":
      return (
        <Card title="Draft · variance explanation">
          <p className="flex items-center gap-1.5 text-[11px] font-medium text-octo-accent-ink">
            <Sparkles aria-hidden className="size-3" /> AI-suggested · awaiting review
          </p>
          <p className="mt-1.5 text-[12px] leading-snug text-octo-ink">EBITDA fell 6.1% on a one-off refurbishment and agency staffing costs.</p>
          <p className="mt-2 flex gap-1 font-data text-[10px] text-octo-text-muted">
            {["[1] Q3 accounts", "[2] Board pack", "[3] Payroll"].map((c) => (
              <span key={c} className="rounded bg-octo-muted px-1.5 py-0.5">
                {c}
              </span>
            ))}
          </p>
        </Card>
      );
    case "operations":
      return (
        <Card title="Needs attention">
          <ul className="space-y-1.5 text-[12px]">
            {[
              ["DSCR 1.14× vs 1.20×", "bg-octo-data-red"],
              ["Mark stale · 45 days", "bg-octo-data-amber"],
              ["Cash break · $20,000", "bg-octo-data-amber"],
            ].map(([t, c]) => (
              <li key={t} className="flex items-center gap-2">
                <span aria-hidden className={cn("size-1.5 rounded-full", c)} />
                {t}
              </li>
            ))}
          </ul>
        </Card>
      );
    default:
      return (
        <Card title="IC approval">
          <ol className="space-y-1.5 text-[12px]">
            {[
              ["Deal team", true],
              ["Risk", true],
              ["IC chair", false],
            ].map(([t, done]) => (
              <li key={String(t)} className="flex items-center gap-2">
                <span className={cn("flex size-4 items-center justify-center rounded-full border", done ? "border-octo-data-green bg-octo-data-green text-white" : "border-octo-accent text-octo-accent")}>
                  {done ? <Check aria-hidden className="size-2.5" strokeWidth={3} /> : <span className="size-1.5 rounded-full bg-octo-accent" />}
                </span>
                {String(t)}
                {!done && <span className="ml-auto text-[11px] text-octo-text-muted">Pending</span>}
              </li>
            ))}
          </ol>
          <p className="mt-2 text-[11px] text-octo-text-muted">2 of 3 approvals · evidence attached</p>
        </Card>
      );
  }
}
