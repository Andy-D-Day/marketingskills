#!/usr/bin/env node
/**
 * Test script for Phase 1: CRM Extract & Queue System.
 *
 * Runs through the full pipeline using mock data:
 * 1. Sets up the database
 * 2. Creates a test cohort
 * 3. Enqueues 10 mock agencies
 * 4. Verifies deduplication
 * 5. Checks status tracking
 * 6. Displays pipeline stats
 *
 * Usage: node scripts/test-extract.js
 */

import { getDb, closeDb } from '../src/db/connection.js';
import {
  createCohort,
  getCohortById,
  getCohortStats,
  enqueueAgencies,
  isLeadInPipeline,
  updateAgencyStatus,
  getQueuedAgencies,
  getAgenciesByStatus,
  getGlobalStats,
  logEvent,
} from '../src/db/operations.js';
import { printCohortDetail, printAgencyTable, printGlobalStats } from '../src/utils/display.js';

// Use a test database
const TEST_DB_PATH = './data/test-outreach.db';

console.log('╔══════════════════════════════════════════════════════╗');
console.log('║  Phase 1 Test: CRM Extract & Queue System           ║');
console.log('╚══════════════════════════════════════════════════════╝\n');

// ──────────────────────────────────────────────────────────────
// Step 1: Set up database
// ──────────────────────────────────────────────────────────────
console.log('Step 1: Setting up database...');
const db = getDb(TEST_DB_PATH);
console.log('  ✓ Database initialised\n');

// ──────────────────────────────────────────────────────────────
// Step 2: Create test cohorts
// ──────────────────────────────────────────────────────────────
console.log('Step 2: Creating test cohorts...');

const cohort1 = createCohort({
  name: 'uk-performance-marketing-20-50',
  description: 'UK Performance Marketing agencies, 20-50 employees',
  filters: {
    country: 'GB',
    tags: ['performance-marketing'],
    lead_status: 'Potential',
  },
  batchSize: 200,
});
console.log(`  ✓ Cohort created: "${cohort1.name}" (ID: ${cohort1.id})`);

const cohort2 = createCohort({
  name: 'us-creative-southeast',
  description: 'US Creative Agencies in Southeast region',
  filters: {
    country: 'US',
    tags: ['creative'],
    search_query: 'southeast',
  },
  batchSize: 100,
});
console.log(`  ✓ Cohort created: "${cohort2.name}" (ID: ${cohort2.id})`);
console.log('');

// ──────────────────────────────────────────────────────────────
// Step 3: Enqueue mock agencies
// ──────────────────────────────────────────────────────────────
console.log('Step 3: Enqueuing 10 mock agencies into cohort 1...');

const mockAgencies = [
  {
    close_lead_id: 'lead_001',
    company_name: 'Velocity Digital',
    website_url: 'https://velocitydigital.co.uk',
    contact_name: 'James Chen',
    contact_email: 'james@velocitydigital.co.uk',
    contact_title: 'Founder & MD',
    phone: '+44 20 7123 4567',
    location: 'London',
    country: 'GB',
    close_tags: ['performance-marketing', 'google-ads'],
    lead_status: 'Potential',
  },
  {
    close_lead_id: 'lead_002',
    company_name: 'Pixel & Pulse',
    website_url: 'https://pixelandpulse.com',
    contact_name: 'Sarah Mitchell',
    contact_email: 'sarah@pixelandpulse.com',
    contact_title: 'CEO',
    location: 'Manchester',
    country: 'GB',
    close_tags: ['performance-marketing', 'social-media'],
    lead_status: 'Potential',
  },
  {
    close_lead_id: 'lead_003',
    company_name: 'Growth Engine Media',
    website_url: 'https://growthengine.media',
    contact_name: 'Tom Whitfield',
    contact_email: 'tom@growthengine.media',
    contact_title: 'Managing Director',
    location: 'Birmingham',
    country: 'GB',
    close_tags: ['performance-marketing'],
    lead_status: 'Potential',
  },
  {
    close_lead_id: 'lead_004',
    company_name: 'Catalyst Agency',
    website_url: 'https://catalystagency.co.uk',
    contact_name: 'Emma Robinson',
    contact_email: 'emma@catalystagency.co.uk',
    contact_title: 'Founder',
    phone: '+44 161 555 0123',
    location: 'Leeds',
    country: 'GB',
    close_tags: ['performance-marketing', 'seo'],
    lead_status: 'Potential',
  },
  {
    close_lead_id: 'lead_005',
    company_name: 'Apex Digital Partners',
    website_url: 'https://apexdigitalpartners.co.uk',
    contact_name: 'David Park',
    contact_email: 'david@apexdigitalpartners.co.uk',
    contact_title: 'Co-Founder',
    location: 'Edinburgh',
    country: 'GB',
    close_tags: ['performance-marketing', 'paid-social'],
    lead_status: 'Potential',
  },
  {
    close_lead_id: 'lead_006',
    company_name: 'Frontier Marketing Group',
    website_url: 'https://frontiermktg.co.uk',
    contact_name: 'Olivia Barnes',
    contact_email: 'olivia@frontiermktg.co.uk',
    contact_title: 'Director',
    location: 'Bristol',
    country: 'GB',
    close_tags: ['performance-marketing'],
    lead_status: 'Potential',
  },
  {
    close_lead_id: 'lead_007',
    company_name: 'Signal Performance',
    website_url: 'https://signalperformance.io',
    contact_name: 'Ryan O\'Connor',
    contact_email: 'ryan@signalperformance.io',
    contact_title: 'CEO',
    phone: '+44 20 7456 7890',
    location: 'London',
    country: 'GB',
    close_tags: ['performance-marketing', 'programmatic'],
    lead_status: 'Potential',
  },
  {
    close_lead_id: 'lead_008',
    company_name: 'Momentum Digital',
    website_url: 'https://momentumdigital.co.uk',
    contact_name: 'Kate Williams',
    contact_email: 'kate@momentumdigital.co.uk',
    contact_title: 'Managing Partner',
    location: 'Glasgow',
    country: 'GB',
    close_tags: ['performance-marketing', 'analytics'],
    lead_status: 'Potential',
  },
  {
    close_lead_id: 'lead_009',
    company_name: 'Radiant Media Co',
    website_url: 'https://radiantmedia.co.uk',
    contact_name: 'Michael Torres',
    contact_email: 'michael@radiantmedia.co.uk',
    contact_title: 'Founder',
    location: 'Cardiff',
    country: 'GB',
    close_tags: ['performance-marketing', 'content'],
    lead_status: 'Potential',
  },
  {
    close_lead_id: 'lead_010',
    company_name: 'NorthStar Agency',
    website_url: 'https://northstaragency.co.uk',
    contact_name: 'Lucy Harper',
    contact_email: 'lucy@northstaragency.co.uk',
    contact_title: 'Co-Founder & CEO',
    location: 'Newcastle',
    country: 'GB',
    close_tags: ['performance-marketing', 'conversion'],
    lead_status: 'Potential',
  },
];

const result1 = enqueueAgencies(cohort1.id, mockAgencies);
console.log(`  ✓ Added: ${result1.added}, Skipped: ${result1.skipped}`);
console.log('');

// ──────────────────────────────────────────────────────────────
// Step 4: Test deduplication
// ──────────────────────────────────────────────────────────────
console.log('Step 4: Testing deduplication...');

// Try to add the same agencies again to the same cohort
const result2 = enqueueAgencies(cohort1.id, mockAgencies);
console.log(`  ✓ Re-enqueue same agencies: Added: ${result2.added}, Skipped: ${result2.skipped}`);
assert(result2.added === 0, 'Deduplication within cohort should prevent re-adding');
assert(result2.skipped === 10, 'All 10 should be skipped as duplicates');

// Check cross-pipeline deduplication
const pipelineCheck = isLeadInPipeline('lead_001');
console.log(`  ✓ lead_001 in pipeline: ${pipelineCheck ? 'Yes' : 'No'} (cohort: ${pipelineCheck?.cohort_name})`);
assert(pipelineCheck !== null, 'lead_001 should be found in pipeline');

const notInPipeline = isLeadInPipeline('lead_999');
console.log(`  ✓ lead_999 in pipeline: ${notInPipeline ? 'Yes' : 'No'}`);
assert(notInPipeline === null, 'lead_999 should not be found in pipeline');
console.log('');

// ──────────────────────────────────────────────────────────────
// Step 5: Test status transitions
// ──────────────────────────────────────────────────────────────
console.log('Step 5: Testing status transitions...');

const queued = getQueuedAgencies(cohort1.id, 10);
console.log(`  ✓ ${queued.length} agencies in "queued" status`);

// Simulate processing pipeline
updateAgencyStatus(queued[0].id, 'crawling');
updateAgencyStatus(queued[1].id, 'crawling');
updateAgencyStatus(queued[0].id, 'valued');
updateAgencyStatus(queued[1].id, 'failed', { failure_reason: 'Website returned 403 — Cloudflare challenge' });
updateAgencyStatus(queued[2].id, 'crawling');
updateAgencyStatus(queued[2].id, 'valued');
updateAgencyStatus(queued[2].id, 'quality_checked');
updateAgencyStatus(queued[2].id, 'email_generated');
updateAgencyStatus(queued[2].id, 'ready_to_send');

// Log events
logEvent(queued[0].id, 'crawl_started', { url: queued[0].website_url });
logEvent(queued[0].id, 'crawl_completed', { pages_crawled: 12, duration_ms: 4500 });
logEvent(queued[0].id, 'valuation_complete', { confidence: 78, valuation_mid: 1850000 });
logEvent(queued[1].id, 'crawl_started', { url: queued[1].website_url });
logEvent(queued[1].id, 'crawl_failed', { reason: 'Cloudflare 403', status_code: 403 });

console.log(`  ✓ Status transitions applied`);
console.log(`  ✓ Processing events logged`);
console.log('');

// ──────────────────────────────────────────────────────────────
// Step 6: Show pipeline stats
// ──────────────────────────────────────────────────────────────
console.log('Step 6: Pipeline stats...');

const cohort1Refreshed = getCohortById(cohort1.id);
const stats = getCohortStats(cohort1.id);
printCohortDetail(cohort1Refreshed, stats);

// Show queued agencies
const stillQueued = getQueuedAgencies(cohort1.id, 10);
console.log(`Queued agencies (${stillQueued.length}):`);
printAgencyTable(stillQueued);

// Show failed agencies
const failed = getAgenciesByStatus(cohort1.id, 'failed', 10);
if (failed.length > 0) {
  console.log(`\nFailed agencies (${failed.length}):`);
  printAgencyTable(failed);
}

// Global stats
const globalStats = getGlobalStats();
printGlobalStats(globalStats);

// ──────────────────────────────────────────────────────────────
// Cleanup
// ──────────────────────────────────────────────────────────────
closeDb();

// Clean up test database
import fs from 'fs';
try { fs.unlinkSync(TEST_DB_PATH); } catch {}
try { fs.unlinkSync(TEST_DB_PATH + '-journal'); } catch {}
try { fs.unlinkSync(TEST_DB_PATH + '-wal'); } catch {}
try { fs.unlinkSync(TEST_DB_PATH + '-shm'); } catch {}

console.log('╔══════════════════════════════════════════════════════╗');
console.log('║  All Phase 1 tests passed ✓                         ║');
console.log('╚══════════════════════════════════════════════════════╝\n');

function assert(condition, message) {
  if (!condition) {
    console.error(`  ✗ ASSERTION FAILED: ${message}`);
    closeDb();
    process.exit(1);
  }
}
