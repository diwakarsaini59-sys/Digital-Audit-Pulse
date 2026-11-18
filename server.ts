import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import type { AuditReport } from './src/types/audit.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const MODEL_AUDIT = 'gemini-2.5-pro';
const MODEL_LIGHT = 'gemini-2.5-flash';

function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw Object.assign(new Error('GEMINI_API_KEY environment variable is not configured.'), {
      statusCode: 500,
      errorCode: 'API_KEY_ERROR',
    });
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function normalizeAndValidateUrl(rawUrl: string): { ok: true; url: string } | { ok: false; message: string } {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) {
    return { ok: false, message: 'Please enter a website URL to audit.' };
  }

  let candidate = trimmed;
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return { ok: false, message: 'The URL format is invalid. Try a domain like example.com or https://example.com.' };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { ok: false, message: 'Only http:// and https:// website URLs can be audited.' };
  }

  const host = parsed.hostname.toLowerCase();
  if (
    !host ||
    !host.includes('.') ||
    host === 'localhost' ||
    host.endsWith('.local') ||
    /^(127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(host)
  ) {
    return { ok: false, message: 'Please enter a publicly accessible domain name (e.g. stripe.com).' };
  }

  return { ok: true, url: parsed.toString() };
}

const scoresSchema = {
  type: Type.OBJECT,
  properties: {
    overall: { type: Type.INTEGER },
    seo: { type: Type.INTEGER },
    content: { type: Type.INTEGER },
    keywords: { type: Type.INTEGER },
    technical: { type: Type.INTEGER },
    aiSearch: { type: Type.INTEGER },
  },
  required: ['overall', 'seo', 'content', 'keywords', 'technical', 'aiSearch'],
};

const auditResponseSchema = {
  type: Type.OBJECT,
  properties: {
    url: { type: Type.STRING },
    auditDate: { type: Type.STRING },
    businessSummary: { type: Type.STRING },
    scores: scoresSchema,
    executiveSummary: { type: Type.STRING },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
    priorityFixes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          impact: { type: Type.STRING },
          effort: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ['title', 'impact', 'effort', 'description'],
      },
    },
    seoAudit: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING },
          status: { type: Type.STRING },
          finding: { type: Type.STRING },
          recommendation: { type: Type.STRING },
          whyItMatters: { type: Type.STRING },
          effort: { type: Type.STRING },
        },
        required: ['item', 'status', 'finding', 'recommendation', 'whyItMatters', 'effort'],
      },
    },
    contentRecommendations: {
      type: Type.OBJECT,
      properties: {
        contentGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
        topicClusters: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              pillar: { type: Type.STRING },
              subtopics: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['pillar', 'subtopics'],
          },
        },
        blogIdeas: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              targetKeyword: { type: Type.STRING },
              intent: { type: Type.STRING },
              outline: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['title', 'targetKeyword', 'intent', 'outline'],
          },
        },
        pageImprovements: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              pageOrSection: { type: Type.STRING },
              issue: { type: Type.STRING },
              suggestion: { type: Type.STRING },
            },
            required: ['pageOrSection', 'issue', 'suggestion'],
          },
        },
        ctaAndConversionTips: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['contentGaps', 'topicClusters', 'blogIdeas', 'pageImprovements', 'ctaAndConversionTips'],
    },
    keywordSuggestions: {
      type: Type.OBJECT,
      properties: {
        primary: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              keyword: { type: Type.STRING },
              intent: { type: Type.STRING },
              estimatedDifficulty: { type: Type.STRING },
              estimatedVolumeTier: { type: Type.STRING },
              opportunity: { type: Type.STRING },
            },
            required: ['keyword', 'intent', 'estimatedDifficulty', 'estimatedVolumeTier', 'opportunity'],
          },
        },
        longTail: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              keyword: { type: Type.STRING },
              intent: { type: Type.STRING },
              estimatedDifficulty: { type: Type.STRING },
              estimatedVolumeTier: { type: Type.STRING },
              opportunity: { type: Type.STRING },
            },
            required: ['keyword', 'intent', 'estimatedDifficulty', 'estimatedVolumeTier', 'opportunity'],
          },
        },
        questionKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
        competitorGapKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['primary', 'longTail', 'questionKeywords', 'competitorGapKeywords'],
    },
    technicalChecklist: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          check: { type: Type.STRING },
          status: { type: Type.STRING },
          detail: { type: Type.STRING },
          fix: { type: Type.STRING },
          whyItMatters: { type: Type.STRING },
          effort: { type: Type.STRING },
        },
        required: ['category', 'check', 'status', 'detail', 'fix', 'whyItMatters', 'effort'],
      },
    },
    aiSearchOptimization: {
      type: Type.OBJECT,
      properties: {
        readinessSummary: { type: Type.STRING },
        recommendations: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              priority: { type: Type.STRING },
            },
            required: ['title', 'description', 'priority'],
          },
        },
        structuredDataSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
        entityAndBrandSignals: { type: Type.ARRAY, items: { type: Type.STRING } },
        llmsTxtSuggestion: { type: Type.STRING },
        sampleFAQ: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              answer: { type: Type.STRING },
            },
            required: ['question', 'answer'],
          },
        },
      },
      required: [
        'readinessSummary',
        'recommendations',
        'structuredDataSuggestions',
        'entityAndBrandSignals',
        'llmsTxtSuggestion',
        'sampleFAQ',
      ],
    },
    roadmap: {
      type: Type.OBJECT,
      properties: {
        days30: { type: Type.ARRAY, items: { type: Type.STRING } },
        days60: { type: Type.ARRAY, items: { type: Type.STRING } },
        days90: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['days30', 'days60', 'days90'],
    },
  },
  required: [
    'url',
    'auditDate',
    'businessSummary',
    'scores',
    'executiveSummary',
    'strengths',
    'weaknesses',
    'priorityFixes',
    'seoAudit',
    'contentRecommendations',
    'keywordSuggestions',
    'technicalChecklist',
    'aiSearchOptimization',
    'roadmap',
  ],
};

const competitorResponseSchema = {
  type: Type.OBJECT,
  properties: {
    competitorUrl: { type: Type.STRING },
    summary: { type: Type.STRING },
    scores: scoresSchema,
    keyGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
    competitorAdvantages: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ['competitorUrl', 'summary', 'scores', 'keyGaps', 'competitorAdvantages'],
};

const AUDIT_SYSTEM_INSTRUCTION = `You are a senior SEO and digital marketing strategist performing a rigorous, evidence-based audit for "Digital Automation Pulse".

CRITICAL INTEGRITY RULES:
1. Base all findings strictly on what you observe via the URL Context tool and Google Search grounding.
2. NEVER invent crawl stats, traffic numbers, backlink counts, or metrics you cannot verify. If a signal (such as server security headers, robots.txt rules, Core Web Vitals field telemetry, hreflang tags, or exact backlink count) cannot be directly observed from the page or search grounding, explicitly state "Not verifiable from public page/search signals" (or "Not verifiable") in the finding/detail and explain how to verify it.
3. Status values for seoAudit and technicalChecklist MUST be strictly one of: "Critical", "Warning", "Pass", "Info".
4. Impact, Effort, and Priority values MUST be strictly one of: "High", "Medium", "Low".
5. Scores MUST be integers between 0 and 100.

REQUIRED COVERAGE:
- seoAudit (cover all 11 areas):
  1. Title Tags & SERP Snippets
  2. Meta Descriptions
  3. Heading Structure (H1–H3 hierarchy)
  4. URL Structure & Slugs
  5. Internal Linking Architecture
  6. Image Alt Text & Media Semantics
  7. Canonical Tags & Duplicate Control
  8. Content Depth & Search Intent Alignment
  9. E-E-A-T Signals (Author, Expertise, Trust, Citations)
  10. Local SEO Signals (NAP, GBP, local schema, or N/A if global)
  11. Backlink & Domain Authority Observations (from search grounding)

- technicalChecklist (grouped cleanly by category across all 11 areas):
  - "Crawlability": robots.txt & XML sitemap visibility
  - "Indexability": meta robots/noindex & canonicalization
  - "Security": HTTPS & HTTP security headers
  - "Mobile": mobile-friendliness & responsive viewport
  - "Core Web Vitals": LCP, INP, and CLS risk factors
  - "Performance": page speed & image optimization (WebP/AVIF, lazy loading)
  - "Structured Data": JSON-LD schema markup coverage
  - "Redirects & Links": redirect chains & broken link observations
  - "International": hreflang & regional targeting
  - "Accessibility": semantic HTML, landmarks, contrast & ARIA basics
  - "Rendering": JavaScript rendering & hydration crawlability concerns

- aiSearchOptimization (GEO / AEO):
  - Readiness for Google AI Overviews, ChatGPT, Perplexity, Gemini, and Copilot.
  - Cover answer-first content formatting, FAQ & HowTo schema, Organization/Person/Product entity clarity, topical authority, citation-worthiness (original stats, quotes, benchmarks), author/brand signals, conversational & long-tail query coverage, AI crawler access (GPTBot, Google-Extended, PerplexityBot, ClaudeBot), and provide a clean, copy-ready llms.txt suggestion plus 3-4 sample FAQ items.

- priorityFixes: Provide the Top 5 Priority Fixes sorted by impact (highest impact first).
- roadmap: Provide actionable 30-day, 60-day, and 90-day items.`;

function clampScore(n: unknown): number {
  const num = Number(n);
  if (!Number.isFinite(num)) return 50;
  return Math.max(0, Math.min(100, Math.round(num)));
}

function normalizeStatus(s: unknown): 'Critical' | 'Warning' | 'Pass' | 'Info' {
  const val = String(s || '').trim().toLowerCase();
  if (val === 'critical' || val === 'fail' || val === 'error') return 'Critical';
  if (val === 'warning' || val === 'warn') return 'Warning';
  if (val === 'pass' || val === 'ok' || val === 'good') return 'Pass';
  return 'Info';
}

function normalizeLevel(l: unknown): 'High' | 'Medium' | 'Low' {
  const val = String(l || '').trim().toLowerCase();
  if (val === 'high') return 'High';
  if (val === 'low') return 'Low';
  return 'Medium';
}

function parseJsonSafely(text: string | undefined): Record<string, unknown> | null {
  if (!text) return null;
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  try {
    const parsed = JSON.parse(cleaned);
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null;
  } catch {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        const sliced = cleaned.slice(firstBrace, lastBrace + 1);
        const parsed = JSON.parse(sliced);
        return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null;
      } catch {
        return null;
      }
    }
    return null;
  }
}

function validateAndNormalizeAudit(
  raw: Record<string, unknown> | null,
  targetUrl: string,
  targetCountry: string,
  competitorUrl?: string,
  groundingSources?: { title: string; uri: string }[]
): AuditReport | null {
  if (!raw) return null;

  const scoresRaw = raw.scores as Record<string, unknown> | undefined;
  if (!scoresRaw || typeof raw.executiveSummary !== 'string' || !Array.isArray(raw.seoAudit) || !Array.isArray(raw.technicalChecklist)) {
    return null;
  }

  const contentRecs = (raw.contentRecommendations || {}) as Record<string, unknown>;
  const keywordsRaw = (raw.keywordSuggestions || {}) as Record<string, unknown>;
  const aiSearchRaw = (raw.aiSearchOptimization || {}) as Record<string, unknown>;
  const roadmapRaw = (raw.roadmap || {}) as Record<string, unknown>;

  const ensureStringArray = (val: unknown): string[] =>
    Array.isArray(val) ? val.map((item) => String(item)).filter(Boolean) : [];

  const normalizedPriorityFixes = Array.isArray(raw.priorityFixes)
    ? raw.priorityFixes.slice(0, 5).map((f) => {
        const item = f as Record<string, unknown>;
        return {
          title: String(item.title || 'Priority Action'),
          impact: normalizeLevel(item.impact),
          effort: normalizeLevel(item.effort),
          description: String(item.description || ''),
        };
      })
    : [];

  const impactRank: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
  normalizedPriorityFixes.sort((a, b) => (impactRank[a.impact] ?? 1) - (impactRank[b.impact] ?? 1));

  return {
    id: crypto.randomUUID(),
    url: targetUrl,
    auditDate: new Date().toISOString(),
    targetCountry: targetCountry || 'Global',
    ...(competitorUrl ? { competitorUrl } : {}),
    businessSummary: String(raw.businessSummary || 'Website summary not verifiable from public content.'),
    scores: {
      overall: clampScore(scoresRaw.overall),
      seo: clampScore(scoresRaw.seo),
      content: clampScore(scoresRaw.content),
      keywords: clampScore(scoresRaw.keywords),
      technical: clampScore(scoresRaw.technical),
      aiSearch: clampScore(scoresRaw.aiSearch),
    },
    executiveSummary: String(raw.executiveSummary),
    strengths: ensureStringArray(raw.strengths),
    weaknesses: ensureStringArray(raw.weaknesses),
    priorityFixes: normalizedPriorityFixes,
    seoAudit: (raw.seoAudit as Record<string, unknown>[]).map((s) => ({
      item: String(s.item || 'SEO Check'),
      status: normalizeStatus(s.status),
      finding: String(s.finding || 'Not verifiable'),
      recommendation: String(s.recommendation || ''),
      whyItMatters: String(s.whyItMatters || 'Impacts organic search relevance and visibility.'),
      effort: normalizeLevel(s.effort),
    })),
    contentRecommendations: {
      contentGaps: ensureStringArray(contentRecs.contentGaps),
      topicClusters: Array.isArray(contentRecs.topicClusters)
        ? contentRecs.topicClusters.map((tc) => {
            const c = tc as Record<string, unknown>;
            return {
              pillar: String(c.pillar || 'Core Topic'),
              subtopics: ensureStringArray(c.subtopics),
            };
          })
        : [],
      blogIdeas: Array.isArray(contentRecs.blogIdeas)
        ? contentRecs.blogIdeas.map((b) => {
            const idea = b as Record<string, unknown>;
            return {
              title: String(idea.title || 'Editorial Guide'),
              targetKeyword: String(idea.targetKeyword || ''),
              intent: String(idea.intent || 'Informational'),
              outline: ensureStringArray(idea.outline),
            };
          })
        : [],
      pageImprovements: Array.isArray(contentRecs.pageImprovements)
        ? contentRecs.pageImprovements.map((p) => {
            const page = p as Record<string, unknown>;
            return {
              pageOrSection: String(page.pageOrSection || 'Homepage'),
              issue: String(page.issue || ''),
              suggestion: String(page.suggestion || ''),
            };
          })
        : [],
      ctaAndConversionTips: ensureStringArray(contentRecs.ctaAndConversionTips),
    },
    keywordSuggestions: {
      primary: Array.isArray(keywordsRaw.primary)
        ? keywordsRaw.primary.map((k) => {
            const kw = k as Record<string, unknown>;
            return {
              keyword: String(kw.keyword || ''),
              intent: String(kw.intent || 'Commercial'),
              estimatedDifficulty: String(kw.estimatedDifficulty || 'Medium'),
              estimatedVolumeTier: String(kw.estimatedVolumeTier || 'Medium'),
              opportunity: String(kw.opportunity || ''),
            };
          })
        : [],
      longTail: Array.isArray(keywordsRaw.longTail)
        ? keywordsRaw.longTail.map((k) => {
            const kw = k as Record<string, unknown>;
            return {
              keyword: String(kw.keyword || ''),
              intent: String(kw.intent || 'Informational'),
              estimatedDifficulty: String(kw.estimatedDifficulty || 'Low'),
              estimatedVolumeTier: String(kw.estimatedVolumeTier || 'Low'),
              opportunity: String(kw.opportunity || ''),
            };
          })
        : [],
      questionKeywords: ensureStringArray(keywordsRaw.questionKeywords),
      competitorGapKeywords: ensureStringArray(keywordsRaw.competitorGapKeywords),
    },
    technicalChecklist: (raw.technicalChecklist as Record<string, unknown>[]).map((t) => ({
      category: String(t.category || 'General'),
      check: String(t.check || 'Technical Check'),
      status: normalizeStatus(t.status),
      detail: String(t.detail || 'Not verifiable'),
      fix: String(t.fix || ''),
      whyItMatters: String(t.whyItMatters || 'Affects crawlability, indexing, or user experience.'),
      effort: normalizeLevel(t.effort),
    })),
    aiSearchOptimization: {
      readinessSummary: String(aiSearchRaw.readinessSummary || 'AI-search readiness assessment completed.'),
      recommendations: Array.isArray(aiSearchRaw.recommendations)
        ? aiSearchRaw.recommendations.map((r) => {
            const rec = r as Record<string, unknown>;
            return {
              title: String(rec.title || 'GEO Recommendation'),
              description: String(rec.description || ''),
              priority: normalizeLevel(rec.priority),
            };
          })
        : [],
      structuredDataSuggestions: ensureStringArray(aiSearchRaw.structuredDataSuggestions),
      entityAndBrandSignals: ensureStringArray(aiSearchRaw.entityAndBrandSignals),
      llmsTxtSuggestion: String(aiSearchRaw.llmsTxtSuggestion || ''),
      sampleFAQ: Array.isArray(aiSearchRaw.sampleFAQ)
        ? aiSearchRaw.sampleFAQ.map((faq) => {
            const f = faq as Record<string, unknown>;
            return {
              question: String(f.question || ''),
              answer: String(f.answer || ''),
            };
          })
        : [],
    },
    roadmap: {
      days30: ensureStringArray(roadmapRaw.days30),
      days60: ensureStringArray(roadmapRaw.days60),
      days90: ensureStringArray(roadmapRaw.days90),
    },
    ...(groundingSources && groundingSources.length > 0 ? { groundingSources } : {}),
  };
}

function extractGroundingSources(response: unknown): { title: string; uri: string }[] {
  const res = response as {
    candidates?: Array<{
      groundingMetadata?: {
        groundingChunks?: Array<{
          web?: { uri?: string; title?: string };
        }>;
      };
    }>;
  };
  const chunks = res?.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const seen = new Set<string>();
  const sources: { title: string; uri: string }[] = [];
  for (const chunk of chunks) {
    const uri = chunk?.web?.uri;
    const title = chunk?.web?.title || uri;
    if (uri && title && !seen.has(uri)) {
      seen.add(uri);
      sources.push({ title, uri });
    }
  }
  return sources.slice(0, 12);
}

function extractUrlRetrievalStatus(response: unknown): string | null {
  const res = response as {
    candidates?: Array<{
      urlContextMetadata?: {
        urlMetadata?: Array<{
          retrievedUrl?: string;
          urlRetrievalStatus?: string;
        }>;
      };
    }>;
  };
  const metas = res?.candidates?.[0]?.urlContextMetadata?.urlMetadata;
  if (!metas || metas.length === 0) return null;
  return metas[0]?.urlRetrievalStatus || null;
}

function classifyGeminiError(err: unknown): { status: number; code: string; message: string; detail?: string } {
  const e = err as { status?: number; statusCode?: number; errorCode?: string; message?: string };
  const msg = String(e?.message || 'An unexpected error occurred while running the audit.');
  const lower = msg.toLowerCase();

  if (e?.errorCode === 'API_KEY_ERROR' || lower.includes('api_key_invalid') || lower.includes('permission_denied') || e?.status === 403) {
    return {
      status: 403,
      code: 'API_KEY_ERROR',
      message: 'The Gemini API key is missing or unauthorized. Please verify GEMINI_API_KEY in Settings > Secrets.',
      detail: msg,
    };
  }
  if (e?.status === 429 || lower.includes('resource_exhausted') || lower.includes('rate limit') || lower.includes('quota')) {
    return {
      status: 429,
      code: 'RATE_LIMIT',
      message: 'Rate limit reached for the AI audit service. Please wait a moment and try again.',
      detail: msg,
    };
  }
  if (lower.includes('unreachable') || lower.includes('could not access') || lower.includes('dns') || lower.includes('enotfound')) {
    return {
      status: 422,
      code: 'UNREACHABLE',
      message: 'The target website could not be reached or blocked automated inspection. Verify the URL is live and publicly accessible.',
      detail: msg,
    };
  }
  return {
    status: e?.statusCode || 500,
    code: 'API_ERROR',
    message: 'Unable to complete the audit right now. Please try again.',
    detail: msg,
  };
}

async function runStructuredGroundedAudit(
  ai: GoogleGenAI,
  targetUrl: string,
  targetCountry: string,
  competitorUrl: string | undefined,
  emitStage: (stage: string, message: string) => void
) {
  const today = new Date().toISOString().split('T')[0];
  const auditPrompt = `Perform a comprehensive Digital Marketing, SEO, Technical, Content, Keyword, and AI-Search Readiness (GEO/AEO) audit of:
Target URL: ${targetUrl}
Target Country / Market: ${targetCountry || 'Global'}
${competitorUrl ? `Primary Competitor URL for context: ${competitorUrl}` : ''}
Audit Date: ${today}

Use the URL Context tool to read the live target page (and competitor page if provided), and use Google Search grounding to inspect indexed presence, brand/entity visibility, E-E-A-T signals, AI-search citation readiness, and search landscape in ${targetCountry || 'Global'}.

Return ONLY valid JSON matching the exact schema. Mark any item you cannot directly verify from the live page or search grounding as "Not verifiable" instead of fabricating numbers.`;

  let groundingSources: { title: string; uri: string }[] = [];
  let rawParsed: Record<string, unknown> | null = null;

  // Attempt 1: Single-pass grounded + structured output on gemini-2.5-pro
  // Fallback if API disallows combining tools + responseSchema in one request:
  // Stage A (grounded URL Context + Search) -> Stage B (structured JSON synthesis).
  const executeSingleOrTwoStage = async () => {
    emitStage('reading', `Reading live page content for ${targetUrl}...`);
    try {
      const response = await ai.models.generateContent({
        model: MODEL_AUDIT,
        contents: auditPrompt,
        config: {
          systemInstruction: AUDIT_SYSTEM_INSTRUCTION,
          tools: [{ urlContext: {} }, { googleSearch: {} }],
          responseMimeType: 'application/json',
          responseSchema: auditResponseSchema,
        },
      });

      const retrievalStatus = extractUrlRetrievalStatus(response);
      if (retrievalStatus && retrievalStatus.includes('ERROR') && !response.text) {
        throw Object.assign(new Error(`Target URL retrieval failed (${retrievalStatus}).`), {
          errorCode: 'UNREACHABLE',
          statusCode: 422,
        });
      }

      groundingSources = extractGroundingSources(response);
      emitStage('building', 'Validating structured audit data...');
      return parseJsonSafely(response.text);
    } catch (err) {
      const msg = String((err as Error)?.message || '').toLowerCase();
      const isCombinedToolSchemaUnsupported =
        msg.includes('controlled generation') ||
        msg.includes('response_mime_type') ||
        msg.includes('response_schema') ||
        msg.includes('tool use with') ||
        msg.includes('invalid_argument') ||
        (err as { status?: number })?.status === 400;

      if (!isCombinedToolSchemaUnsupported) {
        throw err;
      }

      // Two-stage grounded pipeline:
      // Stage A: Gather live URL context + Google Search grounding dossier with gemini-2.5-pro
      emitStage('seo', 'Gathering live URL context & Google Search grounding signals...');
      const researchResponse = await ai.models.generateContent({
        model: MODEL_AUDIT,
        contents: `Inspect ${targetUrl} using URL Context and search signals for market "${targetCountry || 'Global'}"${
          competitorUrl ? ` (with competitor context ${competitorUrl})` : ''
        }. Document EVERY observable detail accurately for:
1. Business & value proposition summary
2. On-page SEO: title tag, meta description, H1-H3 structure, URL structure, internal links, image alt text, canonical tags, content depth, E-E-A-T, local SEO, search visibility/backlink signals
3. Technical signals: robots.txt, XML sitemap, noindex/canonicals, HTTPS/security headers, mobile viewport, Core Web Vitals risks (LCP/INP/CLS), image optimization, JSON-LD schema, redirects, hreflang, accessibility, JS rendering
4. Content gaps, topic clusters, blog opportunities, page & CTA improvements
5. Keyword landscape (primary, long-tail, questions, competitor gaps)
6. AI-Search / GEO readiness (Google AI Overviews, ChatGPT, Perplexity, Gemini, Copilot, llms.txt, AI crawler bots)
Explicitly label anything not directly observable as "Not verifiable".`,
        config: {
          systemInstruction: AUDIT_SYSTEM_INSTRUCTION,
          tools: [{ urlContext: {} }, { googleSearch: {} }],
        },
      });

      const retrievalStatus = extractUrlRetrievalStatus(researchResponse);
      const dossier = researchResponse.text || '';
      if (retrievalStatus && retrievalStatus.includes('ERROR') && dossier.length < 120) {
        throw Object.assign(new Error(`Unable to retrieve content from ${targetUrl} (${retrievalStatus}).`), {
          errorCode: 'UNREACHABLE',
          statusCode: 422,
        });
      }

      groundingSources = extractGroundingSources(researchResponse);
      emitStage('building', 'Synthesizing structured audit report...');

      // Stage B: Convert grounded evidence dossier into strict structured JSON
      const structuredResponse = await ai.models.generateContent({
        model: MODEL_AUDIT,
        contents: `Convert the following verified audit dossier for ${targetUrl} (Target Country: ${
          targetCountry || 'Global'
        }, Date: ${today}) into the exact required JSON audit report. Preserve all "Not verifiable" markings faithfully and never fabricate unverified metrics.\n\nDOSSIER:\n${dossier}`,
        config: {
          systemInstruction: AUDIT_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: auditResponseSchema,
        },
      });

      return parseJsonSafely(structuredResponse.text);
    }
  };

  rawParsed = await executeSingleOrTwoStage();
  let validated = validateAndNormalizeAudit(rawParsed, targetUrl, targetCountry, competitorUrl, groundingSources);

  // Retry once on malformed JSON or incomplete schema validation (per Section 1)
  if (!validated) {
    emitStage('building', 'Re-validating audit schema structure...');
    rawParsed = await executeSingleOrTwoStage();
    validated = validateAndNormalizeAudit(rawParsed, targetUrl, targetCountry, competitorUrl, groundingSources);
  }

  if (!validated) {
    throw new Error('The AI audit returned an incomplete structure after retry. Please try again.');
  }

  return validated;
}

async function runCompetitorBenchmark(
  ai: GoogleGenAI,
  primaryUrl: string,
  competitorUrl: string,
  targetCountry: string
) {
  const prompt = `Compare competitor ${competitorUrl} against ${primaryUrl} for market "${targetCountry || 'Global'}".
Use URL Context and Google Search grounding to inspect ${competitorUrl} and score it across overall, seo, content, keywords, technical, and aiSearch (0-100).
Identify keyGaps (where ${primaryUrl} lags behind ${competitorUrl}) and competitorAdvantages (strengths observed on ${competitorUrl}). Only report observable signals.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_LIGHT,
      contents: prompt,
      config: {
        tools: [{ urlContext: {} }, { googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: competitorResponseSchema,
      },
    });
    const parsed = parseJsonSafely(response.text);
    if (parsed && parsed.scores) {
      const s = parsed.scores as Record<string, unknown>;
      return {
        competitorUrl,
        summary: String(parsed.summary || ''),
        scores: {
          overall: clampScore(s.overall),
          seo: clampScore(s.seo),
          content: clampScore(s.content),
          keywords: clampScore(s.keywords),
          technical: clampScore(s.technical),
          aiSearch: clampScore(s.aiSearch),
        },
        keyGaps: Array.isArray(parsed.keyGaps) ? parsed.keyGaps.map(String) : [],
        competitorAdvantages: Array.isArray(parsed.competitorAdvantages) ? parsed.competitorAdvantages.map(String) : [],
      };
    }
  } catch {
    // Fallback two-step with gemini-2.5-flash if combined tools+schema is rejected
    try {
      const research = await ai.models.generateContent({
        model: MODEL_LIGHT,
        contents: prompt,
        config: {
          tools: [{ urlContext: {} }, { googleSearch: {} }],
        },
      });
      const structured = await ai.models.generateContent({
        model: MODEL_LIGHT,
        contents: `Format this competitor comparison into JSON:\n\n${research.text || ''}`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: competitorResponseSchema,
        },
      });
      const parsed = parseJsonSafely(structured.text);
      if (parsed && parsed.scores) {
        const s = parsed.scores as Record<string, unknown>;
        return {
          competitorUrl,
          summary: String(parsed.summary || ''),
          scores: {
            overall: clampScore(s.overall),
            seo: clampScore(s.seo),
            content: clampScore(s.content),
            keywords: clampScore(s.keywords),
            technical: clampScore(s.technical),
            aiSearch: clampScore(s.aiSearch),
          },
          keyGaps: Array.isArray(parsed.keyGaps) ? parsed.keyGaps.map(String) : [],
          competitorAdvantages: Array.isArray(parsed.competitorAdvantages) ? parsed.competitorAdvantages.map(String) : [],
        };
      }
    } catch {
      return undefined;
    }
  }
  return undefined;
}

async function createAppServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/audit', async (req, res) => {
    const wantsStream = req.headers.accept?.includes('text/event-stream');
    const body = (req.body || {}) as { url?: string; targetCountry?: string; competitorUrl?: string };

    const primaryCheck = normalizeAndValidateUrl(body.url || '');
    if (!primaryCheck.ok) {
      res.status(400).json({ code: 'INVALID_URL', message: primaryCheck.message });
      return;
    }

    let normalizedCompetitor: string | undefined;
    if (body.competitorUrl && body.competitorUrl.trim()) {
      const compCheck = normalizeAndValidateUrl(body.competitorUrl);
      if (!compCheck.ok) {
        res.status(400).json({ code: 'INVALID_URL', message: `Competitor URL error: ${compCheck.message}` });
        return;
      }
      normalizedCompetitor = compCheck.url;
    }

    const targetCountry = (body.targetCountry || 'Global').trim();

    if (wantsStream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders?.();
    }

    const sendEvent = (event: string, data: unknown) => {
      if (wantsStream && !res.writableEnded) {
        res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
      }
    };

    // Progressive visual stage timer so the 6-stage stepper reflects ongoing deep analysis smoothly
    const stageQueue: Array<{ stage: string; message: string; delayMs: number }> = [
      { stage: 'seo', message: 'Analyzing on-page SEO, headings, metadata & E-E-A-T...', delayMs: 3500 },
      { stage: 'technical', message: 'Checking technical signals, crawlability & Core Web Vitals risks...', delayMs: 7500 },
      { stage: 'keywords', message: 'Researching keyword gaps & search intent opportunities...', delayMs: 12000 },
      { stage: 'aiSearch', message: 'Evaluating AI-search & GEO readiness across answer engines...', delayMs: 17000 },
    ];
    const timers: ReturnType<typeof setTimeout>[] = [];
    if (wantsStream) {
      for (const item of stageQueue) {
        timers.push(
          setTimeout(() => {
            sendEvent('progress', { stage: item.stage, message: item.message });
          }, item.delayMs)
        );
      }
    }

    try {
      const ai = getGenAIClient();
      const auditResult = await runStructuredGroundedAudit(
        ai,
        primaryCheck.url,
        targetCountry,
        normalizedCompetitor,
        (stage, message) => sendEvent('progress', { stage, message })
      );

      for (const t of timers) clearTimeout(t);

      if (normalizedCompetitor) {
        sendEvent('progress', {
          stage: 'building',
          message: `Benchmarking against competitor ${normalizedCompetitor}...`,
        });
        const comparison = await runCompetitorBenchmark(ai, primaryCheck.url, normalizedCompetitor, targetCountry);
        if (comparison) {
          auditResult.competitorComparison = comparison;
        }
      }

      if (wantsStream) {
        sendEvent('complete', auditResult);
        res.end();
      } else {
        res.json(auditResult);
      }
    } catch (err) {
      for (const t of timers) clearTimeout(t);
      const classified = classifyGeminiError(err);
      if (wantsStream) {
        sendEvent('error', classified);
        res.end();
      } else {
        res.status(classified.status).json(classified);
      }
    }
  });

  // Lighter task powered by gemini-2.5-flash: generate tailored implementation snippet for a finding
  app.post('/api/audit/snippet', async (req, res) => {
    try {
      const { url, topic, context } = (req.body || {}) as { url?: string; topic?: string; context?: string };
      if (!topic) {
        res.status(400).json({ code: 'INVALID_REQUEST', message: 'Topic is required.' });
        return;
      }
      const ai = getGenAIClient();
      const response = await ai.models.generateContent({
        model: MODEL_LIGHT,
        contents: `Create a concise, copy-ready implementation brief and code/copy snippet (e.g. HTML meta tags, JSON-LD schema, or llms.txt/copy improvement) for website ${
          url || 'the audited site'
        } addressing this issue: "${topic}". Context: "${context || ''}". Keep it practical and concise (under 220 words).`,
      });
      res.json({ snippet: response.text || '' });
    } catch (err) {
      const classified = classifyGeminiError(err);
      res.status(classified.status).json(classified);
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Digital Automation Pulse server listening on port ${PORT}`);
  });
}

createAppServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
