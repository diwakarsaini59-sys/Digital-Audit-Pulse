import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { IssueStatus, SeoAuditItem } from '../../types/audit';
import { IssueCard } from '../IssueCard';

interface SeoAuditTabProps {
  items: SeoAuditItem[];
}

const SEVERITIES: Array<'All' | IssueStatus> = ['All', 'Critical', 'Warning', 'Pass', 'Info'];

export const SeoAuditTab: React.FC<SeoAuditTabProps> = ({ items }) => {
  const [severityFilter, setSeverityFilter] = useState<'All' | IssueStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: items.length, Critical: 0, Warning: 0, Pass: 0, Info: 0 };
    for (const item of items) {
      map[item.status] = (map[item.status] || 0) + 1;
    }
    return map;
  }, [items]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      if (severityFilter !== 'All' && item.status !== severityFilter) return false;
      if (!q) return true;
      return (
        item.item.toLowerCase().includes(q) ||
        item.finding.toLowerCase().includes(q) ||
        item.recommendation.toLowerCase().includes(q)
      );
    });
  }, [items, severityFilter, searchQuery]);

  return (
    <div className="space-y-5">
      {/* Filter & Search Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter SEO findings by severity">
          {SEVERITIES.map((sev) => {
            const active = severityFilter === sev;
            return (
              <button
                key={sev}
                type="button"
                onClick={() => setSeverityFilter(sev)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                  active
                    ? 'bg-indigo-950 text-white dark:bg-teal-500 dark:text-slate-950'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                <span>{sev}</span>
                <span className="font-mono tabular-nums opacity-80">{counts[sev] ?? 0}</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SEO checks..."
            aria-label="Search SEO audit checks"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:bg-slate-900"
          />
        </div>
      </div>

      {/* Results List */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            No SEO audit checks match your current filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSeverityFilter('All');
              setSearchQuery('');
            }}
            className="mt-3 rounded-lg bg-slate-100 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item, idx) => (
            <IssueCard
              key={`${item.item}-${idx}`}
              title={item.item}
              category="On-Page & Authority SEO"
              status={item.status}
              finding={item.finding}
              whyItMatters={item.whyItMatters}
              howToFix={item.recommendation}
              effort={item.effort || 'Medium'}
            />
          ))}
        </div>
      )}
    </div>
  );
};
