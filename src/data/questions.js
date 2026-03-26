// Shuffle helper
export function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// Missed-questions tracking per deck
const MISSED_KEY = (deckId) => `missedItems_${deckId}`

export function loadMissed(deckId) {
  try {
    const raw = localStorage.getItem(MISSED_KEY(deckId))
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function saveMissed(deckId, missedIds) {
  localStorage.setItem(MISSED_KEY(deckId), JSON.stringify([...new Set(missedIds)]))
}

// Build quiz questions from any deck.
// Each deck item: { id, prompt, answer, category? }
// Wrong options are drawn from the same category first, then supplemented from the full pool.
// Missed questions are prioritized — they appear first, then remaining slots are filled randomly.
export function generateQuizQuestions(deck, count = 10) {
  const { items } = deck
  const actualCount = Math.min(count, items.length)
  const missedIds = loadMissed(deck.id)

  const questions = items.map((item) => {
    const sameCategory = items.filter((o) => !item.category || o.category === item.category)
    return {
      id: `q-${item.id}`,
      itemId: item.id,
      category: item.category || null,
      label: item.prompt,
      correctAnswer: item.answer,
      explanation: `${item.prompt} – ${item.answer}.`,
      pool: sameCategory.map((o) => o.answer),
      fullPool: items.map((o) => o.answer),
    }
  })

  // Prioritize missed questions, then fill with the rest
  const missed = shuffle(questions.filter((q) => missedIds.includes(q.itemId)))
  const rest = shuffle(questions.filter((q) => !missedIds.includes(q.itemId)))
  const selected = [...missed, ...rest].slice(0, actualCount)

  return shuffle(selected).map((q) => {
    const wrongFromCategory = q.pool.filter((a) => a !== q.correctAnswer)
    let wrongPicks = shuffle(wrongFromCategory).slice(0, 3)
    if (wrongPicks.length < 3) {
      const supplement = shuffle(
        q.fullPool.filter((a) => a !== q.correctAnswer && !wrongPicks.includes(a))
      )
      wrongPicks = [...wrongPicks, ...supplement].slice(0, 3)
    }
    return {
      id: q.id,
      itemId: q.itemId,
      category: q.category,
      label: q.label,
      options: shuffle([q.correctAnswer, ...wrongPicks]),
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    }
  })
}




