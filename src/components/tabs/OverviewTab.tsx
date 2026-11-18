import React from 'react';
import { CheckCircle2, ExternalLink, AlertTriangle, Zap } from 'lucide-react';
import type { AuditReport } from '../../types/audit';

interface OverviewTabProps {
  report: AuditReport;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ report }) => {
  const quickWins = report.priorityFixes.filter((f) => f.effort === 'Low' || f.impact === 'High').slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Executive & Business Summary */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 lg:col-span-8">
          <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
            Executive Summary
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {report.executiveSummary}
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 lg:col-span-4">
          <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
            Observed Business Profile
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {report.businessSummary}
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap gap-x-3 gap-y-1">
            <span>Market: {report.targetCountry || 'Global'}</span>
            {report.competitorUrl && (
              <>
                <span aria-hidden="true">·</span>
                <span>Benchmark: {report.competitorUrl}</span>
              </>
            )}
          </div>
        </section>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
              Key Strengths
            </h3>
          </div>
          {report.strengths.length > 0 ? (
            <ul className="mt-4 space-y-2.5">
              {report.strengths.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600 dark:bg-emerald-400" aria-hidden="true" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">No strengths recorded.</p>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
              Key Weaknesses
            </h3>
          </div>
          {report.weaknesses.length > 0 ? (
            <ul className="mt-4 space-y-2.5">
              {report.weaknesses.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600 dark:bg-amber-400" aria-hidden="true" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">No weaknesses recorded.</p>
          )}
        </section>
      </div>

      {/* Quick Wins */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
          <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
            Immediate Quick Wins
          </h3>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {quickWins.map((win, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/60"
            >
              <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono font-semibold tabular-nums text-teal-700 dark:text-teal-400">
                  0{idx + 1}
                </span>
                <span>
                  Impact: {win.impact} · Effort: {win.effort}
                </span>
              </div>
              <h4 className="mt-1.5 font-display text-sm font-semibold text-slate-900 dark:text-white">
                {win.title}
              </h4>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{win.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Verified Grounding Sources */}
      {report.groundingSources && report.groundingSources.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
            Search Grounding Sources Referenced
          </h3>
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {report.groundingSources.map((src, idx) => (
              <li key={idx}>
                <a
                  href={src.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex max-w-full items-center gap-1.5 text-xs text-indigo-700 hover:underline dark:text-teal-400"
                >
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{src.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
