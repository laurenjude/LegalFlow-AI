import { Link } from 'react-router-dom'
import Badge from '../Common/Badge'
import { SkeletonRow } from '../Common/LoadingSkeleton'
import { formatDate } from '../../lib/utils'

export default function CasesTable({ cases, loading }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#0F4C3A] text-white">
              <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Case ID</th>
              <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Client Name</th>
              <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Case Type</th>
              <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Urgency</th>
              <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Assigned Lawyer</th>
              <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} cols={7} />)
            ) : cases.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[#666666]">No cases found.</td>
              </tr>
            ) : (
              cases.map((r, i) => {
                const f = r.fields
                return (
                  <tr key={r.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-[#F5F0E6] transition-colors cursor-pointer`}>
                    <td className="px-4 py-3">
                      <Link to={`/cases/${f['Case ID']}`} className="text-[#0F4C3A] font-semibold hover:underline">
                        {f['Case ID']}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[#1A1A1A] font-medium">{f['Client Name']}</td>
                    <td className="px-4 py-3 text-[#666666] hidden sm:table-cell">{f['Case Type']}</td>
                    <td className="px-4 py-3"><Badge type="status" value={f['Status']} /></td>
                    <td className="px-4 py-3 hidden md:table-cell"><Badge type="urgency" value={f['Urgency']} /></td>
                    <td className="px-4 py-3 text-[#666666] hidden lg:table-cell">{f['Assigned Lawyer'] || '—'}</td>
                    <td className="px-4 py-3 text-[#666666] hidden lg:table-cell">{formatDate(f['Created Date'])}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
