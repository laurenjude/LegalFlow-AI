import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Sidebar from './Sidebar'

export default function Layout() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E6] flex items-center justify-center">
        <div className="text-[#0F4C3A] text-lg font-semibold animate-pulse">Loading LegalFlow AI…</div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-[#F5F0E6] flex">
      <Sidebar />
      <main className="flex-1 ml-60 p-6 min-h-screen overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}
