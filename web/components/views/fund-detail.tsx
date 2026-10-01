"use client";

import { useState } from "react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { Download, GitBranch } from "lucide-react";
import { useFormat } from "@/lib/use-format";
import { useFund, useInvestments } from "@/lib/data/queries";
import { ACTIVITY, AS_OF, DEMO_NOW, companyById, fundCashFlows, fundMetrics, fundNavSeries, fundTvpi, investmentMoic, type Investment, type Metric } from "@/lib/demo";
import { PageBody } from "@/components/page/page-header";
import { Panel, PanelBody, PanelHead } from "@/components/page/panel";
import { ObjectHeader, ObjectLinks, ObjectMetadata } from "@/components/object/object";
import { MetricCard, MetricGrid, useMetricValue } from "@/components/metric/metric-card";
import { LineageDrawer } from "@/components/metric/metric-lineage";
import { KpiMetricDrawer } from "@/components/metric/kpi-drawer";
import { ChartShell } from "@/components/chart/chart-shell";
import { TrendChart } from "@/components/chart/line-chart";
import { BarChart, RankingBars } from "@/components/chart/bar-chart";
import { WaterfallChart } from "@/components/chart/waterfall-chart";
import { DonutChart } from "@/components/chart/donut-chart";
import { Legend } from "@/components/chart/core";
import { Timeline } from "@/components/chart/timeline";
import { DataTable, type Column } from "@/components/data/data-table";
import { DeltaCell, EntityCell, NumericCell, SparklineCell, StatusCell } from "@/components/data/cells";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/controls";
import { FreshnessBadge, MetricSkeleton, useToast } from "@/components/feedback";
import { useBreadcrumb } from "@/components/shell/shell-context";
import { FUND_TONE } from "./funds";

type Tab = "overview" | "holdings" | "attribution" | "activity";
const now = new Date(DEMO_NOW);

/**
 * Fund object page (plan §12): KPI band, NAV trajectory, cash-flow timeline,
 * value bridge, sector/geography attribution, underlying investments, and
 * drill-down fund → investment → company that keeps the fund in context.
 */
export function FundDetail({ id }: { id: string }) {
  const f = useFormat();
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();
  const fmt = useMetricValue();
  const fund = useFund(id);
  const inv = useInvestments(fund.data?.id);
  const [lineage, setLineage] = useState<Metric | null>(null);
  const [kpi, setKpi] = useState<Metric | null>(null);
  const tab = (params.get("tab") as Tab) ?? "overview";
  const x = fund.data;

  useBreadcrumb(x ? [{ label: "Invest" }, { label: "Funds", href: "/app/funds" }, { label: x.short }] : null, x ? { type: "Fund", name: x.name, href: `/app/funds/${x.slug}` } : undefined);

  if (fund.isSuccess && !x) notFound();
  if (!x) {
    return (
      <PageBody>
        <MetricGrid cols={4}>
          {[0, 1, 2, 3].map((i) => (
            <MetricSkeleton key={i} />
          ))}
        </MetricGrid>
      </PageBody>
    );
  }

  const rows = inv.data ?? [];
  const metrics = fundMetrics(x);
  const nav = fundNavSeries(x);
  const flows = fundCashFlows(x);
  const opening = nav[nav.length - 2].nav;
  const closing = x.nav / 1e6;
  const q3calls = flows[flows.length - 1].calls;
  const q3dists = flows[flows.length - 1].dists;
  const fx = -Math.round(closing * 0.003 * 10) / 10;
  const valuation = Math.round((closing - opening - q3calls + q3dists - fx) * 10) / 10;
  const bridge = [
    { label: "Opening", value: opening, kind: "total" as const },
    { label: "Calls", value: q3calls, kind: "step" as const },
    { label: "Distributions", value: -q3dists, kind: "step" as const },
    { label: "Valuation", value: valuation, kind: "step" as const },
    { label: "FX", value: fx, kind: "step" as const },
    { label: "Closing", value: closing, kind: "total" as const },
  ];

  const bySector = new Map<string, number>();
  const byGeo = new Map<string, number>();
  const contrib = new Map<string, number>();
  for (const i of rows) {
    const c = companyById(i.companyId)!;
    bySector.set(c.sector, (bySector.get(c.sector) ?? 0) + i.fairValue);
    byGeo.set(c.geography, (byGeo.get(c.geography) ?? 0) + i.fairValue);
    contrib.set(c.sector, (contrib.get(c.sector) ?? 0) + (i.fairValue * i.qtdChange) / 100);
  }
  const sum = rows.reduce((n, i) => n + i.fairValue, 0) || 1;

  const cols: Column<Investment>[] = [
    { id: "company", header: "Company", width: 250, hideable: false, value: (i) => companyById(i.companyId)!.name, cell: (i) => { const c = companyById(i.companyId)!; return <EntityCell name={c.name} sub={`${c.sector} · ${c.geography}`} href={`/app/companies/${c.id.toLowerCase()}?fund=${x.slug}`} />; } },
    { id: "instrument", header: "Instrument", value: (i) => i.instrument, facet: true },
    { id: "entry", header: "Entry", value: (i) => i.entryDate, cell: (i) => f.date(i.entryDate), align: "right" },
    { id: "cost", header: "Cost", value: (i) => i.cost, align: "right", cell: (i) => <NumericCell value={i.cost} muted />, aggregate: (r) => f.money(r.reduce((n, i) => n + i.cost, 0)) },
    { id: "fv", header: "Fair value", value: (i) => i.fairValue, align: "right", cell: (i) => <NumericCell value={i.fairValue} />, aggregate: (r) => f.money(r.reduce((n, i) => n + i.fairValue, 0)) },
    { id: "moic", header: "MOIC", value: (i) => investmentMoic(i), align: "right", cell: (i) => <NumericCell value={investmentMoic(i)} kind="multiple" /> },
    { id: "irr", header: "IRR", value: (i) => i.irr, align: "right", cell: (i) => <NumericCell value={i.irr} kind="pct" /> },
    { id: "weight", header: "Weight", value: (i) => (i.fairValue / sum) * 100, align: "right", cell: (i) => <NumericCell value={(i.fairValue / sum) * 100} kind="pct" muted /> },
    { id: "qtd", header: "QTD", value: (i) => i.qtdChange, align: "right", cell: (i) => <DeltaCell value={i.qtdChange} /> },
    { id: "trend", header: "Trend", value: (i) => i.trend[7], sortable: false, cell: (i) => <SparklineCell values={i.trend} /> },
    { id: "risk", header: "Risk", value: (i) => i.riskStatus, facet: true, cell: (i) => <StatusCell tone={i.riskStatus === "On track" ? "ok" : i.riskStatus === "Watch" ? "warn" : "danger"}>{i.riskStatus}</StatusCell> },
  ];

  const setTab = (t: Tab) => router.replace(`/app/funds/${x.slug}${t === "overview" ? "" : `?tab=${t}`}`, { scroll: false });

  return (
    <>
      <ObjectHeader
        type="Fund"
        name={x.name}
        status={<StatusBadge tone={FUND_TONE[x.status]}>{x.status}</StatusBadge>}
        classification={[x.strategy, `Vintage ${x.vintage}`, x.geography]}
        facts={[
          { label: "Manager", value: x.manager },
          { label: "Committed", value: f.money(x.committed) },
          { label: "NAV", value: f.money(x.nav) },
          { label: "TVPI", value: f.multiple(fundTvpi(x)) },
          { label: "Positions", value: rows.length },
        ]}
        freshness={<FreshnessBadge state="demo" asOf={f.date(AS_OF)} />}
        permission="Partners, IR, fund accounting"
        actions={
          <>
            <Button onClick={() => setLineage(metrics[2])}>
              <GitBranch /> NAV lineage
            </Button>
            <Button variant="primary" onClick={() => toast({ tone: "info", title: "LP report queued", body: "Opens in Reports as a draft (demo)." })}>
              <Download /> LP report
            </Button>
          </>
        }
        tabs={
          <Tabs<Tab>
            label="Fund sections"
            value={tab}
            onChange={setTab}
            className="border-b-0"
            items={[
              { value: "overview", label: "Overview" },
              { value: "holdings", label: "Holdings", count: rows.length },
              { value: "attribution", label: "Attribution" },
              { value: "activity", label: "Activity" },
            ]}
          />
        }
      />

      <PageBody className="space-y-4">
        {tab === "overview" && (
          <>
            <MetricGrid cols={4}>
              {metrics.map((m) => (
                <MetricCard key={m.id} metric={m} variant="compact" onOpen={setKpi} />
              ))}
            </MetricGrid>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
              <ChartShell className="xl:col-span-7" title="NAV trajectory" subtitle="Quarter-end, $M" source="IBOR valuations" freshness={<FreshnessBadge state="demo" />} exportData={{ filename: `${x.slug}-nav`, head: ["Quarter", "NAV ($M)"], rows: nav.map((p) => [p.q, p.nav]) }} height={240}>
                <TrendChart x={nav.map((p) => p.q)} series={[{ id: "nav", label: "NAV", values: nav.map((p) => p.nav) }]} format={(v) => `$${Math.round(v)}M`} label={`${x.name} NAV`} />
              </ChartShell>
              <ChartShell className="xl:col-span-5" title="Q3 value bridge" subtitle="Opening to closing NAV, $M · axis starts above zero" height={240} exportData={{ filename: `${x.slug}-bridge`, head: ["Step", "$M"], rows: bridge.map((b) => [b.label, b.value]) }}>
                <WaterfallChart data={bridge} label={`${x.name} Q3 value bridge`} format={(v) => `${v < 0 ? "−" : ""}$${Math.abs(v).toFixed(1)}M`} />
              </ChartShell>
            </div>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
              <ChartShell
                className="xl:col-span-8"
                title="Cash-flow timeline"
                subtitle="Capital calls and distributions per quarter, $M"
                legend={<Legend items={[{ label: "Capital calls", color: "var(--color-chart-1)" }, { label: "Distributions", color: "var(--color-chart-2)" }]} />}
                exportData={{ filename: `${x.slug}-cashflows`, head: ["Quarter", "Calls", "Distributions"], rows: flows.map((c) => [c.q, c.calls, c.dists]) }}
                height={220}
              >
                <BarChart x={flows.map((c) => c.q)} series={[{ id: "calls", label: "Capital calls", values: flows.map((c) => c.calls) }, { id: "dists", label: "Distributions", values: flows.map((c) => c.dists) }]} format={(v) => `$${v.toFixed(1)}M`} label="Cash flows" />
              </ChartShell>
              <Panel className="xl:col-span-4">
                <PanelHead title="Fund facts" />
                <PanelBody>
                  <ObjectMetadata
                    items={[
                      { label: "Legal name", value: `${x.name}, L.P.` },
                      { label: "Domicile", value: x.geography === "Global" ? "Cayman Islands" : "Singapore" },
                      { label: "Currency", value: "USD" },
                      { label: "Vintage", value: x.vintage },
                      { label: "Called", value: `${f.money(x.called)} (${f.pct((x.called / x.committed) * 100, 0)})` },
                      { label: "Dry powder", value: f.money(x.committed - x.called) },
                      { label: "Gross IRR", value: f.pct(x.grossIrr) },
                      { label: "Cash", value: f.money(x.cash) },
                    ]}
                  />
                </PanelBody>
              </Panel>
            </div>
            <Panel>
              <PanelHead title="Largest positions" description="Drill into a company; the fund stays in the breadcrumb" />
              <PanelBody>
                <ObjectLinks links={[...rows].sort((a, b) => b.fairValue - a.fairValue).slice(0, 5).map((i) => ({ type: "Company", name: companyById(i.companyId)!.name, href: `/app/companies/${i.companyId.toLowerCase()}?fund=${x.slug}`, meta: `${f.money(i.fairValue)} · ${f.pct((i.fairValue / sum) * 100)}` }))} />
              </PanelBody>
            </Panel>
          </>
        )}

        {tab === "holdings" && (
          <DataTable
            id={`fund-${x.slug}-holdings`}
            label={`${x.name} holdings`}
            data={rows}
            status={inv.isLoading ? "loading" : "ready"}
            columns={cols}
            rowId={(i) => i.id}
            demo
            totals
            onRowOpen={(i) => router.push(`/app/companies/${i.companyId.toLowerCase()}?fund=${x.slug}`)}
            exportName={`${x.slug}-holdings`}
            empty={{ title: "No positions yet", body: "Positions appear once the fund deploys capital." }}
          />
        )}

        {tab === "attribution" && (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <ChartShell title="Sector allocation" subtitle="Share of fair value" height={360}>
              <DonutChart data={[...bySector].map(([key, value]) => ({ key, value })).sort((a, b) => b.value - a.value)} label="Sector allocation" format={(v) => f.money(v)} />
            </ChartShell>
            <Panel>
              <PanelHead title="Sector attribution" description="Contribution to QTD value change" />
              <PanelBody>
                <RankingBars label="Sector attribution" format={(v) => f.delta(v, "$")} items={[...contrib].map(([label, value]) => ({ label, value, color: value >= 0 ? "var(--color-gain)" : "var(--color-loss)" })).sort((a, b) => b.value - a.value)} />
              </PanelBody>
            </Panel>
            <Panel>
              <PanelHead title="Geography attribution" description="Share of fair value" />
              <PanelBody>
                <RankingBars label="Geography attribution" format={(v) => f.pct((v / sum) * 100)} items={[...byGeo].map(([label, value]) => ({ label, value, sub: f.money(value) })).sort((a, b) => b.value - a.value)} />
              </PanelBody>
            </Panel>
          </div>
        )}

        {tab === "activity" && (
          <Panel>
            <PanelHead title="Activity" />
            <PanelBody>
              <Timeline
                events={[
                  { id: "f1", at: AS_OF, label: "30 Sep", title: "Q3 NAV struck", detail: `${f.money(x.nav)} · NAV definition v2.1`, tone: "accent" },
                  { id: "f2", at: AS_OF, label: "12 Aug", title: "Capital call #14 settled", detail: `${f.money(q3calls * 1e6)} from LPs`, tone: "neutral" },
                  ...ACTIVITY.slice(0, 3).map((a) => ({ id: a.id, at: a.at, label: f.ago(a.at, now), title: `${a.actor} ${a.verb} ${a.object}`, tone: "neutral" as const })),
                ]}
              />
            </PanelBody>
          </Panel>
        )}
      </PageBody>

      <KpiMetricDrawer metric={kpi} onClose={() => setKpi(null)} onLineage={(m) => (setKpi(null), setLineage(m))} />
      <LineageDrawer open={!!lineage} onClose={() => setLineage(null)} title={lineage?.label ?? ""} value={lineage ? fmt(lineage) : ""} provenance={lineage?.provenance ?? null} />
    </>
  );
}
