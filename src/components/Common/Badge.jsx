export default function Badge({ type, value }) {
  const statusColors = {
    New: 'bg-blue-100 text-blue-800',
    'In Review': 'bg-purple-100 text-purple-800',
    Active: 'bg-green-100 text-green-800',
    'Awaiting Documents': 'bg-orange-100 text-orange-800',
    'In Court': 'bg-red-100 text-red-800',
    Resolved: 'bg-gray-100 text-gray-600',
    Closed: 'bg-gray-200 text-gray-700',
    Standard: 'bg-green-100 text-green-800',
    Urgent: 'bg-orange-100 text-orange-800',
    Critical: 'bg-red-100 text-red-800',
    Draft: 'bg-gray-100 text-gray-600',
    Sent: 'bg-blue-100 text-blue-800',
    Paid: 'bg-green-100 text-green-800',
    Overdue: 'bg-red-100 text-red-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Reminded: 'bg-blue-100 text-blue-800',
    Completed: 'bg-green-100 text-green-800',
    Email: 'bg-blue-100 text-blue-800',
    WhatsApp: 'bg-green-100 text-green-800',
    'Phone Call': 'bg-purple-100 text-purple-800',
    'In Person': 'bg-orange-100 text-orange-800',
    Telegram: 'bg-sky-100 text-sky-800',
    Inbound: 'bg-teal-100 text-teal-800',
    Outbound: 'bg-indigo-100 text-indigo-800',
  }

  const cls = statusColors[value] || 'bg-gray-100 text-gray-600'

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {value}
    </span>
  )
}
