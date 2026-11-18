import { useCallback, useEffect, useState } from 'react';
import type { AuditReport } from '../types/audit';

const STORAGE_KEY = 'dap_audit_history_v1';

function loadFromStorage(): AuditReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AuditReport[]) : [];
  } catch {
    return [];
  }
}

export function useAuditHistory() {
  const [history, setHistory] = useState<AuditReport[]>(() => loadFromStorage());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Ignore storage quota errors gracefully
    }
  }, [history]);

  const saveAudit = useCallback((report: AuditReport) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.id !== report.id);
      return [report, ...filtered].slice(0, 30);
    });
  }, []);

  const deleteAudit = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    saveAudit,
    deleteAudit,
    clearHistory,
  };
}
