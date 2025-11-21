import React from 'react'

export default function Header() {
  return (
    <header className="w-full py-6">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/flame-icon.svg" alt="TrustGuard" className="w-8 h-8" />
          <a href="/" className="text-white font-semibold tracking-tight">TrustGuard</a>
        </div>
        <nav className="text-slate-300 text-sm flex items-center gap-6">
          <a href="/" className="hover:text-white">Home</a>
          <a href="/test" className="hover:text-white">Test</a>
          <a href="/identity" className="hover:text-white">Identity</a>
          <a href="/app-auth" className="hover:text-white">App Auth</a>
          <a href="/grievance" className="hover:text-white">Grievance</a>
        </nav>
      </div>
    </header>
  )
}
