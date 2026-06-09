export default function TopBar({ title, actions }) {
  return (
    <div className="flex items-center justify-between mb-4 md:mb-6 pl-14 md:pl-0">
      <h1 className="text-lg md:text-2xl font-bold text-[#1A1A1A] leading-tight">{title}</h1>
      {actions && <div className="flex items-center gap-2 md:gap-3">{actions}</div>}
    </div>
  )
}
