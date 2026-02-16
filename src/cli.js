#!/usr/bin/env node
/**
 * Agency Valuation Outreach Engine — CLI
 *
 * Commands:
 *   status                         — Global dashboard
 *   cohort list                    — List all cohorts
 *   cohort create <name>           — Create a new cohort
 *   cohort show <name|id>          — Show cohort detail + pipeline stats
 *   cohort pause/resume <name|id>  — Pause/resume a cohort
 *   extract <cohort> [--preview]   — Pull leads from Close into cohort queue
 *   queue <cohort>                 — Show queued agencies for a cohort
 *   test-connection                — Verify Close API connectivity
 */

import 'dotenv/config';
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { getDb, closeDb } from './db/connection.js';
import {
  createCohort,
  getCohortById,
  getCohortByName,
  listCohorts,
  updateCohortStatus,
  getCohortStats,
  getQueuedAgencies,
  getAgenciesByStatus,
  getGlobalStats,
} from './db/operations.js';
import { extractFromClose, previewSearch, testConnection } from './crm/extractor.js';
import {
  printCohortTable,
  printCohortDetail,
  printAgencyTable,
  printPreviewTable,
  printGlobalStats,
} from './utils/display.js';

const program = new Command();

program
  .name('outreach')
  .description('Agency Valuation Outreach Engine for Agencies.co')
  .version('1.0.0');

// ────────────────────────────────────────────────────────────
// STATUS
// ────────────────────────────────────────────────────────────
program
  .command('status')
  .description('Show global dashboard')
  .action(() => {
    getDb();
    const stats = getGlobalStats();
    printGlobalStats(stats);
    closeDb();
  });

// ────────────────────────────────────────────────────────────
// COHORT COMMANDS
// ────────────────────────────────────────────────────────────
const cohortCmd = program.command('cohort').description('Manage cohorts');

cohortCmd
  .command('list')
  .description('List all cohorts')
  .option('-s, --status <status>', 'Filter by status (active/paused/completed/archived)')
  .action((opts) => {
    getDb();
    const cohorts = listCohorts(opts.status);
    if (cohorts.length === 0) {
      console.log(chalk.dim('\nNo cohorts found. Create one with: outreach cohort create <name>\n'));
    } else {
      printCohortTable(cohorts);
    }
    closeDb();
  });

cohortCmd
  .command('create <name>')
  .description('Create a new cohort')
  .option('-d, --description <desc>', 'Cohort description')
  .option('-b, --batch-size <size>', 'Batch size limit', '200')
  .option('--country <code>', 'Country filter (e.g. GB, US)')
  .option('--status <status>', 'Close lead status filter')
  .option('--tags <tags>', 'Comma-separated tags')
  .option('--search <query>', 'Free text search')
  .action((name, opts) => {
    getDb();

    const filters = {};
    if (opts.country) filters.country = opts.country;
    if (opts.status) filters.lead_status = opts.status;
    if (opts.tags) filters.tags = opts.tags.split(',').map(t => t.trim());
    if (opts.search) filters.search_query = opts.search;

    try {
      const cohort = createCohort({
        name,
        description: opts.description,
        filters,
        batchSize: parseInt(opts.batchSize, 10),
      });
      console.log(chalk.green(`\nCohort "${cohort.name}" created (ID: ${cohort.id})`));
      printCohortDetail(cohort, { total: 0 });
    } catch (err) {
      if (err.message.includes('UNIQUE constraint')) {
        console.error(chalk.red(`\nCohort "${name}" already exists. Use a different name.\n`));
      } else {
        throw err;
      }
    }
    closeDb();
  });

cohortCmd
  .command('show <nameOrId>')
  .description('Show cohort details and pipeline stats')
  .action((nameOrId) => {
    getDb();
    const cohort = resolveCohort(nameOrId);
    if (!cohort) {
      console.error(chalk.red(`\nCohort "${nameOrId}" not found.\n`));
      closeDb();
      return;
    }
    const stats = getCohortStats(cohort.id);
    printCohortDetail(cohort, stats);
    closeDb();
  });

cohortCmd
  .command('pause <nameOrId>')
  .description('Pause a cohort')
  .action((nameOrId) => {
    getDb();
    const cohort = resolveCohort(nameOrId);
    if (!cohort) {
      console.error(chalk.red(`\nCohort "${nameOrId}" not found.\n`));
    } else {
      updateCohortStatus(cohort.id, 'paused');
      console.log(chalk.yellow(`\nCohort "${cohort.name}" paused.\n`));
    }
    closeDb();
  });

cohortCmd
  .command('resume <nameOrId>')
  .description('Resume a paused cohort')
  .action((nameOrId) => {
    getDb();
    const cohort = resolveCohort(nameOrId);
    if (!cohort) {
      console.error(chalk.red(`\nCohort "${nameOrId}" not found.\n`));
    } else {
      updateCohortStatus(cohort.id, 'active');
      console.log(chalk.green(`\nCohort "${cohort.name}" resumed.\n`));
    }
    closeDb();
  });

// ────────────────────────────────────────────────────────────
// EXTRACT — Pull leads from Close CRM into a cohort queue
// ────────────────────────────────────────────────────────────
program
  .command('extract <cohortNameOrId>')
  .description('Extract leads from Close CRM into a cohort queue')
  .option('--preview', 'Preview matching leads without enqueuing')
  .option('-l, --limit <n>', 'Override batch size for this extraction', undefined)
  .option('--include-duplicates', 'Include leads already in other pipelines')
  .action(async (cohortNameOrId, opts) => {
    getDb();
    const cohort = resolveCohort(cohortNameOrId);
    if (!cohort) {
      console.error(chalk.red(`\nCohort "${cohortNameOrId}" not found. Create it first with: outreach cohort create <name>\n`));
      closeDb();
      return;
    }

    if (cohort.status === 'paused') {
      console.error(chalk.yellow(`\nCohort "${cohort.name}" is paused. Resume it first.\n`));
      closeDb();
      return;
    }

    const batchSize = opts.limit ? parseInt(opts.limit, 10) : cohort.batch_size;

    if (opts.preview) {
      const spinner = ora('Searching Close CRM...').start();
      try {
        const preview = await previewSearch(cohort.filters, Math.min(batchSize, 20));
        spinner.succeed(`Found ${preview.length} leads (showing preview)`);
        printPreviewTable(preview);
      } catch (err) {
        spinner.fail(`Search failed: ${err.message}`);
      }
      closeDb();
      return;
    }

    // Full extraction
    const spinner = ora('Extracting from Close CRM...').start();
    try {
      const result = await extractFromClose({
        cohortId: cohort.id,
        filters: cohort.filters,
        batchSize,
        skipDuplicates: !opts.includeDuplicates,
        onProgress: ({ phase, message }) => {
          spinner.text = message;
        },
      });

      spinner.succeed('Extraction complete');
      console.log('');
      console.log(`  Found in Close:        ${result.total_found}`);
      console.log(`  Already in pipeline:   ${chalk.yellow(result.skipped_duplicate_in_pipeline)}`);
      console.log(`  Already in cohort:     ${chalk.yellow(result.skipped_duplicate_in_cohort)}`);
      console.log(chalk.green(`  Added to queue:        ${result.added}`));
      console.log('');

      // Show updated cohort stats
      const stats = getCohortStats(cohort.id);
      printCohortDetail(cohort, stats);
    } catch (err) {
      spinner.fail(`Extraction failed: ${err.message}`);
      if (err.message.includes('CLOSE_API_KEY')) {
        console.log(chalk.dim('\n  Set your API key in outreach-engine/.env'));
        console.log(chalk.dim('  Copy .env.example to .env and fill in CLOSE_API_KEY\n'));
      }
    }
    closeDb();
  });

// ────────────────────────────────────────────────────────────
// QUEUE — View agencies in the processing queue
// ────────────────────────────────────────────────────────────
program
  .command('queue <cohortNameOrId>')
  .description('Show agencies in a cohort queue')
  .option('-s, --status <status>', 'Filter by status (default: queued)', 'queued')
  .option('-l, --limit <n>', 'Max results', '50')
  .action((cohortNameOrId, opts) => {
    getDb();
    const cohort = resolveCohort(cohortNameOrId);
    if (!cohort) {
      console.error(chalk.red(`\nCohort "${cohortNameOrId}" not found.\n`));
      closeDb();
      return;
    }

    const limit = parseInt(opts.limit, 10);
    const agencies = getAgenciesByStatus(cohort.id, opts.status, limit);

    if (agencies.length === 0) {
      console.log(chalk.dim(`\nNo agencies with status "${opts.status}" in cohort "${cohort.name}".\n`));
    } else {
      console.log(chalk.bold(`\n${cohort.name} — ${opts.status} (${agencies.length} shown)\n`));
      printAgencyTable(agencies);
    }
    closeDb();
  });

// ────────────────────────────────────────────────────────────
// TEST CONNECTION
// ────────────────────────────────────────────────────────────
program
  .command('test-connection')
  .description('Verify Close CRM API connection')
  .action(async () => {
    const spinner = ora('Testing Close API connection...').start();
    try {
      const result = await testConnection();
      spinner.succeed(`Connected to Close as ${result.user} (${result.org})`);
    } catch (err) {
      spinner.fail(`Connection failed: ${err.message}`);
      if (err.message.includes('CLOSE_API_KEY')) {
        console.log(chalk.dim('\n  Set your API key in outreach-engine/.env'));
        console.log(chalk.dim('  Copy .env.example to .env and fill in CLOSE_API_KEY\n'));
      }
    }
  });

// ────────────────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────────────────
function resolveCohort(nameOrId) {
  const asNum = parseInt(nameOrId, 10);
  if (!isNaN(asNum)) {
    return getCohortById(asNum);
  }
  return getCohortByName(nameOrId);
}

program.parse();
