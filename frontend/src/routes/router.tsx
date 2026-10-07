import type { ComponentType } from 'react'
import { createBrowserRouter } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { RequireAdmin } from '@/features/auth/RequireAdmin'
import { RequireAuth, RequireGuest } from '@/features/auth/RequireAuth'
import { AuthLayout } from '@/pages/auth/AuthLayout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { HomePage } from '@/pages/home/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RouteErrorPage } from '@/pages/RouteErrorPage'

/** Loads a named export lazily, as a route component. */
function lazyPage<T extends Record<string, ComponentType>>(
  load: () => Promise<T>,
  name: keyof T,
) {
  return async () => ({ Component: (await load())[name] })
}

export const router = createBrowserRouter([
  {
    errorElement: <RouteErrorPage />,
    children: [
      {
        element: <RequireGuest />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              { path: '/login', element: <LoginPage /> },
              { path: '/register', element: <RegisterPage /> },
            ],
          },
        ],
      },
      {
        element: <RequireAuth />,
        children: [
          {
            element: <AppShell />,
            children: [
              { index: true, element: <HomePage /> },
              {
                path: '/explore',
                lazy: lazyPage(() => import('@/pages/explore/ExplorePage'), 'ExplorePage'),
              },
              {
                path: '/gyms/:gymId',
                lazy: lazyPage(() => import('@/pages/gyms/GymDetailsPage'), 'GymDetailsPage'),
              },
              {
                path: '/check-ins',
                lazy: lazyPage(() => import('@/pages/check-ins/CheckInsPage'), 'CheckInsPage'),
              },
              {
                path: '/profile',
                lazy: lazyPage(() => import('@/pages/profile/ProfilePage'), 'ProfilePage'),
              },
              {
                path: '/admin',
                element: <RequireAdmin />,
                children: [
                  {
                    lazy: lazyPage(() => import('@/pages/admin/AdminLayout'), 'AdminLayout'),
                    children: [
                      {
                        index: true,
                        lazy: lazyPage(() => import('@/pages/admin/AdminCheckInsPage'), 'AdminCheckInsPage'),
                      },
                      {
                        path: 'gyms',
                        lazy: lazyPage(() => import('@/pages/admin/AdminGymsPage'), 'AdminGymsPage'),
                      },
                      {
                        path: 'gyms/new',
                        lazy: lazyPage(() => import('@/pages/admin/GymFormPage'), 'NewGymPage'),
                      },
                      {
                        path: 'gyms/:gymId/edit',
                        lazy: lazyPage(() => import('@/pages/admin/GymFormPage'), 'EditGymPage'),
                      },
                    ],
                  },
                ],
              },
              { path: '*', element: <NotFoundPage /> },
            ],
          },
        ],
      },
    ],
  },
])
