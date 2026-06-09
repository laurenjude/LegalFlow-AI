import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TopBar from '../components/Layout/TopBar'
import StatCard from '../components/Dashboard/StatCard'
import DeadlinesList from '../components/Dashboard/DeadlinesList'
import RecentActivity from '../components/Dashboard/RecentActivity'
import Badge from '../components/Common/Badge'
import { SkeletonCard, SkeletonList } from '../components/Common/LoadingSkeleton'
import {
  fetchCases,
  fetchDeadlines,
  fetchInvoices,
  fetchRecentCommunications,
} from '../lib/airtable'
import { formatCurrency, formatDate, daysFromNow } from '../lib/utils'

export default function Dashboard() {
  const [cases, setCases] = useState([])
  const [deadlines, setDeadlines] = useState([])
  const [invoices, setInvoices] = useState([])
  const [comms, setComms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchCases(),
      fetchDeadlines(),
      fetchInvoices(),
      fetchRecentCommunications(5),
    ]).then(([c, d, inv, comm]) => {
      setCases(c)
      setDeadlines(d)
      setInvoices(inv)
      setComms(comm)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const activeCases = cases.filter(r => !['Resolved', 'Closed'].includes(r.fields['Status']))
  const newCases = cases.filter(r => r.fields['Status'] === 'New')
  const pendingDeadlines = deadlines.filter(r => r.fields['Status'] !== 'Completed')
  const urgentDeadlines = pendingDeadlines.filter(r => {
    const days = daysFromNow(r.fields['Due Date'])
    return days !== null && days <= 7
  })
  const unpaidInvoices = invoices.filter(r => ['Sent', 'Overdue'].includes(r.fields['Status']))
  const outstanding = unpaidInvoices.reduce((sum, r) => sum + (Number(r.fields['Amount']) || 0), 0)

  return (
    <div>
      <TopBar title="Morning Briefing" />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard title="Total Active Cases" value={activeCases.length} subtitle="Excluding resolved & closed" borderColor="border-[#0F4C3A]" />
            <StatCard title="Pending Deadlines" value={pendingDeadlines.length} subtitle={`${urgentDeadlines.length} due this week`} borderColor="border-[#CC6600]" />
            <StatCard title="Unpaid Invoices" value={unpaidInvoices.length} subtitle="Sent or overdue" borderColor="border-[#CC0000]" />
            <StatCard title="Total Outstanding" value={formatCurrency(outstanding)} subtitle="Across all unpaid invoices" borderColor="border-[#C9A961]" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Urgent Deadlines */}
        <div>
          <h2 className="text-base font-semibold text-[#1A1A1A] mb-3">Urgent Deadlines</h2>
          {loading ? <SkeletonList rows={3} /> : <DeadlinesList deadlines={urgentDeadlines} />}
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-base font-semibold text-[#1A1A1A] mb-3">Recent Activity</h2>
          {loading ? <SkeletonList rows={3} /> : <RecentActivity comms={comms} />}
        </div>
      </div>

      {/* New Cases */}
      <div>
        <h2 className="text-base font-semibold text-[#1A1A1A] mb-3">New Cases</h2>
        {loading ? (
          <SkeletonList rows={3} />
        ) : newCases.length === 0 ? (
          <p className="text-[#666666] text-sm">No new cases at the moment.</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0F4C3A] text-white">
                  <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Case ID</th>
                  <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Client</th>
                  <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Created</th>
                  <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Urgency</th>
                </tr>
              </thead>
              <tbody>
                {newCases.map((r, i) => {
                  const f = r.fields
                  return (
                    <tr key={r.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-[#F5F0E6] transition-colors`}>
                      <td className="px-4 py-3">
                        <Link to={`/cases/${f['Case ID']}`} className="text-[#0F4C3A] font-medium hover:underline">
                          {f['Case ID']}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-[#1A1A1A]">{f['Client Name']}</td>
                      <td className="px-4 py-3 text-[#666666] hidden sm:table-cell">{f['Case Type']}</td>
                      <td className="px-4 py-3 text-[#666666] hidden md:table-cell">{formatDate(f['Created Date'])}</td>
                      <td className="px-4 py-3"><Badge type="urgency" value={f['Urgency']} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
