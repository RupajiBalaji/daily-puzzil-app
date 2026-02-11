import { signInWithPopup } from "firebase/auth"
import { auth, provider } from "../services/firebase"
import { useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider)
      navigate("/game")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">Daily Puzzle App 🧩</h1>

      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
      >
        Login with Google
      </button>
    </div>
  )
}

export default Home
