/**
 * Holds the access token in memory only. It never touches localStorage, so
 * an XSS payload cannot read a long-lived credential; the refresh token sits
 * in an httpOnly cookie the browser manages.
 */
let accessToken: string | null = null

export const tokenStore = {
  get: () => accessToken,
  set: (token: string | null) => {
    accessToken = token
  },
}

const SESSION_HINT_KEY = 'pulso:has-session'

/**
 * A non-sensitive flag telling whether a refresh cookie probably exists, so
 * anonymous visitors do not fire a refresh request that can only fail.
 */
export const sessionHint = {
  exists: () => {
    try {
      return localStorage.getItem(SESSION_HINT_KEY) === '1'
    } catch {
      return true // storage blocked: just try the refresh
    }
  },
  set: (value: boolean) => {
    try {
      if (value) localStorage.setItem(SESSION_HINT_KEY, '1')
      else localStorage.removeItem(SESSION_HINT_KEY)
    } catch {
      // Storage unavailable (private mode): the hint is only an optimization
    }
  },
}
