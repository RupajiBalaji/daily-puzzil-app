import { sql } from "@vercel/postgres"

export default async function handler(req, res) {

  try {

    // 🔹 SAVE HISTORY + UPDATE LEADERBOARD
    if (req.method === "POST") {

      const { userId, history } = req.body

      await sql`
        INSERT INTO puzzle_history (user_id, history)
        VALUES (${userId}, ${JSON.stringify(history)})
        ON CONFLICT (user_id)
        DO UPDATE SET history = ${JSON.stringify(history)}
      `

      const totalScore = Object.values(history).reduce((a, b) => a + b, 0)

      const dates = Object.keys(history).sort()
      let highestStreak = 0
      let currentStreak = 0

      for (let i = 0; i < dates.length; i++) {
        currentStreak++
        if (currentStreak > highestStreak)
          highestStreak = currentStreak
      }

      await sql`
        INSERT INTO leaderboard (user_id, total_score, highest_streak)
        VALUES (${userId}, ${totalScore}, ${highestStreak})
        ON CONFLICT (user_id)
        DO UPDATE SET
          total_score = ${totalScore},
          highest_streak = ${highestStreak},
          updated_at = NOW()
      `

      return res.status(200).json({ message: "Synced successfully" })
    }

    // 🔹 GET USER HISTORY
    if (req.method === "GET" && req.query.userId) {

      const result = await sql`
        SELECT history FROM puzzle_history
        WHERE user_id = ${req.query.userId}
      `

      return res.status(200).json({
        history: result.rows[0]?.history || {}
      })
    }

    // 🔹 GET LEADERBOARD
    if (req.method === "GET" && req.query.type === "leaderboard") {

      const result = await sql`
        SELECT user_id, total_score, highest_streak
        FROM leaderboard
        ORDER BY total_score DESC
        LIMIT 10
      `

      return res.status(200).json(result.rows)
    }

    return res.status(405).json({ message: "Method not allowed" })

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
