-- Capital A brain — ledger schema (SQLite)
-- The ledger is the exact-answer layer: counts, filters, joins.
-- Narrative truth lives in the vault; raw transcripts live in chroma.

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS buyers (
  key TEXT PRIMARY KEY,            -- domain or canonical name
  name TEXT, discipline TEXT, bucket TEXT,
  tier TEXT CHECK(tier IN ('closer','bidder','repeat','single','unknown')),
  ebitda_floor REAL, ebitda_ceiling REAL,   -- stated criteria where known
  notes TEXT, source TEXT, updated TEXT
);

CREATE TABLE IF NOT EXISTS deals (
  code TEXT PRIMARY KEY, real_name TEXT,
  conf_tier INTEGER DEFAULT 1,      -- 1 open · 2 codename-only externally · 3 never name
  archetype TEXT, geography TEXT, status TEXT,
  revenue REAL, ebitda REAL, outcome TEXT, outcome_date TEXT
);

CREATE TABLE IF NOT EXISTS ndas (
  id INTEGER PRIMARY KEY, deal_code TEXT REFERENCES deals(code),
  buyer_key TEXT REFERENCES buyers(key),
  signed_date TEXT, approved TEXT, off_platform INTEGER DEFAULT 0, notes TEXT
);

CREATE TABLE IF NOT EXISTS events (                -- the timeline, queryable
  id INTEGER PRIMARY KEY, deal_code TEXT, date TEXT,
  kind TEXT,                         -- nda | cim | loi | offer | exclusivity | close | withdrawal | call
  actor TEXT, detail TEXT, source TEXT
);

CREATE INDEX IF NOT EXISTS idx_ndas_deal  ON ndas(deal_code);
CREATE INDEX IF NOT EXISTS idx_ndas_buyer ON ndas(buyer_key);
CREATE INDEX IF NOT EXISTS idx_events_deal ON events(deal_code, date);
CREATE INDEX IF NOT EXISTS idx_buyers_bucket ON buyers(bucket);
