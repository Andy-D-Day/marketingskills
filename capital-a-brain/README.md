# Capital A Brain

Deal-intelligence memory system for Capital A: a human-readable **vault**
(markdown truth), an exact-answer **ledger** (SQLite), and the existing
**Chroma** store of raw Fireflies transcripts, all fronted by an MCP server.

> **DATA SAFETY — READ FIRST**
> This folder lives in a **public** git repository. Only code and generic
> templates are committed. The workbook, the ledger database, the vault
> contents, embeddings, and `data/overrides.json` (which maps codenames to
> confidentiality tiers) are all gitignored and must stay that way.
> Never commit anything containing a real buyer or seller name.

## Layout

```
capital-a-brain/
├── vault/          # human-readable truth (deals, relationships, entities, playbooks) — NOT in git
├── ledger/         # capital_a.db (SQLite) — schema.sql is in git, the .db is not
├── chroma/         # existing raw-transcript embeddings — point CAPITAL_A_CHROMA here
├── sync/           # import + nightly sync jobs
├── mcp/            # MCP server (query_ledger, later: deal_brief, match_archetype, …)
├── tests/          # per-phase acceptance tests
└── data/           # source workbook + overrides.json — NOT in git
```

## Setup

```bash
pip install openpyxl                      # only non-stdlib dependency for Phase 1
cp <workbook>.xlsx data/The_Buyer_Map_Brain.xlsx
cp data/overrides.example.json data/overrides.json   # then set real conf_tiers
python3 sync/import_workbook.py --xlsx data/The_Buyer_Map_Brain.xlsx
python3 tests/test_phase1.py              # acceptance test
```

## Ledger

Four tables (see `ledger/schema.sql`): `buyers`, `deals`, `ndas`, `events`.

- `buyers.tier`: `closer` (completed an acquisition) > `bidder` (reached
  LOI/offer) > `repeat` (NDAs on ≥2 deals) > `single` > `unknown`.
  Derived from the workbook; correctable via `data/overrides.json`.
- `buyers.bucket`: normalized to the Adjacency Matrix buckets so the matrix
  is recomputable with one GROUP BY.
- `deals.conf_tier`: 1 open · 2 codename-only externally · 3 never name.
  Set **only** in `data/overrides.json` — never in code.
- `ndas.off_platform`: 1 for NDAs executed on the buyer's own paper /
  outside the platform (from the Off-Platform tab).
- `events`: queryable timeline; import seeds one `nda` event per NDA.

## MCP server

`mcp/server.py` — core functions importable without the `mcp` package, so an
existing server can mount them. Guarantees enforced server-side:

1. `query_ledger` is read-only (SQLite authorizer; `log_event` will be the
   only write path).
2. Real names of `conf_tier >= 3` deals are substituted with the codename in
   every outbound string — the model never sees them.

Env: `CAPITAL_A_DB` (ledger path), `CAPITAL_A_CHROMA` (existing Chroma dir).

## Build phases

| Phase | Scope | Status |
|-------|-------|--------|
| 1 | Ledger schema + workbook import + `query_ledger` | ✅ done — `tests/test_phase1.py` |
| 2 | Vault scaffold + pilot deals + `deal_brief` | pending |
| 3 | Fireflies nightly pull → chroma + distilled vault notes | pending |
| 4 | Drive ingest (LOIs, engagement letters) → terms + events | pending |
| 5 | `match_archetype` (the Buyer Map) | pending |
| 6 | Remote MCP access (Claude Desktop + claude.ai) | pending |
