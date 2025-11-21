import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import LoadingSpinner from '../components/LoadingSpinner'
import { getBackendBase, getToken, quickRegister } from '../lib/auth'

function useAuthToken() {
  const [token, setToken] = useState(null)
  useEffect(() => {
    (async () => {
      let t = getToken()
      if (!t) {
        await quickRegister()
        t = getToken()
      }
      setToken(t)
    })()
  }, [])
  return token
}

export default function Dashboard() {
  const backend = getBackendBase()
  const token = useAuthToken()

  const [analytics, setAnalytics] = useState(null)
  const [registry, setRegistry] = useState([])
  const [suspicious, setSuspicious] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [newApp, setNewApp] = useState({ package_name: '', publisher: '', google_play_link: '' })

  async function loadAll() {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const headers = { Authorization: `Bearer ${token}` }
      const [a, r, s] = await Promise.all([
        fetch(`${backend}/api/grievance/analytics`, { headers }),
        fetch(`${backend}/api/app/registry`, { headers }),
        fetch(`${backend}/api/app/suspicious`, { headers })
      ])
      const aj = await a.json(); const rj = await r.json(); const sj = await s.json()
      if (!aj.success) throw new Error(aj.error || 'Analytics failed')
      if (!rj.success) throw new Error(rj.error || 'Registry failed')
      if (!sj.success) throw new Error(sj.error || 'Suspicious failed')
      setAnalytics(aj.data)
      setRegistry(rj.data)
      setSuspicious(sj.data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAll() }, [token])

  async function addOfficial(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${backend}/api/app/registry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newApp)
      })
      const j = await res.json()
      if (!j.success) throw new Error(j.error || 'Add failed')
      setNewApp({ package_name: '', publisher: '', google_play_link: '' })
      await loadAll()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">Operations Dashboard</h1>
        <p className="text-slate-300 mb-6">Analytics and registries powered by the backend API.</p>

        {loading && <LoadingSpinner label="Loading..." />}
        {error && <p className="text-red-400 mb-4">{error}</p>}

        <section className="grid lg:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="font-semibold mb-3">Grievance Analytics</h2>
            {analytics ? (
              <div className="space-y-2 text-sm text-slate-200">
                <div className="flex justify-between"><span>Total complaints</span><span className="font-mono">{analytics.total_complaints}</span></div>
                <div className="flex justify-between"><span>High priority pending</span><span className="font-mono">{analytics.high_priority_pending}</span></div>
                <div className="flex justify-between"><span>Avg resolution (hrs)</span><span className="font-mono">{analytics.avg_resolution_time_hours}</span></div>
                <div>
                  <div className="text-slate-400 mt-2">By category</div>
                  <pre className="bg-slate-900 border border-slate-700 rounded p-3 overflow-auto">{JSON.stringify(analytics.by_category, null, 2)}</pre>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-sm">No data yet</p>
            )}
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="font-semibold mb-3">Official Registry</h2>
            <div className="space-y-2 max-h-64 overflow-auto">
              {registry.length === 0 && <p className="text-slate-400 text-sm">No entries</p>}
              {registry.map((r) => (
                <div key={r.id} className="text-sm bg-slate-900 border border-slate-700 rounded p-3">
                  <div className="font-mono text-slate-200">{r.package_name || '—'}</div>
                  <div className="text-slate-400">{r.publisher}</div>
                  {r.google_play_link && <a href={r.google_play_link} className="text-blue-400 text-xs" target="_blank" rel="noreferrer">Play link</a>}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="font-semibold mb-3">Suspicious Apps</h2>
            <div className="space-y-2 max-h-64 overflow-auto">
              {suspicious.length === 0 && <p className="text-slate-400 text-sm">No entries</p>}
              {suspicious.map((r) => (
                <div key={r.id} className="text-sm bg-slate-900 border border-slate-700 rounded p-3">
                  <div className="font-mono text-slate-200">{r.package_name || '—'}</div>
                  <div className="text-slate-400">{r.publisher}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="font-semibold mb-4">Add Official App</h2>
          <form onSubmit={addOfficial} className="grid md:grid-cols-3 gap-4">
            <input value={newApp.package_name} onChange={e=>setNewApp(a=>({...a, package_name: e.target.value}))} placeholder="com.bank.official" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm" />
            <input value={newApp.publisher} onChange={e=>setNewApp(a=>({...a, publisher: e.target.value}))} placeholder="Publisher" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm" />
            <input value={newApp.google_play_link} onChange={e=>setNewApp(a=>({...a, google_play_link: e.target.value}))} placeholder="https://play.google.com/..." className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm" />
            <div className="md:col-span-3">
              <button disabled={loading || !newApp.package_name} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 disabled:opacity-50">Add</button>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}
