"use client";

import { cn } from "@/lib/utils";
import { Reveal, Section, SectionHeader } from "./primitives";

const CORE = ["Investment Ontology", "IBOR", "Intelligence", "Workflow"];
const SYSTEMS = ["CRM", "Fund administrator", "Data room", "Market data", "Email / documents"];
const TERMS = [
  ["Controlled environment", "OCTO runs inside infrastructure your firm controls."],
  ["Private deployment", "Self-hosted database for the record and a graph store for the ontology."],
  ["Isolated tenant", "Every query runs under your firm's tenant scope."],
  ["Governed integrations", "Adapters read from your systems; nothing writes back without approval."],
] as const;

/** Deployment boundary: users → OCTO → enterprise systems, inside your environment (PAL-026). */
export function Deployment() {
  return (
    <Section id="deployment" tone="void" labelledBy="deployment-title">
      <SectionHeader
        id="deployment-title"
        index="17"
        eyebrow="Deployment"
        title="Deploy where your investment data belongs."
        lead="The record, the ontology, and the AI context stay inside your perimeter. OCTO connects to the systems you already run."
        inverse
      />

      <Reveal className="mt-16">
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[180px_1fr_220px]">
          <div className="flex flex-col justify-center border border-night-line p-5">
            <p className="font-data text-meta uppercase text-fog">Users</p>
            <p className="mt-2 text-[15px]">Deal, portfolio, finance, IR teams</p>
            <p className="mt-1 text-[12px] text-fog">Access by role, fund, and deal</p>
          </div>

          <div className="relative border border-dashed border-accent-light/60 p-5">
            <p className="absolute -top-2.5 left-4 bg-void px-2 font-data text-[10px] uppercase tracking-[0.1em] text-accent-light">Your environment</p>
            <p className="font-data text-meta uppercase text-fog">OCTO</p>
            <ul className="mt-3 grid grid-cols-2 gap-px bg-night-line md:grid-cols-4">
              {CORE.map((c) => (
                <li key={c} className="bg-night px-4 py-5 text-[15px] font-medium">
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-3 font-data text-[11px] text-fog">Permissions · lineage · audit apply across all four</p>
          </div>

          <div className="border border-night-line p-5">
            <p className="font-data text-meta uppercase text-fog">Enterprise systems</p>
            <ul className="mt-2 divide-y divide-night-line">
              {SYSTEMS.map((s) => (
                <li key={s} className="py-1.5 font-data text-[12px] text-white/85">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <dl className="mt-10 grid grid-cols-1 border-t border-night-line sm:grid-cols-2 lg:grid-cols-4">
          {TERMS.map(([k, v], i) => (
            <div key={k} className={cn("border-b border-night-line py-5 pr-6", i > 0 && "lg:border-l lg:pl-6", i % 2 === 1 && "sm:border-l sm:pl-6")}>
              <dt className="text-[15px] font-medium">{k}</dt>
              <dd className="mt-1 text-[13px] leading-relaxed text-fog">{v}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
