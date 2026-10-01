/**
 * Deal events (V2 DEAL-003). One shared, deterministic event model behind both
 * the Deals calendar and every timeline: deal, owner, stage, event type,
 * status and due date. Demo data, derived from each deal's stage and age.
 */

import { DEALS, DEMO_NOW, type Deal, type DealStage } from "./entities";

export type DealEventType = "Sourcing" | "Meeting" | "Screening" | "Diligence deadline" | "IC meeting" | "Signing" | "Close" | "Decision";
export type DealEventStatus = "done" | "active" | "blocked" | "upcoming";

export type DealEvent = {
  id: string;
  dealId: string;
  deal: string;
  owner: string;
  stage: DealStage;
  type: DealEventType;
  title: string;
  date: string;
  status: DealEventStatus;
  /** What happens next, phrased as an action. */
  next?: string;
};

const DAY = 86_400_000;
const now = new Date(DEMO_NOW).getTime();
const on = (days: number) => {
  const d = new Date(now + days * DAY);
  d.setUTCHours(days < 0 ? 9 : 10, 0, 0, 0);
  return d.toISOString();
};

function eventsFor(d: Deal, k: number): DealEvent[] {
  const base = { dealId: d.id, deal: d.company, owner: d.owner, stage: d.stage };
  const ev = (n: number, type: DealEventType, title: string, days: number, status: DealEventStatus, next?: string): DealEvent => ({ ...base, id: `${d.id}-E${n}`, type, title, date: on(days), status, next });
  const out: DealEvent[] = [ev(0, "Sourcing", "Deal sourced", -d.ageDays, "done")];
  const j = (k * 3) % 5;
  switch (d.stage) {
    case "Sourced":
      out.push(ev(1, "Meeting", "Intro call with management", 2 + j, "upcoming", d.nextAction));
      break;
    case "Screening":
      out.push(ev(1, "Meeting", "Data room review", -Math.min(6, d.ageDays - 1), "done"));
      out.push(ev(2, "Screening", "Screening committee", 4 + j, "upcoming", d.nextAction));
      break;
    case "Due Diligence":
      out.push(ev(1, "Meeting", "Management presentation", -9 - j, "done"));
      out.push(ev(2, "Diligence deadline", d.evidence === "Complete" ? "Diligence workstreams close" : `Diligence blocked · ${d.evidence.toLowerCase()} evidence`, 8 + j * 2, d.evidence === "Complete" ? "active" : "blocked", d.nextAction));
      out.push(ev(3, "IC meeting", "Target IC date", 22 + j, "upcoming"));
      break;
    case "IC Review":
      out.push(ev(1, "Decision", "IC pre-read circulated", -2, "done"));
      out.push(ev(2, "IC meeting", "Investment committee", 1 + j, "active", d.nextAction));
      out.push(ev(3, "Close", "Target close", 35 + j, "upcoming"));
      break;
    case "Approved":
      out.push(ev(1, "Decision", "IC approved 3/3", -6, "done"));
      out.push(ev(2, "Signing", "SPA signing", 5 + j, "active", d.nextAction));
      out.push(ev(3, "Close", "Completion and funding", 21 + j, "upcoming"));
      break;
    case "Invested":
      out.push(ev(1, "Decision", "IC approved", -70, "done"));
      out.push(ev(2, "Close", "Closed and funded", -49, "done"));
      break;
    case "Passed":
      out.push(ev(1, "Decision", d.lastActivity.title, -12, "done"));
      break;
  }
  return out;
}

/** Events for a set of deals — pass live pipeline state so stage moves show up everywhere. */
export const buildDealEvents = (deals: Deal[]) => deals.flatMap(eventsFor).sort((a, b) => a.date.localeCompare(b.date));

export const DEAL_EVENTS: DealEvent[] = buildDealEvents(DEALS);

export const dealEvents = (dealId: string) => DEAL_EVENTS.filter((e) => e.dealId === dealId);
