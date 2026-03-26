import { loadResults, getRank, getNextRank, hasPlayedToday, ACHIEVEMENTS } from '../data/badges'

const QUIZ_STORAGE_KEY = 'quizProgress'

const MOTIVATIONS = [
  'Ma is légy a legjobb! 💪',
  'Egy kis gyakorlás mindent megér! 📚',
  'A tudás a legjobb fegyver! ⚔️',
  'Minden nap egy lépéssel közelebb! 🎯',
  'A kitartás a siker kulcsa! 🔑',
]

export default function Home({ navigate }) {
  const data = loadResults()
  const rank = getRank(data.best || 0)
  const nextRank = getNextRank(data.best || 0)
  const played = hasPlayedToday()
  const badgeCount = (data.badges || []).length
  const motivation = MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]

  // Check for in-progress quiz
  let quizInProgress = false
  try {
    const saved = JSON.parse(localStorage.getItem(QUIZ_STORAGE_KEY))
    if (saved && !saved.finished && saved.questions?.length) quizInProgress = true
  } catch {}

  // Progress toward next rank
  const currentPct = data.best || 0
  const nextMinPct = nextRank?.minPct || 100
  const prevMinPct = rank.minPct
  const progressToNext = nextRank
    ? Math.min(100, ((currentPct - prevMinPct) / (nextMinPct - prevMinPct)) * 100)
    : 100

  // First run — simplified onboarding
  if (!data.attempts && !quizInProgress) {
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        <div className="animate-bounce-in text-7xl">⚔️</div>
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">Haditerv</h1>
          <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
            II. Világháború kvíz gyakorló
          </p>
        </div>

        <div className="w-full space-y-3 rounded-2xl bg-white p-5 shadow-md dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📚</span>
            <p className="text-sm"><strong>10 kérdés</strong> nevekből és dátumokból</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <p className="text-sm">Gyűjts <strong>XP pontokat</strong> és emelkedj rangban</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <p className="text-sm">Építs <strong>napi sorozatot</strong></p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎖️</span>
            <p className="text-sm">Szerezz <strong>kitüntetéseket</strong></p>
          </div>
        </div>

        <button
          onClick={() => navigate('quiz')}
          className="animate-pulse-glow w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-4 text-xl font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          🚀 Kezdjük el!
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Greeting + daily streak */}
      <div className="animate-slide-up text-center">
        <p className="text-3xl font-extrabold tracking-tight">
          ⚔️ Haditerv
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          II. Világháború kvíz
        </p>
      </div>

      {/* Daily streak card */}
      <div className={`animate-slide-up rounded-2xl p-5 shadow-md ${
        played
          ? 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30'
          : 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Napi sorozat
            </p>
            <p className="text-3xl font-extrabold">
              {data.dailyStreak || 0} <span className="text-lg">nap</span> {data.dailyStreak > 0 ? '🔥' : ''}
            </p>
          </div>
          <div className="text-right">
            {played ? (
              <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700 dark:bg-emerald-800/50 dark:text-emerald-300">
                ✅ Ma kész!
              </div>
            ) : (
              <div className="animate-pulse rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-700 dark:bg-orange-800/50 dark:text-orange-300">
                ⏳ Gyakorolj ma!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rank + XP */}
      <div className="animate-slide-up grid grid-cols-2 gap-3">
        <div className="flex flex-col items-center gap-1 rounded-2xl bg-white p-4 shadow-md dark:bg-slate-800">
          <span className="text-3xl">{rank.icon}</span>
          <p className="text-sm font-bold">{rank.name}</p>
          <p className="text-xs text-slate-400">Jelenlegi rang</p>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-2xl bg-white p-4 shadow-md dark:bg-slate-800">
          <span className="text-3xl">⚡</span>
          <p className="text-sm font-bold">{data.xp || 0} XP</p>
          <p className="text-xs text-slate-400">{data.attempts || 0} kitöltés</p>
        </div>
      </div>

      {/* Progress to next rank */}
      {nextRank && (
        <div className="animate-slide-up rounded-2xl bg-white p-4 shadow-md dark:bg-slate-800">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">{rank.icon} {rank.name}</span>
            <span className="font-medium">{nextRank.icon} {nextRank.name}</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-700"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
          <p className="mt-1 text-center text-xs text-slate-400">
            Még {nextMinPct - currentPct}% kell a következő ranghoz
          </p>
        </div>
      )}

      {/* Big CTA button */}
      <button
        onClick={() => navigate('quiz')}
        className="animate-pulse-glow mt-1 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-4 text-xl font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {quizInProgress ? '▶️ Kvíz folytatása' : data.attempts > 0 ? '🚀 Új kvíz indítása' : '🚀 Kezdjük el!'}
      </button>

      {/* Motivation */}
      <p className="text-center text-sm text-slate-400 dark:text-slate-500">
        {motivation}
      </p>

      {/* Quick badge showcase */}
      {badgeCount > 0 && (
        <div className="animate-slide-up rounded-2xl bg-white p-4 shadow-md dark:bg-slate-800">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">🎖️ Kitüntetések</p>
            <button
              onClick={() => navigate('profile')}
              className="text-xs font-medium text-emerald-600 dark:text-emerald-400"
            >
              Mind →
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.badges.map((id) => {
              const ach = ACHIEVEMENTS.find((a) => a.id === id)
              if (!ach) return null
              return (
                <span key={id} className="text-2xl" title={ach.name}>
                  {ach.icon}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Stats teaser */}
      {data.attempts > 0 && (
        <button
          onClick={() => navigate('profile')}
          className="animate-slide-up flex items-center justify-between rounded-2xl bg-white p-4 shadow-md dark:bg-slate-800"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <div className="text-left">
              <p className="text-sm font-semibold">Teljes statisztika</p>
              <p className="text-xs text-slate-400">Legjobb: {data.best}% · Kitöltések: {data.attempts}</p>
            </div>
          </div>
          <span className="text-slate-300 dark:text-slate-600">→</span>
        </button>
      )}
    </div>
  )
}
