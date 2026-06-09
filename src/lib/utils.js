export function formatCurrency(amount) {
  if (amount == null) return '₦0'
  return '₦' + Number(amount).toLocaleString('en-NG')
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d)) return '—'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function daysFromNow(dateStr) {
  if (!dateStr) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(dateStr)
  d.setHours(0, 0, 0, 0)
  return Math.round((d - today) / (1000 * 60 * 60 * 24))
}

export function deadlineUrgency(dateStr) {
  const days = daysFromNow(dateStr)
  if (days === null) return 'unknown'
  if (days < 0) return 'overdue'
  if (days <= 3) return 'urgent'
  if (days <= 7) return 'approaching'
  return 'upcoming'
}

export function urgencyLabel(dateStr) {
  const u = deadlineUrgency(dateStr)
  const days = daysFromNow(dateStr)
  if (u === 'overdue') return { label: 'OVERDUE', color: 'bg-red-100 text-red-700', days }
  if (u === 'urgent') return { label: 'URGENT', color: 'bg-red-100 text-red-700', days }
  if (u === 'approaching') return { label: 'APPROACHING', color: 'bg-orange-100 text-orange-700', days }
  return { label: 'UPCOMING', color: 'bg-green-100 text-green-700', days }
}
