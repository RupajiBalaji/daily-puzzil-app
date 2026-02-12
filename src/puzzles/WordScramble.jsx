import { useState, useEffect } from "react"
import { getDailyWord } from "../utils/dailyWord"
import { dbPromise } from "../services/db"
import { auth } from "../services/firebase"

function shuffleWord(word) {
  return word
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("")
}

function getTodayString() {
  return new Date().toISOString().split("T")[0]
}

function WordScramble() {

  const WORD = getDailyWord()
  const today = getTodayString()

  const [scrambled] = useState(shuffleWord(WORD))
  const [input, setInput] = useState("")
  const [result, setResult] = useState(null)
  const [seconds, setSeconds] = useState(0)
  const [locked, setLocked] = useState(false)
  const [score, setScore] = useState(null)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    loadHistory()
  }, [])

  useEffect(() => {
    if (locked) return

    const timer = setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [locked])

  const calculateStreak = (history) => {
    let streakCount = 0
    let currentDate = new Date()

    while (true) {
      const dateStr = currentDate.toISOString().split("T")[0]

      if (history[dateStr]) {
        streakCount++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return streakCount
  }

  const fetchFromServer = async () => {
    try {
      const user = auth.currentUser
      if (!user) return {}

      const response = await fetch(`/api/sync?userId=${user.uid}`)
      const data = await response.json()

      return data.history || {}

    } catch (error) {
      console.error("Fetch failed:", error)
      return {}
    }
  }

  const syncToServer = async (history) => {
    try {
      const user = auth.currentUser
      if (!user) return

      await fetch("/api/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user.uid,
          history
        })
      })

      console.log("Synced to server")

    } catch (error) {
      console.error("Sync failed:", error)
    }
  }

  const loadHistory = async () => {

    const db = await dbPromise
    const localHistory = await db.get("history", "puzzleHistory") || {}

    const cloudHistory = await fetchFromServer()

    // Merge local + cloud
    const mergedHistory = {
      ...localHistory,
      ...cloudHistory
    }

    await db.put("history", mergedHistory, "puzzleHistory")

    // Re-sync merged version to cloud
    syncToServer(mergedHistory)

    if (mergedHistory[today]) {
      setLocked(true)
      setScore(mergedHistory[today])
      setResult("Already Completed Today ✅")
    }

    setStreak(calculateStreak(mergedHistory))
  }

  const checkAnswer = async () => {
    if (locked) return

    if (input.toUpperCase() === WORD) {

      setResult("Correct 🎉")
      setLocked(true)

      const calculatedScore = Math.max(100 - seconds * 2, 10)
      setScore(calculatedScore)

      const db = await dbPromise
      const history = await db.get("history", "puzzleHistory") || {}

      history[today] = calculatedScore

      await db.put("history", history, "puzzleHistory")

      setStreak(calculateStreak(history))

      // Sync to cloud
      syncToServer(history)

    } else {
      setResult("Wrong ❌")
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">

      <h2 className="text-3xl font-bold tracking-widest">
        {scrambled}
      </h2>

      <p className="text-lg">Time: {seconds}s</p>

      <p className="text-lg text-orange-400">
        🔥 Streak: {streak}
      </p>

      <input
        type="text"
        value={input}
        disabled={locked}
        onChange={(e) => setInput(e.target.value)}
        className="px-4 py-2 rounded text-black"
        placeholder="Your answer"
      />

      <button
        onClick={checkAnswer}
        disabled={locked}
        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-500"
      >
        Submit
      </button>

      {result && <p className="text-xl">{result}</p>}

      {score && (
        <p className="text-2xl font-bold text-green-400">
          Score: {score}
        </p>
      )}

    </div>
  )
}

export default WordScramble
