import React, { useMemo, useState } from 'react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';
import { Info, Swords } from 'lucide-react';
import type { AuditReport } from '../types/audit';
import { extractDomain, getScoreColorTokens, getScoreGrade } from '../utils/url';
import { DashboardHeader } from './DashboardHeader';
import { ScoreGauge } from './ScoreGauge';
import { Tooltip } from './Tooltip';
import { OverviewTab } from './tabs/OverviewTab';
import { SeoAuditTab } from './tabs/SeoAuditTab';
import { ContentTab } from './tabs/ContentTab';
import { KeywordsTab } from './tabs/KeywordsTab';
import { TechnicalTab } from './tabs/TechnicalTab';
import { AiSearchTab } from './tabs/AiSearchTab';
import { ActionPlanTab } from './tabs/ActionPlanTab';

interface AuditDashboardProps {
  report: AuditReport;
  onRerun: () => void;
  onToast: (message: string) => void;
}

type TabId = 'overview' | 'seo' | 'content' | 'keywords' | 'technical' | 'aiSearch' | 'actionPlan';

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'seo', label: 'SEO Audit' },
  { id: 'content', label: 'Content Recommendations' },
  { id: 'keywords', label: 'Keyword Suggestions' },
  { id: 'technical', label: 'Technical SEO Checklist' },
  { id: 'aiSearch', label: 'AI-Search Optimization' },
  { id: 'actionPlan', label: 'Action Plan' },
];

const METRIC_TOOLTIPS = {
  overall: 'Combined digital health index across SEO, Content, Keywords, Technical hygiene, and AI-Search readiness.',
  seo: 'Evaluates titles, meta descriptions, headings, internal links, canonicals, and E-E-A-T trust signals.',
  content: 'Measures depth, buyer-intent alignment, topic clusters, and conversion clarity.',
  keywords: 'Assesses commercial keyword coverage and untapped long-tail or competitor-gap search demand.',
  technical: 'Checks crawlability, indexability, security, mobile layout, Core Web Vitals risks, and schema markup.',
  aiSearch: 'Measures how easily answer engines (AI Overviews, ChatGPT, Perplexity, Gemini, Copilot) can cite your brand.',
};

const ImpactEffortBadge: React.FC<{ label: string; value: 'High' | 'Medium' | 'Low' }> = ({
  label,
  value,
}) => {
  const color =
    value === 'High'
      ? label === 'Impact'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
        : 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300'
      : value === 'Medium'
      ? 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
      : 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300';

  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${color}`}>
      {label}: {value}
    </span>
  );
};

export const AuditDashboard: React.FC<AuditDashboardProps> = ({ report, onRerun, onToast }) => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const radarData = useMemo(() => {
    const comp = report.competitorComparison?.scores;
    return [
      { category: 'SEO', primary: report.scores.seo, ...(comp ? { competitor: comp.seo } : {}) },
      { category: 'Content', primary: report.scores.content, ...(comp ? { competitor: comp.content } : {}) },
      { category: 'Keywords', primary: report.scores.keywords, ...(comp ? { competitor: comp.keywords } : {}) },
      { category: 'Technical', primary: report.scores.technical, ...(comp ? { competitor: comp.technical } : {}) },
      { category: 'AI Search', primary: report.scores.aiSearch, ...(comp ? { competitor: comp.aiSearch } : {}) },
    ];
  }, [report]);

  const sortedPriorityFixes = useMemo(() => {
    const rank: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
    return [...report.priorityFixes].sort((a, b) => (rank[a.impact] ?? 1) - (rank[b.impact] ?? 1)).slice(0, 5);
  }, [report.priorityFixes]);

  const primaryDomain = extractDomain(report.url);
  const compDomain = report.competitorComparison ? extractDomain(report.competitorComparison.competitorUrl) : '';

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <DashboardHeader report={report} onRerun={onRerun} onCopySuccess={onToast} />

      {/* AI Audit Disclaimer */}
      <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-100/70 px-4 py-3 text-xs leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-indigo-700 dark:text-teal-400" aria-hidden="true" />
        <p>
          This audit is AI-generated from publicly accessible page content and grounded search signals. Unverifiable
          telemetry is explicitly marked rather than estimated, and results should be cross-checked with Google Search
          Console and PageSpeed Insights.
        </p>
      </div>

      {/* Hero Score Row: Large Overall Gauge + 5 Category Gauges */}
      <section aria-label="Digital health scores" className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <ScoreGauge
            label="Overall Pulse Score"
            score={report.scores.overall}
            tooltip={METRIC_TOOLTIPS.overall}
            size="hero"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:col-span-9 lg:grid-cols-5">
          <ScoreGauge label="SEO" score={report.scores.seo} tooltip={METRIC_TOOLTIPS.seo} />
          <ScoreGauge label="Content" score={report.scores.content} tooltip={METRIC_TOOLTIPS.content} />
          <ScoreGauge label="Keywords" score={report.scores.keywords} tooltip={METRIC_TOOLTIPS.keywords} />
          <ScoreGauge label="Technical" score={report.scores.technical} tooltip={METRIC_TOOLTIPS.technical} />
          <ScoreGauge label="AI-Search" score={report.scores.aiSearch} tooltip={METRIC_TOOLTIPS.aiSearch} />
        </div>
      </section>

      {/* Radar Chart + Top 5 Priority Fixes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 lg:col-span-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
              Category Balance Radar
            </h2>
            <Tooltip text="Visualizes strengths and bottlenecks across all five audit pillars on a 0–100 scale." />
          </div>
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="74%" data={radarData}>
                <PolarGrid stroke="#94a3b8" strokeOpacity={0.3} />
                <PolarAngleAxis
                  dataKey="category"
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar
                  name={primaryDomain}
                  dataKey="primary"
                  stroke="#0d9488"
                  fill="#14b8a6"
                  fillOpacity={0.28}
                  strokeWidth={2}
                />
                {report.competitorComparison && (
                  <Radar
                    name={compDomain}
                    dataKey="competitor"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.14}
                    strokeWidth={2}
                  />
                )}
                <RechartsTooltip
                  contentStyle={{
                    borderRadius: '0.5rem',
                    borderColor: '#cbd5e1',
                    fontSize: '12px',
                  }}
                />
                {report.competitorComparison && <Legend wrapperStyle={{ fontSize: '12px' }} />}
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 lg:col-span-7">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
              Top 5 Priority Fixes
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">Sorted by impact</span>
          </div>
          <ol className="mt-4 space-y-3">
            {sortedPriorityFixes.map((fix, idx) => (
              <li
                key={idx}
                className="rounded-lg border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-950/60"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-xs font-bold tabular-nums text-indigo-700 dark:text-teal-400">
                      0{idx + 1}
                    </span>
                    <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                      {fix.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <ImpactEffortBadge label="Impact" value={fix.impact} />
                    <ImpactEffortBadge label="Effort" value={fix.effort} />
                  </div>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {fix.description}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Competitor Comparison Card (if competitor URL was provided) */}
      {report.competitorComparison && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Swords className="h-4 w-4 text-indigo-700 dark:text-teal-400" aria-hidden="true" />
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                Competitor Comparison: {primaryDomain} vs {compDomain}
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Side-by-side benchmark
            </span>
          </div>

          <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {report.competitorComparison.summary}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
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
              const ours = report.scores[key];
              const theirs = report.competitorComparison!.scores[key];
              const delta = ours - theirs;
              const ourTokens = getScoreColorTokens(ours);
              return (
                <div
                  key={key}
                  className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/60"
                >
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
                  <div className="mt-1.5 flex items-baseline justify-between font-mono tabular-nums">
                    <span className={`text-lg font-bold ${ourTokens.text}`}>{ours}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">vs {theirs}</span>
                  </div>
                  <p
                    className={`mt-1 font-mono text-[11px] font-semibold tabular-nums ${
                      delta >= 0
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-red-700 dark:text-red-400'
                    }`}
                  >
                    {delta >= 0 ? `+${delta} ahead` : `${delta} behind`} ({getScoreGrade(ours)})
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/60">
              <h3 className="font-display text-xs font-semibold text-slate-900 dark:text-white">
                Competitive Gaps to Close
              </h3>
              <ul className="mt-2.5 space-y-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {report.competitorComparison.keyGaps.map((g, i) => (
                  <li key={i}>· {g}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/60">
              <h3 className="font-display text-xs font-semibold text-slate-900 dark:text-white">
                Observed Competitor Advantages
              </h3>
              <ul className="mt-2.5 space-y-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {report.competitorComparison.competitorAdvantages.map((adv, i) => (
                  <li key={i}>· {adv}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* 7-Section Tab Bar */}
      <div className="space-y-5">
        <div
          role="tablist"
          aria-label="Audit report sections"
          className="flex items-center gap-1.5 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1.5 dark:border-slate-800 dark:bg-slate-900"
        >
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                  active
                    ? 'bg-indigo-950 text-white dark:bg-teal-500 dark:text-slate-950'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div role="tabpanel">
          {activeTab === 'overview' && <OverviewTab report={report} />}
          {activeTab === 'seo' && <SeoAuditTab items={report.seoAudit} />}
          {activeTab === 'content' && <ContentTab content={report.contentRecommendations} />}
          {activeTab === 'keywords' && <KeywordsTab keywords={report.keywordSuggestions} />}
          {activeTab === 'technical' && <TechnicalTab items={report.technicalChecklist} />}
          {activeTab === 'aiSearch' && <AiSearchTab aiSearch={report.aiSearchOptimization} />}
          {activeTab === 'actionPlan' && (
            <ActionPlanTab auditId={report.id} url={report.url} roadmap={report.roadmap} />
          )}
        </div>
      </div>
    </div>
  );
};
