import { useEffect, useState } from 'react'
import TopBar from '../components/Layout/TopBar'
import CasesTable from '../components/Cases/CasesTable'
import NewCaseModal from '../components/Cases/NewCaseModal'
import { fetchCases } from '../lib/airtable'

const STATUSES = ['All', 'New', 'In Review', 'Active', 'Awaiting Documents', 'In Court', 'Resolved', 'Closed']
const TYPES = ['All', 'Property Dispute', 'Criminal Defence', 'Family Law', 'Contract Dispute', 'Debt Recovery', 'Employment', 'Other']
const URGENCIES = ['All', 'Standard', 'Urgent', 'Critical']

export default function Cases() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterType, setFilterType] = useState('All')
  const [filterUrgency, setFilterUrgency] = useState('All')
  const [search, setSearch] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchCases()
      setCases(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = cases.filter(r => {
    const f = r.fields
    if (filterStatus !== 'All' && f['Status'] !== filterStatus) return false
    if (filterType !== 'All' && f['Case Type'] !== filterType) return false
    if (filterUrgency !== 'All' && f['Urgency'] !== filterUrgency) return false
    if (search && !f['Client Name']?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div>
      <TopBar
        title="Cases"
        actions={
          <button onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#C9A961] hover:bg-[#b8963f] text-white text-sm font-semibold rounded-lg transition-colors">
            + New Case
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input-field w-auto text-sm">
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="input-field w-auto text-sm">
          {TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={filterUrgency} onChange={e => setFilterUrgency(e.target.value)} className="input-field w-auto text-sm">
          {URGENCIES.map(u => <option key={u}>{u}</option>)}
        </select>
        <input
          type="search"
          placeholder="Search by client name…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field flex-1 min-w-[200px] text-sm"
        />
      </div>

      <CasesTable cases={filtered} loading={loading} />

      <NewCaseModal isOpen={showModal} onClose={() => setShowModal(false)} onSuccess={load} />
    </div>
  )
}
