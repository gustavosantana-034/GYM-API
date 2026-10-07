import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MotionConfig } from 'motion/react'
import { RouterProvider } from 'react-router'
import { getErrorStatus } from '@/api/errors'
import { ToastProvider } from '@/components/ui/ToastProvider'
import { AuthProvider } from '@/features/auth/AuthProvider'
import { LocationProvider } from '@/features/location/LocationProvider'
import { ThemeProvider } from '@/features/theme/ThemeProvider'
import { router } from '@/routes/router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      // Client errors (404, 403...) will not change by retrying
      retry: (failureCount, error) => {
        const status = getErrorStatus(error)
        return (!status || status >= 500) && failureCount < 2
      },
    },
  },
})

export function App() {
  return (
    <ThemeProvider>
      {/* Respects the OS "reduce motion" setting for every animation */}
      <MotionConfig reducedMotion="user">
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <AuthProvider>
              <LocationProvider>
                <RouterProvider router={router} />
              </LocationProvider>
            </AuthProvider>
          </ToastProvider>
        </QueryClientProvider>
      </MotionConfig>
    </ThemeProvider>
  )
}
