import { useState, useEffect, useRef } from 'react'
import { generateQuizQuestions, loadMissed, saveMissed } from '../data/questions'
import { loadResults, saveResult, BADGES, findNewBadges } from '../data/badges'

function speak(text) {
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'hu-HU'
  utterance.rate = 0.9
  window.speechSynthesis.speak(utterance)
}

function loadProgress(key) {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function saveProgress(key, state) {
  localStorage.setItem(key, JSON.stringify(state))
}

function clearProgress(key) {
  localStorage.removeItem(key)
}

function Confetti() {
  const colors = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899']
  return (
    <>
      {Array.from({ length: 40 }, (_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[i % colors.length],
            animationDelay: `${Math.random() * 1.5}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
            width: `${6 + Math.random() * 8}px`,
            height: `${6 + Math.random() * 8}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </>
  )
}

function StreakBadge({ streak }) {
  if (streak < 2) return null
  return (
    <div className="animate-fire inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-600 dark:bg-orange-900/40 dark:text-orange-300">
      🔥 {streak}x sorozat!
    </div>
  )
}

export default function Quiz({ deck, onBack }) {
  const STORAGE_KEY = `quizProgress_${deck.id}`

  const [state, setState] = useState(() => {
    const saved = loadProgress(STORAGE_KEY)
    if (saved && !saved.finished && saved.questions?.[0]?.label && (saved.current > 0 || saved.selected !== null)) {
      return { ...saved, answerAnim: null }
    }
    clearProgress(STORAGE_KEY)
    const questions = generateQuizQuestions(deck)
    return { questions, current: 0, selected: null, score: 0, finished: false, streak: 0, answerAnim: null, wrongIds: [] }
  })
  const [newBadges, setNewBadges] = useState([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const questionRef = useRef(null)

  const { questions, current, selected, score, finished, streak = 0, answerAnim } = state
  const q = questions[current]
  const total = questions.length

  useEffect(() => {
    const { answerAnim, ...toSave } = state
    saveProgress(STORAGE_KEY, toSave)
  }, [state])

  // Scroll question into view on change
  useEffect(() => {
    questionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [current])

  const handleSelect = (option) => {
    if (selected !== null) return
    const correct = option === q.correctAnswer
    // Haptic feedback on wrong answer
    if (!correct && navigator.vibrate) {
      navigator.vibrate(100)
    }
    setState((s) => ({
      ...s,
      selected: option,
      score: correct ? s.score + 1 : s.score,
      streak: correct ? (s.streak || 0) + 1 : 0,
      answerAnim: correct ? 'correct' : 'wrong',
      wrongIds: correct ? (s.wrongIds || []) : [...(s.wrongIds || []), q.itemId],
    }))
  }

  // Auto-advance: faster for correct (1.2s), slower for wrong (2.5s) to read explanation
  useEffect(() => {
    if (selected === null) return
    const delay = selected === q.correctAnswer ? 1200 : 2500
    const timer = setTimeout(handleNext, delay)
    return () => clearTimeout(timer)
  }, [selected])

  const handleNext = () => {
    setState((s) => {
      if (s.current + 1 >= total) {
        // Save missed questions for next quiz
        const missed = s.questions.filter((qq, i) => s.wrongIds && s.wrongIds.includes(qq.itemId))
        const prevMissed = loadMissed(deck.id)
        // Keep items still missed, remove items answered correctly this round
        const correctIds = s.questions.filter((qq) => !s.wrongIds?.includes(qq.itemId)).map((qq) => qq.itemId)
        const updatedMissed = [...new Set([...prevMissed, ...(s.wrongIds || [])])].filter((id) => !correctIds.includes(id))
        saveMissed(deck.id, updatedMissed)

        const oldBadges = loadResults().badges || []
        const earned = saveResult(s.score, total)
        const freshBadges = findNewBadges(oldBadges, earned.badges)
        setNewBadges(freshBadges)
        setEarnedXp(earned.lastEarnedXp || 0)
        if (s.score >= total * 0.8) setShowConfetti(true)
        clearProgress(STORAGE_KEY)
        return { ...s, finished: true, selected: null, answerAnim: null }
      }
      return { ...s, current: s.current + 1, selected: null, answerAnim: null }
    })
  }

  const handleRestart = () => {
    clearProgress(STORAGE_KEY)
    const questions = generateQuizQuestions(deck)
    const fresh = { questions, current: 0, selected: null, score: 0, finished: false, streak: 0, answerAnim: null, wrongIds: [] }
    setNewBadges([])
    setShowConfetti(false)
    setEarnedXp(0)
    setState(fresh)
  }

  const pct = Math.round((score / total) * 100)
  const progress = ((current + (selected !== null ? 1 : 0)) / total) * 100

  if (finished) {
    const badge = BADGES.find(
      (b) => pct >= b.minPct
    )
    return (
      <div className="animate-slide-up flex flex-col items-center gap-6 py-8">
        {showConfetti && <Confetti />}

        <div className="animate-bounce-in text-6xl">{badge?.icon || '📝'}</div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{deck.icon} {deck.title}</p>
        <h2 className="text-2xl font-bold">Eredmény</h2>

        <div className="flex flex-col items-center gap-2">
          <p className="text-5xl font-extrabold">
            {score}/{total}
          </p>
          <p className="text-xl text-slate-500 dark:text-slate-400">{pct}%</p>
        </div>

        {earnedXp > 0 && (
          <div className="animate-pop-in rounded-full bg-blue-50 px-4 py-1.5 text-sm font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
            ⚡ +{earnedXp} XP
          </div>
        )}

        {badge && (
          <div className="animate-pop-in rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-3 text-center shadow dark:from-amber-900/30 dark:to-yellow-900/30">
            <p className="text-sm text-slate-500 dark:text-slate-400">Rang</p>
            <p className="text-lg font-bold">{badge.icon} {badge.name}</p>
          </div>
        )}

        {newBadges.length > 0 && (
          <div className="animate-slide-up flex flex-col items-center gap-2">
            <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">🎖️ Új kitüntetés!</p>
            {newBadges.map((b) => (
              <div key={b.id} className="animate-pop-in rounded-lg bg-purple-50 px-4 py-2 text-center dark:bg-purple-900/30">
                <span className="text-2xl">{b.icon}</span>
                <p className="text-sm font-semibold">{b.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{b.desc}</p>
              </div>
            ))}
          </div>
        )}

        <p className="text-lg">
          {pct >= 80
            ? '🎉 Kiváló munka!'
            : pct >= 50
            ? '👍 Jó, de még gyakorolj!'
            : '📖 Több tanulás szükséges!'}
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleRestart}
            className="animate-pulse-glow flex-1 rounded-xl bg-emerald-600 px-6 py-3 text-lg font-semibold text-white shadow-md transition-transform hover:scale-[1.02] hover:bg-emerald-700 active:scale-[0.98]"
          >
            🔄 Új játék
          </button>
          {onBack && (
            <button
              onClick={onBack}
              className="rounded-xl border-2 border-slate-200 bg-white px-4 py-3 font-medium text-slate-600 shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              📚 Paklik
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6" ref={questionRef}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            aria-label="Vissza"
          >
            ←
          </button>
          <h2 className="text-lg font-bold">{deck.icon} {deck.title}</h2>
        </div>
        <StreakBadge streak={streak} />
      </div>

      {/* Progress bar */}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Counter */}
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Kérdés {current + 1} / {total} &nbsp;·&nbsp; ✅ {score} pont
      </p>

      {/* Question card – school notebook style */}
      <div className="animate-slide-up rounded-xl bg-white p-5 shadow-md dark:bg-slate-800">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
          {q.category && deck.categories?.[q.category]
            ? `${deck.categories[q.category].icon} ${deck.categories[q.category].label}`
            : '❓ Kérdés'}
        </p>
        <div className="flex items-start gap-2">
          <p className="flex-1 text-2xl font-bold">{q.label}</p>
          <button
            onClick={() => speak(q.label)}
            className="mt-1 shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            aria-label="Kérdés felolvasása"
            title="Felolvasás"
          >
            🔊
          </button>
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {q.options.map((option) => {
          let bg = 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750'
          let anim = ''
          if (selected !== null) {
            if (option === q.correctAnswer) {
              bg = 'bg-emerald-100 border-emerald-500 dark:bg-emerald-900/40'
              if (option === selected) anim = 'animate-bounce-in'
            } else if (option === selected && option !== q.correctAnswer) {
              bg = 'bg-red-100 border-red-500 dark:bg-red-900/40'
              anim = 'animate-shake'
            }
          }

          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={selected !== null}
              className={`${bg} ${anim} w-full rounded-xl border-2 border-slate-200 p-4 text-left font-medium shadow-sm transition-all dark:border-slate-700 ${
                selected === null
                  ? 'hover:scale-[1.01] active:scale-[0.99]'
                  : ''
              }`}
            >
              {option}
            </button>
          )
        })}
      </div>

      {/* Explanation + countdown */}
      {selected !== null && (
        <div className="flex flex-col gap-2">
          <div
            className={`animate-slide-up rounded-xl p-4 text-sm ${
              selected === q.correctAnswer
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200'
                : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold">
                {selected === q.correctAnswer ? '✅ Helyes!' : '❌ Helytelen!'}
              </p>
              {selected === q.correctAnswer && (
                <span className="animate-float-up text-sm font-bold text-emerald-600 dark:text-emerald-400">+10 XP ⚡</span>
              )}
            </div>
            <p className="mt-1">{q.explanation}</p>
          </div>
          {/* Countdown bar */}
          <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className={`countdown-bar h-full rounded-full ${
                selected === q.correctAnswer ? 'bg-emerald-400' : 'bg-red-400'
              }`}
              style={{ animationDuration: selected === q.correctAnswer ? '1.2s' : '2.5s' }}
            />
          </div>
        </div>
      )}

      {/* Tap to skip wait */}
      {selected !== null && (
        <button
          onClick={handleNext}
          className="animate-slide-up py-2 text-center text-sm text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
        >
          Koppints a továbblépéshez →
        </button>
      )}
    </div>
  )
}
