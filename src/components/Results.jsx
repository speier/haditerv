import { useState, useEffect } from 'react'
import { loadResults, getRank, getNextRank, ACHIEVEMENTS, generateShareText } from '../data/badges'
import { decks } from '../data/decks/index'

export default function Results() {
  const [data, setData] = useState(loadResults)
  const [copied, setCopied] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  useEffect(() => {
    setData(loadResults())
  }, [])

  const rank = getRank(data.best || 0)
  const nextRank = getNextRank(data.best || 0)
  const allBadges = ACHIEVEMENTS.map((a) => ({
    ...a,
    earned: (data.badges || []).includes(a.id),
  }))

  const currentPct = data.best || 0
  const nextMinPct = nextRank?.minPct || 100
  const prevMinPct = rank.minPct
  const progressToNext = nextRank
    ? Math.min(100, ((currentPct - prevMinPct) / (nextMinPct - prevMinPct)) * 100)
    : 100

  const handleShare = async () => {
    const text = generateShareText(data)
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Tudáspróba eredmény', text })
        return
      }
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {}
    }
  }

  const handleReset = () => {
    localStorage.removeItem('quizResults')
    for (const deck of decks) {
      localStorage.removeItem(`quizProgress_${deck.id}`)
    }
    // also clear legacy key
    localStorage.removeItem('quizProgress')
    setData({ last: null, best: null, attempts: 0, streak: 0, bestStreak: 0, badges: [], history: [], xp: 0, dailyStreak: 0, bestDailyStreak: 0 })
    setShowResetConfirm(false)
  }

  const history = data.history || []
  const maxPct = Math.max(...history.map((h) => h.pct), 1)

  return (
    <div className="flex flex-col gap-5">
      {/* Rank card */}
      <div className="animate-slide-up flex flex-col items-center gap-2 rounded-2xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-6 shadow-md dark:from-amber-900/20 dark:via-yellow-900/20 dark:to-orange-900/20">
        <div className="text-5xl">{rank.icon}</div>
        <p className="text-2xl font-extrabold">{rank.name}</p>
        {nextRank && (
          <div className="mt-1 w-full">
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/60 dark:bg-slate-700/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-700"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
            <p className="mt-1 text-center text-xs text-slate-400">
              {nextRank.icon} {nextRank.name} – még {nextMinPct - currentPct}%
            </p>
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon="⚡" label="Összes XP" value={data.xp || 0} color="bg-blue-50 dark:bg-blue-900/30" />
        <StatCard icon="🏆" label="Legjobb" value={data.best !== null ? `${data.best}%` : '–'} color="bg-amber-50 dark:bg-amber-900/30" />
        <StatCard icon="📅" label="Napi sorozat" value={`${data.dailyStreak || 0} nap`} color="bg-orange-50 dark:bg-orange-900/30" />
        <StatCard icon="🔢" label="Kitöltések" value={data.attempts || 0} color="bg-emerald-50 dark:bg-emerald-900/30" />
        <StatCard icon="📝" label="Legutóbbi" value={data.last !== null ? `${data.last}%` : '–'} color="bg-slate-50 dark:bg-slate-800" />
        <StatCard icon="🔥" label="Legjobb sorozat" value={data.bestStreak || 0} color="bg-red-50 dark:bg-red-900/30" />
      </div>

      {/* Progress chart */}
      {history.length > 1 && (
        <div className="rounded-2xl bg-white p-4 shadow-md dark:bg-slate-800">
          <p className="mb-3 text-sm font-semibold text-slate-500 dark:text-slate-400">📈 Fejlődés</p>
          <div className="flex items-end gap-1" style={{ height: 80 }}>
            {history.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-emerald-500 to-emerald-300 transition-all dark:from-emerald-600 dark:to-emerald-400"
                style={{ height: `${(h.pct / maxPct) * 100}%`, minHeight: 4 }}
                title={`${h.date}: ${h.pct}%`}
              />
            ))}
          </div>
          <div className="mt-1 flex justify-between text-xs text-slate-400">
            <span>{history[0]?.date}</span>
            <span>{history[history.length - 1]?.date}</span>
          </div>
        </div>
      )}

      {/* Badges */}
      <div className="rounded-2xl bg-white p-4 shadow-md dark:bg-slate-800">
        <p className="mb-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
          🎖️ Kitüntetések ({allBadges.filter((b) => b.earned).length}/{allBadges.length})
        </p>
        <div className="grid grid-cols-4 gap-3">
          {allBadges.map((b) => (
            <div
              key={b.id}
              className={`flex flex-col items-center gap-1 rounded-xl p-2 text-center transition-all ${
                b.earned
                  ? ''
                  : 'opacity-25 grayscale'
              }`}
              title={b.desc}
            >
              <span className="text-2xl">{b.icon}</span>
              <span className="text-[10px] font-medium leading-tight">{b.name}</span>
              <span className="text-[9px] text-slate-400">{b.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Share button */}
      {data.attempts > 0 && (
        <button
          onClick={handleShare}
          className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3.5 text-lg font-semibold text-white shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {copied ? '✅ Másolva!' : '📋 Eredmények megosztása'}
        </button>
      )}

      {/* Reset */}
      {data.attempts > 0 && (
        <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-sm dark:border-red-900/30 dark:bg-slate-800">
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full rounded-lg px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
            >
              🗑️ Összes adat törlése
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="text-center">
                <p className="text-sm font-bold text-red-600 dark:text-red-400">⚠️ Biztosan törölsz mindent?</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Ez véglegesen törli az összes eredményed, XP-t, kitüntetést és napi sorozatot. Nem visszavonható.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Mégsem
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700"
                >
                  Igen, törlöm
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* About */}
      <div className="mt-4 border-t border-slate-200/60 pt-4 text-center dark:border-slate-700/40">
        <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
          <a href="https://dendora.hu" target="_blank" rel="noopener noreferrer" className="font-medium text-emerald-500 hover:underline dark:text-emerald-400">
            dendora.hu
          </a>
        </p>
        <p className="mt-0.5 text-[10px] text-slate-300 dark:text-slate-600">{__GIT_REV__}</p>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`${color} flex items-center gap-3 rounded-xl p-3.5 shadow-sm`}>
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  )
}
