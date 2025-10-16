import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../config/axios.ts'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/login', { username, password })
      const uname = data?.username ?? username
      sessionStorage.setItem('username', String(uname))
      navigate('/', { replace: true })
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? err?.message ?? 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-[100vw] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl ring-1 ring-slate-200/70 p-6 sm:p-8 md:p-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight text-center mb-4">
            Login
          </h2>

          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                Username
              </label>
            <input
                id="email"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              required
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
                autoComplete="current-password"
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            />
        </div>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-black shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            No account?{' '}
            <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
              Sign up
            </Link>
      </p>
        </div>
      </div>
    </div>
  )
}
