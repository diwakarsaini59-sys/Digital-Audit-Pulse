import React, { useEffect, useState } from 'react';
import { Calendar, Check, CheckSquare, Copy, Loader2, Square, Terminal } from 'lucide-react';
import type { AuditRoadmap } from '../../types/audit';
import { generateImplementationSnippet } from '../../services/auditApi';

interface ActionPlanTabProps {
  auditId: string;
  url: string;
  roadmap: AuditRoadmap;
}

export const ActionPlanTab: React.FC<ActionPlanTabProps> = ({ auditId, url, roadmap }) => {
  const storageKey = `dap_roadmap_checks_${auditId}`;
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? (JSON.parse(saved) as Record<string, boolean>) : {};
    } catch {
      return {};
    }
  });

  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [snippet, setSnippet] = useState<string>('');
  const [snippetLoading, setSnippetLoading] = useState(false);
  const [snippetError, setSnippetError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(checked));
    } catch {
      // ignore
    }
  }, [checked, storageKey]);

  const toggleItem = (key: string) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGenerateSnippet = async (taskText: string) => {
    setActiveTask(taskText);
    setSnippetLoading(true);
    setSnippetError(null);
    setSnippet('');
    try {
      const result = await generateImplementationSnippet(url, taskText, '30/60/90-day marketing & SEO action plan');
      setSnippet(result);
    } catch (err) {
      setSnippetError((err as Error)?.message || 'Unable to generate implementation snippet.');
    } finally {
      setSnippetLoading(false);
    }
  };

  const handleCopySnippet = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const phases: Array<{ key: 'days30' | 'days60' | 'days90'; title: string; subtitle: string; items: string[] }> = [
    {
      key: 'days30',
      title: 'Days 1–30: Foundation & Quick Wins',
      subtitle: 'Fix critical indexability, schema, metadata, and on-page hygiene issues.',
      items: roadmap.days30,
    },
    {
      key: 'days60',
      title: 'Days 31–60: Content Depth & Clusters',
      subtitle: 'Launch commercial landing pages, topic clusters, and Core Web Vitals optimizations.',
      items: roadmap.days60,
    },
    {
      key: 'days90',
      title: 'Days 61–90: Authority & AI-Search Scale',
      subtitle: 'Build original research, third-party citations, and durable conversion assets.',
      items: roadmap.days90,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {phases.map((phase) => {
          const completedCount = phase.items.filter((_, idx) => checked[`${phase.key}_${idx}`]).length;
          return (
            <section
              key={phase.key}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" aria-hidden="true" />
                  <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                    {phase.title}
                  </h3>
                </div>
                <span className="font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400 shrink-0">
                  {completedCount}/{phase.items.length}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{phase.subtitle}</p>

              <ul className="mt-4 space-y-3 flex-1">
                {phase.items.map((item, idx) => {
                  const itemKey = `${phase.key}_${idx}`;
                  const isDone = Boolean(checked[itemKey]);
                  return (
                    <li
                      key={itemKey}
                      className="rounded-lg border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/60"
                    >
                      <div className="flex items-start gap-2.5">
                        <button
                          type="button"
                          onClick={() => toggleItem(itemKey)}
                          aria-pressed={isDone}
                          aria-label={`Mark "${item}" as ${isDone ? 'incomplete' : 'complete'}`}
                          className="mt-0.5 shrink-0 text-slate-400 hover:text-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded"
                        >
                          {isDone ? (
                            <CheckSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                          ) : (
                            <Square className="h-4 w-4" aria-hidden="true" />
                          )}
                        </button>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-sm leading-relaxed ${
                              isDone
                                ? 'line-through text-slate-400 dark:text-slate-500'
                                : 'text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            {item}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleGenerateSnippet(item)}
                            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-indigo-700 hover:text-indigo-900 dark:text-teal-400 dark:hover:text-teal-300"
                          >
                            <Terminal className="h-3 w-3" aria-hidden="true" />
                            <span>Get implementation brief</span>
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      {/* On-demand Gemini 2.5 Flash Implementation Brief Panel */}
      {activeTask && (
        <section className="rounded-xl border border-indigo-200 bg-white p-6 dark:border-indigo-900 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-teal-700 dark:text-teal-400">Implementation Brief</p>
              <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-white">{activeTask}</h4>
            </div>
            {snippet && !snippetLoading && (
              <button
                type="button"
                onClick={handleCopySnippet}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy brief'}</span>
              </button>
            )}
          </div>

          {snippetLoading && (
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <Loader2 className="h-4 w-4 animate-spin text-teal-600" aria-hidden="true" />
              <span>Drafting tailored implementation snippet...</span>
            </div>
          )}

          {snippetError && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400">{snippetError}</p>
          )}

          {snippet && !snippetLoading && (
            <pre className="mt-4 whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-100 dark:border-slate-800">
              {snippet}
            </pre>
          )}
        </section>
      )}
    </div>
  );
};
