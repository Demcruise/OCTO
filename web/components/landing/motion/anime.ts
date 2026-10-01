"use client";

import { useEffect, useLayoutEffect, type RefObject } from "react";
import { createScope, cubicBezier, type Scope } from "animejs";

/*
 * Shared motion policy (megaplan §16–23): precise, measured, systematic.
 * Opacity, translate, line drawing and stagger only — no bounce, no elastic,
 * no loops, no scroll-jacking. Every animation lives in a scope bound to its
 * section root and is reverted on unmount.
 */

export const EASE = cubicBezier(0.22, 1, 0.36, 1);
export const EASE_IN_OUT = cubicBezier(0.65, 0, 0.35, 1);
export const DUR = { fast: 450, base: 700, slow: 1000 } as const;
export const STAGGER = { tight: 60, base: 90, loose: 140 } as const;

const REDUCE = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia(REDUCE).matches;
}

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Bind an Anime.js scope to a section root. `setup` receives whether the
 * viewer prefers reduced motion; it should reveal the final state instantly
 * in that case. Scopes re-run automatically when the media query changes.
 */
export function useAnimeScope(root: RefObject<HTMLElement | null>, setup: (ctx: { reduced: boolean; scope: Scope }) => void | (() => void)) {
  useEffect(() => {
    if (!root.current) return;
    const scope = createScope({ root: root.current, mediaQueries: { reduce: REDUCE } }).add((s) => {
      if (!s) return;
      return setup({ reduced: !!s.matches.reduce, scope: s }) ?? undefined;
    });
    return () => scope.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** Run `cb` once when `el` first enters the viewport. Returns a disconnect function. */
export function onceVisible(el: Element, cb: () => void, options: IntersectionObserverInit = { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }) {
  let done = false;
  const io = new IntersectionObserver((entries) => {
    if (done || !entries.some((e) => e.isIntersecting)) return;
    done = true;
    io.disconnect();
    cb();
  }, options);
  io.observe(el);
  return () => io.disconnect();
}

/**
 * Marks the page as motion-ready (so the 4s safety fallback does not reveal
 * everything early) and restores the gate class on client-side navigation,
 * where the inline script does not re-run.
 */
export function useMotionGate() {
  useIsoLayoutEffect(() => {
    (window as unknown as { __octoMotionReady?: boolean }).__octoMotionReady = true;
    if (!prefersReducedMotion()) document.documentElement.classList.add("o-motion");
  }, []);
}

/** Inline, pre-paint gate. Kept tiny; see globals.css "Motion gate". */
export const MOTION_GATE_SCRIPT = `(function(){try{if(!window.matchMedia('${REDUCE}').matches){var d=document.documentElement;d.classList.add('o-motion');setTimeout(function(){if(!window.__octoMotionReady){d.classList.remove('o-motion')}},4000)}}catch(e){}})();`;
