import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'
import { useConditionalNavigation } from './ProtectedRoute'

interface PublicRouteProps {
  children: React.ReactNode
  redirectIfAuthenticated?: boolean
}

export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectIfAuthenticated = true
}) => {
  const { isAuthenticated, isLoading } = useUserStore()
  const { getDefaultRoute } = useConditionalNavigation()

  // Attendre que la vérification de l'authentification soit terminée
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  // Si l'utilisateur est authentifié et qu'on doit rediriger
  if (isAuthenticated && redirectIfAuthenticated) {
    const defaultRoute = getDefaultRoute()
    return <Navigate to={defaultRoute} replace />
  }

  return <>{children}</>
}

export default PublicRoute
