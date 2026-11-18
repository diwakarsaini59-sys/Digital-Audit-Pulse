import { useState } from 'react';
import { AlertCircle, Moon, RefreshCw, Sun } from 'lucide-react';
import type {
  AuditApiError,
  AuditReport,
  AuditRequestParams,
  AuditStageId,
} from './types/audit';
import { DEMO_AUDIT_REPORT } from './data/demoAudit';
import { runLiveAudit } from './services/auditApi';
import { useAuditHistory } from './hooks/useAuditHistory';
import { useTheme } from './hooks/useTheme';
import { REPORT_FOOTER_DISCLAIMER } from './utils/url';
import { BrandLogo } from './components/BrandLogo';
import { AuditForm } from './components/AuditForm';
import { AuditLoadingStepper } from './components/AuditLoadingStepper';
import { AuditDashboard } from './components/AuditDashboard';
import { AuditHistoryPage } from './components/AuditHistoryPage';
import { PrintReport } from './components/PrintReport';

type AppView = 'home' | 'loading' | 'dashboard' | 'history' | 'error';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { history, saveAudit, deleteAudit, clearHistory } = useAuditHistory();

  const [view, setView] = useState<AppView>('home');
  const [activeReport, setActiveReport] = useState<AuditReport | null>(null);
  const [lastRequest, setLastRequest] = useState<AuditRequestParams | null>(null);

  const [loadingStage, setLoadingStage] = useState<AuditStageId>('reading');
  const [loadingMessage, setLoadingMessage] = useState<string>('Reading live page content...');
  const [auditError, setAuditError] = useState<AuditApiError | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2800);
  };

  const handleRunAudit = async (params: AuditRequestParams) => {
    setLastRequest(params);
    setAuditError(null);
    setLoadingStage('reading');
    setLoadingMessage(`Reading live page content for ${params.url}...`);
    setView('loading');

    try {
      const result = await runLiveAudit(params, {
        onProgress: (evt) => {
          setLoadingStage(evt.stage);
          setLoadingMessage(evt.message);
        },
      });
      setActiveReport(result);
      saveAudit(result);
      setView('dashboard');
    } catch (err) {
      const apiErr = err as AuditApiError;
      setAuditError({
        code: apiErr?.code || 'API_ERROR',
        message: apiErr?.message || 'Unable to complete the website audit. Please try again.',
        detail: apiErr?.detail,
      });
      setView('error');
    }
  };

  const handleTryDemo = () => {
    const demoSnapshot: AuditReport = {
      ...DEMO_AUDIT_REPORT,
      id: `demo-audit-${Date.now()}`,
      auditDate: new Date().toISOString(),
    };
    setActiveReport(demoSnapshot);
    saveAudit(demoSnapshot);
    setView('dashboard');
  };

  const handleRerun = () => {
    if (activeReport && !activeReport.isDemo) {
      handleRunAudit({
        url: activeReport.url,
        targetCountry: activeReport.targetCountry || 'Global',
        competitorUrl: activeReport.competitorUrl,
      });
      return;
    }
    if (lastRequest) {
      handleRunAudit(lastRequest);
      return;
    }
    setView('home');
  };

  const handleOpenSavedAudit = (report: AuditReport) => {
    setActiveReport(report);
    setView('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Top Navigation Bar */}
      <header className="no-print sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setView('home')}
            className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-lg"
            aria-label="Digital Automation Pulse Home"
          >
            <BrandLogo size="sm" />
          </button>

          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              type="button"
              onClick={() => setView('home')}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-indigo-900 dark:hover:text-teal-400 ${
                view === 'home'
                  ? 'text-indigo-950 font-semibold underline underline-offset-8 decoration-teal-500 decoration-2 dark:text-white'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              New Audit
            </button>
            {activeReport && (
              <button
                type="button"
                onClick={() => setView('dashboard')}
                className={`whitespace-nowrap shrink-0 transition-colors hover:text-indigo-900 dark:hover:text-teal-400 ${
                  view === 'dashboard'
                    ? 'text-indigo-950 font-semibold underline underline-offset-8 decoration-teal-500 decoration-2 dark:text-white'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Current Report
              </button>
            )}
            <button
              type="button"
              onClick={() => setView('history')}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-indigo-900 dark:hover:text-teal-400 ${
                view === 'history'
                  ? 'text-indigo-950 font-semibold underline underline-offset-8 decoration-teal-500 decoration-2 dark:text-white'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Audit History ({history.length})
            </button>
          </nav>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4 text-indigo-900" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setView('history')}
              className="md:hidden rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 whitespace-nowrap shrink-0"
            >
              History ({history.length})
            </button>

            <button
              type="button"
              onClick={() => setView('home')}
              className="rounded-lg bg-indigo-950 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 whitespace-nowrap shrink-0 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
            >
              New Audit
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="no-print flex-1">
        {view === 'home' && (
          <AuditForm
            onRunAudit={handleRunAudit}
            onTryDemo={handleTryDemo}
            recentAudits={history}
            onOpenAudit={handleOpenSavedAudit}
            onOpenHistory={() => setView('history')}
          />
        )}

        {view === 'loading' && (
          <AuditLoadingStepper
            url={lastRequest?.url || ''}
            currentStage={loadingStage}
            statusMessage={loadingMessage}
          />
        )}

        {view === 'error' && auditError && (
          <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-white p-8 dark:border-red-900/70 dark:bg-slate-900"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-red-600 dark:text-red-400" aria-hidden="true" />
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-700 dark:text-red-400">
                    {auditError.code.replace('_', ' ')}
                  </p>
                  <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                    Audit Could Not Be Completed
                  </h1>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {auditError.message}
                  </p>
                  {auditError.detail && (
                    <p className="rounded-lg bg-slate-50 p-3 font-mono text-xs text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                      {auditError.detail}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {lastRequest && (
                  <button
                    type="button"
                    onClick={() => handleRunAudit(lastRequest)}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-900 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
                  >
                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                    <span>Try again</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setView('home')}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Edit URL
                </button>
                <button
                  type="button"
                  onClick={handleTryDemo}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-teal-700 hover:bg-teal-50 dark:border-slate-700 dark:text-teal-400 dark:hover:bg-slate-800"
                >
                  Try demo audit
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'dashboard' && activeReport && (
          <AuditDashboard report={activeReport} onRerun={handleRerun} onToast={showToast} />
        )}

        {view === 'history' && (
          <AuditHistoryPage
            history={history}
            onOpenAudit={handleOpenSavedAudit}
            onDeleteAudit={deleteAudit}
            onClearHistory={clearHistory}
            onNewAudit={() => setView('home')}
            onTryDemo={handleTryDemo}
          />
        )}
      </main>

      {/* Print-only Branded Multi-page PDF Report */}
      {activeReport && <PrintReport report={activeReport} />}

      {/* Quiet Footer */}
      <footer className="no-print border-t border-slate-200 bg-white py-5 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 dark:text-slate-400">
          <span>Digital Automation Pulse</span>
          <span>{REPORT_FOOTER_DISCLAIMER}</span>
        </div>
      </footer>

      {/* Non-blocking Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="no-print fixed bottom-5 right-5 z-50 rounded-xl border border-slate-200 bg-slate-900 px-4 py-2.5 text-xs font-medium text-white shadow-lg dark:border-slate-700 dark:bg-slate-800"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
