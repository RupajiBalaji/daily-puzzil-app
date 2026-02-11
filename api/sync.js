import { sql } from "@vercel/postgres"

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { userId, history } = req.body

  try {
    await sql`
      INSERT INTO puzzle_history (user_id, history)
      VALUES (${userId}, ${JSON.stringify(history)})
      ON CONFLICT (user_id)
      DO UPDATE SET history = ${JSON.stringify(history)}
    `

    res.status(200).json({ message: "Synced successfully" })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
