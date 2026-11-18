import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import type { AuditStageId } from '../types/audit';

interface AuditLoadingStepperProps {
  url: string;
  currentStage: AuditStageId;
  statusMessage: string;
}

const STAGES: Array<{ id: AuditStageId; label: string }> = [
  { id: 'reading', label: 'Reading page' },
  { id: 'seo', label: 'Analyzing SEO' },
  { id: 'technical', label: 'Checking technical signals' },
  { id: 'keywords', label: 'Researching keywords' },
  { id: 'aiSearch', label: 'Evaluating AI-search readiness' },
  { id: 'building', label: 'Building report' },
];

export const AuditLoadingStepper: React.FC<AuditLoadingStepperProps> = ({
  url,
  currentStage,
  statusMessage,
}) => {
  const currentIndex = Math.max(
    0,
    STAGES.findIndex((s) => s.id === currentStage)
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8" aria-live="polite">
      {/* Progress Card */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium text-teal-700 dark:text-teal-400">Live Gemini Grounded Audit</p>
            <h2 className="mt-0.5 font-display text-xl font-bold text-slate-900 dark:text-white">
              Auditing {url}
            </h2>
          </div>
          <span className="font-mono text-xs font-semibold tabular-nums text-slate-600 dark:text-slate-300">
            Step {currentIndex + 1} of {STAGES.length}
          </span>
        </div>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{statusMessage}</p>

        {/* 6-Stage Stepper */}
        <ol className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {STAGES.map((stage, idx) => {
            const isComplete = idx < currentIndex;
            const isActive = idx === currentIndex;

            return (
              <li
                key={stage.id}
                className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-xs font-medium transition-colors ${
                  isComplete
                    ? 'border-emerald-200 bg-emerald-50/70 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : isActive
                    ? 'border-indigo-300 bg-indigo-50 text-indigo-900 dark:border-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-200'
                    : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-500'
                }`}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                  {isComplete ? (
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  ) : isActive ? (
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-600 dark:text-teal-400" aria-hidden="true" />
                  ) : (
                    <span className="font-mono text-[11px] tabular-nums">{idx + 1}</span>
                  )}
                </span>
                <span className="truncate">{stage.label}</span>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Dashboard Skeleton Preview */}
      <div className="space-y-6" aria-hidden="true">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="flex h-44 flex-col items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="h-3 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-20 w-20 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800/80" />
              <div className="h-4 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="h-80 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 lg:col-span-5">
            <div className="h-4 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-8 mx-auto h-52 w-52 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800/70" />
          </div>
          <div className="h-80 rounded-xl border border-slate-200 bg-white p-6 space-y-4 dark:border-slate-800 dark:bg-slate-900 lg:col-span-7">
            <div className="h-4 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 w-full animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800/70" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
