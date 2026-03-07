---
name: newsletter-inactive-contacts
description: When the user wants to re-engage inactive or dormant email contacts, clean their email list, manage platform contact limits, or run a reactivation campaign for cold subscribers. Use when the user says "inactive contacts," "clean my list," "re-engage subscribers," "contact limit," "dormant contacts," "list hygiene," "too many contacts," "over my contact limit," or "reactivation email." For ongoing email sequences, see email-sequence. For churn prevention, see churn-prevention.
metadata:
  version: 1.0.0
---

# Newsletter Inactive Contacts Re-Engagement

You are an expert in email list management and re-engagement strategy. Your goal is to help re-engage dormant contacts using a value-first approach before deciding who to keep and who to remove.

## Initial Assessment

**Check for product marketing context first:**
If `.agents/product-marketing-context.md` exists (or `.claude/product-marketing-context.md` in older setups), read it before asking questions. Use that context and only ask for information not already covered.

Before building the campaign, understand:

1. **Platform and limits** - What email platform are you on? What's your current contact count vs. your plan limit? What's the deadline or urgency?
2. **Inactive segment** - How many inactive contacts? How long since they last engaged? How did they originally join your list?
3. **Re-engagement offer** - What value can you offer? A free tool, resource, or lead magnet works best.
4. **Audience** - Who are these contacts? What industry, role, or pain points?
5. **Current newsletter** - What's your active list size and typical open/click rates?

---

## Decision Framework: Re-engage vs. Purge vs. Export

Before sending anything, decide the right approach for your situation:

### When to Re-Engage First (Recommended)

- Contacts joined voluntarily (opt-in, lead magnet, purchase)
- They were active at some point in the last 12 months
- You have something genuinely valuable to offer them
- You have time (1-2 weeks) before the platform deadline

### When to Purge Immediately

- Contacts are 18+ months old with zero engagement
- Addresses are from purchased lists or scraped sources
- High bounce rates (>5%) in previous sends
- You have no time and need to reduce count today

### When to Export and Archive

- Contacts have value for other channels (retargeting, direct mail)
- You may want to re-import them to a different platform later
- They represent a specific audience segment worth preserving

**Always export before deleting.** Download a CSV with email, name, source, last activity date, and any tags. You can always re-import engaged contacts later.

---

## Segmentation Strategy

Do NOT blast all 16,000 contacts at once. Segment and send in phases:

### Phase 1: Warmest First (Days 1-2)
**Segment**: Contacts who opened or clicked something in the last 6 months but aren't newsletter subscribers.
**Expected size**: ~15-25% of your inactive list
**Why first**: Highest likelihood of engagement, best for deliverability warm-up

### Phase 2: Middle Tier (Days 3-5)
**Segment**: Contacts who joined 6-12 months ago, had some initial engagement, then went quiet.
**Expected size**: ~30-40% of your inactive list

### Phase 3: Coldest (Days 6-8)
**Segment**: Contacts with no engagement in 12+ months or unknown engagement history.
**Expected size**: ~35-50% of your inactive list
**Note**: Expect lower open rates and higher bounces. Monitor closely.

### Batch Sizing

| Total Inactive | Daily Send Limit | Days to Complete |
|---------------|-----------------|-----------------|
| 5,000 or less | Send all at once | 1 day |
| 5,000-10,000 | 2,500-3,000/day | 3-4 days |
| 10,000-20,000 | 3,000-4,000/day | 4-6 days |
| 20,000+ | 5,000/day max | 5-7 days |

**Why batch?** Sending 16,000 emails from an account that normally sends to a smaller list will trigger spam filters. ISPs see the sudden volume spike and throttle or block you.

---

## Deliverability Safeguards

Emailing a large inactive segment is risky. Protect your sender reputation:

### Before Sending

1. **Verify your sending domain** - Confirm SPF, DKIM, and DMARC are properly configured
2. **Check your domain reputation** - Use Google Postmaster Tools or MXToolbox
3. **Clean obvious bad addresses** - Remove role addresses (info@, admin@), obvious typos, and any addresses that have hard-bounced before
4. **Use your main sending domain** - Don't use a subdomain for this; it looks suspicious and defeats the purpose of re-engagement
5. **Set a reply-to you monitor** - People will reply. Be ready to respond.

### During Sending

- **Monitor bounce rate** - If bounces exceed 3% on any batch, pause and clean the remaining list
- **Watch spam complaints** - If complaints exceed 0.1%, stop immediately
- **Check open rates** - If Phase 1 gets <10% opens, reconsider sending to colder segments
- **Send during business hours** - Tuesday-Thursday, 9-11am in your audience's time zone

### After Sending

- Remove hard bounces immediately
- Unsubscribe anyone who marks as spam
- Tag engaged contacts (opened or clicked) for follow-up
- Wait 48 hours before sending the follow-up to non-openers

---

## Email 1: The Re-Engagement Email

This is the primary email. Value-first, single clear CTA, no guilt trips.

### Subject Line Options

Pick one and A/B test if your platform supports it:

- "Free agency valuation tool (no strings attached)"
- "What's your agency actually worth?"
- "I built something for agency owners like you"
- "[First name], curious what your agency is worth?"

### Preview Text

- "Takes 2 minutes. Get your valuation instantly."
- "Most agency owners have no idea. Find out for free."

### Email Body

```
Subject: Free agency valuation tool (no strings attached)
Preview: Takes 2 minutes. Get your valuation instantly.

---

Hey [First name],

Quick question — do you know what your agency is worth right now?

Most agency owners don't. They're so focused on clients and delivery
that they never stop to figure out the actual value of what they've built.

I put together a free valuation tool that gives you a clear number
in about 2 minutes. No fluff, no sales pitch — just a straightforward
estimate based on your revenue, margins, team size, and client base.

[BUTTON: Get Your Free Agency Valuation]
→ Link to: [YOUR_VALUATION_TOOL_URL]

Whether you're thinking about selling someday, bringing on a partner,
or just want to know where you stand — it's worth 2 minutes.

[Your name]

P.S. Over [X] agency owners have used this so far. The average
valuation surprises most people (in a good way).

---
[Unsubscribe link]
```

### Key Principles in This Email

- **No apology for being absent** - Don't say "it's been a while" or "we haven't emailed in a while." They don't remember you. Just lead with value.
- **One CTA** - The valuation tool link. Nothing else competing for attention.
- **Short** - Under 150 words. Respect their time.
- **Curiosity hook** - "Do you know what your agency is worth?" is a question most agency owners can't answer, which creates an open loop.
- **P.S. with social proof** - If you have usage data, include it. If not, cut the P.S.

---

## Email 2: Follow-Up for Non-Openers

Send this 48-72 hours after Email 1, **only to contacts who did NOT open** Email 1.

The goal: catch people who missed it or whose subject line didn't resonate.

### Subject Line Options

Use a completely different angle from Email 1:

- "Your agency's hidden number"
- "2-minute exercise for agency owners"
- "The one metric most agency owners ignore"

### Preview Text

- "Free tool — no email required to use it."
- "Quick and surprisingly eye-opening."

### Email Body

```
Subject: The one metric most agency owners ignore
Preview: Free tool — no email required to use it.

---

Hey [First name],

There's one number every agency owner should know
but almost none of them do:

What their agency is actually worth.

Not a rough guess. An actual estimate based on your
revenue, margins, and team.

I built a free tool that calculates it in about 2 minutes:

[BUTTON: See Your Agency Valuation]
→ Link to: [YOUR_VALUATION_TOOL_URL]

No email gate, no sales call. Just a number you should know.

[Your name]

---
[Unsubscribe link]
```

### Key Differences from Email 1

- **Different subject line angle** - Shifts from "free tool" framing to "hidden metric" framing
- **Even shorter** - Under 100 words
- **Emphasizes no friction** - "No email gate, no sales call" removes objections
- **No P.S.** - Keep it minimal for non-openers

---

## Post-Campaign Actions

### Within 72 Hours After the Follow-Up

Segment your 16,000 contacts into three buckets:

| Bucket | Action | Priority |
|--------|--------|----------|
| **Opened + Clicked** | Add to newsletter, tag as "re-engaged," nurture | High |
| **Opened, No Click** | Keep for 30 more days, send one more value email | Medium |
| **No Open (both emails)** | Export CSV, then delete from platform | Low |

### Tagging Strategy

Apply these tags in your email platform:

- `reengagement-2026-03` — Everyone who received the campaign
- `reengaged-clicked` — Opened and clicked the valuation tool
- `reengaged-opened` — Opened but didn't click
- `reengagement-no-response` — Didn't open either email

### Contact Limit Math

Run the numbers after the campaign:

```
Current contacts:         [Your total, e.g., 27,000]
Inactive contacts emailed: 16,000
No response (to delete):   ~12,000-14,000 (typical: 75-85% won't respond)
Re-engaged (to keep):      ~2,000-4,000
New total after cleanup:    ~13,000-15,000

Platform limit:             25,000
Headroom after cleanup:     ~10,000-12,000
```

**Expected results for a cold re-engagement to an older list:**
- Open rate: 8-15% (don't expect newsletter-level opens)
- Click rate: 2-5% of openers
- Bounce rate: 2-5% (higher than normal — this is expected)
- Unsubscribe rate: 1-3% (also expected and healthy)

---

## Platform-Specific Notes: Kajabi

If you're running this from Kajabi:

1. **Export first** - Go to Contacts > filter by "not subscribed to [newsletter]" > Export CSV before doing anything
2. **Use Kajabi's email broadcasts** - Send as a broadcast, not an automation, so you can manually control the timing and batches
3. **Manual batching** - Kajabi doesn't have built-in batch sending. Tag contacts in groups (batch-1, batch-2, batch-3) and send separate broadcasts to each tag over multiple days
4. **Track opens in Kajabi** - After sending, filter contacts by "opened" and "clicked" in the broadcast analytics
5. **Bulk delete non-responders** - After the campaign, filter for contacts with the `reengagement-no-response` tag and bulk remove them to get under your contact limit
6. **Consider migrating email** - If you need more sophisticated automation (auto-batching, behavior triggers, A/B testing subject lines), consider running the re-engagement through a dedicated email tool and syncing back to Kajabi via Zapier

---

## Campaign Checklist

Before launching, verify:

- [ ] Exported full inactive contact list as CSV backup
- [ ] Verified SPF/DKIM/DMARC on sending domain
- [ ] Removed hard bounces and obviously bad addresses
- [ ] Created segments/tags for batched sending
- [ ] Free valuation tool link is working and tested
- [ ] Email copy reviewed and personalization tokens verified
- [ ] Unsubscribe link present and working
- [ ] Reply-to address monitored
- [ ] Bounce rate monitoring plan in place
- [ ] Post-campaign tag strategy ready (re-engaged, no-response)
- [ ] Calendar blocked to monitor first batch results before sending next

---

## Output Format

When generating this campaign for a user, provide:

```
Campaign: Inactive Contact Re-Engagement
Platform: [Platform name]
Inactive contacts: [Count]
Current total: [Total contacts]
Plan limit: [Limit]
Target reduction: [How many to remove]

Re-engagement offer: [Free tool/lead magnet description]
Audience: [Who they are]

Email 1: Re-Engagement
Subject: [Subject line]
Preview: [Preview text]
Send to: [Segment]
Body: [Full copy]
CTA: [Button text] → [URL]

Email 2: Follow-Up (Non-Openers)
Subject: [Subject line]
Preview: [Preview text]
Send to: [Non-openers from Email 1]
Delay: 48-72 hours after Email 1
Body: [Full copy]
CTA: [Button text] → [URL]

Post-Campaign Plan:
- Opened + Clicked → [Action]
- Opened only → [Action]
- No response → [Action]

Expected outcome: [Projected contacts to keep vs. remove]
```

---

## Tool Integrations

For implementation, see the [tools registry](../../tools/REGISTRY.md). Key tools for this workflow:

| Tool | Best For | Guide |
|------|----------|-------|
| **Kajabi** | All-in-one platform (courses, email, contacts) | Native — no integration guide needed |
| **Zapier** | Connecting Kajabi to other email tools | [zapier.md](../../tools/integrations/zapier.md) |
| **Customer.io** | Behavior-based re-engagement automation | [customer-io.md](../../tools/integrations/customer-io.md) |
| **Mailchimp** | List management and segmentation | [mailchimp.md](../../tools/integrations/mailchimp.md) |
| **ActiveCampaign** | CRM + email automation for follow-up | [activecampaign.md](../../tools/integrations/activecampaign.md) |
| **Brevo** | Multi-channel re-engagement (email + SMS) | [brevo.md](../../tools/integrations/brevo.md) |

---

## Related Skills

- **[email-sequence](../email-sequence/)** — For building ongoing email sequences after re-engagement
- **[churn-prevention](../churn-prevention/)** — For retention strategy and cancel flow design
- **[free-tool-strategy](../free-tool-strategy/)** — For planning and building the free tool used as a lead magnet
- **[cold-email](../cold-email/)** — For subject line optimization and follow-up patterns
- **[copywriting](../copywriting/)** — For refining email copy and CTAs
