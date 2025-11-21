import React from 'react'

export function Hero() {
  return (
    <section className="text-center py-10">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">Secure Banking, Verified</h1>
      <p className="text-blue-200 max-w-2xl mx-auto">Identity checks, app authenticity, and grievance resolution—built to be trustworthy from the start.</p>
    </section>
  )
}

export function Features() {
  const items = [
    { title: 'Identity Verification', desc: 'Upload liveness video and detect deepfakes with ML, with safe fallback.', icon: '🪪' },
    { title: 'App Authenticity', desc: 'Check official package names and APK hashes against registry.', icon: '🛡️' },
    { title: 'Grievance AI', desc: 'AI categorization and analytics with resilient fallbacks.', icon: '🤖' },
  ]
  return (
    <section className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {items.map((i) => (
        <div key={i.title} className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-6">
          <div className="text-3xl mb-3">{i.icon}</div>
          <h3 className="text-white font-semibold mb-1">{i.title}</h3>
          <p className="text-blue-200/80 text-sm">{i.desc}</p>
        </div>
      ))}
    </section>
  )
}

export function CTA() {
  return (
    <section className="text-center py-10">
      <a href="/test" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium shadow">Try the API Demo</a>
    </section>
  )
}
