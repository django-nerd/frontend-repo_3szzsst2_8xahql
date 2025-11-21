import React, { useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import Header from '../components/Header'
import { getBackendBase, getToken, quickRegister } from '../lib/auth'

export default function Grievance() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [text, setText] = useState('I noticed an unauthorized debit on my card yesterday for $200')

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
      const res = await fetch(`${backend}/api/grievance/file`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text })
      })
      const j = await res.json()
      if (!j.success) throw new Error(j.error || 'File failed')
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
        <h1 className="text-3xl font-bold mb-2">File a Grievance</h1>
        <p className="text-slate-300 mb-6">We categorize your complaint using the AI service when available, with a safe fallback so nothing blocks you.</p>

        <form onSubmit={submit} className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl space-y-4">
          <textarea value={text} onChange={e=>setText(e.target.value)} rows={5} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm" />
          <button disabled={loading} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 disabled:opacity-50">Submit</button>
        </form>

        <div className="mt-6">
          {loading && <LoadingSpinner label="Submitting..." />}
          {error && <p className="text-red-400">{error}</p>}
          {result && (<pre className="bg-slate-800 p-4 rounded border border-slate-700 overflow-auto">{JSON.stringify(result, null, 2)}</pre>)}
        </div>
      </main>
    </div>
  )
}
