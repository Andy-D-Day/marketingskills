#!/usr/bin/env node
/**
 * Initialise the SQLite database and verify the schema.
 * Usage: node scripts/setup-db.js
 */
import 'dotenv/config';
import { getDb, closeDb } from '../src/db/connection.js';

console.log('Setting up database...');

const db = getDb();

// Verify all tables exist
const tables = db.prepare(
  "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
).all().map(r => r.name);

console.log(`\nCreated tables: ${tables.join(', ')}`);

// Show table row counts
for (const table of tables) {
  if (table.startsWith('sqlite_')) continue;
  const { count } = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get();
  console.log(`  ${table}: ${count} rows`);
}

closeDb();
console.log('\nDatabase setup complete.');
