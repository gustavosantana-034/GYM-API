import { useEffect, useState } from 'react'

/** Current time, refreshed on an interval (for countdowns). */
export function useNow(intervalInMs = 30_000) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalInMs)
    return () => clearInterval(id)
  }, [intervalInMs])

  return now
}
