import React, { useEffect, useState } from 'react'
import LoadingSpinner from './components/LoadingSpinner'

export default function Test() {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  async function register() {
    setLoading(true)
    setError(null)
    try {
      const r = await fetch(`${backend}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: `user${Date.now()}@test.com`, password: 'Passw0rd!', name: 'Demo User' })
      })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || 'Register failed')
      setToken(j.data.token)
      setUser(j.data.user)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function me() {
    setLoading(true)
    setError(null)
    try {
      const r = await fetch(`${backend}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || 'Me failed')
      setUser(j.data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">TrustGuard MVP (FastAPI-compatible) Test</h1>
      <p className="mb-6 text-slate-300">Backend URL: {backend}</p>
      <div className="flex gap-4 mb-6">
        <button onClick={register} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400">
          Quick Register
        </button>
        <button onClick={me} disabled={!token} className="px-4 py-2 bg-green-600 rounded disabled:opacity-50 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400">
          Get Profile
        </button>
      </div>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-400">{error}</p>}
      {user && (
        <pre className="bg-slate-800 p-4 rounded border border-slate-700 overflow-auto">{JSON.stringify(user, null, 2)}</pre>
      )}
    </div>
  )
}
