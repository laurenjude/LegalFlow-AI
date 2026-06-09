import { useState } from 'react'
import Modal from '../Common/Modal'
import { useToast } from '../Common/Toast'

const STATUS_OPTIONS = ['New', 'In Review', 'Active', 'Awaiting Documents', 'In Court', 'Resolved', 'Closed']

export default function UpdateStatusModal({ isOpen, onClose, caseData, onSuccess }) {
  const showToast = useToast()
  const [loading, setLoading] = useState(false)
  const f = caseData?.fields || {}
  const [form, setForm] = useState({ newStatus: '', whatHappened: '', updatedBy: '' })
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(import.meta.env.VITE_WEBHOOK_STATUS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseReference: f['Case ID'],
          clientEmail: f['Client Email'],
          clientName: f['Client Name'],
          newStatus: form.newStatus,
          whatHappened: form.whatHappened,
          updatedBy: form.updatedBy,
          submittedAt: new Date().toISOString(),
        }),
      })
      if (res.ok) {
        showToast('Status update sent!')
        onClose()
        onSuccess?.()
      } else {
        showToast('Submission failed. Please try again.', 'error')
      }
    } catch {
      showToast('Network error. Please try again.', 'error')
    }
    setLoading(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Case Status">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Case Reference</label>
          <input readOnly value={f['Case ID'] || ''} className="input-field bg-gray-50 cursor-not-allowed" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Client Name</label>
            <input readOnly value={f['Client Name'] || ''} className="input-field bg-gray-50 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Client Email</label>
            <input readOnly value={f['Client Email'] || ''} className="input-field bg-gray-50 cursor-not-allowed" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">New Status *</label>
          <select required value={form.newStatus} onChange={e => set('newStatus', e.target.value)} className="input-field">
            <option value="">Select new status…</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">What Happened *</label>
          <textarea required rows={3} value={form.whatHappened} onChange={e => set('whatHappened', e.target.value)}
            className="input-field resize-none" placeholder="Describe what happened or why the status is changing…" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Updated By *</label>
          <input required value={form.updatedBy} onChange={e => set('updatedBy', e.target.value)}
            className="input-field" placeholder="Your name" />
        </div>
        <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-[#666666] hover:text-[#1A1A1A] transition-colors">Cancel</button>
          <button type="submit" disabled={loading}
            className="px-6 py-2 bg-[#0F4C3A] hover:bg-[#0a3529] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2">
            {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {loading ? 'Sending…' : 'Send Update'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
