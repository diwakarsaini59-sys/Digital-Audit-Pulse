import React, { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ArrowRight, CheckSquare, GitCompare, History, Play, Square, Trash2 } from 'lucide-react';
import type { AuditReport } from '../types/audit';
import {
  extractDomain,
  formatAuditDate,
  formatShortDate,
  getScoreColorTokens,
  getScoreGrade,
} from '../utils/url';

interface AuditHistoryPageProps {
  history: AuditReport[];
  onOpenAudit: (report: AuditReport) => void;
  onDeleteAudit: (id: string) => void;
  onClearHistory: () => void;
  onNewAudit: () => void;
  onTryDemo: () => void;
}

export const AuditHistoryPage: React.FC<AuditHistoryPageProps> = ({
  history,
  onOpenAudit,
  onDeleteAudit,
  onClearHistory,
  onNewAudit,
  onTryDemo,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    history.length >= 2 ? [history[1].id, history[0].id] : []
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const comparedPair = useMemo(() => {
    if (selectedIds.length !== 2) return null;
    const first = history.find((h) => h.id === selectedIds[0]);
    const second = history.find((h) => h.id === selectedIds[1]);
    if (!first || !second) return null;
    // Order chronologically so delta shows change over time
    return new Date(first.auditDate).getTime() <= new Date(second.auditDate).getTime()
      ? [first, second]
      : [second, first];
  }, [history, selectedIds]);

  const timelineData = useMemo(() => {
    const source = comparedPair || [...history].reverse();
    return source
      .slice()
      .sort((a, b) => new Date(a.auditDate).getTime() - new Date(b.auditDate).getTime())
      .map((item) => ({
        label: `${extractDomain(item.url)} (${formatShortDate(item.auditDate)})`,
        Overall: item.scores.overall,
        SEO: item.scores.seo,
        Content: item.scores.content,
        Technical: item.scores.technical,
        'AI-Search': item.scores.aiSearch,
      }));
  }, [history, comparedPair]);

  if (history.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-900 dark:bg-indigo-950 dark:text-teal-400">
            <History className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="mt-4 font-display text-xl font-bold text-slate-900 dark:text-white">
            No saved audits yet
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Audits you run are saved locally in your browser so you can reopen reports anytime and track score
            improvements over time.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onNewAudit}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-900 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
            >
              <span>Run Your First Audit</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onTryDemo}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <Play className="h-4 w-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              <span>Try demo audit</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Audit History</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Reopen past audits or select any two snapshots to compare score changes over time.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClearHistory}
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Clear history
          </button>
          <button
            type="button"
            onClick={onNewAudit}
            className="rounded-lg bg-indigo-950 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-900 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
          >
            New Audit
          </button>
        </div>
      </div>

      {/* Score Trend & Two-Audit Comparison */}
      {history.length >= 2 && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <GitCompare className="h-4 w-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                {comparedPair
                  ? `Comparing ${extractDomain(comparedPair[0].url)} (${formatShortDate(
                      comparedPair[0].auditDate
                    )}) vs ${extractDomain(comparedPair[1].url)} (${formatShortDate(comparedPair[1].auditDate)})`
                  : 'Score Progression Over Time'}
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {selectedIds.length === 2 ? '2 audits selected' : 'Select 2 audits below to inspect score deltas'}
            </span>
          </div>

          {comparedPair && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {(
                [
                  ['Overall', 'overall'],
                  ['SEO', 'seo'],
                  ['Content', 'content'],
                  ['Keywords', 'keywords'],
                  ['Technical', 'technical'],
                  ['AI-Search', 'aiSearch'],
                ] as const
              ).map(([label, key]) => {
                const baseline = comparedPair[0].scores[key];
                const latest = comparedPair[1].scores[key];
                const delta = latest - baseline;
                return (
                  <div
                    key={key}
                    className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/60"
                  >
                    <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                    <p className="mt-1 font-mono text-base font-bold tabular-nums text-slate-900 dark:text-white">
                      {baseline} → {latest}
                    </p>
                    <p
                      className={`mt-0.5 font-mono text-xs font-semibold tabular-nums ${
                        delta > 0
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : delta < 0
                          ? 'text-red-700 dark:text-red-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {delta > 0 ? `+${delta} pts` : delta < 0 ? `${delta} pts` : 'No change'}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.25} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip
                  contentStyle={{
                    borderRadius: '0.5rem',
                    borderColor: '#cbd5e1',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="Overall" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="SEO" stroke="#4f46e5" strokeWidth={1.75} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Technical" stroke="#16a34a" strokeWidth={1.75} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="AI-Search" stroke="#d97706" strokeWidth={1.75} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Saved Audits Table */}
      <section className="rounded-xl border border-slate-200 bg-white overflow-hidden dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                <th className="py-3 pl-4 pr-2">Compare</th>
                <th className="py-3 px-4">Website</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Market</th>
                <th className="py-3 px-4 text-right">Overall</th>
                <th className="py-3 px-4 text-right">SEO</th>
                <th className="py-3 px-4 text-right">Tech</th>
                <th className="py-3 px-4 text-right">AI-Search</th>
                <th className="py-3 pl-4 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {history.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                const tokens = getScoreColorTokens(item.scores.overall);
                const grade = getScoreGrade(item.scores.overall);
                return (
                  <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                    <td className="py-3 pl-4 pr-2">
                      <button
                        type="button"
                        onClick={() => toggleSelect(item.id)}
                        aria-pressed={isSelected}
                        aria-label={`Select ${extractDomain(item.url)} for comparison`}
                        className="text-slate-400 hover:text-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded"
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                        ) : (
                          <Square className="h-4 w-4" aria-hidden="true" />
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-display font-semibold text-slate-900 dark:text-white">
                        {extractDomain(item.url)}
                      </p>
                      <p className="truncate max-w-xs text-xs text-slate-500 dark:text-slate-400">{item.url}</p>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {formatAuditDate(item.auditDate)}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {item.targetCountry || 'Global'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                      <span className={`inline-block rounded-md border px-2 py-0.5 text-xs font-bold ${tokens.badgeBg}`}>
                        {item.scores.overall} ({grade})
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs tabular-nums text-slate-700 dark:text-slate-200">
                      {item.scores.seo}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs tabular-nums text-slate-700 dark:text-slate-200">
                      {item.scores.technical}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs tabular-nums text-slate-700 dark:text-slate-200">
                      {item.scores.aiSearch}
                    </td>
                    <td className="py-3 pl-4 pr-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenAudit(item)}
                          className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                          Open
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteAudit(item.id)}
                          aria-label={`Delete audit for ${extractDomain(item.url)}`}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
