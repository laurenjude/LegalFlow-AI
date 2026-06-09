import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TopBar from '../components/Layout/TopBar'
import Badge from '../components/Common/Badge'
import { SkeletonList } from '../components/Common/LoadingSkeleton'
import { fetchDeadlines } from '../lib/airtable'
import { formatDate, daysFromNow } from '../lib/utils'

function DeadlineItem({ r }) {
  const f = r.fields
  const days = daysFromNow(f['Due Date'])
  const daysText = days === null ? '—' : days < 0 ? `${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} overdue` : days === 0 ? 'Due today' : `${days} day${days !== 1 ? 's' : ''} remaining`

  return (
    <div className="bg-white rounded-lg px-4 py-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#1A1A1A] truncate">{f['Deadline']}</p>
          <p className="text-xs text-[#666666]">
            Case:{' '}
            <Link to={`/cases/${f['Case ID']}`} className="text-[#0F4C3A] hover:underline font-medium">{f['Case ID']}</Link>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs font-medium text-[#1A1A1A]">{formatDate(f['Due Date'])}</p>
          <p className={`text-xs font-medium ${days < 0 ? 'text-[#CC0000]' : days <= 3 ? 'text-[#CC0000]' : days <= 7 ? 'text-[#CC6600]' : 'text-[#0F4C3A]'}`}>{daysText}</p>
        </div>
        <Badge type="status" value={f['Status']} />
      </div>
    </div>
  )
}

function Section({ title, items, bgColor }) {
  if (!items.length) return null
  return (
    <div className={`rounded-xl p-4 mb-4 ${bgColor}`}>
      <h2 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
        <span>{title}</span>
        <span className="bg-white/50 text-xs px-2 py-0.5 rounded-full">{items.length}</span>
      </h2>
      <div className="space-y-2">
        {items.map(r => <DeadlineItem key={r.id} r={r} />)}
      </div>
    </div>
  )
}

export default function Deadlines() {
  const [deadlines, setDeadlines] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDeadlines().then(d => { setDeadlines(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const overdue = deadlines.filter(r => { const d = daysFromNow(r.fields['Due Date']); return d !== null && d < 0 })
  const thisWeek = deadlines.filter(r => { const d = daysFromNow(r.fields['Due Date']); return d !== null && d >= 0 && d <= 7 })
  const upcoming = deadlines.filter(r => { const d = daysFromNow(r.fields['Due Date']); return d !== null && d > 7 })

  return (
    <div>
      <TopBar title="Deadlines" />
      {loading ? (
        <SkeletonList rows={5} />
      ) : deadlines.length === 0 ? (
        <div className="text-center py-16 text-[#666666]">No pending deadlines.</div>
      ) : (
        <>
          <Section title="Overdue" items={overdue} bgColor="bg-red-50 border border-red-200" />
          <Section title="Due This Week" items={thisWeek} bgColor="bg-orange-50 border border-orange-200" />
          <Section title="Upcoming" items={upcoming} bgColor="bg-green-50 border border-green-200" />
        </>
      )}
    </div>
  )
}
