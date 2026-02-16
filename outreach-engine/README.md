# Agency Valuation Outreach Engine

Automated system for extracting agency leads from Close CRM, running them through a valuation engine, generating personalised outreach emails, and tracking engagement.

Built for [Agencies.co](https://agencies.co).

## Architecture

```
Layer 1: CRM Extract & Segmentation     ← Phase 1 (this build)
Layer 2: Batch Valuation Engine          ← Phase 2
Layer 3: Email Generation & Sending      ← Phase 3
Layer 4: Engagement Tracking & CRM Routing ← Phase 4
```

## Quick Start

```bash
cd outreach-engine

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env with your Close API key

# Set up the database
npm run setup

# Verify the system with mock data
npm run test-extract
```

## CLI Commands

```bash
# Global dashboard
node src/cli.js status

# Cohort management
node src/cli.js cohort list
node src/cli.js cohort create "uk-perf-mktg-20-50" --country GB --tags "performance-marketing" --description "UK Performance Marketing 20-50 employees"
node src/cli.js cohort show "uk-perf-mktg-20-50"
node src/cli.js cohort pause "uk-perf-mktg-20-50"
node src/cli.js cohort resume "uk-perf-mktg-20-50"

# Extract leads from Close CRM
node src/cli.js extract "uk-perf-mktg-20-50" --preview    # Preview first
node src/cli.js extract "uk-perf-mktg-20-50"               # Full extraction
node src/cli.js extract "uk-perf-mktg-20-50" --limit 50    # Override batch size

# View processing queue
node src/cli.js queue "uk-perf-mktg-20-50"                 # Show queued
node src/cli.js queue "uk-perf-mktg-20-50" --status failed # Show failures

# Test Close CRM connection
node src/cli.js test-connection
```

## Database

SQLite database stored at `data/outreach.db` (configurable via `DATABASE_PATH` env var).

### Tables

| Table | Purpose |
|-------|---------|
| `cohorts` | Named segments with filter definitions |
| `agency_queue` | Individual agencies with processing status |
| `valuations` | Crawl data and valuation output (Phase 2) |
| `outreach_emails` | Generated/sent emails (Phase 3) |
| `replies` | Inbound replies with AI classification (Phase 4) |
| `processing_log` | Audit trail of all events |

### Agency Status Flow

```
queued → crawling → valued → quality_checked → email_generated → ready_to_send → sent → opened → clicked → replied → booked
                ↘ failed                                                                                  ↗
                ↘ needs_review                                                                   → no_response
                                                                                                 → opted_out
```

## Project Structure

```
outreach-engine/
├── src/
│   ├── cli.js              # CLI interface (Commander.js)
│   ├── crm/
│   │   ├── close-client.js  # Close.com API client
│   │   └── extractor.js     # Lead extraction & queue orchestration
│   ├── db/
│   │   ├── connection.js    # SQLite connection management
│   │   ├── operations.js    # All database operations
│   │   └── schema.js        # Table definitions
│   └── utils/
│       └── display.js       # CLI display helpers (tables, colours)
├── scripts/
│   ├── setup-db.js          # Database initialisation
│   └── test-extract.js      # Phase 1 integration test
├── data/                    # Database files (gitignored)
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `CLOSE_API_KEY` | Yes | Close.com API key |
| `ANTHROPIC_API_KEY` | Phase 2 | For valuation engine |
| `DATABASE_PATH` | No | SQLite DB path (default: `./data/outreach.db`) |
| `MAX_CONCURRENT_CRAWLS` | No | Max parallel crawls (default: 5) |
| `CRAWL_DELAY_MS` | No | Delay between crawls (default: 3000) |
| `CONFIDENCE_THRESHOLD` | No | Min confidence to proceed (default: 60) |
