import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Badge from '../components/Common/Badge'
import DocumentsTable from '../components/Documents/DocumentsTable'
import InvoicesTable from '../components/Invoices/InvoicesTable'
import UpdateStatusModal from '../components/Cases/UpdateStatusModal'
import NewDeadlineModal from '../components/Deadlines/NewDeadlineModal'
import LogCommunicationModal from '../components/Communications/LogCommunicationModal'
import LoadingSkeleton from '../components/Common/LoadingSkeleton'
import {
  fetchCaseById,
  fetchDocumentsByCaseId,
  fetchInvoicesByCaseId,
  fetchCommunicationsByCaseId,
  fetchDeadlines,
} from '../lib/airtable'
import { formatDate, daysFromNow } from '../lib/utils'

const TABS = ['Documents', 'Communications', 'Invoices', 'Deadlines']

export default function CaseDetail() {
  const { caseId } = useParams()
  const [caseData, setCaseData] = useState(null)
  const [documents, setDocuments] = useState([])
  const [invoices, setInvoices] = useState([])
  const [comms, setComms] = useState([])
  const [deadlines, setDeadlines] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Documents')
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showDeadlineModal, setShowDeadlineModal] = useState(false)
  const [showCommModal, setShowCommModal] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const [c, docs, inv, comm, dl] = await Promise.all([
        fetchCaseById(caseId),
        fetchDocumentsByCaseId(caseId),
        fetchInvoicesByCaseId(caseId),
        fetchCommunicationsByCaseId(caseId),
        fetchDeadlines(),
      ])
      setCaseData(c)
      setDocuments(docs)
      setInvoices(inv)
      setComms(comm)
      setDeadlines(dl.filter(r => r.fields['Case ID'] === caseId))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [caseId])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3" />
        <LoadingSkeleton />
      </div>
    )
  }

  if (!caseData) {
    return (
      <div className="text-center py-16">
        <p className="text-[#666666] text-lg">Case not found.</p>
        <Link to="/cases" className="text-[#0F4C3A] hover:underline mt-2 inline-block">← Back to Cases</Link>
      </div>
    )
  }

  const f = caseData.fields

  return (
    <div>
      {/* Breadcrumb */}
      <Link to="/cases" className="text-sm text-[#666666] hover:text-[#0F4C3A] mb-4 pl-14 md:pl-0 block">← Back to Cases</Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5 pl-14 md:pl-0">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-lg md:text-2xl font-bold text-[#1A1A1A]">{f['Case ID']}</h1>
            <Badge type="status" value={f['Status']} />
            <Badge type="urgency" value={f['Urgency']} />
          </div>
          <p className="text-[#666666] text-sm">{f['Case Type']}</p>
        </div>
        <button onClick={() => setShowStatusModal(true)}
          className="px-4 py-2 bg-[#0F4C3A] hover:bg-[#0a3529] text-white text-sm font-semibold rounded-lg transition-colors">
          Update Status
        </button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-xs text-[#666666] uppercase tracking-wider mb-2">Client Info</p>
          <p className="font-semibold text-[#1A1A1A]">{f['Client Name']}</p>
          <p className="text-sm text-[#666666] mt-1">{f['Client Email']}</p>
          <p className="text-sm text-[#666666]">{f['Client Phone']}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-xs text-[#666666] uppercase tracking-wider mb-2">Assigned Lawyer</p>
          <p className="font-semibold text-[#1A1A1A]">{f['Assigned Lawyer'] || '—'}</p>
          <p className="text-sm text-[#666666] mt-1">Next Deadline: {formatDate(f['Next Deadline'])}</p>
          <p className="text-sm text-[#666666]">Court Date: {formatDate(f['Court Date'])}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm sm:col-span-2 lg:col-span-1">
          <p className="text-xs text-[#666666] uppercase tracking-wider mb-2">Case Description</p>
          <p className="text-sm text-[#1A1A1A] line-clamp-4">{f['Case Description'] || '—'}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4 gap-1 overflow-x-auto">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-[#C9A961] text-[#0F4C3A]'
                : 'border-transparent text-[#666666] hover:text-[#1A1A1A]'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Documents' && (
        <DocumentsTable documents={documents} loading={false} caseId={f['Case ID']} onRefresh={load} />
      )}

      {activeTab === 'Communications' && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button
              onClick={() => setShowCommModal(true)}
              className="px-4 py-2 bg-[#C9A961] hover:bg-[#b8963f] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              + Log Communication
            </button>
          </div>
          {comms.length === 0 ? (
            <p className="text-[#666666] text-sm py-4">No communications logged.</p>
          ) : comms.map(r => {
            const cf = r.fields
            return (
              <div key={r.id} className="bg-white rounded-xl p-4 shadow-sm flex gap-4">
                <div className="flex flex-col items-center pt-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#C9A961]" />
                  <div className="w-px flex-1 bg-gray-200 mt-1" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs text-[#666666] font-medium">{formatDate(cf['Date'])}</span>
                    <Badge type="commType" value={cf['Type']} />
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cf['Direction'] === 'Inbound' ? 'bg-teal-100 text-teal-700' : 'bg-indigo-100 text-indigo-700'}`}>
                      {cf['Direction'] === 'Inbound' ? '↓ Inbound' : '↑ Outbound'}
                    </span>
                  </div>
                  <p className="text-sm text-[#1A1A1A]">{cf['Summary']}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {activeTab === 'Invoices' && (
        <InvoicesTable invoices={invoices} loading={false} caseData={caseData} showLogHours onRefresh={load} />
      )}

      {activeTab === 'Deadlines' && (
        <div>
          <div className="flex justify-end mb-3">
            <button
              onClick={() => setShowDeadlineModal(true)}
              className="px-4 py-2 bg-[#C9A961] hover:bg-[#b8963f] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              + New Deadline
            </button>
          </div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0F4C3A] text-white">
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Deadline</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Due Date</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Days Remaining</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {deadlines.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-[#666666]">No deadlines for this case.</td></tr>
              ) : deadlines.map((r, i) => {
                const df = r.fields
                const days = daysFromNow(df['Due Date'])
                const daysText = days === null ? '—' : days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Today' : `${days}d`
                const daysColor = days === null ? 'text-[#666666]' : days < 0 ? 'text-[#CC0000] font-semibold' : days <= 3 ? 'text-[#CC0000]' : days <= 7 ? 'text-[#CC6600]' : 'text-[#0F4C3A]'
                return (
                  <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-[#1A1A1A] font-medium text-xs md:text-sm">{df['Deadline']}</td>
                    <td className="px-4 py-3 text-[#666666] text-xs md:text-sm whitespace-nowrap">{formatDate(df['Due Date'])}</td>
                    <td className={`px-4 py-3 text-xs md:text-sm hidden sm:table-cell ${daysColor}`}>{daysText}</td>
                    <td className="px-4 py-3"><Badge type="deadlineStatus" value={df['Status']} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
        </div>
        </div>
      )}

      <UpdateStatusModal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)} caseData={caseData} onSuccess={load} />
      <NewDeadlineModal isOpen={showDeadlineModal} onClose={() => setShowDeadlineModal(false)} caseId={f['Case ID']} onSuccess={load} />
      <LogCommunicationModal isOpen={showCommModal} onClose={() => setShowCommModal(false)} caseId={f['Case ID']} onSuccess={load} />
    </div>
  )
}
