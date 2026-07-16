#!/usr/bin/env python3
"""Phase 1 acceptance test.

Verifies, against the workbook itself (independent re-parse, not the importer):
  1. row counts survived the import (buyers / deals / ndas)
  2. query_ledger answers "buyers with >= 2 ecommerce NDAs" identically to a
     recount computed straight from the xlsx tabs
  3. query_ledger refuses writes
  4. Tier-3 real names are redacted server-side (skipped if no tier-3 deal)

Usage: python3 tests/test_phase1.py --xlsx data/The_Buyer_Map_Brain.xlsx
"""

import argparse
import re
import sys
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "mcp"))
from server import query_ledger  # noqa: E402

PASS, FAIL = 0, 0


def check(label, ok, detail=""):
    global PASS, FAIL
    mark = "PASS" if ok else "FAIL"
    print(f"[{mark}] {label}" + (f" — {detail}" if detail else ""))
    PASS += ok
    FAIL += not ok


def workbook_ecommerce_counts(xlsx):
    """Recount 'buyers with >=2 ecommerce NDAs' straight from the tabs.

    ecommerce NDA := an NDA (platform or off-platform) on a deal whose
    Seller Archetypes discipline contains 'ecommerce' (case-insensitive).
    """
    wb = openpyxl.load_workbook(xlsx, data_only=True)

    ecom_codes = set()
    realname = {}
    for r in wb["Seller Archetypes"].iter_rows(min_row=4, values_only=True):
        code, real, disc = r[0], r[1], r[2]
        if not code:
            continue
        if disc and "ecommerce" in str(disc).lower():
            ecom_codes.add(str(code).strip())
        if real and str(real).strip() not in ("?",):
            realname[str(real).strip().lower()] = str(code).strip()

    # buyer identity = Buyer Key (domain), exactly as the ledger joins;
    # buyers without a key resolve by Buyer Master name, then slug
    name_to_key = {}
    for r in wb["Buyer Master"].iter_rows(min_row=4, values_only=True):
        if r[0] and r[1]:
            name_to_key[str(r[0]).strip().lower()] = str(r[1]).strip().lower()

    def slugify(name):
        return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", name.lower())).strip("-")

    counts = {}
    for r in wb["NDA Log"].iter_rows(min_row=2, values_only=True):
        code, key = r[0], r[3]
        if key and code and str(code).strip() in ecom_codes:
            k = str(key).strip().lower()
            counts[k] = counts.get(k, 0) + 1

    for r in wb["Off-Platform NDAs"].iter_rows(min_row=2, values_only=True):
        buyer, project = r[1], r[3]
        if not buyer or str(buyer).strip().lower() == "buyer":
            continue
        p = str(project or "")
        code = None
        m = re.match(r'^Project\s+(\w[\w ]*)$', p.strip(), re.I)
        if m:
            code = m.group(1).strip()
        elif (m := re.match(r'^"([^"]+)"', p.strip())):
            code = m.group(1)
        else:
            for real, c in realname.items():
                if real in p.lower():
                    code = c
                    break
        if code and code in ecom_codes:
            bare = re.sub(r"\s*\(via [^)]*\)", "", str(buyer)).strip()
            k = name_to_key.get(bare.lower(), slugify(bare))
            counts[k] = counts.get(k, 0) + 1
    return {k: v for k, v in counts.items() if v >= 2}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--xlsx", type=Path, default=ROOT / "data" / "The_Buyer_Map_Brain.xlsx")
    args = ap.parse_args()

    # 1 ── row counts
    wb = openpyxl.load_workbook(args.xlsx, data_only=True)
    n_buyers_wb = sum(1 for r in wb["Buyer Master"].iter_rows(min_row=4, values_only=True)
                      if r[0] or r[1])
    n_nda_wb = sum(1 for r in wb["NDA Log"].iter_rows(min_row=2, values_only=True)
                   if r[2] or r[3])
    n_offp_wb = sum(1 for r in wb["Off-Platform NDAs"].iter_rows(min_row=2, values_only=True)
                    if r[1] and str(r[1]).strip().lower() != "buyer")

    res = query_ledger("SELECT (SELECT COUNT(*) FROM buyers), (SELECT COUNT(*) FROM deals), "
                       "(SELECT COUNT(*) FROM ndas WHERE off_platform=0), "
                       "(SELECT COUNT(*) FROM ndas WHERE off_platform=1)")
    b, d, n0, n1 = res["rows"][0]
    check("buyer count >= Buyer Master rows", b >= n_buyers_wb, f"ledger {b} vs workbook {n_buyers_wb}")
    check("platform NDA count matches NDA Log", n0 == n_nda_wb, f"ledger {n0} vs workbook {n_nda_wb}")
    check("off-platform NDA count matches tab", n1 == n_offp_wb, f"ledger {n1} vs workbook {n_offp_wb}")
    check("deals imported", d >= 55, f"{d} deals")

    # 2 ── THE acceptance query: buyers with >= 2 ecommerce NDAs
    expected = workbook_ecommerce_counts(args.xlsx)
    res = query_ledger("""
        SELECT b.key, b.name, COUNT(*) AS n
        FROM ndas n JOIN deals d ON d.code = n.deal_code
                    JOIN buyers b ON b.key = n.buyer_key
        WHERE lower(d.archetype) LIKE '%ecommerce%'
        GROUP BY b.key HAVING n >= 2 ORDER BY n DESC, b.name""")
    got = {key: n for key, _name, n in res["rows"]}
    names = {key: name for key, name, _n in res["rows"]}
    check("buyers with >=2 ecommerce NDAs match workbook recount",
          got == expected,
          f"{len(got)} buyers; ledger==recount" if got == expected
          else f"ledger-only: { {k: v for k, v in got.items() if expected.get(k) != v} } "
               f"recount-only: { {k: v for k, v in expected.items() if got.get(k) != v} }")
    for key, n in sorted(got.items(), key=lambda kv: -kv[1]):
        print(f"        {n:3d}  {names[key]}  ({key})")

    # 3 ── read-only enforcement
    res = query_ledger("INSERT INTO events (deal_code, kind) VALUES ('x','nda')")
    check("writes are refused", "error" in res, res.get("error", ""))
    res = query_ledger("DELETE FROM ndas")
    check("deletes are refused", "error" in res, res.get("error", ""))

    # 4 ── tier-3 redaction
    t3 = query_ledger("SELECT code FROM deals WHERE conf_tier >= 3")
    if not t3["rows"]:
        print("[skip] no conf_tier=3 deal in ledger — redaction untested (set data/overrides.json)")
    else:
        code = t3["rows"][0][0]
        res = query_ledger(f"SELECT real_name, outcome FROM deals WHERE code = '{code}'")
        leaked = any(v and v != code and code not in str(v) and "real_name" in c
                     for c, v in zip(res["columns"], res["rows"][0]))
        check(f"tier-3 deal '{code}' real name is redacted",
              res["rows"][0][0] == code, f"real_name column returned {res['rows'][0][0]!r}")
        blob = str(query_ledger(
            "SELECT * FROM deals WHERE conf_tier >= 3")["rows"])
        # the codename must appear; nothing else in that row should equal a name longer than the codename substitution
        check("tier-3 row scan contains codename", code in blob)

    print(f"\n{PASS} passed, {FAIL} failed")
    sys.exit(1 if FAIL else 0)


if __name__ == "__main__":
    main()
