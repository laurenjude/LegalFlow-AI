import { Link } from 'react-router-dom'
import { formatDate, urgencyLabel } from '../../lib/utils'

export default function DeadlinesList({ deadlines }) {
  if (!deadlines.length) {
    return <p className="text-[#666666] text-sm py-4">No urgent deadlines.</p>
  }

  return (
    <div className="space-y-2">
      {deadlines.map(r => {
        const f = r.fields
        const { label, color, days } = urgencyLabel(f['Due Date'])
        const daysText = days < 0
          ? `${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} overdue`
          : days === 0
          ? 'Due today'
          : `${days} day${days !== 1 ? 's' : ''} remaining`

        return (
          <div key={r.id} className="flex items-center justify-between bg-white rounded-lg px-4 py-3 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color} whitespace-nowrap`}>{label}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#1A1A1A] truncate">{f['Deadline']}</p>
                <p className="text-xs text-[#666666]">
                  Case:{' '}
                  <Link to={`/cases/${f['Case ID']}`} className="text-[#0F4C3A] hover:underline font-medium">
                    {f['Case ID']}
                  </Link>
                </p>
              </div>
            </div>
            <div className="text-right ml-4 shrink-0">
              <p className="text-xs font-medium text-[#1A1A1A]">{formatDate(f['Due Date'])}</p>
              <p className="text-xs text-[#666666]">{daysText}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
