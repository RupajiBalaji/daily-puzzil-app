import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDDru_IaqFOEEhoKrFb7wpq_ti23SqA2rU",
  authDomain: "daily-puzzle-app-1595b.firebaseapp.com",
  projectId: "daily-puzzle-app-1595b",
  storageBucket: "daily-puzzle-app-1595b.firebasestorage.app",
  messagingSenderId: "155806644497",
  appId: "1:155806644497:web:22220fdcf62c137590f4b0",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
