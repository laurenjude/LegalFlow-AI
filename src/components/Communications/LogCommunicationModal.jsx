import { useState } from 'react'
import Modal from '../Common/Modal'
import { useToast } from '../Common/Toast'

const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID
const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN

const today = () => new Date().toISOString().slice(0, 10)

export default function LogCommunicationModal({ isOpen, onClose, caseId, onSuccess }) {
  const showToast = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    date: today(),
    type: 'Phone Call',
    direction: 'Inbound',
    summary: '',
  })
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Communication%20Log`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records: [
            {
              fields: {
                'Entry ID': `MANUAL-${caseId}-${Date.now()}`,
                'Case ID': caseId,
                Date: form.date,
                Type: form.type,
                Direction: form.direction,
                Summary: form.summary,
              },
            },
          ],
        }),
      })
      if (res.ok) {
        showToast('Communication logged successfully!')
        setForm({ date: today(), type: 'Phone Call', direction: 'Inbound', summary: '' })
        onClose()
        onSuccess?.()
      } else {
        const err = await res.json().catch(() => ({}))
        showToast(err?.error?.message || 'Failed to log communication.', 'error')
      }
    } catch {
      showToast('Network error. Please try again.', 'error')
    }
    setLoading(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Communication">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Case Reference</label>
          <input readOnly value={caseId || ''} className="input-field bg-gray-50 cursor-not-allowed" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Date *</label>
            <input
              required
              type="date"
              value={form.date}
              onChange={e => set('date', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Type *</label>
            <select value={form.type} onChange={e => set('type', e.target.value)} className="input-field">
              <option>Phone Call</option>
              <option>In Person</option>
              <option>WhatsApp</option>
              <option>Email</option>
              <option>Telegram</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Direction *</label>
            <select value={form.direction} onChange={e => set('direction', e.target.value)} className="input-field">
              <option>Inbound</option>
              <option>Outbound</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Summary *</label>
          <textarea
            required
            rows={4}
            value={form.summary}
            onChange={e => set('summary', e.target.value)}
            className="input-field resize-none"
            placeholder="e.g. Discussed litigation strategy with client. Client agreed to proceed with court filing."
          />
        </div>

        <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-[#666666] hover:text-[#1A1A1A] transition-colors">
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#C9A961] hover:bg-[#b8963f] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {loading ? 'Saving…' : 'Log Communication'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
