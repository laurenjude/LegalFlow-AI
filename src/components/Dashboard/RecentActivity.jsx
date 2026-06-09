import Badge from '../Common/Badge'
import { formatDate } from '../../lib/utils'

export default function RecentActivity({ comms }) {
  if (!comms.length) {
    return <p className="text-[#666666] text-sm py-4">No recent activity.</p>
  }

  return (
    <div className="space-y-3">
      {comms.map(r => {
        const f = r.fields
        return (
          <div key={r.id} className="flex gap-4 bg-white rounded-lg px-4 py-3 shadow-sm">
            <div className="flex flex-col items-center pt-0.5">
              <div className="w-2 h-2 rounded-full bg-[#C9A961] mt-1" />
              <div className="w-px flex-1 bg-gray-200 mt-1" />
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs text-[#666666]">{formatDate(f['Date'])}</span>
                {f['Type'] && <Badge type="type" value={f['Type']} />}
                {f['Direction'] && <Badge type="direction" value={f['Direction']} />}
                <span className="text-xs text-[#666666]">Case: {f['Case ID']}</span>
              </div>
              <p className="text-sm text-[#1A1A1A] line-clamp-2">{f['Summary']}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
