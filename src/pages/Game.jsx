import { signOut } from "firebase/auth"
import { auth } from "../services/firebase"
import WordScramble from "../puzzles/WordScramble"
import Heatmap from "../components/Heatmap"
import Leaderboard from "../components/Leaderboard"

function Game() {

  const handleLogout = async () => {
    await signOut(auth)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">

      <h1 className="text-4xl font-bold mb-8">
        Daily Puzzle 🎮
      </h1>

      <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
        <WordScramble />
      </div>

      <Heatmap />

      <Leaderboard />

      <button
        onClick={handleLogout}
        className="mt-10 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition"
      >
        Logout
      </button>

    </div>
  )
}

export default Game
