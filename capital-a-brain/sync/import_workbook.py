#!/usr/bin/env python3
"""Seed the Capital A ledger from the Buyer Intelligence Master workbook.

Imports all tabs:
  Buyer Master        -> buyers
  Closed Deals        -> buyers (tier=closer) + merge flags
  Deal Code Key       -> deals (code <-> real name universe)
  Seller Archetypes   -> deals (archetype, geography, financials, outcome)
  NDA Log             -> ndas (off_platform=0) + events(kind='nda')
  Off-Platform NDAs   -> ndas (off_platform=1) + events(kind='nda')
  Adjacency Matrix    -> not stored; recomputable from ndas x deals x buyers

Confidentiality overrides (conf_tier per deal, tier per buyer) are read from
a NON-COMMITTED json file (see data/overrides.example.json) so that no
codename->sensitivity mapping ever appears in tracked code.

Usage:
  python3 sync/import_workbook.py --xlsx data/The_Buyer_Map_Brain.xlsx \
      [--db ledger/capital_a.db] [--overrides data/overrides.json]

Requires: openpyxl (the only non-stdlib dependency).
"""

import argparse
import datetime as dt
import json
import re
import sqlite3
import sys
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parent.parent

# Buyer buckets follow the Adjacency Matrix columns. First match wins.
BUCKET_RULES = [
    ("Email & retention",            ["email & retention", "email/sms", "lifecycle & retention", "retention marketing"]),
    ("Ecommerce marketing",          ["ecommerce", "e-commerce", "shopify", "amazon marketplace", "dtc marketing", "feed management"]),
    ("Performance & paid",           ["performance & paid", "performance marketing", "ppc", "paid media", "paid social", "lead gen", "media buying", "sem", "cro agency"]),
    ("SEO & content",                ["seo", "content marketing", "geo &", "ghostwriting", "thought leadership", "thought-leadership"]),
    ("PR & comms",                   ["pr &", "communications", "comms", "public affairs", "public relations"]),
    ("Social / influencer / creator",["influencer", "creator", "social &", "social media", "ugc", "tiktok", "social commerce"]),
    ("Creative & brand",             ["creative", "brand", "advertising agency", "design agency", "branding"]),
    ("Web & digital dev",            ["web & digital", "web design", "web dev", "digital development", "wordpress", "web instinct", "digital experience & web", "studio"]),
    ("Production & video",           ["production & video", "video production", "animation", "post-production", "film", "content production", "print"]),
    ("Experiential & events",        ["experiential", "events", "event production", "brand experience", "visitor attractions"]),
    ("Media / adtech / publisher",   ["media / advertising", "media / publisher", "adtech", "ad tech", "dooh", "programmatic", "media network", "media platform", "mobile ad", "billboard", "tv measurement", "media owner"]),
    ("Platform / SaaS / data",       ["saas", "platform", "data /", "data &", "insights", "martech", "software", "tech)", "privacy tech", "b2b sales leads", "audience data", "market research"]),
    ("Digital marketing (multi)",    ["digital marketing", "full-service", "multi-service", "digital agency", "digital performance", "consultancy", "consulting", "b2b marketing", "digital consultancy", "marketing membership", "marketing platform", "growth"]),
    ("Affiliate & partner",          ["affiliate", "partner marketing", "partnerstack"]),
    ("Holdco / serial acquirer",     ["holdco", "serial acquirer", "roll-up", "agency group", "acquirer"]),
    ("Financial buyer",              ["financial buyer", "pe / investor", "private equity", "investor", "capital", "equity", "buy-side", "vc", "accelerator"]),
    ("Individual",                   ["individual"]),
]

STAGE_RULES = [  # deal status derived from outcome text; first match wins
    ("closed",       ["closed", "completed acquisition"]),
    ("exclusivity",  ["exclusivity", "in dd", "/dd", " dd;"]),
    ("in_loi",       ["in loi", "loi under", "loi from", "loi $", "accepted", "multiple lois"]),
    ("withdrawn",    ["seller cold feet", "seller withdrew", "didn't close", "withdrawn"]),
    ("relaunching",  ["relaunch"]),
]


def norm(v):
    if v is None:
        return None
    s = str(v).strip()
    return s or None


def slug(name):
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", name.lower())).strip("-")


def clean_discipline(v):
    """Strip trailing confidence tag: 'SEO & content  [Website (...)]' -> 'SEO & content'."""
    if not v:
        return None
    return re.sub(r"\s*\[[^\]]*\]\s*$", "", v).strip() or None


def bucket_for(*texts):
    hay = " ".join(t for t in texts if t).lower()
    if not hay:
        return "Unknown"
    for bucket, keys in BUCKET_RULES:
        if any(k in hay for k in keys):
            return bucket
    return "Unknown"


def stage_for(outcome):
    if not outcome:
        return None
    low = outcome.lower()
    for stage, keys in STAGE_RULES:
        if any(k in low for k in keys):
            return stage
    return None


def parse_money(text):
    """Extract (revenue, ebitda) in dollars from a free-text size signal."""
    if not text:
        return None, None
    revenue = ebitda = None
    m = re.search(r"\$\s*([\d.]+)\s*m\+?\s*(?:rev\b|revenue)", text, re.I)
    if m:
        revenue = float(m.group(1)) * 1e6
    m = re.search(r"\$\s*([\d.]+)\s*m\+?\s*ebitda", text, re.I) or \
        re.search(r"ebitda\s*(?:fcst|forecast)?\s*\$\s*([\d.]+)\s*m", text, re.I)
    if m:
        ebitda = float(m.group(1)) * 1e6
    return revenue, ebitda


def iso_date(v):
    if v is None:
        return None
    if isinstance(v, (dt.datetime, dt.date)):
        return v.strftime("%Y-%m-%d")
    s = str(v).strip()
    return s or None


def rows_from(ws, header_row):
    """Yield rows (as tuples) below a 1-indexed header row, skipping blanks."""
    for row in ws.iter_rows(min_row=header_row + 1, values_only=True):
        if all(c is None or str(c).strip() == "" for c in row):
            continue
        yield row


class Importer:
    def __init__(self, xlsx, db, overrides):
        self.wb = openpyxl.load_workbook(xlsx, data_only=True)
        self.db = db
        self.overrides = overrides
        self.now = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        self.buyers = {}        # key -> dict
        self.name_to_key = {}   # lowercased buyer name -> key
        self.deals = {}         # code -> dict
        self.realname_to_code = {}
        self.ndas = []
        self.events = []
        self.warnings = []

    # ── buyers ──────────────────────────────────────────────────────────
    def load_buyer_master(self):
        ws = self.wb["Buyer Master"]
        for r in rows_from(ws, 3):
            name, key = norm(r[0]), norm(r[1])
            if not name and not key:
                continue
            if not key:
                key = slug(name)
                self.warnings.append(f"buyer '{name}' had no Buyer Key; using slug '{key}'")
            btype, discipline = norm(r[2]), clean_discipline(norm(r[13]))
            note_bits = [norm(r[11])]
            if norm(r[3]):
                note_bits.append(f"Contacts: {norm(r[3])}")
            if norm(r[4]):
                note_bits.append(f"Emails: {norm(r[4])}")
            if norm(r[10]):
                note_bits.append(f"Off-platform behaviour: {norm(r[10])}")
            if norm(r[14]):
                note_bits.append(f"Site: {norm(r[14])}")
            self.buyers[key] = {
                "key": key, "name": name or key,
                "discipline": discipline or btype,
                "bucket": bucket_for(discipline, btype),
                "tier": "unknown",
                "ebitda_floor": None, "ebitda_ceiling": None,
                "notes": "\n".join(b for b in note_bits if b) or None,
                "source": "workbook:Buyer Master",
                "updated": self.now,
                "_type": btype or "", "_bid_text": " ".join(filter(None, [btype, norm(r[13]), norm(r[10]), norm(r[11])])),
            }
            if name:
                self.name_to_key[name.lower()] = key

    def ensure_buyer(self, name, key=None, source="workbook"):
        """Resolve a buyer by key or name, creating a minimal row if new."""
        if key and key in self.buyers:
            return key
        if name and name.lower() in self.name_to_key:
            return self.name_to_key[name.lower()]
        key = key or slug(name)
        if key not in self.buyers:
            self.buyers[key] = {
                "key": key, "name": name or key, "discipline": None,
                "bucket": bucket_for(name), "tier": "unknown",
                "ebitda_floor": None, "ebitda_ceiling": None,
                "notes": None, "source": source, "updated": self.now,
                "_type": "", "_bid_text": "",
            }
            if name:
                self.name_to_key[name.lower()] = key
        return key

    def load_closed_deals(self):
        ws = self.wb["Closed Deals"]
        self._closers, self._closed_bidders = set(), set()
        for r in rows_from(ws, 3):
            seller, buyer, in_log = norm(r[0]), norm(r[1]), norm(r[2]) or ""
            if not buyer or buyer.lower().startswith("buyer"):
                continue
            # 'Generation Media (LOI, seller withdrew)' closed nothing — bidder.
            bidder_only = "loi" in buyer.lower() or "withdrew" in buyer.lower()
            bare = re.sub(r"\s*\(.*\)$", "", buyer).strip()
            key = None
            m = re.search(r"YES\s*[—-]\s*([\w.-]+\.[a-z]{2,})", in_log, re.I)
            if m and m.group(1).lower() in self.buyers:
                key = m.group(1).lower()
            key = key or self.ensure_buyer(bare, source="workbook:Closed Deals")
            (self._closed_bidders if bidder_only else self._closers).add(key)
            note = f"Closed-deals tab: bought '{seller}'" if not bidder_only else f"Closed-deals tab: {buyer} on '{seller}'"
            b = self.buyers[key]
            b["notes"] = (b["notes"] + "\n" + note) if b["notes"] else note

    def assign_tiers(self):
        per_buyer_deals = {}
        for n in self.ndas:
            if n["buyer_key"] and n["deal_code"]:
                per_buyer_deals.setdefault(n["buyer_key"], set()).add(n["deal_code"])
        for key, b in self.buyers.items():
            bid_text = b.pop("_bid_text", "").lower()
            b.pop("_type", None)
            ndeals = len(per_buyer_deals.get(key, ()))
            if key in getattr(self, "_closers", ()):
                b["tier"] = "closer"
            elif key in getattr(self, "_closed_bidders", ()) or "proven bidder" in bid_text or re.search(r"\bloi\b", bid_text):
                b["tier"] = "bidder"
            elif ndeals >= 2:
                b["tier"] = "repeat"
            elif ndeals == 1:
                b["tier"] = "single"
            else:
                b["tier"] = "unknown"

    # ── deals ───────────────────────────────────────────────────────────
    def load_deal_code_key(self):
        ws = self.wb["Deal Code Key"]
        for r in rows_from(ws, 1):
            code, real = norm(r[0]), norm(r[1])
            if not code or code.lower() == "deal code":
                continue
            if real in (None, "?"):
                real = None
            if code in self.deals and not real:
                continue
            self.deals.setdefault(code, {
                "code": code, "real_name": real, "conf_tier": 1,
                "archetype": None, "geography": None, "status": None,
                "revenue": None, "ebitda": None, "outcome": None, "outcome_date": None,
            })
            if real:
                self.deals[code]["real_name"] = real
                self.realname_to_code.setdefault(real.lower(), code)

    def load_seller_archetypes(self):
        ws = self.wb["Seller Archetypes"]
        for r in rows_from(ws, 3):
            code, real = norm(r[0]), norm(r[1])
            if not code or code.lower() == "deal code":
                continue
            if real in (None, "?"):
                real = None
            d = self.deals.setdefault(code, {
                "code": code, "real_name": real, "conf_tier": 1,
                "archetype": None, "geography": None, "status": None,
                "revenue": None, "ebitda": None, "outcome": None, "outcome_date": None,
            })
            archetype, geo, size, outcome = norm(r[2]), norm(r[4]), norm(r[6]), norm(r[11])
            if archetype and not (d["archetype"] and archetype.upper().startswith("UNMAPPED")):
                d["archetype"] = d["archetype"] or archetype
            d["geography"] = d["geography"] or geo
            rev, ebitda = parse_money(size)
            d["revenue"] = d["revenue"] if d["revenue"] is not None else rev
            d["ebitda"] = d["ebitda"] if d["ebitda"] is not None else ebitda
            if outcome:
                d["outcome"] = outcome
                d["status"] = stage_for(outcome) or d["status"]
            if real and not d["real_name"]:
                d["real_name"] = real
            if d["real_name"]:
                self.realname_to_code.setdefault(d["real_name"].lower(), code)

    # ── NDAs ────────────────────────────────────────────────────────────
    def load_nda_log(self):
        ws = self.wb["NDA Log"]
        for r in rows_from(ws, 1):
            buyer, bkey = norm(r[2]), norm(r[3])
            if not buyer and not bkey:
                continue
            code = norm(r[0])
            if code and code not in self.deals:
                self.deals[code] = {
                    "code": code, "real_name": None, "conf_tier": 1,
                    "archetype": None, "geography": None, "status": None,
                    "revenue": None, "ebitda": None, "outcome": None, "outcome_date": None,
                }
                self.warnings.append(f"NDA Log deal code '{code}' missing from Deal Code Key; created bare deal row")
            key = self.ensure_buyer(buyer, key=(bkey.lower() if bkey else None), source="workbook:NDA Log")
            date = iso_date(r[6])
            note_bits = [norm(r[8])]
            if norm(r[4]):
                note_bits.append(f"Contact: {norm(r[4])} <{norm(r[5]) or ''}>")
            self.ndas.append({
                "deal_code": code, "buyer_key": key, "signed_date": date,
                "approved": norm(r[7]), "off_platform": 0,
                "notes": " | ".join(b for b in note_bits if b) or None,
            })
            self.events.append({
                "deal_code": code, "date": date, "kind": "nda",
                "actor": buyer or key, "detail": f"NDA ({norm(r[7]) or 'status unknown'})",
                "source": "workbook:NDA Log",
            })

    def match_offplatform_deal(self, project):
        """Map an off-platform 'Deal / Project' string to a deal code."""
        if not project:
            return None
        p = project.strip()
        for frag, code in self.overrides.get("project_map", {}).items():
            if frag.lower() in p.lower() and code in self.deals:
                return code
        m = re.match(r'^Project\s+(\w[\w ]*)$', p, re.I)
        if m and m.group(1).strip() in self.deals:
            return m.group(1).strip()
        m = re.match(r'^"([^"]+)"', p)  # quoted codename, e.g. "Codename" (description...)
        if m and m.group(1) in self.deals:
            return m.group(1)
        low = p.lower()
        for real, code in self.realname_to_code.items():
            if real in low:
                return code
        for code in self.deals:  # bare codename mentioned anywhere
            if re.search(rf"\b{re.escape(code.lower())}\b", low):
                return code
        return None

    def load_off_platform(self):
        ws = self.wb["Off-Platform NDAs"]
        for r in rows_from(ws, 1):
            buyer = norm(r[1])
            if not buyer or buyer.lower() == "buyer":
                continue
            project, action, evidence = norm(r[3]), norm(r[5]), norm(r[6])
            code = self.match_offplatform_deal(project)
            if not code:
                self.warnings.append(f"off-platform NDA for '{buyer}' — could not map project '{project}' to a deal code")
            bare = re.sub(r"\s*\(via [^)]*\)", "", buyer).strip()
            key = self.ensure_buyer(bare, source="workbook:Off-Platform NDAs")
            date = iso_date(r[7])
            notes = " | ".join(x for x in [action, norm(r[8]), f"Contacts: {norm(r[2])}" if norm(r[2]) else None,
                                           f"Evidence: {evidence}" if evidence else None,
                                           f"Project as written: {project}" if not code else None] if x)
            self.ndas.append({
                "deal_code": code, "buyer_key": key, "signed_date": date,
                "approved": None, "off_platform": 1, "notes": notes or None,
            })
            self.events.append({
                "deal_code": code, "date": date, "kind": "nda",
                "actor": buyer, "detail": f"Off-platform NDA: {action or 'unspecified'}",
                "source": "workbook:Off-Platform NDAs",
            })

    # ── overrides & write ───────────────────────────────────────────────
    def apply_overrides(self):
        for code, fields in self.overrides.get("deals", {}).items():
            if code in self.deals:
                self.deals[code].update({k: v for k, v in fields.items() if k in self.deals[code]})
            else:
                self.warnings.append(f"override for unknown deal code '{code}' ignored")
        for key, fields in self.overrides.get("buyers", {}).items():
            if key in self.buyers:
                self.buyers[key].update({k: v for k, v in fields.items() if k in self.buyers[key]})
            else:
                self.warnings.append(f"override for unknown buyer key '{key}' ignored")

    def write(self):
        self.db.parent.mkdir(parents=True, exist_ok=True)
        conn = sqlite3.connect(self.db)
        conn.executescript((ROOT / "ledger" / "schema.sql").read_text())
        with conn:
            conn.execute("DELETE FROM events WHERE source LIKE 'workbook:%'")
            conn.execute("DELETE FROM ndas"); conn.execute("DELETE FROM deals"); conn.execute("DELETE FROM buyers")
            conn.executemany(
                "INSERT INTO buyers VALUES (:key,:name,:discipline,:bucket,:tier,:ebitda_floor,:ebitda_ceiling,:notes,:source,:updated)",
                self.buyers.values())
            conn.executemany(
                "INSERT INTO deals VALUES (:code,:real_name,:conf_tier,:archetype,:geography,:status,:revenue,:ebitda,:outcome,:outcome_date)",
                self.deals.values())
            conn.executemany(
                "INSERT INTO ndas (deal_code,buyer_key,signed_date,approved,off_platform,notes) "
                "VALUES (:deal_code,:buyer_key,:signed_date,:approved,:off_platform,:notes)", self.ndas)
            conn.executemany(
                "INSERT INTO events (deal_code,date,kind,actor,detail,source) "
                "VALUES (:deal_code,:date,:kind,:actor,:detail,:source)", self.events)
        conn.close()

    def run(self):
        self.load_buyer_master()
        self.load_deal_code_key()
        self.load_seller_archetypes()
        self.load_nda_log()
        self.load_off_platform()
        self.load_closed_deals()
        self.assign_tiers()
        self.apply_overrides()
        self.write()


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--xlsx", required=True, type=Path)
    ap.add_argument("--db", type=Path, default=ROOT / "ledger" / "capital_a.db")
    ap.add_argument("--overrides", type=Path, default=ROOT / "data" / "overrides.json")
    args = ap.parse_args()

    overrides = {}
    if args.overrides.exists():
        overrides = json.loads(args.overrides.read_text())
    else:
        print(f"note: no overrides file at {args.overrides} — all deals default to conf_tier=1", file=sys.stderr)

    imp = Importer(args.xlsx, args.db, overrides)
    imp.run()

    conn = sqlite3.connect(args.db)
    counts = {t: conn.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0]
              for t in ("buyers", "deals", "ndas", "events")}
    tiers = dict(conn.execute("SELECT tier, COUNT(*) FROM buyers GROUP BY tier ORDER BY 2 DESC"))
    conn.close()
    print(f"imported -> {args.db}")
    print("  rows:", counts)
    print("  buyer tiers:", tiers)
    if imp.warnings:
        print(f"  {len(imp.warnings)} warnings:")
        for w in imp.warnings:
            print("   -", w)


if __name__ == "__main__":
    main()
