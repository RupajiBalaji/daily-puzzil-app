import { openDB } from "idb"

export const dbPromise = openDB("dailyPuzzleDB", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("history")) {
      db.createObjectStore("history")
    }
  },
})
