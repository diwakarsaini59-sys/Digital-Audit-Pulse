import React, { useState } from 'react';
import { BookOpen, ChevronDown, FileText, Layers, MousePointerClick } from 'lucide-react';
import type { ContentRecommendations } from '../../types/audit';

interface ContentTabProps {
  content: ContentRecommendations;
}

export const ContentTab: React.FC<ContentTabProps> = ({ content }) => {
  const [openBlogIdx, setOpenBlogIdx] = useState<number | null>(0);

  return (
    <div className="space-y-6">
      {/* Content Gaps & CTA/Conversion Tips */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-700 dark:text-teal-400" aria-hidden="true" />
            <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
              Identified Content Gaps
            </h3>
          </div>
          <ul className="mt-4 space-y-2.5">
            {content.contentGaps.map((gap, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600 dark:bg-teal-400" aria-hidden="true" />
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <MousePointerClick className="h-4 w-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
            <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
              CTA & Conversion Optimization Tips
            </h3>
          </div>
          <ul className="mt-4 space-y-2.5">
            {content.ctaAndConversionTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600 dark:bg-teal-400" aria-hidden="true" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Topic Clusters */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-indigo-700 dark:text-teal-400" aria-hidden="true" />
          <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
            Recommended Topic Clusters
          </h3>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {content.topicClusters.map((cluster, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/60"
            >
              <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                Pillar: {cluster.pillar}
              </h4>
              <ul className="mt-3 space-y-1.5">
                {cluster.subtopics.map((sub, sIdx) => (
                  <li key={sIdx} className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 flex items-start gap-2">
                    <span className="font-mono text-slate-400 dark:text-slate-500">·</span>
                    <span>{sub}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Page-by-Page Improvements */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
          Page & Section Improvements
        </h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <th className="pb-3 pr-4">Page / Section</th>
                <th className="pb-3 pr-4">Observed Issue</th>
                <th className="pb-3">Recommended Improvement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {content.pageImprovements.map((item, idx) => (
                <tr key={idx} className="align-top">
                  <td className="py-3.5 pr-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                    {item.pageOrSection}
                  </td>
                  <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-300">{item.issue}</td>
                  <td className="py-3.5 text-slate-700 dark:text-slate-200">{item.suggestion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Editorial / Blog Ideas */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-indigo-700 dark:text-teal-400" aria-hidden="true" />
          <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
            High-Impact Content Briefs & Blog Ideas
          </h3>
        </div>
        <div className="mt-4 space-y-3">
          {content.blogIdeas.map((idea, idx) => {
            const isOpen = openBlogIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-lg border border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-950/60"
              >
                <button
                  type="button"
                  onClick={() => setOpenBlogIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-lg"
                >
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Target: <span className="font-mono text-indigo-700 dark:text-teal-400">{idea.targetKeyword}</span>
                      <span className="mx-2" aria-hidden="true">·</span>
                      Intent: {idea.intent}
                    </p>
                    <h4 className="mt-1 font-display text-sm font-semibold text-slate-900 dark:text-white">
                      {idea.title}
                    </h4>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-slate-200/70 px-4 py-3 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Suggested Outline</p>
                    <ol className="mt-2 list-decimal pl-5 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                      {idea.outline.map((line, lIdx) => (
                        <li key={lIdx}>{line}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
