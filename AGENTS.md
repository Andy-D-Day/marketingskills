# AGENTS.md

Guidelines for AI agents working in this repository.

## Repository Overview

This repository contains **Agent Skills** for AI agents following the [Agent Skills specification](https://agentskills.io/specification.md). It also serves as a **Claude Code plugin marketplace** via `.claude-plugin/marketplace.json`.

- **Name**: Marketing Skills
- **GitHub**: [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills)
- **Creator**: Corey Haines
- **License**: MIT

## Repository Structure

```
marketingskills/
├── .claude-plugin/
│   └── marketplace.json        # Claude Code plugin marketplace manifest
├── .github/
│   ├── FUNDING.yml             # GitHub Sponsors config
│   ├── ISSUE_TEMPLATE/
│   │   ├── config.yml          # Issue template chooser
│   │   └── skill-request.yml   # Template for requesting new skills
│   ├── PULL_REQUEST_TEMPLATE/
│   │   ├── documentation.md    # Template for documentation PRs
│   │   ├── new-skill.md        # Template for new skill PRs
│   │   └── skill-update.md     # Template for skill update PRs
│   ├── scripts/
│   │   └── sync-skills.js      # Syncs marketplace.json & README with skills/
│   └── workflows/
│       ├── sync-skills.yml     # Auto-sync on push to main
│       └── validate-skill.yml  # Validates SKILL.md on PRs
├── skills/                     # 25 Agent Skills (see inventory below)
│   └── skill-name/
│       ├── SKILL.md            # Required skill file
│       ├── references/         # Optional detailed docs
│       ├── scripts/            # Optional executable code
│       └── assets/             # Optional templates, data files
├── tools/
│   ├── REGISTRY.md             # Index of all tools with capabilities
│   └── integrations/           # 29 detailed integration guides
│       ├── ga4.md
│       ├── stripe.md
│       └── ...
├── AGENTS.md                   # This file (agent guidelines)
├── CLAUDE.md                   # Symlink → AGENTS.md
├── CONTRIBUTING.md             # Contribution guidelines
├── LICENSE                     # MIT License
├── README.md                   # Project overview, installation, skill list
└── VERSIONS.md                 # Version tracking for all skills
```

> **Note**: `CLAUDE.md` is a symlink to `AGENTS.md`. Edit `AGENTS.md` directly; the symlink ensures both Claude Code and other agents pick up the same instructions.

## Build / Lint / Test Commands

This is a content-only repository with no runtime code. However, there are automated checks:

### CI Validation (GitHub Actions)

**Skill validation** (`validate-skill.yml`) runs on every push/PR to `main` that touches `**/SKILL.md`:
- Detects which skills changed via `git diff`
- Validates each changed skill using [`Flash-Brew-Digital/validate-skill@v1`](https://github.com/Flash-Brew-Digital/validate-skill)
- Runs as a matrix job (one per changed skill, fail-fast disabled)

**Skill sync** (`sync-skills.yml`) runs on push to `main` when `skills/**` changes:
- Executes `.github/scripts/sync-skills.js`
- Updates `.claude-plugin/marketplace.json` with current skill paths and count
- Updates the skills table in `README.md` (between `<!-- SKILLS:START -->` and `<!-- SKILLS:END -->` markers)
- Auto-commits changes as `Coreybot`

### Manual Verification

When adding or editing skills, verify:
- YAML frontmatter is valid
- `name` field matches directory name exactly
- `name` is 1-64 chars, lowercase alphanumeric and hyphens only
- `description` is 1-1024 characters
- `SKILL.md` is under 500 lines

## Skill Inventory (25 Skills)

### Conversion Optimization

| Skill | Description |
|-------|-------------|
| `page-cro` | Marketing page conversion optimization (homepage, landing, pricing, feature pages) |
| `signup-flow-cro` | Signup, registration, and trial activation flow optimization |
| `form-cro` | Non-signup form optimization (lead capture, contact, demo requests) |
| `onboarding-cro` | Post-signup onboarding, user activation, first-run experience |
| `popup-cro` | Popups, modals, overlays, slide-ins, banners for conversion |
| `paywall-upgrade-cro` | In-app paywalls, upgrade screens, upsell modals, feature gates |

### Content & Copy

| Skill | Description |
|-------|-------------|
| `copywriting` | Marketing copy for any page type (homepage, landing, pricing, etc.) |
| `copy-editing` | Edit, review, or improve existing marketing copy |
| `content-strategy` | Content planning, topic clusters, blog strategy |
| `social-content` | Social media content for LinkedIn, Twitter/X, Instagram, TikTok |

### SEO & Discovery

| Skill | Description |
|-------|-------------|
| `seo-audit` | SEO health checks, technical SEO, ranking diagnostics |
| `schema-markup` | Structured data, JSON-LD, rich snippets |
| `programmatic-seo` | Template-based pages at scale (directories, location pages) |
| `competitor-alternatives` | Competitor comparison and alternative pages |

### Paid & Distribution

| Skill | Description |
|-------|-------------|
| `paid-ads` | PPC campaigns on Google, Meta, LinkedIn, Twitter/X, TikTok |
| `email-sequence` | Email sequences, drip campaigns, lifecycle emails |

### Measurement & Testing

| Skill | Description |
|-------|-------------|
| `ab-test-setup` | A/B test planning, hypothesis design, experiment setup |
| `analytics-tracking` | Analytics setup, GA4, conversion tracking, UTM parameters |

### Growth Engineering

| Skill | Description |
|-------|-------------|
| `referral-program` | Referral, affiliate, and ambassador programs |
| `free-tool-strategy` | Free tools for lead generation and SEO (engineering as marketing) |

### Strategy & Monetization

| Skill | Description |
|-------|-------------|
| `pricing-strategy` | Pricing, packaging, freemium, monetization strategy |
| `launch-strategy` | Product launches, Product Hunt, feature announcements |
| `marketing-ideas` | 139 proven marketing approaches for SaaS/software |
| `marketing-psychology` | 70+ psychological principles and mental models for marketing |
| `product-marketing-context` | Foundational positioning/messaging document (creates `.claude/product-marketing-context.md`) |

## Agent Skills Specification

Skills follow the [Agent Skills spec](https://agentskills.io/specification.md).

### Required Frontmatter

```yaml
---
name: skill-name
description: What this skill does and when to use it. Include trigger phrases.
---
```

### Frontmatter Field Constraints

| Field         | Required | Constraints                                                      |
|---------------|----------|------------------------------------------------------------------|
| `name`        | Yes      | 1-64 chars, lowercase `a-z`, numbers, hyphens. Must match dir.   |
| `description` | Yes      | 1-1024 chars. Describe what it does and when to use it.          |
| `license`     | No       | License name (default: MIT)                                      |
| `metadata`    | No       | Key-value pairs (author, version, etc.)                          |

### Name Field Rules

- Lowercase letters, numbers, and hyphens only
- Cannot start or end with hyphen
- No consecutive hyphens (`--`)
- Must match parent directory name exactly

**Valid**: `page-cro`, `email-sequence`, `ab-test-setup`
**Invalid**: `Page-CRO`, `-page`, `page--cro`

### Optional Skill Directories

```
skills/skill-name/
├── SKILL.md        # Required - main instructions (<500 lines)
├── references/     # Optional - detailed docs loaded on demand
├── scripts/        # Optional - executable code
└── assets/         # Optional - templates, data files
```

## Writing Style Guidelines

### Structure

- Keep `SKILL.md` under 500 lines (move details to `references/`)
- Use H2 (`##`) for main sections, H3 (`###`) for subsections
- Use bullet points and numbered lists liberally
- Short paragraphs (2-4 sentences max)

### Tone

- Direct and instructional
- Second person ("You are a conversion rate optimization expert")
- Professional but approachable

### Formatting

- Bold (`**text**`) for key terms
- Code blocks for examples and templates
- Tables for reference data
- No excessive emojis

### Clarity Principles

- Clarity over cleverness
- Specific over vague
- Active voice over passive
- One idea per section

### Description Field Best Practices

The `description` is critical for skill discovery. Include:
1. What the skill does
2. When to use it (trigger phrases)
3. Related skills for scope boundaries

```yaml
description: When the user wants to optimize conversions on any marketing page. Use when the user says "CRO," "conversion rate optimization," "this page isn't converting." For signup flows, see signup-flow-cro.
```

## Claude Code Plugin

This repo also serves as a plugin marketplace. The manifest at `.claude-plugin/marketplace.json` lists all 25 skills for installation via:

```bash
/plugin marketplace add coreyhaines31/marketingskills
/plugin install marketing-skills
```

See [Claude Code plugins documentation](https://code.claude.com/docs/en/plugins.md) for details.

The `marketplace.json` is auto-maintained by the sync workflow. Do not edit it manually unless the workflow is unavailable.

## Tool Integrations

This repository includes a tools registry with 29 integration guides for agent-compatible marketing tools.

- **Tool discovery**: Read `tools/REGISTRY.md` to see available tools and their capabilities
- **Integration details**: See `tools/integrations/{tool}.md` for API endpoints, auth, and common operations

### MCP-Enabled Tools (6)

These tools have Model Context Protocol servers for direct agent interaction:

| Tool | Category | Purpose |
|------|----------|---------|
| **ga4** | Analytics | Google Analytics 4 data access |
| **stripe** | Payments | Payment and subscription management |
| **mailchimp** | Email | Email campaign management |
| **google-ads** | Ads | Ad campaign management |
| **resend** | Email | Transactional email sending |
| **zapier** | Automation | Workflow automation |

### All Integration Guides (29)

| Category | Tools |
|----------|-------|
| Analytics | ga4, mixpanel, amplitude, posthog, segment, adobe-analytics |
| SEO | google-search-console, semrush, ahrefs |
| CRM | hubspot, salesforce |
| Payments | stripe |
| Referral & Affiliate | rewardful, tolt, dub-co, mention-me |
| Email | mailchimp, customer-io, sendgrid, resend, kit |
| Advertising | google-ads, meta-ads, linkedin-ads, tiktok-ads |
| Automation | zapier |
| Commerce & CMS | shopify, wordpress, webflow |

### When to Use Tools

Skills reference relevant tools for implementation. For example:
- `referral-program` skill -> rewardful, tolt, dub-co, mention-me guides
- `analytics-tracking` skill -> ga4, mixpanel, segment guides
- `email-sequence` skill -> customer-io, mailchimp, resend guides
- `paid-ads` skill -> google-ads, meta-ads, linkedin-ads guides

## Git Workflow

### Branch Naming

- New skills: `feature/skill-name`
- Improvements: `fix/skill-name-description`
- Documentation: `docs/description`

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat: add skill-name skill`
- `fix: improve clarity in page-cro`
- `docs: update README`
- `chore: sync skills with marketplace.json and README` (automated)

### Pull Request Checklist

- [ ] `name` matches directory name exactly
- [ ] `name` follows naming rules (lowercase, hyphens, no `--`)
- [ ] `description` is 1-1024 chars with trigger phrases
- [ ] `SKILL.md` is under 500 lines
- [ ] No sensitive data or credentials

Use the appropriate PR template from `.github/PULL_REQUEST_TEMPLATE/`:
- `new-skill.md` for adding new skills
- `skill-update.md` for modifying existing skills
- `documentation.md` for docs-only changes

### Adding a New Skill

1. Create `skills/your-skill-name/SKILL.md` with valid frontmatter
2. Follow name field rules (lowercase, hyphens, no `--`, matches directory)
3. Write description with trigger phrases
4. Keep under 500 lines; use `references/` for overflow
5. The sync workflow will auto-update `marketplace.json` and `README.md` on merge

## Checking for Updates

When using any skill from this repository:

1. **Once per session**, on first skill use, check for updates:
   - Fetch `VERSIONS.md` from GitHub: https://raw.githubusercontent.com/coreyhaines31/marketingskills/main/VERSIONS.md
   - Compare versions against local skill files

2. **Only prompt if meaningful**:
   - 2 or more skills have updates, OR
   - Any skill has a major version bump (e.g., 1.x to 2.x)

3. **Non-blocking notification** at end of response:
   ```
   ---
   Skills update available: X marketing skills have updates.
   Say "update skills" to update automatically, or run `git pull` in your marketingskills folder.
   ```

4. **If user says "update skills"**:
   - Run `git pull` in the marketingskills directory
   - Confirm what was updated

## Skill Categories

See `README.md` for the current list of skills organized by category. When adding new skills, follow the naming patterns of existing skills in that category.
