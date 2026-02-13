# Agency Scanner Integration — Implementation Plan

## Overview

Build a full-stack web app from scratch that lets agency owners enter their website URL, scans it with AI to extract a complete agency profile, then guides them through a valuation form with pre-filled fields, captures their contact info, and delivers a valuation estimate with enhanced results.

**Tech Stack**: React 18 + TypeScript, Express.js, Tailwind CSS + shadcn/ui, Drizzle ORM + PostgreSQL (Neon), Vite, wouter, TanStack React Query, react-hook-form, Zod.

**Key Integrations**: Anthropic Claude API (website extraction), UK Companies House API (financial enrichment), Close CRM (lead management).

---

## Target File Structure

```
marketingskills/
├── client/                          # React frontend
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── components/
│       │   ├── ui/                  # shadcn/ui primitives (button, input, card, etc.)
│       │   ├── UrlInput.tsx         # URL input field + submit button
│       │   ├── ScanProgress.tsx     # Scanning animation with 5 progress steps
│       │   ├── AgencyProfileCard.tsx # Profile display card (logo, services, team, etc.)
│       │   ├── AgencyTypeSelector.tsx # 6 agency type cards with AI pre-selection
│       │   ├── FinancialForm.tsx    # Revenue, EBITDA, growth rate, recurring %
│       │   ├── LeadCaptureForm.tsx  # Name + email capture
│       │   └── ValuationResults.tsx # Valuation range, factors, CTAs
│       ├── pages/
│       │   └── HomePage.tsx         # Single-page flow: URL → scan → form → results
│       ├── hooks/
│       │   ├── useScan.ts           # Start scan, poll status, get results
│       │   └── useValuation.ts      # Submit form, get valuation
│       ├── lib/
│       │   ├── api.ts              # Fetch wrapper for all API calls
│       │   ├── queryClient.ts      # TanStack Query client
│       │   └── utils.ts            # cn() utility, formatCurrency, etc.
│       └── types/
│           └── index.ts            # Re-exports from shared types
├── server/
│   ├── index.ts                    # Express app entry point
│   ├── routes.ts                   # API route definitions
│   ├── scanner/
│   │   ├── pipeline.ts             # Main orchestrator: fetch → parse → crawl → extract → enrich
│   │   ├── fetcher.ts              # URL fetching with timeout + redirect handling
│   │   ├── parser.ts               # Cheerio HTML parsing + key page discovery
│   │   ├── crawler.ts              # Multi-page crawl (services, team, clients, contact)
│   │   ├── extractor.ts            # Claude API call for structured agency data
│   │   ├── enricher.ts             # UK Companies House API lookup
│   │   └── logo.ts                 # Logo extraction from HTML
│   ├── services/
│   │   ├── close-crm.ts            # Close CRM search, create, update leads
│   │   └── valuation.ts            # EBITDA multiple valuation calculation
│   ├── db/
│   │   ├── index.ts                # Drizzle client + Neon connection
│   │   └── schema.ts               # Table definitions (scans, valuation_submissions)
│   └── vite.ts                     # Vite dev middleware for Express
├── shared/
│   └── types.ts                    # Shared TypeScript types (API contracts)
├── drizzle.config.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── components.json                  # shadcn/ui config
├── .env.example
└── .gitignore
```

---

## Phase 1: Project Scaffolding

**Goal**: Dev server boots. Express serves a blank React page. No features yet.

### 1.1 — package.json

Create at root with `"type": "module"`. Scripts:
- `"dev": "tsx server/index.ts"`
- `"build": "vite build && esbuild server/index.ts --bundle --platform=node --outdir=dist --format=esm --external:@neondatabase/serverless"`
- `"start": "node dist/index.js"`
- `"db:push": "drizzle-kit push"`

Dependencies:
```
express react react-dom @anthropic-ai/sdk cheerio
drizzle-orm @neondatabase/serverless zod wouter
@tanstack/react-query react-hook-form @hookform/resolvers
clsx tailwind-merge class-variance-authority lucide-react
@radix-ui/react-slot @radix-ui/react-label @radix-ui/react-select
@radix-ui/react-progress @radix-ui/react-separator
```

Dev dependencies:
```
typescript tsx @types/express @types/react @types/react-dom
vite @vitejs/plugin-react tailwindcss postcss autoprefixer
drizzle-kit esbuild
```

### 1.2 — tsconfig.json

Root config: `target: ES2022`, `module: ESNext`, `moduleResolution: bundler`, `strict: true`. Path aliases: `@shared/*` → `./shared/*`.

### 1.3 — vite.config.ts

React plugin. Root set to `client`. Proxy `/api` to `http://localhost:5000`. Build output to `dist/public`.

### 1.4 — tailwind.config.ts + postcss.config.js

Content paths: `["./client/src/**/*.{ts,tsx}"]`. Custom premium color palette. shadcn/ui CSS variables.

### 1.5 — Express server entry

`server/index.ts`: Create Express app, `app.use(express.json())`, register routes, attach Vite dev middleware (dev) or serve static files (prod), listen on port 5000.

`server/vite.ts`: Vite dev server in middleware mode with HTML fallback for SPA routing.

`server/routes.ts`: Empty `registerRoutes(app)` placeholder.

### 1.6 — React app shell

`client/index.html`: Standard HTML5 with `<div id="root">`.

`client/src/main.tsx`: Render `<App />` inside `<QueryClientProvider>`.

`client/src/App.tsx`: Single `<HomePage />` route (all flow happens on one page).

`client/src/index.css`: Tailwind directives + shadcn/ui CSS custom properties.

`client/src/lib/queryClient.ts`: Standard TanStack Query client.

`client/src/lib/utils.ts`: `cn()` helper using `clsx` + `tailwind-merge`.

### 1.7 — .env.example + .gitignore

```env
DATABASE_URL=postgresql://...
ANTHROPIC_API_KEY=sk-ant-...
CLOSE_API_KEY=api_...
COMPANIES_HOUSE_API_KEY=...
CLOSE_USER_ANDY=user_...
CLOSE_USER_HEATHER=user_...
CLOSE_USER_AHMED=user_...
```

`.gitignore`: `node_modules/`, `dist/`, `.env`, `*.env.local`

### Checkpoint: `npm run dev` boots, blank page renders at localhost:5000.

---

## Phase 2: Database Schema

**Goal**: Tables exist in PostgreSQL. Drizzle client connects and works.

### 2.1 — drizzle.config.ts

Schema path: `./server/db/schema.ts`. Dialect: `postgresql`. Connection from `DATABASE_URL`.

### 2.2 — server/db/index.ts

Connect Drizzle to Neon using `@neondatabase/serverless`.

### 2.3 — server/db/schema.ts

**Table: `scans`**

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, `gen_random_uuid()` |
| url | text | Original URL submitted |
| normalized_domain | text | e.g. "youragency.com" — used for cache lookups |
| status | text | `pending` / `scanning` / `complete` / `failed` |
| progress | integer | 0-100 |
| current_step | text | `reading_website` / `extracting_services` / `identifying_team` / `analysing_positioning` / `building_profile` |
| company_name | text | |
| logo_url | text | |
| description | text | AI-generated 1-2 sentence summary |
| agency_type | text | One of 6 types |
| services | jsonb | `[{ name, description }]` |
| team_members | jsonb | `[{ name, title }]` |
| headcount_estimate | integer | |
| clients | jsonb | `[{ name, sector }]` |
| sectors | jsonb | `["e-commerce", "saas"]` |
| locations | jsonb | `[{ city, country }]` |
| positioning | text | One-sentence value proposition |
| social_links | jsonb | `{ linkedin, twitter, instagram, facebook, youtube }` |
| blog_active | boolean | |
| year_founded | integer | |
| awards | jsonb | `["Award Name"]` |
| companies_house_data | jsonb | Full CH data if UK, null otherwise |
| pre_fill | jsonb | `{ agency_type, agency_name, annual_revenue, annual_ebitda }` |
| close_lead_id | text | Null until matched/created |
| error_message | text | If status is `failed` |
| created_at | timestamp | Default `now()` |
| expires_at | timestamp | Default `now() + 30 days` |

Indexes: `normalized_domain` (unique for active scans), `status`, `close_lead_id`.

**Table: `valuation_submissions`**

| Column | Type | Notes |
|--------|------|-------|
| id | serial | PK |
| scan_id | uuid | FK to scans.id |
| full_name | text | Required |
| email | text | Required |
| agency_type | text | Confirmed/overridden type |
| annual_revenue | numeric | |
| annual_ebitda | numeric | Required |
| growth_rate | text | Dropdown value |
| recurring_revenue_pct | text | Dropdown value |
| valuation_low | numeric | Calculated |
| valuation_high | numeric | Calculated |
| valuation_multiple_low | numeric | |
| valuation_multiple_high | numeric | |
| valuation_factors | jsonb | Breakdown of helping/hurting factors |
| close_lead_id | text | |
| created_at | timestamp | Default `now()` |

### Checkpoint: `npm run db:push` creates tables. Verified in Drizzle Studio.

---

## Phase 3: Shared Types

**Goal**: TypeScript API contract defined. Both frontend and backend import the same types.

### 3.1 — shared/types.ts

Define all interfaces used across the API boundary:

- `ScanRequest` — `{ url: string }`
- `ScanStatusResponse` — `{ id, status, progress, current_step }`
- `ScanResults` — Full scan data (company_name, agency_type, services, team, clients, locations, etc.)
- `CompaniesHouseData` — company_number, incorporation_date, directors, filed_accounts
- `AgencyType` — Union of 6 types: `digital_marketing | creative_agency | performance_marketing | social_media_marketing | growth_marketing | full_service`
- `ValuationFormData` — `{ scan_id, full_name, email, agency_type, annual_revenue, annual_ebitda, growth_rate, recurring_revenue_pct }`
- `ValuationResult` — `{ id, scan_id, valuation_low, valuation_high, multiple_low, multiple_high, factors, agency_profile }`
- `ValuationFactor` — `{ name, impact: "helping" | "hurting", description }`
- `PreFill` — `{ agency_type, agency_name, annual_revenue?, annual_ebitda? }`

---

## Phase 4: Backend Scanner Pipeline

**Goal**: Can scan a real agency URL from the server and get structured results in the database.

### 4.1 — server/scanner/fetcher.ts

`fetchPage(url)` → `{ html, finalUrl, statusCode }`

- Uses Node `fetch()` with 15-second timeout
- User-Agent: `"AgenciesBot/1.0 (+https://agencies.co)"`
- Follows up to 3 redirects
- Handles errors: timeout → throw, 4xx/5xx → throw with status, SSL → throw
- Detects Cloudflare challenge pages (checks for "Checking your browser" text)

### 4.2 — server/scanner/parser.ts

`parseHomepage(html, baseUrl)` → `{ title, metaDescription, heroText, bodyText, navLinks, footerText, socialLinks }`

Uses cheerio to extract:
- `<title>` tag
- `<meta name="description">` content
- All `<a href>` from `<nav>` elements
- Hero/headline text (first `<h1>`)
- Body text (stripped HTML, truncated to ~3000 words)
- Footer content (addresses, social links)

`discoverKeyPages(navLinks, baseUrl)` → `{ services_url, team_url, clients_url, contact_url }`

Uses Claude API (claude-sonnet-4-5-20250929, fast/cheap ~$0.01) to classify which nav links are the services page, team page, clients page, contact page. Returns JSON with 4 URLs or nulls.

### 4.3 — server/scanner/crawler.ts

`crawlKeyPages(urls)` → `CrawledPage[]`

- Fetches up to 4 pages in parallel (using Promise.allSettled)
- 2-second staggered delay between requests to same domain
- 10-second timeout per page
- Extracts text content from each page using cheerio (strip tags, keep structure)
- Truncates each page to ~2000 words
- Handles individual failures gracefully (skip that page, continue with rest)

### 4.4 — server/scanner/logo.ts

`extractLogo(html, baseUrl)` → `string | null`

Priority order:
1. `<link rel="apple-touch-icon">` (largest size)
2. `<link rel="icon" type="image/svg+xml">` (SVG preferred)
3. `<img>` in `<header>` or `<nav>` with "logo" in class/id/alt/src
4. `<meta property="og:image">` if filename contains "logo"
5. Fallback: largest `<link rel="icon">`

Converts relative URLs to absolute. Quick HEAD request to verify URL is accessible.

### 4.5 — server/scanner/extractor.ts

`extractAgencyData(homepage, crawledPages)` → structured agency profile JSON

The main intelligence step. Single Claude API call.

- Model: `claude-sonnet-4-5-20250929`
- System prompt: Expert agency website analyzer. Return only valid JSON. For agency_type, classify into exactly one of the 6 types. For description, write 1-2 professional sentences. Only include data explicitly found on the website.
- User prompt: All page content (homepage + up to 4 crawled pages), each labeled with URL and section name
- Expected: ~3000 input tokens, ~800 output tokens
- Cost: ~$0.03-0.05 per scan
- Latency: 5-10 seconds
- Parse response with Zod. If JSON parse fails, retry once.
- Returns: `{ company_name, description, agency_type, services[], team_members[], headcount_estimate, clients[], sectors[], locations[], positioning, social_links, blog_active, year_founded, awards[] }`

### 4.6 — server/scanner/enricher.ts

`enrichWithCompaniesHouse(agencyName, locations, domain)` → `CompaniesHouseData | null`

Only runs if UK detected:
- Domain ends in `.co.uk` or `.uk`
- Location includes UK/England/Scotland/Wales/known UK city
- Contact address is UK-based

API calls (Basic auth with `COMPANIES_HOUSE_API_KEY`):
1. Search: `GET /search/companies?q={name}` → find best match (active company, closest name)
2. Profile: `GET /company/{number}` → incorporation date, SIC codes, status
3. Officers: `GET /company/{number}/officers` → director names + appointment dates
4. Filing history: `GET /company/{number}/filing-history` → look for type "AA" (annual accounts)

5-second timeout per request. If no match found, return null. If API errors, return null (don't block the scan).

### 4.7 — server/scanner/pipeline.ts

`runScanPipeline(scanId, url)` — the main orchestrator. Runs async (fire-and-forget).

```
1. Update scan: status="scanning", progress=0, step="reading_website"
2. Fetch homepage HTML
   - If unreachable: set status="failed", error="We couldn't reach that website"
   - If Cloudflare blocked: set status="failed", error="Site has bot protection"
3. Parse homepage → extract title, description, links, logo
4. Update: progress=20, step="extracting_services"
5. Discover key pages via Claude
6. Crawl key pages (parallel)
7. Update: progress=45, step="identifying_team"
8. Extract logo
9. Update: progress=60, step="analysing_positioning"
10. Run Claude AI extraction with all page content
11. Update: progress=80, step="building_profile"
12. If UK detected: run Companies House enrichment
13. Build pre_fill object from extraction results
14. Save all results to scan row
15. Update: status="complete", progress=100
16. Search Close CRM for existing lead by domain (non-blocking)
    - If found, store close_lead_id on scan
```

Entire pipeline wrapped in try/catch. On any unhandled error: set status="failed" with error message.

**Edge cases handled**:
- SPA sites (React/Vue): cheerio gets whatever's in initial HTML. If minimal, partial profile shown.
- Minimal content (<100 words): complete with sparse profile, don't block user.
- Non-English sites: Claude handles multilingual extraction, returns results in English.
- Password-protected sites: 401/403 → "This site requires login. Please enter a publicly accessible URL."
- URL with path (e.g. company.com/our-agency): strip to root domain for scan, use provided URL as starting point.
- Redirects to different domain: follow redirect, use final domain, store both.

### Checkpoint: Can call `runScanPipeline(scanId, "https://www.jellyfish.com")` and see structured results in the scans table.

---

## Phase 5: Valuation Calculation Engine

**Goal**: Deterministic, explainable EBITDA-multiple valuation calculation.

### 5.1 — server/services/valuation.ts

`calculateValuation(formData, scanData)` → `{ low, high, multiple_low, multiple_high, factors[] }`

**Base EBITDA multiples by agency type**:

| Agency Type | Low Multiple | High Multiple |
|-------------|-------------|--------------|
| Digital Marketing | 4.0x | 6.0x |
| Creative Agency | 3.5x | 5.5x |
| Performance Marketing | 4.5x | 7.0x |
| Social Media Marketing | 3.5x | 5.0x |
| Growth Marketing | 4.5x | 7.0x |
| Full-Service | 4.0x | 6.5x |

**Adjustment factors** (each adds/subtracts from the multiple and generates a ValuationFactor):

1. **Growth rate**: Decline = -1.0x, 0-10% = 0x, 10-20% = +0.5x, 20-50% = +1.0x, 50%+ = +1.5x
2. **Recurring revenue %**: 0-20% = 0x, 20-40% = +0.5x, 40-60% = +1.0x, 60-80% = +1.5x, 80%+ = +2.0x
3. **Service diversity** (from scan, number of services): 1-2 = -0.5x, 3-5 = 0x, 6+ = +0.3x
4. **Team depth** (from scan, headcount): <5 = -0.5x, 5-20 = 0x, 20-50 = +0.3x, 50+ = +0.5x
5. **Client diversity** (from scan, number of clients): <3 = -0.5x, 3-10 = 0x, 10+ = +0.3x

**Calculation**:
- `adjustedLow = baseLow + sum(adjustments)` (floor at 1.0x)
- `adjustedHigh = baseHigh + sum(adjustments)` (floor at 1.5x)
- `valuationLow = EBITDA * adjustedLow`
- `valuationHigh = EBITDA * adjustedHigh`

**Factors output**: Each adjustment becomes a factor entry:
- Helping: "Diversified service offering (6 services)", "Strong team depth (12 people)", "Growing revenue (20%+ YoY)"
- Hurting: "Low recurring revenue (0-20%)", "Limited client diversity (2 clients)"

### Checkpoint: Can call `calculateValuation()` with test data and get a sensible valuation range.

---

## Phase 6: Close CRM Integration

**Goal**: Search for existing leads on scan complete. Create/update leads on form submission.

### 6.1 — server/services/close-crm.ts

Base URL: `https://api.close.com/api/v1/`. Auth: Basic auth with `CLOSE_API_KEY`.

**Functions**:

`searchLeadByDomain(domain)` → `{ lead_id } | null`
- `GET /lead/?query=url:"${domain}"`
- Returns first match or null

`createOrUpdateLead(scanData, formData, valuationResult)`:

**If existing lead found** (close_lead_id on scan):
- `PUT /lead/{id}` — update custom fields: agency_type, headcount, services, sectors, scan_date, scan_source="self_scan", annual_revenue, annual_ebitda, growth_rate, recurring_revenue_pct, valuation_low, valuation_high, lead_temperature="warm", funnel_stage="valued"
- Search existing contacts for matching email. If not found, `POST /contact/` to add new contact.
- `POST /activity/note/` — add HTML note with full scan + valuation summary.

**If no existing lead**:
- `POST /lead/` — create with name, url, contact (name + email), all custom fields above.
- `POST /activity/note/` — same note as above.

**High-value task creation** (valuation_high >= $1M):
- `POST /task/` — assign to CLOSE_USER_ANDY with hot lead summary. Mark as not complete. Include agency name, valuation range, contact info.

**Custom fields required in Close** (create manually first):

| Field Name | Type | Values |
|------------|------|--------|
| Agency Type | Dropdown | Digital Marketing, Creative Agency, Performance Marketing, Social Media Marketing, Growth Marketing, Full-Service |
| Headcount | Number | |
| Services | Text | Comma-separated |
| Sectors | Text | Comma-separated |
| Scan Date | Date | |
| Scan Source | Dropdown | Self-Scan, Batch Enrichment, Manual |
| Annual Revenue | Number | Dollars |
| Annual EBITDA | Number | Dollars |
| Growth Rate | Text | |
| Recurring Revenue % | Text | |
| Valuation Low | Number | |
| Valuation High | Number | |
| Lead Temperature | Dropdown | Cold, Warm, Hot |
| Funnel Stage | Dropdown | Scanned, Valued, Listed, CIM Generated, In Market, Under Offer, Completed |

All CRM operations are non-blocking (fire-and-forget with error logging). If Close is down, user experience is unaffected.

### Checkpoint: Scan a URL, submit form data, verify lead appears in Close with all fields populated.

---

## Phase 7: API Routes

**Goal**: All endpoints working. Testable with curl.

### 7.1 — server/routes.ts

**`POST /api/scan`**
- Validate with Zod: `{ url: string }`
- Normalize URL (add https://, strip trailing slash, extract domain)
- Check cache: if same `normalized_domain` scanned in last 30 days with status="complete", return cached scan_id
- Insert new scan row (status="pending")
- Kick off `runScanPipeline(scanId, url)` — fire and forget (do NOT await)
- Return `{ scan_id, status: "scanning" }` with 202 Accepted

**`GET /api/scan/:scan_id/status`**
- Look up scan by ID
- Return `{ status, progress, current_step }`
- 404 if not found

**`GET /api/scan/:scan_id/results`**
- Look up scan by ID
- If status != "complete", return 400 `{ error: "Scan not yet complete" }`
- Return full scan results mapped to `ScanResults` type
- 404 if not found

**`POST /api/valuate`**
- Validate with Zod: `ValuationFormData` schema (scan_id, full_name, email, agency_type, annual_revenue, annual_ebitda, growth_rate, recurring_revenue_pct)
- Look up associated scan
- Run `calculateValuation()` with form data + scan data
- Insert into `valuation_submissions` table
- Trigger Close CRM create/update (async, non-blocking)
- Return `{ submission_id }` with 201 Created

**`GET /api/results/:submission_id`**
- Look up submission by ID, join with scan data
- Return full `ValuationResult` (valuation numbers + factors + agency profile)
- 404 if not found

### 7.2 — Error handling middleware

Catch-all at the end of route registration. Returns `{ error: message }` with appropriate status codes. Logs stack trace in development.

### Checkpoint: All 5 endpoints work via curl. Can start a scan, poll status, get results, submit valuation, get final results.

---

## Phase 8: Frontend UI Primitives

**Goal**: shadcn/ui components ready to use.

### 8.1 — Install shadcn/ui components

Create in `client/src/components/ui/`:

- `button.tsx` — primary, secondary, outline, ghost variants
- `input.tsx` — with label integration
- `label.tsx`
- `card.tsx` — card, card-header, card-content, card-footer
- `badge.tsx` — for service tags, agency type labels
- `progress.tsx` — for scan progress bar
- `select.tsx` — for growth rate and recurring revenue dropdowns
- `separator.tsx`
- `skeleton.tsx` — for loading states

Standard shadcn/ui pattern using `class-variance-authority` for variants.

---

## Phase 9: Frontend API Layer + Hooks

**Goal**: React can talk to the backend. Polling works.

### 9.1 — client/src/lib/api.ts

Fetch wrapper with JSON parsing, error handling, base URL `/api`.

Functions:
- `startScan(url)` → POST /api/scan → `{ scan_id }`
- `getScanStatus(id)` → GET /api/scan/:id/status → `{ status, progress, current_step }`
- `getScanResults(id)` → GET /api/scan/:id/results → `ScanResults`
- `submitValuation(data)` → POST /api/valuate → `{ submission_id }`
- `getResults(id)` → GET /api/results/:id → `ValuationResult`

### 9.2 — client/src/hooks/useScan.ts

- `useStartScan()` — wraps `startScan` in `useMutation`
- `useScanStatus(id)` — polls `getScanStatus` every 2 seconds using `useQuery` with `refetchInterval`. Stops when status is `complete` or `failed`.
- `useScanResults(id)` — fetches results once, enabled only when scan is complete.

### 9.3 — client/src/hooks/useValuation.ts

- `useSubmitValuation()` — wraps `submitValuation` in `useMutation`
- `useValuationResults(id)` — fetches results with `useQuery`

---

## Phase 10: Frontend Pages + Components

**Goal**: Full user flow works end-to-end in the browser.

The app is a single-page flow (all on HomePage.tsx). The page progresses through stages as the user moves forward. No separate routes needed — just state transitions.

### 10.1 — client/src/pages/HomePage.tsx

Manages the overall flow state:

```
Stage 1: URL Input (initial state)
Stage 2: Scanning Animation (after URL submitted)
Stage 3: Agency Profile + Valuation Form (after scan completes)
Stage 4: Results (after form submitted)
```

Each stage component is shown/hidden based on the current flow state. Previous stages stay visible but become read-only/collapsed.

### 10.2 — client/src/components/UrlInput.tsx

**Stage 1 UI**: Hero section.

```
┌───────────────────────────────────────────────┐
│                                               │
│       What's Your Agency Worth?               │
│                                               │
│  Enter your website and we'll build your      │
│  agency profile and valuation in minutes.     │
│                                               │
│  ┌─────────────────────────┐ ┌──────────┐    │
│  │ https://youragency.com  │ │ Scan →   │    │
│  └─────────────────────────┘ └──────────┘    │
│                                               │
│  🔒 Free • Takes 2 minutes • No commitment   │
│                                               │
└───────────────────────────────────────────────┘
```

- URL input with placeholder
- URL validation: accept with/without https://, with/without www, must have a dot, no spaces
- Submit button with loading state
- On submit: normalize URL, call `useStartScan()`, transition to Stage 2
- Error display for invalid URLs

### 10.3 — client/src/components/ScanProgress.tsx

**Stage 2 UI**: Scanning animation.

```
┌───────────────────────────────────────────────┐
│                                               │
│  Scanning youragency.com...                   │
│                                               │
│  ████████████░░░░░░░░░░  45%                  │
│                                               │
│  ✓ Reading your website                       │
│  ✓ Extracting services & capabilities         │
│  ◉ Identifying your team...                   │
│  ○ Analysing your market positioning          │
│  ○ Building your agency profile               │
│                                               │
└───────────────────────────────────────────────┘
```

- Progress bar using shadcn Progress component
- 5 progress steps with status indicators:
  - ✓ (green check) = completed
  - ◉ (pulsing dot) = in progress
  - ○ (grey circle) = pending
- Maps `current_step` from API to visual step states
- Step labels:
  1. "Reading your website"
  2. "Extracting services & capabilities"
  3. "Identifying your team"
  4. "Analysing your market positioning"
  5. "Building your agency profile"
- On complete: brief "Done!" animation, then transition to Stage 3
- On failure: show error message + "Try Again" button
- Timeout handling: if >60 seconds, show "Taking longer than usual. You can wait or enter details manually." with button to skip to Stage 3 with empty profile.

### 10.4 — client/src/components/AgencyProfileCard.tsx

**Stage 3, Section A**: What the scanner found.

```
┌───────────────────────────────────────────────┐
│                                               │
│  [Logo]  YourAgency                           │
│          yoursite.com                          │
│                                               │
│  "Full-service digital agency specialising    │
│   in performance marketing for e-commerce"    │
│                                               │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐│
│  │Services│ │Team    │ │Clients │ │Based in││
│  │6 found │ │12 ppl  │ │8 logos │ │London  ││
│  └────────┘ └────────┘ └────────┘ └────────┘│
│                                               │
│  Services: SEO, PPC, Content, Social, Web,   │
│            Email Marketing                    │
│                                               │
│  Sectors: E-commerce, SaaS, Fintech          │
│                                               │
│  ⓘ Not quite right? You can adjust below.    │
│                                               │
└───────────────────────────────────────────────┘
```

- Logo display with fallback (first letter of agency name in colored circle)
- Agency name (large)
- URL
- AI-generated description
- Stat cards: services count, team size, client count, primary location
- Services list as badges/tags
- Sectors as badges
- Gracefully hides any data point that wasn't found (only show what's available)
- Companies House data shown if available (registration number, incorporation date)

### 10.5 — client/src/components/AgencyTypeSelector.tsx

**Stage 3, Section B**: Pre-selected agency type.

```
┌───────────────────────────────────────────────┐
│                                               │
│  Your Agency Type                             │
│  Based on your website, we've categorised you:│
│                                               │
│  ☐ Digital Marketing   ☑ Creative Agency      │
│  ☐ Performance Mktg    ☐ Social Media Mktg    │
│  ☐ Growth Marketing    ☐ Full-Service         │
│                                               │
└───────────────────────────────────────────────┘
```

- 6 cards in 2x3 grid (3x2 on wide screens)
- Each card: icon (from lucide-react), name, brief subtitle
- One pre-selected based on `agency_type` from scan
- User can click to override
- Selected state: colored border + check icon
- If scan returned no type: none pre-selected, user must choose

### 10.6 — client/src/components/FinancialForm.tsx

**Stage 3, Section C**: Financial inputs.

```
┌───────────────────────────────────────────────┐
│                                               │
│  Annual Revenue ($)      Annual EBITDA ($) *  │
│  ┌───────────────┐       ┌───────────────┐   │
│  │ 0             │       │ 0             │   │
│  └───────────────┘       └───────────────┘   │
│                                               │
│  Growth Rate             Recurring Revenue %  │
│  ┌───────────────┐       ┌───────────────┐   │
│  │ Select ▼      │       │ 0-20% ▼       │   │
│  └───────────────┘       └───────────────┘   │
│                                               │
└───────────────────────────────────────────────┘
```

- Revenue: number input. Pre-filled from Companies House if UK, otherwise empty.
- EBITDA: number input, required. Pre-filled from Companies House if available (rare).
- Growth Rate: dropdown with same options as current app (Decline, 0-10%, 10-20%, 20-50%, 50%+, etc.)
- Recurring Revenue %: dropdown (0-20%, 20-40%, 40-60%, 60-80%, 80-100%)
- Currency formatting on blur
- Validation: EBITDA required, revenue optional but encouraged

### 10.7 — client/src/components/LeadCaptureForm.tsx

**Stage 3, Section D**: Name + email.

```
┌───────────────────────────────────────────────┐
│                                               │
│  Get Your Detailed Report                     │
│                                               │
│  Full Name *             Email Address *      │
│  ┌───────────────┐       ┌───────────────┐   │
│  │               │       │               │   │
│  └───────────────┘       └───────────────┘   │
│                                               │
│  ┌───────────────────────────────────────┐   │
│  │    Calculate My Agency's Value 📊     │   │
│  └───────────────────────────────────────┘   │
│                                               │
└───────────────────────────────────────────────┘
```

- Full Name: required
- Email: required, validated
- No Agency Name field (already captured from scan)
- Submit button: "Calculate My Agency's Value"
- Loading state during submission

### 10.8 — client/src/components/ValuationResults.tsx

**Stage 4**: Results display.

```
┌───────────────────────────────────────────────┐
│                                               │
│  YourAgency Estimated Valuation               │
│                                               │
│         $1.2M — $1.8M                         │
│                                               │
│  Based on: 4.0x — 6.0x EBITDA multiple       │
│                                               │
│  ── Factors Helping Your Valuation ──         │
│  ✓ Diversified service offering (6 services)  │
│  ✓ Strong team depth (12 people)              │
│  ✓ Growing revenue (20%+ YoY)                 │
│                                               │
│  ── Factors To Improve ──                     │
│  △ Low recurring revenue (0-20%)              │
│  △ Consider documenting processes             │
│                                               │
│  ── Your Agency Profile ──                    │
│  [Expanded AgencyProfileCard]                 │
│                                               │
│  ┌───────────────────────────────────────┐   │
│  │  Ready to go to market?               │   │
│  │  Our AI can build your CIM in hours.  │   │
│  │                                       │   │
│  │  [List My Agency — from $2,500 →]     │   │
│  │  [Book a Free Call →]                 │   │
│  │  [Download Report PDF →]              │   │
│  └───────────────────────────────────────┘   │
│                                               │
└───────────────────────────────────────────────┘
```

- Agency name in heading
- Valuation range (formatted as $X.XM or $XXXk)
- EBITDA multiple range
- Factors helping (green checks) — from scan data + form data
- Factors to improve (amber triangles)
- Agency profile summary (reuse AgencyProfileCard, read-only)
- CTA section: "List My Agency", "Book a Free Call", "Download Report PDF"
- CTAs link to external URLs (configurable)

---

## Phase 11: Polish and Edge Cases

**Goal**: Handle all error states, loading states, and edge cases.

### 11.1 — Error Handling

- **Invalid URL**: Inline error on UrlInput ("Please enter a valid website URL")
- **Site unreachable**: ScanProgress shows "We couldn't reach that website. Please check the URL and try again." + retry button
- **Cloudflare/bot protection**: "We couldn't access your site automatically. This sometimes happens with certain security settings." + manual entry option
- **Minimal content**: Continue with sparse profile, show fewer pre-filled fields
- **Scan timeout (>60s)**: "This is taking longer than usual. You can wait or enter your details manually below." + skip button
- **Password-protected site**: "This site requires login. Please enter a publicly accessible URL."
- **Parking/coming-soon page**: "This website doesn't have enough content for us to build a profile. You can still enter your details manually below."
- **API errors**: Friendly error messages, never show raw errors to user

### 11.2 — Loading States

- URL Input: button shows spinner + "Scanning..."
- Scan Progress: the animated step-by-step progress (the main UX moment)
- Form page: skeleton cards while scan results load
- Results page: skeleton layout while valuation results load
- Form submission: button disabled with spinner

### 11.3 — Responsive Design

- Mobile-first approach
- Single column on mobile, two columns on desktop where appropriate
- Agency type cards: 2x3 on mobile, 3x2 on desktop
- Profile card stacks above form on mobile
- All touch targets at least 44px
- Minimum viewport: 320px

### 11.4 — Scan Caching

- Same domain scanned in last 30 days → return cached results immediately
- `POST /api/scan` checks `normalized_domain` + `expires_at` before creating new scan
- Frontend gets instant results for repeat scans

---

## Phase 12: Deployment

**Goal**: Production build works, ready to deploy to Replit.

### 12.1 — Build

- `npm run build` produces:
  - `dist/public/` — static frontend assets (Vite build)
  - `dist/index.js` — bundled Express server (esbuild)
- `npm start` runs the production server
- Express serves static files from `dist/public` in production
- HTML5 history fallback for SPA routing

### 12.2 — Environment Variable Validation

On server startup, validate all required env vars exist. Fail fast with clear error message if any are missing.

### 12.3 — Security

- Rate limit on `POST /api/scan` (5 scans per IP per hour)
- Request body size limit (1MB)
- No sensitive data in client responses (strip raw HTML, internal IDs)
- Sanitize any user input before storing

---

## Implementation Order Summary

| # | Phase | What You Get When Done |
|---|-------|----------------------|
| 1 | Project Scaffolding | Dev server boots, blank React page renders |
| 2 | Database Schema | Tables exist in Neon, Drizzle works |
| 3 | Shared Types | TypeScript API contract defined |
| 4 | Scanner Pipeline | Can scan a real URL, results saved to DB |
| 5 | Valuation Engine | Can calculate valuation with test data |
| 6 | Close CRM | Leads created/updated in Close on scan + submit |
| 7 | API Routes | All 5 endpoints working, testable with curl |
| 8 | UI Primitives | shadcn/ui components ready |
| 9 | API Layer + Hooks | Frontend can talk to backend, polling works |
| 10 | Pages + Components | Full user flow works end-to-end in browser |
| 11 | Polish | Error states, loading states, responsive, caching |
| 12 | Deployment | Production build, env validation, rate limiting |

---

## Key Technical Decisions

1. **Async scan pipeline**: POST /api/scan returns immediately. Frontend polls for status. Avoids HTTP timeout issues on the 15-30 second scan.

2. **Cheerio over Puppeteer**: No headless browser needed. Fast, lightweight, sufficient for marketing agency sites. If a site requires JS rendering, we get limited data but don't fail.

3. **Claude Sonnet for extraction**: Good balance of cost ($0.03-0.05/scan), speed (5-10s), and quality. Structured extraction doesn't need Opus-level reasoning.

4. **Close CRM operations are non-blocking**: Fire-and-forget with error logging. If Close is down, user experience is unaffected.

5. **Polling over WebSockets**: Simpler to implement, no WS infrastructure needed. 2-second interval is fine for a 15-30 second scan.

6. **Valuation is deterministic**: Formula-based EBITDA multiples with adjustments. No AI in the calculation. Results are reproducible and explainable.

7. **Single-page flow**: All stages happen on one page (no routing between steps). Better UX — user sees progression, previous steps stay visible.

8. **30-day scan caching**: Same domain returns cached results instantly. Reduces API costs and improves UX for repeat visitors.

---

## Environment Variables Required

```
DATABASE_URL=postgresql://...          # Neon PostgreSQL
ANTHROPIC_API_KEY=sk-ant-...          # Claude API for extraction
CLOSE_API_KEY=api_...                 # Close CRM
COMPANIES_HOUSE_API_KEY=...           # UK Companies House
CLOSE_USER_ANDY=user_...              # Close user ID for task assignment
CLOSE_USER_HEATHER=user_...           # Close user ID
CLOSE_USER_AHMED=user_...             # Close user ID
```

---

## Test URLs

After building, test with these agency sites:

**UK agencies**:
- https://www.brandwatch.com
- https://www.wearesocial.com
- https://www.wolffolins.com
- https://www.jellyfish.com

**US agencies**:
- https://www.huge.com
- https://www.r-ga.com
- https://www.360i.com

**Edge cases**:
- A WordPress site with minimal content
- A single-page agency website
- A non-English agency site
- A site behind Cloudflare
