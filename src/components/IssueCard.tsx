import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, ChevronDown, Info } from 'lucide-react';
import type { EffortLevel, IssueStatus } from '../types/audit';
import { getStatusColorClasses } from '../utils/url';

interface IssueCardProps {
  title: string;
  category?: string;
  status: IssueStatus;
  finding: string;
  whyItMatters?: string;
  howToFix: string;
  effort?: EffortLevel;
  defaultExpanded?: boolean;
}

const StatusIcon: React.FC<{ status: IssueStatus }> = ({ status }) => {
  switch (status) {
    case 'Critical':
      return <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" aria-hidden="true" />;
    case 'Warning':
      return <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />;
    case 'Pass':
      return <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />;
    case 'Info':
    default:
      return <Info className="h-4 w-4 text-slate-500 dark:text-slate-400 shrink-0" aria-hidden="true" />;
  }
};

export const IssueCard: React.FC<IssueCardProps> = ({
  title,
  category,
  status,
  finding,
  whyItMatters,
  howToFix,
  effort = 'Medium',
  defaultExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="rounded-xl border border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-900">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        className="flex w-full items-start justify-between gap-4 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-xl"
      >
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusIcon status={status} />
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${getStatusColorClasses(
                status
              )}`}
            >
              {status}
            </span>
            {category && (
              <>
                <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
                  ·
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{category}</span>
              </>
            )}
            <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
              ·
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Effort: {effort}</span>
          </div>

          <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{finding}</p>
        </div>

        <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </span>
      </button>

      {expanded && (
        <div className="border-t border-slate-100 px-4 py-4 space-y-3 bg-slate-50/70 rounded-b-xl dark:border-slate-800 dark:bg-slate-950/50">
          {whyItMatters && (
            <div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Why it matters</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{whyItMatters}</p>
            </div>
          )}
          <div>
            <p className="text-xs font-semibold text-teal-700 dark:text-teal-400">How to fix it</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{howToFix}</p>
          </div>
          <div className="flex items-center justify-between pt-1 text-xs text-slate-500 dark:text-slate-400">
            <span>Estimated implementation effort: {effort}</span>
          </div>
        </div>
      )}
    </div>
  );
};
