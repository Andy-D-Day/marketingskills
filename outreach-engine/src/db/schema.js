/**
 * Database schema for the Agency Valuation Outreach Engine.
 * SQLite via better-sqlite3.
 *
 * Tables:
 *   cohorts        — named segments of agencies to process
 *   agency_queue   — individual agency records with processing status
 *   valuations     — crawl + valuation output per agency
 *   outreach_emails — generated/sent emails per agency
 *   replies        — inbound replies with AI classification
 */

export const SCHEMA_SQL = `
-- ============================================================
-- COHORTS
-- ============================================================
CREATE TABLE IF NOT EXISTS cohorts (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  name            TEXT    NOT NULL UNIQUE,
  description     TEXT,
  filters         TEXT    NOT NULL DEFAULT '{}',   -- JSON: geography, size, vertical, tags, etc.
  batch_size      INTEGER NOT NULL DEFAULT 200,
  status          TEXT    NOT NULL DEFAULT 'active' CHECK(status IN ('active','paused','completed','archived')),
  created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================
-- AGENCY QUEUE
-- ============================================================
CREATE TABLE IF NOT EXISTS agency_queue (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  cohort_id       INTEGER NOT NULL REFERENCES cohorts(id),
  close_lead_id   TEXT    NOT NULL,
  company_name    TEXT    NOT NULL,
  website_url     TEXT,
  contact_name    TEXT,
  contact_email   TEXT,
  contact_title   TEXT,
  phone           TEXT,
  location        TEXT,
  country         TEXT,
  close_tags      TEXT    DEFAULT '[]',            -- JSON array
  close_custom    TEXT    DEFAULT '{}',            -- JSON: custom fields from Close
  last_activity   TEXT,                            -- last activity date in Close
  lead_status     TEXT,
  status          TEXT    NOT NULL DEFAULT 'queued'
    CHECK(status IN (
      'queued','crawling','valued','quality_checked',
      'email_generated','ready_to_send','sent',
      'opened','clicked','replied','booked',
      'failed','needs_review','opted_out','no_response'
    )),
  failure_reason  TEXT,
  queued_at       TEXT    NOT NULL DEFAULT (datetime('now')),
  processed_at    TEXT,
  valued_at       TEXT,
  sent_at         TEXT,
  created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE(cohort_id, close_lead_id)                -- prevent duplicates within a cohort
);

CREATE INDEX IF NOT EXISTS idx_agency_queue_status      ON agency_queue(status);
CREATE INDEX IF NOT EXISTS idx_agency_queue_cohort      ON agency_queue(cohort_id);
CREATE INDEX IF NOT EXISTS idx_agency_queue_close_lead  ON agency_queue(close_lead_id);

-- ============================================================
-- VALUATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS valuations (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  agency_queue_id     INTEGER NOT NULL UNIQUE REFERENCES agency_queue(id),
  raw_crawl_data      TEXT    DEFAULT '{}',        -- JSON: full crawl output
  extracted_signals   TEXT    DEFAULT '{}',        -- JSON: structured signals
  valuation_low       REAL,
  valuation_mid       REAL,
  valuation_high      REAL,
  confidence_score    INTEGER DEFAULT 0,           -- 0-100
  team_size_estimate  INTEGER,
  primary_vertical    TEXT,
  service_mix         TEXT    DEFAULT '[]',        -- JSON array
  positive_factors    TEXT    DEFAULT '[]',        -- JSON array
  improvement_factors TEXT    DEFAULT '[]',        -- JSON array
  quality_grade       TEXT,                        -- A/B/C/D/F
  currency            TEXT    DEFAULT 'GBP',
  created_at          TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_valuations_confidence ON valuations(confidence_score);

-- ============================================================
-- OUTREACH EMAILS
-- ============================================================
CREATE TABLE IF NOT EXISTS outreach_emails (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  agency_queue_id   INTEGER NOT NULL REFERENCES agency_queue(id),
  valuation_id      INTEGER REFERENCES valuations(id),
  subject           TEXT    NOT NULL,
  body              TEXT    NOT NULL,
  sequence_step     INTEGER NOT NULL DEFAULT 1 CHECK(sequence_step IN (1,2,3)),
  status            TEXT    NOT NULL DEFAULT 'draft'
    CHECK(status IN ('draft','approved','rejected','sent','opened','clicked','replied','bounced')),
  sending_domain    TEXT,
  external_id       TEXT,                          -- ID from sending platform (Instantly, etc.)
  sent_at           TEXT,
  opened_at         TEXT,
  clicked_at        TEXT,
  replied_at        TEXT,
  created_at        TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_outreach_emails_agency  ON outreach_emails(agency_queue_id);
CREATE INDEX IF NOT EXISTS idx_outreach_emails_status  ON outreach_emails(status);
CREATE INDEX IF NOT EXISTS idx_outreach_emails_step    ON outreach_emails(sequence_step);

-- ============================================================
-- REPLIES
-- ============================================================
CREATE TABLE IF NOT EXISTS replies (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  outreach_email_id INTEGER NOT NULL REFERENCES outreach_emails(id),
  agency_queue_id   INTEGER NOT NULL REFERENCES agency_queue(id),
  reply_text        TEXT    NOT NULL,
  ai_category       TEXT    CHECK(ai_category IN ('interested','curious','correction','not_interested','negative')),
  ai_confidence     INTEGER,                       -- 0-100
  human_reviewed    INTEGER NOT NULL DEFAULT 0,    -- boolean
  action_taken      TEXT,
  created_at        TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_replies_category ON replies(ai_category);

-- ============================================================
-- PROCESSING LOG (for debugging / audit)
-- ============================================================
CREATE TABLE IF NOT EXISTS processing_log (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  agency_queue_id INTEGER REFERENCES agency_queue(id),
  event           TEXT    NOT NULL,                -- 'crawl_started','crawl_failed','valuation_complete', etc.
  details         TEXT    DEFAULT '{}',            -- JSON
  created_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_processing_log_agency ON processing_log(agency_queue_id);
`;
