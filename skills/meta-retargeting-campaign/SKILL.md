---
name: meta-retargeting-campaign
version: 1.0.0
description: "When the user wants to run a Meta (Facebook/Instagram) retargeting campaign targeting specific website visitors. Use when the user mentions 'retargeting,' 'remarket to visitors,' 'Meta pixel audience,' 'website custom audience,' or wants to bring back users who visited specific pages. Covers campaign strategy, audience creation, ad creative, and step-by-step Meta Ads Manager setup. For general paid ads, see paid-ads."
---

# Meta Retargeting Campaign

You are an expert Meta Ads retargeting strategist. Your goal is to help the user create a retargeting campaign that re-engages specific website visitors and drives them to convert.

## Before Starting

**Check for product marketing context first:**
If `.claude/product-marketing-context.md` exists, read it before asking questions. Use that context and only ask for information not already covered.

Gather this context (ask if not provided):

### 1. Retargeting Goal
- What action should retargeted visitors take? (Sign up, purchase, book a demo, list a product)
- What's the target CPA or value of a conversion?
- What's the daily/weekly budget for this campaign?

### 2. Website & Pixel
- What's the website URL visitors came from?
- Is the Meta Pixel already installed on the site?
- Are custom events or standard events firing? (PageView, ViewContent, Lead, etc.)
- How much traffic does the site get monthly?

### 3. Audience Definition
- Which specific visitors do you want to retarget? (All visitors, specific page visitors, time-on-site, frequency)
- What is the visitor intent? (Browsing, evaluating, abandoned signup)
- What exclusions are needed? (Existing customers, already converted, bounced)

### 4. Creative Assets
- Do you have existing creative (images, videos)?
- What's the primary offer or value proposition for this audience?
- Any brand guidelines to follow?

---

## Campaign Strategy: Retargeting Website Visitors

This framework applies to retargeting a defined group of website visitors — for example, sellers who visited a listing page like agences.co but didn't complete the action.

### Campaign Structure

```
Account
├── Campaign: Retargeting - [Site] Sellers
│   ├── Ad Set 1: Hot - Visited listing page (1-7 days)
│   │   ├── Ad 1: Direct CTA - "List your agency"
│   │   ├── Ad 2: Social proof - "Join X agencies already listed"
│   │   └── Ad 3: Objection handler - "Free to list, takes 2 minutes"
│   ├── Ad Set 2: Warm - Visited listing page (8-30 days)
│   │   ├── Ad 1: Value proposition - benefits of listing
│   │   ├── Ad 2: Testimonial/case study
│   │   └── Ad 3: Limited-time incentive (if applicable)
│   └── Ad Set 3: Cold - Visited any page (31-60 days)
│       ├── Ad 1: Brand reminder + CTA
│       └── Ad 2: New feature or update angle
```

### Naming Convention

```
META_Retarget_[Audience]_[Offer]_[Window]_[Date]

Examples:
META_Retarget_AgencesSellers_ListFree_1-7d_2026Q1
META_Retarget_AgencesSellers_SocialProof_8-30d_2026Q1
META_Retarget_AgencesSellers_Reminder_31-60d_2026Q1
```

### Budget Allocation by Window

| Ad Set | Window | Budget Share | Rationale |
|--------|--------|-------------|-----------|
| Hot | 1-7 days | 50% | Highest intent, freshest memory |
| Warm | 8-30 days | 35% | Still interested, needs a nudge |
| Cold | 31-60 days | 15% | Low intent, brand reminder only |

**Minimum daily budget:** $10-20/day per ad set for Meta's algorithm to optimize effectively.

---

## Audience Definitions

### Primary Audience: Specific Page Visitors

Target visitors who viewed a particular page (e.g., the seller listing page on agences.co) but did **not** complete the desired action.

**Custom Audience parameters:**
- **Source**: Website (Meta Pixel)
- **Event**: PageView or ViewContent
- **URL contains**: the target page path (e.g., `/list`, `/sell`, `/for-agencies`)
- **Retention window**: Split into 1-7, 8-30, 31-60 day segments
- **Exclude**: People who completed the conversion event (Lead, CompleteRegistration, or custom event)

### Exclusions (Critical)

Always exclude:
- **Converted users** — anyone who already completed the listing/signup
- **Bounced visitors** — under 10 seconds on site (if custom event tracks this)
- **Internal team** — exclude by email list or IP-based audience
- **Irrelevant pages** — visitors who only viewed careers, blog, or support pages (unless desired)

### Lookalike Expansion (Phase 2)

Once retargeting runs and you have conversion data:
1. Create a Lookalike from your **converted retargeting audience**
2. Start at 1% similarity
3. Use this as a prospecting campaign alongside your retargeting

---

## Ad Creative Strategy

### Messaging by Funnel Stage

**Hot (1-7 days) — Direct response:**
- Lead with the action: "You were checking out [site]. Ready to list?"
- Minimize friction: "Takes 2 minutes. Free to list."
- Urgency: "New sellers are getting discovered this week"

**Warm (8-30 days) — Social proof & value:**
- Social proof: "Join [X] agencies already listed on [site]"
- Benefits: "Get discovered by [X] buyers searching monthly"
- Case study: "How [Agency Name] got 12 new leads in their first month"

**Cold (31-60 days) — Re-engage:**
- Brand reminder: "Still looking for more clients? [Site] can help"
- New angle: Highlight a new feature, stat, or update since they visited
- Soft CTA: "See what's new" rather than hard sell

### Ad Format Recommendations

| Format | Best For | Notes |
|--------|----------|-------|
| **Single image** | Direct CTA, simple message | Use product screenshot or clean graphic |
| **Carousel** | Multiple benefits or steps | Show "3 reasons to list" or "How it works" |
| **Video (15-30s)** | Testimonials, walkthroughs | Native feel outperforms polished |
| **Stories/Reels** | Younger audiences, mobile | Vertical, text overlay, fast-paced |

### Creative Guidelines

- **Headline**: 5-8 words, action-oriented
- **Primary text**: 2-3 sentences max, lead with benefit or social proof
- **CTA button**: "Sign Up," "Learn More," or "Get Started"
- **Image**: Show the product/site interface, real people, or stats
- **No more than 20% text on images** (Meta guideline)

---

## Campaign Settings

### Objective
- **SALES** or **LEADS** — optimize for the conversion event (CompleteRegistration, Lead, or custom event)
- Do **not** use TRAFFIC or AWARENESS for retargeting — you want conversions, not clicks

### Optimization & Delivery
- **Optimization event**: The conversion closest to your goal (e.g., CompleteRegistration)
- **Attribution window**: 7-day click, 1-day view (default, recommended)
- **Bid strategy**: Lowest cost (start here), then switch to cost cap once you know your target CPA

### Placements
- **Start with**: Advantage+ Placements (let Meta optimize)
- **If budget is limited**: Facebook Feed, Instagram Feed, Instagram Stories only
- **Avoid for retargeting**: Audience Network (lower quality for direct response)

### Frequency Caps

| Window | Max Frequency | Action if Exceeded |
|--------|--------------|-------------------|
| 1-7 days | 5-7x/week | Acceptable — high intent |
| 8-30 days | 3-4x/week | Refresh creative if fatigue |
| 31-60 days | 1-2x/week | Keep light, brand-only |

Monitor frequency in Ads Manager. If frequency exceeds these thresholds and CTR drops, rotate creative.

---

## Measurement & Optimization

### Key Metrics to Track

| Metric | Target Range | Action if Off |
|--------|-------------|---------------|
| **CTR** | >1.5% for retargeting | Refresh creative/messaging |
| **CPA** | Below your target | Scale budget 20% if hitting |
| **Frequency** | See caps above | Rotate creative |
| **ROAS** | >2x minimum | Shift budget to best ad sets |
| **Conversion rate** | >5% (retargeting) | Check landing page if low |

### Weekly Optimization Checklist

- [ ] Check spend vs. budget pacing
- [ ] Review CPA by ad set (hot/warm/cold)
- [ ] Check frequency — rotate creative if fatigued
- [ ] Pause underperforming ads (>2x target CPA after 1,000+ impressions)
- [ ] Test one new creative per ad set per week
- [ ] Verify exclusion audiences are updating
- [ ] Compare Meta attribution to GA4 data

### When to Scale

Scale when:
- CPA is consistently below target for 7+ days
- Frequency is within caps
- Conversion volume is 50+ per week per ad set

Scale by:
- Increasing budget 20-30% at a time
- Waiting 3-5 days between increases
- Expanding retention windows (e.g., add 61-90 day segment)
- Creating Lookalike audiences from converters

---

## Step-by-Step Setup Guide

For the complete walkthrough of setting this up in Meta Ads Manager, including Pixel installation, audience creation, and campaign launch: See [references/meta-retargeting-setup-guide.md](references/meta-retargeting-setup-guide.md)

---

## Common Mistakes

- **No conversion exclusion** — wasting spend showing ads to people who already converted
- **Single retargeting window** — treating 1-day and 30-day visitors the same
- **Wrong objective** — using Traffic instead of Conversions/Sales
- **Creative fatigue** — same ads for months without rotation
- **Too small an audience** — retargeting pool under 1,000 people won't spend efficiently
- **No frequency monitoring** — annoying users instead of persuading them
- **Missing Pixel events** — only tracking PageView, not the actual conversion event

---

## Tool Integrations

| Tool | Use For | Guide |
|------|---------|-------|
| **Meta Ads** | Campaign management, audiences | [meta-ads.md](../../tools/integrations/meta-ads.md) |
| **GA4** | Cross-reference attribution | [ga4.md](../../tools/integrations/ga4.md) |
| **Segment** | Event tracking pipeline | [segment.md](../../tools/integrations/segment.md) |

---

## Related Skills

- **paid-ads**: General paid advertising strategy across all platforms
- **page-cro**: Optimize the landing page retargeted visitors arrive at
- **analytics-tracking**: Set up conversion tracking and attribution
- **copywriting**: Write compelling ad copy and landing page content
- **ab-test-setup**: Test landing page variants for retargeted traffic
