"use client"

import { useEffect } from "react"

// Registers the service worker — required for Chrome PWA installability.
// Must be a client component because service worker registration uses browser APIs.
export function PwaSetup() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.error("SW registration failed:", err)
      })
    }
  }, [])

  return null
}
