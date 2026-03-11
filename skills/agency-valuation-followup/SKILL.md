---
name: agency-valuation-followup
description: "When the user wants to create or optimize the follow-up email sequence after someone uses the Agencies.co Agency Valuation Tool. Also use when the user mentions 'valuation follow-up,' 'valuation tool emails,' 'post-valuation sequence,' 'agency valuation nurture,' 'book a call after valuation,' 'valuation lead nurture,' or 'agency M&A follow-up.' For general email sequences, see email-sequence. For cold outreach, see cold-email. For free tool lead gen strategy, see free-tool-strategy."
metadata:
  version: 1.0.0
---

# Agency Valuation Tool Follow-Up Sequence

You are an expert in warm lead nurture for high-consideration B2B services — specifically agency M&A advisory. Your goal is to convert agency owners who just received their free valuation from the Agencies.co Agency Valuation Tool into booked sales calls with Andy Day, founder of Agencies.co and CEO of Capital A Group.

These are **warm leads, not cold**. They voluntarily entered their website, confirmed their financials, and received a valuation. They are curious about what their agency is worth — and right now, the number is fresh in their mind. Move fast.

## Before Starting

**Check for product marketing context first:**
If `.agents/product-marketing-context.md` exists (or `.claude/product-marketing-context.md` in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Gather this context (ask if not provided):

1. **Booking Link** — What is Andy Day's calendar booking URL? (Calendly, SavvyCal, etc.)
2. **Email Platform** — What email/automation tool will send these? (Customer.io, Mailchimp, HubSpot, etc.)
3. **Personalization Data** — Can valuation data be passed to the email platform? (agency type, valuation range, helping/hurting factors)
4. **Existing Follow-Up** — Is there any current post-valuation email in place?
5. **Case Studies** — Are there stories of agency owners who went through the M&A process to reference?

---

## Valuation Tool Context

The Agencies.co Agency Valuation Tool is a free, AI-powered tool at **agencies.co/agency-valuation-tool** that gives marketing and communications agency owners an indicative M&A market valuation in under 2 minutes.

**How it works:**
1. Owner enters their agency website URL — AI scans and extracts a business profile
2. Owner confirms pre-filled data and adds financials (revenue, EBITDA, growth rate, recurring revenue %)
3. Tool calculates a valuation range, EBITDA multiple range, and a breakdown of helping/hurting factors

**What the owner sees:**
- Valuation range (e.g., "$3.2M — $4.8M")
- EBITDA multiple range (e.g., "4.5x — 6.8x")
- Specific factors helping their value (e.g., "Strong recurring revenue suggests stable income")
- Specific factors hurting their value (e.g., "Single-location agency may limit acquirer appetite")
- Agency profile summary (type, headcount, services, sectors)

**For full tool details and methodology:** See [references/valuation-tool-context.md](references/valuation-tool-context.md)

---

## Core Principles

### 1. Speed Wins — Follow Up Within 1 Hour
The agency owner just saw their number for the first time. They are emotionally engaged, curious, and likely about to start Googling competitors and alternatives. If you wait 24 hours, you've already lost ground. The first email should land while they're still processing their valuation.

### 2. Match the Tool's Tone
The valuation tool is calm, credible, and empowering — a "moment of clarity," not a sales pitch. The follow-up emails must match this. No hype, no urgency tactics, no pressure. The tone is **trusted M&A advisor**, not salesperson.

### 3. Reference Their Specific Results
Personalization is your unfair advantage. These people gave you their financials. Reference their valuation range, agency type, or top helping/hurting factors wherever possible. Generic emails waste the data you have.

### 4. Value Before Ask
Every email teaches something or provides an insight. The call booking is positioned as "get more value from your valuation" — not "take a sales meeting." Andy is offering expertise, not pitching.

### 5. One CTA Per Email
Every email drives toward one action: **book a call with Andy Day**. Don't dilute with multiple links, secondary offers, or "also check out" distractions.

---

## Timing Strategy

These leads are hot. They just saw a number attached to their life's work. Act accordingly.

| Email | Timing | Purpose | Tone |
|-------|--------|---------|------|
| **Email 1** | **1 hour** after valuation | Offer to walk through their results on a call | Helpful, immediate |
| **Email 2** | **Day 2** (next day) | Add value — M&A insight specific to their agency type | Knowledgeable advisor |
| **Email 3** | **Day 5** | Social proof — what a similar agency owner did next | Credible, relatable |
| **Email 4** | **Day 10** | Direct, short ask — are you still thinking about this? | Confident, low-pressure |

### Why This Timing

- **1 hour**: They're still looking at their valuation or thinking about the number. You're the first real human in their inbox offering to help make sense of it. Waiting even a day risks them finding a competitor.
- **Day 2**: If they didn't book from Email 1, they're still thinking. Give them a new reason — something they didn't get from the tool.
- **Day 5**: Long enough gap to not feel pushy. Social proof works best after they've had time to sit with the idea.
- **Day 10**: Final touchpoint. By now they've either engaged or parked the idea. A short, direct email respects their time.

### Send Time

- **Tuesday–Thursday**, 8:00–10:00 AM in their local time zone
- Avoid Mondays (inbox backlog) and Fridays (winding down)
- Email 1 is the exception — it sends 1 hour after valuation regardless of day/time

---

## Email Sequence

### Email 1: "Your Valuation — A Few Things Worth Discussing"
**Send:** 1 hour after valuation completion

**Subject line options:**
- "Your agency valuation — a few things I noticed"
- "Quick thoughts on your {agency_type} valuation"
- "Your valuation results — worth a quick chat"

**Preview text:** "I reviewed your results and there are a couple of things worth discussing."

**Body structure:**

```
Hi {first_name},

I saw you ran a valuation for {agency_url} — nice to see a {agency_type} agency
putting a number to what you've built.

Your range came in at {valuation_range}, and I noticed {top_helping_factor} is
working in your favour. That said, {top_hurting_factor} is something that
typically comes up in buyer conversations and is worth understanding before
you make any decisions.

I'm Andy Day — I run Agencies.co and Capital A Group, and I work with agency
owners on exactly this. I'd be happy to spend 15 minutes walking through what
your numbers actually mean in the current market and what, if anything, you
might want to do about it.

No pitch, no obligation — just a conversation about your agency.

[Book 15 minutes with me →] {booking_link}

Andy
```

**Length:** ~130 words
**CTA:** Book a call
**Personalization tokens:** {first_name}, {agency_url}, {agency_type}, {valuation_range}, {top_helping_factor}, {top_hurting_factor}, {booking_link}

---

### Email 2: "What {agency_type} Agencies Are Selling For Right Now"
**Send:** Day 2 (next day, morning)

**Subject line options:**
- "What {agency_type} agencies are actually selling for"
- "The M&A market for {agency_type} agencies — what I'm seeing"
- "{agency_type} agency multiples — the real numbers"

**Preview text:** "Your valuation gave you a range. Here's what's happening in the real market."

**Body structure:**

```
Hi {first_name},

Yesterday you got your indicative valuation for {agency_url}. I wanted to
share some context that the tool can't give you.

Right now, {agency_type} agencies in your revenue range are seeing strong
interest from acquirers, but the spread between top-quartile and bottom-quartile
multiples is wider than most owners expect. The difference usually comes down
to three things: how dependent the business is on the founder, how much revenue
is recurring, and whether the client base is concentrated or diversified.

Your valuation flagged {top_hurting_factor} — that's one of the factors that
tends to move you from the high end of the range to the low end. It's also
one of the most fixable things before going to market.

If you want to talk through what it would take to move toward the top of your
range — or just understand what buyers are actually looking for — I'm happy
to spend 15 minutes on it.

[Book a quick call →] {booking_link}

Andy
```

**Length:** ~180 words
**CTA:** Book a call
**Personalization tokens:** {first_name}, {agency_url}, {agency_type}, {top_hurting_factor}, {booking_link}

---

### Email 3: "How a {agency_type} Agency Owner Approached Their Valuation"
**Send:** Day 5

**Subject line options:**
- "What one agency owner did after seeing their number"
- "From valuation to decision — one founder's story"
- "A {agency_type} agency owner's path after their valuation"

**Preview text:** "They weren't sure if they wanted to sell either. Here's what happened."

**Body structure:**

```
Hi {first_name},

A few months ago, a {agency_type} agency owner — similar size to yours — ran
their valuation and saw a number they didn't expect. They weren't sure whether
to sell, bring on a partner, or just keep building.

We got on a call and talked through what the number actually meant: what was
driving it up, what was holding it back, and what the options looked like. No
pressure to list, no timeline — just clarity.

They ended up [outcome — e.g., "deciding to spend six months improving their
recurring revenue before going to market" / "listing and closing a deal within
four months" / "deciding not to sell, but restructuring to increase their
valuation by 30%"].

That conversation cost nothing and changed how they thought about their agency.

If you'd like the same conversation about your valuation, I'd be happy to
make time.

[Book 15 minutes →] {booking_link}

Andy
```

**Length:** ~170 words
**CTA:** Book a call
**Note:** Replace the bracketed outcome with a real case study when available. If no case study exists yet, use a plausible composite that reflects common outcomes.
**Personalization tokens:** {first_name}, {agency_type}, {booking_link}

---

### Email 4: "One Question About Your Agency"
**Send:** Day 10

**Subject line options:**
- "One question about {agency_url}"
- "Still thinking about your valuation?"
- "Quick question, {first_name}"

**Preview text:** "This won't take long."

**Body structure:**

```
Hi {first_name},

Short one.

When you saw your valuation range of {valuation_range} — did the number feel
about right, or were you expecting something different?

Either way, that reaction usually tells you something useful about where your
head is at regarding the business.

Happy to talk it through if you want a sounding board.

[Book a call →] {booking_link}

Andy
```

**Length:** ~70 words
**CTA:** Book a call
**Personalization tokens:** {first_name}, {valuation_range}, {agency_url}, {booking_link}

---

## Personalization Variables

| Token | Source | Required | Notes |
|-------|--------|:--------:|-------|
| `{first_name}` | Form / CRM | Yes | Falls back to "there" if unavailable |
| `{agency_url}` | Valuation tool input | Yes | The URL they entered |
| `{agency_type}` | AI scan output | Yes | e.g., "digital marketing," "creative," "PR & comms" |
| `{valuation_range}` | Valuation output | Recommended | e.g., "$3.2M — $4.8M" |
| `{ebitda_multiple_range}` | Valuation output | Optional | e.g., "4.5x — 6.8x" |
| `{top_helping_factor}` | Valuation output | Recommended | Their #1 value-increasing factor |
| `{top_hurting_factor}` | Valuation output | Recommended | Their #1 value-decreasing factor |
| `{booking_link}` | Configuration | Yes | Andy Day's calendar link |

**Sensitivity note:** Some owners may be uncomfortable seeing their exact valuation numbers in email (especially if others access their inbox). If in doubt, use `{agency_type}` and qualitative references instead of exact `{valuation_range}` figures.

---

## Exit Conditions and Branching

| Trigger | Action |
|---------|--------|
| **Books a call** after any email | Exit sequence immediately |
| **Replies** to any email | Exit sequence, route to Andy for personal follow-up |
| **Unsubscribes** | Exit sequence, respect the opt-out |
| **Completes Email 4** with no engagement | Move to long-term monthly content nurture (do not send more direct outreach) |
| **Opens emails but never clicks** | Consider a subject line variation for the next email in sequence |

**Do not:**
- Send a 5th follow-up email. Four is the limit for direct outreach.
- Re-enter someone into this sequence if they've completed it once.
- Send this sequence to anyone who booked a call through another channel.

---

## Output Format

### Sequence Overview

```
Sequence Name: Agency Valuation Follow-Up
Trigger: Valuation tool completion
Goal: Book a sales call with Andy Day
Length: 4 emails
Timing: 1 hour, Day 2, Day 5, Day 10
Exit Conditions: Call booked, reply received, unsubscribe, or sequence complete
```

### Per-Email Format

```
Email [#]: [Name/Purpose]
Send: [Timing after trigger]
Subject: [Subject line]
Preview: [Preview text]
Body: [Full copy]
CTA: [Button text] → [Booking link]
Personalization: [Variables used]
```

---

## Metrics and Benchmarks

| Metric | Target | Notes |
|--------|--------|-------|
| Email 1 open rate | 55–65% | Warm lead, fresh context — should be high |
| Email 1 click rate | 10–15% | Strong personalization drives clicks |
| Email 2 open rate | 45–55% | Slight drop-off is normal |
| Email 3 open rate | 40–50% | Story-based subjects help maintain opens |
| Email 4 open rate | 35–45% | Shortest email, curiosity-driven subject |
| Sequence → call booked | 8–15% | Target for warm leads with personalization |
| Unsubscribe rate | <0.5% per email | If higher, tone may be too aggressive |

**Track separately:**
- Calls booked per email (which email converts best?)
- Time from valuation to call booking
- Call show rate (are they actually showing up?)
- Call → next step conversion rate

---

## Task-Specific Questions

If context is missing, ask:

1. What is Andy Day's booking link (Calendly, SavvyCal, or other)?
2. What email/automation platform will send these (Customer.io, HubSpot, Mailchimp)?
3. Can valuation data (agency type, valuation range, factors) be passed to the email platform via webhook or API?
4. Are there real case studies of agency owners who went through the M&A process to use in Email 3?
5. Is there a long-term content nurture sequence for leads who don't convert from this sequence?

---

## Tool Integrations

For implementation, see the [tools registry](../../tools/REGISTRY.md). Key tools for this sequence:

| Tool | Best For | Guide |
|------|----------|-------|
| **Customer.io** | Behavior-triggered automation (ideal for this) | [customer-io.md](../../tools/integrations/customer-io.md) |
| **HubSpot** | CRM + email automation combined | [hubspot.md](../../tools/integrations/hubspot.md) |
| **Mailchimp** | If already in use for other email | [mailchimp.md](../../tools/integrations/mailchimp.md) |
| **Resend** | Developer-friendly transactional email | [resend.md](../../tools/integrations/resend.md) |
| **Zapier** | Connecting valuation tool output to email platform | [zapier.md](../../tools/integrations/zapier.md) |

---

## Related Skills

- **email-sequence**: For general email sequence frameworks and best practices
- **cold-email**: For outbound writing principles (though this sequence is warm, not cold)
- **free-tool-strategy**: For the broader strategy of using free tools for lead generation
- **sales-enablement**: For sales collateral Andy might need for the call itself
- **revops**: For lead lifecycle management and CRM setup
- **copywriting**: For landing page copy on the valuation tool page
- **marketing-psychology**: For behavioral triggers in the emails
