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
      image: item.image || null,
      correctAnswer: item.answer,
      explanation: `${item.prompt} – ${item.answer}.`,
      pool: sameCategory.map((o) => o.answer),
      fullPool: items.map((o) => o.answer),
    }
  })

  // Group questions by category to ensure proportional representation
  const byCategory = {}
  for (const q of questions) {
    const cat = q.category || '_none'
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(q)
  }
  const categories = Object.keys(byCategory)

  // Shuffle each category, prioritizing missed questions within each
  for (const cat of categories) {
    const catMissed = byCategory[cat].filter((q) => missedIds.includes(q.itemId))
    const catRest = byCategory[cat].filter((q) => !missedIds.includes(q.itemId))
    byCategory[cat] = [...shuffle(catMissed), ...shuffle(catRest)]
  }

  // Pick at least 1 from each category, then fill remaining slots proportionally
  const selected = []
  const remaining = []
  for (const cat of categories) {
    selected.push(byCategory[cat][0])
    remaining.push(...byCategory[cat].slice(1))
  }
  const slotsLeft = actualCount - selected.length
  if (slotsLeft > 0) {
    selected.push(...shuffle(remaining).slice(0, slotsLeft))
  }

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
      image: q.image,
      options: shuffle([q.correctAnswer, ...wrongPicks]),
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    }
  })
}




