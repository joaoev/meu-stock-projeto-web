import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/auth'

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}
