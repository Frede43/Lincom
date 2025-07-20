import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthAPI } from '@/hooks/useApiClient'
import { useUserStore } from '@/store/userStore'
import { useAppStore } from '@/store/appStore'
import { queryKeys } from '@/providers/QueryProvider'
import { useNavigate } from 'react-router-dom'

// Types
interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  role: 'student' | 'entrepreneur' | 'mentor'
  phone?: string
  institution?: string
}

// Hook principal d'authentification
export const useAuth = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setUser, setLoading, setError, logout: logoutStore } = useUserStore()
  const { addNotification } = useAppStore()
  const authAPI = useAuthAPI()

  // Mutation de connexion
  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onMutate: () => {
      setLoading(true)
      setError(null)
    },
    onSuccess: (data: any) => {
      // Stocker les tokens (adaptation pour Django)
      const tokenKey = authAPI.isDjango ? 'comlab-access-token' : 'comlab-token'
      localStorage.setItem(tokenKey, data.access)
      localStorage.setItem('comlab-refresh-token', data.refresh)

      // Mettre à jour le store
      setUser(data.user)
      setLoading(false)

      // Notification de succès
      addNotification({
        type: 'success',
        title: 'Connexion réussie !',
        message: `Bienvenue ${data.user.first_name || data.user.firstName} !`
      })

      // Redirection basée sur le rôle
      const redirectPath = getRoleBasedRedirect(data.user.role)
      navigate(redirectPath)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur de connexion'
      setError(message)
      addNotification({
        type: 'error',
        title: 'Erreur de connexion',
        message: message
      })
    }
  })

  // Mutation d'inscription
  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onMutate: () => {
      setLoading(true)
      setError(null)
    },
    onSuccess: () => {
      setLoading(false)
      addNotification({
        type: 'success',
        title: 'Inscription réussie !',
        message: 'Vérifiez votre email pour activer votre compte'
      })
      navigate('/email-verification')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur d\'inscription'
      setError(message)
      addNotification({
        type: 'error',
        title: 'Erreur d\'inscription',
        message: message
      })
    }
  })

  // Mutation de déconnexion
  const logoutMutation = useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      // Nettoyer le stockage local
      localStorage.removeItem('comlab-token')
      localStorage.removeItem('comlab-refresh-token')
      
      // Nettoyer le cache React Query
      queryClient.clear()
      
      // Mettre à jour le store
      logoutStore()
      
      // Notification
      addNotification({
        type: 'success',
        title: 'Déconnexion réussie',
        message: 'Vous avez été déconnecté avec succès'
      })
      
      // Redirection
      navigate('/login')
    },
    onError: () => {
      // Même si l'API échoue, on déconnecte localement
      localStorage.removeItem('comlab-token')
      localStorage.removeItem('comlab-refresh-token')
      logoutStore()
      navigate('/login')
    }
  })

  // Mutation mot de passe oublié
  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => authAPI.forgotPassword(email),
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Email envoyé !',
        message: 'Vérifiez votre boîte mail pour réinitialiser votre mot de passe'
      })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de l\'envoi'
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: message
      })
    }
  })

  // Mutation réinitialisation mot de passe
  const resetPasswordMutation = useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) => {
      // Adapter selon le type d'API
      if (authAPI.isDjango) {
        return (authAPI as any).resetPassword({ token, password, password_confirm: password })
      }
      return (authAPI as any).resetPassword(token, password)
    },
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Mot de passe réinitialisé !',
        message: 'Vous pouvez maintenant vous connecter'
      })
      navigate('/login')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur de réinitialisation'
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: message
      })
    }
  })

  // Mutation vérification email
  const verifyEmailMutation = useMutation({
    mutationFn: (token: string) => {
      // Adapter selon le type d'API
      if (authAPI.isDjango) {
        return (authAPI as any).verifyEmail({ token })
      }
      return (authAPI as any).verifyEmail(token)
    },
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Email vérifié !',
        message: 'Votre compte est maintenant activé'
      })
      navigate('/onboarding/welcome')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Token invalide ou expiré'
      addNotification({
        type: 'error',
        title: 'Erreur de vérification',
        message: message
      })
    }
  })

  return {
    // Mutations
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    verifyEmail: verifyEmailMutation.mutate,
    
    // États de chargement
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isSendingResetEmail: forgotPasswordMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
    isVerifyingEmail: verifyEmailMutation.isPending,
    
    // Erreurs
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  }
}

// Fonction utilitaire pour la redirection basée sur le rôle
const getRoleBasedRedirect = (role: string): string => {
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

// Hook pour vérifier l'état d'authentification
export const useAuthStatus = () => {
  
  return useQuery({
    queryKey: ['auth-status'],
    queryFn: async () => {
      const token = localStorage.getItem('comlab-token')
      if (!token) throw new Error('No token')
      
      // Vérifier la validité du token avec l'API
      // Cette requête sera interceptée par l'intercepteur axios
      return { isValid: true }
    },
    enabled: !!localStorage.getItem('comlab-token'),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook pour les actions d'authentification rapides
export const useQuickAuth = () => {
  const { user, isAuthenticated, isStudent, isEntrepreneur, isMentor, isAdmin } = useUserStore()
  
  return {
    user,
    isAuthenticated,
    isStudent: isStudent(),
    isEntrepreneur: isEntrepreneur(),
    isMentor: isMentor(),
    isAdmin: isAdmin(),
    canAccessAdminPanel: isAdmin(),
    canCreateCourse: isMentor() || isAdmin(),
    canCreateProject: isEntrepreneur() || isAdmin(),
  }
}
