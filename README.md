# Digital Automation Pulse

**Your website's digital health, decoded.**  
Digital Automation Pulse is an AI-powered digital marketing audit web application built with React, TypeScript, Tailwind CSS, Recharts, Express, and the `@google/genai` SDK.

## Key Capabilities
- **Grounded Live Site Auditing (`gemini-2.5-pro`)**: Uses Gemini's `urlContext` and `googleSearch` grounding tools server-side to inspect the live target URL and search landscape without browser CORS limitations.
- **Structured JSON Schema Validation & Retry**: Enforces `responseMimeType: "application/json"` with a strict `responseSchema`, validates the response payload, and retries once automatically on malformed JSON.
- **Lightweight AI Helpers (`gemini-2.5-flash`)**: Powers fast competitor side-by-side benchmarking and on-demand implementation snippets inside the 30/60/90-day Action Plan.
- **7-Pillar Results Dashboard**: Overall Pulse Score & 5 category radial gauges, Recharts Radar Chart, Top 5 Priority Fixes, expandable Issue Cards with severity/category/search filtering, and dedicated tabs for Overview, SEO Audit, Content Recommendations, Keyword Suggestions, Technical SEO Checklist, AI-Search Optimization (GEO/AEO + `llms.txt`), and Action Plan.
- **Competitor Comparison & Audit History**: Persists audits in `localStorage` with side-by-side two-audit comparison and a Recharts score progression line chart.
- **Multi-Format Exports**: Branded print-ready multi-page PDF report (`window.print()`), separate CSV exports (Issues, Keywords, Technical Checklist), raw JSON export, and one-click plain-text executive summary copy.

## Setup & Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Set `GEMINI_API_KEY` in your environment (or `.env` locally; never expose it in client code):
   ```bash
   GEMINI_API_KEY="your_gemini_api_key"
   ```

3. **Run in development** (Express API + Vite HMR/middleware on port 3000):
   ```bash
   npm run dev
   ```

4. **Type-check & production build**:
   ```bash
   npm run lint
   npm run build
   NODE_ENV=production npm start
   ```
