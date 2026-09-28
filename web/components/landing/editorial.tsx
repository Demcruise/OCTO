"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Reveal, Section, SectionHeader } from "./primitives";

type Tile = { src: string; alt: string; label: string; title: string; note: string; className: string };

/* Case-study tiles (PAL-026): grayscale photography paired with product facts. */
const TILES: Tile[] = [
  {
    src: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492",
    alt: "Aerial view of freight trucks parked at a logistics depot",
    label: "Portfolio monitoring",
    title: "Reduce weekly portfolio review from fragmented spreadsheets to one operating view.",
    note: "Harbor Logistics · EBITDA −8.2% QoQ · explained from four sources",
    className: "md:col-span-7 md:row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c",
    alt: "A quiet institutional meeting room with a long table",
    label: "Investment committee",
    title: "Bring evidence, models, and approvals into one workflow.",
    note: "IC review · evidence attached · named approver",
    className: "md:col-span-5",
  },
  {
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
    alt: "Glass office towers in a financial district seen from street level",
    label: "LP reporting",
    title: "Trace reported metrics back to the governed source.",
    note: "Q3 report · every figure resolves to the ledger",
    className: "md:col-span-5",
  },
  {
    src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122",
    alt: "Sparks from a metal grinder in a manufacturing plant",
    label: "Diligence",
    title: "Connect findings, evidence, and decision context.",
    note: "Acme Robotics · 2 open items · checklist tracked",
    className: "md:col-span-12",
  },
];

/** Case studies: editorial imagery, tightly cropped, annotated (PAL-026). */
export function Editorial() {
  return (
    <Section id="case-studies" tone="void" labelledBy="cases-title">
      <SectionHeader
        id="cases-title"
        index="18"
        eyebrow="Case studies"
        title="Built for the work behind every investment."
        lead="From the committee room to the factory floor, OCTO keeps the facts behind each decision in one place."
        inverse
      />
      <Reveal className="mt-16 grid grid-cols-1 gap-px bg-night-line md:grid-cols-12 md:auto-rows-[300px]">
        {TILES.map((t, i) => (
          <figure key={t.src} className={cn("group relative min-h-[280px] overflow-hidden bg-night", t.className)}>
            <Image
              src={`${t.src}?auto=format&fit=crop&w=1600&q=70`}
              alt={t.alt}
              fill
              sizes={i === 0 ? "(min-width: 768px) 58vw, 100vw" : i === 3 ? "100vw" : "(min-width: 768px) 42vw, 100vw"}
              className="object-cover opacity-70 grayscale contrast-125 transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transition-none"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-6">
              <p className="font-data text-meta uppercase text-accent-light">{t.label}</p>
              <p className={cn("mt-2 max-w-xl font-medium tracking-tight text-white", i === 0 ? "text-3xl md:text-4xl" : "text-xl")}>{t.title}</p>
              <p className="mt-3 flex items-center gap-2 font-data text-[11px] text-white/75">
                <span aria-hidden className="h-px w-6 bg-accent-light" />
                {t.note}
              </p>
            </figcaption>
          </figure>
        ))}
      </Reveal>
      <p className="mt-4 font-data text-[10px] uppercase tracking-[0.1em] text-fog">Photography: Unsplash · Representative scenarios on sample data</p>
    </Section>
  );
}
