# Meta Retargeting Setup Guide — Step by Step

Complete walkthrough for setting up a Meta retargeting campaign targeting specific website visitors (e.g., sellers who visited agences.co).

---

## Prerequisites

Before you start, confirm you have:

- [ ] Access to **Meta Business Suite** (business.facebook.com)
- [ ] Admin or Advertiser role on the **Ad Account**
- [ ] A **Facebook Page** connected to the ad account
- [ ] A **payment method** added to the ad account
- [ ] The **website URL** you want to retarget from (e.g., agences.co)
- [ ] A **landing page** for the ad to point to (e.g., agences.co/list or a dedicated listing page)

---

## Step 1: Install the Meta Pixel

The Meta Pixel tracks visitors on your website and feeds that data back to Meta for audience building.

### 1.1 Create the Pixel

1. Go to **Meta Events Manager**: https://business.facebook.com/events_manager
2. Click **Connect Data Sources** → **Web** → **Connect**
3. Name your pixel (e.g., "Agences.co Pixel")
4. Enter your website URL
5. Click **Continue**

### 1.2 Install the Pixel Code

**Option A: Manual installation (recommended for control)**

1. In Events Manager, click your Pixel → **Settings** → **Install code manually**
2. Copy the base pixel code
3. Paste it in the `<head>` section of **every page** on your site

The base code looks like this:

```html
<!-- Meta Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->
```

**Option B: Partner integration**

If your site runs on Webflow, WordPress, Shopify, or another platform:
1. In Events Manager → **Settings** → **Install via partner integration**
2. Select your platform
3. Follow the platform-specific instructions

**Option C: Google Tag Manager**

1. In GTM, create a new **Custom HTML** tag
2. Paste the Meta Pixel base code
3. Set trigger to **All Pages**
4. Publish the container

### 1.3 Verify Installation

1. Install the **Meta Pixel Helper** Chrome extension
2. Visit your website
3. The extension icon should show a green checkmark and log "PageView" events
4. In Events Manager, check that events are appearing in the **Test Events** tab

---

## Step 2: Set Up Conversion Events

You need to track the action you want retargeted visitors to complete (e.g., listing an agency, signing up).

### 2.1 Standard Events (Recommended)

Add event code to fire on the conversion page (e.g., thank-you or confirmation page):

```html
<!-- Fire on the conversion/thank-you page only -->
<script>
  fbq('track', 'CompleteRegistration', {
    content_name: 'Seller Listing',
    status: true
  });
</script>
```

**Common standard events for this use case:**

| Event | When to Fire |
|-------|-------------|
| `ViewContent` | Visitor views the listing/sell page |
| `Lead` | Visitor starts the listing form |
| `CompleteRegistration` | Visitor completes the listing/signup |

### 2.2 Custom Events (If Standard Events Don't Fit)

```html
<script>
  fbq('trackCustom', 'SellerListingComplete', {
    listing_type: 'agency',
    source: 'retargeting'
  });
</script>
```

### 2.3 Verify Events

1. Go to Events Manager → **Test Events**
2. Enter your website URL and click **Open Website**
3. Complete the conversion flow on your site
4. Confirm the event appears in the Test Events log
5. Wait 24 hours for events to start populating in Audiences

---

## Step 3: Create Custom Audiences

This is where you define exactly which visitors to retarget.

### 3.1 Create the "Visited Listing Page" Audience

1. Go to **Meta Ads Manager** → **Audiences** (https://business.facebook.com/adsmanager/audiences)
2. Click **Create Audience** → **Custom Audience**
3. Select **Website** as the source
4. Configure:

**For the Hot audience (1-7 days):**

| Setting | Value |
|---------|-------|
| Source | Your Pixel |
| Events | People who visited specific web pages |
| URL contains | `/list` or `/sell` or `/for-agencies` (your target page path) |
| In the past | **7** days |
| Audience name | `RT - Agences Sellers - Hot - 1-7d` |

5. Click **Create Audience**

**Repeat for Warm (8-30 days):**

| Setting | Value |
|---------|-------|
| Events | People who visited specific web pages |
| URL contains | Same page path |
| In the past | **30** days |
| Exclude | The Hot audience (1-7d) |
| Audience name | `RT - Agences Sellers - Warm - 8-30d` |

**Repeat for Cold (31-60 days):**

| Setting | Value |
|---------|-------|
| Events | People who visited specific web pages |
| In the past | **60** days |
| Exclude | The Warm audience (1-30d) |
| Audience name | `RT - Agences Sellers - Cold - 31-60d` |

### 3.2 Create the Exclusion Audience (Converted Users)

1. Click **Create Audience** → **Custom Audience** → **Website**
2. Configure:

| Setting | Value |
|---------|-------|
| Source | Your Pixel |
| Events | CompleteRegistration (or your conversion event) |
| In the past | **180** days |
| Audience name | `Exclude - Converted Sellers` |

3. Click **Create Audience**

### 3.3 Wait for Audience Population

- Audiences start populating immediately but may take **24-48 hours** to reach usable size
- Meta requires a **minimum of ~1,000 people** in an audience for efficient delivery
- Check audience size in the Audiences dashboard
- If your audience is too small, consider widening the page path or extending the retention window

---

## Step 4: Create the Campaign

### 4.1 Start a New Campaign

1. Go to **Ads Manager** → click **+ Create**
2. Select campaign objective: **Sales** (or **Leads** if you don't have purchase/registration events yet)
3. Name the campaign: `META_Retarget_AgencesSellers_ListFree_2026Q1`
4. Leave **Advantage Campaign Budget** OFF (you'll set budgets per ad set)
5. Click **Next**

### 4.2 Set Up Ad Set 1: Hot (1-7 Days)

**Audience:**

1. In the **Audience** section, click **Custom Audiences**
2. Select: `RT - Agences Sellers - Hot - 1-7d`
3. In **Exclude**, add: `Exclude - Converted Sellers`
4. Leave demographics broad (don't restrict age/gender/location unless your audience is large enough)

**Budget & Schedule:**

| Setting | Value |
|---------|-------|
| Daily budget | 50% of total daily budget (e.g., $15 if total is $30/day) |
| Schedule | Run continuously, review weekly |

**Optimization & Delivery:**

| Setting | Value |
|---------|-------|
| Optimization for ad delivery | CompleteRegistration (your conversion event) |
| Cost control | Leave blank initially (Lowest cost) |
| Attribution setting | 7-day click, 1-day view |

**Placements:**

- Select **Advantage+ Placements** (recommended)
- Or manually select: Facebook Feed, Instagram Feed, Instagram Stories, Instagram Reels

### 4.3 Set Up Ad Set 2: Warm (8-30 Days)

Duplicate Ad Set 1, then modify:
- **Audience**: Switch to `RT - Agences Sellers - Warm - 8-30d`
- **Exclusion**: Keep `Exclude - Converted Sellers`
- **Budget**: 35% of total daily budget
- **Name**: Update to reflect the warm window

### 4.4 Set Up Ad Set 3: Cold (31-60 Days)

Duplicate again, then modify:
- **Audience**: Switch to `RT - Agences Sellers - Cold - 31-60d`
- **Exclusion**: Keep `Exclude - Converted Sellers`
- **Budget**: 15% of total daily budget
- **Name**: Update to reflect the cold window

---

## Step 5: Create the Ads

### 5.1 Hot Ad Set — Ads (Direct Response)

**Ad 1: Direct CTA**

| Element | Content |
|---------|---------|
| **Primary text** | You checked out [Site]. Listing your agency is free and takes 2 minutes. Get discovered by buyers actively searching. |
| **Headline** | List Your Agency Free |
| **Description** | Join [X]+ agencies already on [Site] |
| **CTA button** | Sign Up |
| **Image/Video** | Screenshot of the listing page or a clean graphic showing the listing flow |
| **URL** | Your listing/signup page with UTM: `?utm_source=meta&utm_medium=retarget&utm_campaign=sellers_hot&utm_content=direct_cta` |

**Ad 2: Social Proof**

| Element | Content |
|---------|---------|
| **Primary text** | [X] agencies listed this month. Buyers are searching — is your agency showing up? |
| **Headline** | Don't Miss Out on New Leads |
| **CTA button** | Learn More |

**Ad 3: Objection Handler**

| Element | Content |
|---------|---------|
| **Primary text** | No fees. No contracts. List your agency in under 2 minutes and start getting found by buyers today. |
| **Headline** | Free to List. Zero Risk. |
| **CTA button** | Get Started |

### 5.2 Warm Ad Set — Ads (Value & Proof)

**Ad 1: Benefits**

| Element | Content |
|---------|---------|
| **Primary text** | Why [X]+ agencies list on [Site]: Get discovered by qualified buyers. Build your online presence. Free forever. |
| **Headline** | 3 Reasons to List Your Agency |
| **Format** | Carousel — one card per benefit |

**Ad 2: Testimonial**

| Element | Content |
|---------|---------|
| **Primary text** | "[Testimonial quote from a listed agency about results they got]" — [Agency Name] |
| **Headline** | See How Agencies Grow with [Site] |
| **Format** | Single image — photo of the agency or their results |

### 5.3 Cold Ad Set — Ads (Re-engage)

**Ad 1: Brand Reminder**

| Element | Content |
|---------|---------|
| **Primary text** | Still looking for more clients? [Site] connects agencies with buyers actively searching. List free. |
| **Headline** | Get Found by More Buyers |
| **CTA button** | Learn More |

---

## Step 6: Add UTM Parameters

For every ad, add UTM parameters to the destination URL so you can track performance in GA4:

```
https://agences.co/list?utm_source=meta&utm_medium=retarget&utm_campaign=sellers_[window]&utm_content=[ad_name]
```

| Parameter | Value |
|-----------|-------|
| `utm_source` | meta |
| `utm_medium` | retarget |
| `utm_campaign` | sellers_hot, sellers_warm, or sellers_cold |
| `utm_content` | direct_cta, social_proof, objection, benefits, testimonial, reminder |

---

## Step 7: Review & Launch

### Pre-Launch Checklist

- [ ] **Pixel verified** — Events Manager shows PageView and conversion events
- [ ] **Audiences populated** — Each audience has 1,000+ people (check Audiences dashboard)
- [ ] **Exclusion audience active** — Converted sellers are excluded from all ad sets
- [ ] **Conversion event selected** — Ad sets optimize for CompleteRegistration or your conversion event
- [ ] **Budget correct** — Daily budgets match your plan (50/35/15 split)
- [ ] **UTM parameters added** — All ads have tracking parameters on the destination URL
- [ ] **Landing page works** — URL loads fast (<3 sec), mobile-friendly, CTA is clear
- [ ] **Ad creative reviewed** — No typos, images render correctly, preview on mobile
- [ ] **Attribution window** — Set to 7-day click, 1-day view

### Launch

1. Review all settings in the campaign review screen
2. Click **Publish**
3. Campaigns start in **PAUSED** status if you set them that way — toggle to **ACTIVE** when ready
4. Allow **48-72 hours** for the learning phase before making any changes

---

## Step 8: Post-Launch Monitoring

### First 48-72 Hours (Learning Phase)

- **Do not** change budgets, audiences, or creative
- Monitor that impressions are being delivered
- Check that conversion events are being tracked
- Verify UTM data is showing up in GA4

### Day 4-7: First Optimization

1. Check CPA by ad set — is hot outperforming warm/cold?
2. Check CTR by ad — any ads below 1%? Consider pausing
3. Check frequency — is any ad set above the caps?
4. Verify conversions are tracking correctly in both Meta and GA4

### Weekly Ongoing

- Rotate creative every 2-3 weeks or when frequency exceeds caps
- Pause ads with CPA >2x your target after 1,000+ impressions
- Test one new ad variation per ad set per week
- Refresh exclusion audiences (make sure new converters are excluded)
- Review audience sizes — if shrinking, your retargeting pool may be drying up

### Scaling Signals

When you see these for 7+ consecutive days, you're ready to scale:
- CPA at or below target
- Frequency within caps
- 50+ conversions per week per ad set
- Stable or improving CTR

**How to scale:**
1. Increase daily budget by 20-30%
2. Wait 3-5 days before the next increase
3. Add a 61-90 day cold audience segment
4. Create a Lookalike audience from your converters (1% similarity) as a separate prospecting campaign

---

## Troubleshooting

| Problem | Likely Cause | Fix |
|---------|-------------|-----|
| No impressions | Audience too small (<1,000) | Widen retention window or page targeting |
| High CPA | Wrong conversion event or poor creative | Verify event is firing; test new ad angles |
| Low CTR | Ad creative not resonating | Test new hooks, images, or formats |
| High frequency | Small audience + high budget | Reduce budget or expand audience window |
| No conversions tracking | Pixel event not firing on conversion page | Use Events Manager Test Events to debug |
| Audience size = 0 | Pixel not installed or URL filter wrong | Check Pixel Helper; verify URL contains value |
| "Learning Limited" | Not enough conversions (need ~50/week) | Switch to a higher-funnel event (e.g., ViewContent) or combine ad sets |
