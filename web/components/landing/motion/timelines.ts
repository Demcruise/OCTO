"use client";

import { animate, createTimeline, stagger, svg, utils } from "animejs";
import { DUR, EASE, STAGGER, onceVisible } from "./anime";

/*
 * Section timelines (megaplan §17–22, §30 motion/). Each takes the section
 * root and a `reduced` flag; with reduced motion it jumps to the final state
 * so content is never hidden and nothing large moves.
 */

type Root = HTMLElement;
const q = (root: Root, sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));

function finalState(els: Element[]) {
  if (els.length) utils.set(els, { opacity: 1, translateY: 0, scale: 1 });
}

/** Hero (§17): nav → eyebrow → headline → supporting line → CTA → system visual. */
export function heroTimeline(root: Root, reduced: boolean) {
  const nav = q(root.ownerDocument.body, "[data-anim='nav']");
  const eyebrow = q(root, "[data-anim='eyebrow']");
  const lines = q(root, "[data-anim='headline'] > span");
  const support = q(root, "[data-anim='support']");
  const ctas = q(root, "[data-anim='cta'] > *");
  const visual = q(root, "[data-anim='visual']");
  const nodes = q(root, "[data-anim='atlas-node']");
  const paths = q(root, "[data-atlas-path]");
  const signals = q(root, "[data-anim='signal']");
  const all = [...nav, ...eyebrow, ...lines, ...support, ...ctas, ...visual, ...nodes, ...signals];
  // The headline wrapper and CTA row are gates for their children.
  const wrappers = q(root, "[data-anim='headline'], [data-anim='cta']");
  if (reduced) {
    finalState([...all, ...wrappers]);
    return null;
  }
  utils.set(wrappers, { opacity: 1 });
  // Pre-hide every target so nothing flashes before its turn, even when the
  // pre-paint gate class is absent (client-side navigation).
  utils.set(all, { opacity: 0 });
  const drawables = paths.length ? svg.createDrawable(paths) : [];
  if (drawables.length) utils.set(drawables, { draw: "0 0" });
  const tl = createTimeline({ defaults: { ease: EASE, duration: DUR.base } });
  if (nav.length) tl.add(nav, { opacity: [0, 1], translateY: [-8, 0], duration: DUR.fast });
  tl.add(eyebrow, { opacity: [0, 1], translateY: [10, 0] }, nav.length ? "-=250" : 0)
    .add(lines, { opacity: [0, 1], translateY: [28, 0], delay: stagger(STAGGER.loose), duration: DUR.slow }, "-=450")
    .add(support, { opacity: [0, 1], translateY: [14, 0] }, "-=650")
    .add(ctas, { opacity: [0, 1], translateY: [10, 0], delay: stagger(STAGGER.tight) }, "-=500")
    .add(visual, { opacity: [0, 1], scale: [1.015, 1], duration: DUR.slow }, "-=500")
    .add(nodes, { opacity: [0, 1], translateY: [8, 0], delay: stagger(STAGGER.tight) }, "-=600");
  if (drawables.length) tl.add(drawables, { draw: ["0 0", "0 1"], duration: 900, delay: stagger(40) }, "-=300");
  tl.add(signals, { opacity: [0, 1], translateY: [10, 0], delay: stagger(STAGGER.tight) }, "-=700");
  return tl;
}

/** Generic scroll reveal (§21 stagger): children marked data-anim="reveal" in DOM order. */
export function revealTimeline(root: Root, reduced: boolean, selector = "[data-anim='reveal']") {
  const els = q(root, selector);
  if (reduced) return finalState(els), null;
  return animate(els, { opacity: [0, 1], translateY: [18, 0], ease: EASE, duration: DUR.base, delay: stagger(STAGGER.base) });
}

/**
 * Hide reveal targets now, then play `play` once `trigger` scrolls into view.
 * With reduced motion the final state is shown immediately.
 */
export function revealOnView(root: Root, reduced: boolean, play: () => void, trigger: Element = root, selector = "[data-anim]") {
  const els = q(root, selector);
  if (reduced) {
    finalState(els);
    play();
    return () => undefined;
  }
  utils.set(els, { opacity: 0 });
  return onceVisible(trigger, play);
}

/** Featured slide change (§18): old media fades/scales out, new fades/scales in, text rises. */
export function featuredTransition(root: Root, from: number, to: number, reduced: boolean) {
  const media = q(root, "[data-slide-media]");
  const texts = q(root, `[data-slide-text='${to}'] [data-anim-text]`);
  media.forEach((m, i) => {
    if (i !== from && i !== to) utils.set(m, { opacity: 0 });
  });
  if (reduced) {
    if (media[from] && from !== to) utils.set(media[from], { opacity: 0 });
    if (media[to]) utils.set(media[to], { opacity: 1, scale: 1 });
    finalState(texts);
    return;
  }
  if (media[from] && from !== to) animate(media[from], { opacity: [1, 0], scale: [1, 1.02], duration: DUR.base, ease: EASE });
  if (media[to]) animate(media[to], { opacity: [0, 1], scale: [1.02, 1], duration: DUR.slow, ease: EASE });
  animate(texts, { opacity: [0, 1], translateY: [12, 0], duration: DUR.base, ease: EASE, delay: stagger(STAGGER.tight) });
}

/**
 * Fragmented truth network (§19): nodes enter → input paths draw → OCTO
 * activates → output paths draw → output nodes activate.
 * Call at setup: it hides everything now and returns `play` for when the
 * network scrolls into view. With reduced motion it shows the final state.
 */
export function prepareNetwork(root: Root, reduced: boolean): () => void {
  const inputs = q(root, "[data-net='input']");
  const inPaths = q(root, "[data-net-path='in']");
  const core = q(root, "[data-net='core']");
  const outPaths = q(root, "[data-net-path='out']");
  const outputs = q(root, "[data-net='output']");
  const pulses = q(root, "[data-net='pulse']");
  if (reduced) {
    finalState([...inputs, ...core, ...outputs]);
    utils.set(pulses, { opacity: 0 });
    return () => undefined;
  }
  const inD = svg.createDrawable(inPaths);
  const outD = svg.createDrawable(outPaths);
  utils.set([...inputs, ...core, ...outputs, ...pulses], { opacity: 0 });
  utils.set([...inD, ...outD], { draw: "0 0" });
  return () => {
    createTimeline({ defaults: { ease: EASE } })
      .add(inputs, { opacity: [0, 1], translateX: [-14, 0], duration: DUR.base, delay: stagger(STAGGER.tight) })
      .add(inD, { draw: ["0 0", "0 1"], duration: 800, delay: stagger(50) }, "-=250")
      .add(core, { opacity: [0, 1], scale: [0.96, 1], duration: DUR.base }, "-=200")
      .add(pulses, { opacity: [0, 0.9, 0], scale: [1, 1.35], duration: 1000, delay: stagger(160) }, "-=300")
      .add(outD, { draw: ["0 0", "0 1"], duration: 700, delay: stagger(60) }, "-=900")
      .add(outputs, { opacity: [0, 1], translateX: [14, 0], duration: DUR.base, delay: stagger(STAGGER.tight) }, "-=350");
  };
}

/** Workflow state change (§20): old panel fades out, new fades in rising 8px. */
export function workflowTransition(root: Root, from: number, to: number, reduced: boolean) {
  const panels = q(root, "[data-wf-panel]");
  const next = panels[to];
  const prev = panels[from];
  const details = next ? q(next, "[data-anim-item]") : [];
  const draws = next ? q(next, "[data-wf-path]") : [];
  // Rapid switching: anything that is neither leaving nor arriving is hidden now.
  panels.forEach((p) => {
    if (p !== prev && p !== next) utils.set(p, { opacity: 0 });
  });
  if (reduced) {
    if (prev && prev !== next) utils.set(prev, { opacity: 0 });
    if (next) utils.set(next, { opacity: 1, translateY: 0 });
    finalState(details);
    return;
  }
  if (prev && prev !== next) animate(prev, { opacity: [1, 0], duration: DUR.fast, ease: EASE });
  if (next) animate(next, { opacity: [0, 1], translateY: [8, 0], duration: DUR.base, ease: EASE });
  animate(details, { opacity: [0, 1], translateY: [8, 0], duration: DUR.base, ease: EASE, delay: stagger(STAGGER.tight, { start: 120 }) });
  if (draws.length) {
    const d = svg.createDrawable(draws);
    animate(d, { draw: ["0 0", "0 1"], duration: 900, ease: EASE, delay: stagger(120, { start: 200 }) });
  }
  if (next) countUp(q(next, "[data-count]"), false);
}

/** Numeric counter (§22): counts once from 0 to the element's data-count value. */
export function countUp(els: HTMLElement[], reduced: boolean) {
  for (const el of els) {
    const target = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals ?? 0);
    const prefix = el.dataset.prefix ?? "";
    const suffix = el.dataset.suffix ?? "";
    const render = (v: number) => (el.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`);
    if (reduced || !Number.isFinite(target)) {
      render(target);
      continue;
    }
    const obj = { v: 0 };
    animate(obj, { v: target, duration: 1400, ease: EASE, onUpdate: () => render(obj.v) });
  }
}
