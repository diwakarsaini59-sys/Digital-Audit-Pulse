import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  ClipboardCopy,
  Download,
  ExternalLink,
  FileJson,
  FileSpreadsheet,
  Printer,
  RefreshCw,
} from 'lucide-react';
import type { AuditReport } from '../types/audit';
import {
  buildPlainTextSummary,
  exportIssuesCsv,
  exportJsonReport,
  exportKeywordsCsv,
  exportTechnicalCsv,
  formatAuditDate,
} from '../utils/url';
import { BrandLogo } from './BrandLogo';

interface DashboardHeaderProps {
  report: AuditReport;
  onRerun: () => void;
  onCopySuccess: (message: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  report,
  onRerun,
  onCopySuccess,
}) => {
  const [exportOpen, setExportOpen] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setExportOpen(false);
      }
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExportOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleCopySummary = async () => {
    const summary = buildPlainTextSummary(report);
    try {
      await navigator.clipboard.writeText(summary);
      setCopiedSummary(true);
      onCopySuccess('Executive summary copied to clipboard.');
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch {
      onCopySuccess('Unable to access clipboard in this browser context.');
    }
    setExportOpen(false);
  };

  const handlePrintPdf = () => {
    setExportOpen(false);
    setTimeout(() => {
      window.print();
    }, 80);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-3">
            <BrandLogo size="sm" showWordmark={false} />
            <a
              href={report.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-full items-center gap-1.5 font-display text-lg font-bold text-slate-900 hover:text-indigo-700 dark:text-white dark:hover:text-teal-400"
            >
              <span className="truncate">{report.url}</span>
              <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
            </a>
            {report.isDemo && (
              <span className="rounded-md border border-teal-200 bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-800 dark:border-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
                Sample Demo
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            <span>Audited {formatAuditDate(report.auditDate)}</span>
            <span aria-hidden="true">·</span>
            <span>Market: {report.targetCountry || 'Global'}</span>
            {report.competitorUrl && (
              <>
                <span aria-hidden="true">·</span>
                <span>Competitor: {report.competitorUrl}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onRerun}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 whitespace-nowrap dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Re-run audit</span>
          </button>

          <button
            type="button"
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 whitespace-nowrap dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {copiedSummary ? (
              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            ) : (
              <ClipboardCopy className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span>{copiedSummary ? 'Copied' : 'Copy summary'}</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setExportOpen((prev) => !prev)}
              aria-haspopup="menu"
              aria-expanded={exportOpen}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-950 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 whitespace-nowrap dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Download report</span>
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            </button>

            {exportOpen && (
              <div
                role="menu"
                aria-label="Export audit report options"
                className="absolute right-0 z-40 mt-2 w-60 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-900"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={handlePrintPdf}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Printer className="h-4 w-4 text-indigo-700 dark:text-teal-400" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">PDF Report (Print-ready)</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Multi-page branded layout</p>
                  </div>
                </button>

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    exportIssuesCsv(report);
                    setExportOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <FileSpreadsheet className="h-4 w-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                  <span>CSV: All Audit Issues</span>
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    exportKeywordsCsv(report);
                    setExportOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <FileSpreadsheet className="h-4 w-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                  <span>CSV: Keyword Suggestions</span>
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    exportTechnicalCsv(report);
                    setExportOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <FileSpreadsheet className="h-4 w-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                  <span>CSV: Technical Checklist</span>
                </button>

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    exportJsonReport(report);
                    setExportOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <FileJson className="h-4 w-4 text-slate-500" aria-hidden="true" />
                  <span>JSON: Raw Audit Data</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
