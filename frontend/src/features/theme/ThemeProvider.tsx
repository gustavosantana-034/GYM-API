import { useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react'
import { ThemeContext, type ThemePreference } from './theme-context'

const STORAGE_KEY = 'pulso:theme'
const darkQuery = '(prefers-color-scheme: dark)'

function readPreference(): ThemePreference {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'dark' || stored === 'light' ? stored : 'system'
}

function subscribeToSystemTheme(callback: () => void) {
  const media = window.matchMedia(darkQuery)
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>(readPreference)

  const systemPrefersDark = useSyncExternalStore(subscribeToSystemTheme, () =>
    window.matchMedia(darkQuery).matches,
  )

  const resolvedTheme = preference === 'system' ? (systemPrefersDark ? 'dark' : 'light') : preference

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', resolvedTheme === 'dark' ? '#0b0e10' : '#f4f5f1')
  }, [resolvedTheme])

  const value = useMemo(
    () => ({
      preference,
      resolvedTheme,
      setPreference: (next: ThemePreference) => {
        localStorage.setItem(STORAGE_KEY, next)
        setPreference(next)
      },
    }),
    [preference, resolvedTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
