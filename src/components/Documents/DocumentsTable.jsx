import { useState } from 'react'
import Badge from '../Common/Badge'
import { SkeletonRow } from '../Common/LoadingSkeleton'
import UploadDocumentModal from './UploadDocumentModal'
import { formatDate } from '../../lib/utils'

export default function DocumentsTable({ documents, loading, caseId, onRefresh }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#0F4C3A] hover:bg-[#0a3529] text-white text-sm font-semibold rounded-lg transition-colors">
          + Upload Document
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0F4C3A] text-white">
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Document Name</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Type</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Upload Date</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Uploaded By</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Link</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} cols={5} />)
              ) : documents.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-[#666666]">No documents uploaded yet.</td></tr>
              ) : (
                documents.map((r, i) => {
                  const f = r.fields
                  return (
                    <tr key={r.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-4 py-3 text-[#1A1A1A] font-medium">{f['Document Name']}</td>
                      <td className="px-4 py-3 hidden sm:table-cell"><Badge type="docType" value={f['Document Type']} /></td>
                      <td className="px-4 py-3 text-[#666666] hidden md:table-cell">{formatDate(f['Upload Date'])}</td>
                      <td className="px-4 py-3 text-[#666666] hidden lg:table-cell">{f['Uploaded By'] || '—'}</td>
                      <td className="px-4 py-3">
                        {f['File URL'] ? (
                          <a href={f['File URL']} target="_blank" rel="noopener noreferrer"
                            className="text-[#0F4C3A] hover:underline font-medium text-xs">View →</a>
                        ) : '—'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <UploadDocumentModal isOpen={showModal} onClose={() => setShowModal(false)} caseId={caseId} onSuccess={onRefresh} />
    </div>
  )
}
