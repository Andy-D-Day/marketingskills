# Agencies.co: SEO Audit & Programmatic SEO Strategy

**Site**: https://agencies-co.replit.app/ (production: https://agencies.co)
**Date**: February 2026
**Scope**: Full site audit + programmatic SEO expansion strategy

---

## Executive Summary

Agencies.co is a marketplace for buying, selling, and merging marketing agencies. The site has ~26 core pages and ~15 blog posts. While the domain has strong topical authority potential in the agency M&A niche, there are significant SEO gaps limiting organic growth:

**Top 5 Priority Issues:**
1. Duplicate/generic title tags across pages (many pages return the same title)
2. Missing or thin meta descriptions on critical pages
3. No programmatic content targeting high-volume keyword patterns
4. Limited content depth on key money pages (valuation, buyers, sellers)
5. No structured data (schema markup) on any pages

**Opportunity Size**: The agency M&A, valuation, and services space has thousands of untapped long-tail keyword patterns. By implementing programmatic SEO across 3-4 playbooks, the site could realistically target 500-2,000+ new keyword variations.

---

## Part 1: Technical SEO Audit

### 1.1 Crawlability & Indexation

| Issue | Severity | Details |
|-------|----------|---------|
| HTML sitemap only | **High** | `/sitemap/` is an HTML page, not an XML sitemap. Google needs `/sitemap.xml` with proper XML formatting |
| JavaScript rendering | **High** | The replit deployment appears to be client-side rendered. Page content is invisible to crawlers that don't execute JS. Critical for indexation |
| No robots.txt verified | **Medium** | Need to verify robots.txt exists and references XML sitemap |
| Orphan pages possible | **Medium** | Pages like `/pricing-old/`, `/sellers-vsl/`, `/optin/`, `/thank-you-nda/` may not be internally linked |

**Fixes:**
- Generate a proper XML sitemap at `/sitemap.xml` containing all indexable pages
- Implement server-side rendering (SSR) or pre-rendering for all pages
- Add `Sitemap: https://agencies.co/sitemap.xml` to robots.txt
- Audit internal linking to ensure no orphan pages
- Remove or noindex deprecated pages (`/pricing-old/`)

### 1.2 Title Tags

| Page | Current Title | Issue |
|------|--------------|-------|
| Homepage | "Agencies.co - Buy, Sell & Merge Marketing Agencies" | Acceptable but generic |
| /agency-valuation/ | Same as homepage | **Duplicate** - should be unique |
| /sell-your-agency/ | Same as homepage | **Duplicate** - should be unique |
| /buyers/ | "Buyers \| Agencies.co" | Too short, no keywords |
| /agency-valuation-multiples/ | "Agency Valuation Multiples \| Agencies.co" | Acceptable |
| /pricing/ | "Simple, Transparent Pricing \| Agencies.co" | Missing primary keywords |
| /deal-flow/ | "Deal Flow \| Agencies.co" | Non-descriptive, no keywords |
| /portfolio/ | Appears to share homepage title | **Duplicate** |

**Recommended Title Tags:**

| Page | Recommended Title |
|------|------------------|
| Homepage | Agencies.co - Buy, Sell & Merge Marketing Agencies |
| /sell-your-agency/ | Sell Your Marketing Agency - Expert M&A Advisory \| Agencies.co |
| /buyers/ | Buy a Marketing Agency - Browse Agency Listings \| Agencies.co |
| /agency-valuation/ | Free Agency Valuation - What Is Your Agency Worth? \| Agencies.co |
| /agency-valuation-multiples/ | Agency Valuation Multiples: How Agencies Are Valued \| Agencies.co |
| /portfolio/ | Marketing Agencies for Sale - Current Listings \| Agencies.co |
| /pricing/ | M&A Advisory Pricing - Agency Sale Support \| Agencies.co |
| /deal-flow/ | Agency Deal Flow - LinkedIn Lead Generation for M&A \| Agencies.co |
| /agency-owners/ | For Agency Owners - Clarity Before Commitment \| Agencies.co |
| /value-creation-playbook/ | Value Creation Playbook for Agency Owners \| Agencies.co |

### 1.3 Meta Descriptions

| Page | Current | Issue |
|------|---------|-------|
| Homepage | "We buy and sell marketing agencies, valuations, transactions - closing deals for marketing agency owners" | Decent but could be stronger |
| /buyers/ | "Browse Listings for FREE" | **Too short** (22 chars). Wasted opportunity |
| /deal-flow/ | "DIY LinkedIn lead gen." | **Too short** (22 chars). Non-descriptive |
| /agency-valuation-multiples/ | "Most agency owners hear about valuation multiples before they understand what they actually represent." | Good but could include CTA |
| /agency-owners/ | "Agencies.co is built for agency owners who want clarity before commitment." | Decent |
| All other pages | Not detected / missing | **Critical gap** |

**Recommended Meta Descriptions:**

| Page | Recommended Description |
|------|----------------------|
| Homepage | Buy, sell, or merge your marketing agency with confidence. Agencies.co connects agency owners with vetted buyers. Get a free instant valuation or browse current listings. |
| /sell-your-agency/ | Ready to sell your marketing agency? Get expert M&A advisory, connect with qualified buyers, and close in as little as 90 days. Free valuation included. |
| /buyers/ | Browse marketing agencies for sale. Filter by type, revenue, and valuation. Sign an NDA to access detailed financials. New listings added weekly. |
| /agency-valuation/ | Find out what your marketing agency is worth. Our free valuation tool analyzes revenue, EBITDA, client retention, and growth to give you an accurate range. |
| /agency-valuation-multiples/ | Understand how agency valuation multiples work. Learn what drives multiples up or down and how to position your agency for maximum value. |
| /portfolio/ | View current marketing agencies for sale. Valuations from $470K to $30M+. Media, creative, digital, and performance marketing agencies available. |
| /pricing/ | Transparent M&A advisory pricing for agency sellers. Choose the right level of support for your agency sale, from DIY listing to full advisory. |
| /deal-flow/ | Generate your own agency acquisition deal flow with LinkedIn outreach. DIY tools and templates for finding agencies to buy. |

### 1.4 Heading Structure

**Issues found:**
- Multiple pages appear to lack proper H1 tags or use the site name as H1
- Heading hierarchy is inconsistent (H1 not always present)
- Sellers page uses H1 effectively: "The fastest way to sell your marketing and communications agency"

**Fixes:**
- Every page must have exactly one H1 containing the primary keyword
- Follow strict H1 > H2 > H3 hierarchy
- Use H2 for major sections, H3 for subsections

### 1.5 Schema Markup

**Current state**: No structured data detected on any page.

**Required schema implementations:**

| Page | Schema Types |
|------|-------------|
| All pages | `Organization`, `WebSite`, `BreadcrumbList` |
| Homepage | `Organization` (full), `WebSite` with `SearchAction` |
| /portfolio/ | `ItemList` with `ListItem` for each listing |
| Each listing | `Product` or `Offer` with price, description |
| Blog posts | `Article` with author, date, image |
| /pricing/ | `Product` with `Offer` for each pricing tier |
| /contact-us/ | `ContactPage` |
| /agency-valuation/ | `FAQPage` (add FAQ section), `HowTo` |
| /sellers/ | `FAQPage` (add FAQ section) |

### 1.6 Site Speed & Rendering

| Issue | Severity | Details |
|-------|----------|---------|
| Client-side rendering | **Critical** | Pages return only a title tag to non-JS crawlers. All content requires JavaScript to render |
| No pre-rendering detected | **High** | Without SSR or pre-rendering, Google may not index page content properly |
| Multiple analytics scripts | **Medium** | Google Analytics, Google Tag Manager, Hotjar all loading. Consider async/defer |

**Fixes:**
- Implement SSR (Next.js, Nuxt) or static site generation
- At minimum: implement dynamic rendering / pre-rendering for crawlers
- Audit and defer non-critical scripts
- Run PageSpeed Insights after SSR implementation

### 1.7 URL Structure

**Current structure** is generally clean:
- `/sell-your-agency/` - good
- `/agency-valuation/` - good
- `/agency-valuation-multiples/` - good
- `/ma-blog/` - acceptable (though `/blog/` would be more standard)
- `/privacy-policy-2/` - **bad** (the `-2` suggests a WordPress duplicate)

**Fixes:**
- Redirect `/privacy-policy-2/` to `/privacy-policy/`
- Consider renaming `/ma-blog/` to `/blog/` or `/learn/` (with 301 redirects)
- Remove `/pricing-old/` (redirect to `/pricing/`)
- Ensure trailing slash consistency

### 1.8 Internal Linking

**Issues:**
- Footer links to: Home, Sellers, Pricing, Blog, Contact, Sitemap, GoMerge comparison
- Missing footer links to: Buyers, Portfolio, Agency Valuation, Agency Owners
- Blog posts should link to relevant service pages (valuation, sell, buy)
- Portfolio listings should link to relevant educational content

**Recommended internal linking architecture:**

```
Homepage
├── For Sellers (hub)
│   ├── Sell Your Agency
│   ├── Agency Valuation
│   ├── Agency Valuation Multiples
│   ├── Understanding When to Sell
│   ├── Value Creation Playbook
│   └── Listing Questionnaire
├── For Buyers (hub)
│   ├── Portfolio / Listings
│   ├── Deal Flow
│   └── Schedule Call
├── Pricing
├── Blog (hub)
│   └── Individual posts
└── About / Contact
```

### 1.9 Miscellaneous Issues

| Issue | Details |
|-------|---------|
| Outdated copyright | Footer says "Agencies.co 2023" - should be 2026 or dynamic |
| Mixed currency | Some listings in USD, some in GBP. Consider currency toggle or locale handling |
| Thin pages | `/optin/`, `/thank-you-nda/`, `/sellers-vsl/` should be noindexed |
| Missing Open Graph tags | Not detected - important for social sharing |
| Missing favicon/branding meta | Not verified |

---

## Part 2: Content Audit

### 2.1 Content Depth Assessment

| Page | Word Count (est.) | Verdict | Action |
|------|------------------|---------|--------|
| Homepage | ~200 words visible | **Thin** | Expand with sections: how it works, featured listings, social proof, FAQ |
| /sell-your-agency/ | ~400 words | **Adequate** | Add FAQ section, expand process details |
| /sellers/ | ~500 words | **Good** | Add testimonials section, expand social proof |
| /buyers/ | ~100 words | **Thin** | Major expansion needed: buying process, what to look for, FAQ |
| /agency-valuation/ | ~300 words | **Thin** | Needs comprehensive guide content (1,500+ words) |
| /agency-valuation-multiples/ | ~300 words | **Thin** | Needs data tables, examples, benchmarks (2,000+ words) |
| /portfolio/ | Listings only | **Adequate** | Add intro content, filtering guidance |
| /pricing/ | Card-based | **Adequate** | Add FAQ section, comparison table |
| /deal-flow/ | ~150 words | **Thin** | Major expansion or repurpose |
| /value-creation-playbook/ | Form only | **Thin** | Add preview content, table of contents |
| /agency-owners/ | ~200 words | **Thin** | Expand with resources, links, value proposition |
| /understanding-when-to-sell/ | ~400 words | **Adequate** | Could expand with case studies |
| Blog (15 posts) | Varies | **Limited volume** | Need 2-4x more posts for topical authority |

### 2.2 Content Gaps (Missing Pages)

**High-Priority Missing Content:**

| Topic | Target Keyword | Search Intent | Priority |
|-------|---------------|---------------|----------|
| How to sell a marketing agency | "how to sell a marketing agency" | Informational/Commercial | **P1** |
| Agency due diligence checklist | "agency due diligence checklist" | Informational | **P1** |
| Agency EBITDA calculation | "agency EBITDA calculation" | Informational | **P1** |
| Letter of intent template | "agency LOI template" | Transactional | **P1** |
| Agency valuation calculator | "agency valuation calculator" | Transactional | **P2** |
| How to buy a marketing agency | "how to buy a marketing agency" | Informational | **P2** |
| Agency seller's guide (long-form) | "selling a digital agency guide" | Informational | **P2** |
| Buyer's guide (long-form) | "buying a marketing agency guide" | Informational | **P2** |
| Earnout structures explained | "earnout structure agency sale" | Informational | **P2** |
| Agency M&A process timeline | "agency acquisition timeline" | Informational | **P3** |
| Tax implications of selling | "tax on selling an agency" | Informational | **P3** |
| Non-compete agreements | "non-compete agency sale" | Informational | **P3** |

### 2.3 E-E-A-T Assessment

| Signal | Status | Action |
|--------|--------|--------|
| Author bios | Author is "Andy Day" but no bio page | Create author/about page with credentials |
| Social proof | 3 testimonials on sellers page, partner logos on homepage | Expand across site, add case studies |
| Data/research | Portfolio listings show real data | Publish market reports, valuation benchmarks |
| Credentials | "Capital A Group Company" mentioned | Make company background more prominent |
| Contact info | Contact form exists | Add phone, address, LinkedIn prominently |
| Transparency | NDA-gated listings | Good for trust, explain process better |

---

## Part 3: Programmatic SEO Strategy

### 3.1 Opportunity Assessment

Agencies.co sits at the intersection of several high-value keyword patterns that are ideal for programmatic SEO:

| Pattern | Example Query | Est. Monthly Searches | Competition |
|---------|--------------|----------------------|-------------|
| [type] agency for sale | "digital marketing agency for sale" | 1,000-3,000 | Medium |
| [type] agency valuation | "SEO agency valuation" | 200-500 | Low |
| marketing agency [city] | "marketing agency los angeles" | 5,000-10,000 | High |
| sell [type] agency | "sell my PR agency" | 100-300 | Low |
| buy [type] agency | "buy a social media agency" | 200-500 | Low |
| [type] agency valuation multiples | "creative agency valuation multiples" | 100-300 | Low |
| marketing agency M&A [year] | "agency M&A trends 2026" | 500-1,000 | Low |

### 3.2 Recommended Playbooks

Based on the business model and available data, here are the playbooks in priority order:

---

#### Playbook 1: Personas (Agency Type Pages)

**Pattern**: "sell your [type] agency" / "[type] agency for sale" / "[type] agency valuation"

**Why this works for Agencies.co:**
- Different agency types have different valuation multiples, buyer profiles, and sale considerations
- High purchase intent from both buyers and sellers
- Agencies.co already has portfolio data by agency type
- Defensible with proprietary transaction data

**Target pages (50-75 pages):**

```
/sell/digital-marketing-agency/
/sell/seo-agency/
/sell/ppc-agency/
/sell/social-media-agency/
/sell/content-marketing-agency/
/sell/creative-agency/
/sell/pr-agency/
/sell/media-buying-agency/
/sell/web-design-agency/
/sell/branding-agency/
/sell/email-marketing-agency/
/sell/performance-marketing-agency/
/sell/influencer-marketing-agency/
/sell/video-production-agency/
/sell/full-service-agency/
/buy/digital-marketing-agency/
/buy/seo-agency/
/buy/ppc-agency/
... (mirror for buy side)
/valuation/digital-marketing-agency/
/valuation/seo-agency/
... (mirror for valuation)
```

**Template structure per page:**

```
H1: Sell Your [Type] Agency
  Intro: 2-3 paragraphs specific to this agency type
  H2: What Is a [Type] Agency Worth?
    - Typical valuation multiples for this type
    - Factors that increase/decrease value
    - Revenue benchmarks
  H2: Current [Type] Agencies for Sale
    - Dynamic listings from portfolio (if any match)
    - "No current listings" with CTA to list
  H2: Who Buys [Type] Agencies?
    - Typical buyer profiles
    - Strategic vs. financial buyers
  H2: How to Prepare Your [Type] Agency for Sale
    - Type-specific preparation advice
    - Common issues for this type
  H2: [Type] Agency Valuation Multiples
    - Data table with ranges
    - What drives multiples up/down for this type
  H2: Ready to Sell?
    - CTA: Get Instant Valuation
    - CTA: Schedule a Call
  Sidebar: Related types, recent blog posts
  Schema: FAQPage, BreadcrumbList, Service
```

**Data requirements:**
- Agency type taxonomy (25-30 types)
- Valuation multiple ranges per type (proprietary data from past deals)
- Type-specific preparation checklists
- Dynamic portfolio listings filtered by type
- Buyer persona profiles per type

**Internal linking:**
- Hub: `/sell-your-agency/` links to all type pages
- Cross-link: Each sell page links to corresponding buy and valuation pages
- Blog posts link to relevant type pages

---

#### Playbook 2: Glossary (M&A Terms)

**Pattern**: "what is [term]" / "[term] in agency M&A" / "[term] definition"

**Why this works:**
- Agency owners researching a sale need to understand M&A terminology
- Top-of-funnel traffic that feeds into the sales pipeline
- Establishes expertise and E-E-A-T
- Low competition for agency-specific M&A terms
- Natural internal linking to service pages

**Target pages (40-60 pages):**

```
/glossary/ebitda/
/glossary/sde/
/glossary/valuation-multiple/
/glossary/letter-of-intent/
/glossary/due-diligence/
/glossary/earnout/
/glossary/working-capital/
/glossary/asset-sale-vs-stock-sale/
/glossary/non-compete-agreement/
/glossary/representations-and-warranties/
/glossary/indemnification/
/glossary/net-revenue-retention/
/glossary/client-concentration/
/glossary/recurring-revenue/
/glossary/adjusted-ebitda/
/glossary/enterprise-value/
/glossary/seller-financing/
/glossary/management-buyout/
/glossary/roll-up-strategy/
/glossary/synergies/
/glossary/purchase-agreement/
/glossary/escrow/
/glossary/closing-conditions/
/glossary/goodwill/
/glossary/key-person-risk/
/glossary/normalized-earnings/
/glossary/quality-of-earnings/
/glossary/teaser-document/
/glossary/confidential-information-memorandum/
/glossary/data-room/
/glossary/exclusivity-period/
/glossary/break-up-fee/
/glossary/drag-along-rights/
/glossary/tag-along-rights/
/glossary/change-of-control/
/glossary/transition-period/
/glossary/holdback/
/glossary/peg-ratio/
/glossary/rule-of-40/
/glossary/churn-rate/
/glossary/lifetime-value/
```

**Template structure per page:**

```
H1: What Is [Term]? (Agency M&A Definition)
  Definition: Clear, 2-3 sentence plain-English definition
  H2: [Term] in Agency M&A
    - How this concept specifically applies to agency transactions
    - Real-world example from agency context
  H2: How [Term] Affects Agency Valuation
    - Direct impact on deal structure or pricing
    - What buyers/sellers should know
  H2: Example
    - Concrete numerical or scenario example
  H2: Related Terms
    - Links to 3-5 related glossary entries
  H2: Further Reading
    - Links to relevant blog posts and service pages
  CTA: Get Your Agency Valued / Schedule a Call
  Schema: DefinedTerm, FAQPage, BreadcrumbList
```

**Data requirements:**
- Term definitions (proprietary, written from agency M&A expertise)
- Agency-specific examples for each term
- Related term mapping
- Links to relevant blog posts and service pages

---

#### Playbook 3: Comparisons

**Pattern**: "[competitor] vs Agencies.co" / "[competitor] alternative" / "[competitor] review"

**Why this works:**
- Already have a GoMerge comparison page (proof of concept)
- High purchase intent - people comparing options are close to choosing
- Defensible because it's about your own product
- Scales with number of competitors

**Target pages (10-20 pages):**

```
/compare/agencies-co-vs-gomerge/          (already exists, optimize)
/compare/agencies-co-vs-fe-international/
/compare/agencies-co-vs-quiet-light/
/compare/agencies-co-vs-digital-exits/
/compare/agencies-co-vs-empire-flippers/
/compare/agencies-co-vs-flippa/
/compare/agencies-co-vs-acquire-com/
/compare/agencies-co-vs-bizbuysell/
/compare/agencies-co-vs-viking-mergers/
/compare/agencies-co-vs-benchmark-international/
/compare/agencies-co-vs-woodbridge-international/
/compare/agencies-co-vs-exits-com/
/alternatives/fe-international/
/alternatives/quiet-light/
/alternatives/digital-exits/
```

**Template structure per page:**

```
H1: Agencies.co vs [Competitor]: Agency M&A Compared
  Intro: What both platforms do, who they serve
  H2: Quick Comparison
    - Feature comparison table (pricing, fees, deal size, specialization, timeline)
  H2: About Agencies.co
    - Key differentiators
  H2: About [Competitor]
    - Fair, accurate description
  H2: Key Differences
    - 3-5 honest differentiators
  H2: Who Should Use [Competitor]
    - Fair assessment of when they're better
  H2: Who Should Use Agencies.co
    - When Agencies.co is the better fit
  H2: Pricing Comparison
    - Side-by-side pricing
  H2: The Verdict
    - Balanced recommendation
  CTA: Get a Free Valuation from Agencies.co
  Schema: FAQPage, BreadcrumbList
```

---

#### Playbook 4: Locations (Geographic Pages)

**Pattern**: "marketing agencies for sale in [location]" / "sell agency [location]"

**Why this works:**
- Agency acquisitions often have geographic preferences
- Buyers want agencies in specific markets
- Sellers search locally for M&A advisors
- Scales with number of markets

**Target pages (30-50 pages):**

```
/agencies-for-sale/united-states/
/agencies-for-sale/united-kingdom/
/agencies-for-sale/new-york/
/agencies-for-sale/los-angeles/
/agencies-for-sale/london/
/agencies-for-sale/chicago/
/agencies-for-sale/san-francisco/
/agencies-for-sale/austin/
/agencies-for-sale/miami/
/agencies-for-sale/atlanta/
/agencies-for-sale/seattle/
/agencies-for-sale/denver/
/agencies-for-sale/boston/
/agencies-for-sale/toronto/
/agencies-for-sale/sydney/
... (top 30-50 agency markets)
```

**Template structure per page:**

```
H1: Marketing Agencies for Sale in [Location]
  Intro: Agency market overview for this location
  H2: Current Listings in [Location]
    - Dynamic listings filtered by geography
    - "No current listings" with notification signup CTA
  H2: [Location] Agency Market Overview
    - Number of agencies in market
    - Common agency types
    - Average valuations
  H2: Selling Your Agency in [Location]
    - Local considerations (regulations, market conditions)
    - Local buyer landscape
  H2: Buying an Agency in [Location]
    - Why this market is attractive
    - What to look for
  H2: Get Notified of New [Location] Listings
    - Email signup CTA
  Schema: ItemList, BreadcrumbList, LocalBusiness
```

**Important**: Only create location pages where you have data or listings. Thin location pages with no unique content will be penalized. Start with 10-15 top markets and expand as listings grow.

---

### 3.3 Combined Playbook Opportunities

Layer playbooks for high-intent long-tail keywords:

| Combined Pattern | Example | URL |
|-----------------|---------|-----|
| Type + Location | "SEO agencies for sale in New York" | `/agencies-for-sale/new-york/seo-agency/` |
| Type + Valuation | "creative agency valuation multiples" | `/valuation/creative-agency/` |
| Comparison + Type | "best brokers for selling an SEO agency" | covered by type pages |

**Recommendation**: Start with single-axis pages. Only create combined pages when you have sufficient data to provide unique value.

---

### 3.4 Implementation Priority & Phasing

#### Phase 1: Fix Foundations (Weeks 1-2)
- [ ] Fix all duplicate/missing title tags
- [ ] Write unique meta descriptions for every page
- [ ] Implement XML sitemap at `/sitemap.xml`
- [ ] Add server-side rendering or pre-rendering
- [ ] Implement Organization + WebSite schema on all pages
- [ ] Fix URL issues (`/privacy-policy-2/`, `/pricing-old/`)
- [ ] Update copyright year
- [ ] Add noindex to utility pages (`/optin/`, `/thank-you-nda/`, `/sellers-vsl/`)

#### Phase 2: Expand Core Content (Weeks 3-4)
- [ ] Expand `/agency-valuation/` to 1,500+ word comprehensive guide
- [ ] Expand `/buyers/` with buying process, criteria, FAQ
- [ ] Expand `/agency-valuation-multiples/` with data tables and benchmarks
- [ ] Add FAQ sections to key pages (valuation, sellers, pricing)
- [ ] Implement FAQPage schema on pages with FAQ content
- [ ] Create author/about page for Andy Day with credentials
- [ ] Add Article schema to all blog posts
- [ ] Publish 5 new blog posts targeting content gaps (due diligence, EBITDA, LOI, etc.)

#### Phase 3: Programmatic SEO - Glossary (Weeks 5-6)
- [ ] Build glossary template
- [ ] Write 20 glossary entries (start with highest-volume terms)
- [ ] Create glossary hub page at `/glossary/`
- [ ] Implement DefinedTerm schema
- [ ] Add internal links from existing content to glossary terms
- [ ] Add glossary to navigation under "Learn"
- [ ] Expand to 40+ terms

#### Phase 4: Programmatic SEO - Agency Type Pages (Weeks 7-10)
- [ ] Build persona page template for sell/buy/valuation
- [ ] Compile valuation data by agency type
- [ ] Launch 10 sell-side type pages (highest-demand types first)
- [ ] Launch 10 buy-side type pages
- [ ] Launch 10 valuation type pages
- [ ] Create hub pages linking to all type pages
- [ ] Add dynamic listing feeds filtered by type
- [ ] Expand to full set of 50-75 pages

#### Phase 5: Comparisons & Locations (Weeks 11-14)
- [ ] Optimize existing GoMerge comparison page
- [ ] Create 10 competitor comparison pages
- [ ] Build location page template
- [ ] Launch 15 location pages (markets with most listings)
- [ ] Implement ItemList schema for location listings

#### Phase 6: Monitor & Iterate (Ongoing)
- [ ] Track indexation rate in Search Console
- [ ] Monitor rankings for target keywords
- [ ] Update programmatic content with new data quarterly
- [ ] Expand location pages as listings grow
- [ ] Add new glossary terms monthly
- [ ] Publish 2-4 blog posts per month

---

## Part 4: Quick Wins (Implement Immediately)

These changes require minimal effort and have outsized impact:

### 1. Fix Title Tags (30 minutes)
Update every page to have a unique, keyword-rich title tag. See Section 1.2 for recommended titles.

### 2. Write Meta Descriptions (1 hour)
Every page needs a unique 150-160 character meta description. See Section 1.3 for recommendations.

### 3. Add Organization Schema (30 minutes)
Add this JSON-LD to every page:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://agencies.co/#organization",
      "name": "Agencies.co",
      "url": "https://agencies.co",
      "description": "Buy, sell, and merge marketing agencies",
      "founder": {
        "@type": "Person",
        "name": "Andy Day"
      },
      "sameAs": [
        "https://www.instagram.com/agencies.co",
        "https://twitter.com/agencies_co",
        "https://www.linkedin.com/company/agencies-co"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://agencies.co/#website",
      "name": "Agencies.co",
      "url": "https://agencies.co",
      "publisher": {"@id": "https://agencies.co/#organization"}
    }
  ]
}
```

### 4. Add Breadcrumb Schema (30 minutes)
Add BreadcrumbList schema to all pages showing the page hierarchy.

### 5. Noindex Utility Pages (10 minutes)
Add `<meta name="robots" content="noindex">` to:
- `/optin/`
- `/thank-you-nda/`
- `/sellers-vsl/`
- `/pricing-old/`

### 6. Generate XML Sitemap (30 minutes)
Create `/sitemap.xml` containing all indexable pages. Exclude noindexed pages.

### 7. Update Internal Links (1 hour)
- Add Buyers, Portfolio, Valuation to footer navigation
- Add contextual links between related pages
- Link blog posts to relevant service pages

---

## Part 5: Keyword Targeting Map

### Core Money Pages

| Page | Primary Keyword | Secondary Keywords |
|------|----------------|-------------------|
| /sell-your-agency/ | sell marketing agency | sell my agency, agency exit, agency sale |
| /buyers/ | buy marketing agency | acquire marketing agency, agency acquisition |
| /portfolio/ | marketing agencies for sale | agency listings, agencies for sale |
| /agency-valuation/ | marketing agency valuation | agency valuation, what is my agency worth |
| /agency-valuation-multiples/ | agency valuation multiples | agency multiples, marketing agency multiples |
| /pricing/ | agency M&A advisory pricing | agency broker fees, M&A advisor cost |

### Content/Informational Pages

| Page | Primary Keyword | Secondary Keywords |
|------|----------------|-------------------|
| /understanding-when-to-sell/ | when to sell my agency | should I sell my agency, right time to sell |
| /value-creation-playbook/ | agency value creation | increase agency value, agency growth playbook |
| /agency-owners/ | agency owner resources | agency ownership, agency founder guide |
| /deal-flow/ | agency deal flow | find agencies to buy, agency lead gen |

### Blog Topic Clusters

**Cluster 1: Selling an Agency**
- How to sell a marketing agency (pillar)
- Preparing your agency for sale
- Agency due diligence checklist
- What buyers look for in an agency
- Common mistakes when selling

**Cluster 2: Agency Valuation**
- How to value a marketing agency (pillar)
- EBITDA vs. SDE for agency valuation
- What drives agency multiples
- Revenue multiples vs. EBITDA multiples
- Factors that decrease agency value

**Cluster 3: M&A Process**
- The agency M&A process explained (pillar)
- Letter of intent guide
- Earnout structures
- Due diligence deep dive
- Closing the deal: what to expect

**Cluster 4: Buying an Agency**
- How to buy a marketing agency (pillar)
- Agency acquisition checklist
- Financing an agency acquisition
- Post-acquisition integration
- Roll-up strategy guide

---

## Part 6: Competitive Positioning

### Competitor Landscape

| Competitor | Strength | Agencies.co Differentiator |
|-----------|----------|---------------------------|
| FE International | Large deal volume, established brand | Marketing agency specialization |
| Quiet Light | Strong content/SEO presence | Niche focus on marketing/comms agencies |
| Digital Exits | Digital-first M&A | Broader marketing agency coverage |
| Empire Flippers | Marketplace model, verified listings | Higher-end agency deals, advisory |
| Flippa | Massive marketplace volume | Curated, vetted marketing agencies only |
| GoMerge | Direct competitor in agency M&A | Speed (90-day close), transparent pricing |

### Content Opportunity vs. Competitors

Most competitors in the agency M&A space have weak programmatic SEO. The glossary, type pages, and comparison pages represent a genuine first-mover opportunity for organic search dominance in this niche.

---

## Part 7: Monitoring & KPIs

### Track Monthly

| Metric | Baseline (Set Now) | 3-Month Target | 6-Month Target |
|--------|-------------------|----------------|----------------|
| Indexed pages | ~40 | 100+ | 200+ |
| Organic sessions | Current baseline | +50% | +150% |
| Keyword rankings (top 10) | Current baseline | +30 keywords | +100 keywords |
| Blog posts published | ~15 | 25 | 40 |
| Programmatic pages live | 0 | 20 (glossary) | 80+ |
| Backlinks | Current baseline | +20% | +50% |

### Tools Needed
- Google Search Console (essential, free)
- Google Analytics / GA4 (already installed)
- Ahrefs or Semrush (for keyword tracking and competitor monitoring)
- Screaming Frog (for technical audits)

---

## Appendix: Page-by-Page Issue Tracker

| Page | Title | Meta Desc | H1 | Schema | Content Depth | Internal Links | Priority |
|------|-------|-----------|-----|--------|--------------|----------------|----------|
| / | Fix | Fix | Check | Add | Expand | Fix | P1 |
| /sell-your-agency/ | **Fix** (duplicate) | Missing | Good | Add | Adequate | OK | P1 |
| /buyers/ | Fix | **Fix** (too short) | Check | Add | **Expand** | Fix | P1 |
| /agency-valuation/ | **Fix** (duplicate) | Missing | Check | Add | **Expand** | Fix | P1 |
| /agency-valuation-multiples/ | OK | OK | Check | Add | **Expand** | Fix | P2 |
| /portfolio/ | **Fix** (duplicate) | Missing | Check | Add | OK | OK | P1 |
| /pricing/ | OK | Missing | Check | Add | Add FAQ | OK | P2 |
| /sellers/ | OK | Missing | Good | Add | Good | OK | P2 |
| /deal-flow/ | Fix | **Fix** (too short) | Check | Add | **Expand** | Fix | P2 |
| /agency-owners/ | Fix | OK | Check | Add | **Expand** | Fix | P2 |
| /value-creation-playbook/ | Fix | Missing | Check | Add | **Expand** (add preview) | Fix | P3 |
| /understanding-when-to-sell/ | OK | Missing | OK | Add | Adequate | Fix | P3 |
| /contact-us/ | OK | Missing | OK | Add | OK | OK | P3 |
| /listing-questionnaire/ | OK | Missing | OK | Add | OK | OK | P3 |
| /ma-blog/ | OK | Missing | Check | Add | OK | Fix | P2 |
