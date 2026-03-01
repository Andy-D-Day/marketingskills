# Matching Logic Reference

Detailed implementation guide for the buyer–agency matching algorithm.

## Overview

The matching system compares buyer mandates against agency profiles to identify potential acquisition targets. It runs:

1. **On mandate creation** — match new mandate against all agencies
2. **On agency claim/update** — match updated agency against all active mandates
3. **On "Open to Offers" toggle** — re-score existing matches

## Matching Algorithm

### Step 1: Filter Candidates

Before scoring, apply hard filters to reduce the candidate set:

```python
# Pseudocode for candidate filtering
def get_candidates(mandate):
    candidates = Agency.query.filter(
        Agency.status == 'active'
    )

    # Hard filter: EV range must have some overlap
    if mandate.ev_min:
        candidates = candidates.filter(
            Agency.ev_estimate_max >= mandate.ev_min
        )
    if mandate.ev_max:
        candidates = candidates.filter(
            Agency.ev_estimate_min <= mandate.ev_max
        )

    return candidates
```

### Step 2: Score Each Candidate

```python
def calculate_match_score(mandate, agency):
    score = 0
    breakdown = {}

    # EV Range Match (30 points)
    ev_match = ranges_overlap(
        mandate.ev_min, mandate.ev_max,
        agency.ev_estimate_min, agency.ev_estimate_max
    )
    breakdown['ev_match'] = ev_match
    if ev_match:
        score += 30

    # Geography Match (25 points)
    mandate_geos = set(mandate.geographies)
    agency_geos = set(agency.geographies)
    geo_match = bool(mandate_geos & agency_geos) or 'Global' in mandate_geos
    breakdown['geo_match'] = geo_match
    if geo_match:
        score += 25

    # Services Match (20 points, proportional)
    mandate_svcs = set(mandate.services)
    agency_svcs = set(agency.services)
    if mandate_svcs:
        overlap = mandate_svcs & agency_svcs
        services_pct = len(overlap) / len(mandate_svcs)
        score += round(20 * services_pct)
    else:
        services_pct = 0.5  # no preference = half credit
        score += 10
    breakdown['services_pct'] = services_pct

    # Headcount Match (15 points)
    headcount_match = ranges_overlap(
        mandate.headcount_min, mandate.headcount_max,
        agency.headcount_min, agency.headcount_max
    )
    breakdown['headcount_match'] = headcount_match
    if headcount_match:
        score += 15

    # Sector Match (10 points)
    mandate_sectors = set(mandate.sectors)
    agency_sectors = set(agency.sectors)
    if mandate_sectors:
        sector_match = bool(mandate_sectors & agency_sectors)
        if sector_match:
            score += 10
    else:
        score += 5  # no sector filter = half credit
        sector_match = True
    breakdown['sector_match'] = sector_match

    # Open to Offers bonus (20% multiplier)
    if agency.open_to_offers:
        score = round(score * 1.2)
        breakdown['open_to_offers'] = True
    else:
        breakdown['open_to_offers'] = False

    return min(score, 100), breakdown
```

### Helper: Range Overlap

```python
def ranges_overlap(min_a, max_a, min_b, max_b):
    """Check if two numeric ranges overlap. None means unbounded."""
    effective_min_a = min_a or 0
    effective_max_a = max_a or float('inf')
    effective_min_b = min_b or 0
    effective_max_b = max_b or float('inf')

    return effective_min_a <= effective_max_b and effective_min_b <= effective_max_a
```

### Step 3: Rank and Store

```python
def run_matching(mandate):
    candidates = get_candidates(mandate)
    results = []

    for agency in candidates:
        score, breakdown = calculate_match_score(mandate, agency)

        if score >= MINIMUM_SCORE_THRESHOLD:  # e.g. 30
            match = Match(
                mandate_id=mandate.id,
                agency_id=agency.id,
                score=score,
                ev_match=breakdown['ev_match'],
                geo_match=breakdown['geo_match'],
                services_pct=breakdown['services_pct'],
                headcount_match=breakdown['headcount_match'],
                sector_match=breakdown['sector_match'],
                open_to_offers=breakdown['open_to_offers'],
                status='new'
            )
            results.append(match)

    # Upsert matches (update score if pair already exists)
    upsert_matches(results)

    # Get top matches for notification
    top_matches = sorted(results, key=lambda m: m.score, reverse=True)[:10]
    return top_matches
```

---

## JavaScript / TypeScript Implementation

```typescript
interface Mandate {
  id: string;
  evMin: number | null;
  evMax: number | null;
  headcountMin: number | null;
  headcountMax: number | null;
  geographies: string[];
  services: string[];
  sectors: string[];
}

interface Agency {
  id: string;
  name: string;
  evEstimateMin: number | null;
  evEstimateMax: number | null;
  headcountMin: number | null;
  headcountMax: number | null;
  geographies: string[];
  services: string[];
  sectors: string[];
  openToOffers: boolean;
}

interface MatchResult {
  mandateId: string;
  agencyId: string;
  score: number;
  evMatch: boolean;
  geoMatch: boolean;
  servicesPct: number;
  headcountMatch: boolean;
  sectorMatch: boolean;
  openToOffers: boolean;
}

function rangesOverlap(
  minA: number | null, maxA: number | null,
  minB: number | null, maxB: number | null
): boolean {
  const effectiveMinA = minA ?? 0;
  const effectiveMaxA = maxA ?? Infinity;
  const effectiveMinB = minB ?? 0;
  const effectiveMaxB = maxB ?? Infinity;
  return effectiveMinA <= effectiveMaxB && effectiveMinB <= effectiveMaxA;
}

function calculateMatchScore(mandate: Mandate, agency: Agency): MatchResult {
  let score = 0;

  // EV Range Match (30 points)
  const evMatch = rangesOverlap(
    mandate.evMin, mandate.evMax,
    agency.evEstimateMin, agency.evEstimateMax
  );
  if (evMatch) score += 30;

  // Geography Match (25 points)
  const mandateGeos = new Set(mandate.geographies);
  const agencyGeos = new Set(agency.geographies);
  const geoMatch =
    mandateGeos.has('Global') ||
    [...mandateGeos].some(g => agencyGeos.has(g));
  if (geoMatch) score += 25;

  // Services Match (20 points, proportional)
  let servicesPct = 0;
  if (mandate.services.length > 0) {
    const mandateSvcs = new Set(mandate.services);
    const overlap = mandate.services.filter(s =>
      agency.services.includes(s)
    );
    servicesPct = overlap.length / mandateSvcs.size;
    score += Math.round(20 * servicesPct);
  } else {
    servicesPct = 0.5;
    score += 10;
  }

  // Headcount Match (15 points)
  const headcountMatch = rangesOverlap(
    mandate.headcountMin, mandate.headcountMax,
    agency.headcountMin, agency.headcountMax
  );
  if (headcountMatch) score += 15;

  // Sector Match (10 points)
  let sectorMatch = false;
  if (mandate.sectors.length > 0) {
    sectorMatch = mandate.sectors.some(s =>
      agency.sectors.includes(s)
    );
    if (sectorMatch) score += 10;
  } else {
    sectorMatch = true;
    score += 5;
  }

  // Open to Offers bonus
  if (agency.openToOffers) {
    score = Math.round(score * 1.2);
  }

  return {
    mandateId: mandate.id,
    agencyId: agency.id,
    score: Math.min(score, 100),
    evMatch,
    geoMatch,
    servicesPct,
    headcountMatch,
    sectorMatch,
    openToOffers: agency.openToOffers,
  };
}

const MINIMUM_SCORE_THRESHOLD = 30;

async function runMatching(mandate: Mandate, agencies: Agency[]) {
  const results: MatchResult[] = [];

  for (const agency of agencies) {
    const match = calculateMatchScore(mandate, agency);
    if (match.score >= MINIMUM_SCORE_THRESHOLD) {
      results.push(match);
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  // Store matches in database
  await upsertMatches(results);

  // Return top 10 for email notification
  return results.slice(0, 10);
}
```

---

## Triggering Matches

### On Mandate Creation

```typescript
// In your mandate creation handler
async function handleMandateCreated(mandate: Mandate) {
  // Fetch all active agencies
  const agencies = await db.agencies.findMany({
    where: { status: 'active' },
    include: { services: true, geographies: true, sectors: true },
  });

  const topMatches = await runMatching(mandate, agencies);

  if (topMatches.length > 0) {
    await sendMatchNotificationToAdmin({
      mandate,
      matches: topMatches,
      totalCount: topMatches.length,
    });
  }
}
```

### On Agency Update

```typescript
// In your agency update/claim handler
async function handleAgencyUpdated(agency: Agency) {
  // Fetch all active mandates
  const mandates = await db.mandates.findMany({
    where: { status: 'active' },
    include: { services: true, geographies: true, sectors: true },
  });

  for (const mandate of mandates) {
    const match = calculateMatchScore(mandate, agency);
    if (match.score >= MINIMUM_SCORE_THRESHOLD) {
      await upsertMatch(match);
    }
  }

  // Notify admin of any new/updated matches
  const newMatches = await db.matches.findMany({
    where: {
      agencyId: agency.id,
      status: 'new',
    },
    include: { mandate: true },
  });

  if (newMatches.length > 0) {
    await sendAgencyMatchNotification({
      agency,
      matches: newMatches,
    });
  }
}
```

---

## Email Notification Templates

### Match Summary (to Admin)

```
Subject: New mandate matches: [Mandate headline]

A new buyer mandate has been submitted with [X] potential agency matches.

MANDATE SUMMARY
───────────────
Buyer Type: [PE-backed]
EV Range: [£3–8m]
Geography: [UK, EU]
Services: [SEO, PPC, Performance Marketing]
Sectors: [FinTech, B2B SaaS]
Headcount: [25–100]

TOP MATCHES
───────────
1. [Agency Name] — Score: 85/100
   ✓ EV overlap  ✓ Geography  ✓ Services (3/3)  ✓ Headcount  ✓ Open to offers
   → View profile: [link]

2. [Agency Name] — Score: 72/100
   ✓ EV overlap  ✓ Geography  ✓ Services (2/3)  ✓ Headcount  ✗ Not open
   → View profile: [link]

3. [Agency Name] — Score: 65/100
   ✓ EV overlap  ✗ Geography  ✓ Services (3/3)  ✓ Headcount  ✗ Not open
   → View profile: [link]

[View all matches in admin →]
```

### Interest Registration (to Buyer)

```
Subject: An agency is interested in your mandate

An agency founder has registered interest in your acquisition mandate.

AGENCY DETAILS
──────────────
Name: [Contact Name]
Agency: [Agency Name]
Email: [email]

MESSAGE
───────
[Optional message from agency founder]

YOUR MANDATE
────────────
[Anonymised mandate headline]

[View in your dashboard →]
```

### Interest Confirmation (to Agency Founder)

```
Subject: Your interest has been registered

Thanks for registering your interest. The buyer has been notified and
will be in touch if there's a good fit.

MANDATE
───────
[Anonymised mandate headline]
EV Range: [£3–8m]
Services sought: [SEO, PPC, Performance Marketing]

What happens next:
1. The buyer reviews your submission
2. If interested, they'll reach out directly
3. All discussions are confidential
```

---

## Score Interpretation

| Score Range | Meaning | Action |
|-------------|---------|--------|
| 80–100 | Strong match | Highlight to admin, consider auto-notification |
| 60–79 | Good match | Include in summary email |
| 40–59 | Partial match | Include but lower priority |
| 30–39 | Weak match | Store but don't notify |
| < 30 | No meaningful match | Don't store |

---

## Performance Considerations

- **Index key columns**: geography, services, EV ranges on both mandate and agency tables
- **Batch processing**: If > 1000 agencies, process in batches of 100
- **Caching**: Cache agency service/geography sets if matching runs frequently
- **Background jobs**: Run matching async (queue job) rather than blocking the request
- **Incremental matching**: When an agency updates, only re-match against mandates where the changed fields are relevant

## Future Enhancements

- **Weighted scoring per buyer**: Let buyers configure which criteria matter most
- **Machine learning**: Learn from admin actions (actioned vs dismissed) to improve scoring
- **Auto-notifications**: Notify agency founders when a strong-match mandate is posted (opt-in)
- **Match decay**: Lower match scores over time if no action taken
- **Exclusion lists**: Let buyers exclude agencies they've already evaluated
