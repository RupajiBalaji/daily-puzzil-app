import { useEffect, useState } from "react"

function Leaderboard() {

  const [data, setData] = useState([])

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/sync?type=leaderboard")
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error("Leaderboard fetch failed:", error)
    }
  }

  return (
    <div className="mt-10 w-full max-w-md">

      <h2 className="text-2xl font-bold mb-4 text-center">
        🏆 Global Leaderboard
      </h2>

      <div className="bg-gray-800 rounded-lg p-4 space-y-2">

        {data.length === 0 && (
          <p className="text-center text-gray-400">No players yet</p>
        )}

        {data.map((user, index) => (
          <div
            key={user.user_id}
            className="flex justify-between items-center border-b border-gray-700 pb-2"
          >
            <span>#{index + 1}</span>
            <span className="text-sm">
              {user.user_id.slice(0, 6)}...
            </span>
            <span className="text-green-400">
              {user.total_score}
            </span>
          </div>
        ))}

      </div>
    </div>
  )
}

export default Leaderboard
