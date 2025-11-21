import React, { useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import Header from '../components/Header'
import { getBackendBase, getToken, quickRegister } from '../lib/auth'

export default function Identity() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [createdId, setCreatedId] = useState(null)

  const backend = getBackendBase()

  async function ensureAuth() {
    let t = getToken()
    if (!t) {
      await quickRegister()
      t = getToken()
    }
    return t
  }

  async function submit(e) {
    e.preventDefault()
    setError(null)
    setResult(null)
    setLoading(true)
    try {
      const token = await ensureAuth()
      const form = new FormData(e.currentTarget)
      const file = form.get('video')
      if (!file || file.size === 0) throw new Error('Please select a video file')
      const res = await fetch(`${backend}/api/identity/verify`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form
      })
      const j = await res.json()
      if (!j.success) throw new Error(j.error || 'Verification failed')
      setResult(j.data)
      if (j.data.id) setCreatedId(j.data.id)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function fetchResult() {
    if (!createdId) return
    setLoading(true)
    setError(null)
    try {
      const token = await ensureAuth()
      const res = await fetch(`${backend}/api/identity/result/${createdId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const j = await res.json()
      if (!j.success) throw new Error(j.error || 'Fetch failed')
      setResult(j.data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">Identity Verification</h1>
        <p className="text-slate-300 mb-6">Upload a short liveness video. The system will use the ML service when available and fallback safely otherwise.</p>

        <form onSubmit={submit} className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Video file</label>
            <input name="video" type="file" accept="video/*" className="block w-full text-sm text-slate-200" />
          </div>
          <button disabled={loading} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 disabled:opacity-50">Verify</button>
        </form>

        <div className="mt-6">
          {loading && <LoadingSpinner label="Processing..." />}
          {error && <p className="text-red-400">{error}</p>}
          {createdId && (
            <div className="flex items-center gap-3 mt-3">
              <span className="text-sm text-slate-300">Result ID: {createdId}</span>
              <button onClick={fetchResult} className="text-sm px-3 py-1 rounded bg-slate-700 hover:bg-slate-600">Refresh Result</button>
            </div>
          )}
          {result && (
            <pre className="bg-slate-800 p-4 rounded border border-slate-700 overflow-auto mt-4">{JSON.stringify(result, null, 2)}</pre>
          )}
        </div>
      </main>
    </div>
  )
}
