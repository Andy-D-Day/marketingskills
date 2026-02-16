/**
 * CRM Extraction Module.
 *
 * Pulls leads from Close CRM based on cohort filters,
 * transforms them, deduplicates, and enqueues for processing.
 */

import { CloseClient, transformLeadToAgency } from './close-client.js';
import {
  createCohort,
  getCohortById,
  enqueueAgencies,
  isLeadInPipeline,
  logEvent,
  getCohortStats,
} from '../db/operations.js';

/**
 * Extract agencies from Close CRM and enqueue them for a cohort.
 *
 * @param {object} options
 * @param {number} options.cohortId — existing cohort to add to
 * @param {string} options.cohortName — or create a new cohort with this name
 * @param {string} options.description — cohort description
 * @param {object} options.filters — Close query filters
 * @param {number} options.batchSize — max agencies to extract
 * @param {boolean} options.skipDuplicates — check pipeline for existing leads (default: true)
 * @param {Function} options.onProgress — progress callback
 * @returns {object} — { cohort, added, skipped, duplicatesInPipeline, errors }
 */
export async function extractFromClose(options) {
  const {
    cohortId,
    cohortName,
    description,
    filters,
    batchSize = 200,
    skipDuplicates = true,
    onProgress = () => {},
  } = options;

  const client = new CloseClient();

  // Resolve or create cohort
  let cohort;
  if (cohortId) {
    cohort = getCohortById(cohortId);
    if (!cohort) throw new Error(`Cohort ${cohortId} not found`);
  } else if (cohortName) {
    cohort = createCohort({
      name: cohortName,
      description: description || `Extracted from Close on ${new Date().toISOString().split('T')[0]}`,
      filters,
      batchSize,
    });
  } else {
    throw new Error('Either cohortId or cohortName is required');
  }

  onProgress({ phase: 'searching', message: `Searching Close CRM with filters...` });

  // Search Close for matching leads
  const leads = await client.searchLeads(filters, batchSize);
  onProgress({ phase: 'found', message: `Found ${leads.length} leads in Close`, count: leads.length });

  // Transform leads to our format
  const agencies = leads.map(transformLeadToAgency);

  // Deduplication pass: check if leads are already in any active pipeline
  let duplicatesInPipeline = 0;
  const filteredAgencies = [];

  for (const agency of agencies) {
    if (skipDuplicates) {
      const existing = isLeadInPipeline(agency.close_lead_id);
      if (existing) {
        duplicatesInPipeline++;
        continue;
      }
    }
    filteredAgencies.push(agency);
  }

  if (duplicatesInPipeline > 0) {
    onProgress({
      phase: 'deduplicated',
      message: `Skipped ${duplicatesInPipeline} leads already in pipeline`,
      duplicatesInPipeline,
    });
  }

  // Enqueue filtered agencies
  onProgress({ phase: 'enqueuing', message: `Enqueuing ${filteredAgencies.length} agencies...` });
  const { added, skipped } = enqueueAgencies(cohort.id, filteredAgencies);

  // Log the extraction event
  logEvent(null, 'cohort_extraction', {
    cohort_id: cohort.id,
    cohort_name: cohort.name,
    close_results: leads.length,
    duplicates_in_pipeline: duplicatesInPipeline,
    duplicates_in_cohort: skipped,
    added,
    filters,
  });

  const stats = getCohortStats(cohort.id);
  onProgress({ phase: 'complete', message: `Done. ${added} agencies queued.`, added, stats });

  return {
    cohort,
    total_found: leads.length,
    added,
    skipped_duplicate_in_cohort: skipped,
    skipped_duplicate_in_pipeline: duplicatesInPipeline,
    stats,
  };
}

/**
 * Preview what a Close search would return without enqueuing anything.
 * Useful for validating filters before committing.
 */
export async function previewSearch(filters, limit = 10) {
  const client = new CloseClient();
  const leads = await client.searchLeads(filters, limit);
  return leads.map(lead => {
    const agency = transformLeadToAgency(lead);
    const inPipeline = isLeadInPipeline(agency.close_lead_id);
    return {
      ...agency,
      already_in_pipeline: inPipeline ? `${inPipeline.cohort_name} (${inPipeline.status})` : null,
    };
  });
}

/**
 * Test the Close API connection.
 */
export async function testConnection() {
  const client = new CloseClient();
  return client.ping();
}
