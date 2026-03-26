const RESULTS_KEY = 'quizResults'

// Ranks by minimum percentage (checked in order, first match wins)
export const BADGES = [
  { minPct: 100, name: 'Fővezér', icon: '👑' },
  { minPct: 80,  name: 'Tábornok', icon: '⭐' },
  { minPct: 60,  name: 'Kapitány', icon: '🎖️' },
  { minPct: 40,  name: 'Hadnagy', icon: '🪖' },
  { minPct: 20,  name: 'Katona', icon: '🔰' },
  { minPct: 0,   name: 'Újonc', icon: '📖' },
]

// XP per correct answer
const XP_PER_CORRECT = 10
const XP_BONUS_PERFECT = 50
const XP_BONUS_STREAK_DAY = 20

// Achievement badges
export const ACHIEVEMENTS = [
  { id: 'first',     name: 'Első bevetés',     icon: '🚀', desc: 'Első kvíz kitöltése',           check: (d) => d.attempts >= 1 },
  { id: 'five',      name: 'Veterán',          icon: '🎯', desc: '5 kvíz kitöltése',              check: (d) => d.attempts >= 5 },
  { id: 'ten',       name: 'Hadvezér',         icon: '⚔️', desc: '10 kvíz kitöltése',             check: (d) => d.attempts >= 10 },
  { id: 'perfect',   name: 'Tökéletes!',       icon: '💎', desc: '100%-os eredmény',              check: (d) => d.best >= 100 },
  { id: 'great',     name: 'Kiváló tanuló',    icon: '🌟', desc: '80% feletti legjobb eredmény',  check: (d) => d.best >= 80 },
  { id: 'streak3',   name: 'Lángész',          icon: '🔥', desc: '3 egymást követő 80%+ kvíz',   check: (d) => d.bestStreak >= 3 },
  { id: 'streak5',   name: 'Megállíthatatlan',  icon: '💪', desc: '5 egymást követő 80%+ kvíz',   check: (d) => d.bestStreak >= 5 },
  { id: 'improve',   name: 'Fejlődő',          icon: '📈', desc: 'Javítottad a legjobb eredményed', check: (d) => d.improved },
  { id: 'daily3',    name: 'Kitartó',          icon: '📅', desc: '3 napos sorozat',               check: (d) => d.dailyStreak >= 3 },
  { id: 'daily7',    name: 'Megszállott',      icon: '🗓️', desc: '7 napos sorozat',               check: (d) => d.dailyStreak >= 7 },
  { id: 'xp100',     name: 'Század',           icon: '💯', desc: '100 XP összegyűjtése',          check: (d) => d.xp >= 100 },
  { id: 'xp500',     name: 'Ezredes',          icon: '🎗️', desc: '500 XP összegyűjtése',          check: (d) => d.xp >= 500 },
]

function getToday() {
  return new Date().toISOString().split('T')[0]
}

function calcDailyStreak(prevData) {
  const today = getToday()
  const lastDate = prevData.lastPlayDate
  if (!lastDate) return 1
  if (lastDate === today) return prevData.dailyStreak || 1

  const last = new Date(lastDate)
  const now = new Date(today)
  const diffDays = Math.round((now - last) / (1000 * 60 * 60 * 24))
  if (diffDays === 1) return (prevData.dailyStreak || 0) + 1
  return 1 // streak broken
}

export function loadResults() {
  try {
    const raw = localStorage.getItem(RESULTS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { last: null, best: null, attempts: 0, streak: 0, bestStreak: 0, badges: [], history: [], xp: 0, dailyStreak: 0, bestDailyStreak: 0, lastPlayDate: null, playedToday: false }
}

// Save result and return full data (with new badges evaluated)
export function saveResult(score, total) {
  const prev = loadResults()
  const pct = Math.round((score / total) * 100)
  const attempts = (prev.attempts || 0) + 1
  const oldBest = prev.best || 0
  const best = Math.max(oldBest, pct)
  const improved = pct > oldBest && oldBest > 0

  // XP calculation
  let earnedXp = score * XP_PER_CORRECT
  if (pct === 100) earnedXp += XP_BONUS_PERFECT
  const today = getToday()
  const isNewDay = prev.lastPlayDate !== today
  if (isNewDay) earnedXp += XP_BONUS_STREAK_DAY
  const xp = (prev.xp || 0) + earnedXp

  // Streak tracking (consecutive 80%+)
  const streak = pct >= 80 ? (prev.streak || 0) + 1 : 0
  const bestStreak = Math.max(prev.bestStreak || 0, streak)

  // Daily streak
  const dailyStreak = calcDailyStreak(prev)
  const bestDailyStreak = Math.max(prev.bestDailyStreak || 0, dailyStreak)

  // History (last 20)
  const history = [...(prev.history || []), { pct, date: new Date().toLocaleDateString('hu-HU') }].slice(-20)

  const data = {
    last: pct, best, attempts, streak, bestStreak,
    badges: prev.badges || [], history, improved,
    xp, dailyStreak, bestDailyStreak, lastPlayDate: today, playedToday: true,
    lastEarnedXp: earnedXp,
  }

  // Evaluate badges
  const earnedIds = new Set(data.badges)
  for (const ach of ACHIEVEMENTS) {
    if (!earnedIds.has(ach.id) && ach.check(data)) {
      earnedIds.add(ach.id)
    }
  }
  data.badges = [...earnedIds]
  delete data.improved

  localStorage.setItem(RESULTS_KEY, JSON.stringify(data))
  return data
}

// Compare old vs new badges to find newly earned ones
export function findNewBadges(oldBadgeIds, newBadgeIds) {
  const oldSet = new Set(oldBadgeIds || [])
  return ACHIEVEMENTS.filter((a) => newBadgeIds.includes(a.id) && !oldSet.has(a.id))
}

export function getRank(pct) {
  return BADGES.find((b) => pct >= b.minPct) || BADGES[BADGES.length - 1]
}

export function getNextRank(pct) {
  const sorted = [...BADGES].reverse()
  return sorted.find((b) => b.minPct > pct)
}

export function hasPlayedToday() {
  const data = loadResults()
  return data.lastPlayDate === getToday()
}

export function generateShareText(data) {
  const rank = getRank(data.best || 0)
  const badgeIcons = (data.badges || [])
    .map((id) => ACHIEVEMENTS.find((a) => a.id === id)?.icon)
    .filter(Boolean)
    .join(' ')

  return [
    `⚔️ HADITERV – II. Világháború Kvíz`,
    ``,
    `${rank.icon} Rang: ${rank.name}`,
    `🏆 Legjobb: ${data.best ?? 0}%`,
    `⚡ XP: ${data.xp || 0}`,
    `🔢 Kitöltések: ${data.attempts || 0}`,
    data.dailyStreak > 1 ? `📅 Napi sorozat: ${data.dailyStreak} nap` : '',
    data.bestStreak > 1 ? `🔥 Legjobb sorozat: ${data.bestStreak}` : '',
    badgeIcons ? `🎖️ Kitüntetések: ${badgeIcons}` : '',
    ``,
    `Tudsz jobbat? Próbáld ki te is! 💪`,
  ]
    .filter(Boolean)
    .join('\n')
}
