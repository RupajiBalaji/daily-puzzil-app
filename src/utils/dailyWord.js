import words from "./wordList"

export function getDailyWord() {
  const today = new Date()
  const seed =
    today.getFullYear() +
    today.getMonth() +
    today.getDate()

  const index = seed % words.length
  return words[index]
}
