import React, { useMemo, useState } from 'react';
import { HelpCircle, Search, Swords } from 'lucide-react';
import type { KeywordSuggestion, KeywordSuggestions } from '../../types/audit';
import { Tooltip } from '../Tooltip';

interface KeywordsTabProps {
  keywords: KeywordSuggestions;
}

const ESTIMATED_TOOLTIP =
  'These volume tiers and difficulty ratings are AI-derived approximations based on live search context, not live paid telemetry from tools such as Ahrefs or Semrush.';

const KeywordTable: React.FC<{ title: string; rows: KeywordSuggestion[] }> = ({ title, rows }) => (
  <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
        <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          Estimated
          <Tooltip text={ESTIMATED_TOOLTIP} label="About estimated keyword metrics" />
        </span>
      </div>
      <span className="font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
        {rows.length} keywords
      </span>
    </div>

    {rows.length === 0 ? (
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">No keywords match your search filter.</p>
    ) : (
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <th className="pb-3 pr-4">Keyword</th>
              <th className="pb-3 pr-4">Intent</th>
              <th className="pb-3 pr-4">
                <span className="inline-flex items-center gap-1">
                  Difficulty (Est.)
                </span>
              </th>
              <th className="pb-3 pr-4">Volume Tier (Est.)</th>
              <th className="pb-3">Strategic Opportunity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((row, idx) => (
              <tr key={idx} className="align-top hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
                <td className="py-3 pr-4 font-mono text-xs font-medium text-indigo-900 dark:text-teal-300">
                  {row.keyword}
                </td>
                <td className="py-3 pr-4 text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                  {row.intent}
                </td>
                <td className="py-3 pr-4 text-xs font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap">
                  {row.estimatedDifficulty}
                </td>
                <td className="py-3 pr-4 text-xs font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap">
                  {row.estimatedVolumeTier}
                </td>
                <td className="py-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {row.opportunity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>
);

export const KeywordsTab: React.FC<KeywordsTabProps> = ({ keywords }) => {
  const [query, setQuery] = useState('');

  const filteredPrimary = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return keywords.primary;
    return keywords.primary.filter(
      (k) => k.keyword.toLowerCase().includes(q) || k.opportunity.toLowerCase().includes(q)
    );
  }, [keywords.primary, query]);

  const filteredLongTail = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return keywords.longTail;
    return keywords.longTail.filter(
      (k) => k.keyword.toLowerCase().includes(q) || k.opportunity.toLowerCase().includes(q)
    );
  }, [keywords.longTail, query]);

  return (
    <div className="space-y-6">
      {/* Search Bar & Estimation Notice */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <span>Keyword difficulty and volume tiers are AI-derived estimates for directional planning.</span>
          <Tooltip text={ESTIMATED_TOOLTIP} label="Keyword estimation methodology" />
        </div>
        <div className="relative w-full sm:w-72">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter keywords..."
            aria-label="Filter keyword suggestions"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:bg-slate-900"
          />
        </div>
      </div>

      <KeywordTable title="Primary Commercial & Category Keywords" rows={filteredPrimary} />
      <KeywordTable title="High-Intent Long-Tail Keywords" rows={filteredLongTail} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
            <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
              Question & AEO Keywords
            </h3>
          </div>
          <ul className="mt-4 space-y-2">
            {keywords.questionKeywords.map((q, idx) => (
              <li
                key={idx}
                className="rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300"
              >
                {q}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Swords className="h-4 w-4 text-indigo-700 dark:text-indigo-400" aria-hidden="true" />
            <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
              Competitor Gap Keywords
            </h3>
          </div>
          <ul className="mt-4 space-y-2">
            {keywords.competitorGapKeywords.map((gap, idx) => (
              <li
                key={idx}
                className="rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2 font-mono text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300"
              >
                {gap}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};
