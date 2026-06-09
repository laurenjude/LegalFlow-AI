import { useState } from 'react'
import Modal from '../Common/Modal'
import { useToast } from '../Common/Toast'

const CASE_TYPES = ['Property Dispute', 'Criminal Defence', 'Family Law', 'Contract Dispute', 'Debt Recovery', 'Employment', 'Other']
const URGENCY_OPTIONS = ['Standard', 'Urgent', 'Critical']

export default function NewCaseModal({ isOpen, onClose, onSuccess }) {
  const showToast = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    client_full_name: '',
    client_email: '',
    client_phone: '',
    case_description: '',
    case_type: '',
    urgency: 'Standard',
  })

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(import.meta.env.VITE_WEBHOOK_INTAKE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, submitted_at: new Date().toISOString() }),
      })
      if (res.ok) {
        showToast('Case submitted successfully!')
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
    <Modal isOpen={isOpen} onClose={onClose} title="New Case Intake">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Client Full Name *</label>
            <input required value={form.client_full_name} onChange={e => set('client_full_name', e.target.value)}
              className="input-field" placeholder="e.g. Adaeze Okonkwo" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Client Email *</label>
            <input required type="email" value={form.client_email} onChange={e => set('client_email', e.target.value)}
              className="input-field" placeholder="client@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Client Phone</label>
            <input type="tel" value={form.client_phone} onChange={e => set('client_phone', e.target.value)}
              className="input-field" placeholder="+234 800 000 0000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Case Type *</label>
            <select required value={form.case_type} onChange={e => set('case_type', e.target.value)} className="input-field">
              <option value="">Select type…</option>
              {CASE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Urgency *</label>
            <select required value={form.urgency} onChange={e => set('urgency', e.target.value)} className="input-field">
              {URGENCY_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Case Description *</label>
            <textarea required rows={4} value={form.case_description} onChange={e => set('case_description', e.target.value)}
              className="input-field resize-none" placeholder="Brief description of the case…" />
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-[#666666] hover:text-[#1A1A1A] transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="px-6 py-2 bg-[#C9A961] hover:bg-[#b8963f] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2">
            {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {loading ? 'Submitting…' : 'Submit Case'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
