import { useState } from 'react'
import Modal from '../Common/Modal'
import { useToast } from '../Common/Toast'

const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID
const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN

export default function NewDeadlineModal({ isOpen, onClose, caseId, onSuccess }) {
  const showToast = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ deadline: '', dueDate: '', notes: '' })
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Deadlines`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records: [
            {
              fields: {
                Deadline: form.deadline,
                'Case ID': caseId,
                'Due Date': form.dueDate,
                Status: 'Pending',
                'Reminder Sent': false,
                Notes: form.notes || '',
              },
            },
          ],
        }),
      })
      if (res.ok) {
        showToast('Deadline added successfully!')
        setForm({ deadline: '', dueDate: '', notes: '' })
        onClose()
        onSuccess?.()
      } else {
        const err = await res.json().catch(() => ({}))
        showToast(err?.error?.message || 'Failed to add deadline.', 'error')
      }
    } catch {
      showToast('Network error. Please try again.', 'error')
    }
    setLoading(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Deadline">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Case Reference</label>
          <input readOnly value={caseId || ''} className="input-field bg-gray-50 cursor-not-allowed" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Deadline Description *</label>
          <input
            required
            value={form.deadline}
            onChange={e => set('deadline', e.target.value)}
            className="input-field"
            placeholder="e.g. File Motion for Injunction"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Due Date *</label>
          <input
            required
            type="date"
            value={form.dueDate}
            onChange={e => set('dueDate', e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Notes</label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            className="input-field resize-none"
            placeholder="Any additional notes…"
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
            {loading ? 'Saving…' : 'Add Deadline'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
