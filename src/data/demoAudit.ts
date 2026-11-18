import type { AuditReport } from '../types/audit';

export const DEMO_AUDIT_REPORT: AuditReport = {
  id: 'demo-audit-northstar-2026',
  url: 'https://northstarworkflow.io/',
  auditDate: '2026-11-16T09:30:00.000Z',
  targetCountry: 'United States',
  competitorUrl: 'https://zapier.com/',
  businessSummary:
    'Northstar Workflow is a B2B SaaS operations automation platform helping mid-market finance and RevOps teams connect ERP, CRM, and billing pipelines with low-code audit trails.',
  scores: {
    overall: 74,
    seo: 78,
    content: 71,
    keywords: 66,
    technical: 82,
    aiSearch: 64,
  },
  executiveSummary:
    'Northstar Workflow demonstrates solid technical foundations (clean HTTPS delivery, responsive layout, and strong core product positioning) but leaves substantial organic and AI-search growth on the table. Critical opportunities include adding structured JSON-LD schema (Organization, SoftwareApplication, FAQPage), expanding high-intent comparison and integration landing pages, publishing an llms.txt file for answer engines, and improving E-E-A-T authorship across technical guides.',
  strengths: [
    'Clear above-the-fold value proposition and primary product CTA visible without scrolling.',
    'Clean semantic URL slugs on core product pages (/platform, /integrations, /security).',
    'Strong HTTPS security baseline and fast static asset delivery on landing views.',
    'Clear SOC 2 Type II and GDPR trust messaging supporting buyer conversion.',
  ],
  weaknesses: [
    'Missing SoftwareApplication, FAQPage, and Organization JSON-LD schema markup.',
    'Thin integration pages lack use-case depth, internal cross-links, and answer-first summaries.',
    'Blog articles lack named author bios, reviewer credentials, and original benchmark data for E-E-A-T and AI citations.',
    'No llms.txt specification or explicit AI-crawler guidance observed.',
  ],
  priorityFixes: [
    {
      title: 'Deploy Organization, SoftwareApplication & FAQPage JSON-LD Schema',
      impact: 'High',
      effort: 'Low',
      description:
        'Add validated structured data on the homepage, pricing, and top integration pages to clarify entity identity for Google Search and AI Overviews.',
    },
    {
      title: 'Build Programmatic Integration & Comparison Landing Pages',
      impact: 'High',
      effort: 'Medium',
      description:
        'Create dedicated pages for high-intent queries like "NetSuite to Salesforce sync" and "Northstar vs Workato" with setup steps and ROI benchmarks.',
    },
    {
      title: 'Restructure Key Guides with Answer-First GEO Blocks & Author E-E-A-T',
      impact: 'High',
      effort: 'Low',
      description:
        'Add 40–60 word direct summary definitions, scannable comparison tables, and verified RevOps author profiles to boost ChatGPT, Perplexity, and AI Overview citations.',
    },
    {
      title: 'Eliminate Duplicate H1 Tags & Optimize Meta Descriptions Across Product Pages',
      impact: 'Medium',
      effort: 'Low',
      description:
        'Ensure every page has a single descriptive H1 and unique 145–155 character meta descriptions tailored to commercial search intent.',
    },
    {
      title: 'Publish /llms.txt & Audit Core Web Vitals Hero Media Payload',
      impact: 'Medium',
      effort: 'Low',
      description:
        'Provide a curated llms.txt index of canonical documentation and compress oversized hero PNG/GIF product previews into AVIF/WebP with explicit dimensions.',
    },
  ],
  seoAudit: [
    {
      item: 'Title Tags & SERP Snippets',
      status: 'Warning',
      finding: 'Homepage title is concise and branded, but several secondary product pages reuse generic title suffixes without target keywords.',
      recommendation: 'Rewrite secondary titles to follow "[Primary Capability] for [Audience] | Northstar Workflow" under 60 characters.',
      whyItMatters: 'Title tags remain one of the strongest on-page relevancy signals and directly influence organic click-through rate.',
      effort: 'Low',
    },
    {
      item: 'Meta Descriptions',
      status: 'Warning',
      finding: 'Two core integration pages appear to rely on auto-generated snippets rather than curated meta descriptions.',
      recommendation: 'Write unique 140–155 character descriptions highlighting supported ERPs, audit logging, and SOC 2 compliance.',
      whyItMatters: 'Compelling meta descriptions improve SERP CTR and prevent search engines from pulling awkward navigation text.',
      effort: 'Low',
    },
    {
      item: 'Heading Structure (H1–H3)',
      status: 'Warning',
      finding: 'Homepage uses an expressive hero H1, while one feature section falls back to styled div elements instead of H2/H3 hierarchy.',
      recommendation: 'Enforce strict single-H1 per URL and sequential H2/H3 tags reflecting topical sub-sections.',
      whyItMatters: 'Clear heading hierarchy helps crawlers, screen readers, and LLM parsers extract section-level meaning accurately.',
      effort: 'Low',
    },
    {
      item: 'URL Structure & Slugs',
      status: 'Pass',
      finding: 'Observed URLs use clean lowercase hyphenated paths (/platform, /pricing, /customers) without query clutter.',
      recommendation: 'Maintain the current taxonomy as new integration and comparison clusters are launched.',
      whyItMatters: 'Readable URLs improve user trust in SERPs and keep crawl budgets focused on canonical paths.',
      effort: 'Low',
    },
    {
      item: 'Internal Linking Architecture',
      status: 'Warning',
      finding: 'Top-level navigation links are solid, but blog posts rarely link contextually to commercial solution pages.',
      recommendation: 'Add 3–4 contextual internal links from high-traffic informational guides to /integrations and /demo with descriptive anchor text.',
      whyItMatters: 'Contextual internal links distribute authority to revenue pages and clarify topical relationships.',
      effort: 'Medium',
    },
    {
      item: 'Image Alt Text & Media Semantics',
      status: 'Critical',
      finding: 'Several UI workflow screenshots on the homepage lack descriptive alt attributes describing the workflow depicted.',
      recommendation: 'Add concise, descriptive alt text (e.g., "Automated NetSuite invoice reconciliation flow in Northstar") to every product image.',
      whyItMatters: 'Alt attributes are essential for WCAG accessibility and visual search indexing.',
      effort: 'Low',
    },
    {
      item: 'Canonical Tags & Duplicate Control',
      status: 'Pass',
      finding: 'Self-referencing canonical link observed cleanly on the primary landing page.',
      recommendation: 'Verify UTM parameter URLs continue resolving to clean canonicals across marketing campaigns.',
      whyItMatters: 'Prevents link equity dilution when paid or social UTM parameters are indexed.',
      effort: 'Low',
    },
    {
      item: 'Content Depth & Search Intent Alignment',
      status: 'Warning',
      finding: 'Homepage messaging is crisp for brand visitors, but lacks mid-funnel technical depth for evaluators comparing enterprise workflow tools.',
      recommendation: 'Expand solution pages with architecture diagrams, SLA details, and role-specific workflows (Finance vs RevOps).',
      whyItMatters: 'Mid-funnel B2B buyers need concrete proof and specifications before booking a demo.',
      effort: 'Medium',
    },
    {
      item: 'E-E-A-T Signals (Expertise & Trust)',
      status: 'Warning',
      finding: 'Security trust badges are visible, yet editorial content lacks named subject-matter authors, bios, and methodology citations.',
      recommendation: 'Attach named author cards with LinkedIn links, engineering/finance credentials, and last-updated dates to all guides.',
      whyItMatters: 'Strong E-E-A-T signals improve rankings in competitive B2B categories and increase citation trust in AI search.',
      effort: 'Low',
    },
    {
      item: 'Local SEO Signals',
      status: 'Info',
      finding: 'Not verifiable / Not primary focus — business operates as a national/global B2B SaaS platform without physical retail locations.',
      recommendation: 'If pursuing regional enterprise trust, add headquarters city/address in Organization schema and footer.',
      whyItMatters: 'Even SaaS brands benefit from verified corporate entity location signals for brand Knowledge Graph accuracy.',
      effort: 'Low',
    },
    {
      item: 'Backlink & Domain Authority Observations',
      status: 'Info',
      finding: 'Not verifiable in full without third-party link index; public search grounding shows limited third-party review directory presence (G2/Capterra) compared to category leaders.',
      recommendation: 'Launch a customer review drive on G2 and publish original annual "State of RevOps Automation" benchmark data to earn editorial backlinks.',
      whyItMatters: 'Third-party citations and authoritative backlinks drive both traditional domain authority and LLM brand consensus.',
      effort: 'High',
    },
  ],
  contentRecommendations: {
    contentGaps: [
      'Side-by-side comparison hubs ("Northstar vs Workato", "Northstar vs Zapier for Enterprise Finance").',
      'Connector-specific integration blueprints with field-mapping examples (NetSuite, Stripe, Salesforce, Snowflake).',
      'Original quantitative benchmarks on workflow error reduction and close-cycle time savings.',
      'Dedicated Security & Compliance FAQ page covering SOC 2, HIPAA, data residency, and RBAC.',
    ],
    topicClusters: [
      {
        pillar: 'Enterprise Revenue & Finance Automation',
        subtopics: [
          'Quote-to-cash automation architecture',
          'Automated ASC 606 revenue recognition workflows',
          'ERP-to-CRM reconciliation best practices',
          'Audit-ready financial workflow logging',
        ],
      },
      {
        pillar: 'Low-Code Integration Governance & Security',
        subtopics: [
          'Managing API rate limits in multi-system syncs',
          'Role-based access control for RevOps teams',
          'SOC 2 compliance checklist for automation tools',
          'Error handling and dead-letter queues in SaaS pipelines',
        ],
      },
    ],
    blogIdeas: [
      {
        title: 'Quote-to-Cash Automation: Blueprint for Connecting Salesforce, Stripe, and NetSuite',
        targetKeyword: 'quote to cash automation netsuite salesforce',
        intent: 'Commercial Investigation',
        outline: [
          '45-word executive answer: what quote-to-cash automation solves',
          'Common manual handoff failure points between CRM and ERP',
          'Reference architecture & field mapping table',
          'Audit logging and exception-handling checklist',
        ],
      },
      {
        title: 'Zapier vs Enterprise iPaaS: When RevOps Teams Outgrow Basic Triggers',
        targetKeyword: 'enterprise zapier alternative for revops',
        intent: 'Commercial / Comparison',
        outline: [
          'Direct comparison matrix (governance, retries, RBAC, SOC 2)',
          'Cost and maintenance inflection points at 50k+ monthly tasks',
          'Migration checklist without breaking live billing syncs',
        ],
      },
      {
        title: 'How to Build Audit-Ready Financial Workflows Without Custom Microservices',
        targetKeyword: 'audit ready financial workflow automation',
        intent: 'Informational / Mid-Funnel',
        outline: [
          'What external auditors verify in automated billing pipelines',
          'Immutable execution logs and approval gates',
          'Sample JSON payload traceability walkthrough',
        ],
      },
    ],
    pageImprovements: [
      {
        pageOrSection: 'Homepage Hero & Sub-Hero',
        issue: 'Subheadline speaks broadly about "teams" without naming target systems (NetSuite, Salesforce, Snowflake).',
        suggestion: 'Include concrete named systems and one quantified customer outcome directly under the H1.',
      },
      {
        pageOrSection: 'Pricing Page',
        issue: 'Lacks an interactive FAQ section addressing task overages, sandbox environments, and annual enterprise SLAs.',
        suggestion: 'Add a 6-question Pricing FAQ marked up with FAQPage schema right beneath the tier matrix.',
      },
      {
        pageOrSection: 'Integrations Directory',
        issue: 'Connector tiles link to short modals instead of indexable URLs.',
        suggestion: 'Give each top-25 connector its own indexable URL with triggers, actions, and sample templates.',
      },
    ],
    ctaAndConversionTips: [
      'Offer an interactive "Workflow ROI Calculator" or "Book a 15-min Architecture Review" alongside the generic "Book a Demo" button.',
      'Place a real customer quote with full name, title, and measurable outcome directly adjacent to the primary signup form.',
      'Add a low-friction "Explore Live Sandbox" secondary CTA for technical evaluators who prefer hands-on testing before sales calls.',
    ],
  },
  keywordSuggestions: {
    primary: [
      {
        keyword: 'b2b workflow automation platform',
        intent: 'Commercial',
        estimatedDifficulty: 'High',
        estimatedVolumeTier: 'High',
        opportunity: 'Core category anchor for homepage and /platform pillar page.',
      },
      {
        keyword: 'revops automation software',
        intent: 'Commercial',
        estimatedDifficulty: 'Medium',
        estimatedVolumeTier: 'Medium',
        opportunity: 'Strong alignment with RevOps buyer persona and product positioning.',
      },
      {
        keyword: 'finance workflow automation',
        intent: 'Transactional',
        estimatedDifficulty: 'Medium',
        estimatedVolumeTier: 'Medium',
        opportunity: 'Underserved niche where audit logging and compliance differentiate from generic tools.',
      },
      {
        keyword: 'enterprise ipaas alternative',
        intent: 'Commercial',
        estimatedDifficulty: 'Medium',
        estimatedVolumeTier: 'Medium',
        opportunity: 'Captures buyers seeking faster deployment than legacy enterprise middleware.',
      },
    ],
    longTail: [
      {
        keyword: 'automate salesforce to netsuite invoice sync',
        intent: 'Transactional',
        estimatedDifficulty: 'Low',
        estimatedVolumeTier: 'Low',
        opportunity: 'High purchase intent; ideal for a dedicated connector landing page.',
      },
      {
        keyword: 'soc 2 compliant workflow automation tool',
        intent: 'Commercial',
        estimatedDifficulty: 'Low',
        estimatedVolumeTier: 'Low',
        opportunity: 'Directly converts security-conscious mid-market IT and finance evaluators.',
      },
      {
        keyword: 'how to log automated billing sync errors',
        intent: 'Informational',
        estimatedDifficulty: 'Low',
        estimatedVolumeTier: 'Low',
        opportunity: 'Top-of-funnel technical tutorial feeding into product trial.',
      },
      {
        keyword: 'quote to cash workflow automation checklist',
        intent: 'Informational',
        estimatedDifficulty: 'Low',
        estimatedVolumeTier: 'Medium',
        opportunity: 'Downloadable template or interactive checklist lead magnet.',
      },
    ],
    questionKeywords: [
      'What is the best alternative to Zapier for finance teams?',
      'How do I sync Stripe subscriptions to NetSuite automatically?',
      'What security certifications should an iPaaS platform have?',
      'How long does it take to implement quote-to-cash automation?',
    ],
    competitorGapKeywords: [
      'workato vs custom python scripts',
      'automated erp reconciliation software',
      'multi-entity billing sync automation',
      'low code audit trail automation',
    ],
  },
  technicalChecklist: [
    {
      category: 'Crawlability',
      check: 'robots.txt & XML Sitemap Accessibility',
      status: 'Warning',
      detail: 'Primary pages are indexable, but full robots.txt directives and XML sitemap completeness are not fully verifiable from homepage inspection alone.',
      fix: 'Verify /robots.txt explicitly references https://northstarworkflow.io/sitemap.xml and does not accidentally disallow CSS/JS or /integrations.',
      whyItMatters: 'Search and AI crawlers rely on clean robots.txt rules and sitemaps to discover deep integration and blog pages.',
      effort: 'Low',
    },
    {
      category: 'Indexability',
      check: 'Meta Robots & Canonical Consistency',
      status: 'Pass',
      detail: 'No accidental noindex directives observed on primary marketing routes; canonical tag resolves cleanly.',
      fix: 'Audit staging subdomains to ensure they remain blocked via HTTP auth or noindex.',
      whyItMatters: 'Prevents accidental de-indexing of revenue pages or indexing of staging duplicates.',
      effort: 'Low',
    },
    {
      category: 'Security',
      check: 'HTTPS Enforcement & Security Headers',
      status: 'Info',
      detail: 'Site serves over HTTPS; exact HTTP response headers (CSP, HSTS, X-Frame-Options) are not verifiable via page-level URL context.',
      fix: 'Inspect response headers via curl -I or SecurityHeaders.com and enable HSTS with preload and strict CSP.',
      whyItMatters: 'HTTPS is a baseline ranking signal and security headers protect user sessions.',
      effort: 'Low',
    },
    {
      category: 'Mobile',
      check: 'Mobile Viewport & Responsive Rendering',
      status: 'Pass',
      detail: 'Responsive meta viewport configured and layout adapts cleanly across mobile breakpoints.',
      fix: 'Spot-check pricing comparison tables on 375px viewports to ensure horizontal scroll stays contained.',
      whyItMatters: 'Google uses mobile-first indexing to evaluate page content and usability.',
      effort: 'Low',
    },
    {
      category: 'Core Web Vitals',
      check: 'LCP, INP & CLS Risk Assessment',
      status: 'Warning',
      detail: 'Field CrUX telemetry is not verifiable from page inspection; however, heavy unoptimized hero product animations pose an LCP and CLS risk.',
      fix: 'Preload the primary LCP hero image, define explicit width/height attributes, and validate in PageSpeed Insights.',
      whyItMatters: 'Poor Core Web Vitals increase bounce rates and can suppress competitive rankings.',
      effort: 'Medium',
    },
    {
      category: 'Performance',
      check: 'Image Compression & Modern Formats',
      status: 'Warning',
      detail: 'Product screenshots appear served as standard PNGs without visible AVIF/WebP responsive srcset variants.',
      fix: 'Convert marketing assets to WebP/AVIF and enable lazy loading on below-the-fold customer logos and screenshots.',
      whyItMatters: 'Smaller image payloads directly improve mobile load speed and conversion rates.',
      effort: 'Low',
    },
    {
      category: 'Structured Data',
      check: 'JSON-LD Schema Coverage',
      status: 'Critical',
      detail: 'No SoftwareApplication, Organization, or FAQPage JSON-LD schema blocks detected on the primary landing page.',
      fix: 'Inject validated Organization, SoftwareApplication, and FAQPage JSON-LD scripts in the document head.',
      whyItMatters: 'Structured data disambiguates your brand entity for Google Knowledge Graph and AI answer engines.',
      effort: 'Low',
    },
    {
      category: 'Redirects & Links',
      check: 'Redirect Chains & Broken Links',
      status: 'Info',
      detail: 'Full site-wide HTTP status crawl is not verifiable without a dedicated crawler; primary nav links appear clean.',
      fix: 'Run a periodic Screaming Frog or GSC Coverage check to catch 404s or multi-hop 301 redirect chains.',
      whyItMatters: 'Broken internal links waste crawl budget and degrade user experience.',
      effort: 'Low',
    },
    {
      category: 'International',
      check: 'Hreflang & Regional Targeting',
      status: 'Info',
      detail: 'Single English-language version observed; no hreflang annotations present.',
      fix: 'Keep as-is unless launching localized UK/EU/APAC subdirectories, at which point reciprocal hreflang tags should be added.',
      whyItMatters: 'Correct hreflang prevents regional duplicate content conflicts once localized sites launch.',
      effort: 'Medium',
    },
    {
      category: 'Accessibility',
      check: 'Semantic Landmarks, Contrast & Alt Text',
      status: 'Warning',
      detail: 'Primary contrast looks clear, but several workflow screenshots lack descriptive alt text and form controls need explicit labels.',
      fix: 'Audit with axe DevTools, add descriptive alt text on all product visuals, and verify keyboard focus states.',
      whyItMatters: 'Accessibility improves usability for all visitors and correlates with cleaner semantic HTML for bots.',
      effort: 'Low',
    },
    {
      category: 'Rendering',
      check: 'JavaScript Hydration & SSR Crawlability',
      status: 'Pass',
      detail: 'Primary headings, navigation, and copy are present in the rendered HTML payload without blocking client-only gates.',
      fix: 'Ensure future interactive ROI calculators or connector directories pre-render core text server-side.',
      whyItMatters: 'Server-rendered HTML guarantees immediate indexing by search engines and AI crawlers that do not execute heavy JS.',
      effort: 'Low',
    },
  ],
  aiSearchOptimization: {
    readinessSummary:
      'Northstar Workflow is partially discoverable in AI search engines due to clear brand positioning, but lacks the structured entity markup, answer-first formatting, original benchmark citations, and llms.txt guidance needed to win consistent citations in Google AI Overviews, ChatGPT Search, Perplexity, Gemini, and Copilot.',
    recommendations: [
      {
        title: 'Adopt Answer-First Content Formatting on Product & Guide Pages',
        description:
          'Lead each key section with a concise 40–60 word direct answer before expanding into workflows, making passages easy for LLMs to quote verbatim.',
        priority: 'High',
      },
      {
        title: 'Publish Original Quantitative Proof & Case Metrics',
        description:
          'Add specific, verifiable customer metrics (e.g., hours saved per month-end close, sync latency SLAs) and an annual industry benchmark report to earn citations.',
        priority: 'High',
      },
      {
        title: 'Configure Explicit AI Crawler Access (GPTBot, Google-Extended, PerplexityBot, ClaudeBot)',
        description:
          'Review robots.txt rules to ensure public marketing, docs, and integration pages allow reputable AI search crawlers while keeping gated app routes disallowed.',
        priority: 'Medium',
      },
      {
        title: 'Strengthen Entity Clarity Across Third-Party Profiles',
        description:
          'Link Organization JSON-LD sameAs URLs to Wikidata/Crunchbase/LinkedIn/G2 so answer engines reconcile Northstar Workflow as a distinct software entity.',
        priority: 'Medium',
      },
    ],
    structuredDataSuggestions: [
      'Organization schema with sameAs links to LinkedIn, GitHub, G2, and Crunchbase.',
      'SoftwareApplication schema detailing operatingSystem ("Web"), applicationCategory ("BusinessApplication"), and pricing tiers.',
      'FAQPage schema on Pricing, Security, and top Integration pages.',
      'Article + Person author schema on all engineering and RevOps guides.',
    ],
    entityAndBrandSignals: [
      'Establish consistent brand boilerplate ("Northstar Workflow — SOC 2 compliant B2B finance & RevOps automation platform") across homepage, LinkedIn, and G2.',
      'Add named author bios with domain credentials and editorial review timestamps.',
      'Publish downloadable architecture specifications and API documentation in clean Markdown/HTML.',
    ],
    llmsTxtSuggestion: `# Northstar Workflow

> B2B finance and RevOps automation platform connecting ERP, CRM, and billing systems with immutable audit trails and SOC 2 Type II governance.

## Core Documentation
- [Platform Overview](https://northstarworkflow.io/platform): Architecture, audit logging, and reliability SLAs.
- [Integrations Directory](https://northstarworkflow.io/integrations): Supported connectors for NetSuite, Salesforce, Stripe, and Snowflake.
- [Security & Compliance](https://northstarworkflow.io/security): SOC 2 Type II, GDPR, RBAC, and encryption standards.
- [Pricing](https://northstarworkflow.io/pricing): Team, Growth, and Enterprise plan limits.

## Solution Guides
- [Quote-to-Cash Automation](https://northstarworkflow.io/solutions/quote-to-cash): End-to-end CRM to ERP billing orchestration.`,
    sampleFAQ: [
      {
        question: 'How does Northstar Workflow differ from general automation tools like Zapier?',
        answer:
          'Northstar Workflow is purpose-built for B2B finance and RevOps pipelines, providing immutable audit trails, schema-validated ERP connectors (such as NetSuite and SAP), deterministic retries, and SOC 2 Type II role-based governance.',
      },
      {
        question: 'Which ERP and billing systems does Northstar Workflow integrate with natively?',
        answer:
          'Northstar supports native bi-directional integrations with NetSuite, Salesforce, Stripe, HubSpot, QuickBooks Online, Chargebee, and Snowflake.',
      },
      {
        question: 'Is Northstar Workflow SOC 2 Type II compliant?',
        answer:
          'Yes. Northstar maintains SOC 2 Type II attestation, encrypts data in transit (TLS 1.3) and at rest (AES-256), and provides granular audit logs for every automated execution.',
      },
    ],
  },
  roadmap: {
    days30: [
      'Add Organization, SoftwareApplication, and FAQPage JSON-LD schema to homepage and pricing.',
      'Fix missing image alt attributes and enforce single-H1 heading hierarchy across key landing pages.',
      'Publish /llms.txt and verify AI crawler directives (GPTBot, Google-Extended, PerplexityBot, ClaudeBot) in robots.txt.',
      'Rewrite meta titles and descriptions for the top 10 commercial pages.',
    ],
    days60: [
      'Launch 10 dedicated, indexable connector pages (NetSuite, Salesforce, Stripe, Snowflake) with answer-first summaries.',
      'Publish 3 high-intent comparison pages targeting Zapier/Workato enterprise evaluation queries.',
      'Add named author bios, reviewer badges, and contextual internal links across existing blog guides.',
      'Compress hero product visuals to WebP/AVIF and benchmark LCP/CLS in PageSpeed Insights.',
    ],
    days90: [
      'Publish an original "State of Mid-Market Finance & RevOps Automation" benchmark study for link & AI citation acquisition.',
      'Launch an interactive Quote-to-Cash ROI calculator to boost mid-funnel conversion rates.',
      'Expand G2 and third-party directory review volume to strengthen brand entity consensus across LLMs.',
    ],
  },
  competitorComparison: {
    competitorUrl: 'https://zapier.com/',
    summary:
      'Zapier holds an overwhelming edge in programmatic integration breadth, domain authority, and AI-search brand recognition, while Northstar Workflow can win high-intent mid-market finance deals by owning compliance, ERP depth, and audit-trail specificity.',
    scores: {
      overall: 89,
      seo: 92,
      content: 90,
      keywords: 94,
      technical: 86,
      aiSearch: 85,
    },
    keyGaps: [
      'Programmatic integration pages: Zapier indexes thousands of app-to-app combination landing pages.',
      'AI-search citation density: Zapier is heavily cited in ChatGPT/Perplexity for broad automation queries.',
      'Schema and editorial authorship maturity across thousands of high-ranking tutorials.',
    ],
    competitorAdvantages: [
      'Massive branded search volume and third-party community ecosystem.',
      'Deep internal linking mesh connecting templates, app directories, and blog tutorials.',
      'Mature structured data and rich SERP snippet capture across informational queries.',
    ],
  },
  groundingSources: [
    { title: 'Sample Demo Audit Dataset — Northstar Workflow', uri: 'https://northstarworkflow.io/' },
  ],
  isDemo: true,
};
