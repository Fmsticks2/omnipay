"use client"

import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme") as "light" | "dark" | null
      const initial = stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      setTheme(initial)
      document.documentElement.classList.toggle("dark", initial === "dark")
    } catch {}
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    try {
      localStorage.setItem("theme", theme)
    } catch {}
  }, [theme])

  return (
    <button
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      aria-label="Toggle theme"
      className="fixed right-4 top-4 z-50 rounded-full border border-black/[.08] dark:border-white/[.145] bg-white/70 dark:bg-black/40 backdrop-blur px-3 py-2 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800"
    >
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  )
}