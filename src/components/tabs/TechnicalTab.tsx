import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { IssueStatus, TechnicalChecklistItem } from '../../types/audit';
import { IssueCard } from '../IssueCard';

interface TechnicalTabProps {
  items: TechnicalChecklistItem[];
}

const SEVERITIES: Array<'All' | IssueStatus> = ['All', 'Critical', 'Warning', 'Pass', 'Info'];

export const TechnicalTab: React.FC<TechnicalTabProps> = ({ items }) => {
  const [severityFilter, setSeverityFilter] = useState<'All' | IssueStatus>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => {
    const unique = Array.from(new Set(items.map((i) => i.category))).filter(Boolean);
    return ['All', ...unique];
  }, [items]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      if (severityFilter !== 'All' && item.status !== severityFilter) return false;
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        item.check.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.detail.toLowerCase().includes(q) ||
        item.fix.toLowerCase().includes(q)
      );
    });
  }, [items, severityFilter, categoryFilter, searchQuery]);

  const grouped = useMemo(() => {
    const map = new Map<string, TechnicalChecklistItem[]>();
    for (const item of filtered) {
      const list = map.get(item.category) || [];
      list.push(item);
      map.set(item.category, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="space-y-5">
      {/* Filter Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter technical checks by severity">
            {SEVERITIES.map((sev) => {
              const active = severityFilter === sev;
              return (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setSeverityFilter(sev)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                    active
                      ? 'bg-indigo-950 text-white dark:bg-teal-500 dark:text-slate-950'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {sev}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by technical category"
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            <div className="relative w-full sm:w-64">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search technical checks..."
                aria-label="Search technical SEO checklist"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:bg-slate-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grouped Checklist */}
      {grouped.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            No technical checks match your current filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSeverityFilter('All');
              setCategoryFilter('All');
              setSearchQuery('');
            }}
            className="mt-3 rounded-lg bg-slate-100 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(([category, groupItems]) => (
            <section key={category} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-display text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {category}
                </h3>
                <span className="font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
                  {groupItems.length} {groupItems.length === 1 ? 'check' : 'checks'}
                </span>
              </div>
              <div className="space-y-2.5">
                {groupItems.map((item, idx) => (
                  <IssueCard
                    key={`${item.check}-${idx}`}
                    title={item.check}
                    category={item.category}
                    status={item.status}
                    finding={item.detail}
                    whyItMatters={item.whyItMatters}
                    howToFix={item.fix}
                    effort={item.effort || 'Medium'}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
