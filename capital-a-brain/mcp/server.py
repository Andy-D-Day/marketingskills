#!/usr/bin/env python3
"""Capital A brain — MCP server.

Phase 1 exposes `query_ledger`. Later phases add search_calls, search_vault,
deal_brief, match_archetype, relationship_brief, log_event.

Two hard guarantees are enforced HERE, at the server, never left to the model:
  1. query_ledger is read-only — a SQLite authorizer rejects any write.
  2. Tier-3 real names never leave the server. Every outbound string is
     scanned and the real name is replaced by its codename.

The core functions are importable without the `mcp` package so the existing
MCP server can mount them, and so tests can call them directly:

    from server import query_ledger

Config (env):
  CAPITAL_A_DB      path to ledger sqlite (default: ../ledger/capital_a.db)
  CAPITAL_A_CHROMA  path to the existing Chroma store (used from Phase 3)
"""

import json
import os
import re
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = Path(os.environ.get("CAPITAL_A_DB", ROOT / "ledger" / "capital_a.db"))

MAX_ROWS = 200

# SQLite authorizer action codes that a read-only query may perform.
_READ_OK = {
    sqlite3.SQLITE_SELECT, sqlite3.SQLITE_READ, sqlite3.SQLITE_FUNCTION,
    sqlite3.SQLITE_RECURSIVE,
}


def _authorizer(action, arg1, arg2, dbname, source):
    if action in _READ_OK:
        return sqlite3.SQLITE_OK
    return sqlite3.SQLITE_DENY


def _connect_ro():
    if not DB_PATH.exists():
        raise FileNotFoundError(
            f"ledger not found at {DB_PATH} — run sync/import_workbook.py first")
    conn = sqlite3.connect(f"file:{DB_PATH}?mode=ro", uri=True)
    conn.set_authorizer(_authorizer)
    return conn


# ── Tier-3 redaction ─────────────────────────────────────────────────────────

def _tier3_map(conn):
    """{real_name_lower: codename} for every conf_tier=3 deal with a real name."""
    conn.set_authorizer(None)  # trusted internal read
    rows = conn.execute(
        "SELECT code, real_name FROM deals WHERE conf_tier >= 3 AND real_name IS NOT NULL"
    ).fetchall()
    conn.set_authorizer(_authorizer)
    return {real: code for code, real in rows}


def _redact_value(value, t3):
    if not isinstance(value, str) or not t3:
        return value
    for real, code in t3.items():
        # match the full name and its distinctive first token, case-insensitively
        tokens = [re.escape(real)]
        first = real.split()[0]
        if len(first) >= 4:
            tokens.append(re.escape(first) + r"[\w'-]*")
        for tok in tokens:
            value = re.sub(tok, code, value, flags=re.I)
    return value


def redact(obj, t3):
    """Recursively substitute Tier-3 real names with codenames in any result."""
    if isinstance(obj, str):
        return _redact_value(obj, t3)
    if isinstance(obj, dict):
        return {k: redact(v, t3) for k, v in obj.items()}
    if isinstance(obj, (list, tuple)):
        return [redact(v, t3) for v in obj]
    return obj


# ── tools ────────────────────────────────────────────────────────────────────

def query_ledger(sql, read_only=True):
    """Run a read-only SQL query against the ledger.

    Returns {columns, rows, row_count, truncated, conf_note}. Writes are
    refused regardless of the read_only argument — log_event (later phase)
    is the only write path.
    """
    if not read_only:
        return {"error": "query_ledger is read-only; use log_event to write"}
    conn = _connect_ro()
    try:
        t3 = _tier3_map(conn)
        try:
            cur = conn.execute(sql)
        except sqlite3.DatabaseError as e:
            return {"error": f"SQL error: {e}"}
        columns = [d[0] for d in cur.description] if cur.description else []
        rows = cur.fetchmany(MAX_ROWS + 1)
        truncated = len(rows) > MAX_ROWS
        rows = [list(r) for r in rows[:MAX_ROWS]]
        result = {
            "columns": columns,
            "rows": redact(rows, t3),
            "row_count": len(rows),
            "truncated": truncated,
            "conf_note": ("deals.conf_tier governs naming: 2 = codename-only externally, "
                          "3 = real name withheld (already substituted server-side)"),
        }
        return result
    finally:
        conn.close()


# ── MCP wiring (optional; core funcs above work without it) ──────────────────

def build_mcp():
    from mcp.server.fastmcp import FastMCP
    srv = FastMCP("capital-a-brain")

    @srv.tool()
    def query_ledger_tool(sql: str) -> str:
        """Exact counting/filtering over buyers, deals, ndas, events (read-only SQL).
        Tables: buyers(key,name,discipline,bucket,tier,ebitda_floor,ebitda_ceiling,notes,source,updated)
        deals(code,real_name,conf_tier,archetype,geography,status,revenue,ebitda,outcome,outcome_date)
        ndas(id,deal_code,buyer_key,signed_date,approved,off_platform,notes)
        events(id,deal_code,date,kind,actor,detail,source)"""
        return json.dumps(query_ledger(sql), default=str)

    return srv


if __name__ == "__main__":
    build_mcp().run()
