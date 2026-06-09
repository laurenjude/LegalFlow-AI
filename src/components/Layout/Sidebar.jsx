import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '⊞' },
  { to: '/cases', label: 'Cases', icon: '📁' },
  { to: '/invoices', label: 'Invoices', icon: '💰' },
  { to: '/deadlines', label: 'Deadlines', icon: '📅' },
]

export default function Sidebar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <aside className="fixed top-0 left-0 h-full w-60 bg-[#0F4C3A] flex flex-col z-40">
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="text-[#C9A961] text-xl font-bold tracking-wide">LegalFlow AI</h1>
        <p className="text-cream/60 text-xs mt-0.5 text-[#F5F0E6]/60">Case Management</p>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'text-[#C9A961] border-l-4 border-[#C9A961] bg-white/5 pl-5'
                  : 'text-[#F5F0E6]/70 hover:text-[#F5F0E6] hover:bg-white/5 border-l-4 border-transparent pl-5'
              }`
            }
          >
            <span className="text-base">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-[#F5F0E6]/50 text-xs truncate mb-3">{user?.email}</p>
        <button
          onClick={handleSignOut}
          className="w-full text-left text-sm text-[#F5F0E6]/70 hover:text-[#C9A961] transition-colors py-1"
        >
          ← Sign Out
        </button>
      </div>
    </aside>
  )
}
