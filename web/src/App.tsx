import { HomePage } from './components/home-page'
import { LoginPage } from './components/login-page'
import { ProfilePage } from './components/profile-page'
import { SignUpPage } from './components/sign-up-page'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Products } from './components/products'
import { Sales } from './components/sales'
import { AuthProvider } from './contexts/auth'
import { ProtectedRoute } from './utils/protected-route'

export function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <LoginPage />,
    },
    {
      path: '/home',
      element: (
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/profile',
      element: (
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/sign-up',
      element: <SignUpPage />,
    },
    {
      path: '/products',
      element: (
        <ProtectedRoute>
          <Products />
        </ProtectedRoute>
      ),
    },
    {
      path: '/sales',
      element: (
        <ProtectedRoute>
          <Sales />
        </ProtectedRoute>
      ),
    },
  ])

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
