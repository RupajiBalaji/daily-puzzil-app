import { sql } from "@vercel/postgres"

export default async function handler(req, res) {

  try {

    if (req.method === "POST") {

      const { userId, history } = req.body

      await sql`
        INSERT INTO puzzle_history (user_id, history)
        VALUES (${userId}, ${JSON.stringify(history)})
        ON CONFLICT (user_id)
        DO UPDATE SET history = ${JSON.stringify(history)}
      `

      return res.status(200).json({ message: "Synced successfully" })
    }

    if (req.method === "GET") {

      const { userId } = req.query

      const result = await sql`
        SELECT history FROM puzzle_history
        WHERE user_id = ${userId}
      `

      return res.status(200).json({
        history: result.rows[0]?.history || {}
      })
    }

    return res.status(405).json({ message: "Method not allowed" })

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
