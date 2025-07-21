import React from 'react'
import { QueryClient, QueryClientProvider, MutationCache, QueryCache } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useAppStore } from '@/store/appStore'

// Configuration du QueryClient optimisée pour Community Laboratory Burundi
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Temps de cache par défaut
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (anciennement cacheTime)
        
        // Retry configuration
        retry: (failureCount, error: any) => {
          // Ne pas retry sur les erreurs 4xx (client errors)
          if (error?.response?.status >= 400 && error?.response?.status < 500) {
            return false
          }
          // Retry max 3 fois pour les autres erreurs
          return failureCount < 3
        },
        
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        
        // Refetch configuration
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
        
        // Network mode
        networkMode: 'online',
      },
      mutations: {
        // Retry configuration pour les mutations
        retry: (failureCount, error: any) => {
          // Ne pas retry les mutations par défaut sauf pour les erreurs réseau
          if (error?.code === 'NETWORK_ERROR' || error?.response?.status >= 500) {
            return failureCount < 2
          }
          return false
        },
        
        networkMode: 'online',
      },
    },
    
    // Cache global pour les queries
    queryCache: new QueryCache({
      onError: (error: any, query) => {
        // Logger les erreurs de query
        console.error('Query Error:', {
          queryKey: query.queryKey,
          error: error.message,
          status: error?.response?.status,
        })
        
        // Ajouter une notification d'erreur pour les erreurs importantes
        if (error?.response?.status >= 500) {
          useAppStore.getState().addNotification({
            type: 'error',
            title: 'Erreur de connexion',
            message: 'Une erreur est survenue lors de la récupération des données. Veuillez réessayer.',
          })
        }
      },
      
      onSuccess: (data, query) => {
        // Logger les succès en mode debug
        if (import.meta.env.VITE_DEBUG_MODE === 'true') {
          console.log('Query Success:', {
            queryKey: query.queryKey,
            dataLength: Array.isArray(data) ? data.length : 'N/A',
          })
        }
        
        // Mettre à jour le temps de dernière synchronisation
        useAppStore.getState().updateLastSyncTime()
      },
    }),
    
    // Cache global pour les mutations
    mutationCache: new MutationCache({
      onError: (error: any, variables, context, mutation) => {
        console.error('Mutation Error:', {
          mutationKey: mutation.options.mutationKey,
          error: error.message,
          status: error?.response?.status,
        })
        
        // Notification d'erreur pour les mutations échouées
        const errorMessage = error?.response?.data?.message || error.message || 'Une erreur est survenue'
        
        useAppStore.getState().addNotification({
          type: 'error',
          title: 'Opération échouée',
          message: errorMessage,
        })
      },
      
      onSuccess: (data, variables, context, mutation) => {
        // Logger les succès de mutation
        if (import.meta.env.VITE_DEBUG_MODE === 'true') {
          console.log('Mutation Success:', {
            mutationKey: mutation.options.mutationKey,
          })
        }
        
        // Mettre à jour le temps de synchronisation
        useAppStore.getState().updateLastSyncTime()
      },
    }),
  })
}

// Instance singleton du QueryClient
let queryClient: QueryClient | undefined

const getQueryClient = () => {
  if (!queryClient) {
    queryClient = createQueryClient()
  }
  return queryClient
}

interface QueryProviderProps {
  children: React.ReactNode
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  const client = getQueryClient()
  
  return (
    <QueryClientProvider client={client}>
      {children}
      {/* DevTools uniquement en développement */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom-right"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  )
}

// Hook pour accéder au QueryClient
export const useQueryClient = () => {
  return getQueryClient()
}

// Utilitaires pour la gestion du cache
export const queryUtils = {
  // Invalider toutes les queries d'un type
  invalidateQueries: (queryKey: string[]) => {
    getQueryClient().invalidateQueries({ queryKey })
  },
  
  // Supprimer des queries du cache
  removeQueries: (queryKey: string[]) => {
    getQueryClient().removeQueries({ queryKey })
  },
  
  // Précharger des données
  prefetchQuery: async (queryKey: string[], queryFn: () => Promise<any>) => {
    await getQueryClient().prefetchQuery({
      queryKey,
      queryFn,
    })
  },
  
  // Définir des données dans le cache
  setQueryData: (queryKey: string[], data: any) => {
    getQueryClient().setQueryData(queryKey, data)
  },
  
  // Obtenir des données du cache
  getQueryData: (queryKey: string[]) => {
    return getQueryClient().getQueryData(queryKey)
  },
  
  // Vider tout le cache
  clear: () => {
    getQueryClient().clear()
  },
  
  // Refetch toutes les queries actives
  refetchQueries: () => {
    getQueryClient().refetchQueries()
  },
}

// Configuration des query keys pour la cohérence
export const queryKeys = {
  // Authentification
  auth: ['auth'] as const,
  authStatus: ['auth', 'status'] as const,
  
  // Utilisateurs
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  userProfile: (id: string) => ['users', id, 'profile'] as const,
  
  // Cours
  courses: ['courses'] as const,
  course: (id: string) => ['courses', id] as const,
  courseProgress: (id: string) => ['courses', id, 'progress'] as const,
  userCourses: (userId: string) => ['users', userId, 'courses'] as const,
  
  // Projets
  projects: ['projects'] as const,
  project: (id: string) => ['projects', id] as const,
  userProjects: (userId: string) => ['users', userId, 'projects'] as const,
  
  // Équipements
  equipment: ['equipment'] as const,
  equipmentItem: (id: string) => ['equipment', id] as const,
  equipmentReservations: ['equipment', 'reservations'] as const,
  userReservations: (userId: string) => ['users', userId, 'reservations'] as const,
  
  // Mentorat
  mentorship: ['mentorship'] as const,
  mentorshipSessions: (userId: string) => ['mentorship', userId, 'sessions'] as const,
  mentorshipRequests: (userId: string) => ['mentorship', userId, 'requests'] as const,
  
  // Forum
  forum: ['forum'] as const,
  forumPosts: ['forum', 'posts'] as const,
  forumPost: (id: string) => ['forum', 'posts', id] as const,
  
  // Dashboard
  dashboard: ['dashboard'] as const,
  dashboardStats: (role: string) => ['dashboard', role, 'stats'] as const,
  
  // Notifications
  notifications: ['notifications'] as const,
  
  // Recherche
  search: (query: string) => ['search', query] as const,
} as const

export default QueryProvider
