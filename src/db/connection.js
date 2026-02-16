import Database from 'better-sqlite3';
import { SCHEMA_SQL } from './schema.js';
import path from 'path';
import fs from 'fs';

let _db = null;

/**
 * Get (or create) the singleton database connection.
 * Initialises the schema on first call.
 */
export function getDb(dbPath) {
  if (_db) return _db;

  const resolvedPath = dbPath || process.env.DATABASE_PATH || './data/outreach.db';
  const dir = path.dirname(resolvedPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  _db = new Database(resolvedPath);

  // Performance pragmas
  _db.pragma('journal_mode = WAL');
  _db.pragma('foreign_keys = ON');
  _db.pragma('busy_timeout = 5000');

  // Apply schema (idempotent — all CREATE IF NOT EXISTS)
  _db.exec(SCHEMA_SQL);

  return _db;
}

/**
 * Close the database connection cleanly.
 */
export function closeDb() {
  if (_db) {
    _db.close();
    _db = null;
  }
}
