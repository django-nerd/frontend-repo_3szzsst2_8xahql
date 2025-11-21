import React, { useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import Header from '../components/Header'
import { getBackendBase, getToken, quickRegister } from '../lib/auth'

export default function AppAuth() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const backend = getBackendBase()

  async function ensureAuth() {
    let t = getToken()
    if (!t) {
      await quickRegister()
      t = getToken()
    }
    return t
  }

  async function submitPackage(e) {
    e.preventDefault()
    setError(null)
    setResult(null)
    setLoading(true)
    try {
      const token = await ensureAuth()
      const form = e.currentTarget
      const package_name = form.package_name.value.trim()
      const res = await fetch(`${backend}/api/app/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Bearer ${token}` },
        body: new URLSearchParams({ package_name })
      })
      const j = await res.json()
      if (!j.success) throw new Error(j.error || 'Verification failed')
      setResult(j.data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function submitApk(e) {
    e.preventDefault()
    setError(null)
    setResult(null)
    setLoading(true)
    try {
      const token = await ensureAuth()
      const form = new FormData(e.currentTarget)
      const res = await fetch(`${backend}/api/app/verify`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form
      })
      const j = await res.json()
      if (!j.success) throw new Error(j.error || 'Verification failed')
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
      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <h1 className="text-3xl font-bold">App Authenticity</h1>
        <p className="text-slate-300">Check by package name or upload an APK to compute SHA-256 and match against registry.</p>

        <form onSubmit={submitPackage} className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl space-y-3">
          <label className="block text-sm text-slate-300">Package name</label>
          <input name="package_name" placeholder="com.bank.official" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm" />
          <button disabled={loading} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 disabled:opacity-50">Verify</button>
        </form>

        <form onSubmit={submitApk} className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl space-y-3">
          <label className="block text-sm text-slate-300">APK file</label>
          <input name="apk" type="file" accept=".apk" className="block w-full text-sm text-slate-200" />
          <button disabled={loading} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 disabled:opacity-50">Verify APK</button>
        </form>

        <div>
          {loading && <LoadingSpinner label="Checking..." />}
          {error && <p className="text-red-400">{error}</p>}
          {result && (<pre className="bg-slate-800 p-4 rounded border border-slate-700 overflow-auto">{JSON.stringify(result, null, 2)}</pre>)}
        </div>
      </main>
    </div>
  )
}
