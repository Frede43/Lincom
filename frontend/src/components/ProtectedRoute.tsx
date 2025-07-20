import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'student' | 'entrepreneur' | 'mentor' | 'admin'
  fallbackPath?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallbackPath = '/login'
}) => {
  const { user, isAuthenticated, isLoading } = useUserStore()
  const location = useLocation()

  // Afficher un loader pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Vérification de l'authentification...</p>
        </div>
      </div>
    )
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated || !user) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location.pathname }} 
        replace 
      />
    )
  }

  // Vérifier le rôle requis si spécifié
  if (requiredRole && user.role !== requiredRole) {
    // Rediriger vers le dashboard approprié selon le rôle
    const roleBasedPath = getRoleBasedPath(user.role)
    return <Navigate to={roleBasedPath} replace />
  }

  // Vérifier si l'utilisateur a terminé l'onboarding
  if (!user.isEmailVerified) {
    return <Navigate to="/email-verification" replace />
  }

  // Si l'utilisateur n'a pas de rôle défini, rediriger vers la sélection de rôle
  if (!user.role) {
    return <Navigate to="/onboarding/role" replace />
  }

  // Si le profil n'est pas complet, rediriger vers la configuration
  if (!isProfileComplete(user)) {
    return <Navigate to="/onboarding/profile" replace />
  }

  return <>{children}</>
}

// Composant pour les routes qui nécessitent des permissions spécifiques
interface RoleBasedRouteProps {
  children: React.ReactNode
  allowedRoles: Array<'student' | 'entrepreneur' | 'mentor' | 'admin'>
  fallbackPath?: string
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
  fallbackPath
}) => {
  const { user } = useUserStore()

  if (!user || !allowedRoles.includes(user.role)) {
    const defaultFallback = getRoleBasedPath(user?.role || 'student')
    return <Navigate to={fallbackPath || defaultFallback} replace />
  }

  return <>{children}</>
}

// Composant pour les routes d'administration
interface AdminRouteProps {
  children: React.ReactNode
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  return (
    <RoleBasedRoute allowedRoles={['admin']}>
      {children}
    </RoleBasedRoute>
  )
}

// Composant pour les routes de mentorat
interface MentorRouteProps {
  children: React.ReactNode
}

export const MentorRoute: React.FC<MentorRouteProps> = ({ children }) => {
  return (
    <RoleBasedRoute allowedRoles={['mentor', 'admin']}>
      {children}
    </RoleBasedRoute>
  )
}

// Utilitaires
function getRoleBasedPath(role: string): string {
  switch (role) {
    case 'student':
      return '/dashboard/student'
    case 'entrepreneur':
      return '/dashboard/entrepreneur'
    case 'mentor':
      return '/dashboard/mentor'
    case 'admin':
      return '/dashboard/admin'
    default:
      return '/dashboard'
  }
}

function isProfileComplete(user: any): boolean {
  // Vérifier si les informations essentielles du profil sont complètes
  return !!(
    user.firstName &&
    user.lastName &&
    user.email &&
    user.role &&
    user.profile?.skills?.length > 0 &&
    user.profile?.interests?.length > 0
  )
}

// Hook pour vérifier les permissions
export const usePermissions = () => {
  const { user } = useUserStore()

  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false
    
    if (Array.isArray(role)) {
      return role.includes(user.role)
    }
    
    return user.role === role
  }

  const canAccessAdminPanel = (): boolean => {
    return hasRole('admin')
  }

  const canCreateCourse = (): boolean => {
    return hasRole(['mentor', 'admin'])
  }

  const canCreateProject = (): boolean => {
    return hasRole(['entrepreneur', 'mentor', 'admin'])
  }

  const canManageUsers = (): boolean => {
    return hasRole('admin')
  }

  const canModerateContent = (): boolean => {
    return hasRole(['mentor', 'admin'])
  }

  const canAccessAnalytics = (): boolean => {
    return hasRole(['mentor', 'admin'])
  }

  const canManageEquipment = (): boolean => {
    return hasRole(['mentor', 'admin'])
  }

  return {
    user,
    hasRole,
    canAccessAdminPanel,
    canCreateCourse,
    canCreateProject,
    canManageUsers,
    canModerateContent,
    canAccessAnalytics,
    canManageEquipment,
  }
}

// Hook pour la navigation conditionnelle
export const useConditionalNavigation = () => {
  const { user, isAuthenticated } = useUserStore()

  const getDefaultRoute = (): string => {
    if (!isAuthenticated || !user) {
      return '/'
    }

    if (!user.isEmailVerified) {
      return '/email-verification'
    }

    if (!user.role) {
      return '/onboarding/role'
    }

    if (!isProfileComplete(user)) {
      return '/onboarding/profile'
    }

    return getRoleBasedPath(user.role)
  }

  const shouldRedirectToOnboarding = (): boolean => {
    return !!(
      isAuthenticated && 
      user && 
      user.isEmailVerified && 
      (!user.role || !isProfileComplete(user))
    )
  }

  return {
    getDefaultRoute,
    shouldRedirectToOnboarding,
    getRoleBasedPath: (role: string) => getRoleBasedPath(role),
  }
}

export default ProtectedRoute
