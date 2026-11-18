import React, { useState } from 'react';
import { Bot, Check, ChevronDown, Code2, Copy, Globe2, MessageSquareQuote } from 'lucide-react';
import type { AiSearchOptimization } from '../../types/audit';

interface AiSearchTabProps {
  aiSearch: AiSearchOptimization;
}

export const AiSearchTab: React.FC<AiSearchTabProps> = ({ aiSearch }) => {
  const [copiedLlms, setCopiedLlms] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleCopyLlms = async () => {
    try {
      await navigator.clipboard.writeText(aiSearch.llmsTxtSuggestion);
      setCopiedLlms(true);
      setTimeout(() => setCopiedLlms(false), 2000);
    } catch {
      // ignore clipboard failures
    }
  };

  return (
    <div className="space-y-6">
      {/* GEO / AEO Readiness Summary */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
          <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
            GEO / AEO Readiness Summary (AI Overviews, ChatGPT, Perplexity, Gemini, Copilot)
          </h3>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {aiSearch.readinessSummary}
        </p>
      </section>

      {/* Recommendations */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
          AI-Search & Citation Optimization Recommendations
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {aiSearch.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/60"
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                  {rec.title}
                </h4>
                <span
                  className={`shrink-0 rounded-md border px-2 py-0.5 text-xs font-semibold ${
                    rec.priority === 'High'
                      ? 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300'
                      : rec.priority === 'Medium'
                      ? 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                      : 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {rec.priority} Priority
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{rec.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Structured Data + Entity Signals */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-indigo-700 dark:text-teal-400" aria-hidden="true" />
            <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
              Structured Data & Schema Markup
            </h3>
          </div>
          <ul className="mt-4 space-y-2.5">
            {aiSearch.structuredDataSuggestions.map((s, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600 dark:bg-teal-400" aria-hidden="true" />
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
            <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
              Entity Clarity & Brand Authority Signals
            </h3>
          </div>
          <ul className="mt-4 space-y-2.5">
            {aiSearch.entityAndBrandSignals.map((sig, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600 dark:bg-teal-400" aria-hidden="true" />
                <span className="leading-relaxed">{sig}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* llms.txt Suggestion */}
      {aiSearch.llmsTxtSuggestion && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                Suggested /llms.txt Specification
              </h3>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Place at your domain root to guide GPTBot, Google-Extended, PerplexityBot, and ClaudeBot to canonical docs.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyLlms}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              {copiedLlms ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Copy llms.txt</span>
                </>
              )}
            </button>
          </div>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-100 dark:border-slate-800">
            {aiSearch.llmsTxtSuggestion}
          </pre>
        </section>
      )}

      {/* Sample Answer-First FAQ */}
      {aiSearch.sampleFAQ.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="h-4 w-4 text-indigo-700 dark:text-teal-400" aria-hidden="true" />
            <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
              Sample Answer-First FAQ Content (Ready for FAQPage Schema)
            </h3>
          </div>
          <div className="mt-4 space-y-2.5">
            {aiSearch.sampleFAQ.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-lg border border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-950/60"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 p-4 text-left text-sm font-semibold text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-lg"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-slate-200/70 px-4 py-3 text-sm leading-relaxed text-slate-700 dark:border-slate-800 dark:text-slate-300">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
