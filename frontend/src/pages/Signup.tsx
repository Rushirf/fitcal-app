import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../config/axios'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Basic validations
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      // Backend expects username + email (password not used by current API)
      await api.post('/signup', { username: name, email, password }) // include password
      
      navigate('/login', { replace: true })
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? err?.message ?? 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-[100vw] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl ring-1 ring-slate-200/70 p-6 animate-fadeIn">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mb-2 text-center">
            Create your account
          </h2>
          <p className="text-sm text-slate-600 mb-6 sm:mb-8 text-center">
            Sign up with your name, email and password.
          </p>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                Username
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="test123"
                autoComplete="name"
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                autoComplete="email"
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                autoComplete="new-password"
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                autoComplete="new-password"
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-2 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-lg bg-blue-400 px-2 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-600">
            Have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
