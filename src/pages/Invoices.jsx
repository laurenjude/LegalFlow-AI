import { useEffect, useState } from 'react'
import TopBar from '../components/Layout/TopBar'
import InvoicesTable from '../components/Invoices/InvoicesTable'
import StatCard from '../components/Dashboard/StatCard'
import { SkeletonCard } from '../components/Common/LoadingSkeleton'
import { fetchInvoices } from '../lib/airtable'
import { formatCurrency } from '../lib/utils'

const STATUSES = ['All', 'Draft', 'Sent', 'Paid', 'Overdue']

export default function Invoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    fetchInvoices().then(data => { setInvoices(data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const filtered = filterStatus === 'All' ? invoices : invoices.filter(r => r.fields['Status'] === filterStatus)

  const totalInvoiced = invoices.reduce((s, r) => s + (Number(r.fields['Amount']) || 0), 0)
  const totalPaid = invoices.filter(r => r.fields['Status'] === 'Paid').reduce((s, r) => s + (Number(r.fields['Amount']) || 0), 0)
  const totalOutstanding = invoices.filter(r => ['Sent', 'Overdue'].includes(r.fields['Status'])).reduce((s, r) => s + (Number(r.fields['Amount']) || 0), 0)

  return (
    <div>
      <TopBar title="Invoices" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard title="Total Invoiced" value={formatCurrency(totalInvoiced)} borderColor="border-[#0F4C3A]" />
            <StatCard title="Total Paid" value={formatCurrency(totalPaid)} borderColor="border-green-500" />
            <StatCard title="Total Outstanding" value={formatCurrency(totalOutstanding)} borderColor="border-[#CC0000]" />
          </>
        )}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm font-medium text-[#1A1A1A]">Filter:</label>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input-field w-auto text-sm">
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <InvoicesTable invoices={filtered} loading={loading} />
    </div>
  )
}
