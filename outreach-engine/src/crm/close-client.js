/**
 * Close.com CRM API client.
 *
 * Handles authentication, pagination, rate limiting, and data extraction.
 * Docs: https://developer.close.com/
 */

const CLOSE_API_BASE = 'https://api.close.com/api/v1';

export class CloseClient {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.CLOSE_API_KEY;
    if (!this.apiKey) {
      throw new Error('CLOSE_API_KEY is required. Set it in .env or pass it to the constructor.');
    }
    this.authHeader = 'Basic ' + Buffer.from(`${this.apiKey}:`).toString('base64');
  }

  /**
   * Make an authenticated request to the Close API.
   */
  async request(method, endpoint, body = null, params = {}) {
    const url = new URL(`${CLOSE_API_BASE}${endpoint}`);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, value);
      }
    }

    const options = {
      method,
      headers: {
        'Authorization': this.authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url.toString(), options);

    // Rate limiting — Close returns 429 with Retry-After header
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After') || '5', 10);
      console.log(`  Rate limited by Close API. Waiting ${retryAfter}s...`);
      await sleep(retryAfter * 1000);
      return this.request(method, endpoint, body, params);
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Close API ${method} ${endpoint} failed (${response.status}): ${errorText}`);
    }

    return response.json();
  }

  /**
   * Search leads using Close's lead search with query filters.
   *
   * @param {object} filters — structured filters to build the Close query
   * @param {number} limit — max leads to return (handles pagination)
   * @returns {Array} — array of lead objects
   */
  async searchLeads(filters, limit = 200) {
    const query = buildCloseQuery(filters);
    const leads = [];
    let offset = 0;
    const pageSize = Math.min(limit, 100); // Close max per page is 100

    while (leads.length < limit) {
      const data = await this.request('POST', '/data/search/', {
        query,
        results_limit: pageSize,
        skip: offset,
        include_counts: true,
        _fields: {
          lead: [
            'id', 'display_name', 'url', 'status_label',
            'contacts', 'addresses', 'custom',
            'date_created', 'date_updated',
          ],
        },
      });

      if (!data.data || data.data.length === 0) break;

      for (const lead of data.data) {
        if (leads.length >= limit) break;
        leads.push(lead);
      }

      offset += data.data.length;
      if (offset >= (data.total_results || 0)) break;

      // Small delay between pages to be polite
      await sleep(500);
    }

    return leads;
  }

  /**
   * Get a single lead by ID.
   */
  async getLead(leadId) {
    return this.request('GET', `/lead/${leadId}/`);
  }

  /**
   * Update custom fields on a lead.
   */
  async updateLead(leadId, data) {
    return this.request('PUT', `/lead/${leadId}/`, data);
  }

  /**
   * Add a note to a lead.
   */
  async addNote(leadId, noteHtml) {
    return this.request('POST', '/activity/note/', {
      lead_id: leadId,
      note_html: noteHtml,
    });
  }

  /**
   * Create a task on a lead.
   */
  async createTask(leadId, text, isComplete = false) {
    return this.request('POST', '/task/', {
      lead_id: leadId,
      text,
      is_complete: isComplete,
    });
  }

  /**
   * List all lead statuses (for filter building).
   */
  async getLeadStatuses() {
    return this.request('GET', '/status/lead/');
  }

  /**
   * List custom fields (for mapping).
   */
  async getCustomFields() {
    return this.request('GET', '/custom_field/lead/');
  }

  /**
   * Test API connection.
   */
  async ping() {
    const me = await this.request('GET', '/me/');
    return {
      ok: true,
      user: me.first_name + ' ' + me.last_name,
      org: me.organizations?.[0]?.name || 'Unknown',
    };
  }
}

/**
 * Build a Close search query object from our filter format.
 *
 * Close uses a query DSL:
 * https://developer.close.com/resources/advanced-filtering/
 *
 * Our filters shape:
 * {
 *   country: 'GB',
 *   lead_status: 'Potential',
 *   company_size_min: 20,
 *   company_size_max: 50,
 *   tags: ['performance-marketing'],
 *   last_activity_before: '2025-06-01',
 *   last_activity_after: '2024-01-01',
 *   custom_fields: { 'cf_vertical': 'Performance Marketing' },
 *   search_query: 'free text search',
 * }
 */
function buildCloseQuery(filters) {
  const queries = [];
  queries.push({ type: 'object_type', object_type: 'lead' });

  if (filters.country) {
    queries.push({
      type: 'field_condition',
      field: { type: 'regular_field', object_type: 'lead', field_name: 'addresses.country' },
      condition: { type: 'text', mode: 'full_words', value: filters.country },
    });
  }

  if (filters.lead_status) {
    queries.push({
      type: 'field_condition',
      field: { type: 'regular_field', object_type: 'lead', field_name: 'status_label' },
      condition: { type: 'text', mode: 'full_words', value: filters.lead_status },
    });
  }

  if (filters.tags && filters.tags.length > 0) {
    for (const tag of filters.tags) {
      queries.push({
        type: 'field_condition',
        field: { type: 'regular_field', object_type: 'lead', field_name: 'tags' },
        condition: { type: 'text', mode: 'full_words', value: tag },
      });
    }
  }

  if (filters.search_query) {
    queries.push({
      type: 'field_condition',
      field: { type: 'regular_field', object_type: 'lead', field_name: 'display_name' },
      condition: { type: 'text', mode: 'full_words', value: filters.search_query },
    });
  }

  // Custom field filters
  if (filters.custom_fields) {
    for (const [fieldId, value] of Object.entries(filters.custom_fields)) {
      queries.push({
        type: 'field_condition',
        field: { type: 'custom_field', custom_field_id: fieldId },
        condition: { type: 'text', mode: 'full_words', value },
      });
    }
  }

  return {
    type: 'and',
    queries,
  };
}

/**
 * Transform a Close lead object into our agency_queue format.
 */
export function transformLeadToAgency(lead) {
  const primaryContact = lead.contacts?.[0] || {};
  const primaryEmail = primaryContact.emails?.[0]?.email || null;
  const primaryPhone = primaryContact.phones?.[0]?.phone || null;
  const address = lead.addresses?.[0] || {};

  // Extract website from the lead URL field or custom fields
  let website = lead.url || null;
  if (!website && lead.custom) {
    // Look for common custom field names that might contain website
    for (const [key, value] of Object.entries(lead.custom)) {
      if (typeof value === 'string' && (key.includes('website') || key.includes('url') || key.includes('domain'))) {
        website = value;
        break;
      }
    }
  }

  return {
    close_lead_id: lead.id,
    company_name: lead.display_name || 'Unknown',
    website_url: website,
    contact_name: primaryContact.name || primaryContact.first_name
      ? `${primaryContact.first_name || ''} ${primaryContact.last_name || ''}`.trim()
      : null,
    contact_email: primaryEmail,
    contact_title: primaryContact.title || null,
    phone: primaryPhone,
    location: [address.city, address.state].filter(Boolean).join(', ') || null,
    country: address.country || null,
    close_tags: lead.tags || [],
    close_custom: lead.custom || {},
    last_activity: lead.date_updated || null,
    lead_status: lead.status_label || null,
  };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
