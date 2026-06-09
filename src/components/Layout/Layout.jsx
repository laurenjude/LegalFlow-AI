import { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Sidebar from './Sidebar'

function HamburgerIcon() {
  return (
    <div className="flex flex-col gap-[5px]">
      <span className="block w-5 h-[2px] bg-white rounded-full" />
      <span className="block w-5 h-[2px] bg-white rounded-full" />
      <span className="block w-5 h-[2px] bg-white rounded-full" />
    </div>
  )
}

export default function Layout() {
  const { user, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E6] flex items-center justify-center">
        <div className="text-[#0F4C3A] text-lg font-semibold animate-pulse">Loading LegalFlow AI…</div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-[#F5F0E6]">
      {/* Hamburger button — mobile only */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-3 left-3 z-[60] p-2 bg-[#0F4C3A] rounded-lg md:hidden"
        aria-label="Open menu"
      >
        <HamburgerIcon />
      </button>

      {/* Overlay — mobile only, when sidebar open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="md:ml-60 p-4 md:p-6 min-h-screen overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}
