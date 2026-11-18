import React from 'react';
import type { AuditReport } from '../types/audit';
import {
  formatAuditDate,
  getScoreGrade,
  REPORT_FOOTER_DISCLAIMER,
} from '../utils/url';
import { BrandLogo } from './BrandLogo';

interface PrintReportProps {
  report: AuditReport;
}

export const PrintReport: React.FC<PrintReportProps> = ({ report }) => {
  const grade = getScoreGrade(report.scores.overall);

  return (
    <div className="print-only bg-white text-slate-900">
      {/* Page 1: Branded Cover Page */}
      <section className="min-h-[245mm] flex flex-col justify-between border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center justify-between border-b border-slate-200 pb-6">
            <BrandLogo size="lg" />
            <span className="text-xs font-mono text-slate-500">Digital Marketing Audit Report</span>
          </div>

          <div className="mt-14 space-y-4">
            <p className="text-xs font-semibold tracking-wide text-teal-700">
              WEBSITE DIGITAL HEALTH ASSESSMENT
            </p>
            <h1 className="font-display text-3xl font-bold text-slate-950 break-all">
              {report.url}
            </h1>
            <p className="text-sm text-slate-600">
              Audit Date: {formatAuditDate(report.auditDate)} · Target Market: {report.targetCountry || 'Global'}
              {report.competitorUrl ? ` · Competitor Benchmark: ${report.competitorUrl}` : ''}
            </p>
          </div>

          {/* Cover Overall Score */}
          <div className="mt-10 grid grid-cols-6 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-6">
            <div className="col-span-2 border-r border-slate-200 pr-4">
              <p className="text-xs font-semibold text-slate-500">Overall Pulse Score</p>
              <p className="mt-2 font-mono text-5xl font-bold text-slate-950 tabular-nums">
                {report.scores.overall}
                <span className="text-xl text-slate-500">/100</span>
              </p>
              <p className="mt-1 text-sm font-semibold text-teal-700">Grade {grade}</p>
            </div>
            <div className="col-span-4 grid grid-cols-5 gap-3 items-center">
              {(
                [
                  ['SEO', report.scores.seo],
                  ['Content', report.scores.content],
                  ['Keywords', report.scores.keywords],
                  ['Technical', report.scores.technical],
                  ['AI-Search', report.scores.aiSearch],
                ] as const
              ).map(([label, val]) => (
                <div key={label} className="rounded-lg border border-slate-200 bg-white p-3 text-center">
                  <p className="text-[11px] font-medium text-slate-500">{label}</p>
                  <p className="mt-1 font-mono text-xl font-bold text-slate-900 tabular-nums">{val}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900">Executive Summary</h2>
            <p className="text-sm leading-relaxed text-slate-700">{report.executiveSummary}</p>
            <h3 className="font-display text-sm font-bold text-slate-900 pt-2">Business Summary</h3>
            <p className="text-sm leading-relaxed text-slate-600">{report.businessSummary}</p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-display text-sm font-bold text-slate-900">Key Strengths</h3>
              <ul className="mt-2 space-y-1.5 text-xs text-slate-700 list-disc pl-4">
                {report.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-slate-900">Key Weaknesses</h3>
              <ul className="mt-2 space-y-1.5 text-xs text-slate-700 list-disc pl-4">
                {report.weaknesses.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <footer className="border-t border-slate-200 pt-4 text-[10px] text-slate-500">
          {REPORT_FOOTER_DISCLAIMER}
        </footer>
      </section>

      {/* Page 2: Priority Fixes & SEO Audit */}
      <section className="print-page-break pt-4 space-y-6">
        <div>
          <h2 className="font-display text-lg font-bold text-slate-900">Top 5 Priority Fixes</h2>
          <table className="mt-3 w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-300 text-left text-slate-600">
                <th className="py-2 pr-3">#</th>
                <th className="py-2 pr-3">Priority Fix</th>
                <th className="py-2 pr-3">Impact</th>
                <th className="py-2 pr-3">Effort</th>
                <th className="py-2">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {report.priorityFixes.map((fix, i) => (
                <tr key={i} className="print-avoid-break align-top">
                  <td className="py-2 pr-3 font-mono font-bold">{i + 1}</td>
                  <td className="py-2 pr-3 font-semibold">{fix.title}</td>
                  <td className="py-2 pr-3">{fix.impact}</td>
                  <td className="py-2 pr-3">{fix.effort}</td>
                  <td className="py-2 text-slate-700">{fix.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-slate-900">SEO Audit Findings</h2>
          <table className="mt-3 w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-300 text-left text-slate-600">
                <th className="py-2 pr-3">Check</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Observed Finding</th>
                <th className="py-2">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {report.seoAudit.map((s, i) => (
                <tr key={i} className="print-avoid-break align-top">
                  <td className="py-2 pr-3 font-semibold">{s.item}</td>
                  <td className="py-2 pr-3 font-semibold">{s.status}</td>
                  <td className="py-2 pr-3 text-slate-700">{s.finding}</td>
                  <td className="py-2 text-slate-700">{s.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="border-t border-slate-200 pt-3 text-[10px] text-slate-500">
          {REPORT_FOOTER_DISCLAIMER}
        </footer>
      </section>

      {/* Page 3: Technical Checklist & Keywords */}
      <section className="print-page-break pt-4 space-y-6">
        <div>
          <h2 className="font-display text-lg font-bold text-slate-900">Technical SEO Checklist</h2>
          <table className="mt-3 w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-300 text-left text-slate-600">
                <th className="py-2 pr-3">Category</th>
                <th className="py-2 pr-3">Check</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Detail</th>
                <th className="py-2">Recommended Fix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {report.technicalChecklist.map((t, i) => (
                <tr key={i} className="print-avoid-break align-top">
                  <td className="py-2 pr-3 font-medium">{t.category}</td>
                  <td className="py-2 pr-3 font-semibold">{t.check}</td>
                  <td className="py-2 pr-3 font-semibold">{t.status}</td>
                  <td className="py-2 pr-3 text-slate-700">{t.detail}</td>
                  <td className="py-2 text-slate-700">{t.fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-slate-900">
            Keyword Suggestions (Estimated)
          </h2>
          <table className="mt-3 w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-300 text-left text-slate-600">
                <th className="py-2 pr-3">Keyword</th>
                <th className="py-2 pr-3">Intent</th>
                <th className="py-2 pr-3">Difficulty (Est.)</th>
                <th className="py-2 pr-3">Volume Tier (Est.)</th>
                <th className="py-2">Opportunity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {[...report.keywordSuggestions.primary, ...report.keywordSuggestions.longTail].map((k, i) => (
                <tr key={i} className="print-avoid-break align-top">
                  <td className="py-2 pr-3 font-mono font-semibold">{k.keyword}</td>
                  <td className="py-2 pr-3">{k.intent}</td>
                  <td className="py-2 pr-3">{k.estimatedDifficulty}</td>
                  <td className="py-2 pr-3">{k.estimatedVolumeTier}</td>
                  <td className="py-2 text-slate-700">{k.opportunity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="border-t border-slate-200 pt-3 text-[10px] text-slate-500">
          {REPORT_FOOTER_DISCLAIMER}
        </footer>
      </section>

      {/* Page 4: Content, AI-Search Optimization & 30/60/90-Day Roadmap */}
      <section className="print-page-break pt-4 space-y-6">
        <div>
          <h2 className="font-display text-lg font-bold text-slate-900">
            Content &amp; AI-Search Optimization (GEO/AEO)
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-700">
            {report.aiSearchOptimization.readinessSummary}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
            <div>
              <h3 className="font-semibold text-slate-900">Content Gaps</h3>
              <ul className="mt-1.5 list-disc pl-4 space-y-1 text-slate-700">
                {report.contentRecommendations.contentGaps.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Structured Data &amp; Entity Signals</h3>
              <ul className="mt-1.5 list-disc pl-4 space-y-1 text-slate-700">
                {report.aiSearchOptimization.structuredDataSuggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-slate-900">30 / 60 / 90-Day Action Plan</h2>
          <div className="mt-3 grid grid-cols-3 gap-4 text-xs">
            <div className="rounded-lg border border-slate-200 p-3">
              <h3 className="font-semibold text-slate-900">Days 1–30</h3>
              <ul className="mt-2 list-disc pl-4 space-y-1 text-slate-700">
                {report.roadmap.days30.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <h3 className="font-semibold text-slate-900">Days 31–60</h3>
              <ul className="mt-2 list-disc pl-4 space-y-1 text-slate-700">
                {report.roadmap.days60.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <h3 className="font-semibold text-slate-900">Days 61–90</h3>
              <ul className="mt-2 list-disc pl-4 space-y-1 text-slate-700">
                {report.roadmap.days90.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <footer className="border-t border-slate-200 pt-3 text-[10px] text-slate-500">
          {REPORT_FOOTER_DISCLAIMER}
        </footer>
      </section>
    </div>
  );
};
