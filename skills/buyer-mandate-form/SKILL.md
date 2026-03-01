---
name: buyer-mandate-form
version: 1.0.0
description: "When the user wants to build or optimize a buyer mandate form, acquisition marketplace, or M&A matching platform. Also use when the user mentions 'buyer mandate,' 'acquisition mandate,' 'agency marketplace,' 'M&A marketplace,' 'acquirer matching,' 'deal flow,' 'buyer intent,' or 'agency intel.' Covers mandate submission forms, agency profile/intel pages, claim flows, and buyer-agency matching logic. For general form optimization, see form-cro. For signup flows, see signup-flow-cro."
---

# Buyer Mandate Form & Agency M&A Marketplace

You are an expert in building two-sided M&A marketplaces — specifically platforms that match acquisition-minded buyers with agency founders considering a sale. Your goal is to help build buyer mandate listing forms, agency intel pages, and matching logic that drives qualified deal flow.

## Before Starting

**Check for product marketing context first:**
If `.claude/product-marketing-context.md` exists, read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Gather this context (ask if not provided):

### 1. Platform State
- Existing tech stack (framework, database, hosting)?
- Authentication already set up?
- Existing agency data (scraped, manual, imported)?
- Current database schema or ORM?

### 2. Marketplace Model
- Two-sided (buyers + agencies) or one-sided?
- Anonymised listings or named?
- Freemium, gated, or fully open?
- Revenue model (subscription, success fee, lead gen)?

### 3. Data Sources
- Where does agency data come from (scraping, manual entry, API)?
- What buyer data is collected?
- Any third-party enrichment (Companies House, LinkedIn, Crunchbase)?

---

## Feature 1: Buyer Mandate Listing

### What It Does
Buyers (PE firms, holding companies, strategic acquirers) submit a structured acquisition mandate describing what they want to buy. Mandates display publicly in anonymised form to attract inbound interest from agency founders.

### Mandate Form Fields

**Required fields:**

| Field | Type | Details |
|-------|------|---------|
| EV Range | Dual slider / min-max inputs | Min and max in local currency (e.g. £1m–£10m). Use defined brackets: <£1m, £1–3m, £3–5m, £5–8m, £8–15m, £15–30m, £30m+ |
| Geography | Multi-select | UK, US, EU, APAC, MENA, LATAM, Global. Allow multiple. |
| Headcount Range | Dual slider / min-max inputs | Brackets: 1–10, 11–25, 26–50, 51–100, 100–250, 250+ |
| Services Sought | Multi-select with predefined list | See services taxonomy below |
| Vertical/Sector Focus | Multi-select or free text tags | e.g. FinTech, HealthTech, eCommerce, B2B SaaS, DTC |

**Optional fields:**

| Field | Type | Details |
|-------|------|---------|
| Buyer Type | Select | PE-backed, Independent, Strategic, Family Office, Search Fund |
| Deal Structure Preference | Multi-select | Full acquisition, Majority stake, Minority stake, Earn-out |
| Timeline | Select | Active now, Next 3 months, Next 6 months, Exploratory |
| Revenue Model Preference | Multi-select | Retainer, Project, Performance, Product/SaaS, Mixed |
| Mandate Notes | Textarea | Free-text for additional context |

### Services Taxonomy

Use a standardised list for matching consistency:

- SEO / Organic Search
- PPC / Paid Search
- Paid Social
- Organic Social / Content
- Programmatic / Display
- Performance Marketing
- Brand Strategy / Creative
- Web Design / Development
- CRO / UX
- Email / CRM / Marketing Automation
- PR / Comms
- Influencer Marketing
- Video / Production
- Data / Analytics
- AI / MarTech
- Full Service / Integrated

### Anonymised Public Display

Mandates appear on a `/mandates` page showing buyer intent without identifying the buyer:

```
"PE-backed acquirer seeking £3–8m EV digital performance agency, UK"
"Strategic buyer looking for 25–50 person SEO agency, US/EU, FinTech focus"
```

**Display template:**
```
[Buyer Type] seeking [EV Range] [Services] agency, [Geography]{, [Vertical] focus}
```

Show as cards with:
- Anonymised headline (generated from structured data)
- Services sought (tags)
- Geography (tags)
- EV range
- Posted date / "Active" indicator
- CTA: "Register Interest" button

### Mandate Submitter Profile

- Mandate submitters create an account (email + password or magic link)
- Dashboard to view, edit, pause, or archive their mandates
- View inbound "register interest" submissions
- Email notifications when an agency registers interest

### "Register Interest" Flow

Each mandate card has a CTA for agency founders:
1. Agency founder clicks "Register Interest"
2. Collects: Name, Agency name, Email, Brief message (optional)
3. Sends automated email notification to mandate submitter
4. Stores the registration in the database for the buyer's dashboard
5. Sends confirmation email to the agency founder

**For database schema details**: See [references/schema.md](references/schema.md)

---

## Feature 2: Agency Intel Pages

### What It Does
Each agency in the database has a public profile page showing key intel. Agencies can claim and edit their page. Unclaimed pages show estimated/scraped data.

### Agency Profile Fields

| Field | Source | Editable After Claim |
|-------|--------|---------------------|
| Agency Name | Scraped / Manual | Yes |
| Services | Scraped / Estimated | Yes |
| Headcount Estimate | Scraped / Estimated | Yes |
| Geography / HQ Location | Scraped / Estimated | Yes |
| Estimated EV Range | Calculated / Estimated | Yes (validated) |
| "Open to Offers" Status | Default: Not Set | Yes |
| Website URL | Scraped | Yes |
| Founded Year | Scraped | Yes |
| Key Clients / Sectors | Scraped | Yes |
| Revenue Model | Not Set | Yes |

### Profile Page Layout

**Unclaimed page:**
- Banner: "Is this your agency? Claim this page to update your info" with CTA
- Data displayed with "Estimated" badges on uncertain fields
- No "Open to Offers" status shown
- Basic profile with available data

**Claimed page:**
- Verified badge next to agency name
- All fields editable by owner
- "Open to Offers" toggle (private by default — only shown to verified buyers)
- Enhanced profile with validated data

### Claim Flow

1. Agency founder clicks "Is this your agency?"
2. Enters their work email address
3. System verifies email domain matches agency website domain
4. Sends verification email with magic link
5. On verification: creates account, links to agency profile
6. Founder can now edit all profile fields

**Edge cases:**
- Domain mismatch: Manual review queue (flag for admin)
- Multiple claimants: First verified claim wins; others go to admin queue
- No matching agency: Allow "Add your agency" flow

### Admin View

Simple admin dashboard showing:
- Total agencies (claimed vs unclaimed count)
- Recently claimed agencies
- Agencies with "Open to Offers" enabled
- Agencies that registered interest in mandates
- Manual review queue (domain mismatches, disputes)
- Filter/search by name, status, geography

---

## Feature 3: Matching Logic

### When to Run Matching

1. **New mandate submitted** → Match against all agency profiles → Email summary to platform admin
2. **Agency claims or updates profile** → Check against active mandates → Flag matches to admin
3. **Agency enables "Open to Offers"** → Priority match against active mandates

### Matching Criteria

Score each agency–mandate pair on these dimensions:

| Criterion | Weight | Match Logic |
|-----------|--------|-------------|
| EV Range | High | Agency estimated EV overlaps with mandate EV range |
| Geography | High | Agency geography intersects mandate geography list |
| Services | Medium | At least one service overlap; more overlap = higher score |
| Headcount | Medium | Agency headcount falls within mandate headcount range |
| Vertical/Sector | Low | Any sector overlap (if mandate specifies sectors) |
| Open to Offers | Bonus | +20% score boost if agency is "Open to Offers" |

### Scoring Formula

```
score = (ev_match * 30) + (geo_match * 25) + (services_match * 20) +
        (headcount_match * 15) + (sector_match * 10)

if agency.open_to_offers:
    score *= 1.2

# ev_match: 1 if overlap, 0 if not
# geo_match: 1 if any intersection, 0 if not
# services_match: (overlapping_services / mandate_services) capped at 1
# headcount_match: 1 if within range, 0 if not
# sector_match: 1 if any overlap, 0.5 if mandate has no sector filter
```

### Match Output

Email to admin with:
- Mandate summary (anonymised buyer info)
- Top 10 matching agencies ranked by score
- For each: agency name, score, matching criteria breakdown
- Link to mandate and agency profiles in admin view

**For detailed matching algorithm and implementation**: See [references/matching-logic.md](references/matching-logic.md)

---

## Implementation Guide

### Recommended Build Order

1. **Database schema** — Add tables for mandates, agencies, interest registrations
2. **Agency profile pages** — Public pages with existing data
3. **Claim flow** — Email verification and account creation
4. **Mandate form** — Buyer submission with account creation
5. **Mandates listing page** — Public anonymised view
6. **Register interest flow** — CTA + email notifications
7. **Matching logic** — Background matching on create/update events
8. **Admin view** — Dashboard for managing agencies and mandates

### Schema Changes Needed

If extending an existing database, you likely need:

- `mandates` table (new)
- `mandate_services` junction table (new)
- `mandate_geographies` junction table (new)
- `mandate_sectors` junction table (new)
- `agencies` table (new or extend existing)
- `agency_services` junction table (new)
- `interest_registrations` table (new)
- `users` table (extend with role: buyer, agency_owner, admin)

**For full schema**: See [references/schema.md](references/schema.md)

### Email Notifications

Set up these automated emails:

| Trigger | Recipient | Content |
|---------|-----------|---------|
| Interest registered | Mandate submitter | "An agency has expressed interest in your mandate" |
| Interest registered | Agency founder | "Your interest has been registered" |
| New match found | Admin | "New mandate matches found: [count] agencies" |
| Agency claimed | Admin | "Agency [name] has been claimed by [email]" |
| Mandate submitted | Admin | "New buyer mandate submitted" |
| Verification | Agency founder | Magic link to verify and claim page |

### UI Consistency

- Match existing site typography, colour palette, and spacing
- Use existing component library (buttons, cards, form elements)
- Ensure mobile responsiveness on all new pages
- Add appropriate loading states and error handling

---

## Form UX Best Practices

### Mandate Form
- Multi-step form: Basic info → Preferences → Account creation
- Progress indicator showing current step
- Save draft functionality for returning users
- Inline validation on all fields
- Clear explanations for EV range and other financial terms
- "Preview" step showing anonymised listing before submission

### Register Interest Form
- Minimal fields (name, agency, email, optional message)
- Single-step modal or inline form
- Confirmation message with expected next steps
- No account required for initial registration

### Claim Form
- Single email field to start
- Clear domain-matching explanation
- Fallback for non-matching domains (manual review)
- Post-verification redirect to profile editor

---

## Measurement

### Key Metrics
- **Mandates submitted** per week/month
- **Interest registrations** per mandate
- **Claim rate**: % of agency pages claimed
- **Match quality**: Admin feedback on match relevance
- **Conversion**: Interest registrations → conversations → deals

### What to Track
- Mandate form start → completion rate
- Register interest click → submission rate
- Claim flow start → verification → profile completion
- Time from mandate submission to first interest registration
- Match score distribution and admin action rates

---

## Output Format

When implementing these features, provide:

### For Each Feature
- **Database migration/schema** with field types and relationships
- **API routes/endpoints** with request/response formats
- **Page components** matching existing design patterns
- **Email templates** for each notification trigger
- **Validation rules** for all form fields

### Deployment Checklist
- [ ] Database migrations applied
- [ ] Environment variables set (email service credentials)
- [ ] Email templates created and tested
- [ ] Admin user seeded
- [ ] Agency data imported/seeded
- [ ] All forms tested on mobile
- [ ] Error states handled gracefully
- [ ] Rate limiting on public forms

---

## Task-Specific Questions

1. What's your current tech stack and database?
2. Do you have existing agency data to import?
3. Is authentication already set up?
4. What email service are you using (Resend, SendGrid, etc.)?
5. Do you need the "Open to Offers" status visible to all buyers or only verified ones?
6. Should matching run in real-time or as a batch job?

---

## Related Skills

- **form-cro**: For optimising the mandate and registration forms
- **signup-flow-cro**: For the buyer/agency account creation flows
- **page-cro**: For optimising the mandates listing and agency profile pages
- **email-sequence**: For post-registration nurture sequences
- **programmatic-seo**: For generating SEO-friendly agency profile pages at scale
- **analytics-tracking**: For tracking conversion events across the marketplace
