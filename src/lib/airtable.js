const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID
const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN
const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}`

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
}

async function fetchTable(table, params = {}) {
  const url = new URL(`${BASE_URL}/${encodeURIComponent(table)}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v))
  const res = await fetch(url.toString(), { headers })
  if (!res.ok) throw new Error(`Airtable error: ${res.status} ${res.statusText}`)
  const data = await res.json()
  return data.records || []
}

async function fetchAllPages(table, params = {}) {
  let records = []
  let offset = null
  do {
    const url = new URL(`${BASE_URL}/${encodeURIComponent(table)}`)
    Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v))
    if (offset) url.searchParams.append('offset', offset)
    const res = await fetch(url.toString(), { headers })
    if (!res.ok) throw new Error(`Airtable error: ${res.status} ${res.statusText}`)
    const data = await res.json()
    records = records.concat(data.records || [])
    offset = data.offset
  } while (offset)
  return records
}

export async function fetchCases() {
  const records = await fetchAllPages('Cases')
  return records.sort((a, b) => {
    const da = new Date(a.fields['Created Date'] || 0)
    const db = new Date(b.fields['Created Date'] || 0)
    return db - da
  })
}

export async function fetchCaseById(caseId) {
  const records = await fetchTable('Cases', {
    filterByFormula: `{Case ID}="${caseId}"`,
    maxRecords: 1,
  })
  return records[0] || null
}

export async function fetchDocumentsByCaseId(caseId) {
  return fetchAllPages('Documents', {
    filterByFormula: `{Case ID}="${caseId}"`,
  })
}

export async function fetchInvoices() {
  const records = await fetchAllPages('Invoices')
  return records.sort((a, b) => {
    const da = new Date(a.fields['Date Sent'] || 0)
    const db = new Date(b.fields['Date Sent'] || 0)
    return db - da
  })
}

export async function fetchInvoicesByCaseId(caseId) {
  return fetchAllPages('Invoices', {
    filterByFormula: `{Case ID}="${caseId}"`,
  })
}

export async function fetchDeadlines() {
  return fetchAllPages('Deadlines', {
    filterByFormula: `NOT({Status}="Completed")`,
  })
}

export async function fetchCommunicationsByCaseId(caseId) {
  const records = await fetchAllPages('Communication Log', {
    filterByFormula: `{Case ID}="${caseId}"`,
  })
  return records.sort((a, b) => new Date(b.fields['Date'] || 0) - new Date(a.fields['Date'] || 0))
}

export async function fetchRecentCommunications(limit = 5) {
  const records = await fetchAllPages('Communication Log')
  return records
    .sort((a, b) => new Date(b.fields['Date'] || 0) - new Date(a.fields['Date'] || 0))
    .slice(0, limit)
}

export async function fetchClients() {
  return fetchAllPages('Clients')
}
