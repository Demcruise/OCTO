"use client";

import { Fragment, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ChevronRight, Columns3, Download, ListFilter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROW_HEIGHT, usePreferences } from "@/lib/preferences";
import { Button, ringInset } from "@/components/ui/button";
import { CountBadge } from "@/components/ui/badge";
import { Checkbox, SearchInput } from "@/components/ui/controls";
import { PopoverPanel, useDismissable } from "@/components/ui/overlay";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/states";

type Value = string | number | null | undefined;

export type Column<T> = {
  id: string;
  header: string;
  /** Raw value used for sorting, filtering, and CSV export. */
  value: (row: T) => Value;
  /** Sort key when it differs from the display value (e.g. severity rank). */
  sortValue?: (row: T) => Value;
  /** Rendered cell; defaults to the raw value. */
  cell?: (row: T) => React.ReactNode;
  align?: "left" | "right";
  width?: string;
  sortable?: boolean;
  /** Offer a faceted filter built from the column's distinct values. */
  facet?: boolean;
  /** Hidden until the user turns it on. */
  defaultHidden?: boolean;
};

type Sort = { id: string; desc: boolean };

export type DataTableProps<T> = {
  label: string;
  data: T[];
  columns: Column<T>[];
  rowId: (row: T) => string;
  status?: "ready" | "loading" | "error";
  error?: { title: string; scope: string; reference?: string };
  onRetry?: () => void;
  /** Rendered above the table when data is older than its freshness target. */
  staleNotice?: string;
  empty: { title: string; body: string; action?: React.ReactNode };
  initialSort?: Sort[];
  searchPlaceholder?: string;
  toolbar?: React.ReactNode;
  selectable?: boolean;
  bulkActions?: (rows: T[], clear: () => void) => React.ReactNode;
  renderExpanded?: (row: T) => React.ReactNode;
  onRowOpen?: (row: T) => void;
  exportName?: string;
  className?: string;
};

const cmp = (a: Value, b: Value) => {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return typeof a === "number" && typeof b === "number" ? a - b : String(a).localeCompare(String(b), undefined, { numeric: true });
};

const csvCell = (v: Value) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/**
 * Enterprise data table (TABLE-001): multi-sort, global and faceted filters,
 * column visibility, global density, sticky header and first column,
 * selection with bulk actions, expansion, keyboard row navigation, CSV
 * export, and explicit loading / empty / filtered-empty / error / stale states.
 */
export function DataTable<T>({
  label,
  data,
  columns,
  rowId,
  status = "ready",
  error,
  onRetry,
  staleNotice,
  empty,
  initialSort = [],
  searchPlaceholder = "Filter rows…",
  toolbar,
  selectable,
  bulkActions,
  renderExpanded,
  onRowOpen,
  exportName,
  className,
}: DataTableProps<T>) {
  const { density } = usePreferences();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort[]>(initialSort);
  const [facets, setFacets] = useState<Record<string, Set<string>>>({});
  const [hidden, setHidden] = useState<Set<string>>(() => new Set(columns.filter((c) => c.defaultHidden).map((c) => c.id)));
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const bodyRef = useRef<HTMLTableSectionElement>(null);

  const visible = columns.filter((c) => !hidden.has(c.id));
  const facetCount = Object.values(facets).reduce((n, s) => n + s.size, 0);
  const filtering = query.trim() !== "" || facetCount > 0;

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = data.filter((r) => {
      for (const [id, set] of Object.entries(facets)) {
        const col = columns.find((c) => c.id === id);
        if (col && set.size && !set.has(String(col.value(r) ?? "—"))) return false;
      }
      return !q || columns.some((c) => String(c.value(r) ?? "").toLowerCase().includes(q));
    });
    if (sort.length) {
      out = [...out].sort((a, b) => {
        for (const s of sort) {
          const col = columns.find((c) => c.id === s.id);
          if (!col) continue;
          const key = col.sortValue ?? col.value;
          const d = cmp(key(a), key(b));
          if (d) return s.desc ? -d : d;
        }
        return 0;
      });
    }
    return out;
  }, [data, columns, query, facets, sort]);

  const selectedRows = data.filter((r) => selected.has(rowId(r)));
  const allOnPage = rows.length > 0 && rows.every((r) => selected.has(rowId(r)));
  const someOnPage = rows.some((r) => selected.has(rowId(r)));

  const toggleSort = (id: string, multi: boolean) => {
    setSort((cur) => {
      const found = cur.find((s) => s.id === id);
      const nextOne = !found ? { id, desc: false } : !found.desc ? { id, desc: true } : null;
      if (multi) return nextOne ? (found ? cur.map((s) => (s.id === id ? nextOne : s)) : [...cur, nextOne]) : cur.filter((s) => s.id !== id);
      return nextOne ? [nextOne] : [];
    });
  };

  const toggleIn = (set: Set<string>, id: string) => {
    const n = new Set(set);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    return n;
  };

  const clearFilters = () => {
    setQuery("");
    setFacets({});
  };

  const exportCsv = () => {
    const source = selectedRows.length ? rows.filter((r) => selected.has(rowId(r))) : rows;
    const lines = [visible.map((c) => csvCell(c.header)).join(","), ...source.map((r) => visible.map((c) => csvCell(c.value(r))).join(","))];
    const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `${exportName ?? "export"}.csv` });
    a.click();
    URL.revokeObjectURL(url);
  };

  // Up/down between rows, Enter opens, Space selects, Right/Left expand (TABLE-001 keyboard).
  const onBodyKeyDown = (e: React.KeyboardEvent, row: T) => {
    const id = rowId(row);
    const trs = Array.from(bodyRef.current?.querySelectorAll<HTMLElement>("tr[data-row]") ?? []);
    const i = trs.indexOf(e.currentTarget as HTMLElement);
    const focusAt = (n: number) => trs[Math.max(0, Math.min(trs.length - 1, n))]?.focus();
    if (e.target !== e.currentTarget) return;
    if (e.key === "ArrowDown") (e.preventDefault(), focusAt(i + 1));
    else if (e.key === "ArrowUp") (e.preventDefault(), focusAt(i - 1));
    else if (e.key === "Home") (e.preventDefault(), focusAt(0));
    else if (e.key === "End") (e.preventDefault(), focusAt(trs.length - 1));
    else if (e.key === "Enter" && onRowOpen) (e.preventDefault(), onRowOpen(row));
    else if (e.key === " " && selectable) (e.preventDefault(), setSelected((s) => toggleIn(s, id)));
    else if (e.key === "ArrowRight" && renderExpanded) setExpanded((s) => new Set(s).add(id));
    else if (e.key === "ArrowLeft" && renderExpanded) setExpanded((s) => (s.delete(id), new Set(s)));
  };

  const rowH = ROW_HEIGHT[density];
  const facetCols = columns.filter((c) => c.facet);

  return (
    <div className={cn("flex min-w-0 flex-col rounded-lg border border-line bg-surface", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-3 py-2">
        {selectable && selectedRows.length > 0 && bulkActions ? (
          <div className="flex flex-1 flex-wrap items-center gap-2" role="region" aria-label="Bulk actions">
            <span className="text-[13px] font-medium">{selectedRows.length} selected</span>
            {bulkActions(selectedRows, () => setSelected(new Set()))}
            <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
              Clear selection
            </Button>
          </div>
        ) : (
          <>
            <SearchInput aria-label={`Filter ${label}`} placeholder={searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} className="w-full sm:w-64" />
            {facetCols.map((c) => (
              <FacetFilter
                key={c.id}
                column={c}
                data={data}
                selected={facets[c.id] ?? new Set()}
                onChange={(s) => setFacets((f) => ({ ...f, [c.id]: s }))}
              />
            ))}
            {filtering && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X /> Reset
              </Button>
            )}
            <div className="ml-auto flex items-center gap-2">
              {toolbar}
              <ColumnMenu columns={columns} hidden={hidden} onToggle={(id) => setHidden((h) => toggleIn(h, id))} />
              <Button size="sm" onClick={exportCsv} disabled={status !== "ready" || rows.length === 0}>
                <Download /> <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </>
        )}
      </div>

      {staleNotice && status === "ready" && (
        <p role="status" className="flex items-center gap-2 border-b border-line bg-warn/8 px-3 py-1.5 text-[12px] text-ink-2">
          <span aria-hidden className="size-1.5 rounded-full bg-warn" />
          {staleNotice}
        </p>
      )}

      {status === "error" ? (
        <ErrorState title={error?.title ?? `Couldn’t load ${label}`} scope={error?.scope ?? "The rest of the page still works."} reference={error?.reference} onRetry={onRetry} />
      ) : status === "ready" && data.length === 0 ? (
        <EmptyState title={empty.title} body={empty.body} action={empty.action} />
      ) : (
        <div className="relative min-h-0 overflow-auto">
          <table className="w-full border-separate border-spacing-0 text-[13px]" aria-label={label} aria-busy={status === "loading"} aria-rowcount={rows.length}>
            <thead className="sticky top-0 z-20">
              <tr>
                {visible.map((c, ci) => {
                  const s = sort.find((x) => x.id === c.id);
                  const sortable = c.sortable !== false;
                  return (
                    <th
                      key={c.id}
                      scope="col"
                      aria-sort={s ? (s.desc ? "descending" : "ascending") : sortable ? "none" : undefined}
                      style={{ width: c.width }}
                      className={cn(
                        "h-9 whitespace-nowrap border-b border-line bg-subtle px-3 text-label font-medium uppercase text-ink-3",
                        c.align === "right" ? "text-right" : "text-left",
                        ci === 0 && "sticky left-0 z-10",
                      )}
                    >
                      <span className={cn("inline-flex items-center gap-2", c.align === "right" && "flex-row-reverse")}>
                        {ci === 0 && selectable && (
                          <Checkbox
                            label="Select all rows"
                            checked={allOnPage}
                            indeterminate={!allOnPage && someOnPage}
                            onChange={(v) => setSelected(v ? new Set(rows.map(rowId)) : new Set())}
                          />
                        )}
                        {ci === 0 && renderExpanded && <span aria-hidden className="w-4" />}
                        {sortable ? (
                          <button
                            type="button"
                            onClick={(e) => toggleSort(c.id, e.shiftKey)}
                            title="Click to sort · Shift-click to add to sort"
                            className={cn("inline-flex cursor-pointer items-center gap-1 rounded-sm uppercase hover:text-ink", s && "text-ink", ringInset)}
                          >
                            {c.header}
                            {s && (s.desc ? <ArrowDown aria-hidden className="size-3" /> : <ArrowUp aria-hidden className="size-3" />)}
                            {s && sort.length > 1 && <span className="font-data text-[9px] text-ink-3">{sort.indexOf(s) + 1}</span>}
                          </button>
                        ) : (
                          c.header
                        )}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody ref={bodyRef}>
              {status === "loading" &&
                Array.from({ length: 8 }, (_, i) => (
                  <tr key={i} className={rowH}>
                    {visible.map((c) => (
                      <td key={c.id} className="border-b border-line px-3">
                        <Skeleton className={cn("h-3", c.align === "right" ? "ml-auto w-14" : "w-3/4")} />
                      </td>
                    ))}
                  </tr>
                ))}

              {status === "ready" && rows.length === 0 && (
                <tr>
                  <td colSpan={visible.length}>
                    <EmptyState
                      title="No rows match these filters"
                      body={`${data.length} rows are hidden by the current search or filters.`}
                      action={
                        <Button size="sm" onClick={clearFilters}>
                          Clear filters
                        </Button>
                      }
                    />
                  </td>
                </tr>
              )}

              {status === "ready" &&
                rows.map((r) => {
                  const id = rowId(r);
                  const isSel = selected.has(id);
                  const isExp = expanded.has(id);
                  return (
                    <Fragment key={id}>
                      <tr
                        data-row
                        tabIndex={0}
                        aria-selected={selectable ? isSel : undefined}
                        aria-expanded={renderExpanded ? isExp : undefined}
                        onKeyDown={(e) => onBodyKeyDown(e, r)}
                        onClick={(e) => {
                          if ((e.target as HTMLElement).closest("button, a, input")) return;
                          onRowOpen?.(r);
                        }}
                        className={cn(
                          "group/row focus-visible:outline-none",
                          rowH,
                          onRowOpen && "cursor-pointer",
                          isSel ? "bg-accent-soft" : "hover:bg-hover focus-visible:bg-hover",
                        )}
                      >
                        {visible.map((c, ci) => (
                          <td
                            key={c.id}
                            className={cn(
                              "whitespace-nowrap border-b border-line px-3 text-ink-2",
                              c.align === "right" ? "text-right font-data tabular-nums" : "text-left",
                              ci === 0 && "sticky left-0 z-[1] bg-surface font-medium text-ink group-hover/row:bg-hover group-focus-visible/row:bg-hover group-focus-visible/row:shadow-[inset_2px_0_0_var(--color-accent)]",
                              ci === 0 && isSel && "bg-accent-soft",
                            )}
                          >
                            <span className={cn("flex items-center gap-2", c.align === "right" && "justify-end")}>
                              {ci === 0 && selectable && <Checkbox label={`Select row ${id}`} checked={isSel} onChange={() => setSelected((s) => toggleIn(s, id))} />}
                              {ci === 0 && renderExpanded && (
                                <button
                                  type="button"
                                  aria-label={isExp ? `Collapse ${id}` : `Expand ${id}`}
                                  aria-expanded={isExp}
                                  onClick={() => setExpanded((s) => toggleIn(s, id))}
                                  className={cn("flex size-4 cursor-pointer items-center justify-center rounded-sm text-ink-3 hover:text-ink", ringInset)}
                                >
                                  <ChevronRight aria-hidden className={cn("size-3.5 transition-transform", isExp && "rotate-90")} />
                                </button>
                              )}
                              <span className="min-w-0 truncate">{c.cell ? c.cell(r) : (c.value(r) ?? "—")}</span>
                            </span>
                          </td>
                        ))}
                      </tr>
                      {renderExpanded && isExp && (
                        <tr>
                          <td colSpan={visible.length} className="border-b border-line bg-subtle px-3 py-3 pl-12">
                            {renderExpanded(r)}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {status === "ready" && data.length > 0 && (
        <div className="flex items-center justify-between gap-2 border-t border-line px-3 py-2 text-[12px] text-ink-3">
          <span>
            {rows.length === data.length ? `${data.length} rows` : `${rows.length} of ${data.length} rows`}
            {sort.length > 1 && ` · sorted by ${sort.length} columns`}
          </span>
          <span className="hidden sm:inline">↑↓ move · Enter open{selectable && " · Space select"}</span>
        </div>
      )}
    </div>
  );
}

function FacetFilter<T>({ column, data, selected, onChange }: { column: Column<T>; data: T[]; selected: Set<string>; onChange: (s: Set<string>) => void }) {
  const { open, setOpen, rootRef, triggerRef } = useDismissable();
  const options = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of data) {
      const k = String(column.value(r) ?? "—");
      m.set(k, (m.get(k) ?? 0) + 1);
    }
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [data, column]);
  return (
    <div ref={rootRef} className="relative">
      <Button ref={triggerRef} size="sm" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(!open)} className={cn(selected.size > 0 && "border-accent-line bg-accent-soft")}>
        <ListFilter /> {column.header}
        {selected.size > 0 && <CountBadge tone="accent">{selected.size}</CountBadge>}
      </Button>
      {open && (
        <PopoverPanel align="start" role="dialog" aria-label={`Filter by ${column.header}`} className="w-56 p-1">
          <ul>
            {options.map(([k, n]) => (
              <li key={k}>
                <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[13px] hover:bg-hover">
                  <Checkbox
                    label={k}
                    checked={selected.has(k)}
                    onChange={() => {
                      const s = new Set(selected);
                      if (s.has(k)) s.delete(k);
                      else s.add(k);
                      onChange(s);
                    }}
                  />
                  <span className="flex-1 truncate capitalize">{k}</span>
                  <span className="font-data text-[11px] text-ink-4">{n}</span>
                </label>
              </li>
            ))}
          </ul>
          {selected.size > 0 && (
            <button type="button" onClick={() => onChange(new Set())} className={cn("mt-1 w-full cursor-pointer rounded-md border-t border-line px-2 py-1.5 text-left text-[12px] text-accent hover:bg-hover", ringInset)}>
              Clear {column.header.toLowerCase()} filter
            </button>
          )}
        </PopoverPanel>
      )}
    </div>
  );
}

function ColumnMenu<T>({ columns, hidden, onToggle }: { columns: Column<T>[]; hidden: Set<string>; onToggle: (id: string) => void }) {
  const { open, setOpen, rootRef, triggerRef } = useDismissable();
  return (
    <div ref={rootRef} className="relative">
      <Button ref={triggerRef} size="sm" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(!open)} aria-label="Columns">
        <Columns3 /> <span className="hidden sm:inline">Columns</span>
      </Button>
      {open && (
        <PopoverPanel role="dialog" aria-label="Visible columns" className="w-52 p-1">
          {columns.map((c, i) => (
            <label key={c.id} className={cn("flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px]", i === 0 ? "text-ink-4" : "cursor-pointer hover:bg-hover")}>
              <Checkbox label={c.header} checked={!hidden.has(c.id)} onChange={() => i !== 0 && onToggle(c.id)} />
              {c.header}
              {i === 0 && <span className="ml-auto text-[11px]">Pinned</span>}
            </label>
          ))}
        </PopoverPanel>
      )}
    </div>
  );
}
