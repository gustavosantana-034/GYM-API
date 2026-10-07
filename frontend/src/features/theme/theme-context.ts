import { createContext, useContext } from 'react'

export type ThemePreference = 'system' | 'dark' | 'light'

export interface ThemeContextValue {
  preference: ThemePreference
  setPreference: (preference: ThemePreference) => void
  resolvedTheme: 'dark' | 'light'
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used inside <ThemeProvider>')
  }

  return context
}
