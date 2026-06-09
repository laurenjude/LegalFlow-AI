import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Badge from '../Common/Badge'
import LogHoursModal from './LogHoursModal'
import { SkeletonRow } from '../Common/LoadingSkeleton'
import { formatCurrency, formatDate } from '../../lib/utils'

export default function InvoicesTable({ invoices, loading, caseData, showLogHours = false, onRefresh }) {
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  return (
    <div>
      {showLogHours && (
        <div className="flex justify-end mb-3">
          <button onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#C9A961] hover:bg-[#b8963f] text-white text-sm font-semibold rounded-lg transition-colors">
            + Log Hours
          </button>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0F4C3A] text-white">
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Invoice #</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Case ID</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Client</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Date Sent</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={6} />)
              ) : invoices.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-[#666666]">No invoices found.</td></tr>
              ) : (
                invoices.map((r, i) => {
                  const f = r.fields
                  return (
                    <tr key={r.id}
                      onClick={() => f['Case ID'] && navigate(`/cases/${f['Case ID']}`)}
                      className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-[#F5F0E6] transition-colors cursor-pointer`}>
                      <td className="px-4 py-3 text-[#0F4C3A] font-semibold">{f['Invoice Number']}</td>
                      <td className="px-4 py-3 text-[#666666] hidden sm:table-cell">{f['Case ID']}</td>
                      <td className="px-4 py-3 text-[#1A1A1A] hidden md:table-cell">{f['Client Name']}</td>
                      <td className="px-4 py-3 text-[#1A1A1A] font-medium">{formatCurrency(f['Amount'])}</td>
                      <td className="px-4 py-3"><Badge type="invoiceStatus" value={f['Status']} /></td>
                      <td className="px-4 py-3 text-[#666666] hidden lg:table-cell">{formatDate(f['Date Sent'])}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showLogHours && (
        <LogHoursModal isOpen={showModal} onClose={() => setShowModal(false)} caseData={caseData} onSuccess={onRefresh} />
      )}
    </div>
  )
}
