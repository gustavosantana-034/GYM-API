import { useState } from 'react'
import { getErrorMessage, getErrorStatus } from '@/api/errors'
import { useLocation } from '@/features/location/location-context'
import { useCheckInHistory, useCreateCheckIn } from '@/hooks/use-check-ins'
import type { CheckInWithGym, Gym } from '@/types/api'
import { getDistanceInKm, isWithinCheckInRange } from '@/utils/distance'
import { dayjs } from '@/utils/format'

export type CheckInStep =
  | { name: 'already-today'; checkIn: CheckInWithGym }
  | { name: 'needs-location' }
  | { name: 'locating' }
  | { name: 'location-failed' }
  | { name: 'too-far'; distanceInKm: number }
  | { name: 'ready'; distanceInKm: number }
  | { name: 'submitting'; distanceInKm: number }
  | { name: 'success' }
  | { name: 'error'; message: string; distanceInKm: number }

/**
 * Derives which step of the check-in the user is in. The distance shown here
 * is only feedback: the API re-checks it and has the final word.
 */
export function useCheckInFlow(gym: Gym) {
  const location = useLocation()
  const history = useCheckInHistory()
  const createCheckIn = useCreateCheckIn(gym.id)
  const [serverError, setServerError] = useState<string | null>(null)
  const [succeeded, setSucceeded] = useState(false)

  const lastCheckIn = history.data?.pages[0]?.[0]
  const checkedInToday = lastCheckIn && dayjs(lastCheckIn.created_at).isSame(dayjs(), 'day')

  const distanceInKm = location.position ? getDistanceInKm(location.position, gym) : null

  function getStep(): CheckInStep {
    if (succeeded) return { name: 'success' }
    if (checkedInToday) return { name: 'already-today', checkIn: lastCheckIn }
    if (location.status === 'locating') return { name: 'locating' }
    if (location.status === 'idle') return { name: 'needs-location' }
    if (distanceInKm === null) return { name: 'location-failed' }
    if (createCheckIn.isPending) return { name: 'submitting', distanceInKm }
    if (serverError) return { name: 'error', message: serverError, distanceInKm }
    if (!isWithinCheckInRange(distanceInKm)) return { name: 'too-far', distanceInKm }
    return { name: 'ready', distanceInKm }
  }

  async function confirmCheckIn() {
    setServerError(null)

    // A fresh fix avoids sending a position cached minutes ago
    const position = await location.requestLocation({ fresh: true })
    if (!position || !isWithinCheckInRange(getDistanceInKm(position, gym))) return

    try {
      await createCheckIn.mutateAsync(position)
      setSucceeded(true)
    } catch (error) {
      if (getErrorStatus(error) === 409) {
        await history.refetch() // shows the "already checked in today" step
        return
      }

      setServerError(
        getErrorMessage(error, {
          422: 'O servidor indicou que você ainda está a mais de 100 m da academia. Aproxime-se e tente de novo.',
          404: 'Esta academia não está mais disponível.',
        }),
      )
    }
  }

  return {
    step: getStep(),
    distanceInKm,
    accuracy: location.accuracy,
    locationStatus: location.status,
    isCheckingHistory: history.isPending,
    refreshLocation: () => {
      setServerError(null)
      return location.requestLocation({ fresh: true })
    },
    confirmCheckIn,
  }
}
