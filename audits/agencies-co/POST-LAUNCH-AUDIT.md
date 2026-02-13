# Agencies.co Post-Launch SEO Audit

**Site**: https://agencies.co
**Date**: February 13, 2026
**Scope**: Post-launch audit of 116 programmatic SEO pages + core site review

---

## Executive Summary

Following the creation of 116 programmatic SEO pages across 5 playbooks, this audit evaluates what shipped and what needed fixing.

**Wins:** XML sitemap (267 URLs), schema markup (JSON-LD) on all pages, 5 hub pages properly linking children, glossary/location/comparison pages with strong content.

**Issues found and fixed via WP API:**
- Duplicate H1 tags on 168 pages (removed)
- "Agencys" typo on 60 sell/buy pages (fixed to "Agencies")
- Meta descriptions set on 110 programmatic + 6 core pages
- Cross-links added between 60 sell/buy/valuation pages
- HTML sitemap updated with 162 links
- CSS code removed from agency-valuation-multiples content

**Remaining issues (require Replit front-end changes):**
- New hubs not in header navigation
- Footer links incomplete
- Copyright year still 2023
- No Open Graph tags
- SSR/pre-rendering needed for blog and CSR pages
- Redirects needed for /privacy-policy-2/ and /pricing-old/

---

## Part 1: What's Working

| Area | Status | Details |
|------|--------|---------|
| XML sitemap | Good | `/sitemap.xml` — 267 URLs |
| robots.txt | Good | Proper disallows, Sitemap reference |
| Schema markup | Good | JSON-LD: Organization, WebSite, BreadcrumbList, Article on all pages |
| Hub pages (5) | Good | /sell/, /buy/, /compare/, /agencies-for-sale/, /agency-valuation-by-type/ |
| Glossary (47 terms) | Good | Well-written definitions, 400-600 words each |
| Location pages (35+) | Good | 1,200+ words, data tables, local market stats |
| Comparison pages (15) | Good | Balanced, 800+ words, feature tables |
| Sell/Buy personas (40) | Fixed | Content renders, bugs corrected (see below) |

---

## Part 2: Issues Found & Fixed

### Fixed via WordPress API

| Issue | Scope | Action Taken |
|-------|-------|-------------|
| Duplicate H1 tags | 168 pages | Removed `<h1>` from content (theme renders title as H1) |
| "Agencys" typo | 60 sell/buy pages | Replaced with "Agencies" |
| CSS in content | agency-valuation-multiples | Removed inline CSS code |
| Missing/bad meta descriptions | 110 programmatic pages | Set proper excerpts via API |
| Bad meta descriptions on core pages | homepage, sell-your-agency, agency-valuation, buyers, pricing, deal-flow | Set proper excerpts |
| No cross-linking | 60 sell/buy/valuation pages | Added "Related Pages" section linking sell↔buy↔valuation |
| Outdated HTML sitemap | /sitemap/ page | Updated with 162 links across all sections |

### Remaining (Replit front-end changes needed)

| Issue | Priority | Details |
|-------|----------|---------|
| Navigation missing new hubs | P1 | /glossary/, /compare/, /agencies-for-sale/ not in header |
| Footer incomplete | P1 | Missing Portfolio, Valuation, Glossary links |
| No Open Graph tags | P1 | Social shares show blank previews |
| Homepage title generic | P1 | "Home \| Agencies.co" — needs keywords |
| Copyright year 2023 | P2 | Should be 2026 or dynamic |
| Client-side rendering | P2 | Blog page invisible to non-JS crawlers |
| /privacy-policy-2/ exists | P2 | Redirect to /privacy-policy/ |
| /pricing-old/ exists | P2 | Redirect to /pricing/ |
| Utility pages indexable | P2 | /optin/, /thank-you-nda/ need noindex |

---

## Part 3: Page Inventory

**Total pages in XML sitemap: 267**

| Category | Count |
|----------|-------|
| Core pages | 7 |
| Resource pages | 7 |
| Agency listings | 32 |
| Blog posts | 16 |
| Case studies | 7 |
| Glossary terms | 47 |
| Sell by type | 21 (hub + 20 types) |
| Buy by type | 21 (hub + 20 types) |
| Valuation by type | 21 (hub + 20 types) |
| Comparison pages | 16 (hub + 15 competitors) |
| Location pages | 36 (hub + 35 locations) |

---

## Deliverables

| File | Description |
|------|-------------|
| `POST-LAUNCH-AUDIT.md` | This audit report |
| `REPLIT-FRONTEND-REQUIREMENTS.md` | Handoff doc for remaining front-end fixes |
