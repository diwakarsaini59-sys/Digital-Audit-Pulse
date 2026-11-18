/**
 * Core TypeScript interfaces for Digital Automation Pulse.
 * Strictly aligned with the Section 4 structured audit JSON schema.
 */

export type ImpactLevel = 'High' | 'Medium' | 'Low';
export type EffortLevel = 'High' | 'Medium' | 'Low';
export type IssueStatus = 'Critical' | 'Warning' | 'Pass' | 'Info';

export interface AuditScores {
  overall: number;
  seo: number;
  content: number;
  keywords: number;
  technical: number;
  aiSearch: number;
}

export interface PriorityFix {
  title: string;
  impact: ImpactLevel;
  effort: EffortLevel;
  description: string;
}

export interface SeoAuditItem {
  item: string;
  status: IssueStatus;
  finding: string;
  recommendation: string;
  whyItMatters?: string;
  effort?: EffortLevel;
}

export interface TopicCluster {
  pillar: string;
  subtopics: string[];
}

export interface BlogIdea {
  title: string;
  targetKeyword: string;
  intent: string;
  outline: string[];
}

export interface PageImprovement {
  pageOrSection: string;
  issue: string;
  suggestion: string;
}

export interface ContentRecommendations {
  contentGaps: string[];
  topicClusters: TopicCluster[];
  blogIdeas: BlogIdea[];
  pageImprovements: PageImprovement[];
  ctaAndConversionTips: string[];
}

export interface KeywordSuggestion {
  keyword: string;
  intent: string;
  estimatedDifficulty: string;
  estimatedVolumeTier: string;
  opportunity: string;
}

export interface KeywordSuggestions {
  primary: KeywordSuggestion[];
  longTail: KeywordSuggestion[];
  questionKeywords: string[];
  competitorGapKeywords: string[];
}

export interface TechnicalChecklistItem {
  category: string;
  check: string;
  status: IssueStatus;
  detail: string;
  fix: string;
  whyItMatters?: string;
  effort?: EffortLevel;
}

export interface AiSearchRecommendation {
  title: string;
  description: string;
  priority: ImpactLevel;
}

export interface SampleFaqItem {
  question: string;
  answer: string;
}

export interface AiSearchOptimization {
  readinessSummary: string;
  recommendations: AiSearchRecommendation[];
  structuredDataSuggestions: string[];
  entityAndBrandSignals: string[];
  llmsTxtSuggestion: string;
  sampleFAQ: SampleFaqItem[];
}

export interface AuditRoadmap {
  days30: string[];
  days60: string[];
  days90: string[];
}

export interface CompetitorComparison {
  competitorUrl: string;
  summary: string;
  scores: AuditScores;
  keyGaps: string[];
  competitorAdvantages: string[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AuditReport {
  id: string;
  url: string;
  auditDate: string;
  targetCountry: string;
  competitorUrl?: string;
  businessSummary: string;
  scores: AuditScores;
  executiveSummary: string;
  strengths: string[];
  weaknesses: string[];
  priorityFixes: PriorityFix[];
  seoAudit: SeoAuditItem[];
  contentRecommendations: ContentRecommendations;
  keywordSuggestions: KeywordSuggestions;
  technicalChecklist: TechnicalChecklistItem[];
  aiSearchOptimization: AiSearchOptimization;
  roadmap: AuditRoadmap;
  competitorComparison?: CompetitorComparison;
  groundingSources?: GroundingSource[];
  isDemo?: boolean;
}

export interface AuditRequestParams {
  url: string;
  targetCountry: string;
  competitorUrl?: string;
}

export type AuditStageId =
  | 'reading'
  | 'seo'
  | 'technical'
  | 'keywords'
  | 'aiSearch'
  | 'building';

export interface AuditProgressEvent {
  stage: AuditStageId;
  message: string;
}

export type AuditErrorCode =
  | 'INVALID_URL'
  | 'UNREACHABLE'
  | 'RATE_LIMIT'
  | 'API_KEY_ERROR'
  | 'API_ERROR';

export interface AuditApiError {
  code: AuditErrorCode;
  message: string;
  detail?: string;
}
