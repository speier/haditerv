import ww2 from './history/ww2.js'
import allatrendszertan from './biology/allatrendszertan.js'

// All available decks. To add a new deck:
//   1. Create src/data/decks/<subject>/<id>.js following the same shape
//   2. Import it here and add it to this array
export const decks = [
  ww2,
  allatrendszertan,
]

export function getDeckById(id) {
  return decks.find((d) => d.id === id) || null
}

// Returns decks grouped by subject, preserving insertion order
export function getDecksBySubject() {
  const map = {}
  for (const deck of decks) {
    if (!map[deck.subject]) {
      map[deck.subject] = {
        subject: deck.subject,
        label: deck.subjectLabel,
        icon: deck.subjectIcon,
        decks: [],
      }
    }
    map[deck.subject].decks.push(deck)
  }
  return Object.values(map)
}
