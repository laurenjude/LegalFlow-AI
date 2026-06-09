import { useState } from 'react'
import Modal from '../Common/Modal'
import { useToast } from '../Common/Toast'

const DOC_TYPES = ['Affidavit', 'Contract', 'Court Filing', 'ID Document', 'Evidence', 'Correspondence', 'Receipt', 'Deed', 'Survey Plan', 'Power of Attorney', 'Witness Statement', 'Other']

export default function UploadDocumentModal({ isOpen, onClose, caseId, onSuccess }) {
  const showToast = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ documentName: '', docType: '', fileUrl: '', uploadedBy: '', notes: '' })
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(import.meta.env.VITE_WEBHOOK_DOCUMENTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseReference: caseId,
          documentName: form.documentName,
          documentType: form.docType,
          fileUrl: form.fileUrl,
          fileName: form.documentName,
          uploadedBy: form.uploadedBy,
          notes: form.notes,
          submittedAt: new Date().toISOString(),
        }),
      })
      if (res.ok) {
        showToast('Document uploaded successfully!')
        onClose()
        onSuccess?.()
      } else {
        showToast('Upload failed. Please try again.', 'error')
      }
    } catch {
      showToast('Network error. Please try again.', 'error')
    }
    setLoading(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Document">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Case Reference</label>
          <input readOnly value={caseId || ''} className="input-field bg-gray-50 cursor-not-allowed" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Document Name *</label>
          <input required value={form.documentName} onChange={e => set('documentName', e.target.value)}
            className="input-field" placeholder="e.g. Affidavit of Evidence" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Document Type *</label>
          <select required value={form.docType} onChange={e => set('docType', e.target.value)} className="input-field">
            <option value="">Select type…</option>
            {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Document Link (Google Drive, Dropbox, or any file URL) *</label>
          <input required type="url" value={form.fileUrl} onChange={e => set('fileUrl', e.target.value)}
            className="input-field" placeholder="https://drive.google.com/file/…" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Uploaded By *</label>
          <input required value={form.uploadedBy} onChange={e => set('uploadedBy', e.target.value)}
            className="input-field" placeholder="Your name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Notes</label>
          <textarea rows={3} value={form.notes} onChange={e => set('notes', e.target.value)}
            className="input-field resize-none" placeholder="Any additional notes…" />
        </div>
        <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-[#666666] hover:text-[#1A1A1A]">Cancel</button>
          <button type="submit" disabled={loading}
            className="px-6 py-2 bg-[#0F4C3A] hover:bg-[#0a3529] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2">
            {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {loading ? 'Uploading…' : 'Upload Document'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
