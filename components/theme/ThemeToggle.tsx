'use client'

import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, setTheme, resolvedDark } = useTheme()

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedDark ? 'light' : 'dark')}
      className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
      aria-label={resolvedDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {resolvedDark ? (
        <Sun className="size-5" aria-hidden />
      ) : (
        <Moon className="size-5" aria-hidden />
      )}
    </button>
  )
}
