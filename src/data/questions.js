export const people = [
  {
    id: 'p1',
    name: 'Winston Churchill',
    description: 'Brit miniszterelnök a háború alatt',
  },
  {
    id: 'p2',
    name: 'Franklin D. Roosevelt',
    description: 'Amerikai elnök a háború elején',
  },
  {
    id: 'p3',
    name: 'Harry S. Truman',
    description: 'Amerikai elnök a háború végén, az atombomba bevetésekor',
  },
  {
    id: 'p4',
    name: 'Szálasi Ferenc',
    description: 'A magyar nyilas párt vezetője',
  },
  {
    id: 'p5',
    name: 'Teleki Pál',
    description: 'Magyar miniszterelnök a háború előtt',
  },
  {
    id: 'p6',
    name: 'Sztójay Döme',
    description: 'Magyar miniszterelnök a német megszállás idején',
  },
]

export const dates = [
  {
    id: 'd1',
    date: '1938.11.02.',
    event: 'I. bécsi döntés',
    sortKey: 19381102,
  },
  {
    id: 'd2',
    date: '1939.09.01.',
    event: 'A II. világháború kezdete',
    sortKey: 19390901,
  },
  {
    id: 'd3',
    date: '1940.08.30.',
    event: 'II. bécsi döntés',
    sortKey: 19400830,
  },
  {
    id: 'd4',
    date: '1941.06.22.',
    event: 'Barbarossa hadművelet',
    sortKey: 19410622,
  },
  {
    id: 'd5',
    date: '1941.12.07.',
    event: 'Pearl Harbor: japán támadás az Egyesült Államok ellen',
    sortKey: 19411207,
  },
  {
    id: 'd6',
    date: '1944.03.19.',
    event: 'A németek megszállják Magyarországot',
    sortKey: 19440319,
  },
  {
    id: 'd7',
    date: '1944.06.06.',
    event: 'Normandiai partraszállás',
    sortKey: 19440606,
  },
  {
    id: 'd8',
    date: '1944.10.15.',
    event: 'Horthy kiáltványa',
    sortKey: 19441015,
  },
  {
    id: 'd9',
    date: '1945. április',
    event: 'Magyarországon véget ér a háború',
    sortKey: 19450401,
  },
  {
    id: 'd10',
    date: '1945.05.08.',
    event: 'Európában véget ér a II. világháború',
    sortKey: 19450508,
  },
  {
    id: 'd11',
    date: '1945.09.02.',
    event: 'Japán leteszi a fegyvert, vége a II. világháborúnak',
    sortKey: 19450902,
  },
]

export const concepts = [
  {
    id: 'c1',
    name: 'A háború ürügye',
    description: 'A gliwicei rádióállomás „megtámadása"',
  },
  {
    id: 'c2',
    name: 'Barbarossa hadművelet',
    description: 'A Szovjetunió megtámadásának terve',
  },
  {
    id: 'c3',
    name: 'Teheráni konferencia',
    description: 'A normandiai partraszállás megtervezése',
  },
  {
    id: 'c4',
    name: 'Jaltai konferencia',
    description: 'Németország négy megszállási övezetre bontása',
  },
  {
    id: 'c5',
    name: 'Gettó',
    description: 'Elkülönített városrész, ahol csak zsidók laktak',
  },
  {
    id: 'c6',
    name: 'Deportálás',
    description: 'A zsidók elszállítása, költöztetése',
  },
  {
    id: 'c7',
    name: 'Koncentrációs tábor',
    description: 'Kezdetben munkatábor, majd megsemmisítő tábor',
  },
  {
    id: 'c8',
    name: 'Vörös Hadsereg',
    description: 'A szovjet hadsereg',
  },
  {
    id: 'c9',
    name: 'Nyilasok',
    description: 'Szálasi Ferenc által vezetett németbarát párt',
  },
  {
    id: 'c10',
    name: '1. zsidó törvény',
    description: 'Bizonyos szakmákban legfeljebb 20% lehetett zsidó',
  },
  {
    id: 'c11',
    name: '2. zsidó törvény',
    description: 'Bizonyos szakmákban legfeljebb 6% lehetett zsidó',
  },
  {
    id: 'c12',
    name: '3. zsidó törvény',
    description: 'Megtiltották a zsidók és nem zsidók közötti házasságot',
  },
  {
    id: 'c13',
    name: 'Nürnbergi per',
    description: 'A háborús bűnösök felelősségre vonása',
  },
  {
    id: 'c14',
    name: '1. bécsi döntés',
    description: 'Magyarország visszakapja a Felvidéket és Kárpátalját',
  },
  {
    id: 'c15',
    name: '2. bécsi döntés',
    description: 'Magyarország visszakapja Erdélyt és Székelyföldet',
  },
]

// Shuffle helper
export function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// Generate quiz questions
export function generateQuizQuestions(count = 10) {
  const questions = []

  // Person questions: show name, pick the correct description
  for (const person of people) {
    questions.push({
      id: `q-${person.id}-desc`,
      type: 'person',
      label: person.name,
      correctAnswer: person.description,
      explanation: `${person.name} – ${person.description}.`,
      pool: people.map((p) => p.description),
    })
  }

  // Date questions: show date, pick the correct event
  for (const d of dates) {
    questions.push({
      id: `q-${d.id}-event`,
      type: 'date',
      label: d.date,
      correctAnswer: d.event,
      explanation: `${d.date} – ${d.event}.`,
      pool: dates.map((dd) => dd.event),
    })
  }

  // Concept questions: show concept name, pick the correct description
  for (const concept of concepts) {
    questions.push({
      id: `q-${concept.id}-desc`,
      type: 'concept',
      label: concept.name,
      correctAnswer: concept.description,
      explanation: `${concept.name} – ${concept.description}.`,
      pool: concepts.map((c) => c.description),
    })
  }

  // Shuffle and pick `count`
  const selected = shuffle(questions).slice(0, count)

  // Generate 4 options for each
  return selected.map((q) => {
    const wrongOptions = q.pool.filter((o) => o !== q.correctAnswer)
    const wrongPicks = shuffle(wrongOptions).slice(0, 3)
    const options = shuffle([q.correctAnswer, ...wrongPicks])
    return {
      id: q.id,
      type: q.type,
      label: q.label,
      options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    }
  })
}
