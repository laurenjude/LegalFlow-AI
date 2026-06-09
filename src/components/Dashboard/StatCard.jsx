export default function StatCard({ title, value, subtitle, borderColor = 'border-[#0F4C3A]' }) {
  return (
    <div className={`bg-white rounded-xl p-3 md:p-5 shadow-sm border-t-4 ${borderColor}`}>
      <p className="text-[10px] md:text-xs font-medium text-[#666666] uppercase tracking-wider mb-1 leading-tight">{title}</p>
      <p className="text-xl md:text-2xl font-bold text-[#1A1A1A] mb-1 break-words">{value}</p>
      {subtitle && <p className="text-[10px] md:text-xs text-[#666666]">{subtitle}</p>}
    </div>
  )
}
