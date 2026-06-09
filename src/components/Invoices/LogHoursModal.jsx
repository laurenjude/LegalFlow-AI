import { useState } from 'react'
import Modal from '../Common/Modal'
import { useToast } from '../Common/Toast'

export default function LogHoursModal({ isOpen, onClose, caseData, onSuccess }) {
  const showToast = useToast()
  const [loading, setLoading] = useState(false)
  const f = caseData?.fields || {}
  const [form, setForm] = useState({
    descriptionOfWork: '',
    hoursWorked: '',
    hourlyRate: '50000',
    currency: 'NGN',
    paymentTerms: 'Net 30',
    billedBy: '',
  })
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const total = (Number(form.hoursWorked) || 0) * (Number(form.hourlyRate) || 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(import.meta.env.VITE_WEBHOOK_BILLING, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseReference: f['Case ID'],
          clientName: f['Client Name'],
          clientEmail: f['Client Email'],
          descriptionOfWork: form.descriptionOfWork,
          hoursWorked: Number(form.hoursWorked),
          hourlyRate: Number(form.hourlyRate),
          currency: form.currency,
          paymentTerms: form.paymentTerms,
          billedBy: form.billedBy,
          totalAmount: total,
          submittedAt: new Date().toISOString(),
        }),
      })
      if (res.ok) {
        showToast('Invoice submitted successfully!')
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
    <Modal isOpen={isOpen} onClose={onClose} title="Log Hours / Create Invoice">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Case Reference</label>
            <input readOnly value={f['Case ID'] || ''} className="input-field bg-gray-50 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Client Name</label>
            <input readOnly value={f['Client Name'] || ''} className="input-field bg-gray-50 cursor-not-allowed" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Client Email</label>
            <input readOnly value={f['Client Email'] || ''} className="input-field bg-gray-50 cursor-not-allowed" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Description of Work *</label>
          <textarea required rows={3} value={form.descriptionOfWork} onChange={e => set('descriptionOfWork', e.target.value)}
            className="input-field resize-none" placeholder="Describe the work performed…" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Hours Worked *</label>
            <input required type="number" min="0" step="0.5" value={form.hoursWorked} onChange={e => set('hoursWorked', e.target.value)}
              className="input-field" placeholder="0" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Hourly Rate *</label>
            <input required type="number" min="0" value={form.hourlyRate} onChange={e => set('hourlyRate', e.target.value)}
              className="input-field" placeholder="50000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Currency</label>
            <select value={form.currency} onChange={e => set('currency', e.target.value)} className="input-field">
              <option value="NGN">NGN (₦)</option>
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Payment Terms</label>
            <select value={form.paymentTerms} onChange={e => set('paymentTerms', e.target.value)} className="input-field">
              <option>Due on Receipt</option>
              <option>Net 7</option>
              <option>Net 14</option>
              <option>Net 30</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Billed By *</label>
          <input required value={form.billedBy} onChange={e => set('billedBy', e.target.value)}
            className="input-field" placeholder="Your name" />
        </div>
        {total > 0 && (
          <div className="bg-[#F5F0E6] rounded-lg p-3 text-sm">
            <span className="text-[#666666]">Total Amount: </span>
            <span className="font-bold text-[#0F4C3A] text-base">
              {form.currency === 'NGN' ? '₦' : form.currency === 'USD' ? '$' : '£'}
              {total.toLocaleString()}
            </span>
          </div>
        )}
        <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-[#666666] hover:text-[#1A1A1A]">Cancel</button>
          <button type="submit" disabled={loading}
            className="px-6 py-2 bg-[#C9A961] hover:bg-[#b8963f] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2">
            {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {loading ? 'Submitting…' : 'Submit Invoice'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
