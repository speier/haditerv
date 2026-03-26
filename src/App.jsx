import { useState, useEffect } from 'react'
import Home from './components/Home'
import Quiz from './components/Quiz'
import Results from './components/Results'

const TABS = [
  { id: 'home', label: 'Főoldal', icon: '🏠' },
  { id: 'quiz', label: 'Kvíz', icon: '❓' },
  { id: 'profile', label: 'Profil', icon: '🏆' },
]

export default function App() {
  const [page, setPage] = useState('home')
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dark') === 'true'
    }
    return false
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('dark', dark)
  }, [dark])

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors dark:bg-slate-900 dark:text-slate-100">
      {/* Minimal header */}
      <header className="sticky top-0 z-10 border-b border-slate-200/60 bg-white/80 backdrop-blur dark:border-slate-700/60 dark:bg-slate-800/80">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2">
          <button onClick={() => setPage('home')} className="flex items-center gap-1.5 text-lg font-bold tracking-tight">
            ⚔️ <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-blue-400">Haditerv</span>
          </button>
          {import.meta.env.DEV && (
            <button
              onClick={() => {
                if (confirm('Minden adat törlése (localStorage)?')) {
                  localStorage.clear()
                  window.location.reload()
                }
              }}
              className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-900/40 dark:text-red-400"
            >
              RESET
            </button>
          )}
        </div>
          <button
            onClick={() => setDark((d) => !d)}
            className="rounded-lg p-2 text-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
            aria-label="Sötét/világos mód váltás"
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Main content - extra padding bottom for tab bar */}
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-5 pb-24">
        {page === 'home' && <Home navigate={setPage} />}
        {page === 'quiz' && <Quiz />}
        {page === 'profile' && <Results />}
      </main>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200/60 bg-white/90 backdrop-blur-lg dark:border-slate-700/60 dark:bg-slate-800/90" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="mx-auto flex max-w-xl">
          {TABS.map((tab) => {
            const active = page === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setPage(tab.id)}
                className={`relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors ${
                  active
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {active && (
                  <span className="absolute -top-px left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-emerald-500" />
                )}
                <span className={`text-xl transition-transform ${active ? 'scale-110' : ''}`}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
