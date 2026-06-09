import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/Common/Toast'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const showToast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) {
      showToast('Passwords do not match', 'error')
      return
    }
    setLoading(true)
    const { error } = await signUp(email, password)
    if (error) {
      showToast(error.message || 'Sign up failed', 'error')
    } else {
      showToast('Account created! Check your email to confirm.')
      navigate('/login')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0F4C3A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#C9A961] mb-2">LegalFlow AI</h1>
          <p className="text-[#F5F0E6]/70 text-sm">Case Management System</p>
        </div>

        <div className="bg-[#F5F0E6] rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0F4C3A] focus:border-transparent text-sm"
                placeholder="you@lawfirm.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0F4C3A] focus:border-transparent text-sm"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Confirm Password</label>
              <input
                type="password"
                required
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0F4C3A] focus:border-transparent text-sm"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#C9A961] hover:bg-[#b8963f] text-white font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-[#666666] mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-[#0F4C3A] font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
