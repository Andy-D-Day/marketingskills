import { getDb } from './connection.js';

// ============================================================
// COHORT OPERATIONS
// ============================================================

export function createCohort({ name, description, filters, batchSize = 200 }) {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO cohorts (name, description, filters, batch_size)
    VALUES (?, ?, ?, ?)
  `).run(name, description || null, JSON.stringify(filters), batchSize);
  return getCohortById(result.lastInsertRowid);
}

export function getCohortById(id) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM cohorts WHERE id = ?').get(id);
  if (row) row.filters = JSON.parse(row.filters);
  return row;
}

export function getCohortByName(name) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM cohorts WHERE name = ?').get(name);
  if (row) row.filters = JSON.parse(row.filters);
  return row;
}

export function listCohorts(status = null) {
  const db = getDb();
  let sql = 'SELECT * FROM cohorts';
  const params = [];
  if (status) {
    sql += ' WHERE status = ?';
    params.push(status);
  }
  sql += ' ORDER BY created_at DESC';
  return db.prepare(sql).all(params).map(r => ({
    ...r,
    filters: JSON.parse(r.filters),
  }));
}

export function updateCohortStatus(id, status) {
  const db = getDb();
  db.prepare(`
    UPDATE cohorts SET status = ?, updated_at = datetime('now') WHERE id = ?
  `).run(status, id);
}

export function getCohortStats(cohortId) {
  const db = getDb();
  const stats = db.prepare(`
    SELECT
      status,
      COUNT(*) as count
    FROM agency_queue
    WHERE cohort_id = ?
    GROUP BY status
  `).all(cohortId);

  const total = stats.reduce((sum, s) => sum + s.count, 0);
  const statusMap = {};
  for (const s of stats) statusMap[s.status] = s.count;
  return { total, ...statusMap };
}

// ============================================================
// AGENCY QUEUE OPERATIONS
// ============================================================

/**
 * Add an agency to the processing queue.
 * Returns null if already exists in this cohort (deduplication).
 */
export function enqueueAgency(cohortId, agencyData) {
  const db = getDb();
  try {
    const result = db.prepare(`
      INSERT INTO agency_queue (
        cohort_id, close_lead_id, company_name, website_url,
        contact_name, contact_email, contact_title, phone,
        location, country, close_tags, close_custom,
        last_activity, lead_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      cohortId,
      agencyData.close_lead_id,
      agencyData.company_name,
      agencyData.website_url || null,
      agencyData.contact_name || null,
      agencyData.contact_email || null,
      agencyData.contact_title || null,
      agencyData.phone || null,
      agencyData.location || null,
      agencyData.country || null,
      JSON.stringify(agencyData.close_tags || []),
      JSON.stringify(agencyData.close_custom || {}),
      agencyData.last_activity || null,
      agencyData.lead_status || null,
    );
    return result.lastInsertRowid;
  } catch (err) {
    if (err.message.includes('UNIQUE constraint')) {
      return null; // Already exists in this cohort
    }
    throw err;
  }
}

/**
 * Bulk-enqueue agencies. Returns { added, skipped } counts.
 */
export function enqueueAgencies(cohortId, agencies) {
  const db = getDb();
  let added = 0;
  let skipped = 0;

  const insertMany = db.transaction((items) => {
    for (const agency of items) {
      const id = enqueueAgency(cohortId, agency);
      if (id) added++;
      else skipped++;
    }
  });

  insertMany(agencies);
  return { added, skipped };
}

/**
 * Check if a lead is already in ANY active cohort queue.
 */
export function isLeadInPipeline(closeLeadId) {
  const db = getDb();
  const row = db.prepare(`
    SELECT aq.id, aq.status, c.name as cohort_name
    FROM agency_queue aq
    JOIN cohorts c ON c.id = aq.cohort_id
    WHERE aq.close_lead_id = ?
      AND aq.status NOT IN ('failed', 'no_response', 'opted_out')
    LIMIT 1
  `).get(closeLeadId);
  return row || null;
}

export function updateAgencyStatus(id, status, extra = {}) {
  const db = getDb();
  const sets = [`status = ?`, `updated_at = datetime('now')`];
  const params = [status];

  if (extra.failure_reason !== undefined) {
    sets.push('failure_reason = ?');
    params.push(extra.failure_reason);
  }
  if (status === 'crawling') {
    sets.push(`processed_at = datetime('now')`);
  }
  if (status === 'valued') {
    sets.push(`valued_at = datetime('now')`);
  }
  if (status === 'sent') {
    sets.push(`sent_at = datetime('now')`);
  }

  params.push(id);
  db.prepare(`UPDATE agency_queue SET ${sets.join(', ')} WHERE id = ?`).run(...params);
}

export function getQueuedAgencies(cohortId, limit = 50) {
  const db = getDb();
  return db.prepare(`
    SELECT * FROM agency_queue
    WHERE cohort_id = ? AND status = 'queued'
    ORDER BY queued_at ASC
    LIMIT ?
  `).all(cohortId, limit);
}

export function getAgenciesByStatus(cohortId, status, limit = 100) {
  const db = getDb();
  return db.prepare(`
    SELECT * FROM agency_queue
    WHERE cohort_id = ? AND status = ?
    ORDER BY updated_at DESC
    LIMIT ?
  `).all(cohortId, status, limit);
}

export function getAgencyByCloseLeadId(closeLeadId) {
  const db = getDb();
  return db.prepare(`
    SELECT * FROM agency_queue WHERE close_lead_id = ? ORDER BY created_at DESC LIMIT 1
  `).get(closeLeadId);
}

// ============================================================
// PROCESSING LOG
// ============================================================

export function logEvent(agencyQueueId, event, details = {}) {
  const db = getDb();
  db.prepare(`
    INSERT INTO processing_log (agency_queue_id, event, details)
    VALUES (?, ?, ?)
  `).run(agencyQueueId, event, JSON.stringify(details));
}

// ============================================================
// DASHBOARD / STATS
// ============================================================

export function getGlobalStats() {
  const db = getDb();

  const cohortCount = db.prepare('SELECT COUNT(*) as count FROM cohorts WHERE status = ?').get('active');
  const queueStats = db.prepare(`
    SELECT status, COUNT(*) as count
    FROM agency_queue
    GROUP BY status
  `).all();

  const total = queueStats.reduce((sum, s) => sum + s.count, 0);
  const statusMap = {};
  for (const s of queueStats) statusMap[s.status] = s.count;

  return {
    active_cohorts: cohortCount.count,
    total_agencies: total,
    by_status: statusMap,
  };
}
