import React from 'react'
import Header from './components/Header'
import { Hero, Features, CTA } from './components/Sections'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      <div className="relative min-h-screen">
        <Header />
        <main className="max-w-6xl mx-auto px-6">
          <Hero />
          <Features />
          <CTA />
        </main>
        <footer className="py-10 text-center text-sm text-blue-300/60">Built with resilience-first patterns</footer>
      </div>
    </div>
  )
}

export default App
