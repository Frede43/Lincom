import { useMemo } from 'react'
import { 
  api as mockApi, 
  authAPI as mockAuthAPI, 
  coursesAPI as mockCoursesAPI, 
  projectsAPI as mockProjectsAPI,
  equipmentAPI as mockEquipmentAPI 
} from '@/lib/api'
import { 
  djangoApi, 
  djangoAuthAPI, 
  djangoCoursesAPI, 
  djangoProjectsAPI,
  djangoEquipmentAPI,
  djangoUserAPI,
  djangoMentorshipAPI 
} from '@/lib/django-api'

// Configuration pour choisir l'API à utiliser
const USE_DJANGO_API = import.meta.env.VITE_USE_DJANGO_API === 'true'
const IS_MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true'

// Hook principal pour obtenir le bon client API
export const useApiClient = () => {
  const apiClient = useMemo(() => {
    // Si on est en mode mock, utiliser l'API mock
    if (IS_MOCK_MODE) {
      return {
        type: 'mock' as const,
        client: mockApi,
        auth: mockAuthAPI,
        courses: mockCoursesAPI,
        projects: mockProjectsAPI,
        equipment: mockEquipmentAPI,
        users: null, // Pas implémenté en mock
        mentorship: null, // Pas implémenté en mock
      }
    }

    // Si Django API est configuré, l'utiliser
    if (USE_DJANGO_API) {
      return {
        type: 'django' as const,
        client: djangoApi,
        auth: djangoAuthAPI,
        courses: djangoCoursesAPI,
        projects: djangoProjectsAPI,
        equipment: djangoEquipmentAPI,
        users: djangoUserAPI,
        mentorship: djangoMentorshipAPI,
      }
    }

    // Par défaut, utiliser l'API mock
    return {
      type: 'mock' as const,
      client: mockApi,
      auth: mockAuthAPI,
      courses: mockCoursesAPI,
      projects: mockProjectsAPI,
      equipment: mockEquipmentAPI,
      users: null,
      mentorship: null,
    }
  }, [])

  return apiClient
}

// Hook spécialisé pour l'authentification
export const useAuthAPI = () => {
  const { auth, type } = useApiClient()
  
  return {
    ...auth,
    isDjango: type === 'django',
    isMock: type === 'mock',
  }
}

// Hook spécialisé pour les cours
export const useCoursesAPI = () => {
  const { courses, type } = useApiClient()
  
  return {
    ...courses,
    isDjango: type === 'django',
    isMock: type === 'mock',
  }
}

// Hook spécialisé pour les projets
export const useProjectsAPI = () => {
  const { projects, type } = useApiClient()
  
  return {
    ...projects,
    isDjango: type === 'django',
    isMock: type === 'mock',
  }
}

// Hook spécialisé pour les équipements
export const useEquipmentAPI = () => {
  const { equipment, type } = useApiClient()
  
  return {
    ...equipment,
    isDjango: type === 'django',
    isMock: type === 'mock',
  }
}

// Hook spécialisé pour les utilisateurs (Django uniquement)
export const useUsersAPI = () => {
  const { users, type } = useApiClient()
  
  if (type !== 'django' || !users) {
    throw new Error('Users API is only available with Django backend')
  }
  
  return {
    ...users,
    isDjango: true,
    isMock: false,
  }
}

// Hook spécialisé pour le mentorat (Django uniquement)
export const useMentorshipAPI = () => {
  const { mentorship, type } = useApiClient()
  
  if (type !== 'django' || !mentorship) {
    throw new Error('Mentorship API is only available with Django backend')
  }
  
  return {
    ...mentorship,
    isDjango: true,
    isMock: false,
  }
}

// Utilitaires pour la configuration API
export const apiUtils = {
  // Vérifier si on utilise Django
  isDjangoAPI: () => USE_DJANGO_API && !IS_MOCK_MODE,
  
  // Vérifier si on est en mode mock
  isMockAPI: () => IS_MOCK_MODE,
  
  // Obtenir l'URL de base de l'API
  getBaseURL: () => {
    if (IS_MOCK_MODE) return 'mock://api'
    return import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
  },
  
  // Obtenir le type d'API actuel
  getAPIType: () => {
    if (IS_MOCK_MODE) return 'mock'
    if (USE_DJANGO_API) return 'django'
    return 'mock'
  },
  
  // Vérifier si une fonctionnalité est disponible
  isFeatureAvailable: (feature: 'users' | 'mentorship' | 'analytics') => {
    const type = apiUtils.getAPIType()
    
    switch (feature) {
      case 'users':
      case 'mentorship':
        return type === 'django'
      case 'analytics':
        return type === 'django' // Supposons que les analytics sont dans Django
      default:
        return true
    }
  },
}

// Hook pour la configuration API
export const useAPIConfig = () => {
  const { type } = useApiClient()
  
  return {
    type,
    isDjango: type === 'django',
    isMock: type === 'mock',
    baseURL: apiUtils.getBaseURL(),
    features: {
      users: apiUtils.isFeatureAvailable('users'),
      mentorship: apiUtils.isFeatureAvailable('mentorship'),
      analytics: apiUtils.isFeatureAvailable('analytics'),
    },
  }
}

// Types pour TypeScript
export type APIType = 'mock' | 'django'

export interface APIClient {
  type: APIType
  client: any
  auth: any
  courses: any
  projects: any
  equipment: any
  users: any | null
  mentorship: any | null
}

export default useApiClient
