import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./services/firebase"
import { useEffect, useState } from "react"

import Home from "./pages/Home"
import Game from "./pages/Game"

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) return <div className="text-white bg-gray-900 min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/game" /> : <Home />} />
        <Route path="/game" element={user ? <Game /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
