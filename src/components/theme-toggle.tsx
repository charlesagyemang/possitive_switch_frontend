"use client"

import { Moon, Sun, Palette } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button 
        variant="outline" 
        size="icon"
        className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-xl border-pink-200/50 shadow-lg"
      >
        <Palette className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="group w-12 h-12 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-pink-200/50 dark:border-purple-500/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
    >
      {/* Gradient hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
      
      <Sun className="h-5 w-5 text-pink-500 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 relative z-10" />
      <Moon className="absolute h-5 w-5 text-purple-400 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 z-10" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
