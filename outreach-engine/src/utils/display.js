/**
 * Display helpers for the CLI.
 */
import Table from 'cli-table3';
import chalk from 'chalk';

export function printCohortTable(cohorts) {
  const table = new Table({
    head: [
      chalk.bold('ID'),
      chalk.bold('Name'),
      chalk.bold('Status'),
      chalk.bold('Batch Size'),
      chalk.bold('Created'),
    ],
    colWidths: [6, 45, 12, 12, 22],
  });

  for (const c of cohorts) {
    table.push([
      c.id,
      c.name,
      statusColor(c.status),
      c.batch_size,
      c.created_at,
    ]);
  }

  console.log(table.toString());
}

export function printCohortDetail(cohort, stats) {
  console.log('');
  console.log(chalk.bold(`Cohort: ${cohort.name}`));
  console.log(`  ID:          ${cohort.id}`);
  console.log(`  Status:      ${statusColor(cohort.status)}`);
  console.log(`  Batch Size:  ${cohort.batch_size}`);
  console.log(`  Description: ${cohort.description || '—'}`);
  console.log(`  Created:     ${cohort.created_at}`);
  console.log(`  Filters:     ${JSON.stringify(cohort.filters, null, 2)}`);
  console.log('');

  if (stats && stats.total > 0) {
    console.log(chalk.bold('  Pipeline:'));
    const statusOrder = [
      'queued', 'crawling', 'valued', 'quality_checked',
      'email_generated', 'ready_to_send', 'sent',
      'opened', 'clicked', 'replied', 'booked',
      'failed', 'needs_review', 'opted_out', 'no_response',
    ];
    for (const s of statusOrder) {
      if (stats[s]) {
        const pct = ((stats[s] / stats.total) * 100).toFixed(1);
        console.log(`    ${statusColor(s).padEnd(28)} ${String(stats[s]).padStart(5)}  (${pct}%)`);
      }
    }
    console.log(`    ${'─'.repeat(45)}`);
    console.log(`    ${chalk.bold('Total').padEnd(20)} ${String(stats.total).padStart(5)}`);
  } else {
    console.log(chalk.dim('  No agencies in queue yet.'));
  }
  console.log('');
}

export function printAgencyTable(agencies) {
  const table = new Table({
    head: [
      chalk.bold('ID'),
      chalk.bold('Company'),
      chalk.bold('Contact'),
      chalk.bold('Email'),
      chalk.bold('Country'),
      chalk.bold('Status'),
    ],
    colWidths: [6, 30, 22, 30, 10, 16],
    wordWrap: true,
  });

  for (const a of agencies) {
    table.push([
      a.id,
      a.company_name || '—',
      a.contact_name || '—',
      a.contact_email || '—',
      a.country || '—',
      statusColor(a.status),
    ]);
  }

  console.log(table.toString());
}

export function printPreviewTable(agencies) {
  const table = new Table({
    head: [
      chalk.bold('Company'),
      chalk.bold('Website'),
      chalk.bold('Contact'),
      chalk.bold('Email'),
      chalk.bold('Country'),
      chalk.bold('In Pipeline?'),
    ],
    colWidths: [25, 30, 20, 28, 10, 18],
    wordWrap: true,
  });

  for (const a of agencies) {
    table.push([
      a.company_name || '—',
      a.website_url ? truncate(a.website_url, 28) : '—',
      a.contact_name || '—',
      a.contact_email || '—',
      a.country || '—',
      a.already_in_pipeline ? chalk.yellow(a.already_in_pipeline) : chalk.green('No'),
    ]);
  }

  console.log(table.toString());
}

export function printGlobalStats(stats) {
  console.log('');
  console.log(chalk.bold('Outreach Engine — Dashboard'));
  console.log(`  Active cohorts:   ${stats.active_cohorts}`);
  console.log(`  Total agencies:   ${stats.total_agencies}`);
  console.log('');

  if (Object.keys(stats.by_status).length > 0) {
    console.log(chalk.bold('  By Status:'));
    for (const [status, count] of Object.entries(stats.by_status)) {
      console.log(`    ${statusColor(status).padEnd(28)} ${count}`);
    }
  }
  console.log('');
}

function statusColor(status) {
  const colors = {
    active: chalk.green,
    paused: chalk.yellow,
    completed: chalk.blue,
    archived: chalk.dim,
    queued: chalk.cyan,
    crawling: chalk.yellow,
    valued: chalk.green,
    quality_checked: chalk.green,
    email_generated: chalk.blue,
    ready_to_send: chalk.blue,
    sent: chalk.magenta,
    opened: chalk.magenta,
    clicked: chalk.magenta,
    replied: chalk.bold.green,
    booked: chalk.bold.green,
    failed: chalk.red,
    needs_review: chalk.yellow,
    opted_out: chalk.dim,
    no_response: chalk.dim,
    draft: chalk.cyan,
    approved: chalk.green,
    rejected: chalk.red,
  };
  const fn = colors[status] || chalk.white;
  return fn(status);
}

function truncate(str, len) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len - 1) + '…' : str;
}
