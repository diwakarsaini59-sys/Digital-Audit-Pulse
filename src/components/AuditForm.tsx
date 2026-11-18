import React, { useState } from 'react';
import { ArrowRight, Clock, Globe, Play, SearchCheck, ShieldCheck, Sparkles } from 'lucide-react';
import type { AuditReport, AuditRequestParams } from '../types/audit';
import {
  extractDomain,
  formatShortDate,
  getScoreColorTokens,
  getScoreGrade,
  TARGET_COUNTRIES,
  validateAndNormalizeUrl,
} from '../utils/url';
import { BrandLogo } from './BrandLogo';

interface AuditFormProps {
  onRunAudit: (params: AuditRequestParams) => void;
  onTryDemo: () => void;
  recentAudits: AuditReport[];
  onOpenAudit: (audit: AuditReport) => void;
  onOpenHistory: () => void;
}

export const AuditForm: React.FC<AuditFormProps> = ({
  onRunAudit,
  onTryDemo,
  recentAudits,
  onOpenAudit,
  onOpenHistory,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [targetCountry, setTargetCountry] = useState('Global');
  const [competitorInput, setCompetitorInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const primary = validateAndNormalizeUrl(urlInput);
    if (!primary.valid) {
      setValidationError(primary.error);
      return;
    }

    let normalizedCompetitor: string | undefined;
    if (competitorInput.trim()) {
      const comp = validateAndNormalizeUrl(competitorInput);
      if (!comp.valid) {
        setValidationError(`Competitor URL: ${comp.error}`);
        return;
      }
      normalizedCompetitor = comp.normalized;
    }

    onRunAudit({
      url: primary.normalized,
      targetCountry,
      competitorUrl: normalizedCompetitor,
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">
      {/* Hero & Audit Input Card */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex justify-center">
            <BrandLogo size="lg" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-slate-900 text-balance dark:text-white sm:text-5xl">
            Your website&apos;s digital health, decoded
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Run a live, grounded audit across SEO, content strategy, keyword gaps, technical signals, and AI-search
            readiness (GEO/AEO) — backed by live page inspection and Google Search grounding.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mx-auto mt-8 max-w-3xl space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <label htmlFor="audit-url-input" className="sr-only">
                Website URL to audit
              </label>
              <Globe
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                id="audit-url-input"
                type="url"
                inputMode="url"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="Enter website URL (e.g. stripe.com or https://example.com)"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-teal-400 dark:focus:bg-slate-900"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-950 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 whitespace-nowrap shrink-0 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
            >
              <span>Run Audit</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Optional Fields */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="target-country-select"
                className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1"
              >
                Target country / region (optional)
              </label>
              <select
                id="target-country-select"
                value={targetCountry}
                onChange={(e) => setTargetCountry(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                {TARGET_COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="competitor-url-input"
                className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1"
              >
                Primary competitor URL (optional)
              </label>
              <input
                id="competitor-url-input"
                type="url"
                inputMode="url"
                value={competitorInput}
                onChange={(e) => {
                  setCompetitorInput(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="e.g. competitor.com"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
          </div>

          {validationError && (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
              {validationError}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Inspects live URL content &amp; search grounding server-side.</span>
            <button
              type="button"
              onClick={onTryDemo}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <Play className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              <span>Try demo audit</span>
            </button>
          </div>
        </form>
      </section>

      {/* 3-Pillar Audit Scope */}
      <section aria-label="Audit coverage pillars" className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-900 dark:bg-indigo-950 dark:text-teal-400">
            <SearchCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="mt-4 font-display text-base font-semibold text-slate-900 dark:text-white">
            On-Page SEO &amp; Keyword Intelligence
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Evaluates title tags, heading hierarchy, internal links, E-E-A-T authority signals, and high-intent primary,
            long-tail, and competitor gap keywords.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-400">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="mt-4 font-display text-base font-semibold text-slate-900 dark:text-white">
            11-Point Technical SEO Diagnostics
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Checks crawlability, indexability, HTTPS security, Core Web Vitals risks (LCP, INP, CLS), structured data,
            accessibility, and JavaScript rendering.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-900 dark:bg-indigo-950 dark:text-teal-400">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="mt-4 font-display text-base font-semibold text-slate-900 dark:text-white">
            AI-Search &amp; GEO Readiness
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Measures citation-worthiness for Google AI Overviews, ChatGPT, Perplexity, Gemini, and Copilot — including
            entity clarity, FAQ schema, and /llms.txt.
          </p>
        </div>
      </section>

      {/* Recent Audits Shortcut */}
      {recentAudits.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-500" aria-hidden="true" />
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                Recent Audits
              </h2>
            </div>
            <button
              type="button"
              onClick={onOpenHistory}
              className="text-xs font-semibold text-indigo-700 hover:underline dark:text-teal-400"
            >
              View all history ({recentAudits.length})
            </button>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentAudits.slice(0, 3).map((audit) => {
              const tokens = getScoreColorTokens(audit.scores.overall);
              const grade = getScoreGrade(audit.scores.overall);
              return (
                <button
                  key={audit.id}
                  type="button"
                  onClick={() => onOpenAudit(audit)}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/70 p-3.5 text-left transition-colors hover:border-teal-400 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-teal-600 dark:hover:bg-slate-900"
                >
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-semibold text-slate-900 dark:text-white">
                      {extractDomain(audit.url)}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {formatShortDate(audit.auditDate)} · {audit.targetCountry || 'Global'}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-md border px-2.5 py-1 font-mono text-xs font-bold tabular-nums ${tokens.badgeBg}`}
                  >
                    {audit.scores.overall} ({grade})
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
