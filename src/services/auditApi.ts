import type { AuditApiError, AuditProgressEvent, AuditReport, AuditRequestParams } from '../types/audit';

export interface RunAuditCallbacks {
  onProgress?: (event: AuditProgressEvent) => void;
}

/**
 * Calls the server-side /api/audit SSE endpoint so the browser receives
 * live stage updates while Gemini performs URL Context + Search Grounding.
 */
export async function runLiveAudit(
  params: AuditRequestParams,
  callbacks: RunAuditCallbacks = {}
): Promise<AuditReport> {
  const response = await fetch('/api/audit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    let errPayload: AuditApiError = {
      code: 'API_ERROR',
      message: `Audit request failed with status ${response.status}.`,
    };
    try {
      const parsed = (await response.json()) as Partial<AuditApiError>;
      if (parsed && parsed.message) {
        errPayload = {
          code: parsed.code || 'API_ERROR',
          message: parsed.message,
          detail: parsed.detail,
        };
      }
    } catch {
      // ignore non-JSON error
    }
    throw errPayload;
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/event-stream') || !response.body) {
    return (await response.json()) as AuditReport;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let finalReport: AuditReport | null = null;
  let streamError: AuditApiError | null = null;

  const processBlock = (block: string) => {
    const lines = block.split('\n');
    let eventName = 'message';
    const dataLines: string[] = [];

    for (const line of lines) {
      if (line.startsWith('event:')) {
        eventName = line.slice(6).trim();
      } else if (line.startsWith('data:')) {
        dataLines.push(line.slice(5).trim());
      }
    }

    if (dataLines.length === 0) return;
    const rawData = dataLines.join('\n');
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawData);
    } catch {
      return;
    }

    if (eventName === 'progress') {
      callbacks.onProgress?.(parsed as AuditProgressEvent);
    } else if (eventName === 'complete') {
      finalReport = parsed as AuditReport;
    } else if (eventName === 'error') {
      streamError = parsed as AuditApiError;
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n');

    let boundary = buffer.indexOf('\n\n');
    while (boundary !== -1) {
      const block = buffer.slice(0, boundary).trim();
      buffer = buffer.slice(boundary + 2);
      if (block) processBlock(block);
      boundary = buffer.indexOf('\n\n');
    }
  }

  if (buffer.trim()) {
    processBlock(buffer.trim());
  }

  if (streamError) {
    throw streamError;
  }
  if (!finalReport) {
    throw {
      code: 'API_ERROR',
      message: 'The audit stream ended unexpectedly before returning a report.',
    } satisfies AuditApiError;
  }

  return finalReport;
}

/**
 * Lighter task backed by gemini-3.1-flash-lite / gemini-4-hydrogen on the server:
 * Generates a ready-to-use implementation snippet for an action plan item.
 */
export async function generateImplementationSnippet(
  url: string,
  topic: string,
  context: string
): Promise<string> {
  const response = await fetch('/api/audit/snippet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, topic, context }),
  });

  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message || 'Unable to generate implementation snippet.');
  }

  const data = (await response.json()) as { snippet: string };
  return data.snippet;
}
