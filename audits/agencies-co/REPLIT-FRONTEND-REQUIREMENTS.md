# Replit Front-End Requirements

**Date**: February 13, 2026
**Context**: Post-launch fixes for agencies.co programmatic SEO pages

These changes require modifications to the Replit front-end app and cannot be done via the WordPress API.

---

## P1: Navigation Updates

### Header Navigation
Add the new section hubs to the main navigation. Suggested structure:

```
Home | Learn | Buy ▼ | Sell ▼ | Compare | Valuation | Locations
```

**Buy dropdown:**
- Browse All Listings → `/portfolio/`
- Buy by Agency Type → `/buy/`
- Agencies for Sale by Location → `/agencies-for-sale/`

**Sell dropdown:**
- Sell Your Agency → `/sell-your-agency/`
- Sell by Agency Type → `/sell/`
- Agency Valuation → `/agency-valuation/`
- Valuation by Type → `/agency-valuation-by-type/`

**Also add to nav:**
- Compare → `/compare/`
- Glossary → `/glossary/`

### Footer Links
Add these to footer:
- Portfolio/Listings → `/portfolio/`
- Agency Valuation → `/agency-valuation/`
- Glossary → `/glossary/`
- Compare → `/compare/`
- Agencies by Location → `/agencies-for-sale/`
- Sitemap → `/sitemap/`

### Copyright Year
Update `2023` → `2026` (or make it dynamic with `new Date().getFullYear()`)

---

## P1: SEO Head Tags

### Open Graph Tags
For all pages, inject into `<head>`:
```html
<meta property="og:title" content="{page title}">
<meta property="og:description" content="{page excerpt}">
<meta property="og:url" content="https://agencies.co{path}">
<meta property="og:site_name" content="Agencies.co">
<meta property="og:type" content="website">
<meta property="og:image" content="{default social image URL}">
```

The page excerpt is available from the WP API response at `excerpt.rendered` (strip HTML tags).

### Meta Description
Ensure the `<meta name="description">` tag uses the page excerpt from WP API:
```html
<meta name="description" content="{stripped excerpt}">
```

### Homepage Title
The homepage title should be:
```
Agencies.co — Buy, Sell & Merge Marketing Agencies
```
Not `Home | Agencies.co`.

---

## P2: Redirects

Add these server-side redirects:

| From | To | Type |
|------|----|------|
| `/privacy-policy-2/` | `/privacy-policy/` | 301 |
| `/pricing-old/` | `/pricing/` | 301 |

---

## P2: SSR / Pre-rendering

The blog page (`/ma-blog/`) and some other pages only render content client-side. Google's initial crawl pass may not execute JavaScript, meaning content is invisible.

**Options (in order of preference):**
1. **Server-side rendering (SSR)** — render HTML on the server for each request
2. **Static site generation** — pre-build HTML at deploy time
3. **Dynamic pre-rendering** — detect crawlers via User-Agent and serve pre-rendered HTML

This is the single most impactful technical SEO fix remaining.

---

## P2: Noindex Utility Pages

Add `<meta name="robots" content="noindex">` to:
- `/optin/`
- `/thank-you-nda/`
- `/sellers-vsl/`

These are conversion/utility pages that shouldn't appear in search results.

---

## Summary of Changes Made via WordPress API (already done)

For reference, these fixes have already been applied:
- Removed duplicate H1 tags from 168 pages
- Fixed "Agencys" → "Agencies" typo on 60 pages
- Removed CSS code from agency-valuation-multiples page content
- Set proper meta descriptions (excerpts) on 110 programmatic pages
- Set proper meta descriptions on 6 core pages (homepage, sell, valuation, buyers, pricing, deal-flow)
- Added cross-links between 60 sell/buy/valuation pages
- Updated HTML sitemap page with 162 links covering all new pages
